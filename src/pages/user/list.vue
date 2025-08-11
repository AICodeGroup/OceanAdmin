<template>
  <div class="app-container">
    <div class="page-header">
      <h1>用户管理</h1>
    </div>

    <!-- 搜索区域 -->
    <div class="card-container">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
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
      <el-button type="success" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出用户
      </el-button>
      <el-button type="warning" @click="handleIntegralBatch">
        <el-icon><Medal /></el-icon>
        批量发放积分
      </el-button>
    </div>

    <!-- 表格 -->
    <div class="card-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="头像" width="80">
          <template #default="scope">
            <el-avatar :src="scope.row.avatar" :size="50">
              {{ scope.row.nickname?.charAt(0) }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="integral" label="积分" width="100">
          <template #default="scope">
            <span class="integral">{{ scope.row.integral }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.userType === 'parent' ? 'primary' : 'success'">
              {{ scope.row.userType === 'parent' ? '家长' : '学生' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录" width="180" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleView(scope.row)">
              查看
            </el-button>
            <el-button type="info" size="small" @click="handleIntegral(scope.row)">
              积分
            </el-button>
            <el-button type="warning" size="small" @click="handleToggleStatus(scope.row)">
              {{ scope.row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button type="success" size="small" @click="handleFootprint(scope.row)">
              足迹
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

    <!-- 用户详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="用户详情"
      width="800px"
    >
      <div v-if="currentUser" class="user-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户ID">{{ currentUser.id }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ currentUser.username }}</el-descriptions-item>
          <el-descriptions-item label="昵称">{{ currentUser.nickname }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ currentUser.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ currentUser.email }}</el-descriptions-item>
          <el-descriptions-item label="积分">{{ currentUser.integral }}</el-descriptions-item>
          <el-descriptions-item label="用户类型">
            <el-tag :type="currentUser.userType === 'parent' ? 'primary' : 'success'">
              {{ currentUser.userType === 'parent' ? '家长' : '学生' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentUser.status === 1 ? 'success' : 'danger'">
              {{ currentUser.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="注册时间">{{ currentUser.createTime }}</el-descriptions-item>
          <el-descriptions-item label="最后登录">{{ currentUser.lastLoginTime }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- 积分管理对话框 -->
    <el-dialog
      v-model="integralVisible"
      title="积分管理"
      width="500px"
    >
      <el-form :model="integralForm" label-width="100px">
        <el-form-item label="当前积分">
          <el-input :value="currentUser?.integral" disabled />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-radio-group v-model="integralForm.type">
            <el-radio label="add">增加积分</el-radio>
            <el-radio label="reduce">扣除积分</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="积分数量">
          <el-input-number v-model="integralForm.amount" :min="1" :max="10000" />
        </el-form-item>
        <el-form-item label="操作原因">
          <el-input v-model="integralForm.reason" type="textarea" placeholder="请输入操作原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="integralVisible = false">取消</el-button>
          <el-button type="primary" @click="handleIntegralSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const detailVisible = ref(false)
const integralVisible = ref(false)
const currentUser = ref<any>(null)

const tableData = ref([
  {
    id: 1,
    username: 'user001',
    nickname: '小海豚',
    phone: '13800138001',
    email: 'user001@example.com',
    avatar: 'https://via.placeholder.com/50',
    integral: 1250,
    userType: 'student',
    status: 1,
    createTime: '2024-01-10 10:30:00',
    lastLoginTime: '2024-01-31 15:20:00'
  },
  {
    id: 2,
    username: 'parent001',
    nickname: '海洋妈妈',
    phone: '13800138002',
    email: 'parent001@example.com',
    avatar: 'https://via.placeholder.com/50',
    integral: 890,
    userType: 'parent',
    status: 1,
    createTime: '2024-01-08 14:15:00',
    lastLoginTime: '2024-01-31 09:45:00'
  },
  {
    id: 3,
    username: 'user002',
    nickname: '小鲸鱼',
    phone: '13800138003',
    email: 'user002@example.com',
    avatar: 'https://via.placeholder.com/50',
    integral: 2100,
    userType: 'student',
    status: 0,
    createTime: '2024-01-05 16:20:00',
    lastLoginTime: '2024-01-30 11:30:00'
  }
])

// 搜索表单
const searchForm = reactive({
  username: '',
  phone: '',
  status: ''
})

// 积分表单
const integralForm = reactive({
  type: 'add',
  amount: 0,
  reason: ''
})

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 3
})

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    // 模拟加载延迟
    setTimeout(() => {
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取用户列表失败:', error)
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
    username: '',
    phone: '',
    status: ''
  })
  pagination.page = 1
  getList()
}

// 处理查看详情
const handleView = (row: any) => {
  currentUser.value = row
  detailVisible.value = true
}

// 处理积分管理
const handleIntegral = (row: any) => {
  currentUser.value = row
  integralForm.type = 'add'
  integralForm.amount = 0
  integralForm.reason = ''
  integralVisible.value = true
}

// 处理积分提交
const handleIntegralSubmit = () => {
  if (!integralForm.amount || !integralForm.reason) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  const action = integralForm.type === 'add' ? '增加' : '扣除'
  ElMessage.success(`${action}积分成功`)
  integralVisible.value = false
}

// 处理状态切换
const handleToggleStatus = async (row: any) => {
  try {
    const action = row.status === 1 ? '禁用' : '启用'
    await ElMessageBox.confirm(`确定要${action}这个用户吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    row.status = row.status === 1 ? 0 : 1
    ElMessage.success(`${action}成功`)
  } catch (error) {
    console.error('状态切换失败:', error)
  }
}

// 处理查看足迹
const handleFootprint = (row: any) => {
  router.push(`/footprint/user/${row.id}`)
}

// 处理导出
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

// 处理批量发放积分
const handleIntegralBatch = () => {
  ElMessage.info('批量发放积分功能开发中...')
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

.integral {
  color: #e6a23c;
  font-weight: bold;
}

.user-detail {
  .el-descriptions {
    margin-top: 20px;
  }
}
</style>