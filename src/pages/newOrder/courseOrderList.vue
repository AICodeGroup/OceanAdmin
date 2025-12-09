<template>
  <div>
    <!-- 统计信息 -->
    <el-row :gutter="16" class="mb-4 stats-row">
      <el-col :span="4">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-label">总订单数</div>
            <div class="stat-value">{{ statistics.total }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-label">已支付</div>
            <div class="stat-value success">{{ statistics.paid }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-label">待支付</div>
            <div class="stat-value warning">{{ statistics.unpaid }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-label">已取消</div>
            <div class="stat-value info">{{ statistics.cancelled }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-label">已退款</div>
            <div class="stat-value danger">{{ statistics.refunded }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索表单 -->
    <el-card shadow="never" class="mb-4">
      <el-form :model="searchForm" label-width="80px" :inline="true">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" style="width: 150px" clearable />
        </el-form-item>

        <el-form-item label="用户">
          <el-select 
            v-model="searchForm.userId" 
            placeholder="请输入用户名搜索" 
            style="width: 200px" 
            clearable 
            filterable 
            remote
            reserve-keyword
            :remote-method="searchUsers"
            :loading="userSearchLoading"
          >
            <el-option 
              v-for="user in userOptions" 
              :key="user.id" 
              :label="`${user.nickname || user.username} (ID:${user.id})`" 
              :value="user.id" 
            >
              <span>{{ user.nickname || user.username }}</span>
              <span style="color: #8492a6; font-size: 12px; margin-left: 8px">ID: {{ user.id }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" style="width: 150px" clearable />
        </el-form-item>

        <el-form-item label="课程ID">
          <el-input v-model.number="searchForm.productId" placeholder="请输入课程ID" style="width: 150px" clearable />
        </el-form-item>

        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" placeholder="请选择订单状态" style="width: 150px" clearable>
            <el-option label="待支付" :value="0" />
            <el-option label="已支付" :value="1" />
            <el-option label="已取消" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearchForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮 -->
    <el-card shadow="never" class="mb-4">
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新增订单
      </el-button>
      <el-button 
        type="danger" 
        :disabled="selectedIds.length === 0"
        @click="handleBatchDelete"
      >
        <el-icon><Delete /></el-icon>
        批量删除 ({{ selectedIds.length }})
      </el-button>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table 
        :data="tableData" 
        v-loading="loading" 
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="userId" label="用户ID" width="80" />
        <el-table-column prop="userNickname" label="用户昵称" width="120" />
        <el-table-column prop="phone" label="手机号码" width="120" />
        <el-table-column prop="productName" label="课程名称" width="150" />
        <el-table-column prop="location" label="地点" width="120" />
        <el-table-column prop="startDate" label="开始日期" width="110" />
        <el-table-column prop="endDate" label="结束日期" width="110" />
        <el-table-column prop="payAmount" label="支付金额" width="90">
          <template #default="{ row }">
            ¥{{ row.payAmount }}
          </template>
        </el-table-column>
        <el-table-column prop="payType" label="支付方式" width="90">
          <template #default="{ row }">
            {{ formatPayType(row.payType) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" width="90">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ formatStatus(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />

        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleViewDetail(scope.row)">
              详情
            </el-button>
            <el-button 
              type="warning" 
              size="small" 
              @click="handleUpdateStatus(scope.row)"
            >
              改状态
            </el-button>
            <el-button 
              type="danger" 
              size="small" 
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          :current-page="pagination.page"
          :page-size="pagination.limit"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 创建订单对话框 -->
    <el-dialog v-model="createDialogVisible" title="新增课程订单" width="600px">
      <el-form :model="createForm" label-width="100px">
        <el-form-item label="用户" required>
          <el-select 
            v-model="createForm.userId" 
            placeholder="请输入用户名搜索" 
            style="width: 100%" 
            clearable 
            filterable 
            remote
            reserve-keyword
            :remote-method="searchUsers"
            :loading="userSearchLoading"
          >
            <el-option 
              v-for="user in userOptions" 
              :key="user.id" 
              :label="`${user.nickname || user.username} (ID:${user.id})`" 
              :value="user.id" 
            >
              <span>{{ user.nickname || user.username }}</span>
              <span style="color: #8492a6; font-size: 12px; margin-left: 8px">ID: {{ user.id }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" required>
          <el-input v-model="createForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="课程ID" required>
          <el-input v-model.number="createForm.productId" placeholder="请输入课程ID" />
        </el-form-item>
        <el-form-item label="排期ID">
          <el-input v-model.number="createForm.scheduleId" placeholder="请输入排期ID（可选）" />
        </el-form-item>
        <el-form-item label="报名人姓名" required>
          <el-input v-model="createForm.registrantName" placeholder="请输入报名人姓名" />
        </el-form-item>
        <el-form-item label="紧急联系人" required>
          <el-input v-model="createForm.emergencyContact" placeholder="请输入紧急联系人" />
        </el-form-item>
        <el-form-item label="紧急联系电话" required>
          <el-input v-model="createForm.emergencyPhone" placeholder="请输入紧急联系电话" />
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="createForm.payType" placeholder="请选择支付方式" style="width: 100%">
            <el-option label="微信" value="微信" />
            <el-option label="支付宝" value="支付宝" />
            <el-option label="余额" value="余额" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付时间">
          <el-date-picker
            v-model="createForm.paidAt"
            type="datetime"
            placeholder="请选择支付时间（可选）"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input 
            v-model="createForm.remark" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入备注信息（可选）" 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCreate">确定</el-button>
      </template>
    </el-dialog>

    <!-- 状态更新对话框 -->
    <el-dialog v-model="statusDialogVisible" title="更新订单状态" width="400px">
      <el-form label-width="100px">
        <el-form-item label="当前状态">
          <el-tag :type="statusType(currentRow.status)">{{ formatStatus(currentRow.status) }}</el-tag>
        </el-form-item>
        <el-form-item label="新状态">
          <el-select v-model="newStatus" placeholder="请选择状态" style="width: 100%">
            <el-option label="待支付" :value="0" />
            <el-option label="已支付" :value="1" />
            <el-option label="已取消" :value="2" />
            <el-option label="已退款" :value="3" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpdateStatus">确定</el-button>
      </template>
    </el-dialog>

    <!-- 订单详情对话框 -->
    <el-dialog v-model="detailVisible" title="课程订单详情" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ detailData.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="statusType(detailData.status)">{{ formatStatus(detailData.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ detailData.userId }}</el-descriptions-item>
        <el-descriptions-item label="用户昵称">{{ detailData.userNickname }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ detailData.phone }}</el-descriptions-item>
        <el-descriptions-item label="课程名称" :span="2">{{ detailData.productName }}</el-descriptions-item>
      </el-descriptions>
      
      <el-divider content-position="left">排期信息</el-divider>
      <el-descriptions :column="2" border v-if="detailData.scheduleId">
        <el-descriptions-item label="排期ID">{{ detailData.scheduleId }}</el-descriptions-item>
        <el-descriptions-item label="排期名称">{{ detailData.scheduleName }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ detailData.startDate }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ detailData.endDate }}</el-descriptions-item>
        <el-descriptions-item label="排期地点" :span="2">{{ detailData.scheduleLocation || detailData.location }}</el-descriptions-item>
        <el-descriptions-item label="排期状态">
          <el-tag :type="getScheduleStatusType(detailData.scheduleStatus)">{{ formatScheduleStatus(detailData.scheduleStatus) }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <el-empty v-else description="该订单无排期信息" :image-size="60" />
      
      <el-divider content-position="left">支付信息</el-divider>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="支付金额">¥{{ detailData.payAmount }}</el-descriptions-item>
        <el-descriptions-item label="积分">{{ detailData.points || 0 }}</el-descriptions-item>
        <el-descriptions-item label="支付方式">{{ formatPayType(detailData.payType) }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ detailData.paidAt || '未支付' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detailData.updatedAt }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ detailData.remark || '无' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  getCourseOrderList, 
  getCourseOrderDetailById, 
  updateCourseOrderStatus,
  deleteCourseOrder,
  batchDeleteCourseOrders,
  createCourseOrder,
  getCourseOrderStatistics
} from '@/api/order'
import { getUserList } from '@/api/user'

// 搜索表单
const searchForm = reactive({
  orderNo: '',
  userId: null as number | null,
  phone: '',
  productId: null as number | null,
  status: null as number | null,
  productType: 0, // 课程订单
})

// 选中的订单ID
const selectedIds = ref<number[]>([])

// 创建订单对话框
const createDialogVisible = ref(false)
const createForm = reactive({
  userId: null as number | null,
  phone: '',
  productId: null as number | null,
  scheduleId: null as number | null,
  registrantName: '',
  emergencyContact: '',
  emergencyPhone: '',
  payType: '微信',
  paidAt: '',
  remark: ''
})

// 状态更新对话框
const statusDialogVisible = ref(false)
const currentRow = ref<any>({})
const newStatus = ref<number | null>(null)

// 用户搜索相关
const userOptions = ref<any[]>([])
const userSearchLoading = ref(false)

// 订单详情
const detailData = ref<any>({})
const detailVisible = ref(false)

// 统计数据
const statistics = ref({
  total: 0,
  paid: 0,
  unpaid: 0,
  cancelled: 0,
  refunded: 0
})

// 获取统计数据
const fetchStatistics = async () => {
  try {
    const res: any = await getCourseOrderStatistics()
    if (res) {
      statistics.value = {
        total: res.totalOrders || 0,
        paid: res.paidOrders || 0,
        unpaid: res.pendingPaymentOrders || 0,
        cancelled: res.cancelledOrders || 0,
        refunded: res.refundedOrders || 0
      }
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 表格数据和分页
const tableData = ref<any[]>([])
const loading = ref(false)
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
})

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      page: pagination.page,
      limit: pagination.limit,
    }
    const res: any = await getCourseOrderList(params)
    console.log('课程订单列表响应:', res)
    
    // 响应拦截器已经返回了data部分，所以res直接就是data
    if (res) {
      const orders = res.productOrdersDetailVo || []
      const total = res.total || 0
      console.log('订单数据:', orders, '总数:', total)
      tableData.value = orders
      pagination.total = total
    }
    
    // 同时获取统计数据
    fetchStatistics()
  } catch (error) {
    console.error('获取课程订单数据失败', error)
    ElMessage.error('获取订单数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

// 重置搜索
const resetSearchForm = () => {
  Object.assign(searchForm, {
    orderNo: '',
    userId: null,
    phone: '',
    productId: null,
    status: null,
    productType: 0,
  })
  handleSearch()
}

// 分页大小变化
const handleSizeChange = (limit: number) => {
  pagination.limit = limit
  fetchData()
}

// 当前页变化
const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchData()
}

// 查看详情
const handleViewDetail = async (row: any) => {
  try {
    const res: any = await getCourseOrderDetailById(row.id)
    // 响应拦截器已经返回data部分
    detailData.value = res || {}
    detailVisible.value = true
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
  }
}

// 更新订单状态
const handleUpdateStatus = (row: any) => {
  currentRow.value = row
  newStatus.value = row.status
  statusDialogVisible.value = true
}

// 确认更新状态
const confirmUpdateStatus = async () => {
  if (newStatus.value === null) {
    ElMessage.warning('请选择状态')
    return
  }
  
  try {
    await updateCourseOrderStatus(currentRow.value.orderNo, newStatus.value)
    ElMessage.success('订单状态已更新')
    statusDialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('更新订单状态失败:', error)
    ElMessage.error('更新订单状态失败')
  }
}

// 打开创建订单对话框
const handleCreate = () => {
  Object.assign(createForm, {
    userId: null,
    phone: '',
    productId: null,
    scheduleId: null,
    registrantName: '',
    emergencyContact: '',
    emergencyPhone: '',
    payType: '微信',
    paidAt: '',
    remark: ''
  })
  createDialogVisible.value = true
}

// 确认创建订单
const confirmCreate = async () => {
  if (!createForm.userId) {
    ElMessage.warning('请选择用户')
    return
  }
  if (!createForm.phone) {
    ElMessage.warning('请输入手机号')
    return
  }
  if (!createForm.productId) {
    ElMessage.warning('请输入课程ID')
    return
  }
  if (!createForm.registrantName) {
    ElMessage.warning('请输入报名人姓名')
    return
  }
  if (!createForm.emergencyContact) {
    ElMessage.warning('请输入紧急联系人')
    return
  }
  if (!createForm.emergencyPhone) {
    ElMessage.warning('请输入紧急联系电话')
    return
  }
  
  try {
    // 准备请求数据，只发送非空字段
    const data: any = {
      userId: createForm.userId,
      phone: createForm.phone,
      productId: createForm.productId,
      registrantName: createForm.registrantName,
      emergencyContact: createForm.emergencyContact,
      emergencyPhone: createForm.emergencyPhone
    }
    
    if (createForm.scheduleId) data.scheduleId = createForm.scheduleId
    // payType 去除空格后发送，如果为空则使用默认值"微信"
    if (createForm.payType && createForm.payType.trim()) {
      data.payType = createForm.payType.trim()
    } else {
      data.payType = '微信'
    }
    if (createForm.paidAt) data.paidAt = createForm.paidAt
    if (createForm.remark) data.remark = createForm.remark
    
    await createCourseOrder(data)
    ElMessage.success('订单创建成功')
    createDialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('创建订单失败:', error)
    ElMessage.error('创建订单失败')
  }
}

// 删除订单
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteCourseOrder(row.id)
    ElMessage.success('订单已删除')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除订单失败:', error)
      ElMessage.error('删除订单失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 个订单吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await batchDeleteCourseOrders(selectedIds.value)
    ElMessage.success('批量删除成功')
    selectedIds.value = []
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  }
}

// 表格选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
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

// 格式化支付方式
const formatPayType = (payType: string) => {
  const payTypeMap: Record<string, string> = {
    'wechat': '微信支付',
    'alipay': '支付宝',
    'balance': '余额支付',
  }
  return payTypeMap[payType] || payType
}

// 格式化排期状态
const formatScheduleStatus = (status: number) => {
  const statusMap: Record<number, string> = {
    0: '未开放',
    1: '报名中',
    2: '已满员',
    3: '已结束',
  }
  return statusMap[status] || '未知'
}

// 排期状态标签类型
const getScheduleStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    0: 'info',
    1: 'success',
    2: 'warning',
    3: '',
  }
  return typeMap[status] || ''
}

// 搜索用户
const searchUsers = async (query: string) => {
  if (!query) {
    userOptions.value = []
    return
  }
  
  userSearchLoading.value = true
  try {
    const res: any = await getUserList({
      keyword: query,
      page: 1,
      limit: 20
    })
    // 响应拦截器已经返回data部分
    userOptions.value = res?.list || res?.users || res || []
  } catch (error) {
    console.error('搜索用户失败:', error)
  } finally {
    userSearchLoading.value = false
  }
}

// 初始加载
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.stats-row :deep(.el-card) {
  background: #ffffff !important;
  border: 1px solid #ebeef5;
}

.stats-row :deep(.el-card__body) {
  padding: 0;
}

.stat-card {
  text-align: center;
  padding: 20px 10px;
  background: #ffffff;
  border-radius: 4px;
  transition: all 0.3s;
}

.stat-label {
  color: #909399;
  font-size: 14px;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-value.success {
  color: #67c23a;
}

.stat-value.warning {
  color: #e6a23c;
}

.stat-value.info {
  color: #909399;
}

.stat-value.danger {
  color: #ef4444;
}

.mb-4 {
  margin-bottom: 16px;
}
.mt-4 {
  margin-top: 16px;
}
.flex {
  display: flex;
}
.justify-end {
  justify-content: flex-end;
}
</style>
