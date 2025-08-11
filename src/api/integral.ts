import request from '@/utils/request'

// 积分接口类型定义
export interface IntegralRule {
  id: number
  name: string
  code: string
  description: string
  points: number
  dailyLimit: number
  totalLimit: number
  status: number
  createTime: string
  updateTime: string
}

export interface IntegralTask {
  id: number
  name: string
  description: string
  type: string
  points: number
  dailyLimit: number
  conditions: any
  status: number
  sort: number
  createTime: string
}

export interface IntegralProduct {
  id: number
  name: string
  description: string
  image: string
  points: number
  stock: number
  exchangeCount: number
  category: string
  status: number
  sort: number
  createTime: string
}

export interface IntegralRecord {
  id: number
  userId: number
  username: string
  type: string
  points: number
  source: string
  description: string
  balanceBefore: number
  balanceAfter: number
  ip: string
  createTime: string
}

export interface IntegralExchange {
  id: number
  userId: number
  username: string
  productId: number
  productName: string
  points: number
  quantity: number
  status: number
  address: string
  phone: string
  remark: string
  createTime: string
  auditTime: string
}

// 获取积分规则列表
export const getIntegralRuleList = (params?: any) => {
  return request({
    url: '/api/integral-rules',
    method: 'get',
    params
  })
}

// 创建积分规则
export const createIntegralRule = (data: Partial<IntegralRule>) => {
  return request({
    url: '/api/integral-rules',
    method: 'post',
    data
  })
}

// 更新积分规则
export const updateIntegralRule = (id: number, data: Partial<IntegralRule>) => {
  return request({
    url: `/api/integral-rules/${id}`,
    method: 'put',
    data
  })
}

// 删除积分规则
export const deleteIntegralRule = (id: number) => {
  return request({
    url: `/api/integral-rules/${id}`,
    method: 'delete'
  })
}

// 更新积分规则状态
export const updateIntegralRuleStatus = (id: number, status: number) => {
  return request({
    url: `/api/integral-rules/${id}/status`,
    method: 'put',
    data: { status }
  })
}

// 获取积分任务列表
export const getIntegralTaskList = (params?: any) => {
  return request({
    url: '/api/integral-tasks',
    method: 'get',
    params
  })
}

// 创建积分任务
export const createIntegralTask = (data: Partial<IntegralTask>) => {
  return request({
    url: '/api/integral-tasks',
    method: 'post',
    data
  })
}

// 更新积分任务
export const updateIntegralTask = (id: number, data: Partial<IntegralTask>) => {
  return request({
    url: `/api/integral-tasks/${id}`,
    method: 'put',
    data
  })
}

// 删除积分任务
export const deleteIntegralTask = (id: number) => {
  return request({
    url: `/api/integral-tasks/${id}`,
    method: 'delete'
  })
}

// 获取积分商品列表
export const getIntegralProductList = (params?: any) => {
  return request({
    url: '/api/integral-products',
    method: 'get',
    params
  })
}

// 创建积分商品
export const createIntegralProduct = (data: Partial<IntegralProduct>) => {
  return request({
    url: '/api/integral-products',
    method: 'post',
    data
  })
}

// 更新积分商品
export const updateIntegralProduct = (id: number, data: Partial<IntegralProduct>) => {
  return request({
    url: `/api/integral-products/${id}`,
    method: 'put',
    data
  })
}

// 删除积分商品
export const deleteIntegralProduct = (id: number) => {
  return request({
    url: `/api/integral-products/${id}`,
    method: 'delete'
  })
}

// 获取积分记录列表
export const getIntegralRecordList = (params: any) => {
  return request({
    url: '/api/integral-records',
    method: 'get',
    params
  })
}

// 获取积分记录详情
export const getIntegralRecordDetail = (id: number) => {
  return request({
    url: `/api/integral-records/${id}`,
    method: 'get'
  })
}

// 发放积分
export const grantIntegral = (userId: number, points: number, reason: string) => {
  return request({
    url: '/api/integral-records/grant',
    method: 'post',
    data: { userId, points, reason }
  })
}

// 批量发放积分
export const batchGrantIntegral = (userIds: number[], points: number, reason: string) => {
  return request({
    url: '/api/integral-records/batch-grant',
    method: 'post',
    data: { userIds, points, reason }
  })
}

// 获取积分兑换列表
export const getIntegralExchangeList = (params: any) => {
  return request({
    url: '/api/integral-exchanges',
    method: 'get',
    params
  })
}

// 审核积分兑换
export const auditIntegralExchange = (id: number, status: number, remark?: string) => {
  return request({
    url: `/api/integral-exchanges/${id}/audit`,
    method: 'put',
    data: { status, remark }
  })
}

// 获取积分统计数据
export const getIntegralStats = () => {
  return request({
    url: '/api/integral/stats',
    method: 'get'
  })
}

// 获取积分趋势数据
export const getIntegralTrend = (params?: any) => {
  return request({
    url: '/api/integral/trend',
    method: 'get',
    params
  })
}

// 获取积分排行榜
export const getIntegralRanking = (params?: any) => {
  return request({
    url: '/api/integral/ranking',
    method: 'get',
    params
  })
}

// 导出积分记录
export const exportIntegralRecords = (params?: any) => {
  return request({
    url: '/api/integral-records/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 导出积分兑换记录
export const exportIntegralExchanges = (params?: any) => {
  return request({
    url: '/api/integral-exchanges/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}