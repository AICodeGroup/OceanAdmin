import request from '@/utils/request'

// Get consultation list
export function getConsultationList(params: any) {
  return request({
    url: '/admin/platform/consultation/list',
    method: 'get',
    params
  })
}

// Get consultation detail
export function getConsultationDetail(id: number) {
  return request({
    url: `/admin/platform/consultation/detail/${id}`,
    method: 'get'
  })
}

// Update consultation status
export function updateConsultationStatus(data: { id: number; status: number; remark?: string }) {
  return request({
    url: '/admin/platform/consultation/status',
    method: 'post',
    data
  })
}

// Delete consultation
export function deleteConsultation(id: number) {
  return request({
    url: `/admin/platform/consultation/delete/${id}`,
    method: 'delete'
  })
}

// Get unhandled consultation count
export function getUnhandledConsultationCount() {
  return request({
    url: '/admin/platform/consultation/unhandled/count',
    method: 'get'
  })
}
