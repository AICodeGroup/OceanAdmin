<template>
  <div class="app-container">
    <div class="page-header">
      <h1>积分记录</h1>
    </div>

    <!-- 搜索区域 -->
    <div class="card-container">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="积分类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="获得积分" value="earn" />
            <el-option label="消费积分" value="spend" />
          </el-select>
        </el-form-item>
        <el-form-item label="积分来源">
          <el-select v-model="searchForm.source" placeholder="请选择来源" clearable>
            <el-option label="每日签到" value="daily_signin" />
            <el-option label="完成课程" value="course_complete" />
            <el-option label="活动参与" value="activity" />
            <el-option label="商城兑换" value="mall_exchange" />
            <el-option label="管理员发放" value="admin_grant" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
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

    <!-- 统计卡片 -->
    <div class="stats-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon total">
              <el-icon><Coin /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.totalRecords }}</div>
              <div class="stat-label">总记录数</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon earn">
              <el-icon><Plus /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.totalEarn }}</div>
              <div class="stat-label">总获得积分</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon spend">
              <el-icon><Minus /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.totalSpend }}</div>
              <div class="stat-label">总消费积分</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon users">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.activeUsers }}</div>
              <div class="stat-label">活跃用户</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 操作按钮 -->
    <div class="button-group">
      <el-button type="primary" @click="handleGrant">
        <el-icon><Plus /></el-icon>
        发放积分
      </el-button>
      <el-button type="success" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出记录
      </el-button>
    </div>

    <!-- 表格 -->
    <div class="card-container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column label="积分变动" width="120">
          <template #default="scope">
            <span :class="scope.row.type === 'earn' ? 'points-earn' : 'points-spend'">
              {{ scope.row.type === 'earn' ? '+' : '-' }}{{ scope.row.points }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="积分类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.type === 'earn' ? 'success' : 'warning'">
              {{ scope.row.type === 'earn' ? '获得' : '消费' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="积分来源" width="120">
          <template #default="scope">
            <el-tag :type="getSourceColor(scope.row.source)">
              {{ getSourceText(scope.row.source) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="balanceBefore" label="变动前余额" width="120" />
        <el-table-column prop="balanceAfter" label="变动后余额" width="120" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="scope">
            <el-button type="info" size="small" @click="handleView(scope.row)">
              详情
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

    <!-- 记录详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="积分记录详情"
      width="600px"
    >
      <div v-if="currentRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="记录ID">{{ currentRecord.id }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ currentRecord.username }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ currentRecord.phone }}</el-descriptions-item>
          <el-descriptions-item label="积分变动">
            <span :class="currentRecord.type === 'earn' ? 'points-earn' : 'points-spend'">
              {{ currentRecord.type === 'earn' ? '+' : '-' }}{{ currentRecord.points }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="积分类型">
            <el-tag :type="currentRecord.type === 'earn' ? 'success' : 'warning'">
              {{ currentRecord.type === 'earn' ? '获得' : '消费' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="积分来源">
            <el-tag :type="getSourceColor(currentRecord.source)">
              {{ getSourceText(currentRecord.source) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="变动前余额">{{ currentRecord.balanceBefore }}</el-descriptions-item>
          <el-descriptions-item label="变动后余额">{{ currentRecord.balanceAfter }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentRecord.createTime }}</el-descriptions-item>
          <el-descriptions-item label="IP地址">{{ currentRecord.ip || '-' }}</el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{ currentRecord.description }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ currentRecord.remark || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- 发放积分对话框 -->
    <el-dialog
      v-model="grantVisible"
      title="发放积分"
      width="500px"
      @close="resetGrantForm"
    >
      <el-form
        ref="grantFormRef"
        :model="grantForm"
        :rules="grantRules"
        label-width="100px"
      >
        <el-form-item label="用户" prop="userId">
          <el-select v-model="grantForm.userId" placeholder="请选择用户" filterable style="width: 100%">
            <el-option
              v-for="user in userList"
              :key="user.id"
              :label="`${user.username} (${user.phone})`"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="积分数量" prop="points">
          <el-input-number v-model="grantForm.points" :min="1" placeholder="请输入积分数量" />
        </el-form-item>
        <el-form-item label="发放原因" prop="reason">
          <el-input v-model="grantForm.reason" type="textarea" :rows="3" placeholder="请输入发放原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="grantVisible = false">取消</el-button>
          <el-button type="primary" @click="handleGrantSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// 响应式数据
const loading = ref(false)
const detailVisible = ref(false)
const grantVisible = ref(false)
const currentRecord = ref<any>(null)
const grantFormRef = ref<FormInstance>()

// 统计数据
const stats = reactive({
  totalRecords: 2456,
  totalEarn: 125680,
  totalSpend: 45230,
  activeUsers: 892
})

const tableData = ref([
  {
    id: 1,
    username: '小海豚',
    phone: '13800138001',
    type: 'earn',
    points: 10,
    source: 'daily_signin',
    description: '每日签到奖励',
    balanceBefore: 100,
    balanceAfter: 110,
    ip: '192.168.1.100',
    remark: null,
    createTime: '2024-01-31 10:30:00'
  },
  {
    id: 2,
    username: '海洋妈妈',
    phone: '13800138002',
    type: 'earn',
    points: 100,
    source: 'course_complete',
    description: '完成课程《海洋生物探索》',
    balanceBefore: 250,
    balanceAfter: 350,
    ip: '192.168.1.101',
    remark: null,
    createTime: '2024-01-31 09:15:00'
  },
  {
    id: 3,
    username: '小鲸鱼',
    phone: '13800138003',
    type: 'spend',
    points: 500,
    source: 'mall_exchange',
    description: '兑换商品：海洋主题T恤',
    balanceBefore: 800,
    balanceAfter: 300,
    ip: '192.168.1.102',
    remark: null,
    createTime: '2024-01-31 08:45:00'
  }
])

// 用户列表（模拟数据）
const userList = ref([
  { id: 1, username: '小海豚', phone: '13800138001' },
  { id: 2, username: '海洋妈妈', phone: '13800138002' },
  { id: 3, username: '小鲸鱼', phone: '13800138003' }
])

// 搜索表单
const searchForm = reactive({
  username: '',
  type: '',
  source: '',
  dateRange: []
})

// 发放表单
const grantForm = reactive({
  userId: '',
  points: 0,
  reason: ''
})

// 表单验证规则
const grantRules: FormRules = {
  userId: [{ required: true, message: '请选择用户', trigger: 'change' }],
  points: [{ required: true, message: '请输入积分数量', trigger: 'blur' }],
  reason: [{ required: true, message: '请输入发放原因', trigger: 'blur' }]
}

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 3
})

// 获取来源颜色
const getSourceColor = (source: string) => {
  const colorMap: Record<string, string> = {
    daily_signin: 'primary',
    course_complete: 'success',
    activity: 'warning',
    mall_exchange: 'danger',
    admin_grant: 'info'
  }
  return colorMap[source] || 'info'
}

// 获取来源文本
const getSourceText = (source: string) => {
  const textMap: Record<string, string> = {
    daily_signin: '每日签到',
    course_complete: '完成课程',
    activity: '活动参与',
    mall_exchange: '商城兑换',
    admin_grant: '管理员发放'
  }
  return textMap[source] || source
}

// 处理搜索
const handleSearch = () => {
  pagination.page = 1
  // 搜索逻辑
}

// 处理重置
const handleReset = () => {
  Object.assign(searchForm, {
    username: '',
    type: '',
    source: '',
    dateRange: []
  })
  pagination.page = 1
}

// 处理查看详情
const handleView = (row: any) => {
  currentRecord.value = row
  detailVisible.value = true
}

// 处理发放积分
const handleGrant = () => {
  grantVisible.value = true
}

// 处理发放提交
const handleGrantSubmit = () => {
  grantFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        ElMessage.success('积分发放成功')
        grantVisible.value = false
        // 刷新列表
      } catch (error) {
        console.error('发放失败:', error)
      }
    }
  })
}

// 重置发放表单
const resetGrantForm = () => {
  Object.assign(grantForm, {
    userId: '',
    points: 0,
    reason: ''
  })
  grantFormRef.value?.resetFields()
}

// 处理导出
const handleExport = () => {
  ElMessage.info('导出记录功能开发中...')
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.size = size
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
}

onMounted(() => {
  // 初始化数据
})
</script>

<style lang="scss" scoped>
.search-form {
  .el-form-item {
    margin-bottom: 0;
  }
}

.stats-container {
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
      
      &.total {
        background: #409eff;
      }
      
      &.earn {
        background: #67c23a;
      }
      
      &.spend {
        background: #e6a23c;
      }
      
      &.users {
        background: #909399;
      }
    }
    
    .stat-content {
      .stat-number {
        font-size: 28px;
        font-weight: bold;
        color: #303133;
        line-height: 1;
      }
      
      .stat-label {
        font-size: 14px;
        color: #909399;
        margin-top: 5px;
      }
    }
  }
}

.points-earn {
  color: #67c23a;
  font-weight: bold;
}

.points-spend {
  color: #e6a23c;
  font-weight: bold;
}
</style>