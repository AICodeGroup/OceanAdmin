import request from '@/utils/request'

// 获取待审核内容列表
export function getContentList(params: any) {
  return request({
    url: '/content/list',
    method: 'get',
    params
  })
}

// 获取观察日记列表
export function getDiaryList(params: any) {
  return request({
    url: '/content/diary/list',
    method: 'get',
    params
  })
}

// 获取评论列表
export function getCommentList(params: any) {
  return request({
    url: '/content/comment/list',
    method: 'get',
    params
  })
}

// 获取举报列表
export function getReportList(params: any) {
  return request({
    url: '/content/report/list',
    method: 'get',
    params
  })
}

// 审核内容
export function auditContent(data: any) {
  return request({
    url: '/content/audit',
    method: 'post',
    data
  })
}

// 批量审核
export function batchAudit(data: any) {
  return request({
    url: '/content/batch-audit',
    method: 'post',
    data
  })
}

// 获取敏感词列表
export function getSensitiveWordList(params: any) {
  return request({
    url: '/content/sensitive-words',
    method: 'get',
    params
  })
}

// 添加敏感词
export function addSensitiveWord(data: any) {
  return request({
    url: '/content/sensitive-words',
    method: 'post',
    data
  })
}

// 删除敏感词
export function deleteSensitiveWord(id: number) {
  return request({
    url: `/content/sensitive-words/${id}`,
    method: 'delete'
  })
}

// 获取审核日志
export function getAuditLog(params: any) {
  return request({
    url: '/content/audit-log',
    method: 'get',
    params
  })
}