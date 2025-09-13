import request from '@/utils/request'

// 查看所有徽章接口
export function getBadgeList(params: any) {
  return request({
    url: '/admin/platform/badge/list',
    method: 'get',
    params
  })
}

// 新增徽章接口
export function addBadge(data: any) {
  return request({
    url: '/admin/platform/badge/addBadge',
    method: 'post',
    data
  })
}

// 修改徽章接口
export function updateBadge(data: any) {
  return request({
    url: '/admin/platform/badge/update',
    method: 'put',
    data
  })
}

// 删除徽章接口
export function deleteBadge(id: number) {
  return request({
    url: `/admin/platform/badge/delete/${id}`,
    method: 'delete'
  })
}

// 批量删除徽章接口
export function batchDeleteBadges(ids: number[]) {
  return request({
    url: '/admin/platform/badge/batchDelete',
    method: 'delete',
    data: ids, // 直接发送数组作为请求体
 
  })
}

// 获取徽章类型列表
export function getBadgeTypeList() {
  return request({
    url: '/badge/types',
    method: 'get'
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
export interface BadgeItem {
  id: number
  name: string
  description: string
  iconUrl: string
  typeId: number
  level: number
  isGranted: number // 0 表示不可以，1 表示可以
  createdAt: string
  updatedAt: string
}

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
export function getGrantedBadge(params: { 
  current: number; 
  size: number;
  is_del?: number; // 0-未删除，1-已删除 
}) {
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