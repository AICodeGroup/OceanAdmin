import request from '@/utils/request'

// 获取物种列表
export function getSpeciesList(params: any) {
  return request({
    url: '/species/list',
    method: 'get',
    params
  })
}

// 获取物种分类列表
export function getSpeciesCategoryList() {
  return request({
    url: '/species/categories',
    method: 'get'
  })
}

// 创建物种分类
export function createSpeciesCategory(data: any) {
  return request({
    url: '/species/categories',
    method: 'post',
    data
  })
}

// 更新物种分类
export function updateSpeciesCategory(id: number, data: any) {
  return request({
    url: `/species/categories/${id}`,
    method: 'put',
    data
  })
}

// 删除物种分类
export function deleteSpeciesCategory(id: number) {
  return request({
    url: `/species/categories/${id}`,
    method: 'delete'
  })
}

// 获取物种详情
export function getSpeciesDetail(id: number) {
  return request({
    url: `/species/detail/${id}`,
    method: 'get'
  })
}

// 创建物种
export function createSpecies(data: any) {
  return request({
    url: '/species/create',
    method: 'post',
    data
  })
}

// 更新物种
export function updateSpecies(id: number, data: any) {
  return request({
    url: `/species/update/${id}`,
    method: 'put',
    data
  })
}

// 删除物种
export function deleteSpecies(id: number) {
  return request({
    url: `/species/delete/${id}`,
    method: 'delete'
  })
}

// 搜索物种
export function searchSpecies(params: any) {
  return request({
    url: '/species/search',
    method: 'get',
    params
  })
}

// 获取物种统计
export function getSpeciesStatistics() {
  return request({
    url: '/species/statistics',
    method: 'get'
  })
}

// 批量导入物种
export function importSpecies(data: any) {
  return request({
    url: '/species/import',
    method: 'post',
    data
  })
}

// 导出物种数据
export function exportSpecies(params: any) {
  return request({
    url: '/species/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}