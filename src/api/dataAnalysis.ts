import request from '@/utils/request'

// 获取用户分析概览
export function getOverview() {
  return request({
    url: '/admin/platform/data/analysis/overview',
    method: 'get'
  })
}

// 获取用户注册趋势
export function getRegisterTrend(data: any) {
  return request({
    url: '/admin/platform/data/analysis/trend/register',
    method: 'post',
    data
  })
}

// 获取用户访问趋势
export function getVisitTrend(data: any) {
  return request({
    url: '/admin/platform/data/analysis/trend/visit',
    method: 'post',
    data
  })
}

// 获取用户报名趋势
export function getEnrollTrend(data: any) {
  return request({
    url: '/admin/platform/data/analysis/trend/enroll',
    method: 'post',
    data
  })
}

// 获取用户购物趋势
export function getOrderTrend(data: any) {
  return request({
    url: '/admin/platform/data/analysis/trend/order',
    method: 'post',
    data
  })
}

// 获取综合趋势数据
export function getComprehensiveTrend(data: any) {
  return request({
    url: '/admin/platform/data/analysis/trend/comprehensive',
    method: 'post',
    data
  })
}
