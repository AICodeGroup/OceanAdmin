import request from '@/utils/request'

// Get family relationship list
export function getFamilyRelationshipList(params: {
  page: number
  limit: number
  parentUserId?: number
  childUserId?: number
  status?: number
  parentPhone?: string
  childPhone?: string
  parentNickname?: string
  childNickname?: string
  dateStart?: string
  dateEnd?: string
}) {
  return request({
    url: '/admin/platform/family/relationship/list',
    method: 'get',
    params
  })
}

// Get family relationship detail
export function getFamilyRelationshipDetail(id: number) {
  return request({
    url: `/admin/platform/family/relationship/detail/${id}`,
    method: 'get'
  })
}

// Add family relationship
export function addFamilyRelationship(data: {
  parentUserId: number
  childUserId: number
  status?: number
}) {
  return request({
    url: '/admin/platform/family/relationship/add',
    method: 'post',
    data
  })
}

// Update family relationship
export function updateFamilyRelationship(data: {
  id: number
  parentUserId?: number
  childUserId?: number
  status?: number
}) {
  return request({
    url: '/admin/platform/family/relationship/update',
    method: 'post',
    data
  })
}

// Delete family relationship
export function deleteFamilyRelationship(id: number) {
  return request({
    url: `/admin/platform/family/relationship/delete/${id}`,
    method: 'delete'
  })
}
