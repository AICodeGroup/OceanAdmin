<template>
  <div class="app-container">
    <div class="page-header">
      <h1>课程管理</h1>
    </div>

    <!-- 搜索区域 -->
    <div class="card-container">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="课程名称">
          <el-input v-model="searchForm.name" placeholder="请输入课程名称" clearable />
        </el-form-item>
        <el-form-item label="课程分类">
          <el-select v-model="searchForm.categoryId" placeholder="请选择分类" clearable>
            <el-option label="海洋生物" value="1" />
            <el-option label="海洋环保" value="2" />
            <el-option label="海洋探索" value="3" />
            <el-option label="海洋科学" value="4" />
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
        新增课程
      </el-button>
      <!-- <el-button type="success" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出数据
      </el-button> -->
    </div>

    <!-- 表格 -->
    <div class="card-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="课程封面" width="120">
          <template #default="scope">
            <el-image
              :src="scope.row.cover"
              :preview-src-list="[scope.row.cover]"
              :preview-teleported="true"
              fit="cover"
              style="width: 80px; height: 60px; border-radius: 4px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="课程名称" />
        <el-table-column prop="categoryName" label="分类" width="100" />
        <el-table-column label="价格" width="100">
          <template #default="scope">
            <span class="price">¥{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="studentCount" label="报名人数" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="info" size="small" @click="handleSchedule(scope.row)">
              日程
            </el-button>
            <el-button type="warning" size="small" @click="handleToggleStatus(scope.row)">
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const tableData = ref([
  {
    id: 1,
    name: '海洋生物探索之旅',
    cover: 'https://beniocean.com/crmebimage/public/user/2025/08/20/f32a31db91c44cc38234c1a15e01c3f2qclstj2jwq.jpg',
    categoryName: '海洋生物',
    price: 299,
    studentCount: 156,
    status: 1,
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    name: '海洋环保小卫士',
    cover: 'https://via.placeholder.com/80x60',
    categoryName: '海洋环保',
    price: 199,
    studentCount: 89,
    status: 1,
    createTime: '2024-01-14 14:20:00'
  },
  {
    id: 3,
    name: '深海探险记',
    cover: 'https://via.placeholder.com/80x60',
    categoryName: '海洋探索',
    price: 399,
    studentCount: 234,
    status: 0,
    createTime: '2024-01-13 09:15:00'
  }
])

// 搜索表单
const searchForm = reactive({
  name: '',
  categoryId: '',
  status: ''
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
    // 这里应该调用实际的API
    // const { data } = await getCourseList({
    //   page: pagination.page,
    //   size: pagination.size,
    //   ...searchForm
    // })
    // tableData.value = data.list
    // pagination.total = data.total
    
    // 模拟加载延迟
    setTimeout(() => {
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取课程列表失败:', error)
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
    categoryId: '',
    status: ''
  })
  pagination.page = 1
  getList()
}

// 处理新增
const handleAdd = () => {
  router.push('/course/add')
}

// 处理编辑
const handleEdit = (row: any) => {
  router.push(`/course/edit/${row.id}`)
}

// 处理日程管理
const handleSchedule = (row: any) => {
  router.push(`/course/schedule/${row.id}`)
}

// 处理状态切换
const handleToggleStatus = async (row: any) => {
  try {
    const action = row.status === 1 ? '禁用' : '启用'
    await ElMessageBox.confirm(`确定要${action}这个课程吗？`, '提示', {
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
    await ElMessageBox.confirm('确定要删除这个课程吗？', '提示', {
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

.price {
  color: #f56c6c;
  font-weight: bold;
}
</style>