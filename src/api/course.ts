import request from '@/utils/request'

// 课程接口类型定义
export interface Course {
  id: number
  title: string
  description: string
  categoryId: number
  categoryName: string
  price: number
  originalPrice: number
  coverImage: string
  images: string[]
  duration: number
  difficulty: string
  status: number
  enrollCount: number
  viewCount: number
  rating: number
  tags: string[]
  instructor: string
  instructorAvatar: string
  createTime: string
  updateTime: string
}

export interface CourseCategory {
  id: number
  name: string
  description: string
  sort: number
  status: number
  courseCount: number
  createTime: string
}

export interface CourseSchedule {
  id: number
  courseId: number
  courseName: string
  startTime: string
  endTime: string
  location: string
  maxStudents: number
  enrolledStudents: number
  status: number
  createTime: string
}

// 获取课程列表
export const getCourseList = (params: any) => {
  return request({
    url: '/api/courses',
    method: 'get',
    params
  })
}

// 获取课程详情
export const getCourseDetail = (id: number) => {
  return request({
    url: `/api/courses/${id}`,
    method: 'get'
  })
}

// 创建课程
export const createCourse = (data: Partial<Course>) => {
  return request({
    url: '/api/courses',
    method: 'post',
    data
  })
}

// 更新课程
export const updateCourse = (id: number, data: Partial<Course>) => {
  return request({
    url: `/api/courses/${id}`,
    method: 'put',
    data
  })
}

// 删除课程
export const deleteCourse = (id: number) => {
  return request({
    url: `/api/courses/${id}`,
    method: 'delete'
  })
}

// 更新课程状态
export const updateCourseStatus = (id: number, status: number) => {
  return request({
    url: `/api/courses/${id}/status`,
    method: 'put',
    data: { status }
  })
}

// 获取课程分类列表
export const getCategoryList = (params?: any) => {
  return request({
    url: '/api/course-categories',
    method: 'get',
    params
  })
}

// 创建课程分类
export const createCategory = (data: Partial<CourseCategory>) => {
  return request({
    url: '/api/course-categories',
    method: 'post',
    data
  })
}

// 更新课程分类
export const updateCategory = (id: number, data: Partial<CourseCategory>) => {
  return request({
    url: `/api/course-categories/${id}`,
    method: 'put',
    data
  })
}

// 删除课程分类
export const deleteCategory = (id: number) => {
  return request({
    url: `/api/course-categories/${id}`,
    method: 'delete'
  })
}

// 获取课程日程列表
export const getCourseScheduleList = (params: any) => {
  return request({
    url: '/api/course-schedules',
    method: 'get',
    params
  })
}

// 创建课程日程
export const createCourseSchedule = (data: Partial<CourseSchedule>) => {
  return request({
    url: '/api/course-schedules',
    method: 'post',
    data
  })
}

// 更新课程日程
export const updateCourseSchedule = (id: number, data: Partial<CourseSchedule>) => {
  return request({
    url: `/api/course-schedules/${id}`,
    method: 'put',
    data
  })
}

// 删除课程日程
export const deleteCourseSchedule = (id: number) => {
  return request({
    url: `/api/course-schedules/${id}`,
    method: 'delete'
  })
}

// 获取课程统计数据
export const getCourseStats = () => {
  return request({
    url: '/api/courses/stats',
    method: 'get'
  })
}

// 批量导入课程
export const importCourses = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/api/courses/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 导出课程数据
export const exportCourses = (params?: any) => {
  return request({
    url: '/api/courses/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}