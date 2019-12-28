import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI, { Message } from 'element-ui'
import axios from 'axios'
import './assets/fonts/iconfont.css'
// 样式文件一定要引入
import 'element-ui/lib/theme-chalk/index.css'
//  引入全局css
import './assets/css/global.css'

//  接口基准地址
axios.defaults.baseURL = `http://127.0.0.1:8888/api/private/v1/`
//  挂载axios
Vue.prototype.$http = axios
//  全局挂载弹框提示
Vue.prototype.$message = Message

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
