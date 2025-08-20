import request from '@/utils/request'

// 定义从后端获取的任务数据结构
export interface Task {
  id: number
  taskName: string
  points: number
  icon: string
  status: number
  created_at: string
  // ...可以根据您的 Task 实体类补充其他字段
}

// 定义分页查询结果的结构
export interface TaskPageResultVo {
  taskList: Task[]
  total: number
}

// 定义分页查询的参数类型
interface TaskListParams {
  currentPage: number
  pageSize: number
  searchForm: any
}

/**
 * @description 查看所有每日任务，包含所有状态
 * @param params 包含 currentPage 和 pageSize
 */
export function getAllDailyTask(condition: TaskListParams) {
  // 这里的返回值类型是 Promise<TaskPageResultVo>
  // 因为 request.ts 中的响应拦截器已经处理了外层的 CommonResult
  return request<TaskPageResultVo>({
    // 重要：请将这里的 /task 替换为您 Controller 类上的 @RequestMapping 值
    // 如果没有类级别的 @RequestMapping，请直接使用 /getAllTask
    url: '/admin/platform/getAllTask',
    method: 'post',
    params:{
        currentPage:condition.currentPage,
        pageSize:condition.pageSize,
    },
    data: condition.searchForm
  })
}
interface UpdateTaskParams {
    updateVo: any
}
export function updateTask(condition: UpdateTaskParams) {
    // 这里的返回值类型是 Promise<TaskPageResultVo>
    // 因为 request.ts 中的响应拦截器已经处理了外层的 CommonResult
    return request<TaskPageResultVo>({
      // 重要：请将这里的 /task 替换为您 Controller 类上的 @RequestMapping 值
      // 如果没有类级别的 @RequestMapping，请直接使用 /getAllTask
      url: '/admin/platform/updateTaskById',
      method: 'patch',
      data: condition.updateVo
    })
  }

  export function deleteTask(taskId:number) {
    // 这里的返回值类型是 Promise<TaskPageResultVo>
    // 因为 request.ts 中的响应拦截器已经处理了外层的 CommonResult
    return request<TaskPageResultVo>({
      // 重要：请将这里的 /task 替换为您 Controller 类上的 @RequestMapping 值
      // 如果没有类级别的 @RequestMapping，请直接使用 /getAllTask
      url: '/admin/platform/deleteTask/'+taskId,
      method: 'delete',
    })
  }

  export function createTask(task:Task) {
    // 这里的返回值类型是 Promise<TaskPageResultVo>
    // 因为 request.ts 中的响应拦截器已经处理了外层的 CommonResult
    return request<TaskPageResultVo>({
      // 重要：请将这里的 /task 替换为您 Controller 类上的 @RequestMapping 值
      // 如果没有类级别的 @RequestMapping，请直接使用 /getAllTask
      url: '/admin/platform/addTaskList',
      method: 'post',
      data: task
    })
  }
