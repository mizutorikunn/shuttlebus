import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

//导入mint-ui框架

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')