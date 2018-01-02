import Vue from 'vue';
import Router from 'vue-router';
import VueResource from 'vue-resource';
// import HelloWorld from '@/components/HelloWorld'
import App from '../App';
import goods from '../components/goods/goods';
import ratings from '../components/ratings/ratings';
import seller from '../components/seller/seller';
// import './common/stylus/test.styl'
Vue.use(Router);
Vue.use(VueResource);

// 配置所有路由
const routes = [{
        path: '/',
        redirect: '/goods'
    },
    {
        path: '/goods',
        name: 'goods',
        component: goods
    },
    {
        path: '/ratings',
        name: 'ratings',
        component: ratings
    },
    {
        path: '/seller',
        name: 'seller',
        component: seller
    }
];
export default new Router({
    linkActiveClass: 'active',
    routes
});