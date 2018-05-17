/**
 * Created by superman on 17/2/16.
 * http配置
 */

import axios from 'axios'
import * as types from '../store/types'
import store from '../store/store'
import router from '../router'
import storePlugin from '../storePlugin'

// axios 配置
axios.defaults.timeout = 5000;
// axios.defaults.baseURL = 'api';
axios.defaults.baseURL='http://app.grjf365.com/api/';

/*是否有请求正在刷新token*/
window.isRefreshing = false
/*被挂起的请求数组*/
let refreshSubscribers = []

/*push所有请求到数组中*/
function subscribeTokenRefresh(cb) {
    refreshSubscribers.push(cb)
}

/*刷新请求（refreshSubscribers数组中的请求得到新的token之后会自执行，用新的token去请求数据）*/
function onRrefreshed(token) {
    refreshSubscribers.map(cb => cb(token))
}

const credentials = {
    client: {
        id: 'web_app',
        secret: 'w1eb_app'
    },
    auth: {
        tokenHost: window.location.origin,
        tokenPath: 'api/auth/login/shop'
    },
    http: {
        headers: {
            Accept: 'application/json'
        }
    },
    options: {
        bodyFormat: 'json'
    }
}

const oauth2 = require('simple-oauth2').create(credentials);
const addSeconds = require('date-fns/add_seconds');

function login(userInput) {

    // Get the access token object.
    const tokenConfig = {
        username: userInput.username,
        password: userInput.password,
        registrationID: userInput.registrationID
    }

    oauth2.ownerPassword.getToken(tokenConfig, (error, result) => {
        if (error) {
            console.log('Access Token Error', error.message);

            if (error.response.status === 500) {
                alert('服务器繁忙，请耐心等待')
            }
            if (error.response.status === 400) {
                alert('用户名密码错误')
            }
            return console.log('Access Token Error', error.message);
        }

        const accessToken = oauth2.accessToken.create(result)
        console.log('Access Token 2', accessToken);
        // store the token in global variable ??
        store.commit(types.LOGIN, result);
        var val = {
            "func": "closeCurrent",
            "param": {
                'finallyIndex': '1',
                'refreshAll': true
            },
        };
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
        if (isiOS) {
            window.webkit.messageHandlers.GongrongAppModel.postMessage(val);
        } else if (isAndroid) {
            window.androidObject.JSCallAndroid(JSON.stringify(val));
        }
    });
}

function logout() {
    // this.$axios.post("auth/logout/app")
    // .then(function(res){
    //     delCookie('login',1)
    // })
    // .catch(function(error){
    //     alert(error)
    // })

    // Callbacks
    // Revoke only the access token
    token.revoke('access_token', (error) => {
        // Session ended. But the refresh_token is still valid.
        // Revoke the refresh_token
        token.revoke('refresh_token', (error) => {
            console.log('token revoked.');
        });
    });

    // Promises
    // Revoke only the access token
    token.revoke('access_token')
        .then(() => {
            // Revoke the refresh token
            return token.revoke('refresh_token');
        })
        .then(() => {
            console.log('Token revoked');
        })
        .catch((error) => {
            console.log('Error revoking token.', error.message);
        });

    store.commit(types.LOGOUT);
}

function shouldRefresh(accessToken) {
    // Provide a window of time before the actual expiration to refresh the token
    const EXPIRATION_WINDOW_IN_SECONDS = 150;

    const { token } = accessToken;
    const expirationTimeInSeconds = token.expires_at.getTime() / 1000;
    const expirationWindowStart = expirationTimeInSeconds - EXPIRATION_WINDOW_IN_SECONDS;

    // If the start of the window has passed, refresh the token
    const nowInSeconds = (new Date()).getTime() / 1000;
    const shouldRefreshToken = nowInSeconds >= expirationWindowStart;

    // accessToken.expires_at = addSeconds(
    //     new Date(),
    //     Number.parseInt(accessToken.expires_in, 5)
    // );

    // store.commit(types.LOGIN, accessToken);
    return shouldRefreshToken;
}

function bearToken(token) {
    console.log(token)
    if (token !== null && typeof token.access_token !== "undefined") {
        return 'Bearer '.concat(token.access_token);
    }
    return null
}

// http request 拦截器
axios.interceptors.request.use(
    config => {
        /*判断是否已登录*/
        if (store.getters.bearToken !== null) {
            /*在请求头中添加token类型、token*/
            config.headers.Authorization = store.getters.bearToken

            /*判断刷新token请求的refresh_token是否过期*/
            // Create the access token wrapper
            let accessToken = oauth2.accessToken.create(store.state.token);
            // let accessToken = store.state.token;

            // Check if the token is expired. If expired it is refreshed.
            if (accessToken.expired()) {
                store.commit(types.LOGOUT);
                alert('token过期，请重新登录')
                window.location.href = '#/Login'
                return
            }

            /*判断token是否将要过期*/
            if (shouldRefresh(accessToken)) {
                /*判断是否正在刷新*/
                if (!window.isRefreshing) {
                    /*将刷新token的标志置为true*/
                    window.isRefreshing = true
                    /*发起刷新token的请求*/

                    accessToken.refresh({ username: store.getters.iphone, password: store.getters.password }, (error, result) => {
                        const accessToken = oauth2.accessToken.create(result.token)
                        // store the token in global variable ??
                        store.commit(types.LOGIN, result.token);

                        /*将标志置为false*/
                        window.isRefreshing = false
                        /*成功刷新token*/
                        config.headers.Authorization = store.getters.bearToken
                        /*执行数组里的函数,重新发起被挂起的请求*/
                        onRrefreshed(accessToken)
                        /*执行onRefreshed函数后清空数组中保存的请求*/
                        refreshSubscribers = []
                    }).catch(err => {
                        alert(err.response.data.message)
                        /*清除本地保存的auth*/
                        store.commit(types.LOGOUT);
                        window.location.href = '#/Login'
                    })
                }
                /*把请求(token)=>{....}都push到一个数组中*/
                let retry = new Promise((resolve, reject) => {
                    /*(token) => {...}这个函数就是回调函数*/
                    subscribeTokenRefresh((token) => {
                        config.headers.Authorization = store.getters.bearToken
                        /*将请求挂起*/
                        resolve(config)
                    })
                })
                return retry
            }

        }
        return config
    },
    err => {
        console.log("add error")
        return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 401 清除token信息并跳转到登录页面
                    store.commit(types.LOGOUT);
                    router.replace({
                        path: 'login',
                        query: {redirect: router.currentRoute.fullPath}
                    })
            }
        }
        console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
        return Promise.reject(error);
    });

export default axios;
