import Vue from 'vue'
import axios from 'axios'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// request拦截器
service.interceptors.request.use(config => {
  config.headers['token'] = Vue.cookie.get('token')
  // config.headers['token'] = 'e0e4d47bfe25e39a8844d2198bbce341'
  return config
}, error => {
  return Promise.reject(error)
})

// response拦截器
service.interceptors.response.use(response => {
  if (response.data && response.data.code === 1) { // 后端报错
    if (response.data.data === 401) {
      Vue.cookie.delete('token')
      router.push({ name: 'login' })
    }
    return Promise.reject(response.data)
  }
  return response
}, error => {
  return Promise.reject(error)
})

export default service
