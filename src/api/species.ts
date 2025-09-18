import request from '@/utils/request'

// 获取物种列表
export function getSpeciesList(params: any) {
  return request({
    url: 'admin/platform/species/list',
    method: 'get',
    params
  })
}


// 创建物种分类
export function createSpeciesCategory(data: any) {
  return request({
    url: 'admin/platform/species/save',
    method: 'post',
    data
  })
}

// 保存物种
export function saveSpecies(data: any) {
  return request({
    url: 'admin/platform/species/save',
    method: 'post',
    data
  })
}

// 更新物种分类
export function updateSpeciesCategory( data: any) {
  return request({
    url: `admin/platform/species/update`,
    method: 'put',
    data
  })
}

// 删除物种分类
export function deleteSpeciesCategory(id: number) {
  return request({
    url: `admin/platform/species/delete/${id}`,
    method: 'delete'
  })
}


export function getSpeciesTree() {
  return request({
    url: 'admin/platform/species/tree',
    method: 'get',
  })
}


export function saveSpeciesTree(data: any) {
  return request({
    url: 'admin/platform/species-type/save',
    method: 'post',
    data
  })
}

export function updateSpeciesTree(data: any) {
  return request({
    url: 'admin/platform/species-type/update',
    method: 'put',
    data
  })
}


export function deleteSpeciesTree(id: number) {
  return request({
    url: `admin/platform/species-type/delete/${id}`,
    method: 'DELETE',
  })
}

// ==================== 课程物种关联管理 ====================

export function exportSpecies(params: any) {
  return request({
    url: 'admin/platform/product/course/list',
    method: 'get',
    params,
  })
}
