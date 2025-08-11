<template>
  <div class="app-container">
    <div class="page-header">
      <h1>日程管理</h1>
    </div>

    <!-- 搜索区域 -->
    <div class="card-container">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="课程名称">
          <el-input v-model="searchForm.courseName" placeholder="请输入课程名称" clearable />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="日程状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="未开始" :value="0" />
            <el-option label="进行中" :value="1" />
            <el-option label="已完成" :value="2" />
            <el-option label="已取消" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="日程时间">
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
        新增日程
      </el-button>
      <el-button type="success" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出日程
      </el-button>
      <el-button type="info" @click="handleStatistics">
        <el-icon><DataAnalysis /></el-icon>
        日程统计
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
        <el-table-column prop="courseName" label="课程名称" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="scheduleDate" label="日程日期" width="120" />
        <el-table-column prop="scheduleTime" label="时间段" width="150">
          <template #default="scope">
            {{ scope.row.startTime }} - {{ scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column prop="location" label="地点" width="150" />
        <el-table-column label="参与状态" width="100">
          <template #default="scope">
            <el-tag :type="getParticipationStatusType(scope.row.participationStatus)">
              {{ getParticipationStatusText(scope.row.participationStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="日程状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="info" size="small" @click="handleView(scope.row)">
              详情
            </el-button>
            <el-button 
              v-if="scope.row.participationStatus === 0"
              type="success" 
              size="small" 
              @click="handleConfirm(scope.row)"
            >
              确认参与
            </el-button>
            <el-button 
              v-if="scope.row.status === 0"
              type="warning" 
              size="small" 
              @click="handleCancel(scope.row)"
            >
              取消日程
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

    <!-- 日程详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="日程详情"
      width="800px"
    >
      <div v-if="currentSchedule" class="schedule-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="日程ID">{{ currentSchedule.id }}</el-descriptions-item>
          <el-descriptions-item label="课程名称">{{ currentSchedule.courseName }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ currentSchedule.username }}</el-descriptions-item>
          <el-descriptions-item label="用户手机">{{ currentSchedule.userPhone }}</el-descriptions-item>
          <el-descriptions-item label="日程日期">{{ currentSchedule.scheduleDate }}</el-descriptions-item>
          <el-descriptions-item label="时间段">{{ currentSchedule.startTime }} - {{ currentSchedule.endTime }}</el-descriptions-item>
          <el-descriptions-item label="地点">{{ currentSchedule.location }}</el-descriptions-item>
          <el-descriptions-item label="参与状态">
            <el-tag :type="getParticipationStatusType(currentSchedule.participationStatus)">
              {{ getParticipationStatusText(currentSchedule.participationStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="日程状态">
            <el-tag :type="getStatusType(currentSchedule.status)">
              {{ getStatusText(currentSchedule.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentSchedule.createTime }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ currentSchedule.remark || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- 添加/编辑日程对话框 -->
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
        <el-form-item label="课程" prop="courseId">
          <el-select v-model="form.courseId" placeholder="请选择课程" style="width: 100%">
            <el-option
              v-for="course in courseList"
              :key="course.id"
              :label="course.name"
              :value="course.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户" prop="userId">
          <el-select v-model="form.userId" placeholder="请选择用户" filterable style="width: 100%">
            <el-option
              v-for="user in userList"
              :key="user.id"
              :label="`${user.username} (${user.phone})`"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日程日期" prop="scheduleDate">
          <el-date-picker
            v-model="form.scheduleDate"
            type="date"
            placeholder="请选择日程日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-time-picker
            v-model="form.startTime"
            placeholder="请选择开始时间"
            format="HH:mm"
            value-format="HH:mm"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-time-picker
            v-model="form.endTime"
            placeholder="请选择结束时间"
            format="HH:mm"
            value-format="HH:mm"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="地点" prop="location">
          <el-input v-model="form.location" placeholder="请输入地点" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="formVisible = false">取消</el-button>
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
const detailVisible = ref(false)
const formVisible = ref(false)
const formTitle = ref('新增日程')
const currentSchedule = ref<any>(null)
const formRef = ref<FormInstance>()

const tableData = ref([
  {
    id: 1,
    courseName: '海洋生物探索之旅',
    username: '小海豚',
    userPhone: '13800138001',
    scheduleDate: '2024-02-05',
    startTime: '09:00',
    endTime: '11:00',
    location: '海洋馆A区',
    participationStatus: 1,
    status: 0,
    createTime: '2024-01-31 10:30:00',
    remark: '第一次海洋生物观察活动'
  },
  {
    id: 2,
    courseName: '海洋环保小卫士',
    username: '海洋妈妈',
    userPhone: '13800138002',
    scheduleDate: '2024-02-06',
    startTime: '14:00',
    endTime: '16:00',
    location: '海滩清洁区域',
    participationStatus: 1,
    status: 1,
    createTime: '2024-01-31 09:15:00',
    remark: '海滩清洁环保活动'
  },
  {
    id: 3,
    courseName: '深海探险记',
    username: '小鲸鱼',
    userPhone: '13800138003',
    scheduleDate: '2024-02-07',
    startTime: '10:00',
    endTime: '12:00',
    location: '深海模拟体验馆',
    participationStatus: 0,
    status: 0,
    createTime: '2024-01-31 14:20:00',
    remark: '深海探险模拟体验'
  }
])

// 搜索表单
const searchForm = reactive({
  courseName: '',
  username: '',
  status: '',
  dateRange: []
})

// 表单数据
const form = reactive({
  id: null,
  courseId: '',
  userId: '',
  scheduleDate: '',
  startTime: '',
  endTime: '',
  location: '',
  remark: ''
})

// 课程列表和用户列表（模拟数据）
const courseList = ref([
  { id: 1, name: '海洋生物探索之旅' },
  { id: 2, name: '海洋环保小卫士' },
  { id: 3, name: '深海探险记' }
])

const userList = ref([
  { id: 1, username: '小海豚', phone: '13800138001' },
  { id: 2, username: '海洋妈妈', phone: '13800138002' },
  { id: 3, username: '小鲸鱼', phone: '13800138003' }
])

// 表单验证规则
const rules: FormRules = {
  courseId: [{ required: true, message: '请选择课程', trigger: 'change' }],
  userId: [{ required: true, message: '请选择用户', trigger: 'change' }],
  scheduleDate: [{ required: true, message: '请选择日程日期', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  location: [{ required: true, message: '请输入地点', trigger: 'blur' }]
}

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 3
})

// 获取参与状态类型
const getParticipationStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    0: 'warning',
    1: 'success',
    2: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取参与状态文本
const getParticipationStatusText = (status: number) => {
  const textMap: Record<number, string> = {
    0: '待确认',
    1: '已确认',
    2: '已拒绝'
  }
  return textMap[status] || '未知'
}

// 获取日程状态类型
const getStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    0: 'primary',
    1: 'success',
    2: 'info',
    3: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取日程状态文本
const getStatusText = (status: number) => {
  const textMap: Record<number, string> = {
    0: '未开始',
    1: '进行中',
    2: '已完成',
    3: '已取消'
  }
  return textMap[status] || '未知'
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    setTimeout(() => {
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取日程列表失败:', error)
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
    courseName: '',
    username: '',
    status: '',
    dateRange: []
  })
  pagination.page = 1
  getList()
}

// 处理新增
const handleAdd = () => {
  formTitle.value = '新增日程'
  formVisible.value = true
}

// 处理编辑
const handleEdit = (row: any) => {
  formTitle.value = '编辑日程'
  Object.assign(form, row)
  formVisible.value = true
}

// 处理查看详情
const handleView = (row: any) => {
  currentSchedule.value = row
  detailVisible.value = true
}

// 处理确认参与
const handleConfirm = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要确认用户参与此日程吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    row.participationStatus = 1
    ElMessage.success('确认参与成功')
  } catch (error) {
    console.error('确认参与失败:', error)
  }
}

// 处理取消日程
const handleCancel = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要取消此日程吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    row.status = 3
    ElMessage.success('取消日程成功')
  } catch (error) {
    console.error('取消日程失败:', error)
  }
}

// 处理删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除此日程吗？删除后无法恢复！', '提示', {
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

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: null,
    courseId: '',
    userId: '',
    scheduleDate: '',
    startTime: '',
    endTime: '',
    location: '',
    remark: ''
  })
  formRef.value?.resetFields()
}

// 处理导出
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

// 处理统计
const handleStatistics = () => {
  ElMessage.info('日程统计功能开发中...')
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

.schedule-detail {
  .el-descriptions {
    margin-top: 20px;
  }
}
</style>