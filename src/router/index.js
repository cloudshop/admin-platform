// 导入组件
import Vue from 'vue'
import Router from 'vue-router'

import * as types from '../store/types'
import store from '../store/store'
import storePlugin from '../storePlugin'

// 登录
const login         = r => require.ensure([], () => r(require('@/components/Login/Login')), 'login');
// 注册
// const register      = r => require.ensure([], () => r(require('@/page/register')), 'register');
// 首页
const index         = r => require.ensure([], () => r(require('@/page/index')), 'index');
// 商家首页
const extract    = r => require.ensure([], () => r(require('@/page/extract')), 'extract');
// 商品列表
const authentication = r => require.ensure([], () => r(require('@/page/authentication')), ' authentication');
// 添加商品
// const goodsAddNew   = r => require.ensure([], () => r(require('@/page/goodsAddNew')), 'goodsAddNew');
// 全部订单
// const allOrder   = r => require.ensure([], () => r(require('@/page/allOrder')), 'allOrder');
//发货页面
// const sendGoods   = r => require.ensure([], () => r(require('@/page/sendGoods')), 'sendGoods');


// 启用路由
Vue.use(Router);

// 导出路由 
const router = new Router({
    routes: [{
        path: '/',
        name: '',
        component: login,
        hidden: true
    },
    {
        path: '/login',
        name: '登录',
        component: login,
        hidden: true
    },
    {
        path: '/index',
        name: '财务审核',
        component: index,
        meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
        redirect:'extract', 
        children: [{
            path: '/extract',
            name: '提现审核',
            component: extract,
            meta: {
                requireAuth: true, 
            }
        },
        {
            path: '/authentication',
            name: '认证审核',
            component: authentication,
            meta: {
                requireAuth: true, 
            }
        }]
    }  
 
    ]
})
// 页面刷新的时候重新赋值路由
if (window.localStorage.getItem('token')) {
    var token= JSON.parse(window.localStorage.getItem('token'))
    store.commit(types.LOGIN, token)
}

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        if (window.sessionStorage.getItem('name') !== null) {
            next();
        }
        else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }
    else {
        next();
    }
})

 export default router