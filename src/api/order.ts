import request from '@/utils/request'

// ==================== 后台管理 - 课程订单接口 ====================

// 创建课程订单
export const createCourseOrder = (data: any) => {
  return request({
    url: '/admin/platform/product-orders/create',
    method: 'post',
    data
  })
}

// 课程订单分页列表
export const getCourseOrderList = (params: any) => {
  return request({
    url: '/admin/platform/product-orders/list',
    method: 'get',
    params
  })
}

// 根据ID获取课程订单详情（后台）
export function getCourseOrderDetailById(id: number) {
  return request({
    url: `/admin/platform/product-orders/detail/${id}`,
    method: 'get'
  })
}

// 根据订单号获取课程订单详情（后台）
export function getCourseOrderDetailByNo(orderNo: string) {
  return request({
    url: `/admin/platform/product-orders/detail/orderNo/${orderNo}`,
    method: 'get'
  })
}

// 获取指定用户的课程订单列表
export function getUserCourseOrderList(userId: number, params?: any) {
  return request({
    url: `/admin/platform/product-orders/user/${userId}`,
    method: 'get',
    params
  })
}

// 更新课程订单状态
export function updateCourseOrderStatus(orderNo: string, status: number) {
  return request({
    url: '/admin/platform/product-orders/status/update',
    method: 'post',
    params: { orderNo, status }
  })
}

// 删除课程订单（软删除）
export function deleteCourseOrder(id: number) {
  return request({
    url: `/admin/platform/product-orders/delete/${id}`,
    method: 'post'
  })
}

// 批量删除课程订单
export function batchDeleteCourseOrders(ids: number[]) {
  return request({
    url: '/admin/platform/product-orders/batch/delete',
    method: 'post',
    data: ids
  })
}

// 课程订单统计信息
export function getCourseOrderStatistics(params?: any) {
  return request({
    url: '/admin/platform/product-orders/statistics',
    method: 'get',
    params
  })
}

// 全部订单统计信息（课程+实体商品）
export function getAllOrderStatistics(params?: any) {
  return request({
    url: '/admin/platform/product-orders/statistics/all',
    method: 'get',
    params
  })
}

// 导出课程订单列表
export function exportCourseOrders(params: any) {
  return request({
    url: '/admin/platform/product-orders/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// ==================== 后台管理 - 实体商品订单接口 ====================

// 创建实体商品订单
export const createEntityOrder = (data: any) => {
  return request({
    url: '/admin/platform/product-entity-orders/create',
    method: 'post',
    data
  })
}

// 实体商品订单分页列表
export function getEntityOrderList(params: any) {
  return request({
    url: '/admin/platform/product-entity-orders/list',
    method: 'get',
    params
  })
}

// 根据ID获取实体商品订单详情（后台）
export function getEntityOrderDetailById(id: number) {
  return request({
    url: `/admin/platform/product-entity-orders/detail/${id}`,
    method: 'get'
  })
}

// 根据订单号获取实体商品订单详情（后台）
export function getEntityOrderDetailByNo(orderNo: string) {
  return request({
    url: `/admin/platform/product-entity-orders/detail/orderNo/${orderNo}`,
    method: 'get'
  })
}

// 获取指定用户的实体商品订单列表
export function getUserEntityOrderList(userId: number, params?: any) {
  return request({
    url: `/admin/platform/product-entity-orders/user/${userId}`,
    method: 'get',
    params
  })
}

// 更新实体商品订单状态
export function updateEntityOrderStatus(orderNo: string, status: number) {
  return request({
    url: '/admin/platform/product-entity-orders/status/update',
    method: 'post',
    params: { orderNo, status }
  })
}

// 删除实体商品订单（软删除）
export function deleteEntityOrderAdmin(id: number) {
  return request({
    url: `/admin/platform/product-entity-orders/delete/${id}`,
    method: 'post'
  })
}

// 批量删除实体商品订单
export function batchDeleteEntityOrders(ids: number[]) {
  return request({
    url: '/admin/platform/product-entity-orders/batch/delete',
    method: 'post',
    data: ids
  })
}

// 获取订单发货信息（包含收货地址）
export function getShippingInfo(orderNo: string) {
  return request({
    url: `/admin/platform/product-entity-orders/shipping-info/${orderNo}`,
    method: 'get'
  })
}

// 实体商品订单发货
export function shipEntityOrder(data: {
  orderNo: string
  expressCompany: string
  expressNo: string
  shippingRemark?: string
}) {
  return request({
    url: '/admin/platform/product-entity-orders/ship',
    method: 'post',
    data
  })
}

// 实体商品订单退款
export function refundEntityOrder(orderNo: string, reason: string) {
  return request({
    url: `/admin/platform/product-entity-orders/refund/${orderNo}`,
    method: 'post',
    params: { reason }
  })
}

// 实体商品订单统计信息
export function getEntityOrderStatistics(params?: any) {
  return request({
    url: '/admin/platform/product-entity-orders/statistics',
    method: 'get',
    params
  })
}

// 导出实体商品订单列表
export function exportEntityOrders(params: any) {
  return request({
    url: '/admin/platform/product-entity-orders/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// ==================== 旧订单接口（保留兼容） ====================
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

// ==================== 课程订单接口 (orderType=0) ====================

// 根据ID获取课程订单详情
export function getCourseOrderById(id: number) {
  return request({
    url: `/front/product-orders/get/${id}`,
    method: 'get'
  })
}

// 根据订单号获取课程订单详情
export function getCourseOrderByNo(orderNo: string) {
  return request({
    url: `/front/product-orders/getByOrderNo/${orderNo}`,
    method: 'get'
  })
}

// 课程报名
export function registerCourse(data: any) {
  return request({
    url: '/front/product-orders/register',
    method: 'post',
    data
  })
}

// 获取用户课程订单列表
export function getUserCourseOrders(params?: any) {
  return request({
    url: '/front/product-orders/getUserOrders',
    method: 'get',
    params
  })
}

// 获取下一个排期订单
export function getNextScheduledOrder() {
  return request({
    url: '/front/product-orders/getNextScheduledOrder',
    method: 'get'
  })
}

// 获取已支付且过期的课程订单
export function getUserPastPaidOrders(params?: any) {
  return request({
    url: '/front/product-orders/getUserPastPaidOrders',
    method: 'get',
    params
  })
}

// 获取足迹订单
export function getUserPastPaidOrdersToWorld() {
  return request({
    url: '/front/product-orders/getUserPastPaidOrdersToWorld',
    method: 'get'
  })
}

// 取消课程报名
export function cancelCourseOrder(orderNo: string) {
  return request({
    url: `/front/product-orders/cancel/${orderNo}`,
    method: 'post'
  })
}

// ==================== 实体商品订单接口 (orderType=1) ====================

// 根据ID获取实体商品订单详情
export function getEntityOrderById(id: number) {
  return request({
    url: `/front/product-entity-orders/get/${id}`,
    method: 'get'
  })
}

// 根据订单号获取实体商品订单详情
export function getEntityOrderByNo(orderNo: string) {
  return request({
    url: `/front/product-entity-orders/getByOrderNo/${orderNo}`,
    method: 'get'
  })
}

// 创建实体商品订单（前端）
export function createFrontEntityOrder(data: any) {
  return request({
    url: '/front/product-entity-orders/create',
    method: 'post',
    data
  })
}

// 获取用户实体商品订单列表
export function getUserEntityOrders(params?: any) {
  return request({
    url: '/front/product-entity-orders/getUserOrders',
    method: 'get',
    params
  })
}

// 获取已支付实体商品订单
export function getUserPaidEntityOrders(params?: any) {
  return request({
    url: '/front/product-entity-orders/getUserPaidOrders',
    method: 'get',
    params
  })
}

// 获取待支付实体商品订单
export function getUserUnpaidEntityOrders(params?: any) {
  return request({
    url: '/front/product-entity-orders/getUserUnpaidOrders',
    method: 'get',
    params
  })
}

// 取消实体商品订单
export function cancelEntityOrder(orderNo: string) {
  return request({
    url: `/front/product-entity-orders/cancel/${orderNo}`,
    method: 'post'
  })
}

// 删除实体商品订单
export function deleteEntityOrder(id: number) {
  return request({
    url: `/front/product-entity-orders/delete/${id}`,
    method: 'delete'
  })
}