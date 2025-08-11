<template>
  <div class="app-container">
    <div class="page-header">
      <h1>物种图鉴管理</h1>
    </div>

    <!-- 物种统计卡片 -->
    <div class="stats-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon total">
              <el-icon><Grid /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.total }}</div>
              <div class="stat-label">物种总数</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon categories">
              <el-icon><Menu /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.categories }}</div>
              <div class="stat-label">分类数量</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon published">
              <el-icon><Check /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.published }}</div>
              <div class="stat-label">已发布</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon views">
              <el-icon><View /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.views }}</div>
              <div class="stat-label">总浏览量</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 搜索区域 -->
    <div class="card-container">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="物种名称">
          <el-input v-model="searchForm.name" placeholder="请输入物种名称" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.categoryId" placeholder="请选择分类" clearable>
            <el-option
              v-for="category in categoryList"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="栖息地">
          <el-select v-model="searchForm.habitat" placeholder="请选择栖息地" clearable>
            <el-option label="浅海" value="shallow" />
            <el-option label="深海" value="deep" />
            <el-option label="珊瑚礁" value="coral" />
            <el-option label="海滩" value="beach" />
            <el-option label="潮间带" value="intertidal" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="已发布" :value="1" />
            <el-option label="草稿" :value="0" />
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
        新增物种
      </el-button>
      <el-button type="success" @click="handleCategories">
        <el-icon><Menu /></el-icon>
        分类管理
      </el-button>
      <el-button type="info" @click="handleImport">
        <el-icon><Upload /></el-icon>
        批量导入
      </el-button>
      <el-button type="warning" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出数据
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
        <el-table-column label="物种图片" width="100">
          <template #default="scope">
            <el-image
              v-if="scope.row.images && scope.row.images.length > 0"
              :src="scope.row.images[0]"
              :preview-src-list="scope.row.images"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 8px"
            />
            <div v-else class="no-image">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="chineseName" label="中文名" width="150" />
        <el-table-column prop="scientificName" label="学名" width="200" />
        <el-table-column prop="categoryName" label="分类" width="120" />
        <el-table-column label="栖息地" width="100">
          <template #default="scope">
            <el-tag :type="getHabitatColor(scope.row.habitat)">
              {{ getHabitatText(scope.row.habitat) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="体长" width="100">
          <template #default="scope">
            {{ scope.row.size || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="浏览量" width="100" />
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

    <!-- 物种详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="物种详情"
      width="900px"
    >
      <div v-if="currentSpecies" class="species-detail">
        <div class="species-header">
          <div class="species-images">
            <el-image
              v-if="currentSpecies.images && currentSpecies.images.length > 0"
              :src="currentSpecies.images[0]"
              :preview-src-list="currentSpecies.images"
              fit="cover"
              style="width: 200px; height: 150px; border-radius: 8px"
            />
            <div v-else class="no-image-large">
              <el-icon><Picture /></el-icon>
            </div>
          </div>
          <div class="species-info">
            <h2>{{ currentSpecies.chineseName }}</h2>
            <p class="scientific-name">{{ currentSpecies.scientificName }}</p>
            <div class="tags">
              <el-tag>{{ currentSpecies.categoryName }}</el-tag>
              <el-tag :type="getHabitatColor(currentSpecies.habitat)">
                {{ getHabitatText(currentSpecies.habitat) }}
              </el-tag>
            </div>
          </div>
        </div>
        
        <el-descriptions :column="2" border>
          <el-descriptions-item label="物种ID">{{ currentSpecies.id }}</el-descriptions-item>
          <el-descriptions-item label="体长">{{ currentSpecies.size || '-' }}</el-descriptions-item>
          <el-descriptions-item label="体重">{{ currentSpecies.weight || '-' }}</el-descriptions-item>
          <el-descriptions-item label="寿命">{{ currentSpecies.lifespan || '-' }}</el-descriptions-item>
          <el-descriptions-item label="保护等级">{{ currentSpecies.protectionLevel || '-' }}</el-descriptions-item>
          <el-descriptions-item label="浏览量">{{ currentSpecies.viewCount }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentSpecies.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentSpecies.updateTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="形态特征" :span="2">
            <div class="description-text">{{ currentSpecies.morphology || '-' }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="生活习性" :span="2">
            <div class="description-text">{{ currentSpecies.habits || '-' }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="分布范围" :span="2">
            <div class="description-text">{{ currentSpecies.distribution || '-' }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="保护现状" :span="2">
            <div class="description-text">{{ currentSpecies.conservation || '-' }}</div>
          </el-descriptions-item>
        </el-descriptions>
        
        <!-- 更多图片 -->
        <div v-if="currentSpecies.images && currentSpecies.images.length > 1" class="more-images">
          <h4>更多图片</h4>
          <div class="image-gallery">
            <el-image
              v-for="(image, index) in currentSpecies.images.slice(1)"
              :key="index"
              :src="image"
              :preview-src-list="currentSpecies.images"
              fit="cover"
              class="gallery-image"
            />
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 添加/编辑物种对话框 -->
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
            <el-form-item label="中文名" prop="chineseName">
              <el-input v-model="form.chineseName" placeholder="请输入中文名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学名" prop="scientificName">
              <el-input v-model="form.scientificName" placeholder="请输入学名" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分类" prop="categoryId">
              <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
                <el-option
                  v-for="category in categoryList"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="栖息地" prop="habitat">
              <el-select v-model="form.habitat" placeholder="请选择栖息地" style="width: 100%">
                <el-option label="浅海" value="shallow" />
                <el-option label="深海" value="deep" />
                <el-option label="珊瑚礁" value="coral" />
                <el-option label="海滩" value="beach" />
                <el-option label="潮间带" value="intertidal" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="体长" prop="size">
              <el-input v-model="form.size" placeholder="如：10-20cm" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="体重" prop="weight">
              <el-input v-model="form.weight" placeholder="如：100-200g" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="寿命" prop="lifespan">
              <el-input v-model="form.lifespan" placeholder="如：5-10年" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="保护等级" prop="protectionLevel">
          <el-select v-model="form.protectionLevel" placeholder="请选择保护等级" style="width: 100%">
            <el-option label="无危" value="LC" />
            <el-option label="近危" value="NT" />
            <el-option label="易危" value="VU" />
            <el-option label="濒危" value="EN" />
            <el-option label="极危" value="CR" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="形态特征" prop="morphology">
          <el-input v-model="form.morphology" type="textarea" :rows="3" placeholder="请输入形态特征描述" />
        </el-form-item>
        
        <el-form-item label="生活习性" prop="habits">
          <el-input v-model="form.habits" type="textarea" :rows="3" placeholder="请输入生活习性描述" />
        </el-form-item>
        
        <el-form-item label="分布范围" prop="distribution">
          <el-input v-model="form.distribution" type="textarea" :rows="2" placeholder="请输入分布范围" />
        </el-form-item>
        
        <el-form-item label="保护现状" prop="conservation">
          <el-input v-model="form.conservation" type="textarea" :rows="2" placeholder="请输入保护现状" />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">发布</el-radio>
            <el-radio :label="0">草稿</el-radio>
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

    <!-- 分类管理对话框 -->
    <el-dialog
      v-model="categoryVisible"
      title="分类管理"
      width="600px"
    >
      <div class="category-management">
        <div class="add-category">
          <el-input
            v-model="newCategoryName"
            placeholder="请输入分类名称"
            style="width: 200px; margin-right: 10px"
          />
          <el-button type="primary" @click="handleAddCategory">添加分类</el-button>
        </div>
        
        <el-table :data="categoryList" style="width: 100%; margin-top: 20px">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="分类名称" />
          <el-table-column prop="speciesCount" label="物种数量" width="100" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEditCategory(scope.row)">
                编辑
              </el-button>
              <el-button type="danger" size="small" @click="handleDeleteCategory(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
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
const categoryVisible = ref(false)
const formTitle = ref('新增物种')
const currentSpecies = ref<any>(null)
const formRef = ref<FormInstance>()
const newCategoryName = ref('')

// 统计数据
const stats = reactive({
  total: 156,
  categories: 12,
  published: 142,
  views: 8956
})

const tableData = ref([
  {
    id: 1,
    chineseName: '小丑鱼',
    scientificName: 'Amphiprioninae',
    categoryId: 1,
    categoryName: '鱼类',
    habitat: 'coral',
    size: '8-11cm',
    weight: '20-30g',
    lifespan: '6-10年',
    protectionLevel: 'LC',
    images: ['https://via.placeholder.com/300x200'],
    morphology: '体色鲜艳，通常为橙色、红色或黄色，身上有白色条纹。',
    habits: '生活在海葵中，与海葵形成共生关系。',
    distribution: '印度洋和太平洋的热带珊瑚礁区域',
    conservation: '目前种群稳定，但面临栖息地破坏威胁。',
    viewCount: 1256,
    status: 1,
    createTime: '2024-01-31 10:30:00',
    updateTime: null
  },
  {
    id: 2,
    chineseName: '海星',
    scientificName: 'Asteroidea',
    categoryId: 2,
    categoryName: '棘皮动物',
    habitat: 'intertidal',
    size: '5-30cm',
    weight: '50-200g',
    lifespan: '5-35年',
    protectionLevel: 'LC',
    images: ['https://via.placeholder.com/300x200', 'https://via.placeholder.com/300x200'],
    morphology: '身体呈星形，通常有5条腕，表面有棘刺。',
    habits: '底栖生活，以贝类、蠕虫等为食。',
    distribution: '全球各大洋的浅海区域',
    conservation: '大部分种类种群稳定。',
    viewCount: 892,
    status: 1,
    createTime: '2024-01-30 09:15:00',
    updateTime: '2024-01-31 14:20:00'
  },
  {
    id: 3,
    chineseName: '海龟',
    scientificName: 'Cheloniidae',
    categoryId: 3,
    categoryName: '爬行动物',
    habitat: 'shallow',
    size: '60-120cm',
    weight: '40-200kg',
    lifespan: '50-100年',
    protectionLevel: 'EN',
    images: ['https://via.placeholder.com/300x200'],
    morphology: '身体扁平，四肢呈鳍状，头部不能缩入壳内。',
    habits: '在海洋中生活，回到海滩产卵。',
    distribution: '全球热带和亚热带海域',
    conservation: '受到海洋污染和栖息地破坏威胁，需要保护。',
    viewCount: 2134,
    status: 1,
    createTime: '2024-01-29 14:00:00',
    updateTime: null
  }
])

// 分类列表
const categoryList = ref([
  { id: 1, name: '鱼类', speciesCount: 45, createTime: '2024-01-01 00:00:00' },
  { id: 2, name: '棘皮动物', speciesCount: 23, createTime: '2024-01-01 00:00:00' },
  { id: 3, name: '爬行动物', speciesCount: 12, createTime: '2024-01-01 00:00:00' },
  { id: 4, name: '哺乳动物', speciesCount: 8, createTime: '2024-01-01 00:00:00' }
])

// 搜索表单
const searchForm = reactive({
  name: '',
  categoryId: '',
  habitat: '',
  status: ''
})

// 表单数据
const form = reactive({
  id: null,
  chineseName: '',
  scientificName: '',
  categoryId: '',
  habitat: '',
  size: '',
  weight: '',
  lifespan: '',
  protectionLevel: '',
  morphology: '',
  habits: '',
  distribution: '',
  conservation: '',
  status: 1
})

// 表单验证规则
const rules: FormRules = {
  chineseName: [{ required: true, message: '请输入中文名', trigger: 'blur' }],
  scientificName: [{ required: true, message: '请输入学名', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  habitat: [{ required: true, message: '请选择栖息地', trigger: 'change' }]
}

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 3
})

// 获取栖息地颜色
const getHabitatColor = (habitat: string) => {
  const colorMap: Record<string, string> = {
    shallow: 'primary',
    deep: 'success',
    coral: 'warning',
    beach: 'info',
    intertidal: 'danger'
  }
  return colorMap[habitat] || 'info'
}

// 获取栖息地文本
const getHabitatText = (habitat: string) => {
  const textMap: Record<string, string> = {
    shallow: '浅海',
    deep: '深海',
    coral: '珊瑚礁',
    beach: '海滩',
    intertidal: '潮间带'
  }
  return textMap[habitat] || habitat
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    setTimeout(() => {
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取物种列表失败:', error)
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
    habitat: '',
    status: ''
  })
  pagination.page = 1
  getList()
}

// 处理新增
const handleAdd = () => {
  formTitle.value = '新增物种'
  formVisible.value = true
}

// 处理编辑
const handleEdit = (row: any) => {
  formTitle.value = '编辑物种'
  Object.assign(form, row)
  formVisible.value = true
}

// 处理查看详情
const handleView = (row: any) => {
  currentSpecies.value = row
  detailVisible.value = true
}

// 处理预览
const handlePreview = (row: any) => {
  ElMessage.info('预览功能开发中...')
}

// 处理状态变更
const handleStatusChange = (row: any) => {
  const statusText = row.status === 1 ? '发布' : '草稿'
  ElMessage.success(`物种状态已更新为${statusText}`)
}

// 处理删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除此物种吗？删除后无法恢复！', '提示', {
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
    chineseName: '',
    scientificName: '',
    categoryId: '',
    habitat: '',
    size: '',
    weight: '',
    lifespan: '',
    protectionLevel: '',
    morphology: '',
    habits: '',
    distribution: '',
    conservation: '',
    status: 1
  })
  formRef.value?.resetFields()
}

// 处理分类管理
const handleCategories = () => {
  categoryVisible.value = true
}

// 处理添加分类
const handleAddCategory = () => {
  if (!newCategoryName.value.trim()) {
    ElMessage.warning('请输入分类名称')
    return
  }
  
  const newId = Math.max(...categoryList.value.map(c => c.id)) + 1
  categoryList.value.push({
    id: newId,
    name: newCategoryName.value.trim(),
    speciesCount: 0,
    createTime: new Date().toLocaleString()
  })
  
  newCategoryName.value = ''
  ElMessage.success('添加成功')
}

// 处理编辑分类
const handleEditCategory = (row: any) => {
  ElMessage.info('编辑分类功能开发中...')
}

// 处理删除分类
const handleDeleteCategory = async (row: any) => {
  if (row.speciesCount > 0) {
    ElMessage.warning('该分类下还有物种，无法删除')
    return
  }
  
  try {
    await ElMessageBox.confirm('确定要删除此分类吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const index = categoryList.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      categoryList.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 处理导入
const handleImport = () => {
  ElMessage.info('批量导入功能开发中...')
}

// 处理导出
const handleExport = () => {
  ElMessage.info('导出数据功能开发中...')
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
      
      &.categories {
        background: #67c23a;
      }
      
      &.published {
        background: #e6a23c;
      }
      
      &.views {
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

.no-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  font-size: 24px;
}

.species-detail {
  .species-header {
    display: flex;
    margin-bottom: 20px;
    
    .species-images {
      margin-right: 20px;
      
      .no-image-large {
        width: 200px;
        height: 150px;
        border-radius: 8px;
        background: #f5f7fa;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #c0c4cc;
        font-size: 48px;
      }
    }
    
    .species-info {
      flex: 1;
      
      h2 {
        margin: 0 0 10px 0;
        color: #303133;
        font-size: 24px;
      }
      
      .scientific-name {
        font-style: italic;
        color: #606266;
        margin-bottom: 15px;
        font-size: 16px;
      }
      
      .tags {
        .el-tag {
          margin-right: 10px;
        }
      }
    }
  }
  
  .description-text {
    line-height: 1.6;
    color: #606266;
  }
}

.more-images {
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

.category-management {
  .add-category {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
}
</style>
