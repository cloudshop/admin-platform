/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * 
 */
let baseUrl = '';
let routerMode = 'history';
let baseImgPath = 'http://localhost:8080/img/';

if (process.env.NODE_ENV == 'development') {
    //baseUrl = 'http://localhost:8080';
} else {
    baseUrl = 'http://localhost:8080';
}

export {
    baseUrl,
    routerMode,
    baseImgPath
}