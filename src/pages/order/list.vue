<template>
  <div class="app-container">
    <div class="page-header">
      <h1>订单管理</h1>
    </div>

    <!-- 搜索区域 -->
    <div class="card-container">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待支付" :value="0" />
            <el-option label="已支付" :value="1" />
            <el-option label="已完成" :value="2" />
            <el-option label="已取消" :value="3" />
            <el-option label="已退款" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮 -->
    <div class="button-group">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        手动添加订单
      </el-button>
      <el-button type="success" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出订单
      </el-button>
      <el-button type="info" @click="handleStatistics">
        <el-icon><DataAnalysis /></el-icon>
        订单统计
      </el-button>
    </div>

    <!-- 表格 -->
    <div class="card-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="courseName" label="课程名称" />
        <el-table-column prop="amount" label="订单金额" width="120">
          <template #default="scope">
            <span class="amount">¥{{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentMethod" label="支付方式" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.paymentMethod" type="info">
              {{ getPaymentText(scope.row.paymentMethod) }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="payTime" label="支付时间" width="180">
          <template #default="scope">
            {{ scope.row.payTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleView(scope.row)">
              详情
            </el-button>
            <el-button 
              v-if="scope.row.status === 0"
              type="success" 
              size="small" 
              @click="handlePay(scope.row)"
            >
              标记支付
            </el-button>
            <el-button 
              v-if="scope.row.status === 1"
              type="warning" 
              size="small" 
              @click="handleComplete(scope.row)"
            >
              完成订单
            </el-button>
            <el-button 
              v-if="[0, 1].includes(scope.row.status)"
              type="danger" 
              size="small" 
              @click="handleCancel(scope.row)"
            >
              取消订单
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="订单详情"
      width="800px"
    >
      <div v-if="currentOrder" class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ currentOrder.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(currentOrder.status)">
              {{ getStatusText(currentOrder.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="用户名">{{ currentOrder.username }}</el-descriptions-item>
          <el-descriptions-item label="用户手机">{{ currentOrder.userPhone }}</el-descriptions-item>
          <el-descriptions-item label="课程名称">{{ currentOrder.courseName }}</el-descriptions-item>
          <el-descriptions-item label="课程价格">¥{{ currentOrder.coursePrice }}</el-descriptions-item>
          <el-descriptions-item label="优惠金额">¥{{ currentOrder.discountAmount || 0 }}</el-descriptions-item>
          <el-descriptions-item label="实付金额">¥{{ currentOrder.amount }}</el-descriptions-item>
          <el-descriptions-item label="支付方式">
            {{ currentOrder.paymentMethod ? getPaymentText(currentOrder.paymentMethod) : '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="支付流水号">{{ currentOrder.paymentNo || '-' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentOrder.createTime }}</el-descriptions-item>
          <el-descriptions-item label="支付时间">{{ currentOrder.payTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="完成时间">{{ currentOrder.completeTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ currentOrder.remark || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- 手动添加订单对话框 -->
    <el-dialog
      v-model="addVisible"
      title="手动添加订单"
      width="600px"
      @close="resetAddForm"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addRules"
        label-width="120px"
      >
        <el-form-item label="用户" prop="userId">
          <el-select v-model="addForm.userId" placeholder="请选择用户" filterable>
            <el-option
              v-for="user in userList"
              :key="user.id"
              :label="`${user.username} (${user.phone})`"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程" prop="courseId">
          <el-select v-model="addForm.courseId" placeholder="请选择课程" filterable>
            <el-option
              v-for="course in courseList"
              :key="course.id"
              :label="`${course.name} (¥${course.price})`"
              :value="course.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优惠金额" prop="discountAmount">
          <el-input-number v-model="addForm.discountAmount" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getOrderList, updateOrderStatus, deleteOrder, exportOrders } from '@/api/order'

// 响应式数据
const loading = ref(false)
const detailVisible = ref(false)
const addVisible = ref(false)
const currentOrder = ref<any>(null)
const addFormRef = ref<FormInstance>()

const tableData = ref([
  {
    id: 1,
    orderNo: 'ORD202401310001',
    username: '小海豚',
    userPhone: '13800138001',
    courseName: '海洋生物探索之旅',
    coursePrice: 299,
    discountAmount: 0,
    amount: 299,
    status: 1,
    paymentMethod: 'wechat',
    paymentNo: 'WX20240131001',
    createTime: '2024-01-31 10:30:00',
    payTime: '2024-01-31 10:35:00',
    completeTime: null,
    remark: '用户主动购买'
  },
  {
    id: 2,
    orderNo: 'ORD202401310002',
    username: '海洋妈妈',
    userPhone: '13800138002',
    courseName: '海洋环保小卫士',
    coursePrice: 199,
    discountAmount: 20,
    amount: 179,
    status: 2,
    paymentMethod: 'alipay',
    paymentNo: 'ALI20240131002',
    createTime: '2024-01-31 09:15:00',
    payTime: '2024-01-31 09:20:00',
    completeTime: '2024-01-31 18:30:00',
    remark: '优惠券抵扣'
  },
  {
    id: 3,
    orderNo: 'ORD202401310003',
    username: '小鲸鱼',
    userPhone: '13800138003',
    courseName: '深海探险记',
    coursePrice: 399,
    discountAmount: 0,
    amount: 399,
    status: 0,
    paymentMethod: null,
    paymentNo: null,
    createTime: '2024-01-31 14:20:00',
    payTime: null,
    completeTime: null,
    remark: null
  }
])

// 搜索表单
const searchForm = reactive({
  orderNo: '',
  username: '',
  status: '',
  dateRange: []
})

// 添加订单表单
const addForm = reactive({
  userId: '',
  courseId: '',
  discountAmount: 0,
  remark: ''
})

// 用户列表和课程列表（模拟数据）
const userList = ref([
  { id: 1, username: '小海豚', phone: '13800138001' },
  { id: 2, username: '海洋妈妈', phone: '13800138002' },
  { id: 3, username: '小鲸鱼', phone: '13800138003' }
])

const courseList = ref([
  { id: 1, name: '海洋生物探索之旅', price: 299 },
  { id: 2, name: '海洋环保小卫士', price: 199 },
  { id: 3, name: '深海探险记', price: 399 }
])

// 表单验证规则
const addRules: FormRules = {
  userId: [{ required: true, message: '请选择用户', trigger: 'change' }],
  courseId: [{ required: true, message: '请选择课程', trigger: 'change' }]
}

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 3
})

// 获取状态类型
const getStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    0: 'warning',
    1: 'primary',
    2: 'success',
    3: 'info',
    4: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: number) => {
  const textMap: Record<number, string> = {
    0: '待支付',
    1: '已支付',
    2: '已完成',
    3: '已取消',
    4: '已退款'
  }
  return textMap[status] || '未知'
}

// 获取支付方式文本
const getPaymentText = (method: string) => {
  const textMap: Record<string, string> = {
    wechat: '微信支付',
    alipay: '支付宝',
    bank: '银行卡',
    balance: '余额支付'
  }
  return textMap[method] || method
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    setTimeout(() => {
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取订单列表失败:', error)
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.page = 1
  getList()
}

// 处理重置
const handleReset = () => {
  Object.assign(searchForm, {
    orderNo: '',
    username: '',
    status: '',
    dateRange: []
  })
  pagination.page = 1
  getList()
}

// 处理查看详情
const handleView = (row: any) => {
  currentOrder.value = row
  detailVisible.value = true
}

// 处理手动添加订单
const handleAdd = () => {
  addVisible.value = true
}

// 处理添加订单提交
const handleAddSubmit = () => {
  addFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        ElMessage.success('订单创建成功')
        addVisible.value = false
        getList()
      } catch (error) {
        console.error('创建订单失败:', error)
      }
    }
  })
}

// 重置添加表单
const resetAddForm = () => {
  Object.assign(addForm, {
    userId: '',
    courseId: '',
    discountAmount: 0,
    remark: ''
  })
  addFormRef.value?.resetFields()
}

// 处理标记支付
const handlePay = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要标记此订单为已支付吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    row.status = 1
    row.payTime = new Date().toLocaleString()
    ElMessage.success('标记支付成功')
  } catch (error) {
    console.error('标记支付失败:', error)
  }
}

// 处理完成订单
const handleComplete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要完成此订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    row.status = 2
    row.completeTime = new Date().toLocaleString()
    ElMessage.success('订单完成成功')
  } catch (error) {
    console.error('完成订单失败:', error)
  }
}

// 处理取消订单
const handleCancel = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要取消此订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    row.status = 3
    ElMessage.success('订单取消成功')
  } catch (error) {
    console.error('取消订单失败:', error)
  }
}

// 处理删除订单
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除此订单吗？删除后无法恢复！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      pagination.total--
    }
    ElMessage.success('删除成功')
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 处理导出
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

// 处理统计
const handleStatistics = () => {
  ElMessage.info('订单统计功能开发中...')
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.size = size
  getList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  getList()
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.search-form {
  .el-form-item {
    margin-bottom: 0;
  }
}

.amount {
  color: #f56c6c;
  font-weight: bold;
}

.order-detail {
  .el-descriptions {
    margin-top: 20px;
  }
}
</style>