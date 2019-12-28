import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Mbx from './components/views/Mbx.vue'
import ElementUI, {
  Message
} from 'element-ui'
import axios from 'axios'
import './assets/fonts/iconfont.css'
// 样式文件一定要引入
import 'element-ui/lib/theme-chalk/index.css'
//  引入全局css
import './assets/css/global.css'
//  请求拦截器  在请求到达服务器之前 会先调用这个
axios.interceptors.request.use(config => {
  //  为请求头 添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.component('Mbx', Mbx)

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
