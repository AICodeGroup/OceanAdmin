<template>
  <div class="app-container">
    <div class="page-header">
      <h1>徽章管理</h1>
    </div>

    <!-- 徽章统计卡片 -->
    <div class="stats-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon total">
              <el-icon><Medal /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.total }}</div>
              <div class="stat-label">徽章总数</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon active">
              <el-icon><Check /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.active }}</div>
              <div class="stat-label">启用徽章</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon awarded">
              <el-icon><Trophy /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.awarded }}</div>
              <div class="stat-label">已发放</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon users">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.users }}</div>
              <div class="stat-label">获得用户</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 搜索区域 -->
    <div class="card-container">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="徽章名称">
          <el-input v-model="searchForm.name" placeholder="请输入徽章名称" clearable />
        </el-form-item>
        <el-form-item label="徽章类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="学习成就" value="learning" />
            <el-option label="活动参与" value="activity" />
            <el-option label="特殊荣誉" value="honor" />
            <el-option label="系统奖励" value="system" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" :value="1" />
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
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增徽章
      </el-button>
      <el-button type="success" @click="handleUserBadges">
        <el-icon><User /></el-icon>
        用户徽章
      </el-button>
      <el-button type="info" @click="handleRules">
        <el-icon><Setting /></el-icon>
        发放规则
      </el-button>
      <el-button type="warning" @click="handleStatistics">
        <el-icon><DataAnalysis /></el-icon>
        徽章统计
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
        <el-table-column label="徽章图标" width="100">
          <template #default="scope">
            <div class="badge-icon">
              <el-image
                v-if="scope.row.icon"
                :src="scope.row.icon"
                fit="cover"
                style="width: 50px; height: 50px; border-radius: 50%"
              />
              <div v-else class="default-icon">
                <el-icon><Medal /></el-icon>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="徽章名称" />
        <el-table-column label="徽章类型" width="120">
          <template #default="scope">
            <el-tag :type="getTypeColor(scope.row.type)">
              {{ getTypeText(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="condition" label="获得条件" width="200" />
        <el-table-column prop="points" label="积分奖励" width="100">
          <template #default="scope">
            <span v-if="scope.row.points > 0" class="points">+{{ scope.row.points }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="awardCount" label="发放数量" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="success" size="small" @click="handleAward(scope.row)">
              发放
            </el-button>
            <el-button type="info" size="small" @click="handleView(scope.row)">
              详情
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

    <!-- 徽章详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="徽章详情"
      width="600px"
    >
      <div v-if="currentBadge" class="badge-detail">
        <div class="badge-header">
          <div class="badge-icon-large">
            <el-image
              v-if="currentBadge.icon"
              :src="currentBadge.icon"
              fit="cover"
              style="width: 80px; height: 80px; border-radius: 50%"
            />
            <div v-else class="default-icon-large">
              <el-icon><Medal /></el-icon>
            </div>
          </div>
          <div class="badge-info">
            <h3>{{ currentBadge.name }}</h3>
            <el-tag :type="getTypeColor(currentBadge.type)">
              {{ getTypeText(currentBadge.type) }}
            </el-tag>
          </div>
        </div>
        
        <el-descriptions :column="2" border>
          <el-descriptions-item label="徽章ID">{{ currentBadge.id }}</el-descriptions-item>
          <el-descriptions-item label="积分奖励">
            {{ currentBadge.points > 0 ? `+${currentBadge.points}` : '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="发放数量">{{ currentBadge.awardCount }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentBadge.status === 1 ? 'success' : 'danger'">
              {{ currentBadge.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentBadge.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentBadge.updateTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="获得条件" :span="2">{{ currentBadge.condition }}</el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{ currentBadge.description }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- 添加/编辑徽章对话框 -->
    <el-dialog
      v-model="formVisible"
      :title="formTitle"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="徽章名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入徽章名称" />
        </el-form-item>
        <el-form-item label="徽章类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
            <el-option label="学习成就" value="learning" />
            <el-option label="活动参与" value="activity" />
            <el-option label="特殊荣誉" value="honor" />
            <el-option label="系统奖励" value="system" />
          </el-select>
        </el-form-item>
        <el-form-item label="徽章图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标URL" />
        </el-form-item>
        <el-form-item label="获得条件" prop="condition">
          <el-input v-model="form.condition" placeholder="请输入获得条件" />
        </el-form-item>
        <el-form-item label="积分奖励" prop="points">
          <el-input-number v-model="form.points" :min="0" placeholder="请输入积分奖励" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入徽章描述" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 发放徽章对话框 -->
    <el-dialog
      v-model="awardVisible"
      title="发放徽章"
      width="500px"
      @close="resetAwardForm"
    >
      <el-form
        ref="awardFormRef"
        :model="awardForm"
        :rules="awardRules"
        label-width="100px"
      >
        <el-form-item label="徽章">
          <div class="award-badge-info">
            <div class="badge-icon-small">
              <el-image
                v-if="currentBadge?.icon"
                :src="currentBadge.icon"
                fit="cover"
                style="width: 40px; height: 40px; border-radius: 50%"
              />
              <div v-else class="default-icon-small">
                <el-icon><Medal /></el-icon>
              </div>
            </div>
            <span>{{ currentBadge?.name }}</span>
          </div>
        </el-form-item>
        <el-form-item label="用户" prop="userId">
          <el-select v-model="awardForm.userId" placeholder="请选择用户" filterable style="width: 100%">
            <el-option
              v-for="user in userList"
              :key="user.id"
              :label="`${user.username} (${user.phone})`"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发放原因" prop="reason">
          <el-input v-model="awardForm.reason" type="textarea" :rows="3" placeholder="请输入发放原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="awardVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAwardSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// 响应式数据
const loading = ref(false)
const detailVisible = ref(false)
const formVisible = ref(false)
const awardVisible = ref(false)
const formTitle = ref('新增徽章')
const currentBadge = ref<any>(null)
const formRef = ref<FormInstance>()
const awardFormRef = ref<FormInstance>()

// 统计数据
const stats = reactive({
  total: 15,
  active: 12,
  awarded: 89,
  users: 45
})

const tableData = ref([
  {
    id: 1,
    name: '海洋探索者',
    type: 'learning',
    icon: 'https://via.placeholder.com/50x50',
    description: '完成首次海洋生物观察课程',
    condition: '完成任意一门海洋生物课程',
    points: 50,
    awardCount: 25,
    status: 1,
    createTime: '2024-01-31 10:30:00',
    updateTime: null
  },
  {
    id: 2,
    name: '环保小卫士',
    type: 'activity',
    icon: 'https://via.placeholder.com/50x50',
    description: '积极参与海洋环保活动',
    condition: '参与3次以上环保活动',
    points: 100,
    awardCount: 18,
    status: 1,
    createTime: '2024-01-30 09:15:00',
    updateTime: '2024-01-31 14:20:00'
  },
  {
    id: 3,
    name: '深海勇士',
    type: 'honor',
    icon: 'https://via.placeholder.com/50x50',
    description: '勇敢探索深海奥秘',
    condition: '完成深海探险体验课程',
    points: 200,
    awardCount: 8,
    status: 1,
    createTime: '2024-01-29 14:00:00',
    updateTime: null
  }
])

// 搜索表单
const searchForm = reactive({
  name: '',
  type: '',
  status: ''
})

// 表单数据
const form = reactive({
  id: null,
  name: '',
  type: '',
  icon: '',
  condition: '',
  points: 0,
  description: '',
  status: 1
})

// 发放表单
const awardForm = reactive({
  userId: '',
  reason: ''
})

// 用户列表（模拟数据）
const userList = ref([
  { id: 1, username: '小海豚', phone: '13800138001' },
  { id: 2, username: '海洋妈妈', phone: '13800138002' },
  { id: 3, username: '小鲸鱼', phone: '13800138003' }
])

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入徽章名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择徽章类型', trigger: 'change' }],
  condition: [{ required: true, message: '请输入获得条件', trigger: 'blur' }],
  description: [{ required: true, message: '请输入徽章描述', trigger: 'blur' }]
}

const awardRules: FormRules = {
  userId: [{ required: true, message: '请选择用户', trigger: 'change' }],
  reason: [{ required: true, message: '请输入发放原因', trigger: 'blur' }]
}

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 3
})

// 获取类型颜色
const getTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    learning: 'primary',
    activity: 'success',
    honor: 'warning',
    system: 'info'
  }
  return colorMap[type] || 'info'
}

// 获取类型文本
const getTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    learning: '学习成就',
    activity: '活动参与',
    honor: '特殊荣誉',
    system: '系统奖励'
  }
  return textMap[type] || type
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    setTimeout(() => {
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取徽章列表失败:', error)
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
    name: '',
    type: '',
    status: ''
  })
  pagination.page = 1
  getList()
}

// 处理新增
const handleAdd = () => {
  formTitle.value = '新增徽章'
  formVisible.value = true
}

// 处理编辑
const handleEdit = (row: any) => {
  formTitle.value = '编辑徽章'
  Object.assign(form, row)
  formVisible.value = true
}

// 处理查看详情
const handleView = (row: any) => {
  currentBadge.value = row
  detailVisible.value = true
}

// 处理发放徽章
const handleAward = (row: any) => {
  currentBadge.value = row
  awardVisible.value = true
}

// 处理状态变更
const handleStatusChange = (row: any) => {
  const statusText = row.status === 1 ? '启用' : '禁用'
  ElMessage.success(`徽章${statusText}成功`)
}

// 处理删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除此徽章吗？删除后无法恢复！', '提示', {
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

// 处理提交
const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (form.id) {
          ElMessage.success('更新成功')
        } else {
          ElMessage.success('创建成功')
        }
        formVisible.value = false
        getList()
      } catch (error) {
        console.error('提交失败:', error)
      }
    }
  })
}

// 处理发放提交
const handleAwardSubmit = () => {
  awardFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (currentBadge.value) {
          currentBadge.value.awardCount++
        }
        ElMessage.success('徽章发放成功')
        awardVisible.value = false
        getList()
      } catch (error) {
        console.error('发放失败:', error)
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: null,
    name: '',
    type: '',
    icon: '',
    condition: '',
    points: 0,
    description: '',
    status: 1
  })
  formRef.value?.resetFields()
}

// 重置发放表单
const resetAwardForm = () => {
  Object.assign(awardForm, {
    userId: '',
    reason: ''
  })
  awardFormRef.value?.resetFields()
}

// 处理用户徽章
const handleUserBadges = () => {
  ElMessage.info('用户徽章功能开发中...')
}

// 处理发放规则
const handleRules = () => {
  ElMessage.info('发放规则功能开发中...')
}

// 处理统计
const handleStatistics = () => {
  ElMessage.info('徽章统计功能开发中...')
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
      
      &.active {
        background: #67c23a;
      }
      
      &.awarded {
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

.search-form {
  .el-form-item {
    margin-bottom: 0;
  }
}

.badge-icon {
  display: flex;
  justify-content: center;
  
  .default-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #999;
  }
}

.points {
  color: #67c23a;
  font-weight: bold;
}

.badge-detail {
  .badge-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    
    .badge-icon-large {
      margin-right: 20px;
      
      .default-icon-large {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        color: #999;
      }
    }
    
    .badge-info {
      h3 {
        margin: 0 0 10px 0;
        color: #303133;
      }
    }
  }
}

.award-badge-info {
  display: flex;
  align-items: center;
  
  .badge-icon-small {
    margin-right: 10px;
    
    .default-icon-small {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: #999;
    }
  }
}
</style>