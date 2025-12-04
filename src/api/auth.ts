import request from '@/utils/request'

// 登录返回数据类型
export interface LoginResponse {
  account: string
  realName: string
  isSms: boolean
  leftTopLogo: string
  leftSquareLogo: string
  merSiteUrl: string | null
  token: string
}

// 登录接口
export function login(data: { account: string; pwd: string }): Promise<LoginResponse> {
  return request({
    url: '/admin/platform/login',
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