<template>
  <div class="app-container">
    <div class="page-header">
      <h1>足迹管理</h1>
    </div>

    <!-- 搜索区域 -->
    <div class="card-container">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="地点">
          <el-input v-model="searchForm.location" placeholder="请输入地点" clearable />
        </el-form-item>
        <el-form-item label="足迹类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="课程学习" value="course" />
            <el-option label="观察记录" value="observation" />
            <el-option label="探索活动" value="exploration" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="记录时间">
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
        新增足迹
      </el-button>
      <el-button type="success" @click="handleMapView">
        <el-icon><Location /></el-icon>
        地图查看
      </el-button>
      <el-button type="info" @click="handleTrackAnalysis">
        <el-icon><TrendCharts /></el-icon>
        轨迹分析
      </el-button>
      <el-button type="warning" @click="handleStatistics">
        <el-icon><DataAnalysis /></el-icon>
        足迹统计
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
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column label="足迹类型" width="100">
          <template #default="scope">
            <el-tag :type="getTypeColor(scope.row.type)">
              {{ getTypeText(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="足迹标题" />
        <el-table-column prop="location" label="地点" width="150" />
        <el-table-column label="坐标" width="150">
          <template #default="scope">
            <span v-if="scope.row.latitude && scope.row.longitude">
              {{ scope.row.latitude }}, {{ scope.row.longitude }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="100">
          <template #default="scope">
            <el-image
              v-if="scope.row.images && scope.row.images.length > 0"
              :src="scope.row.images[0]"
              :preview-src-list="scope.row.images"
              fit="cover"
              style="width: 60px; height: 40px; border-radius: 4px"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="recordTime" label="记录时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleView(scope.row)">
              详情
            </el-button>
            <el-button type="info" size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="success" size="small" @click="handleShowOnMap(scope.row)">
              地图
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

    <!-- 足迹详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="足迹详情"
      width="800px"
    >
      <div v-if="currentFootprint" class="footprint-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="足迹ID">{{ currentFootprint.id }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ currentFootprint.username }}</el-descriptions-item>
          <el-descriptions-item label="足迹类型">
            <el-tag :type="getTypeColor(currentFootprint.type)">
              {{ getTypeText(currentFootprint.type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="足迹标题">{{ currentFootprint.title }}</el-descriptions-item>
          <el-descriptions-item label="地点">{{ currentFootprint.location }}</el-descriptions-item>
          <el-descriptions-item label="坐标">
            {{ currentFootprint.latitude && currentFootprint.longitude 
               ? `${currentFootprint.latitude}, ${currentFootprint.longitude}` 
               : '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="记录时间">{{ currentFootprint.recordTime }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentFootprint.createTime }}</el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{ currentFootprint.description || '-' }}</el-descriptions-item>
        </el-descriptions>
        
        <!-- 足迹图片 -->
        <div v-if="currentFootprint.images && currentFootprint.images.length > 0" class="footprint-images">
          <h4>足迹图片</h4>
          <div class="image-gallery">
            <el-image
              v-for="(image, index) in currentFootprint.images"
              :key="index"
              :src="image"
              :preview-src-list="currentFootprint.images"
              fit="cover"
              class="gallery-image"
            />
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 添加/编辑足迹对话框 -->
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
        <el-form-item label="足迹类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
            <el-option label="课程学习" value="course" />
            <el-option label="观察记录" value="observation" />
            <el-option label="探索活动" value="exploration" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="足迹标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入足迹标题" />
        </el-form-item>
        <el-form-item label="地点" prop="location">
          <el-input v-model="form.location" placeholder="请输入地点" />
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input-number v-model="form.longitude" :precision="6" placeholder="请输入经度" style="width: 100%" />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input-number v-model="form.latitude" :precision="6" placeholder="请输入纬度" style="width: 100%" />
        </el-form-item>
        <el-form-item label="记录时间" prop="recordTime">
          <el-date-picker
            v-model="form.recordTime"
            type="datetime"
            placeholder="请选择记录时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入足迹描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 地图查看对话框 -->
    <el-dialog
      v-model="mapVisible"
      title="足迹地图"
      width="90%"
      top="5vh"
    >
      <div class="map-container">
        <div id="footprint-map" style="width: 100%; height: 500px;"></div>
      </div>
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
const mapVisible = ref(false)
const formTitle = ref('新增足迹')
const currentFootprint = ref<any>(null)
const formRef = ref<FormInstance>()

const tableData = ref([
  {
    id: 1,
    username: '小海豚',
    type: 'course',
    title: '海洋生物观察记录',
    location: '青岛海洋馆',
    latitude: 36.0986,
    longitude: 120.3719,
    images: ['https://via.placeholder.com/300x200', 'https://via.placeholder.com/300x200'],
    recordTime: '2024-01-31 10:30:00',
    createTime: '2024-01-31 10:35:00',
    description: '今天在海洋馆观察了各种海洋生物，学到了很多知识。'
  },
  {
    id: 2,
    username: '海洋妈妈',
    type: 'observation',
    title: '海滩生物观察',
    location: '金沙滩海滨',
    latitude: 35.9728,
    longitude: 120.2082,
    images: ['https://via.placeholder.com/300x200'],
    recordTime: '2024-01-30 15:20:00',
    createTime: '2024-01-30 15:25:00',
    description: '在海滩发现了很多有趣的小生物，记录了它们的特征。'
  },
  {
    id: 3,
    username: '小鲸鱼',
    type: 'exploration',
    title: '深海探索体验',
    location: '海洋科技馆',
    latitude: 36.1052,
    longitude: 120.3845,
    images: [],
    recordTime: '2024-01-29 14:00:00',
    createTime: '2024-01-29 14:10:00',
    description: '体验了深海探索模拟器，感受了深海的神秘。'
  }
])

// 搜索表单
const searchForm = reactive({
  username: '',
  location: '',
  type: '',
  dateRange: []
})

// 表单数据
const form = reactive({
  id: null,
  userId: '',
  type: '',
  title: '',
  location: '',
  longitude: null,
  latitude: null,
  recordTime: '',
  description: ''
})

// 用户列表（模拟数据）
const userList = ref([
  { id: 1, username: '小海豚', phone: '13800138001' },
  { id: 2, username: '海洋妈妈', phone: '13800138002' },
  { id: 3, username: '小鲸鱼', phone: '13800138003' }
])

// 表单验证规则
const rules: FormRules = {
  userId: [{ required: true, message: '请选择用户', trigger: 'change' }],
  type: [{ required: true, message: '请选择足迹类型', trigger: 'change' }],
  title: [{ required: true, message: '请输入足迹标题', trigger: 'blur' }],
  location: [{ required: true, message: '请输入地点', trigger: 'blur' }],
  recordTime: [{ required: true, message: '请选择记录时间', trigger: 'change' }]
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
    course: 'primary',
    observation: 'success',
    exploration: 'warning',
    other: 'info'
  }
  return colorMap[type] || 'info'
}

// 获取类型文本
const getTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    course: '课程学习',
    observation: '观察记录',
    exploration: '探索活动',
    other: '其他'
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
    console.error('获取足迹列表失败:', error)
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
    location: '',
    type: '',
    dateRange: []
  })
  pagination.page = 1
  getList()
}

// 处理新增
const handleAdd = () => {
  formTitle.value = '新增足迹'
  formVisible.value = true
}

// 处理编辑
const handleEdit = (row: any) => {
  formTitle.value = '编辑足迹'
  Object.assign(form, row)
  formVisible.value = true
}

// 处理查看详情
const handleView = (row: any) => {
  currentFootprint.value = row
  detailVisible.value = true
}

// 处理在地图上显示
const handleShowOnMap = (row: any) => {
  if (!row.latitude || !row.longitude) {
    ElMessage.warning('该足迹没有坐标信息')
    return
  }
  ElMessage.info('地图功能开发中...')
}

// 处理地图查看
const handleMapView = () => {
  mapVisible.value = true
  ElMessage.info('地图功能开发中...')
}

// 处理轨迹分析
const handleTrackAnalysis = () => {
  ElMessage.info('轨迹分析功能开发中...')
}

// 处理统计
const handleStatistics = () => {
  ElMessage.info('足迹统计功能开发中...')
}

// 处理删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除此足迹吗？删除后无法恢复！', '提示', {
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
    userId: '',
    type: '',
    title: '',
    location: '',
    longitude: null,
    latitude: null,
    recordTime: '',
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
.search-form {
  .el-form-item {
    margin-bottom: 0;
  }
}

.footprint-detail {
  .el-descriptions {
    margin-bottom: 20px;
  }
}

.footprint-images {
  margin-top: 20px;
  
  h4 {
    margin-bottom: 10px;
    color: #303133;
  }
  
  .image-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    
    .gallery-image {
      width: 120px;
      height: 80px;
      border-radius: 4px;
      cursor: pointer;
    }
  }
}

.map-container {
  width: 100%;
  height: 500px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>