import request from '@/utils/request'

// 获取系统配置
export function getSystemConfig() {
  return request({
    url: '/system/config',
    method: 'get'
  })
}

// 更新系统配置
export function updateSystemConfig(data: any) {
  return request({
    url: '/system/config',
    method: 'put',
    data
  })
}

// 获取角色列表
export function getRoleList(params: any) {
  return request({
    url: '/system/roles',
    method: 'get',
    params
  })
}

// 创建角色
export function createRole(data: any) {
  return request({
    url: '/system/roles',
    method: 'post',
    data
  })
}

// 更新角色
export function updateRole(id: number, data: any) {
  return request({
    url: `/system/roles/${id}`,
    method: 'put',
    data
  })
}

// 删除角色
export function deleteRole(id: number) {
  return request({
    url: `/system/roles/${id}`,
    method: 'delete'
  })
}

// 获取权限列表
export function getPermissionList() {
  return request({
    url: '/system/permissions',
    method: 'get'
  })
}

// 获取菜单列表
export function getMenuList() {
  return request({
    url: '/system/menus',
    method: 'get'
  })
}

// 创建菜单
export function createMenu(data: any) {
  return request({
    url: '/system/menus',
    method: 'post',
    data
  })
}

// 更新菜单
export function updateMenu(id: number, data: any) {
  return request({
    url: `/system/menus/${id}`,
    method: 'put',
    data
  })
}

// 删除菜单
export function deleteMenu(id: number) {
  return request({
    url: `/system/menus/${id}`,
    method: 'delete'
  })
}

// 获取操作日志
export function getOperationLogs(params: any) {
  return request({
    url: '/system/operation-logs',
    method: 'get',
    params
  })
}

// 获取登录日志
export function getLoginLogs(params: any) {
  return request({
    url: '/system/login-logs',
    method: 'get',
    params
  })
}

// 清理日志
export function clearLogs(type: string) {
  return request({
    url: `/system/clear-logs/${type}`,
    method: 'delete'
  })
}

// 获取系统信息
export function getSystemInfo() {
  return request({
    url: '/system/info',
    method: 'get'
  })
}

// 系统备份
export function systemBackup() {
  return request({
    url: '/system/backup',
    method: 'post'
  })
}

// 获取备份列表
export function getBackupList() {
  return request({
    url: '/system/backups',
    method: 'get'
  })
}

// 恢复备份
export function restoreBackup(backupId: string) {
  return request({
    url: `/system/restore/${backupId}`,
    method: 'post'
  })
}

// 删除备份
export function deleteBackup(backupId: string) {
  return request({
    url: `/system/backups/${backupId}`,
    method: 'delete'
  })
}