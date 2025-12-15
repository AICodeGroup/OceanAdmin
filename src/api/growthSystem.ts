import request from '@/utils/request'

// ==================== 一、积分管理接口 ====================

// 获取积分配置
export function getIntegralConfig() {
  return request({
    url: '/admin/platform/integral/get/config',
    method: 'get'
  })
}

// 编辑积分配置
export function setIntegralConfig(data: any) {
  return request({
    url: '/admin/platform/integral/set/config',
    method: 'post',
    data
  })
}

// 积分任务配置
export function configIntegralGrantTask(data: { cronExpression: string; status: number }) {
  return request({
    url: '/admin/platform/integral/configGrantOrderIntegralTask',
    method: 'post',
    data
  })
}

// 积分记录分页列表
export function getIntegralList(params: any) {
  return request({
    url: '/admin/platform/integral/list',
    method: 'get',
    params
  })
}

// ==================== 二、用户等级管理接口 ====================

// 获取系统等级列表
export function getUserLevelList() {
  return request({
    url: '/admin/platform/system/user/level/list',
    method: 'get'
  })
}

// 新增系统等级
export function saveUserLevel(data: any) {
  return request({
    url: '/admin/platform/system/user/level/save',
    method: 'post',
    data
  })
}

// 更新系统等级
export function updateUserLevel(data: any) {
  return request({
    url: '/admin/platform/system/user/level/update',
    method: 'post',
    data
  })
}

// 删除系统等级
export function deleteUserLevel(id: number) {
  return request({
    url: `/admin/platform/system/user/level/delete/${id}`,
    method: 'post'
  })
}

// 显示/隐藏系统等级
export function toggleUserLevelShow(id: number, isShow: boolean) {
  return request({
    url: `/admin/platform/system/user/level/show/${id}`,
    method: 'post',
    data: { isShow }
  })
}

// ==================== 三、签到配置接口 ====================

// 获取签到配置
export function getSignConfig() {
  return request({
    url: '/admin/platform/sign/get/config',
    method: 'get'
  })
}

// 编辑基础签到配置
export function editBaseSignConfig(data: any) {
  return request({
    url: '/admin/platform/sign/edit/base/config',
    method: 'post',
    data
  })
}

// 新增连续签到配置
export function addSignConfig(data: any) {
  return request({
    url: '/admin/platform/sign/add/config',
    method: 'post',
    data
  })
}

// 编辑连续签到配置
export function editAwardSignConfig(data: any) {
  return request({
    url: '/admin/platform/sign/edit/award/config',
    method: 'post',
    data
  })
}

// 删除连续签到配置
export function deleteSignConfig(id: number) {
  return request({
    url: `/admin/platform/sign/delete/config/${id}`,
    method: 'post'
  })
}

// 获取签到记录列表
export function getSignRecordList(params: any) {
  return request({
    url: '/admin/platform/sign/user/record/list',
    method: 'get',
    params
  })
}

// ==================== 四、用户管理接口 ====================

// 获取用户详情
export function getUserDetail(uid: number) {
  return request({
    url: `/admin/platform/user/info/${uid}`,
    method: 'get'
  })
}

// 操作用户积分
export function operateUserIntegral(params: any) {
  return request({
    url: '/admin/platform/user/operate/integral',
    method: 'get',
    params
  })
}

// 操作用户经验
export function operateUserExperience(params: any) {
  return request({
    url: '/admin/platform/user/operate/experience',
    method: 'get',
    params
  })
}

// 操作用户余额
export function operateUserBalance(params: any) {
  return request({
    url: '/admin/platform/user/operate/balance',
    method: 'get',
    params
  })
}

// 用户积分记录
export function getUserIntegralRecord(params: any) {
  return request({
    url: '/admin/platform/user/integral/record',
    method: 'get',
    params
  })
}

// 用户经验记录
export function getUserExperienceRecord(params: any) {
  return request({
    url: '/admin/platform/user/experience/record',
    method: 'get',
    params
  })
}

// 用户等级记录
export function getUserLevelRecord(params: any) {
  return request({
    url: '/admin/platform/user/level/record',
    method: 'get',
    params
  })
}

// ==================== 五、徽章管理接口 ====================

// 5.1 徽章管理

// 增加徽章
export function addBadge(data: any) {
  return request({
    url: '/admin/platform/badge/addBadge',
    method: 'post',
    data
  })
}

// 删除徽章
export function deleteBadge(id: number) {
  return request({
    url: `/admin/platform/badge/delete/${id}`,
    method: 'delete'
  })
}

// 修改徽章
export function updateBadge(data: any) {
  return request({
    url: '/admin/platform/badge/update',
    method: 'put',
    data
  })
}

// 查询单个徽章
export function getBadgeById(id: number) {
  return request({
    url: `/admin/platform/badge/info/${id}`,
    method: 'get'
  })
}

// 查询徽章列表
export function getBadgeList(params: any) {
  return request({
    url: '/admin/platform/badge/list',
    method: 'get',
    params
  })
}

// 5.2 徽章授予

// 授予徽章
export function grantBadge(data: any) {
  return request({
    url: '/admin/platform/badge/grant',
    method: 'post',
    data
  })
}

// 批量授予徽章
export function batchGrantBadge(data: any) {
  return request({
    url: '/admin/platform/badge/batch/grant',
    method: 'post',
    data
  })
}

// 撤回徽章
export function revokeBadge(userBadgeId: number) {
  return request({
    url: `/admin/platform/badge/revoke/${userBadgeId}`,
    method: 'post'
  })
}

// 查询用户徽章列表
export function getUserBadgeList(params: any) {
  return request({
    url: '/admin/platform/badge/user/badges',
    method: 'get',
    params
  })
}

// 5.3 徽章类型管理

// 获取徽章类型列表
export function getBadgeTypeList() {
  return request({
    url: '/admin/platform/badge/type/list',
    method: 'get'
  })
}

// 新增徽章类型
export function addBadgeType(data: any) {
  return request({
    url: '/admin/platform/badge/type/save',
    method: 'post',
    data
  })
}

// 更新徽章类型
export function updateBadgeType(data: any) {
  return request({
    url: '/admin/platform/badge/type/update',
    method: 'post',
    data
  })
}

// 删除徽章类型
export function deleteBadgeType(id: number) {
  return request({
    url: `/admin/platform/badge/type/delete/${id}`,
    method: 'post'
  })
}

// ==================== 七、排行榜接口 ====================

// 获取积分排行榜
export function getIntegralRanking(params: any) {
  return request({
    url: '/admin/platform/ranking/integral/list',
    method: 'get',
    params
  })
}

// 获取经验排行榜
export function getExperienceRanking(params: any) {
  return request({
    url: '/admin/platform/ranking/experience/list',
    method: 'get',
    params
  })
}

// 获取徽章排行榜
export function getBadgeRanking(params: any) {
  return request({
    url: '/admin/platform/ranking/badge/list',
    method: 'get',
    params
  })
}

// 获取用户排名
export function getUserRank(params: any) {
  return request({
    url: '/admin/platform/ranking/user/rank',
    method: 'get',
    params
  })
}

// 手动更新排行榜缓存
export function updateRankingCache(params: any) {
  return request({
    url: '/admin/platform/ranking/cache/update',
    method: 'post',
    params
  })
}

// 清空排行榜缓存
export function clearRankingCache(params: any) {
  return request({
    url: '/admin/platform/ranking/cache/clear',
    method: 'post',
    params
  })
}

// 获取积分增长统计
export function getIntegralStatistics(params: any) {
  return request({
    url: '/admin/platform/ranking/integral/statistics',
    method: 'get',
    params
  })
}
