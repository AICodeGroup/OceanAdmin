import request from '@/utils/request'

// 获取物种列表
export function getSpeciesList(params: any) {
  return request({
    url: 'admin/platform/species/list',
    method: 'get',
    params
  })
}

// 获取物种分类列表
// export function getSpeciesCategoryList() {
//   return request({
//     url: '/species/categories',
//     method: 'get'
//   })
// }

// 创建物种分类
export function createSpeciesCategory(data: any) {
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





// 获取物种详情
// export function getSpeciesDetail(id: number) {
//   return request({
//     url: `/species/detail/${id}`,
//     method: 'get'
//   })
// }

// 创建物种
// export function createSpecies(data: any) {
//   return request({
//     url: '/species/create',
//     method: 'post',
//     data
//   })
// }

// 更新物种
// export function updateSpecies(id: number, data: any) {
//   return request({
//     url: `/species/update/${id}`,
//     method: 'put',
//     data
//   })
// }

// // 删除物种
// export function deleteSpecies(id: number) {
//   return request({
//     url: `/species/delete/${id}`,
//     method: 'delete'
//   })
// }

// // 搜索物种
// export function searchSpecies(params: any) {
//   return request({
//     url: '/species/search',
//     method: 'get',
//     params
//   })
// }

// // 获取物种统计
// export function getSpeciesStatistics() {
//   return request({
//     url: '/species/statistics',
//     method: 'get'
//   })
// }

// // 批量导入物种
// export function importSpecies(data: any) {
//   return request({
//     url: '/species/import',
//     method: 'post',
//     data
//   })
// }

// // 导出物种数据
// export function exportSpecies(params: any) {
//   return request({
//     url: '/species/export',
//     method: 'get',
//     params,
//     responseType: 'blob'
//   })
// }

// ==================== 课程物种关联管理 ====================

export function exportSpecies(params: any) {
  return request({
    url: 'admin/platform/product/course/list',
    method: 'get',
    params,
  })
}










// // 获取课程物种关联列表
// export function getCourseSpeciesRelationList(params: any) {
//   return request({
//     url: '/course-species-relation/list',
//     method: 'get',
//     params
//   })
// }

// // 创建课程物种关联
// export function createCourseSpeciesRelation(data: any) {
//   return request({
//     url: '/course-species-relation/create',
//     method: 'post',
//     data
//   })
// }

// // 更新课程物种关联
// export function updateCourseSpeciesRelation(id: number, data: any) {
//   return request({
//     url: `/course-species-relation/update/${id}`,
//     method: 'put',
//     data
//   })
// }

// // 删除课程物种关联
// export function deleteCourseSpeciesRelation(id: number) {
//   return request({
//     url: `/course-species-relation/delete/${id}`,
//     method: 'delete'
//   })
// }

// // 批量创建课程物种关联
// export function batchCreateCourseSpeciesRelation(data: any) {
//   return request({
//     url: '/course-species-relation/batch-create',
//     method: 'post',
//     data
//   })
// }

// // 根据课程ID获取关联的物种
// export function getSpeciesByCourseId(courseId: number) {
//   return request({
//     url: `/course-species-relation/species-by-course/${courseId}`,
//     method: 'get'
//   })
// }

// // 根据物种ID获取关联的课程
// export function getCoursesBySpeciesId(speciesId: number) {
//   return request({
//     url: `/course-species-relation/courses-by-species/${speciesId}`,
//     method: 'get'
//   })
// }

// // 获取课程物种关联统计
// export function getCourseSpeciesRelationStats() {
//   return request({
//     url: '/course-species-relation/statistics',
//     method: 'get'
//   })
// }

// // 同步课程物种关联数据
// export function syncCourseSpeciesRelation() {
//   return request({
//     url: '/course-species-relation/sync',
//     method: 'post'
//   })
// }

// // 导出课程物种关联数据
// export function exportCourseSpeciesRelation(params: any) {
//   return request({
//     url: '/course-species-relation/export',
//     method: 'get',
//     params,
//     responseType: 'blob'
//   })
// }