import request from '@/utils/request'

// 定义从后端获取的任务数据结构
export interface Order {
  id: number
  phone: string
  productName: string
  status: number
  createdAt: string
  orderNo:string
  point:string
  payAmount:string
  payType:string
  userNickname:string
  // ...可以根据您的 Task 实体类补充其他字段
}

export interface OrderSearch {
  orderNo: string
  phone: string
  productName: string
  status: number
  startTime: string
  page:number
  limit:number
  endTime: string
}

export interface orderForm {
  id?: number
  phone: string,
  productId: string,    // 改为 null
  productName: string,
  scheduleId: string,   // 改为 null
  scheduleName: string,
  startDate: string,    // 日期也可以使用 null
  endDate: string,      // 日期也可以使用 null
  payAmount: string,    // 改为 null
  points: string,       // 改为 null
  payType: string,      // 选择框也可以使用 null
  status: string,       // 状态使用 null
  paidAt: string,       // 日期使用 null
  remark: string
}

export function deleteOrderApi(id:number){
  return request<any>({
    url: '/admin/platform/product-orders/delete/'+id,
    method: 'delete',
  })

}
export function createOrder(order:orderForm) {
  return request<any>({
    url: '/admin/platform/product-orders/create',
    method: 'post',
    data: order
  })
}

export function updateOrder(order: orderForm) {
  return request<any>({
    url: '/admin/platform/product-orders/update',
    method: 'put',
    data: order
  })
}

export function getScheduleById(id:string) {
  return request<any>({
    url: '/admin/platform/product/getProductSchedulesByProductId/'+id,
    method: 'get',
  })
}

export function getCourseList() {
  return request<any>({
    url: '/admin/platform/product/productList',
    method: 'get',
  })
}
/**
 * @description 查看所有每日任务，包含所有状态
 * @param params 包含 currentPage 和 pageSize
 */
export function getAllOrder(condition: OrderSearch,page:number,limit:number) {
    condition.page=page
    condition.limit=limit
  return request<Order>({
    url: '/admin/platform/product-orders/search',
    method: 'post',
    data: condition
  })
}

export function judgeUser(phone:string) {
return request<any>({
  url: '/admin/platform/getUserByPhone/'+phone,
  method: 'get',
})
}
