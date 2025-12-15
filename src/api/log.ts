import request from '@/utils/request'

// 敏感操作日志查询参数
export interface SensitiveLogSearchParams {
  page: number
  limit: number
  methodType?: string
  startDate?: string
  endDate?: string
  adminAccount?: string
  status?: number
  keyword?: string
}

// 敏感操作日志记录
export interface SensitiveLogRecord {
  id: number
  merId: number
  adminId: number
  adminAccount: string
  description: string
  methodType: string
  method: string
  requestMethod: string
  url: string
  ip: string
  requestParam: string
  result: string
  status: number
  errorMsg: string
  createTime: string
}

// 敏感操作日志响应
export interface SensitiveLogResponse {
  page: number
  limit: number
  totalPage: number
  total: number
  list: SensitiveLogRecord[]
}

// 获取敏感操作日志
export function getSensitiveLogs(params: SensitiveLogSearchParams) {
  return request({
    url: '/admin/platform/log/sensitive/search',
    method: 'get',
    params
  })
}
