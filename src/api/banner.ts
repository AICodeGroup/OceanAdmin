import request from '@/utils/request'

// 获取轮播图列表
export function getBannerList(params: { page: number; size: number }) {
  return request({
    url: '/banner/list',
    method: 'get',
    params
  })
}

// 创建轮播图
export function createBanner(data: any) {
  return request({
    url: '/banner/create',
    method: 'post',
    data
  })
}

// 更新轮播图
export function updateBanner(id: number, data: any) {
  return request({
    url: `/banner/update/${id}`,
    method: 'put',
    data
  })
}

// 删除轮播图
export function deleteBanner(id: number | number[]) {
  return request({
    url: '/banner/delete',
    method: 'delete',
    data: { id }
  })
}

// 获取轮播图详情
export function getBannerDetail(id: number) {
  return request({
    url: `/banner/detail/${id}`,
    method: 'get'
  })
}

// 更新轮播图状态
export function updateBannerStatus(id: number, status: number) {
  return request({
    url: `/banner/status/${id}`,
    method: 'put',
    data: { status }
  })
}

// 更新轮播图排序
export function updateBannerSort(data: { id: number; sort: number }[]) {
  return request({
    url: '/banner/sort',
    method: 'put',
    data
  })
}