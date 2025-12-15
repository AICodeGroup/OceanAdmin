import request from '@/utils/request'

// Get user timeline list
export function getUserTimelineList(params: {
  userId: number
  eventType?: string
  dateStart?: string
  dateEnd?: string
}) {
  return request({
    url: '/admin/platform/user/timeline/list',
    method: 'get',
    params
  })
}
