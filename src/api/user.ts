import request from '@/utils/request'

// 用户接口类型定义
export interface User {
  id: number
  username: string
  nickname: string
  phone: string
  email: string
  avatar: string
  gender: number
  birthday: string
  province: string
  city: string
  district: string
  address: string
  points: number
  level: number
  status: number
  lastLoginTime: string
  createTime: string
  updateTime: string
}

export interface UserRelation {
  id: number
  parentId: number
  childId: number
  parentName: string
  childName: string
  relation: string
  createTime: string
}

export interface UserFootprint {
  id: number
  userId: number
  username: string
  latitude: number
  longitude: number
  address: string
  description: string
  images: string[]
  createTime: string
}

// 获取用户列表
export const getUserList = (params: any) => {
  return request({
    url: '/api/users',
    method: 'get',
    params
  })
}

// 获取用户详情
export const getUserDetail = (id: number) => {
  return request({
    url: `/api/users/${id}`,
    method: 'get'
  })
}

// 创建用户
export const createUser = (data: Partial<User>) => {
  return request({
    url: '/api/users',
    method: 'post',
    data
  })
}

// 更新用户信息
export const updateUser = (id: number, data: Partial<User>) => {
  return request({
    url: `/api/users/${id}`,
    method: 'put',
    data
  })
}

// 删除用户
export const deleteUser = (id: number) => {
  return request({
    url: `/api/users/${id}`,
    method: 'delete'
  })
}

// 更新用户状态
export const updateUserStatus = (id: number, status: number) => {
  return request({
    url: `/api/users/${id}/status`,
    method: 'put',
    data: { status }
  })
}

// 重置用户密码
export const resetUserPassword = (id: number, password: string) => {
  return request({
    url: `/api/users/${id}/password`,
    method: 'put',
    data: { password }
  })
}

// 获取用户积分记录
export const getUserPointsHistory = (userId: number, params?: any) => {
  return request({
    url: `/api/users/${userId}/points-history`,
    method: 'get',
    params
  })
}

// 发放用户积分
export const grantUserPoints = (userId: number, points: number, reason: string) => {
  return request({
    url: `/api/users/${userId}/points`,
    method: 'post',
    data: { points, reason }
  })
}

// 扣除用户积分
export const deductUserPoints = (userId: number, points: number, reason: string) => {
  return request({
    url: `/api/users/${userId}/points/deduct`,
    method: 'post',
    data: { points, reason }
  })
}

// 获取用户关系列表
export const getUserRelationList = (params: any) => {
  return request({
    url: '/api/user-relations',
    method: 'get',
    params
  })
}

// 创建用户关系
export const createUserRelation = (data: Partial<UserRelation>) => {
  return request({
    url: '/api/user-relations',
    method: 'post',
    data
  })
}

// 删除用户关系
export const deleteUserRelation = (id: number) => {
  return request({
    url: `/api/user-relations/${id}`,
    method: 'delete'
  })
}

// 获取用户足迹列表
export const getUserFootprintList = (params: any) => {
  return request({
    url: '/api/user-footprints',
    method: 'get',
    params
  })
}

// 获取用户足迹详情
export const getUserFootprintDetail = (id: number) => {
  return request({
    url: `/api/user-footprints/${id}`,
    method: 'get'
  })
}

// 删除用户足迹
export const deleteUserFootprint = (id: number) => {
  return request({
    url: `/api/user-footprints/${id}`,
    method: 'delete'
  })
}

// 获取用户统计数据
export const getUserStats = () => {
  return request({
    url: '/api/users/stats',
    method: 'get'
  })
}

// 获取用户等级配置
export const getUserLevelConfig = () => {
  return request({
    url: '/api/user-levels',
    method: 'get'
  })
}

// 更新用户等级配置
export const updateUserLevelConfig = (data: any) => {
  return request({
    url: '/api/user-levels',
    method: 'put',
    data
  })
}

// 批量导入用户
export const importUsers = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/api/users/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 导出用户数据
export const exportUsers = (params?: any) => {
  return request({
    url: '/api/users/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 发送系统消息给用户
export const sendMessageToUser = (userId: number, title: string, content: string) => {
  return request({
    url: `/api/users/${userId}/message`,
    method: 'post',
    data: { title, content }
  })
}

// 批量发送系统消息
export const sendMessageToUsers = (userIds: number[], title: string, content: string) => {
  return request({
    url: '/api/users/batch-message',
    method: 'post',
    data: { userIds, title, content }
  })
}