<template>
  <div class="app-container">
    <div class="page-header">
      <h1>数据统计</h1>
    </div>

    <!-- 时间选择器 -->
    <div class="card-container">
      <el-form :model="dateForm" :inline="true" class="date-form">
        <el-form-item label="统计时间">
          <el-date-picker
            v-model="dateForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="handleDateChange"
          />
        </el-form-item>
        <el-form-item label="快捷选择">
          <el-button-group>
            <el-button @click="handleQuickSelect('today')">今天</el-button>
            <el-button @click="handleQuickSelect('week')">本周</el-button>
            <el-button @click="handleQuickSelect('month')">本月</el-button>
            <el-button @click="handleQuickSelect('year')">本年</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新数据
          </el-button>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>
            导出报表
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 总体统计卡片 -->
    <div class="stats-overview">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon users">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ overallStats.totalUsers }}</div>
              <div class="stat-label">总用户数</div>
              <div class="stat-change positive">
                <el-icon><CaretTop /></el-icon>
                +{{ overallStats.userGrowth }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon courses">
              <el-icon><Reading /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ overallStats.totalCourses }}</div>
              <div class="stat-label">课程总数</div>
              <div class="stat-change positive">
                <el-icon><CaretTop /></el-icon>
                +{{ overallStats.courseGrowth }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon orders">
              <el-icon><ShoppingCart /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ overallStats.totalOrders }}</div>
              <div class="stat-label">订单总数</div>
              <div class="stat-change positive">
                <el-icon><CaretTop /></el-icon>
                +{{ overallStats.orderGrowth }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon revenue">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">¥{{ overallStats.totalRevenue }}</div>
              <div class="stat-label">总收入</div>
              <div class="stat-change positive">
                <el-icon><CaretTop /></el-icon>
                +{{ overallStats.revenueGrowth }}%
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 图表区域 -->
    <el-row :gutter="20">
      <!-- 用户增长趋势 -->
      <el-col :span="12">
        <div class="card-container">
          <div class="chart-header">
            <h3>用户增长趋势</h3>
            <el-button-group size="small">
              <el-button :type="userTrendType === 'day' ? 'primary' : ''" @click="userTrendType = 'day'">日</el-button>
              <el-button :type="userTrendType === 'week' ? 'primary' : ''" @click="userTrendType = 'week'">周</el-button>
              <el-button :type="userTrendType === 'month' ? 'primary' : ''" @click="userTrendType = 'month'">月</el-button>
            </el-button-group>
          </div>
          <div id="user-growth-chart" style="width: 100%; height: 300px;"></div>
        </div>
      </el-col>

      <!-- 课程报名统计 -->
      <el-col :span="12">
        <div class="card-container">
          <div class="chart-header">
            <h3>课程报名统计</h3>
          </div>
          <div id="course-enrollment-chart" style="width: 100%; height: 300px;"></div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!-- 订单状态分布 -->
      <el-col :span="12">
        <div class="card-container">
          <div class="chart-header">
            <h3>订单状态分布</h3>
          </div>
          <div id="order-status-chart" style="width: 100%; height: 300px;"></div>
        </div>
      </el-col>

      <!-- 积分获取方式 -->
      <el-col :span="12">
        <div class="card-container">
          <div class="chart-header">
            <h3>积分获取方式</h3>
          </div>
          <div id="integral-source-chart" style="width: 100%; height: 300px;"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 详细统计表格 -->
    <div class="card-container">
      <div class="table-header">
        <h3>详细统计数据</h3>
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane label="用户统计" name="users">
            <el-table :data="userStatsData" style="width: 100%">
              <el-table-column prop="date" label="日期" width="120" />
              <el-table-column prop="newUsers" label="新增用户" width="100" />
              <el-table-column prop="activeUsers" label="活跃用户" width="100" />
              <el-table-column prop="totalUsers" label="累计用户" width="100" />
              <el-table-column prop="retention" label="留存率" width="100">
                <template #default="scope">
                  {{ scope.row.retention }}%
                </template>
              </el-table-column>
              <el-table-column prop="avgOnlineTime" label="平均在线时长" />
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="课程统计" name="courses">
            <el-table :data="courseStatsData" style="width: 100%">
              <el-table-column prop="courseName" label="课程名称" />
              <el-table-column prop="enrollments" label="报名人数" width="100" />
              <el-table-column prop="completions" label="完成人数" width="100" />
              <el-table-column prop="completionRate" label="完成率" width="100">
                <template #default="scope">
                  {{ scope.row.completionRate }}%
                </template>
              </el-table-column>
              <el-table-column prop="rating" label="评分" width="100" />
              <el-table-column prop="revenue" label="收入" width="120">
                <template #default="scope">
                  ¥{{ scope.row.revenue }}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="订单统计" name="orders">
            <el-table :data="orderStatsData" style="width: 100%">
              <el-table-column prop="date" label="日期" width="120" />
              <el-table-column prop="totalOrders" label="总订单" width="100" />
              <el-table-column prop="paidOrders" label="已支付" width="100" />
              <el-table-column prop="cancelledOrders" label="已取消" width="100" />
              <el-table-column prop="paymentRate" label="支付率" width="100">
                <template #default="scope">
                  {{ scope.row.paymentRate }}%
                </template>
              </el-table-column>
              <el-table-column prop="totalAmount" label="总金额" width="120">
                <template #default="scope">
                  ¥{{ scope.row.totalAmount }}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="积分统计" name="integral">
            <el-table :data="integralStatsData" style="width: 100%">
              <el-table-column prop="source" label="积分来源" />
              <el-table-column prop="totalPoints" label="总积分" width="120" />
              <el-table-column prop="userCount" label="用户数" width="100" />
              <el-table-column prop="avgPoints" label="平均积分" width="120" />
              <el-table-column prop="percentage" label="占比" width="100">
                <template #default="scope">
                  {{ scope.row.percentage }}%
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 自定义报表对话框 -->
    <el-dialog
      v-model="customReportVisible"
      title="自定义报表"
      width="600px"
    >
      <el-form :model="customReportForm" label-width="120px">
        <el-form-item label="报表名称">
          <el-input v-model="customReportForm.name" placeholder="请输入报表名称" />
        </el-form-item>
        <el-form-item label="统计维度">
          <el-checkbox-group v-model="customReportForm.dimensions">
            <el-checkbox label="users">用户数据</el-checkbox>
            <el-checkbox label="courses">课程数据</el-checkbox>
            <el-checkbox label="orders">订单数据</el-checkbox>
            <el-checkbox label="integral">积分数据</el-checkbox>
            <el-checkbox label="badges">徽章数据</el-checkbox>
            <el-checkbox label="footprints">足迹数据</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="customReportForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="报表格式">
          <el-radio-group v-model="customReportForm.format">
            <el-radio label="excel">Excel</el-radio>
            <el-radio label="pdf">PDF</el-radio>
            <el-radio label="csv">CSV</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="customReportVisible = false">取消</el-button>
          <el-button type="primary" @click="handleGenerateReport">生成报表</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

// 响应式数据
const activeTab = ref('users')
const userTrendType = ref('day')
const customReportVisible = ref(false)

// 日期表单
const dateForm = reactive({
  dateRange: []
})

// 总体统计数据
const overallStats = reactive({
  totalUsers: 1256,
  userGrowth: 89,
  totalCourses: 45,
  courseGrowth: 3,
  totalOrders: 892,
  orderGrowth: 67,
  totalRevenue: 125680,
  revenueGrowth: 15.6
})

// 自定义报表表单
const customReportForm = reactive({
  name: '',
  dimensions: [],
  dateRange: [],
  format: 'excel'
})

// 用户统计数据
const userStatsData = ref([
  {
    date: '2024-01-31',
    newUsers: 25,
    activeUsers: 156,
    totalUsers: 1256,
    retention: 78.5,
    avgOnlineTime: '45分钟'
  },
  {
    date: '2024-01-30',
    newUsers: 32,
    activeUsers: 142,
    totalUsers: 1231,
    retention: 76.2,
    avgOnlineTime: '42分钟'
  },
  {
    date: '2024-01-29',
    newUsers: 18,
    activeUsers: 138,
    totalUsers: 1199,
    retention: 79.1,
    avgOnlineTime: '48分钟'
  }
])

// 课程统计数据
const courseStatsData = ref([
  {
    courseName: '海洋生物探索之旅',
    enrollments: 156,
    completions: 142,
    completionRate: 91.0,
    rating: 4.8,
    revenue: 46680
  },
  {
    courseName: '海洋环保小卫士',
    enrollments: 89,
    completions: 78,
    completionRate: 87.6,
    rating: 4.6,
    revenue: 17711
  },
  {
    courseName: '深海探险记',
    enrollments: 67,
    completions: 58,
    completionRate: 86.6,
    rating: 4.9,
    revenue: 26733
  }
])

// 订单统计数据
const orderStatsData = ref([
  {
    date: '2024-01-31',
    totalOrders: 45,
    paidOrders: 42,
    cancelledOrders: 2,
    paymentRate: 93.3,
    totalAmount: 12560
  },
  {
    date: '2024-01-30',
    totalOrders: 38,
    paidOrders: 35,
    cancelledOrders: 1,
    paymentRate: 92.1,
    totalAmount: 10450
  },
  {
    date: '2024-01-29',
    totalOrders: 52,
    paidOrders: 48,
    cancelledOrders: 3,
    paymentRate: 92.3,
    totalAmount: 15680
  }
])

// 积分统计数据
const integralStatsData = ref([
  {
    source: '课程完成',
    totalPoints: 45600,
    userCount: 456,
    avgPoints: 100,
    percentage: 45.6
  },
  {
    source: '日常签到',
    totalPoints: 23400,
    userCount: 780,
    avgPoints: 30,
    percentage: 23.4
  },
  {
    source: '活动参与',
    totalPoints: 18900,
    userCount: 315,
    avgPoints: 60,
    percentage: 18.9
  },
  {
    source: '分享推荐',
    totalPoints: 12100,
    userCount: 121,
    avgPoints: 100,
    percentage: 12.1
  }
])

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    initUserGrowthChart()
    initCourseEnrollmentChart()
    initOrderStatusChart()
    initIntegralSourceChart()
  })
}

// 用户增长趋势图
const initUserGrowthChart = () => {
  const chartDom = document.getElementById('user-growth-chart')
  if (!chartDom) return
  
  const myChart = echarts.init(chartDom)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['新增用户', '活跃用户']
    },
    xAxis: {
      type: 'category',
      data: ['01-25', '01-26', '01-27', '01-28', '01-29', '01-30', '01-31']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '新增用户',
        type: 'line',
        data: [15, 22, 18, 25, 32, 28, 25],
        smooth: true,
        itemStyle: {
          color: '#409EFF'
        }
      },
      {
        name: '活跃用户',
        type: 'line',
        data: [120, 135, 128, 142, 156, 148, 156],
        smooth: true,
        itemStyle: {
          color: '#67C23A'
        }
      }
    ]
  }
  myChart.setOption(option)
}

// 课程报名统计图
const initCourseEnrollmentChart = () => {
  const chartDom = document.getElementById('course-enrollment-chart')
  if (!chartDom) return
  
  const myChart = echarts.init(chartDom)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: ['海洋生物探索', '海洋环保小卫士', '深海探险记', '珊瑚礁保护', '海洋科普']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '报名人数',
        type: 'bar',
        data: [156, 89, 67, 45, 32],
        itemStyle: {
          color: '#E6A23C'
        }
      }
    ]
  }
  myChart.setOption(option)
}

// 订单状态分布图
const initOrderStatusChart = () => {
  const chartDom = document.getElementById('order-status-chart')
  if (!chartDom) return
  
  const myChart = echarts.init(chartDom)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '订单状态',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 756, name: '已完成' },
          { value: 89, name: '已支付' },
          { value: 32, name: '待支付' },
          { value: 15, name: '已取消' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  myChart.setOption(option)
}

// 积分获取方式图
const initIntegralSourceChart = () => {
  const chartDom = document.getElementById('integral-source-chart')
  if (!chartDom) return
  
  const myChart = echarts.init(chartDom)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '积分来源',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 45600, name: '课程完成' },
          { value: 23400, name: '日常签到' },
          { value: 18900, name: '活动参与' },
          { value: 12100, name: '分享推荐' }
        ]
      }
    ]
  }
  myChart.setOption(option)
}

// 处理日期变化
const handleDateChange = (dates: string[]) => {
  console.log('日期范围变化:', dates)
  // 重新加载数据
}

// 处理快捷选择
const handleQuickSelect = (type: string) => {
  const today = new Date()
  let startDate: Date
  let endDate = today

  switch (type) {
    case 'today':
      startDate = today
      break
    case 'week':
      startDate = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      break
    case 'year':
      startDate = new Date(today.getFullYear(), 0, 1)
      break
    default:
      return
  }

  dateForm.dateRange = [
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  ]
}

// 处理刷新数据
const handleRefresh = () => {
  ElMessage.success('数据刷新成功')
  // 重新加载所有数据
}

// 处理导出
const handleExport = () => {
  customReportVisible.value = true
}

// 处理生成报表
const handleGenerateReport = () => {
  if (!customReportForm.name) {
    ElMessage.warning('请输入报表名称')
    return
  }
  if (customReportForm.dimensions.length === 0) {
    ElMessage.warning('请选择统计维度')
    return
  }
  
  ElMessage.success('报表生成中，请稍候...')
  customReportVisible.value = false
  
  // 重置表单
  Object.assign(customReportForm, {
    name: '',
    dimensions: [],
    dateRange: [],
    format: 'excel'
  })
}

// 处理标签页切换
const handleTabChange = (tabName: string) => {
  console.log('切换到标签页:', tabName)
}

onMounted(() => {
  // 设置默认日期范围为最近7天
  handleQuickSelect('week')
  // 初始化图表
  initCharts()
})
</script>

<style lang="scss" scoped>
.date-form {
  .el-form-item {
    margin-bottom: 0;
  }
}

.stats-overview {
  margin-bottom: 20px;
  
  .stat-card {
    display: flex;
    align-items: center;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      font-size: 24px;
      color: white;
      
      &.users {
        background: #409eff;
      }
      
      &.courses {
        background: #67c23a;
      }
      
      &.orders {
        background: #e6a23c;
      }
      
      &.revenue {
        background: #f56c6c;
      }
    }
    
    .stat-content {
      flex: 1;
      
      .stat-number {
        font-size: 28px;
        font-weight: bold;
        color: #303133;
        line-height: 1;
        margin-bottom: 5px;
      }
      
      .stat-label {
        font-size: 14px;
        color: #909399;
        margin-bottom: 5px;
      }
      
      .stat-change {
        font-size: 12px;
        display: flex;
        align-items: center;
        
        &.positive {
          color: #67c23a;
        }
        
        &.negative {
          color: #f56c6c;
        }
        
        .el-icon {
          margin-right: 2px;
        }
      }
    }
  }
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
    color: #303133;
    font-size: 16px;
  }
}

.table-header {
  h3 {
    margin: 0 0 20px 0;
    color: #303133;
    font-size: 16px;
  }
}

:deep(.el-tabs__content) {
  padding-top: 0;
}
</style>