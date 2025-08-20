<template>
    <div class="app-container">
      <div class="page-header">
        <h1>日程管理</h1>
      </div>

      <div class="card-container">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="任务名称">
          <el-input v-model="searchForm.taskName" placeholder="请输入任务名称" clearable />
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

      <div class="button-group">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增每日任务
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
          <el-table-column prop="taskName" label="任务名称" width="200" />
          <el-table-column prop="points" label="积分" width="120" />
          <el-table-column prop="icon" label="图标" width="500" />
          <el-table-column label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="180" />
          <el-table-column label="操作" width="280" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">
                修改
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
          <el-form-item label="任务" prop="taskName">
            <el-input v-model="form.taskName" placeholder="请输入任务名称" />
          </el-form-item>
          <el-form-item label="积分" prop="points">
            <el-input v-model="form.points" placeholder="请输入积分" />
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-input v-model="form.icon" placeholder="请输入图标" />
          </el-form-item>


          <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="" style="width: 240px">
              <el-option
                v-for="item in status_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
  import { getAllDailyTask, updateTask, type Task ,deleteTask,createTask} from '@/api/task' 
  
  // 响应式数据
  const loading = ref(false)
  const formVisible = ref(false)
  const formTitle = ref('新增任务')
  const formRef = ref<FormInstance>()
  
  // 表格数据，明确类型为 Task 数组
  const tableData = ref<Task[]>([])
  // 搜索表单
const searchForm = reactive({
  taskName: '',
})
const status_options = [
  {
    value: 0,
    label: '禁用',
  },
  {
    value: 1,
    label: '启用',
  }
]
  
  // 表单数据，明确类型
  const form = reactive<Partial<Task>>({
    id: undefined,
    taskName: '',
    points: undefined,
    icon: '',
    status: 1,
  })
  
  
  // 表单验证规则
  const rules: FormRules = {
      status: [{ required: true, message: '请选择状态', trigger: 'change' }],
      taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
      points: [{ required: true, message: '请输入积分', trigger: 'blur' }],
      icon: [{ required: false, message: '请输入图标', trigger: 'blur' }],
  }
  
  // 分页数据
  const pagination = reactive({
    page: 1,
    size: 10,
    total: 0 // 初始总数为 0
  })
  
  
  // 获取日程状态类型
  const getStatusType = (status: number) => {
    const typeMap: Record<number, string> = {
      0: 'danger', // 禁用状态使用 danger 类型
      1: 'success',
    }
    return typeMap[status] || 'info'
  }
  
  // 获取日程状态文本
  const getStatusText = (status: number) => {
    const textMap: Record<number, string> = {
      0: '禁用',
      1: '启用',
    }
    return textMap[status] || '未知'
  }
  // 处理搜索
const handleSearch = () => {
  pagination.page = 1
  getList()
}

// 处理重置
const handleReset = () => {
  Object.assign(searchForm, {
    taskName: '',
  })
  pagination.page = 1
  getList()
}
// const updateForm = reactive({
//   id: undefined,
//   taskName: '',
//   points: undefined,
//   icon: '',
//   status: 1,
// })
  const updateByVo = async () => {
    try {
    const data = await updateTask({
      updateVo: form
    })
    console.log(form)
    console.log(data)
    } catch (error) {
      console.error('更新任务失败:', error)
    }
  }
  // 获取列表数据 - 已改造
  const getList = async () => {
    loading.value = true
    try {
      const data = await getAllDailyTask({
        currentPage: pagination.page,
        pageSize: pagination.size,
        searchForm: searchForm
      })
      console.log(data.taskList)
      tableData.value = data.taskList
      pagination.total = data.total
    } catch (error) { 
      console.error('获取任务列表失败:', error)
    } finally {
      loading.value = false
    }
  }
  

  
  // 处理新增
  const handleAdd = () => {
    resetForm() // 新增前先重置表单
    formTitle.value = '新增任务'
    formVisible.value = true
  }
  
  // 处理编辑
  const handleEdit = (row: Task) => {
    formTitle.value = '编辑任务'
    // 使用 Object.assign 确保响应性
    Object.assign(form, row)
    formVisible.value = true
    // console.log(row)
    
  }
  

  const deleteTaskApi = async (id: number) => {
    try {
      const data = await deleteTask(id)
      console.log(data)
    } catch (error) {
      console.error('删除任务失败:', error)
    }
  }
  
  // 处理删除 - 待实现
  const handleDelete = async (row: Task) => {
    try {
      await ElMessageBox.confirm(`确定要删除任务 “${row.taskName}” 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      
      // 在这里调用删除接口
      await deleteTaskApi(row.id)
      
      ElMessage.success('删除成功')
      getList() // 重新加载列表
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除失败:', error)
      }
    }
  }
  const createTaskApi = async () => {
    try {
      const data = await createTask(form)
      console.log(data)
    } catch (error) {
      console.error('创建任务失败:', error)
    }
  }
  // 处理提交 - 待实现
  const handleSubmit = () => {
    formRef.value?.validate(async (valid) => {
      if (valid) {
        try {
          if (form.id) {
            // 调用更新接口
            await updateByVo()
            ElMessage.success('更新成功')
          } else {
            // 调用新增接口
            await createTaskApi()
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
    formRef.value?.resetFields() // 重置校验状态
    Object.assign(form, { // 重置数据
      id: undefined,
      taskName: '',
      points: undefined,
      icon: '',
      status: 1,
    })
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