<template>
  <div class="app-container">
    <div class="page-header">
      <h1>课程物种关联管理</h1>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon total">
              <el-icon><Link /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.total }}</div>
              <div class="stat-label">关联总数</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon courses">
              <el-icon><Reading /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.courses }}</div>
              <div class="stat-label">关联课程</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon species">
              <el-icon><Cherry /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.species }}</div>
              <div class="stat-label">关联物种</div>
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
              <div class="stat-label">有效关联</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 搜索区域 -->
    <div class="card-container">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="课程">
          <el-select v-model="searchForm.courseId" placeholder="请选择课程" clearable filterable>
            <el-option
              v-for="course in courseList"
              :key="course.id"
              :label="course.title"
              :value="course.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物种">
          <el-select v-model="searchForm.speciesId" placeholder="请选择物种" clearable filterable>
            <el-option
              v-for="species in speciesList"
              :key="species.id"
              :label="species.chineseName"
              :value="species.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物种分类">
          <el-select v-model="searchForm.categoryId" placeholder="请选择分类" clearable>
            <el-option
              v-for="category in categoryList"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联类型">
          <el-select v-model="searchForm.relationType" placeholder="请选择关联类型" clearable>
            <el-option label="主要物种" value="primary" />
            <el-option label="相关物种" value="related" />
            <el-option label="对比物种" value="comparison" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="有效" :value="1" />
            <el-option label="无效" :value="0" />
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
        新增关联
      </el-button>
      <el-button type="success" @click="handleBatchAdd">
        <el-icon><DocumentAdd /></el-icon>
        批量关联
      </el-button>
      <el-button type="warning" @click="handleSync">
        <el-icon><Refresh /></el-icon>
        同步数据
      </el-button>
      <el-button type="info" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出关联
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
        <el-table-column label="课程信息" min-width="250">
          <template #default="scope">
            <div class="course-info">
              <el-image
                v-if="scope.row.courseCover"
                :src="scope.row.courseCover"
                style="width: 40px; height: 40px; border-radius: 4px; margin-right: 10px"
                fit="cover"
              />
              <div class="course-detail">
                <div class="course-title">{{ scope.row.courseTitle }}</div>
                <div class="course-meta">
                  <el-tag size="small" type="info">{{ scope.row.courseCategory }}</el-tag>
                  <span class="course-level">{{ scope.row.courseLevel }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="物种信息" min-width="200">
          <template #default="scope">
            <div class="species-info">
              <el-image
                v-if="scope.row.speciesImage"
                :src="scope.row.speciesImage"
                style="width: 40px; height: 40px; border-radius: 4px; margin-right: 10px"
                fit="cover"
              />
              <div class="species-detail">
                <div class="species-name">{{ scope.row.speciesChineseName }}</div>
                <div class="species-scientific">{{ scope.row.speciesScientificName }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="speciesCategory" label="物种分类" width="120">
          <template #default="scope">
            <el-tag type="success">{{ scope.row.speciesCategory }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="关联类型" width="120">
          <template #default="scope">
            <el-tag :type="getRelationTypeColor(scope.row.relationType)">
              {{ getRelationTypeText(scope.row.relationType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="权重" width="100">
          <template #default="scope">
            <el-tag type="warning">{{ scope.row.weight }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="关联说明" min-width="200" show-overflow-tooltip />
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
            <el-button type="info" size="small" @click="handleView(scope.row)">
              详情
            </el-button>
            <el-button type="success" size="small" @click="handlePreview(scope.row)">
              预览
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

    <!-- 添加/编辑关联对话框 -->
    <el-dialog
      v-model="formVisible"
      :title="formTitle"
      width="800px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="选择课程" prop="courseId">
              <el-select v-model="form.courseId" placeholder="请选择课程" filterable style="width: 100%">
                <el-option
                  v-for="course in courseList"
                  :key="course.id"
                  :label="course.title"
                  :value="course.id"
                >
                  <div class="course-option">
                    <span>{{ course.title }}</span>
                    <el-tag size="small" type="info">{{ course.category }}</el-tag>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择物种" prop="speciesId">
              <el-select v-model="form.speciesId" placeholder="请选择物种" filterable style="width: 100%">
                <el-option
                  v-for="species in speciesList"
                  :key="species.id"
                  :label="species.chineseName"
                  :value="species.id"
                >
                  <div class="species-option">
                    <span>{{ species.chineseName }}</span>
                    <small>{{ species.scientificName }}</small>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="关联类型" prop="relationType">
              <el-select v-model="form.relationType" placeholder="请选择关联类型" style="width: 100%">
                <el-option label="主要物种" value="primary" />
                <el-option label="相关物种" value="related" />
                <el-option label="对比物种" value="comparison" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权重" prop="weight">
              <el-input-number 
                v-model="form.weight" 
                :min="1" 
                :max="100" 
                placeholder="1-100"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="关联说明" prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入关联说明，例如：该物种在课程中的作用、学习重点等" 
          />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">有效</el-radio>
            <el-radio :label="0">无效</el-radio>
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

    <!-- 批量关联对话框 -->
    <el-dialog
      v-model="batchVisible"
      title="批量关联管理"
      width="900px"
    >
      <div class="batch-relation">
        <el-alert
          title="批量为课程关联多个物种，或为物种关联多个课程"
          type="info"
          show-icon
          :closable="false"
          style="margin-bottom: 20px"
        />
        
        <el-form :model="batchForm" label-width="100px">
          <el-form-item label="关联模式">
            <el-radio-group v-model="batchForm.mode">
              <el-radio value="course-to-species">一个课程关联多个物种</el-radio>
              <el-radio value="species-to-course">一个物种关联多个课程</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item v-if="batchForm.mode === 'course-to-species'" label="选择课程">
            <el-select v-model="batchForm.courseId" placeholder="请选择课程" style="width: 100%">
              <el-option
                v-for="course in courseList"
                :key="course.id"
                :label="course.title"
                :value="course.id"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item v-if="batchForm.mode === 'species-to-course'" label="选择物种">
            <el-select v-model="batchForm.speciesId" placeholder="请选择物种" style="width: 100%">
              <el-option
                v-for="species in speciesList"
                :key="species.id"
                :label="species.chineseName"
                :value="species.id"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item v-if="batchForm.mode === 'course-to-species'" label="选择物种">
            <el-transfer
              v-model="batchForm.selectedSpecies"
              :data="transferSpeciesData"
              :titles="['可选物种', '已选物种']"
              filterable
            />
          </el-form-item>
          
          <el-form-item v-if="batchForm.mode === 'species-to-course'" label="选择课程">
            <el-transfer
              v-model="batchForm.selectedCourses"
              :data="transferCourseData"
              :titles="['可选课程', '已选课程']"
              filterable
            />
          </el-form-item>
          
          <el-form-item label="默认关联类型">
            <el-select v-model="batchForm.relationType" style="width: 200px">
              <el-option label="主要物种" value="primary" />
              <el-option label="相关物种" value="related" />
              <el-option label="对比物种" value="comparison" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchVisible = false">取消</el-button>
          <el-button type="primary" @click="handleBatchSubmit">批量关联</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 关联详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="关联详情"
      width="800px"
    >
      <div v-if="currentRelation" class="relation-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="关联ID">{{ currentRelation.id }}</el-descriptions-item>
          <el-descriptions-item label="关联类型">
            <el-tag :type="getRelationTypeColor(currentRelation.relationType)">
              {{ getRelationTypeText(currentRelation.relationType) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="课程标题">{{ currentRelation.courseTitle }}</el-descriptions-item>
          <el-descriptions-item label="课程分类">{{ currentRelation.courseCategory }}</el-descriptions-item>
          <el-descriptions-item label="物种中文名">{{ currentRelation.speciesChineseName }}</el-descriptions-item>
          <el-descriptions-item label="物种学名">{{ currentRelation.speciesScientificName }}</el-descriptions-item>
          <el-descriptions-item label="物种分类">{{ currentRelation.speciesCategory }}</el-descriptions-item>
          <el-descriptions-item label="关联权重">{{ currentRelation.weight }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentRelation.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentRelation.updateTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="关联说明" :span="2">
            <div class="description-text">{{ currentRelation.description || '-' }}</div>
          </el-descriptions-item>
        </el-descriptions>
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
const formVisible = ref(false)
const batchVisible = ref(false)
const detailVisible = ref(false)
const formTitle = ref('新增关联')
const formRef = ref<FormInstance>()
const currentRelation = ref<any>(null)

// 统计数据
const stats = reactive({
  total: 89,
  courses: 23,
  species: 45,
  active: 76
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    courseId: 1,
    courseTitle: '海洋生物多样性',
    courseCategory: '海洋生物',
    courseLevel: '初级',
    courseCover: 'https://via.placeholder.com/40x40',
    speciesId: 1,
    speciesChineseName: '小丑鱼',
    speciesScientificName: 'Amphiprioninae',
    speciesCategory: '鱼类',
    speciesImage: 'https://via.placeholder.com/40x40',
    relationType: 'primary',
    weight: 10,
    description: '小丑鱼是课程的主要学习对象，重点介绍其与海葵的共生关系',
    status: 1,
    createTime: '2024-01-31 10:30:00',
    updateTime: null
  },
  {
    id: 2,
    courseId: 1,
    courseTitle: '海洋生物多样性',
    courseCategory: '海洋生物',
    courseLevel: '初级',
    courseCover: 'https://via.placeholder.com/40x40',
    speciesId: 2,
    speciesChineseName: '海星',
    speciesScientificName: 'Asteroidea',
    speciesCategory: '棘皮动物',
    speciesImage: 'https://via.placeholder.com/40x40',
    relationType: 'related',
    weight: 8,
    description: '海星作为相关物种，用于对比不同海洋生物的生活习性',
    status: 1,
    createTime: '2024-01-30 09:15:00',
    updateTime: '2024-01-31 14:20:00'
  },
  {
    id: 3,
    courseId: 2,
    courseTitle: '珊瑚礁生态系统',
    courseCategory: '生态系统',
    courseLevel: '中级',
    courseCover: 'https://via.placeholder.com/40x40',
    speciesId: 1,
    speciesChineseName: '小丑鱼',
    speciesScientificName: 'Amphiprioninae',
    speciesCategory: '鱼类',
    speciesImage: 'https://via.placeholder.com/40x40',
    relationType: 'comparison',
    weight: 6,
    description: '作为珊瑚礁生态系统的典型代表物种进行讲解',
    status: 1,
    createTime: '2024-01-29 14:00:00',
    updateTime: null
  }
])

// 课程列表
const courseList = ref([
  { id: 1, title: '海洋生物多样性', category: '海洋生物', level: '初级' },
  { id: 2, title: '珊瑚礁生态系统', category: '生态系统', level: '中级' },
  { id: 3, title: '深海探索', category: '海洋探索', level: '高级' }
])

// 物种列表
const speciesList = ref([
  { id: 1, chineseName: '小丑鱼', scientificName: 'Amphiprioninae', category: '鱼类' },
  { id: 2, chineseName: '海星', scientificName: 'Asteroidea', category: '棘皮动物' },
  { id: 3, chineseName: '海龟', scientificName: 'Cheloniidae', category: '爬行动物' }
])

// 分类列表
const categoryList = ref([
  { id: 1, name: '鱼类' },
  { id: 2, name: '棘皮动物' },
  { id: 3, name: '爬行动物' },
  { id: 4, name: '哺乳动物' }
])

// 搜索表单
const searchForm = reactive({
  courseId: '',
  speciesId: '',
  categoryId: '',
  relationType: '',
  status: ''
})

// 表单数据
const form = reactive({
  id: null,
  courseId: '',
  speciesId: '',
  relationType: '',
  weight: 5,
  description: '',
  status: 1
})

// 批量表单
const batchForm = reactive({
  mode: 'course-to-species',
  courseId: '',
  speciesId: '',
  selectedSpecies: [],
  selectedCourses: [],
  relationType: 'related'
})

// 表单验证规则
const rules: FormRules = {
  courseId: [{ required: true, message: '请选择课程', trigger: 'change' }],
  speciesId: [{ required: true, message: '请选择物种', trigger: 'change' }],
  relationType: [{ required: true, message: '请选择关联类型', trigger: 'change' }],
  weight: [{ required: true, message: '请设置权重', trigger: 'blur' }]
}

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 3
})

// 穿梭框数据
const transferSpeciesData = ref([])
const transferCourseData = ref([])

// 获取关联类型颜色
const getRelationTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    primary: 'danger',
    related: 'warning',
    comparison: 'info'
  }
  return colorMap[type] || 'info'
}

// 获取关联类型文本
const getRelationTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    primary: '主要物种',
    related: '相关物种',
    comparison: '对比物种'
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
    console.error('获取关联列表失败:', error)
    loading.value = false
  }
}

// 初始化穿梭框数据
const initTransferData = () => {
  transferSpeciesData.value = speciesList.value.map(species => ({
    key: species.id,
    label: `${species.chineseName} (${species.scientificName})`
  }))
  
  transferCourseData.value = courseList.value.map(course => ({
    key: course.id,
    label: `${course.title} - ${course.category}`
  }))
}

// 处理搜索
const handleSearch = () => {
  pagination.page = 1
  getList()
}

// 处理重置
const handleReset = () => {
  Object.assign(searchForm, {
    courseId: '',
    speciesId: '',
    categoryId: '',
    relationType: '',
    status: ''
  })
  pagination.page = 1
  getList()
}

// 处理新增
const handleAdd = () => {
  formTitle.value = '新增关联'
  formVisible.value = true
}

// 处理编辑
const handleEdit = (row: any) => {
  formTitle.value = '编辑关联'
  Object.assign(form, {
    id: row.id,
    courseId: row.courseId,
    speciesId: row.speciesId,
    relationType: row.relationType,
    weight: row.weight,
    description: row.description,
    status: row.status
  })
  formVisible.value = true
}

// 处理查看详情
const handleView = (row: any) => {
  currentRelation.value = row
  detailVisible.value = true
}

// 处理预览
const handlePreview = (row: any) => {
  ElMessage.info('预览课程中的物种展示效果')
}

// 处理状态变更
const handleStatusChange = (row: any) => {
  const statusText = row.status === 1 ? '有效' : '无效'
  ElMessage.success(`关联状态已更新为${statusText}`)
}

// 处理删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除此关联吗？删除后无法恢复！', '提示', {
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
    speciesId: '',
    relationType: '',
    weight: 5,
    description: '',
    status: 1
  })
  formRef.value?.resetFields()
}

// 处理批量关联
const handleBatchAdd = () => {
  initTransferData()
  batchVisible.value = true
}

// 处理批量提交
const handleBatchSubmit = () => {
  if (batchForm.mode === 'course-to-species') {
    if (!batchForm.courseId || batchForm.selectedSpecies.length === 0) {
      ElMessage.warning('请选择课程和物种')
      return
    }
  } else {
    if (!batchForm.speciesId || batchForm.selectedCourses.length === 0) {
      ElMessage.warning('请选择物种和课程')
      return
    }
  }
  
  ElMessage.success('批量关联成功')
  batchVisible.value = false
  getList()
}

// 处理同步数据
const handleSync = () => {
  ElMessage.info('同步数据功能开发中...')
}

// 处理导出
const handleExport = () => {
  ElMessage.info('导出关联数据功能开发中...')
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
      
      &.courses {
        background: #67c23a;
      }
      
      &.species {
        background: #e6a23c;
      }
      
      &.active {
        background: #f56c6c;
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

.course-info, .species-info {
  display: flex;
  align-items: center;
  
  .course-detail, .species-detail {
    flex: 1;
    
    .course-title, .species-name {
      font-weight: 500;
      color: #303133;
      margin-bottom: 4px;
    }
    
    .course-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .course-level {
        font-size: 12px;
        color: #909399;
      }
    }
    
    .species-scientific {
      font-style: italic;
      color: #606266;
      font-size: 12px;
    }
  }
}

.course-option, .species-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  small {
    color: #909399;
    font-style: italic;
  }
}

.batch-relation {
  .el-transfer {
    margin: 20px 0;
  }
}

.description-text {
  line-height: 1.6;
  color: #606266;
}
</style>