import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { login, logout, getInfo } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getToken())
  const name = ref('')
  const avatar = ref('')
  const roles = ref<string[]>([])
  const routes = ref<any[]>([
    {
      path: '/dashboard',
      name: 'Dashboard',
      meta: { title: '仪表盘', icon: 'DataAnalysis', affix: true }
    },
    {
      path: '/banner',
      name: 'Banner',
      meta: { title: '轮播图管理', icon: 'Picture' },
      children: [
        {
          path: 'list',
          name: 'BannerList',
          meta: { title: '轮播图列表', icon: 'List' }
        }
      ]
    },
    {
      path: '/course',
      name: 'Course',
      meta: { title: '课程管理', icon: 'Reading' },
      children: [
        {
          path: 'list',
          name: 'CourseList',
          meta: { title: '课程列表', icon: 'List' }
        },
        {
          path: 'category',
          name: 'CourseCategory',
          meta: { title: '课程分类', icon: 'Menu' }
        }
      ]
    },
    {
      path: '/order',
      name: 'Order',
      meta: { title: '订单管理', icon: 'ShoppingCart' },
      children: [
        {
          path: 'list',
          name: 'OrderList',
          meta: { title: '订单列表', icon: 'List' }
        }
      ]
    },
    {
      path: '/user',
      name: 'User',
      meta: { title: '用户管理', icon: 'User' },
      children: [
        {
          path: 'list',
          name: 'UserList',
          meta: { title: '用户列表', icon: 'UserFilled' }
        }
      ]
    },
    {
      path: '/integral',
      name: 'Integral',
      meta: { title: '积分管理', icon: 'Coin' },
      children: [
        {
          path: 'rules',
          name: 'IntegralRules',
          meta: { title: '积分规则', icon: 'Setting' }
        },
        {
          path: 'tasks',
          name: 'IntegralTasks',
          meta: { title: '积分任务', icon: 'List' }
        },
        {
          path: 'mall',
          name: 'IntegralMall',
          meta: { title: '积分商城', icon: 'ShoppingBag' }
        },
        {
          path: 'records',
          name: 'IntegralRecords',
          meta: { title: '积分记录', icon: 'Document' }
        }
      ]
    },
    {
      path: '/schedule',
      name: 'Schedule',
      meta: { title: '日程管理', icon: 'Calendar' },
      children: [
        {
          path: 'list',
          name: 'ScheduleList',
          meta: { title: '日程列表', icon: 'List' }
        }
      ]
    },
    {
      path: '/footprint',
      name: 'Footprint',
      meta: { title: '足迹管理', icon: 'Location' },
      children: [
        {
          path: 'list',
          name: 'FootprintList',
          meta: { title: '足迹列表', icon: 'List' }
        }
      ]
    },
    {
      path: '/content',
      name: 'Content',
      meta: { title: '内容审核', icon: 'Document' },
      children: [
        {
          path: 'audit',
          name: 'ContentAudit',
          meta: { title: '内容审核', icon: 'View' }
        }
      ]
    },
    {
      path: '/badge',
      name: 'Badge',
      meta: { title: '徽章管理', icon: 'Medal' },
      children: [
        {
          path: 'list',
          name: 'BadgeList',
          meta: { title: '徽章列表', icon: 'List' }
        }
      ]
    },
    {
      path: '/species',
      name: 'Species',
      meta: { title: '物种管理', icon: 'Cherry' },
      children: [
        {
          path: 'list',
          name: 'SpeciesList',
          meta: { title: '物种列表', icon: 'List' }
        }
      ]
    },
    {
      path: '/statistics',
      name: 'Statistics',
      meta: { title: '数据统计', icon: 'DataAnalysis' },
      children: [
        {
          path: 'overview',
          name: 'StatisticsOverview',
          meta: { title: '数据概览', icon: 'DataBoard' }
        }
      ]
    },
    {
      path: '/system',
      name: 'System',
      meta: { title: '系统配置', icon: 'Setting' },
      children: [
        {
          path: 'config',
          name: 'SystemConfig',
          meta: { title: '系统配置', icon: 'Tools' }
        }
      ]
    }
  ])
  const userInfo = ref({
    name: '',
    avatar: '',
    roles: []
  })

  // 登录
  const loginAction = async (loginForm: any) => {
    try {
      // 临时模拟登录成功，避免后端连接错误
      // const { data } = await login(loginForm)
      // token.value = data.token
      // setToken(data.token)
      
      // 模拟登录成功
      const mockToken = 'mock-token-' + Date.now()
      token.value = mockToken
      setToken(mockToken)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // 获取用户信息
  const getUserInfoAction = async () => {
    try {
      // 临时模拟用户信息，避免后端连接错误
      // const { data } = await getInfo()
      // name.value = data.name
      // avatar.value = data.avatar
      // roles.value = data.roles
      
      // 模拟用户信息
      name.value = 'Admin'
      avatar.value = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
      roles.value = ['admin']
      
      // 更新 userInfo
      userInfo.value = {
        name: name.value,
        avatar: avatar.value,
        roles: roles.value
      }
      
      return Promise.resolve({ name: name.value, avatar: avatar.value, roles: roles.value })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // 登出
  const logoutAction = async () => {
    try {
      // 临时跳过后端登出请求，避免后端连接错误
      // await logout()
      token.value = ''
      name.value = ''
      avatar.value = ''
      roles.value = []
      userInfo.value = {
        name: '',
        avatar: '',
        roles: []
      }
      removeToken()
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // 重置token
  const resetToken = () => {
    token.value = ''
    name.value = ''
    avatar.value = ''
    roles.value = []
    userInfo.value = {
      name: '',
      avatar: '',
      roles: []
    }
    removeToken()
  }

  return {
    token,
    name,
    avatar,
    roles,
    routes,
    userInfo,
    login: loginAction,
    getUserInfo: getUserInfoAction,
    logout: logoutAction,
    resetToken
  }
})