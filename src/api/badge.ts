import request from '@/utils/request'

// 获取徽章列表
export function getBadgeList(params: any) {
  return request({
    url: '/badge/list',
    method: 'get',
    params
  })
}

// 获取徽章类型列表
export function getBadgeTypeList() {
  return request({
    url: '/badge/types',
    method: 'get'
  })
}

// 创建徽章
export function createBadge(data: any) {
  return request({
    url: '/badge/create',
    method: 'post',
    data
  })
}

// 更新徽章
export function updateBadge(id: number, data: any) {
  return request({
    url: `/badge/update/${id}`,
    method: 'put',
    data
  })
}

// 删除徽章
export function deleteBadge(id: number) {
  return request({
    url: `/badge/delete/${id}`,
    method: 'delete'
  })
}

// 获取用户徽章列表
export function getUserBadgeList(params: any) {
  return request({
    url: '/badge/user-badges',
    method: 'get',
    params
  })
}

// 发放徽章
export function awardBadge(data: any) {
  return request({
    url: '/badge/award',
    method: 'post',
    data
  })
}

// 撤销徽章
export function revokeBadge(userBadgeId: number) {
  return request({
    url: `/badge/revoke/${userBadgeId}`,
    method: 'delete'
  })
}

// 获取徽章发放规则
export function getBadgeRules(params: any) {
  return request({
    url: '/badge/rules',
    method: 'get',
    params
  })
}

// 创建徽章发放规则
export function createBadgeRule(data: any) {
  return request({
    url: '/badge/rules',
    method: 'post',
    data
  })
}

// 更新徽章发放规则
export function updateBadgeRule(id: number, data: any) {
  return request({
    url: `/badge/rules/${id}`,
    method: 'put',
    data
  })
}

// 删除徽章发放规则
export function deleteBadgeRule(id: number) {
  return request({
    url: `/badge/rules/${id}`,
    method: 'delete'
  })
}

// 获取徽章统计
export function getBadgeStatistics(params: any) {
  return request({
    url: '/badge/statistics',
    method: 'get',
    params
  })
}

// 获取所有可授予的徽章
export function getGrantedBadge(params: { current: number; size: number }) {
  return request({
    url: '/admin/platform/getGrantedBadge',
    method: 'get',
    params
  })
}

// 授予用户徽章
export function grantUserBadge(userId: number, badgeId: number) {
  return request({
    url: '/admin/platform/grantUser',
    method: 'post',
    params: { userId, badgeId }
  })
}