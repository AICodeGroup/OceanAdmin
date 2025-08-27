import request from '@/utils/request'

// 获取待审核的观察记录列表
export function getPendingAuditObservations() {
  return request<any>({
    url: '/admin/platform/observations/getPendingAudit',
    method: 'get'
  })
}

// 审核通过观察记录
export function approveObservation(id: number) {
  return request<any>({
    url: `/admin/platform/observations/audit`,
    method: 'put',
    params: { id: id, status: 1 } // 1 表示通过
  })
}

// 审核拒绝观察记录
export function rejectObservation(id: number, reason: string) {
  return request<any>({
    url: '/admin/platform/observations/update',
    method: 'put',
    data: { id: id, status: 2, reason } // 2 表示拒绝
  })
}

export function getObservationsList(params: any) {
  return request<any>({
    url: '/admin/platform/observations/search',
    method: 'post',
    data: params
  })
}
