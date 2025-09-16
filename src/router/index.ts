import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
// import Layout from '../layout/index.vue'
import Layout from '@/layout/index.vue'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/index.vue'),
    meta: { title: '登录', hidden: true }
  },

  {
    path: '/',
    component: Layout,
    redirect: '/newCourse',
    children: [
      {
        path: 'newCourse',
        name: 'newCourse',
        component: () => import('@/pages/newCourse/newCourseList.vue'),
        meta: { title: '课程列表', icon: 'Coin' }
      }
    ]
  },
  {
    path: '/newBadge',
    component: Layout,
    redirect: '/newBadge/list',
    name: 'newBadge',
    meta: { title: '徽章管理', icon: 'Medal' },
    children: [
      {
        path: 'list',
        name: 'newBadgeList',
        component: () => import('@/pages/newBadge/newBadgeList.vue'),
        meta: { title: '徽章授予', icon: 'List' }
      },
      {
        path: 'badgeAdmin',
        name: 'badgeAdmin',
        component: () => import('@/pages/newBadge/badgeAdmin.vue'),
        meta: { title: '徽章管理', icon: 'List' }
      },
    ]
  },
  {
    path: '/newBanner',
    component: Layout,
    redirect: '/newBanner/newBannerList',
    name: 'newBanner',
    meta: { title: '轮播图管理', icon: 'Medal' },
    children: [
      {
        path: 'newBannerList',
        name: 'newBannerList',
        component: () => import('@/pages/newBanner/newBannerList.vue'),
        meta: { title: '轮播图管理', icon: 'List' }
      },
    ]
  },
  {
    path: '/course',
    component: Layout,
    redirect: '/course/list',
    name: 'Course',
    meta: { title: '课程管理', icon: 'Reading' },
    children: [
      {
        path: 'list',
        name: 'CourseList',
        component: () => import('@/pages/course/list.vue'),
        meta: { title: '课程列表', icon: 'List' }
      },
      {
        path: 'category',
        name: 'CourseCategory',
        component: () => import('@/pages/course/category.vue'),
        meta: { title: '课程分类', icon: 'Menu' }
      }
    ]
  },
  {
    path: '/task',
    component: Layout,
    redirect: '/task/list',
    name: 'task',
    meta: { title: '日常任务管理', icon: 'Calendar' },
    children: [
      {
        path: 'list',
        name: 'TaskList',
        component: () => import('@/pages/task/list.vue'),
        meta: { title: '日常任务列表', icon: 'List' }
      }
    ]
  },
  {
    path: '/newOrder',
    component: Layout,
    redirect: '/newOrder/orderList',
    name: 'newOrder',
    meta: { title: '订单管理', icon: 'ShoppingCart' },
    children: [
      {
        path: 'orderList',
        name: 'orderList',
        component: () => import('@/pages/newOrder/orderList.vue'),
        meta: { title: '订单列表', icon: 'List' }
      }
    ]
  },  
  {
    path: '/newIntegral',
    component: Layout,
    redirect: '/newIntegral/integralAdmin',
    name: 'newIntegral',
    meta: { title: '积分增减', icon: 'Coin' },
    children: [
      {
        path: 'integralAdmin',
        name: 'integralAdmin',
        component: () => import('@/pages/newIntegral/integralAdmin.vue'),
        meta: { title: '积分增减', icon: 'Coin' }
      }
    ]
  },
  {
    path: '/newCourse',
    component: Layout,
    redirect: '/newCourse/newCourseList',
    name: 'newCourse',
    meta: { title: '课程管理', icon: 'Coin' },
    children: [
      {
        path: 'newCourseList',
        name: 'newCourseList',
        component: () => import('@/pages/newCourse/newCourseList.vue'),
        meta: { title: '课程列表', icon: 'Coin' }
      }
    ]
  },
  // {
  //   path: '/order',
  //   component: Layout,
  //   redirect: '/order/list',
  //   name: 'Order',
  //   meta: { title: '订单管理', icon: 'ShoppingCart' },
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'OrderList',
  //       component: () => import('@/pages/order/list.vue'),
  //       meta: { title: '订单列表', icon: 'List' }
  //     }
  //   ]
  // },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'User',
    meta: { title: '用户管理', icon: 'User' },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/pages/user/list.vue'),
        meta: { title: '用户列表', icon: 'UserFilled' }
      }
    ]
  },
  {
    path: '/integral',
    component: Layout,
    redirect: '/integral/rules',
    name: 'Integral',
    meta: { title: '积分管理', icon: 'Coin' },
    children: [
      {
        path: 'rules',
        name: 'IntegralRules',
        component: () => import('@/pages/integral/rules.vue'),
        meta: { title: '积分规则', icon: 'Setting' }
      },
      {
        path: 'tasks',
        name: 'IntegralTasks',
        component: () => import('@/pages/integral/tasks.vue'),
        meta: { title: '积分任务', icon: 'List' }
      },
      {
        path: 'mall',
        name: 'IntegralMall',
        component: () => import('@/pages/integral/mall.vue'),
        meta: { title: '积分商城', icon: 'ShoppingBag' }
      },
      {
        path: 'records',
        name: 'IntegralRecords',
        component: () => import('@/pages/integral/records.vue'),
        meta: { title: '积分记录', icon: 'Document' }
      }
    ]
  },
  {
    path: '/schedule',
    component: Layout,
    redirect: '/schedule/list',
    name: 'Schedule',
    meta: { title: '日程管理', icon: 'Calendar' },
    children: [
      {
        path: 'list',
        name: 'ScheduleList',
        component: () => import('@/pages/schedule/list.vue'),
        meta: { title: '日程列表', icon: 'List' }
      }
    ]
  },
  {
    path: '/footprint',
    component: Layout,
    redirect: '/footprint/list',
    name: 'Footprint',
    meta: { title: '足迹管理', icon: 'Location' },
    children: [
      {
        path: 'list',
        name: 'FootprintList',
        component: () => import('@/pages/footprint/list.vue'),
        meta: { title: '足迹列表', icon: 'List' }
      }
    ]
  },
  {
    path: '/content',
    component: Layout,
    redirect: '/content/audit',
    name: 'Content',
    meta: { title: '内容审核', icon: 'Document' },
    children: [
      {
        path: 'audit',
        name: 'ContentAudit',
        component: () => import('@/pages/content/audit.vue'),
        meta: { title: '内容审核', icon: 'View' }
      }
    ]
  },
  {
    path: '/badge',
    component: Layout,
    redirect: '/badge/list',
    name: 'Badge',
    meta: { title: '徽章管理', icon: 'Medal' },
    children: [
      {
        path: 'list',
        name: 'BadgeList',
        component: () => import('@/pages/badge/list.vue'),
        meta: { title: '徽章列表', icon: 'List' }
      }
    ]
  },
  {
    path: '/species',
    component: Layout,
    redirect: '/species/list',
    name: 'Species',
    meta: { title: '物种管理', icon: 'Cherry' },
    children: [
      {
        path: 'list',
        name: 'SpeciesList',
        component: () => import('@/pages/species/list.vue'),
        meta: { title: '物种列表', icon: 'List' }
      },
      {
        path: 'category',
        name: 'SpeciesCategory',
        component: () => import('@/pages/species/category.vue'),
        meta: { title: '物种分类', icon: 'Menu' }
      },
      {
        path: 'course-relation',
        name: 'SpeciesCourseRelation',
        component: () => import('@/pages/species/course-relation.vue'),
        meta: { title: '课程关联', icon: 'Link' }
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/overview',
    name: 'Statistics',
    meta: { title: '数据统计', icon: 'DataAnalysis' },
    children: [
      {
        path: 'overview',
        name: 'StatisticsOverview',
        component: () => import('@/pages/statistics/overview.vue'),
        meta: { title: '数据概览', icon: 'DataBoard' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/config',
    name: 'System',
    meta: { title: '系统配置', icon: 'Setting' },
    children: [
      {
        path: 'config',
        name: 'SystemConfig',
        component: () => import('@/pages/system/config.vue'),
        meta: { title: '系统配置', icon: 'Tools' }
      }
    ]
  },
  {
    path: '/observe',
    component: Layout,
    redirect: '/observe/judgeObserve',
    name: 'Observe',
    meta: { title: '审核观察记录', icon: 'Reading' },
    children: [
      {
        path: 'judgeObserve',
        name: 'judgeObserve',
        component: () => import('@/pages/observe/judgeObserve.vue'),
        meta: { title: '审核观察记录', icon: 'List' }
      },
      {
        path: 'observeList',
        name: 'observeList',
        component: () => import('@/pages/observe/observeList.vue'),
        meta: { title: '观察记录列表', icon: 'Menu' }
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/pages/error/404.vue'),
    meta: { title: '404', hidden: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  
  const authStore = useAuthStore()
  const token = authStore.token
  
  if (to.path === '/login') {
    if (token) {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    if (token) {
      if (authStore.roles.length === 0) {
        try {
          await authStore.getUserInfo()
          next()
        } catch (error) {
          authStore.logout()
          ElMessage.error('获取用户信息失败，请重新登录')
          next('/login')
        }
      } else {
        next()
      }
    } else {
      next('/login')
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router