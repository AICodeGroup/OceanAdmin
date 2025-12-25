<template>
  <div class="statistics-container">
    <!-- 操作栏 -->
    <el-card shadow="never" class="mb-4">
      <div class="flex justify-between items-center">
        <span class="text-lg font-bold">订单统计</span>
        <el-button type="primary" :loading="exportLoading" @click="handleExport">
          <el-icon><Download /></el-icon>
          导出订单数据
        </el-button>
      </div>
    </el-card>

    <!-- 综合统计 - 顶部卡片 -->
    <el-row :gutter="16" class="mb-4">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon total">
              <el-icon size="28"><ShoppingCart /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">总订单数</div>
              <div class="stat-value">{{ allStats.totalOrders }}</div>
              <div class="stat-trend">
                <span class="trend-label">今日</span>
                <span class="trend-value">+{{ allStats.todayOrders }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon success">
              <el-icon size="28"><SuccessFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">已支付订单</div>
              <div class="stat-value">{{ allStats.paidOrders }}</div>
              <div class="stat-trend success">
                <span class="trend-label">已支付金额</span>
                <span class="trend-value">¥{{ allStats.paidAmount }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon warning">
              <el-icon size="28"><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">待支付订单</div>
              <div class="stat-value">{{ allStats.pendingPaymentOrders }}</div>
              <div class="stat-trend warning">
                <span class="trend-label">待支付金额</span>
                <span class="trend-value">¥{{ allStats.pendingAmount }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon primary">
              <el-icon size="28"><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">订单总金额</div>
              <div class="stat-value">¥{{ allStats.totalAmount }}</div>
              <div class="stat-trend primary">
                <span class="trend-label">本月金额</span>
                <span class="trend-value">¥{{ allStats.monthAmount }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分类统计 -->
    <el-row :gutter="16" class="mb-4">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon><Reading /></el-icon>
              <span class="title">课程订单统计</span>
            </div>
          </template>
          <div class="category-stats">
            <el-row :gutter="16">
              <el-col :span="12">
                <div class="stat-box">
                  <div class="box-label">订单数量</div>
                  <div class="box-value">{{ courseStats.totalOrders }}</div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="stat-box">
                  <div class="box-label">订单金额</div>
                  <div class="box-value primary">¥{{ courseStats.totalAmount }}</div>
                </div>
              </el-col>
            </el-row>
            <el-divider />
            <el-row :gutter="16" class="mini-stats">
              <el-col :span="6">
                <div class="mini-stat">
                  <div class="mini-label">待支付</div>
                  <div class="mini-value warning">{{ courseStats.pendingPaymentOrders }}</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="mini-stat">
                  <div class="mini-label">已支付</div>
                  <div class="mini-value success">{{ courseStats.paidOrders }}</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="mini-stat">
                  <div class="mini-label">已取消</div>
                  <div class="mini-value info">{{ courseStats.cancelledOrders }}</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="mini-stat">
                  <div class="mini-label">已退款</div>
                  <div class="mini-value danger">{{ courseStats.refundedOrders }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon><ShoppingBag /></el-icon>
              <span class="title">实体商品订单统计</span>
            </div>
          </template>
          <div class="category-stats">
            <el-row :gutter="16">
              <el-col :span="12">
                <div class="stat-box">
                  <div class="box-label">订单数量</div>
                  <div class="box-value">{{ entityStats.totalOrders }}</div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="stat-box">
                  <div class="box-label">订单金额</div>
                  <div class="box-value primary">¥{{ entityStats.totalAmount }}</div>
                </div>
              </el-col>
            </el-row>
            <el-divider />
            <el-row :gutter="16" class="mini-stats">
              <el-col :span="6">
                <div class="mini-stat">
                  <div class="mini-label">待支付</div>
                  <div class="mini-value warning">{{ entityStats.pendingPaymentOrders }}</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="mini-stat">
                  <div class="mini-label">已支付</div>
                  <div class="mini-value success">{{ entityStats.paidOrders }}</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="mini-stat">
                  <div class="mini-label">已取消</div>
                  <div class="mini-value info">{{ entityStats.cancelledOrders }}</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="mini-stat">
                  <div class="mini-label">已退款</div>
                  <div class="mini-value danger">{{ entityStats.refundedOrders }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 时间统计 -->
    <el-card shadow="hover" class="mb-4">
      <template #header>
        <div class="card-header">
          <el-icon><DataAnalysis /></el-icon>
          <span class="title">时间统计</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="time-stat-card today">
            <div class="time-stat-header">
              <el-icon size="20"><Clock /></el-icon>
              <span>今日数据</span>
            </div>
            <div class="time-stat-body">
              <div class="time-stat-item">
                <span class="label">新增订单</span>
                <span class="value">{{ allStats.todayOrders }} 单</span>
              </div>
              <div class="time-stat-item">
                <span class="label">订单金额</span>
                <span class="value primary">¥{{ allStats.todayAmount }}</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="time-stat-card week">
            <div class="time-stat-header">
              <el-icon size="20"><Calendar /></el-icon>
              <span>本周数据</span>
            </div>
            <div class="time-stat-body">
              <div class="time-stat-item">
                <span class="label">新增订单</span>
                <span class="value">{{ allStats.weekOrders }} 单</span>
              </div>
              <div class="time-stat-item">
                <span class="label">订单金额</span>
                <span class="value primary">¥{{ allStats.weekAmount }}</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="time-stat-card month">
            <div class="time-stat-header">
              <el-icon size="20"><Calendar /></el-icon>
              <span>本月数据</span>
            </div>
            <div class="time-stat-body">
              <div class="time-stat-item">
                <span class="label">新增订单</span>
                <span class="value">{{ allStats.monthOrders }} 单</span>
              </div>
              <div class="time-stat-item">
                <span class="label">订单金额</span>
                <span class="value primary">¥{{ allStats.monthAmount }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 最近订单 -->
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon><List /></el-icon>
          <span class="ml-2">最近订单</span>
        </div>
      </template>
      <el-table :data="recentOrders" v-loading="loading" style="width: 100%">
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="orderType" label="订单类型" width="120">
          <template #default="{ row }">
            <el-tag :type="row.orderType === 0 ? 'primary' : 'success'">
              {{ row.orderType === 0 ? '课程订单' : '实体商品' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="productName" label="商品/课程" width="200" />
        <el-table-column prop="payAmount" label="金额" width="100">
          <template #default="{ row }">
            ¥{{ row.payAmount }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ formatStatus(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Reading, 
  ShoppingBag, 
  DataAnalysis, 
  ShoppingCart, 
  Clock, 
  SuccessFilled, 
  Money,
  List,
  Calendar,
  Download
} from '@element-plus/icons-vue'
import { getCourseOrderStatistics, getEntityOrderStatistics, getAllOrderStatistics, getCourseOrderList, getEntityOrderList } from '@/api/order'
import { exportOrderStatistics } from '@/utils/export'

const loading = ref(false)
const exportLoading = ref(false)
const courseOrders = ref<any[]>([])
const entityOrders = ref<any[]>([])

// 全部订单统计数据（综合）
const allStats = ref({
  totalOrders: 0,
  pendingPaymentOrders: 0,
  paidOrders: 0,
  cancelledOrders: 0,
  refundedOrders: 0,
  totalAmount: '0.00',
  paidAmount: '0.00',
  pendingAmount: '0.00',
  refundedAmount: '0.00',
  todayOrders: 0,
  todayAmount: '0.00',
  weekOrders: 0,
  weekAmount: '0.00',
  monthOrders: 0,
  monthAmount: '0.00'
})

// 课程订单统计数据
const courseStats = ref({
  totalOrders: 0,
  pendingPaymentOrders: 0,
  paidOrders: 0,
  cancelledOrders: 0,
  refundedOrders: 0,
  totalAmount: '0.00',
  paidAmount: '0.00',
  pendingAmount: '0.00',
  refundedAmount: '0.00'
})

// 实体商品订单统计数据
const entityStats = ref({
  totalOrders: 0,
  pendingPaymentOrders: 0,
  paidOrders: 0,
  cancelledOrders: 0,
  refundedOrders: 0,
  totalAmount: '0.00',
  paidAmount: '0.00',
  pendingAmount: '0.00',
  refundedAmount: '0.00'
})

// 最近订单（合并两类订单并排序）
const recentOrders = computed(() => {
  const course = courseOrders.value.map(o => ({ ...o, orderType: 0 }))
  const entity = entityOrders.value.map(o => ({ ...o, orderType: 1 }))
  return [...course, ...entity]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)
})

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    // 获取全部订单统计数据（使用统一接口）
    const allStatsRes: any = await getAllOrderStatistics()
    if (allStatsRes) {
      allStats.value = {
        totalOrders: allStatsRes.totalOrders || 0,
        pendingPaymentOrders: allStatsRes.pendingPaymentOrders || 0,
        paidOrders: allStatsRes.paidOrders || 0,
        cancelledOrders: allStatsRes.cancelledOrders || 0,
        refundedOrders: allStatsRes.refundedOrders || 0,
        totalAmount: allStatsRes.totalAmount || '0.00',
        paidAmount: allStatsRes.paidAmount || '0.00',
        pendingAmount: allStatsRes.pendingAmount || '0.00',
        refundedAmount: allStatsRes.refundedAmount || '0.00',
        todayOrders: allStatsRes.todayOrders || 0,
        todayAmount: allStatsRes.todayAmount || '0.00',
        weekOrders: allStatsRes.weekOrders || 0,
        weekAmount: allStatsRes.weekAmount || '0.00',
        monthOrders: allStatsRes.monthOrders || 0,
        monthAmount: allStatsRes.monthAmount || '0.00'
      }
    }
    
    // 获取课程订单统计数据
    const courseStatsRes: any = await getCourseOrderStatistics()
    if (courseStatsRes) {
      courseStats.value = {
        totalOrders: courseStatsRes.totalOrders || 0,
        pendingPaymentOrders: courseStatsRes.pendingPaymentOrders || 0,
        paidOrders: courseStatsRes.paidOrders || 0,
        cancelledOrders: courseStatsRes.cancelledOrders || 0,
        refundedOrders: courseStatsRes.refundedOrders || 0,
        totalAmount: courseStatsRes.totalAmount || '0.00',
        paidAmount: courseStatsRes.paidAmount || '0.00',
        pendingAmount: courseStatsRes.pendingAmount || '0.00',
        refundedAmount: courseStatsRes.refundedAmount || '0.00'
      }
    }
    
    // 获取实体商品订单统计数据
    const entityStatsRes: any = await getEntityOrderStatistics()
    if (entityStatsRes) {
      entityStats.value = {
        totalOrders: entityStatsRes.totalOrders || 0,
        pendingPaymentOrders: entityStatsRes.pendingPaymentOrders || 0,
        paidOrders: entityStatsRes.paidOrders || 0,
        cancelledOrders: entityStatsRes.cancelledOrders || 0,
        refundedOrders: entityStatsRes.refundedOrders || 0,
        totalAmount: entityStatsRes.totalAmount || '0.00',
        paidAmount: entityStatsRes.paidAmount || '0.00',
        pendingAmount: entityStatsRes.pendingAmount || '0.00',
        refundedAmount: entityStatsRes.refundedAmount || '0.00'
      }
    }
    
    // 获取最近订单列表
    const courseRes: any = await getCourseOrderList({ page: 1, limit: 5 })
    const entityRes: any = await getEntityOrderList({ page: 1, limit: 5 })
    courseOrders.value = courseRes?.productOrdersDetailVo || []
    entityOrders.value = entityRes?.productOrdersDetailVo || []
  } catch (error) {
    console.error('获取订单统计数据失败', error)
    ElMessage.error('获取统计数据失败')
  } finally {
    loading.value = false
  }
}

// 格式化状态
const formatStatus = (status: number) => {
  const statusMap: Record<number, string> = {
    0: '待支付',
    1: '已支付',
    2: '已取消',
  }
  return statusMap[status] || '未知'
}

// 状态标签类型
const statusType = (status: number) => {
  const typeMap: Record<number, string> = {
    0: 'warning',
    1: 'success',
    2: 'info',
  }
  return typeMap[status] || ''
}

// 初始加载
onMounted(() => {
  fetchData()
})

// 导出订单数据
const handleExport = async () => {
  exportLoading.value = true
  try {
    await exportOrderStatistics()
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}
</script>

<style scoped>
.statistics-container {
  padding: 20px;
}

.mb-4 {
  margin-bottom: 16px;
}

.ml-2 {
  margin-left: 8px;
}

.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.text-lg {
  font-size: 18px;
}

.font-bold {
  font-weight: bold;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 16px;
}

.card-header .title {
  margin-left: 8px;
}

/* 顶部统计卡片 */
.stat-card {
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  background: #ffffff !important;
  transition: all 0.3s;
}

.stat-card :deep(.el-card) {
  background: #ffffff !important;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #d1d5db;
}

.stat-card :deep(.el-card__body) {
  padding: 20px;
  background: #ffffff !important;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.stat-icon.total {
  background: #f0f2ff;
  color: #667eea;
}

.stat-icon.success {
  background: #f0fdf4;
  color: #22c55e;
}

.stat-icon.warning {
  background: #fef3e2;
  color: #f59e0b;
}

.stat-icon.primary {
  background: #e0f2fe;
  color: #0ea5e9;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #606266;
}

.trend-label {
  margin-right: 4px;
  color: #909399;
}

.trend-value {
  font-weight: 600;
}

.stat-trend.success .trend-value {
  color: #22c55e;
}

.stat-trend.warning .trend-value {
  color: #f59e0b;
}

.stat-trend.primary .trend-value {
  color: #0ea5e9;
}

/* 分类统计 */
.category-stats {
  padding: 10px 0;
}

.stat-box {
  text-align: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.box-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 10px;
}

.box-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
}

.box-value.primary {
  color: #0ea5e9;
}

.mini-stats {
  margin-top: 10px;
}

.mini-stat {
  text-align: center;
  padding: 10px 0;
}

.mini-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 6px;
}

.mini-value {
  font-size: 22px;
  font-weight: bold;
  color: #303133;
}

.mini-value.warning {
  color: #f59e0b;
}

.mini-value.success {
  color: #22c55e;
}

.mini-value.info {
  color: #909399;
}

.mini-value.danger {
  color: #ef4444;
}

/* 时间统计卡片 */
.time-stat-card {
  padding: 24px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.time-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.time-stat-card.today {
  border-left: 4px solid #667eea;
  background: #fafbff;
}

.time-stat-card.week {
  border-left: 4px solid #0ea5e9;
  background: #f8fcff;
}

.time-stat-card.month {
  border-left: 4px solid #22c55e;
  background: #f8fef9;
}

.time-stat-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.time-stat-header span {
  margin-left: 8px;
}

.time-stat-card.today .time-stat-header {
  color: #667eea;
}

.time-stat-card.week .time-stat-header {
  color: #0ea5e9;
}

.time-stat-card.month .time-stat-header {
  color: #22c55e;
}

.time-stat-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-stat-item .label {
  font-size: 14px;
  color: #909399;
}

.time-stat-item .value {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.time-stat-item .value.primary {
  color: #0ea5e9;
}
</style>
