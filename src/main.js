import axios from 'axios' //ajax套件
import VueAxios from 'vue-axios';
import 'bootstrap';
import router from './router';
import Vue from 'vue'
import App from './App'



Vue.config.productionTip = false
Vue.use(VueAxios, axios)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
});

router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth){
    const api=`${process.env.APIPATH}/api/user/check`;
    axios.post(api).then((response)=>{
      if(response.data.success){
        next();
      }else{
        next({
          path:'/login',
        });
      }
    });
  }else{
    next();
  }
})
