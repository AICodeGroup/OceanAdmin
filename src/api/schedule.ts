import request from '@/utils/request'

// 获取日程列表
export function getScheduleList(params: any) {
  return request({
    url: '/schedule/list',
    method: 'get',
    params
  })
}

// 获取用户课程日程
export function getUserSchedule(params: any) {
  return request({
    url: '/schedule/user',
    method: 'get',
    params
  })
}

// 创建日程
export function createSchedule(data: any) {
  return request({
    url: '/schedule/create',
    method: 'post',
    data
  })
}

// 更新日程
export function updateSchedule(id: number, data: any) {
  return request({
    url: `/schedule/update/${id}`,
    method: 'put',
    data
  })
}

// 删除日程
export function deleteSchedule(id: number) {
  return request({
    url: `/schedule/delete/${id}`,
    method: 'delete'
  })
}

// 更新用户参与状态
export function updateParticipationStatus(scheduleId: number, userId: number, status: number) {
  return request({
    url: '/schedule/participation',
    method: 'put',
    data: { scheduleId, userId, status }
  })
}

// 获取日程统计
export function getScheduleStatistics(params: any) {
  return request({
    url: '/schedule/statistics',
    method: 'get',
    params
  })
}

// 导出日程
export function exportSchedule(params: any) {
  return request({
    url: '/schedule/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}