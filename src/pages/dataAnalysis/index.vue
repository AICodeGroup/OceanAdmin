<template>
  <div class="app-container">
    <div class="page-header">
      <h1>数据分析</h1>
    </div>

    <!-- 概览数据卡片 -->
    <div class="stats-overview">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon users">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ overviewData.totalUsers || 0 }}</div>
              <div class="stat-label">总用户数</div>
              <div class="stat-sub">
                今日新增: {{ overviewData.todayNewUsers || 0 }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon active">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ overviewData.todayActiveUsers || 0 }}</div>
              <div class="stat-label">今日活跃用户</div>
              <div class="stat-sub">
                增长率: {{ overviewData.userGrowthRate || 0 }}%
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon enroll">
              <el-icon><Reading /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ overviewData.totalEnrolls || 0 }}</div>
              <div class="stat-label">总报名数</div>
              <div class="stat-sub">
                今日报名: {{ overviewData.todayEnrolls || 0 }}
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
              <div class="stat-number">{{ overviewData.totalOrders || 0 }}</div>
              <div class="stat-label">总订单数</div>
              <div class="stat-sub">
                增长率: {{ overviewData.orderGrowthRate || 0 }}%
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 时间范围选择 -->
    <div class="card-container">
      <el-form :model="queryForm" :inline="true" class="date-form">
        <el-form-item label="时间类型">
          <el-select v-model="queryForm.timeType" placeholder="请选择" @change="handleTimeTypeChange">
            <el-option label="按日统计" value="day" />
            <el-option label="按周统计" value="week" />
            <el-option label="按月统计" value="month" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="queryForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 趋势图表 -->
    <div v-loading="loading" class="chart-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h3>用户注册趋势</h3>
              <div class="chart-stats">
                <span>总计: {{ registerTrendData.total || 0 }}</span>
                <span>平均: {{ registerTrendData.average || 0 }}</span>
                <span>增长率: {{ registerTrendData.growthRate || 0 }}%</span>
              </div>
            </div>
            <div ref="registerChartRef" class="chart"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h3>用户访问趋势</h3>
              <div class="chart-stats">
                <span>总计: {{ visitTrendData.total || 0 }}</span>
                <span>平均: {{ visitTrendData.average || 0 }}</span>
                <span>增长率: {{ visitTrendData.growthRate || 0 }}%</span>
              </div>
            </div>
            <div ref="visitChartRef" class="chart"></div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h3>用户报名趋势</h3>
              <div class="chart-stats">
                <span>总计: {{ enrollTrendData.total || 0 }}</span>
                <span>平均: {{ enrollTrendData.average || 0 }}</span>
                <span>增长率: {{ enrollTrendData.growthRate || 0 }}%</span>
              </div>
            </div>
            <div ref="enrollChartRef" class="chart"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h3>用户购物趋势</h3>
              <div class="chart-stats">
                <span>总计: {{ orderTrendData.total || 0 }}</span>
                <span>平均: {{ orderTrendData.average || 0 }}</span>
                <span>增长率: {{ orderTrendData.growthRate || 0 }}%</span>
              </div>
            </div>
            <div ref="orderChartRef" class="chart"></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  User, 
  UserFilled, 
  Reading, 
  ShoppingCart,
  Search,
  Refresh
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import {
  getOverview,
  getRegisterTrend,
  getVisitTrend,
  getEnrollTrend,
  getOrderTrend
} from '@/api/dataAnalysis'

// 概览数据
const overviewData = ref<any>({})

// 查询表单
const queryForm = ref({
  timeType: 'day',
  dateRange: null as any
})

// 加载状态
const loading = ref(false)

// 趋势数据
const registerTrendData = ref<any>({})
const visitTrendData = ref<any>({})
const enrollTrendData = ref<any>({})
const orderTrendData = ref<any>({})

// 图表引用
const registerChartRef = ref<HTMLElement>()
const visitChartRef = ref<HTMLElement>()
const enrollChartRef = ref<HTMLElement>()
const orderChartRef = ref<HTMLElement>()

// 图表实例
let registerChart: echarts.ECharts | null = null
let visitChart: echarts.ECharts | null = null
let enrollChart: echarts.ECharts | null = null
let orderChart: echarts.ECharts | null = null

// 加载概览数据
const loadOverviewData = async () => {
  try {
    const data = await getOverview()
    console.log('概览数据响应:', data)
    overviewData.value = data
    console.log('概览数据已更新:', overviewData.value)
  } catch (error) {
    console.error('加载概览数据失败:', error)
    ElMessage.error('加载概览数据失败')
  }
}

// 加载趋势数据
const loadTrendData = async () => {
  const params: any = {
    timeType: queryForm.value.timeType
  }
  
  if (queryForm.value.dateRange && queryForm.value.dateRange.length === 2) {
    params.startDate = queryForm.value.dateRange[0]
    params.endDate = queryForm.value.dateRange[1]
  }

  loading.value = true
  try {
    console.log('开始加载趋势数据，参数:', params)
    
    // 加载用户注册趋势
    const registerData = await getRegisterTrend(params)
    console.log('注册趋势响应:', registerData)
    registerTrendData.value = registerData
    console.log('注册图表实例:', registerChart)
    renderChart(registerChart, registerData, '#5470c6')

    // 加载用户访问趋势
    const visitData = await getVisitTrend(params)
    console.log('访问趋势响应:', visitData)
    visitTrendData.value = visitData
    renderChart(visitChart, visitData, '#91cc75')

    // 加载用户报名趋势
    const enrollData = await getEnrollTrend(params)
    console.log('报名趋势响应:', enrollData)
    enrollTrendData.value = enrollData
    renderChart(enrollChart, enrollData, '#fac858')

    // 加载用户购物趋势
    const orderData = await getOrderTrend(params)
    console.log('购物趋势响应:', orderData)
    orderTrendData.value = orderData
    renderChart(orderChart, orderData, '#ee6666')
    
    console.log('趋势数据加载完成')
  } catch (error) {
    console.error('加载趋势数据失败:', error)
    ElMessage.error('加载趋势数据失败')
  } finally {
    loading.value = false
  }
}

// 渲染图表
const renderChart = (chart: echarts.ECharts | null, data: any, color: string) => {
  console.log('渲染图表:', { chart, data, color })
  if (!chart || !data) {
    console.warn('图表实例或数据为空，跳过渲染')
    return
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      },
      formatter: (params: any) => {
        const param = params[0]
        return `${param.name}<br/>${param.seriesName}: ${param.value}`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.labels || [],
      axisLabel: {
        rotate: 45,
        interval: 'auto',
        fontSize: 11
      },
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: data.dataTypeName || '数据',
        type: 'line',
        smooth: true,
        data: data.values || [],
        symbolSize: 6,
        itemStyle: {
          color: color
        },
        lineStyle: {
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: color + '40' },
            { offset: 1, color: color + '10' }
          ])
        }
      }
    ]
  }

  chart.setOption(option, true)
}

// 初始化图表
const initCharts = () => {
  console.log('开始初始化图表')
  nextTick(() => {
    console.log('nextTick 执行')
    if (registerChartRef.value) {
      registerChart = echarts.init(registerChartRef.value)
      console.log('注册图表初始化完成:', registerChart)
    } else {
      console.warn('注册图表DOM未找到')
    }
    
    if (visitChartRef.value) {
      visitChart = echarts.init(visitChartRef.value)
      console.log('访问图表初始化完成:', visitChart)
    } else {
      console.warn('访问图表DOM未找到')
    }
    
    if (enrollChartRef.value) {
      enrollChart = echarts.init(enrollChartRef.value)
      console.log('报名图表初始化完成:', enrollChart)
    } else {
      console.warn('报名图表DOM未找到')
    }
    
    if (orderChartRef.value) {
      orderChart = echarts.init(orderChartRef.value)
      console.log('购物图表初始化完成:', orderChart)
    } else {
      console.warn('购物图表DOM未找到')
    }

    // 窗口大小改变时重新调整图表
    window.addEventListener('resize', handleResize)
    
    console.log('所有图表初始化完成，准备加载数据')
    // 图表初始化完成后加载数据
    loadTrendData()
  })
}

// 处理窗口大小变化
const handleResize = () => {
  registerChart?.resize()
  visitChart?.resize()
  enrollChart?.resize()
  orderChart?.resize()
}

// 处理查询
const handleQuery = () => {
  loadTrendData()
}

// 处理重置
const handleReset = () => {
  queryForm.value = {
    timeType: 'day',
    dateRange: null
  }
  loadTrendData()
}

// 处理时间类型变化
const handleTimeTypeChange = () => {
  queryForm.value.dateRange = null
}

// 组件挂载
onMounted(() => {
  console.log('组件已挂载，开始加载数据')
  loadOverviewData()
  initCharts()
})

// 组件卸载
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  registerChart?.dispose()
  visitChart?.dispose()
  enrollChart?.dispose()
  orderChart?.dispose()
})
</script>

<style scoped lang="scss">
.app-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
  
  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin: 0;
  }
}

.stats-overview {
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;

    .el-icon {
      font-size: 28px;
      color: #fff;
    }

    &.users {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    &.active {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    &.enroll {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    &.orders {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }
  }

  .stat-content {
    flex: 1;

    .stat-number {
      font-size: 28px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 14px;
      color: #909399;
      margin-bottom: 5px;
    }

    .stat-sub {
      font-size: 12px;
      color: #606266;
    }
  }
}

.card-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

  .date-form {
    margin: 0;

    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }
}

.chart-container {
  .chart-card {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #ebeef5;

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        margin: 0;
      }

      .chart-stats {
        display: flex;
        gap: 20px;

        span {
          font-size: 13px;
          color: #606266;
        }
      }
    }

    .chart {
      width: 100%;
      height: 350px;
    }
  }
}
</style>
