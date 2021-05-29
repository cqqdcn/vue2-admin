/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 全局样式表
import './assets/reset.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 商品分类表单
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// https://www.liulongbin.top:8888/api/private/v1/

// 请求拦截
// 请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config => {
  // console.log(config)
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = sessionStorage.getItem('Token')
  // 在最后必须 return config
  return config
})
// response 拦截器中,  隐藏进度条NProgress.done()
axios.interceptors.response.use(config => {
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)

// 将富文本编辑器注册为全局可用
Vue.use(VueQuillEditor, /* { default global options } */)

// 注册时间过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal * 1000)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
