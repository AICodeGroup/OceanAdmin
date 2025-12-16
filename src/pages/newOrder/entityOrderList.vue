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
      <el-col :span="4">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-label">已支付</div>
            <div class="stat-value success">{{ statistics.paid }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-label">待支付</div>
            <div class="stat-value warning">{{ statistics.unpaid }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-label">已取消</div>
            <div class="stat-value info">{{ statistics.cancelled }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-label">已退款</div>
            <div class="stat-value danger">{{ statistics.refunded }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-label">已完成</div>
            <div class="stat-value success">{{ statistics.completed }}</div>
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

        <el-form-item label="商品ID">
          <el-input v-model.number="searchForm.productId" placeholder="请输入商品ID" style="width: 150px" clearable />
        </el-form-item>

        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" placeholder="请选择订单状态" style="width: 150px" clearable>
            <el-option label="待支付" :value="0" />
            <el-option label="已支付" :value="1" />
            <el-option label="已取消" :value="2" />
            <el-option label="已发货" :value="3" />
            <el-option label="已完成" :value="4" />
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
        <el-table-column prop="productName" label="商品名称" width="200" />
        <el-table-column prop="payAmount" label="支付金额" width="100">
          <template #default="{ row }">
            ¥{{ row.payAmount }}
          </template>
        </el-table-column>
        <el-table-column prop="payType" label="支付方式" width="100">
          <template #default="{ row }">
            {{ formatPayType(row.payType) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ formatStatus(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="expressCompany" label="物流公司" width="120">
          <template #default="{ row }">
            {{ row.expressCompany || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="expressNo" label="物流单号" width="150">
          <template #default="{ row }">
            {{ row.expressNo || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />

        <el-table-column label="操作" width="350" fixed="right">
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
              v-if="scope.row.status === 1" 
              type="success" 
              size="small" 
              @click="handleShip(scope.row)"
            >
              发货
            </el-button>
            <el-button 
              v-if="scope.row.status === 3" 
              type="success" 
              size="small" 
              @click="handleShip(scope.row)"
            >
              修改发货信息
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
    <el-dialog v-model="createDialogVisible" title="新增实体商品订单" width="600px">
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
        <el-form-item label="商品ID" required>
          <el-input v-model.number="createForm.productId" placeholder="请输入商品ID" />
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
            <el-option label="已完成" :value="4" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpdateStatus">确定</el-button>
      </template>
    </el-dialog>

    <!-- 发货对话框 -->
    <el-dialog v-model="shipDialogVisible" :title="isEditShipping ? '修改发货信息' : '订单发货'" width="700px">
      <!-- 订单基本信息 -->
      <el-descriptions :column="2" border class="mb-4">
        <el-descriptions-item label="订单号">{{ shippingInfo.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="商品名称">{{ shippingInfo.productName }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">¥{{ shippingInfo.payAmount }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ shippingInfo.createdAt }}</el-descriptions-item>
      </el-descriptions>

      <!-- 收货地址信息 -->
      <div class="mb-4">
        <h4 style="margin-bottom: 12px; color: #303133;">收货地址信息</h4>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="收货人">{{ shippingInfo.receiverName }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ shippingInfo.receiverPhone }}</el-descriptions-item>
          <el-descriptions-item label="完整地址" :span="2">
            {{ shippingInfo.fullAddress }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 物流信息填写 -->
      <div class="mb-4">
        <h4 style="margin-bottom: 12px; color: #303133;">物流信息</h4>
        <el-form :model="shipForm" label-width="100px">
          <el-form-item label="物流公司" required>
            <el-select v-model="shipForm.expressCompany" placeholder="请选择物流公司" style="width: 100%">
              <el-option 
                v-for="company in expressCompanies" 
                :key="company" 
                :label="company" 
                :value="company" 
              />
            </el-select>
          </el-form-item>
          <el-form-item label="物流单号" required>
            <el-input v-model="shipForm.expressNo" placeholder="请输入物流单号" />
          </el-form-item>
          <el-form-item label="发货备注">
            <el-input 
              v-model="shipForm.shippingRemark" 
              type="textarea" 
              :rows="3" 
              placeholder="请输入发货备注（可选）" 
            />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="shipDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmShip">{{ isEditShipping ? '确认修改' : '确认发货' }}</el-button>
      </template>
    </el-dialog>

    <!-- 订单详情对话框 -->
    <el-dialog v-model="detailVisible" title="实体商品订单详情" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ detailData.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="statusType(detailData.status)">{{ formatStatus(detailData.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ detailData.userId }}</el-descriptions-item>
        <el-descriptions-item label="用户昵称">{{ detailData.userNickname }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ detailData.phone }}</el-descriptions-item>
        <el-descriptions-item label="商品名称" :span="2">{{ detailData.productName }}</el-descriptions-item>
        <el-descriptions-item label="支付金额">¥{{ detailData.payAmount }}</el-descriptions-item>
        <el-descriptions-item label="支付方式">{{ formatPayType(detailData.payType) }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ detailData.paidAt || '未支付' }}</el-descriptions-item>
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
  getEntityOrderList, 
  getEntityOrderDetailById, 
  updateEntityOrderStatus,
  deleteEntityOrderAdmin,
  batchDeleteEntityOrders,
  shipEntityOrder,
  createEntityOrder,
  getEntityOrderStatistics,
  getShippingInfo
} from '@/api/order'
import { getUserList } from '@/api/user'

// 搜索表单
const searchForm = reactive({
  orderNo: '',
  userId: null as number | null,
  phone: '',
  productId: null as number | null,
  status: null as number | null,
  productType: 1, // 实体商品
})

// 选中的订单ID
const selectedIds = ref<number[]>([])

// 用户搜索相关
const userOptions = ref<any[]>([])
const userSearchLoading = ref(false)

// 创建订单对话框
const createDialogVisible = ref(false)
const createForm = reactive({
  userId: null as number | null,
  phone: '',
  productId: null as number | null,
  payType: '微信',
  paidAt: '',
  remark: ''
})

// 状态更新对话框
const statusDialogVisible = ref(false)
const currentRow = ref<any>({})
const newStatus = ref<number | null>(null)

// 发货对话框
const shipDialogVisible = ref(false)
const shippingInfo = ref<any>({})
const isEditShipping = ref(false) // 是否是修改发货信息
const shipForm = reactive({
  orderNo: '',
  expressCompany: '顺丰速运',
  expressNo: '',
  shippingRemark: ''
})

// 常用物流公司列表
const expressCompanies = [
  '顺丰速运',
  '圆通速递',
  '韵达快递',
  '中通快递',
  '申通快递',
  '百世快递',
  '极兔速递',
  '京东物流',
  'EMS'
]

// 表格数据和分页
const tableData = ref<any[]>([])
const loading = ref(false)
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
})

// 订单详情
const detailVisible = ref(false)
const detailData = ref<any>({})

// 统计数据
const statistics = ref({
  total: 0,
  unpaid: 0,
  paid: 0,
  cancelled: 0,
  refunded: 0,
  completed: 0
})

// 获取统计数据
const fetchStatistics = async () => {
  try {
    const res: any = await getEntityOrderStatistics()
    if (res) {
      statistics.value = {
        total: res.totalOrders || 0,
        unpaid: res.pendingPaymentOrders || 0,
        paid: res.paidOrders || 0,
        cancelled: res.cancelledOrders || 0,
        refunded: res.refundedOrders || 0,
        completed: tableData.value.filter(item => item.status === 6).length
      }
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      page: pagination.page,
      limit: pagination.limit,
    }
    const res: any = await getEntityOrderList(params)
    
    // 响应拦截器已经返回data部分
    if (res) {
      const orders = res.productOrdersDetailVo || []
      const total = res.total || 0
      tableData.value = orders
      pagination.total = total
    }
    
    // 同时获取统计数据
    fetchStatistics()
  } catch (error) {
    console.error('获取订单数据失败', error)
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
    productType: 1,
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
    const res: any = await getEntityOrderDetailById(row.id)
    // 响应拦截器已经返回data部分
    detailData.value = res || {}
    detailVisible.value = true
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
  }
}

// 订单发货 - 打开发货对话框
const handleShip = async (row: any) => {
  try {
    // 获取订单发货信息（包含收货地址）
    const res: any = await getShippingInfo(row.orderNo)
    shippingInfo.value = res || {}
    
    // 检查是否已有发货信息
    const hasShippingInfo = res?.expressNo && res?.expressCompany
    isEditShipping.value = hasShippingInfo
    
    // 填充表单（如果有现有数据则回显，否则使用默认值）
    Object.assign(shipForm, {
      orderNo: row.orderNo,
      expressCompany: res?.expressCompany || '顺丰速运',
      expressNo: res?.expressNo || '',
      shippingRemark: res?.shippingRemark || ''
    })
    
    shipDialogVisible.value = true
  } catch (error) {
    console.error('获取发货信息失败:', error)
    ElMessage.error('获取发货信息失败')
  }
}

// 确认发货
const confirmShip = async () => {
  if (!shipForm.expressNo) {
    ElMessage.warning('请输入物流单号')
    return
  }
  
  try {
    await shipEntityOrder({
      orderNo: shipForm.orderNo,
      expressCompany: shipForm.expressCompany,
      expressNo: shipForm.expressNo,
      shippingRemark: shipForm.shippingRemark
    })
    ElMessage.success(isEditShipping.value ? '发货信息修改成功' : '发货成功')
    shipDialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('发货失败:', error)
    ElMessage.error(isEditShipping.value ? '修改发货信息失败' : '发货失败')
  }
}

// 删除订单
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该订单吗？删除后无法恢复！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteEntityOrderAdmin(row.id)
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
    
    await batchDeleteEntityOrders(selectedIds.value)
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
    3: '已发货',
    4: '已完成',
  }
  return statusMap[status] || '未知'
}

// 状态标签类型
const statusType = (status: number) => {
  const typeMap: Record<number, string> = {
    0: 'warning',
    1: 'success',
    2: 'info',
    3: 'primary',
    4: 'success',
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
    userOptions.value = res?.list || res?.users || res || []
  } catch (error) {
    console.error('搜索用户失败:', error)
  } finally {
    userSearchLoading.value = false
  }
}

// 打开创建订单对话框
const handleCreate = () => {
  Object.assign(createForm, {
    userId: null,
    phone: '',
    productId: null,
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
    ElMessage.warning('请输入商品ID')
    return
  }
  
  try {
    const data: any = {
      userId: createForm.userId,
      phone: createForm.phone,
      productId: createForm.productId
    }
    
    // payType 去除空格后发送，如果为空则使用默认值"微信"
    if (createForm.payType && createForm.payType.trim()) {
      data.payType = createForm.payType.trim()
    } else {
      data.payType = '微信'
    }
    if (createForm.paidAt) data.paidAt = createForm.paidAt
    if (createForm.remark) data.remark = createForm.remark
    
    await createEntityOrder(data)
    ElMessage.success('订单创建成功')
    createDialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('创建订单失败:', error)
    ElMessage.error('创建订单失败')
  }
}

// 打开状态更新对话框
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
    await updateEntityOrderStatus(currentRow.value.orderNo, newStatus.value)
    ElMessage.success('订单状态已更新')
    statusDialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('更新订单状态失败:', error)
    ElMessage.error('更新订单状态失败')
  }
}

// 初始加载
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
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
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-value.warning {
  color: #e6a23c;
}

.stat-value.success {
  color: #67c23a;
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
</style>
