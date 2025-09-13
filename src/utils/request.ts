import axios, { type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

// 为后端的通用返回结构定义接口
export interface CommonResult<T = any> {
  code: number
  message: string
  data: T
}

// 创建 axios 实例
const service = axios.create({
  // 重要：请将 baseURL 修改为您的后端 API 地址，或在 vite.config.js 中配置代理（推荐）
  // 例如: server: { proxy: { '/api': 'http://localhost:8080' } }
  baseURL: 'http://47.112.106.127:8080/api', // 直接使用远程服务器地址
  timeout: 10000, // 请求超时
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 这里可以添加发送请求前的逻辑，例如添加 token
    // const token = localStorage.getItem('token')
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res: CommonResult = response.data

    // 如果自定义 code 不是 200，则视为错误
    if (res.code !== 200) {
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000,
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      // 直接返回响应中的 data 部分
      return res.data
    }
  },
  (error) => {
    console.error('Response Error:', error)
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  }
)

export default service