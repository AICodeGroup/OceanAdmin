import request from '@/utils/request'

// Get contact info list
export function getContactList(params: any) {
  return request({
    url: '/admin/platform/contact/list',
    method: 'get',
    params
  })
}

// Get contact info detail
export function getContactDetail(id: number) {
  return request({
    url: `/admin/platform/contact/detail/${id}`,
    method: 'get'
  })
}

// Add contact info
export function addContact(data: any) {
  return request({
    url: '/admin/platform/contact/add',
    method: 'post',
    data
  })
}

// Update contact info
export function updateContact(data: any) {
  return request({
    url: '/admin/platform/contact/update',
    method: 'post',
    data
  })
}

// Delete contact info
export function deleteContact(id: number) {
  return request({
    url: `/admin/platform/contact/delete/${id}`,
    method: 'delete'
  })
}

// Update contact status
export function updateContactStatus(id: number, status: boolean) {
  return request({
    url: `/admin/platform/contact/status/${id}/${status}`,
    method: 'put'
  })
}
