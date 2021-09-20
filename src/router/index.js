import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/pages/Login';
import Dashboard from '@/components/Dashboard';
import Products from '@/components/pages/Products';
import Orders from '@/components/CustomerOrders';
import Checkout from '@/components/pages/CustomerCheckOut';
import BackOrder from '@/components/pages/BackOrder';
import Cupon from '@/components/pages/Cupon';
Vue.use(Router);
export default new Router({
    routes:[
        { //避免用戶進到不存在的頁面
            path:'*',
            redirect:'/login',
        },
        {
            path:'/login',
            name:'Login',
            component:Login,
        },
        {
            path:'/admin',
            name:'Dashboard',
            component:Dashboard,
            children:[
                {
                    path:'products',
                    name:'Products',
                    component:Products,
                    meta: { requiresAuth: true },
                },
                {
                    path:'backorder',
                    name:'BackOrder',
                    component:BackOrder,
                    meta: { requiresAuth: true },
                },
                {
                    path:'cupon',
                    name:'Cupon',
                    component:Cupon,
                    meta: { requiresAuth: true },
                }
            ]
        },
        {
            path:'/',
            name:'Dashboard',
            component:Dashboard,
            children:[
                {
                    path:'customerorders',
                    name:'Orders',
                    component:Orders,
                },
                {
                    path:'customercheckout/:orderId',
                    name:'checkout',
                    component:Checkout,
                },
            ]
        }
    ]
});