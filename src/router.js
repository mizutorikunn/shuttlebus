import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home.vue'


Vue.use(Router)

export default new Router({
  // mode: 'history',  部署在IIS里，要关掉。不然会空白页
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }
  ]
})
