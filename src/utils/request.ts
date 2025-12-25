import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from './auth'

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
  // baseURL: 'http://47.112.106.127:8080/api', // 直接使用远程服务器地址
   baseURL: '/',
  timeout: 10000, // 请求超时
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 添加 token 到 Authorization header
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  async (response) => {
    // 如果是 blob 响应（文件下载）
    if (response.config.responseType === 'blob') {
      // 检查响应是否是 JSON 错误信息（后端可能返回错误时返回 JSON）
      const contentType = response.headers['content-type'] || ''
      if (contentType.includes('application/json')) {
        // 尝试解析 JSON 错误信息
        try {
          const text = await response.data.text()
          const json = JSON.parse(text)
          if (json.code !== 200) {
            ElMessage({
              message: json.message || '导出失败',
              type: 'error',
              duration: 5 * 1000,
            })
            return Promise.reject(new Error(json.message || '导出失败'))
          }
        } catch (e) {
          // 解析失败，继续返回 blob
        }
      }
      // 返回 blob 数据
      return response.data
    }
    
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