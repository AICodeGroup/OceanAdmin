<template>
  <div class="app-container">
    <div class="page-header">
      <h1>积分规则配置</h1>
    </div>

    <!-- 操作按钮 -->
    <div class="button-group">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增规则
      </el-button>
      <el-button type="success" @click="handleBatchEnable">
        <el-icon><Check /></el-icon>
        批量启用
      </el-button>
    </div>

    <!-- 表格 -->
    <div class="card-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="规则名称" />
        <el-table-column prop="action" label="触发动作" width="120">
          <template #default="scope">
            <el-tag :type="getActionType(scope.row.action)">
              {{ getActionText(scope.row.action) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分数量" width="100">
          <template #default="scope">
            <span class="points" :class="{ positive: scope.row.points > 0, negative: scope.row.points < 0 }">
              {{ scope.row.points > 0 ? '+' : '' }}{{ scope.row.points }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="dailyLimit" label="每日限制" width="100">
          <template #default="scope">
            {{ scope.row.dailyLimit === -1 ? '无限制' : scope.row.dailyLimit + '次' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button 
              :type="scope.row.status === 1 ? 'warning' : 'success'" 
              size="small" 
              @click="handleToggleStatus(scope.row)"
            >
              {{ scope.row.status === 1 ? '禁用' : '启用' }}
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

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入规则名称" />
        </el-form-item>
        <el-form-item label="触发动作" prop="action">
          <el-select v-model="form.action" placeholder="请选择触发动作" style="width: 100%">
            <el-option label="用户注册" value="register" />
            <el-option label="每日签到" value="daily_checkin" />
            <el-option label="完成课程" value="complete_course" />
            <el-option label="发布观察日记" value="publish_diary" />
            <el-option label="分享课程" value="share_course" />
            <el-option label="邀请好友" value="invite_friend" />
            <el-option label="参与活动" value="join_activity" />
            <el-option label="购买课程" value="buy_course" />
          </el-select>
        </el-form-item>
        <el-form-item label="积分数量" prop="points">
          <el-input-number 
            v-model="form.points" 
            :min="-1000" 
            :max="1000" 
            placeholder="正数为奖励，负数为扣除"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="每日限制" prop="dailyLimit">
          <el-input-number 
            v-model="form.dailyLimit" 
            :min="-1" 
            :max="100" 
            placeholder="-1表示无限制"
            style="width: 100%"
          />
          <div class="form-tip">-1表示无限制，0表示禁用，大于0表示每日最多触发次数</div>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规则描述" prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入规则描述" 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
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
const dialogVisible = ref(false)
const dialogTitle = ref('新增规则')
const tableData = ref([
  {
    id: 1,
    name: '用户注册奖励',
    action: 'register',
    points: 100,
    dailyLimit: 1,
    status: 1,
    description: '新用户注册完成后获得积分奖励',
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    name: '每日签到',
    action: 'daily_checkin',
    points: 10,
    dailyLimit: 1,
    status: 1,
    description: '用户每日签到获得积分',
    createTime: '2024-01-15 10:35:00'
  },
  {
    id: 3,
    name: '完成课程学习',
    action: 'complete_course',
    points: 50,
    dailyLimit: -1,
    status: 1,
    description: '完成一门课程学习获得积分',
    createTime: '2024-01-15 10:40:00'
  },
  {
    id: 4,
    name: '发布观察日记',
    action: 'publish_diary',
    points: 20,
    dailyLimit: 3,
    status: 1,
    description: '发布海洋观察日记获得积分',
    createTime: '2024-01-15 10:45:00'
  },
  {
    id: 5,
    name: '违规行为扣分',
    action: 'violation',
    points: -50,
    dailyLimit: -1,
    status: 1,
    description: '用户违规行为扣除积分',
    createTime: '2024-01-15 10:50:00'
  }
])

const multipleSelection = ref([])
const formRef = ref<FormInstance>()

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 5
})

// 表单数据
const form = reactive({
  id: null,
  name: '',
  action: '',
  points: 0,
  dailyLimit: -1,
  status: 1,
  description: ''
})

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  action: [{ required: true, message: '请选择触发动作', trigger: 'change' }],
  points: [{ required: true, message: '请输入积分数量', trigger: 'blur' }]
}

// 获取动作类型样式
const getActionType = (action: string) => {
  const typeMap: Record<string, string> = {
    register: 'success',
    daily_checkin: 'primary',
    complete_course: 'success',
    publish_diary: 'info',
    share_course: 'warning',
    invite_friend: 'success',
    join_activity: 'primary',
    buy_course: 'warning',
    violation: 'danger'
  }
  return typeMap[action] || 'info'
}

// 获取动作文本
const getActionText = (action: string) => {
  const textMap: Record<string, string> = {
    register: '用户注册',
    daily_checkin: '每日签到',
    complete_course: '完成课程',
    publish_diary: '发布日记',
    share_course: '分享课程',
    invite_friend: '邀请好友',
    join_activity: '参与活动',
    buy_course: '购买课程',
    violation: '违规行为'
  }
  return textMap[action] || action
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    setTimeout(() => {
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取积分规则列表失败:', error)
    loading.value = false
  }
}

// 处理选择变化
const handleSelectionChange = (selection: any[]) => {
  multipleSelection.value = selection
}

// 处理新增
const handleAdd = () => {
  dialogTitle.value = '新增积分规则'
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑积分规则'
  Object.assign(form, row)
  dialogVisible.value = true
}

// 处理状态切换
const handleToggleStatus = async (row: any) => {
  try {
    const action = row.status === 1 ? '禁用' : '启用'
    await ElMessageBox.confirm(`确定要${action}这个积分规则吗？`, '提示', {
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

// 处理删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这个积分规则吗？', '提示', {
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

// 处理批量启用
const handleBatchEnable = async () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请选择要启用的规则')
    return
  }
  
  try {
    await ElMessageBox.confirm('确定要批量启用选中的积分规则吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    multipleSelection.value.forEach((item: any) => {
      item.status = 1
    })
    ElMessage.success('批量启用成功')
  } catch (error) {
    console.error('批量启用失败:', error)
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
        dialogVisible.value = false
        getList()
      } catch (error) {
        console.error('提交失败:', error)
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: null,
    name: '',
    action: '',
    points: 0,
    dailyLimit: -1,
    status: 1,
    description: ''
  })
  formRef.value?.resetFields()
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
.points {
  font-weight: bold;
  
  &.positive {
    color: #67c23a;
  }
  
  &.negative {
    color: #f56c6c;
  }
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
</style>