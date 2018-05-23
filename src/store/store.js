/**
 * Created by superman on 17/2/16.
 */
import Vuex from 'vuex'
import Vue from 'vue'
import * as types from './types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    recommend: '',
    authCode: '',
    user: {},
    token: null,
    userphone: '',
    password: ''
  },
  mutations: {
    [types.LOGIN]: (state, data) => {
      state.token = data;
      // console.log(state);
      localStorage.setItem('token', JSON.stringify(data));
      // console.log("11");
    },
    logout:(state)=>{
      state.token = null
      state.userphone = null
      state.password = null
      localStorage.removeItem('token');
    },
    [types.LOGOUT]: (state) => {
      state.token = null
      state.userphone = null
      state.password = null
      localStorage.removeItem('token');
    },
    [types.VERIFY_CODE]: (state, data) => {
      state.authCode = data;
    },
    [types.INVITOR]: (state, data) => {
      state.recommend = data;
    },
    [types.USERPHONE]: (state, data) => {
      state.userphone = data;
    },
    [types.PASSWORD]: (state, data) => {
      state.password = data;
    }
  },

  getters: {
    isAuthed: (state) => {
      let tokenPersist = localStorage.getItem('token');
      if (tokenPersist !== null) {
        let token = JSON.parse(tokenPersist);
        // console.log("token", token)
        // console.log("state", state.token)
        if (token !== null && state.token === null) {
          state.token = token;
        }
      }

      if (state.token !== null && typeof state.token.access_token !== "undefined") {
        return true;
      }
      return false;
    },

    token: (state) => {
      let tokenPersist = localStorage.getItem('token');
      if (tokenPersist !== null) {
        let token = JSON.parse(tokenPersist);
        // console.log("token", token)
        // console.log("state", state.token)
        if (token !== null && state.token === null) {
          state.token = token;
        }
      }

      return state.token;
    },

    bearToken: (state) => {
      let tokenPersist = localStorage.getItem('token');
      if (tokenPersist !== null) {
        let token = JSON.parse(tokenPersist);
        // console.log("token", token)
        // console.log("state", state.token)
        if (token !== null && state.token === null) {
          state.token = token;
        }
      }

      if (state.token !== null && typeof state.token.access_token !== "undefined") {
        return 'Bearer '.concat(state.token.access_token);
      }
      return null
    },

    recommend: (state) => {
      return state.recommend
    },
    authCode: (state) => {
      return state.authCode
    },
    iphone: (state) => {
      return state.userphone
    },
    password: (state) => {
      return state.password
    },
  },
  actions: {
    login: function (context, userInput) {
      const credentials = {
        client: {
          id: 'web_app',
          secret: 'w1eb_app'
        },
        auth: {
          tokenHost: window.location.origin,
          // tokenPath: 'http://app.grjf365.com:9080/auth/login',
          tokenPath: 'api/auth/login',
          revokePath: 'api/auth/logout'
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

      const oauth2 = require('simple-oauth2').create(credentials)

      // Get the access token object.
      const tokenConfig = {
        username: userInput.username,
        password: userInput.password,
        registrationID: userInput.registrationID
      }

      oauth2.ownerPassword.getToken(tokenConfig, (error, result) => {
        if (error) {
          // console.log(error);
          if (error.context.status === 500) {
            alert('服务器繁忙，请耐心等待')
            return false
          }
          if (error.context.status === 400) {
            alert('用户名密码错误')
            return false
          }
          return console.log('Access Token Error', error.message);
          return false
        }

        const accessToken = oauth2.accessToken.create(result)
        // console.log('Access Token 2', accessToken);
        // store the token in global variable ??
        context.commit(types.LOGIN, result);
        context.commit(types.USERPHONE, userInput.username);
        context.commit(types.PASSWORD, userInput.password);
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
    },

    logout: function (context) {
      const credentials = {
        client: {
          id: 'web_app',
          secret: 'w1eb_app'
        },
        auth: {
          tokenHost: window.location.origin,
          // tokenPath: 'http://app.grjf365.com:9080/auth/logout',
          tokenPath: 'api/auth/logout',
          revokePath: 'api/auth/logout'
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

      const oauth2 = require('simple-oauth2').create(credentials)
      const accessToken = oauth2.accessToken.create(context.getters.token)
      // Promises
      // Revoke only the access token
      accessToken.revoke('access_token')
        .then(() => {
          // Revoke the refresh token
          return accessToken.revoke('refresh_token');
        })
        .then(() => {
          console.log('Token revoked');
        })
        .catch((error) => {
          console.log('Error revoking token.', error.message);
        });

      context.commit(types.LOGOUT);
    }
  }
})
