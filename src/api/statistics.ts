import request from '@/utils/request'

// 获取总体统计数据
export function getOverallStatistics() {
  return request({
    url: '/statistics/overall',
    method: 'get'
  })
}

// 获取用户数据统计
export function getUserStatistics(params: any) {
  return request({
    url: '/statistics/users',
    method: 'get',
    params
  })
}

// 获取内容数据统计
export function getContentStatistics(params: any) {
  return request({
    url: '/statistics/content',
    method: 'get',
    params
  })
}

// 获取课程数据统计
export function getCourseStatistics(params: any) {
  return request({
    url: '/statistics/courses',
    method: 'get',
    params
  })
}

// 获取订单数据统计
export function getOrderStatistics(params: any) {
  return request({
    url: '/statistics/orders',
    method: 'get',
    params
  })
}

// 获取积分数据统计
export function getIntegralStatistics(params: any) {
  return request({
    url: '/statistics/integral',
    method: 'get',
    params
  })
}

// 获取徽章数据统计
export function getBadgeStatistics(params: any) {
  return request({
    url: '/statistics/badges',
    method: 'get',
    params
  })
}

// 获取日程数据统计
export function getScheduleStatistics(params: any) {
  return request({
    url: '/statistics/schedules',
    method: 'get',
    params
  })
}

// 获取足迹数据统计
export function getFootprintStatistics(params: any) {
  return request({
    url: '/statistics/footprints',
    method: 'get',
    params
  })
}

// 获取用户增长趋势
export function getUserGrowthTrend(params: any) {
  return request({
    url: '/statistics/user-growth',
    method: 'get',
    params
  })
}

// 获取活跃用户统计
export function getActiveUserStatistics(params: any) {
  return request({
    url: '/statistics/active-users',
    method: 'get',
    params
  })
}

// 获取收入统计
export function getRevenueStatistics(params: any) {
  return request({
    url: '/statistics/revenue',
    method: 'get',
    params
  })
}

// 生成自定义报表
export function generateCustomReport(data: any) {
  return request({
    url: '/statistics/custom-report',
    method: 'post',
    data
  })
}

// 导出统计报表
export function exportStatisticsReport(params: any) {
  return request({
    url: '/statistics/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}