import axios from 'axios'
// import { useUserStore } from '../stores/user'
// import router from '@/router'
// import { Elmessage } from 'element-plus'

const baseURL = 'http://localhost:3000'

const instance = axios.create({
  baseURL,
  timeout: 5000
})
//请求拦截器
instance.interceptors.request.use(
  (config) => {
    return config
  },
  (e) => {
    return Promise.reject(e)
  }
)

//响应拦截器
instance.interceptors.response.use(
  (res) => {
    return res.data
  },
  (e) => {
    return Promise.reject(e)
  }
)

export default instance
