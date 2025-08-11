<template>
  <div class="app-container">
    <div class="page-header">
      <h1>积分任务管理</h1>
    </div>

    <!-- 搜索区域 -->
    <div class="card-container">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="任务名称">
          <el-input v-model="searchForm.name" placeholder="请输入任务名称" clearable />
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="每日任务" value="daily" />
            <el-option label="周任务" value="weekly" />
            <el-option label="月任务" value="monthly" />
            <el-option label="一次性任务" value="once" />
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
        新增任务
      </el-button>
    </div>

    <!-- 表格 -->
    <div class="card-container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="任务名称" />
        <el-table-column label="任务类型" width="120">
          <template #default="scope">
            <el-tag :type="getTypeColor(scope.row.type)">
              {{ getTypeText(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="任务描述" />
        <el-table-column prop="points" label="奖励积分" width="100" />
        <el-table-column prop="completionCount" label="完成次数" width="100" />
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
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              编辑
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 响应式数据
const loading = ref(false)

const tableData = ref([
  {
    id: 1,
    name: '每日签到',
    type: 'daily',
    description: '每天登录系统即可获得积分',
    points: 10,
    completionCount: 1256,
    status: 1,
    createTime: '2024-01-31 10:30:00'
  },
  {
    id: 2,
    name: '完成课程',
    type: 'once',
    description: '完成任意一门课程学习',
    points: 100,
    completionCount: 89,
    status: 1,
    createTime: '2024-01-30 09:15:00'
  },
  {
    id: 3,
    name: '周活跃用户',
    type: 'weekly',
    description: '一周内登录5天以上',
    points: 50,
    completionCount: 234,
    status: 1,
    createTime: '2024-01-29 14:00:00'
  }
])

// 搜索表单
const searchForm = reactive({
  name: '',
  type: '',
  status: ''
})

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 3
})

// 获取类型颜色
const getTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    daily: 'primary',
    weekly: 'success',
    monthly: 'warning',
    once: 'info'
  }
  return colorMap[type] || 'info'
}

// 获取类型文本
const getTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    daily: '每日任务',
    weekly: '周任务',
    monthly: '月任务',
    once: '一次性任务'
  }
  return textMap[type] || type
}

// 处理搜索
const handleSearch = () => {
  pagination.page = 1
  // 搜索逻辑
}

// 处理重置
const handleReset = () => {
  Object.assign(searchForm, {
    name: '',
    type: '',
    status: ''
  })
  pagination.page = 1
}

// 处理新增
const handleAdd = () => {
  ElMessage.info('新增任务功能开发中...')
}

// 处理编辑
const handleEdit = (row: any) => {
  ElMessage.info('编辑任务功能开发中...')
}

// 处理查看详情
const handleView = (row: any) => {
  ElMessage.info('查看任务详情功能开发中...')
}

// 处理状态变更
const handleStatusChange = (row: any) => {
  const statusText = row.status === 1 ? '启用' : '禁用'
  ElMessage.success(`任务${statusText}成功`)
}

// 处理删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除此任务吗？删除后无法恢复！', '提示', {
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
</style>