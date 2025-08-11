import request from '@/utils/request'

// 获取足迹列表
export function getFootprintList(params: any) {
  return request({
    url: '/footprint/list',
    method: 'get',
    params
  })
}

// 获取用户足迹
export function getUserFootprint(userId: number, params: any) {
  return request({
    url: `/footprint/user/${userId}`,
    method: 'get',
    params
  })
}

// 获取足迹详情
export function getFootprintDetail(id: number) {
  return request({
    url: `/footprint/detail/${id}`,
    method: 'get'
  })
}

// 创建足迹
export function createFootprint(data: any) {
  return request({
    url: '/footprint/create',
    method: 'post',
    data
  })
}

// 更新足迹
export function updateFootprint(id: number, data: any) {
  return request({
    url: `/footprint/update/${id}`,
    method: 'put',
    data
  })
}

// 删除足迹
export function deleteFootprint(id: number) {
  return request({
    url: `/footprint/delete/${id}`,
    method: 'delete'
  })
}

// 获取足迹统计
export function getFootprintStatistics(params: any) {
  return request({
    url: '/footprint/statistics',
    method: 'get',
    params
  })
}

// 获取足迹轨迹分析
export function getFootprintTrackAnalysis(params: any) {
  return request({
    url: '/footprint/track-analysis',
    method: 'get',
    params
  })
}

// 获取地图数据
export function getFootprintMapData(params: any) {
  return request({
    url: '/footprint/map-data',
    method: 'get',
    params
  })
}