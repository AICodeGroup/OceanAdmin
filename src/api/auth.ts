import request from '@/utils/request'

// 登录接口
export function login(data: { username: string; password: string; captcha: string }) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/auth/info',
    method: 'get'
  })
}

// 登出
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCaptcha() {
  return request({
    url: '/auth/captcha',
    method: 'get'
  })
}