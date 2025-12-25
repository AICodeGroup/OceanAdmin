<template>
  <!-- 物种分类管理页面主容器 -->
  <div class="app-container">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <h1>物种分类管理</h1>
    </div>

    <!-- 搜索区域 -->
    <div class="card-container">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <!-- 分类名称搜索输入框 -->
        <el-form-item label="分类名称">
          <el-input v-model="searchForm.name" placeholder="请输入分类名称" clearable />
        </el-form-item>
        <!-- 搜索和重置按钮 -->
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

    <!-- 操作按钮区域 -->
    <div class="button-group">
      <!-- 新增分类按钮 -->
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增分类
      </el-button>
    </div>

    <!-- 分类树形表格 -->
    <div class="card-container">
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        row-key="id"
        border
        :indent="16"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <!-- 分类名称列 - 树形结构展示列 -->
        <el-table-column prop="name" label="分类名称" min-width="400">
          <template #default="{ row }">
            <span class="category-name-content">
              <el-icon v-if="row.children && row.children.length > 0" class="folder-icon">
                <Folder />
              </el-icon>
              <el-icon v-else class="file-icon">
                <Document />
              </el-icon>
              <span class="name-text">{{ row.name }}</span>
              <el-tag 
                v-if="row.children && row.children.length > 0" 
                size="small" 
                type="primary"
                style="margin-left: 8px;"
              >
                {{ row.children.length }} 个子分类
              </el-tag>
            </span>
          </template>
        </el-table-column>
        <!-- 分类层级列 -->
        <el-table-column label="层级" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getLevelTagType(row.level)" size="small">
              {{ getLevelText(row.level) }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- 分类描述列 -->
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <!-- 物种数量列 - 可点击查看 -->
        <el-table-column label="物种数量" width="120" align="center">
          <template #default="{ row }">
            <el-tag 
              :type="row.speciesCount > 0 ? 'primary' : 'info'" 
              :class="{ 'clickable-tag': row.speciesCount > 0 }"
              @click="row.speciesCount > 0 && handleViewSpeciesList(row)"
              style="cursor: pointer;"
            >
              {{ row.speciesCount || 0 }} 个
            </el-tag>
          </template>
        </el-table-column>
        <!-- 创建时间列 -->
        <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
        <!-- 操作列 -->
        <el-table-column label="操作" width="320" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="success" size="small" @click="handleAddChild(row)">
              添加子分类
            </el-button>
            <el-button type="warning" size="small" @click="handleAddSpecies(row)">
              添加物种
            </el-button>
            <el-tooltip 
              :content="getDeleteDisabledReason(row)" 
              :disabled="!isDeleteDisabled(row)"
              placement="top"
            >
              <span>
                <el-button 
                  type="danger" 
                  size="small" 
                  @click="handleDelete(row)"
                  :disabled="isDeleteDisabled(row)"
                >
                  删除
                </el-button>
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加/编辑分类对话框 -->
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
        label-width="100px"
      >
        <!-- 上级分类选择 - 树形选择器 -->
        <el-form-item label="上级分类" prop="parentId">
          <el-tree-select
            v-model="form.parentId"
            :data="categoryOptions"
            :props="{ value: 'id', label: 'name', children: 'children' }"
            placeholder="请选择上级分类（可选）"
            clearable
            check-strictly
            style="width: 100%"
          />
        </el-form-item>
        <!-- 分类名称输入 -->
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <!-- 分类描述输入 -->
        <el-form-item label="分类描述" prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入分类描述" 
          />
        </el-form-item>
        <!-- 图标上传 -->
        <el-form-item label="图标" prop="icon">
          <ImageUpload v-model="form.icon" model="species" :pid="1" placeholder="上传分类图标" />
        </el-form-item>
        <!-- 排序值输入 -->
        <el-form-item label="排序">
          <el-input-number 
            v-model="form.sortOrder" 
            :min="0" 
            :max="9999" 
            placeholder="排序值，数字越小排序越靠前"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加/编辑物种对话框 -->
    <el-dialog
      v-model="speciesFormVisible"
      :title="speciesFormTitle"
      width="800px"
      @close="resetSpeciesForm"
    >
      <el-form
        ref="speciesFormRef"
        :model="speciesForm"
        :rules="speciesRules"
        label-width="120px"
      >
        <!-- 第一行：物种名称和英文名称 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="物种名称" prop="name">
              <el-input v-model="speciesForm.name" placeholder="请输入物种名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="英文名称">
              <el-input v-model="speciesForm.englishName" placeholder="请输入英文名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行：拉丁学名和濒危等级 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="拉丁学名">
              <el-input v-model="speciesForm.latinName" placeholder="请输入拉丁学名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="濒危等级">
              <el-select v-model="speciesForm.endangeredLevel" placeholder="请选择濒危等级" style="width: 100%">
                <el-option label="无危" :value="0" />
                <el-option label="近危" :value="1" />
                <el-option label="易危" :value="2" />
                <el-option label="濒危" :value="3" />
                <el-option label="极危" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第三行：排序 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input-number v-model="speciesForm.sort" :min="0" :max="9999" placeholder="排序值" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 物种图片（多图上传） -->
        <el-form-item label="物种图片">
          <MultiImageUpload 
            v-model="speciesForm.imageUrl" 
            model="species" 
            :pid="1" 
            :max-count="9"
            placeholder="上传图片"
            tip="最多上传9张图片"
          />
        </el-form-item>
        <!-- 物种图标 -->
        <el-form-item label="物种图标">
          <ImageUpload v-model="speciesForm.iconUrl" model="species" :pid="1" placeholder="上传图标" />
        </el-form-item>
        <!-- 物种描述 -->
        <el-form-item label="物种描述">
          <el-input v-model="speciesForm.description" type="textarea" :rows="3" placeholder="请输入物种描述" />
        </el-form-item>
        <!-- 相关知识 -->
        <el-form-item label="相关知识">
          <el-input v-model="speciesForm.knowledge" type="textarea" :rows="3" placeholder="请输入相关知识" />
        </el-form-item>
        <!-- 面临威胁 -->
        <el-form-item label="面临威胁">
          <el-input v-model="speciesForm.facingThreats" type="textarea" :rows="3" placeholder="请输入面临威胁" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="speciesFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSpeciesSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 物种列表弹窗 -->
    <el-dialog
      v-model="speciesListVisible"
      :title="`分类「${currentCategory?.name}」下的物种`"
      width="900px"
    >
      <el-table :data="categorySpeciesList" v-loading="speciesListLoading" max-height="400">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="图片" width="90">
          <template #default="{ row }">
            <div 
              v-if="row.imageUrl" 
              class="species-list-image-cell"
              @click="handlePreviewSpeciesImages(row)"
            >
              <el-image
                :src="getFirstImage(row.imageUrl)"
                fit="cover"
                style="width: 50px; height: 50px; border-radius: 4px;"
              />
              <div v-if="getImageCount(row.imageUrl) > 1" class="species-image-count">
                +{{ getImageCount(row.imageUrl) - 1 }}
              </div>
            </div>
            <div v-else class="no-image-small">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="物种名称" min-width="120" />
        <el-table-column prop="latinName" label="拉丁学名" min-width="140" show-overflow-tooltip />
        <el-table-column prop="endangeredLevel" label="濒危等级" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="getEndangeredLevelType(row.endangeredLevel)" size="small">
              {{ getEndangeredLevelText(row.endangeredLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="info" size="small" @click="handleViewSpeciesDetail(row)">
              详情
            </el-button>
            <el-button type="primary" size="small" @click="handleEditSpeciesInList(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDeleteSpeciesInList(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 物种详情弹窗 -->
    <el-dialog
      v-model="speciesDetailDialogVisible"
      title="物种详情"
      width="700px"
      destroy-on-close
    >
      <div class="species-detail-content" v-if="currentSpeciesDetailData">
        <!-- 图片区域 -->
        <div class="detail-images" v-if="parseImageUrls(currentSpeciesDetailData.imageUrl).length > 0">
          <el-image
            v-for="(img, index) in parseImageUrls(currentSpeciesDetailData.imageUrl)"
            :key="index"
            :src="img"
            :preview-src-list="parseImageUrls(currentSpeciesDetailData.imageUrl)"
            :initial-index="index"
            :preview-teleported="true"
            fit="cover"
            class="detail-image"
          />
        </div>
        <div class="no-image-placeholder" v-else>
          <el-icon :size="48"><Picture /></el-icon>
          <span>暂无图片</span>
        </div>
        <!-- 基本信息 -->
        <div class="detail-info">
          <div class="detail-header">
            <h3 class="species-name">{{ currentSpeciesDetailData.name || '-' }}</h3>
            <el-tag 
              v-if="currentSpeciesDetailData.endangeredLevel !== undefined && currentSpeciesDetailData.endangeredLevel !== ''"
              :type="getEndangeredLevelType(currentSpeciesDetailData.endangeredLevel)"
              size="small"
            >
              {{ getEndangeredLevelText(currentSpeciesDetailData.endangeredLevel) }}
            </el-tag>
          </div>
          <p class="latin-name" v-if="currentSpeciesDetailData.latinName">{{ currentSpeciesDetailData.latinName }}</p>
          <el-descriptions :column="2" border class="detail-descriptions">
            <el-descriptions-item label="ID">{{ currentSpeciesDetailData.id || '-' }}</el-descriptions-item>
            <el-descriptions-item label="英文名">{{ currentSpeciesDetailData.englishName || '-' }}</el-descriptions-item>
            <el-descriptions-item label="排序">{{ currentSpeciesDetailData.sort ?? '-' }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ currentSpeciesDetailData.createdAt || '-' }}</el-descriptions-item>
          </el-descriptions>
          <div class="detail-section" v-if="currentSpeciesDetailData.description">
            <h4>物种描述</h4>
            <p>{{ currentSpeciesDetailData.description }}</p>
          </div>
          <div class="detail-section" v-if="currentSpeciesDetailData.knowledge">
            <h4>相关知识</h4>
            <p>{{ currentSpeciesDetailData.knowledge }}</p>
          </div>
          <div class="detail-section" v-if="currentSpeciesDetailData.facingThreats">
            <h4>面临威胁</h4>
            <p>{{ currentSpeciesDetailData.facingThreats }}</p>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="speciesDetailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 物种图片预览器 -->
    <el-image-viewer
      v-if="speciesImagePreviewVisible"
      :url-list="speciesImagePreviewList"
      :initial-index="0"
      @close="speciesImagePreviewVisible = false"
      teleported
    />

  </div>
</template>

<script setup lang="ts">
// Vue 3 Composition API 相关导入
import { ref, reactive, onMounted } from 'vue'
// Element Plus 消息提示和确认框
import { ElMessage, ElMessageBox } from 'element-plus'
// Element Plus 表单类型定义
import type { FormInstance, FormRules } from 'element-plus'
// 组件导入
import ImageUpload from '@/components/ImageUpload/index.vue'
import MultiImageUpload from '@/components/MultiImageUpload/index.vue'
// 物种分类相关 API 接口
import {
  getSpeciesTree,
  updateSpeciesTree,
  deleteSpeciesTree,
  saveSpeciesTree,
  saveSpecies,
  getSpeciesListByCategory,
  updateSpeciesCategory,
  deleteSpeciesCategory
} from '@/api/species'

// ========== 响应式数据定义 ==========
// 页面加载状态
const loading = ref(false)
// 表格引用
const tableRef = ref()
// 表单对话框显示状态
const formVisible = ref(false)
// 添加物种对话框显示状态
const speciesFormVisible = ref(false)
// 物种表单标题
const speciesFormTitle = ref('添加物种')
// 物种列表弹窗显示状态
const speciesListVisible = ref(false)
// 物种列表加载状态
const speciesListLoading = ref(false)
// 当前查看的分类
const currentCategory = ref<any>(null)
// 分类下的物种列表
const categorySpeciesList = ref<any[]>([])
// 排序管理对话框显示状态
const sortVisible = ref(false)
// 表单对话框标题
const formTitle = ref('新增分类')
// 表单引用
const formRef = ref<FormInstance>()
// 物种表单引用
const speciesFormRef = ref<FormInstance>()
// 排序树组件引用
const sortTreeRef = ref()

// 统计数据（当前未使用，保留用于后续扩展）
const stats = reactive({
  total: 12,
  species: 156,
  active: 10,
  recent: 3
})

// 表格数据（由后端树结构填充）
const tableData = ref<any[]>([])
// 原始树数据（用于搜索过滤恢复）
const originalTreeData = ref<any[]>([])

// ========== 类型定义 ==========
// 后端节点结构类型定义
type BackendNode = {
  id: number
  pid?: number | null
  name: string
  level?: number
  description?: string
  speciesList?: any[]
  children?: BackendNode[]
}

// ========== 数据处理函数 ==========
/**
 * 将后端节点结构标准化为表格需要的字段
 * @param nodes 后端返回的树形节点数组
 * @param level 当前层级
 * @returns 标准化后的节点数组
 */
const normalizeTree = (nodes: BackendNode[] | undefined, level: number = 1): any[] => {
  if (!nodes || nodes.length === 0) return []
  return nodes.map((n: BackendNode) => ({
    id: n.id,
    name: n.name,
    description: n.description || '',
    parentId: n.pid ?? null,
    level: n.level ?? level,
    sortOrder: 0,
    speciesCount: Array.isArray(n.speciesList) ? n.speciesList.length : 0,
    status: 1,
    createTime: '2024-01-01 00:00:00',
    children: normalizeTree(n.children, level + 1),
    hasChildren: n.children && n.children.length > 0
  }))
}

// ========== 表单数据定义 ==========
// 搜索表单数据
const searchForm = reactive({
  name: '',
  status: ''
})

// 分类表单数据
const form = reactive({
  id: null,
  name: '',
  description: '',
  parentId: null,
  icon: '',
  sortOrder: 0,
  status: 1
})

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

// 物种表单数据
const speciesForm = reactive({
  id: null as number | null,
  name: '',
  englishName: '',
  latinName: '',
  categoryId: null as number | null,
  endangeredLevel: '' as number | string,
  imageUrl: '',
  iconUrl: '',
  description: '',
  knowledge: '',
  facingThreats: '',
  sort: 0
})

// 物种表单验证规则
const speciesRules: FormRules = {
  name: [{ required: true, message: '请输入物种名称', trigger: 'blur' }]
}

// 分页数据（树形结构不使用分页，保留以兼容其他逻辑）
const pagination = reactive({
  page: 1,
  size: 999,
  total: 0
})

// 分类选项（用于上级分类选择）
const categoryOptions = ref<any[]>([])
// 排序数据
const sortData = ref<any[]>([])

// ========== API 调用函数 ==========
/**
 * 获取分类列表数据
 */
const getList = async () => {
  loading.value = true
  try {
    const res: any = await getSpeciesTree()
    // 兼容不同返回包裹层
    const raw = Array.isArray(res) ? res : (res?.data ?? [])
    originalTreeData.value = normalizeTree(raw)
    applyFilters()
    // 树形结构不使用分页，一次性加载所有数据
    pagination.total = countAllNodes(tableData.value)
  } catch (error) {
    console.error('获取分类列表失败:', error)
  } finally {
    loading.value = false
  }
}

/**
 * 统计树中所有节点数量
 * @param nodes 节点数组
 * @returns 节点总数
 */
const countAllNodes = (nodes: any[]): number => {
  let count = 0
  for (const node of nodes) {
    count++
    if (node.children && node.children.length > 0) {
      count += countAllNodes(node.children)
    }
  }
  return count
}

/**
 * 获取层级标签类型
 * @param level 层级
 * @returns Element Plus 标签类型
 */
const getLevelTagType = (level: number): string => {
  const types = ['', 'primary', 'success', 'warning']
  return types[level] || 'info'
}

/**
 * 获取层级文本
 * @param level 层级
 * @returns 层级文本
 */
const getLevelText = (level: number): string => {
  const texts = ['', '一级', '二级', '三级']
  return texts[level] || `第${level}级`
}

// 组件挂载时获取分类选项
onMounted(() => {
  getCategoryOptions()
})

/**
 * 获取分类选项（用于上级分类选择）
 */
const getCategoryOptions = async () => {
  try {
    // 若已有表格树数据，直接复用；否则请求一次
    if (tableData.value.length === 0) {
      const res: any = await getSpeciesTree()
      const raw = Array.isArray(res) ? res : (res?.data ?? [])
      categoryOptions.value = normalizeTree(raw)
    } else {
      categoryOptions.value = JSON.parse(JSON.stringify(tableData.value))
    }
  } catch (e) {
    console.error('获取分类选项失败:', e)
  }
}

// ========== 搜索和过滤功能 ==========
/**
 * 处理搜索操作
 */
const handleSearch = () => {
  pagination.page = 1
  applyFilters()
}

/**
 * 处理重置搜索条件
 */
const handleReset = () => {
  Object.assign(searchForm, {
    name: '',
    status: ''
  })
  pagination.page = 1
  applyFilters()
}

/**
 * 应用搜索过滤（在原始树上过滤到表格）
 */
const applyFilters = () => {
  const keyword = (searchForm.name || '').trim().toLowerCase()
  if (!keyword) {
    tableData.value = JSON.parse(JSON.stringify(originalTreeData.value))
    return
  }
  const filtered = filterTree(originalTreeData.value, (node: any) => {
    return String(node.name || '').toLowerCase().includes(keyword)
  })
  tableData.value = filtered
}

/**
 * 递归过滤树，命中自身或子孙则保留
 * @param nodes 节点数组
 * @param predicate 过滤条件函数
 * @returns 过滤后的节点数组
 */
function filterTree(nodes: any[], predicate: (n: any) => boolean): any[] {
  const result: any[] = []
  for (const node of nodes) {
    const children = Array.isArray(node.children) ? node.children : []
    const matchedChildren = filterTree(children, predicate)
    if (predicate(node) || matchedChildren.length > 0) {
      result.push({ ...node, children: matchedChildren })
    }
  }
  return result
}

// ========== 表单操作功能 ==========
/**
 * 处理新增分类
 */
const handleAdd = () => {
  formTitle.value = '新增分类'
  resetForm()
  getCategoryOptions()
  formVisible.value = true
}

/**
 * 处理编辑分类
 * @param row 要编辑的分类行数据
 */
const handleEdit = (row: any) => {
  formTitle.value = '编辑分类'
  Object.assign(form, {
    id: row.id,
    name: row.name,
    description: row.description,
    parentId: row.parentId,
    icon: row.icon || '',
    sortOrder: row.sortOrder,
    status: row.status
  })
  getCategoryOptions()
  formVisible.value = true
}

/**
 * 处理添加子分类
 * @param row 父分类行数据
 */
const handleAddChild = (row: any) => {
  formTitle.value = '添加子分类'
  Object.assign(form, {
    id: null,
    name: '',
    description: '',
    parentId: row.id,
    icon: '',
    sortOrder: 0,
    status: 1
  })
  getCategoryOptions()
  formVisible.value = true
}

/**
 * 处理查看物种（当前为占位功能）
 * @param row 分类行数据
 */
const handleViewSpecies = (row: any) => {
  ElMessage.info(`查看分类“${row.name}”下的物种`)
}

/**
 * 处理查看分类下的物种列表
 * @param row 分类行数据
 */
const handleViewSpeciesList = async (row: any) => {
  currentCategory.value = row
  speciesListLoading.value = true
  speciesListVisible.value = true
  try {
    const res: any = await getSpeciesListByCategory(row.id)
    categorySpeciesList.value = res?.data || res || []
  } catch (error) {
    console.error('获取物种列表失败:', error)
    categorySpeciesList.value = []
  } finally {
    speciesListLoading.value = false
  }
}

/**
 * 处理添加物种（在分类下直接添加）
 * @param row 分类行数据
 */
const handleAddSpecies = (row: any) => {
  speciesFormTitle.value = '添加物种'
  // 先重置表单
  Object.assign(speciesForm, {
    id: null,
    name: '',
    englishName: '',
    latinName: '',
    categoryId: row.id,
    endangeredLevel: '',
    imageUrl: '',
    iconUrl: '',
    description: '',
    knowledge: '',
    facingThreats: '',
    sort: 0
  })
  // 清除表单验证状态
  speciesFormRef.value?.clearValidate()
  speciesFormVisible.value = true
}

/**
 * 重置物种表单
 */
const resetSpeciesForm = () => {
  Object.assign(speciesForm, {
    id: null,
    name: '',
    englishName: '',
    latinName: '',
    categoryId: null,
    endangeredLevel: '',
    imageUrl: '',
    iconUrl: '',
    description: '',
    knowledge: '',
    facingThreats: '',
    sort: 0
  })
  speciesFormRef.value?.resetFields()
}

/**
 * 处理物种表单提交
 */
const handleSpeciesSubmit = () => {
  speciesFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (speciesForm.id) {
          // 编辑模式
          await updateSpeciesCategory({
            id: speciesForm.id,
            name: speciesForm.name,
            englishName: speciesForm.englishName,
            latinName: speciesForm.latinName,
            categoryId: speciesForm.categoryId,
            endangeredLevel: speciesForm.endangeredLevel,
            imageUrl: speciesForm.imageUrl,
            iconUrl: speciesForm.iconUrl,
            description: speciesForm.description,
            knowledge: speciesForm.knowledge,
            facingThreats: speciesForm.facingThreats,
            sort: speciesForm.sort
          })
          ElMessage.success('更新物种成功')
        } else {
          // 新增模式
          await saveSpecies({
            name: speciesForm.name,
            englishName: speciesForm.englishName,
            latinName: speciesForm.latinName,
            categoryId: speciesForm.categoryId,
            endangeredLevel: speciesForm.endangeredLevel,
            imageUrl: speciesForm.imageUrl,
            iconUrl: speciesForm.iconUrl,
            description: speciesForm.description,
            knowledge: speciesForm.knowledge,
            facingThreats: speciesForm.facingThreats,
            sort: speciesForm.sort
          })
          ElMessage.success('添加物种成功')
        }
        speciesFormVisible.value = false
        await getList()
        // 如果是从物种列表弹窗编辑的，刷新列表
        if (currentCategory.value && speciesListVisible.value) {
          await handleViewSpeciesList(currentCategory.value)
        }
      } catch (error) {
        console.error('操作失败:', error)
        ElMessage.error('操作失败')
      }
    }
  })
}

/**
 * 在物种列表弹窗中编辑物种
 * @param row 物种行数据
 */
const handleEditSpeciesInList = (row: any) => {
  speciesFormTitle.value = '编辑物种'
  Object.assign(speciesForm, {
    id: row.id,
    name: row.name || '',
    englishName: row.englishName || '',
    latinName: row.latinName || '',
    categoryId: row.categoryId || currentCategory.value?.id,
    endangeredLevel: row.endangeredLevel ?? '',
    imageUrl: row.imageUrl || '',
    iconUrl: row.iconUrl || '',
    description: row.description || '',
    knowledge: row.knowledge || '',
    facingThreats: row.facingThreats || '',
    sort: row.sort || 0
  })
  speciesFormVisible.value = true
}

/**
 * 在物种列表弹窗中删除物种
 * @param row 物种行数据
 */
const handleDeleteSpeciesInList = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除此物种吗？删除后无法恢复！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteSpeciesCategory(row.id)
    ElMessage.success('删除成功')
    // 刷新物种列表
    if (currentCategory.value) {
      await handleViewSpeciesList(currentCategory.value)
    }
    // 刷新分类列表
    await getList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

/**
 * 获取濒危等级标签类型
 * @param level 濒危等级
 */
const getEndangeredLevelType = (level: number | string): string => {
  const typeMap: Record<number, string> = {
    0: 'success',  // 无危
    1: 'info',     // 近危
    2: 'warning',  // 易危
    3: 'danger',   // 濒危
    4: 'danger'    // 极危
  }
  return typeMap[Number(level)] || 'info'
}

/**
 * 获取濒危等级文本
 * @param level 濒危等级
 */
const getEndangeredLevelText = (level: number | string): string => {
  const textMap: Record<number, string> = {
    0: '无危',
    1: '近危',
    2: '易危',
    3: '濒危',
    4: '极危'
  }
  return textMap[Number(level)] || '-'
}

/**
 * 判断删除按钮是否禁用
 * @param row 分类行数据
 */
const isDeleteDisabled = (row: any): boolean => {
  return (row.speciesCount > 0) || (row.children && row.children.length > 0)
}

/**
 * 获取删除禁用的原因
 * @param row 分类行数据
 */
const getDeleteDisabledReason = (row: any): string => {
  if (row.speciesCount > 0) {
    return `该分类下有 ${row.speciesCount} 个物种，无法删除`
  }
  if (row.children && row.children.length > 0) {
    return `该分类下有 ${row.children.length} 个子分类，无法删除`
  }
  return ''
}

/**
 * 解析图片URL（支持逗号分隔的多图）
 * @param imageUrl 图片URL字符串
 */
const parseImageUrls = (imageUrl: string): string[] => {
  if (!imageUrl) return []
  return imageUrl.split(',').filter(url => url.trim())
}

/**
 * 获取第一张图片
 * @param imageUrl 图片URL字符串
 */
const getFirstImage = (imageUrl: string): string => {
  if (!imageUrl) return ''
  const images = imageUrl.split(',')
  return images[0]?.trim() || ''
}

/**
 * 获取图片数量
 * @param imageUrl 图片URL字符串
 */
const getImageCount = (imageUrl: string): number => {
  if (!imageUrl) return 0
  return imageUrl.split(',').filter(url => url.trim()).length
}

// 图片预览状态
const speciesImagePreviewVisible = ref(false)
const speciesImagePreviewList = ref<string[]>([])

/**
 * 处理物种列表中的图片预览
 * @param row 行数据
 */
const handlePreviewSpeciesImages = (row: any) => {
  const images = parseImageUrls(row.imageUrl)
  if (images.length > 0) {
    speciesImagePreviewList.value = images
    speciesImagePreviewVisible.value = true
  }
}

// 物种详情弹窗状态
const speciesDetailDialogVisible = ref(false)
const currentSpeciesDetailData = ref<any>(null)

/**
 * 查看物种详情
 * @param row 物种行数据
 */
const handleViewSpeciesDetail = (row: any) => {
  currentSpeciesDetailData.value = row
  speciesDetailDialogVisible.value = true
}

/**
 * 处理状态变更（当前为占位功能）
 * @param row 分类行数据
 */
const handleStatusChange = (row: any) => {
  const statusText = row.status === 1 ? '启用' : '禁用'
  ElMessage.success(`分类状态已更新为${statusText}`)
}

/**
 * 处理删除分类
 * @param row 要删除的分类行数据
 */
const handleDelete = async (row: any) => {
  // 检查是否有物种关联
  if (row.speciesCount > 0) {
    ElMessage.warning('该分类下还有物种，无法删除')
    return
  }

  // 检查是否有子分类
  if (row.children && row.children.length > 0) {
    ElMessage.warning('该分类下还有子分类，无法删除')
    return
  }

  try {
    await ElMessageBox.confirm('确定要删除此分类吗？删除后无法恢复！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteSpeciesTree(row.id)
    ElMessage.success('删除成功')
    await getList()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

/**
 * 处理表单提交
 */
const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (form.id) {
          // 更新分类
          await updateSpeciesTree({
            id: form.id,
            name: form.name,
            pid: form.parentId,
            description: form.description,
            icon: form.icon,
            sort: form.sortOrder
          })
          ElMessage.success('更新成功')
        } else {
          // 创建新分类
          await saveSpeciesTree({
            name: form.name,
            pid: form.parentId,
            description: form.description,
            icon: form.icon,
            sort: form.sortOrder
          })
          ElMessage.success('创建成功')
        }
        formVisible.value = false
        await getList()
      } catch (error) {
        console.error('提交失败:', error)
      }
    }
  })
}

/**
 * 重置表单数据
 */
const resetForm = () => {
  Object.assign(form, {
    id: null,
    name: '',
    description: '',
    parentId: null,
    icon: '',
    sortOrder: 0,
    status: 1
  })
  formRef.value?.resetFields()
}

// ========== 排序和批量操作功能 ==========
/**
 * 处理排序管理（当前为占位功能）
 */
const handleSort = () => {
  sortData.value = JSON.parse(JSON.stringify(tableData.value))
  sortVisible.value = true
}

/**
 * 处理批量操作（当前为占位功能）
 */
const handleBatchOperation = () => {
  ElMessage.info('批量操作功能开发中...')
}

// ========== 拖拽相关方法 ==========
/**
 * 判断是否允许拖拽放置
 * @param draggingNode 拖拽的节点
 * @param dropNode 放置目标节点
 * @param type 放置类型
 * @returns 是否允许放置
 */
const allowDrop = (draggingNode: any, dropNode: any, type: string) => {
  return type !== 'inner'
}

/**
 * 判断是否允许拖拽
 * @param draggingNode 拖拽的节点
 * @returns 是否允许拖拽
 */
const allowDrag = (draggingNode: any) => {
  return true
}

/**
 * 处理节点拖拽放置
 * @param draggingNode 拖拽的节点
 * @param dropNode 放置目标节点
 * @param dropType 放置类型
 */
const handleNodeDrop = (draggingNode: any, dropNode: any, dropType: string) => {
  ElMessage.info('排序已更改，请点击保存按钮确认')
}

/**
 * 保存排序结果
 */
const handleSaveSort = () => {
  ElMessage.success('排序保存成功')
  sortVisible.value = false
  getList()
}

// ========== 分页处理（树形结构已移除分页，保留方法兼容） ==========
/**
 * 处理每页条数变化
 * @param size 每页条数
 */
const handleSizeChange = (size: number) => {
  pagination.size = size
  getList()
}

/**
 * 处理当前页变化
 * @param page 当前页码
 */
const handleCurrentChange = (page: number) => {
  pagination.page = page
  getList()
}

// ========== 生命周期钩子 ==========
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
      
      &.species {
        background: #67c23a;
      }
      
      &.active {
        background: #e6a23c;
      }
      
      &.recent {
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

// 分类名称内容样式
.category-name-content {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  
  .folder-icon {
    color: #e6a23c;
    font-size: 16px;
    flex-shrink: 0;
  }
  
  .file-icon {
    color: #67c23a;
    font-size: 14px;
    flex-shrink: 0;
  }
  
  .name-text {
    font-weight: 500;
    color: #303133;
    white-space: nowrap;
  }
}

// 表格样式增强 - 树形结构缩进
:deep(.el-table) {
  // 确保树形结构缩进正确显示
  .el-table__row {
    &:hover > td {
      background-color: #f5f7fa;
    }
  }
  
  // 展开/收起图标样式
  .el-table__expand-icon {
    color: #409eff;
    font-size: 14px;
    margin-right: 4px;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
    flex-shrink: 0;
    
    &:hover {
      color: #337ecc;
    }
    
    // 展开状态旋转
    &.el-table__expand-icon--expanded {
      transform: rotate(90deg);
    }
  }
  
  // 树形结构缩进单元格
  .el-table__placeholder {
    display: inline-block;
    width: 16px;
    flex-shrink: 0;
  }
  
  // 第一列单元格内容不换行
  td:first-child .cell {
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow: visible;
  }
  
  // 缩进元素
  .el-table__indent {
    flex-shrink: 0;
  }
}

// 可点击的标签样式
.clickable-tag {
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 6px rgba(64, 158, 255, 0.3);
  }
}

// 无图片占位符样式
.no-image-small {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  font-size: 20px;
}

// 物种列表图片单元格样式
.species-list-image-cell {
  position: relative;
  width: 50px;
  height: 50px;
  cursor: pointer;
  display: inline-block;
  
  .species-image-count {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
  }
  
  &:hover .species-image-count {
    background: rgba(0, 0, 0, 0.6);
  }
}

.sort-management {
  .sort-tree-node {
    display: flex;
    align-items: center;
    flex: 1;
    
    .el-icon {
      margin-right: 8px;
      color: #409eff;
    }
    
    .sort-order {
      margin-left: auto;
      color: #909399;
      font-size: 12px;
    }
  }
}

// 物种详情弹窗样式
.species-detail-content {
  .detail-images {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    
    .detail-image {
      width: 120px;
      height: 120px;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.2s;
      
      &:hover {
        transform: scale(1.05);
      }
    }
  }
  
  .no-image-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    background: #f8f9fa;
    border-radius: 8px;
    color: #c0c4cc;
    margin-bottom: 20px;
    
    span {
      margin-top: 8px;
      font-size: 14px;
    }
  }
  
  .detail-info {
    .detail-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
      
      .species-name {
        margin: 0;
        font-size: 22px;
        font-weight: 600;
        color: #303133;
      }
    }
    
    .latin-name {
      font-style: italic;
      color: #909399;
      font-size: 14px;
      margin: 0 0 16px 0;
    }
    
    .detail-descriptions {
      margin-bottom: 20px;
    }
    
    .detail-section {
      margin-bottom: 16px;
      
      h4 {
        margin: 0 0 8px 0;
        font-size: 15px;
        font-weight: 600;
        color: #303133;
        padding-left: 10px;
        border-left: 3px solid #409eff;
      }
      
      p {
        margin: 0;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 6px;
        line-height: 1.7;
        color: #606266;
        font-size: 14px;
      }
    }
  }
}
</style>