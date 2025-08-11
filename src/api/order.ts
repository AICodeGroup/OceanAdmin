import request from '@/utils/request'

// 获取订单列表
export function getOrderList(params: any) {
  return request({
    url: '/order/list',
    method: 'get',
    params
  })
}

// 获取订单详情
export function getOrderDetail(id: number) {
  return request({
    url: `/order/detail/${id}`,
    method: 'get'
  })
}

// 创建订单
export function createOrder(data: any) {
  return request({
    url: '/order/create',
    method: 'post',
    data
  })
}

// 更新订单状态
export function updateOrderStatus(id: number, status: number) {
  return request({
    url: `/order/status/${id}`,
    method: 'put',
    data: { status }
  })
}

// 删除订单
export function deleteOrder(id: number | number[]) {
  return request({
    url: '/order/delete',
    method: 'delete',
    data: { id }
  })
}

// 导出订单
export function exportOrders(params: any) {
  return request({
    url: '/order/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 订单统计
export function getOrderStatistics(params: any) {
  return request({
    url: '/order/statistics',
    method: 'get',
    params
  })
}