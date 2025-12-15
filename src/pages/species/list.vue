<template>
  <!-- 物种图鉴管理页面主容器 -->
  <div class="app-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>物种图鉴管理</h1>
    </div>
    
    <!-- 搜索区域 -->
    <div class="card-container">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <!-- 物种名称搜索 -->
        <el-form-item label="物种名称">
          <el-input v-model="searchForm.name" placeholder="请输入物种名称" clearable />
        </el-form-item>
        <!-- 分类筛选 -->
        <el-form-item label="分类">
          <el-select v-model="searchForm.categoryId" placeholder="请选择分类" clearable style="width: 200px">
            <el-option
              v-for="category in categoryList"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
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
      <!-- 新增物种按钮 -->
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增物种
      </el-button>
    
    </div>

    <!-- 物种数据表格 -->
    <div class="card-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
      >
        <!-- ID列 -->
        <el-table-column prop="id" label="ID" width="80" />
        <!-- 物种图片列 -->
        <el-table-column label="物种图片" width="100">
          <template #default="scope">
            <!-- 如果有图片URL则显示图片，支持预览 -->
            <el-image
              v-if="scope.row.imageUrl && scope.row.imageUrl.length > 0"
              :src="scope.row.imageUrl"
              :preview-src-list="scope.row.images"
              :preview-teleported="true"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 8px"
            />
            <!-- 无图片时显示占位图标 -->
            <div v-else class="no-image">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-table-column>
        <!-- 中文名称列 -->
        <el-table-column prop="name" label="中文名" width="150" />
        <!-- 拉丁学名列 -->
        <el-table-column prop="latinName" label="学名" width="200" />
        
        <!-- 创建时间列 -->
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <!-- 更新时间列 -->
        <el-table-column prop="updatedAt" label="更新时间" width="180" />
        <!-- 操作列 -->
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
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
        <!-- 第一行：物种名称和英文名称 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <!-- 物种名称（必填） -->
            <el-form-item label="物种名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入物种名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 英文名称（可选） -->
            <el-form-item label="英文名称">
              <el-input v-model="form.englishName" placeholder="请输入英文名称" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <!-- 第二行：拉丁学名和分类 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <!-- 拉丁学名（可选） -->
            <el-form-item label="拉丁学名">
              <el-input v-model="form.latinName" placeholder="请输入拉丁学名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 分类选择（必填） -->
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
        </el-row>
        
        <!-- 第三行：濒危等级和排序 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <!-- 濒危等级选择 -->
            <el-form-item label="濒危等级">
              <el-select v-model="form.endangeredLevel" placeholder="请选择濒危等级" style="width: 100%">
                <el-option label="无危" value="LC" />
                <el-option label="近危" value="NT" />
                <el-option label="易危" value="VU" />
                <el-option label="濒危" value="EN" />
                <el-option label="极危" value="CR" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 排序值输入 -->
            <el-form-item label="排序">
              <el-input-number v-model="form.sort" :min="0" :max="9999" placeholder="排序值" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <!-- 第四行：图片和图标 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <!-- 物种图片 -->
            <el-form-item label="物种图片">
              <ImageUpload v-model="form.imageUrl" model="product" :pid="1" placeholder="上传图片" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 物种图标 -->
            <el-form-item label="物种图标">
              <ImageUpload v-model="form.iconUrl" model="product" :pid="1" placeholder="上传图标" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <!-- 物种描述 -->
        <el-form-item label="物种描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入物种描述" />
        </el-form-item>
        
        <!-- 相关知识 -->
        <el-form-item label="相关知识">
          <el-input v-model="form.knowledge" type="textarea" :rows="3" placeholder="请输入相关知识" />
        </el-form-item>
        
        <!-- 面临威胁 -->
        <el-form-item label="面临威胁">
          <el-input v-model="form.facingThreats" type="textarea" :rows="3" placeholder="请输入面临威胁" />
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

  </div>
</template>

<script setup lang="ts">
// Vue 3 Composition API 导入
import { ref, reactive, onMounted } from 'vue'
// Element Plus 组件导入
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
// Vue Router 导入
import { useRouter } from 'vue-router'
// 组件导入
import ImageUpload from '@/components/ImageUpload/index.vue'
// API 接口导入
import {getSpeciesList,createSpeciesCategory,updateSpeciesCategory,deleteSpeciesCategory,getSpeciesTree,saveSpecies}from '@/api/species'

// 路由实例
const router = useRouter()

// ==================== 响应式数据定义 ====================
// 页面加载状态
const loading = ref(false)
// 详情对话框显示状态
const detailVisible = ref(false)
// 表单对话框显示状态
const formVisible = ref(false)
// 分类管理对话框显示状态
const categoryVisible = ref(false)
// 表单标题（新增/编辑）
const formTitle = ref('新增物种')
// 当前查看的物种详情
const currentSpecies = ref<any>(null)
// 表单引用
const formRef = ref<FormInstance>()
// 新增分类名称
const newCategoryName = ref('')

// 统计数据（暂未使用）
const stats = reactive({
  total: 156,
  categories: 12,
  published: 142,
  views: 8956
})
// ==================== 数据获取方法 ====================
/**
 * 获取分类列表
 * 从后端获取物种分类树形数据，并扁平化为下拉选项
 */
const getCategoryList = async () => {
  try {
    const res: any = await getSpeciesTree()
    // 兼容不同返回包裹层
    const raw = Array.isArray(res) ? res : (res?.data ?? [])
    // 将树形结构扁平化为分类选项
    categoryList.value = flattenTree(raw)
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

/**
 * 将树形结构扁平化
 * 递归遍历树形数据，将所有节点（包括子节点）提取到一维数组中
 * @param nodes 树形节点数组
 * @returns 扁平化后的节点数组
 */
const flattenTree = (nodes: any[]): any[] => {
  const result: any[] = []
  
  const flatten = (nodeList: any[]) => {
    nodeList.forEach(node => {
      result.push({
        id: node.id,
        name: node.name,
        speciesCount: Array.isArray(node.speciesList) ? node.speciesList.length : 0,
        createTime: '2024-01-01 00:00:00' // 后端可能没有这个字段，使用默认值
      })
      
      // 递归处理子节点
      if (node.children && node.children.length > 0) {
        flatten(node.children)
      }
    })
  }
  
  flatten(nodes)
  return result
}

// ==================== 生命周期钩子 ====================
// 组件挂载时初始化数据
onMounted(() => {
  getSList()
  getCategoryList()
})

/**
 * 获取物种列表数据
 * 根据搜索条件和分页参数从后端获取物种数据
 */
const getSList = async ()=>{
  const params = {
      name: searchForm.name || null,
      categoryId: searchForm.categoryId || null,
      englishName: searchForm.englishName || null,
      latinName: searchForm.latinName || null,
      endangeredLevel: searchForm.endangeredLevel || null,
      page: pagination.page || 1,
      limit: pagination.size || 10
    }
  const res: any = await getSpeciesList(params)
  console.log('API响应:', res);
  
  // 处理响应数据，兼容不同的数据结构
  tableData.value = res.data?.list || res.list || []
  pagination.total = res.data?.total || res.total || 0
  console.log('表格数据:', tableData.value);
  console.log('分页总数:', pagination.total);
}

// ==================== 数据状态定义 ====================
// 表格数据
const tableData = ref([])

// 分类列表（用于下拉选择）
const categoryList = ref<any[]>([])

// 搜索表单数据
const searchForm = reactive({
  name: '',           // 物种名称
  categoryId: '',     // 分类ID
  englishName: '',    // 英文名称
  latinName: '',      // 拉丁学名
  endangeredLevel: '', // 濒危等级
  habitat: '',        // 栖息地
  status: ''          // 状态
})

// 表单默认数据结构
const defaultForm = {
  id: null,
  name: '',              // 物种名称
  description: '',       // 物种描述
  imageUrl: '',          // 物种图片URL
  iconUrl: '',           // 物种图标URL
  categoryId: '',        // 分类ID
  englishName: '',       // 英文名称
  latinName: '',         // 拉丁学名
  endangeredLevel: '',   // 濒危等级
  knowledge: '',         // 相关知识
  facingThreats: '',     // 面临威胁
  sort: 0                // 排序值
};

// 表单数据
const form = reactive({ ...defaultForm }); 

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入物种名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }]
}

// 分页数据
const pagination = reactive({
  page: 1,    // 当前页码
  size: 10,   // 每页条数
  total: 0    // 总条数
})

// ==================== 工具方法 ====================
/**
 * 获取栖息地对应的颜色类型
 * @param habitat 栖息地类型
 * @returns Element Plus 颜色类型
 */
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

/**
 * 获取栖息地对应的中文文本
 * @param habitat 栖息地类型
 * @returns 中文描述
 */
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

// ==================== 事件处理方法 ====================
/**
 * 处理搜索操作
 * 重置页码为第一页，然后重新获取数据
 */
const handleSearch = () => {
  pagination.page = 1
  getSList()
}

/**
 * 处理重置操作
 * 清空所有搜索条件，重置页码，重新获取数据
 */
const handleReset = () => {
  Object.assign(searchForm, {
    name: '',
    categoryId: '',
    englishName: '',
    latinName: '',
    endangeredLevel: '',
    habitat: '',
    status: ''
  })
  pagination.page = 1
  getSList()
}


/**
 * 处理新增物种
 * 重置表单数据，设置标题为新增，显示表单对话框
 */
const handleAdd = () => {
  // 使用默认数据重置表单
  Object.assign(form, defaultForm);
  formTitle.value = '新增物种'
  formVisible.value = true
}

/**
 * 处理编辑物种
 * @param row 要编辑的物种数据
 */
const handleEdit = (row: any) => {
  formTitle.value = '编辑物种'
  // 先清空表单，再填充数据
  Object.keys(form).forEach(key => (form as any)[key] = null);
  Object.assign(form, row);
  formVisible.value = true
}

/**
 * 处理查看物种详情
 * @param row 要查看的物种数据
 */
const handleView = (row: any) => {
  currentSpecies.value = row
  detailVisible.value = true
}

/**
 * 处理预览功能（暂未实现）
 * @param row 要预览的物种数据
 */
const handlePreview = (row: any) => {
  ElMessage.info('预览功能开发中...')
}

/**
 * 处理状态变更
 * @param row 要变更状态的物种数据
 */
const handleStatusChange = (row: any) => {
  const statusText = row.status === 1 ? '发布' : '草稿'
  ElMessage.success(`物种状态已更新为${statusText}`)
}

/**
 * 处理删除物种
 * @param row 要删除的物种数据
 */
const handleDelete = async (row: any) => {
  try {
    // 确认删除对话框
    await ElMessageBox.confirm('确定要删除此物种吗？删除后无法恢复！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 调用删除接口
    deleteSpeciesCategory(row.id)
    // 重新获取列表数据
    getSList()
    ElMessage.success('删除成功')
  } catch (error) {
    console.error('删除失败:', error)
  }
}

/**
 * 处理表单提交
 * 验证表单后，根据是否有ID判断是新增还是编辑操作
 */
const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        // 准备提交的数据
        const submitData: any = {
          name: form.name,
          description: form.description,
          imageUrl: form.imageUrl,
          iconUrl: form.iconUrl,
          categoryId: form.categoryId,
          englishName: form.englishName,
          latinName: form.latinName,
          endangeredLevel: form.endangeredLevel,
          knowledge: form.knowledge,
          facingThreats: form.facingThreats,
          sort: form.sort
        }
        
        if (form.id) {
          // 编辑模式，添加ID
          submitData.id = form.id
          await updateSpeciesCategory(submitData)
          ElMessage.success('更新成功')
        } else {
          // 新增模式
          await saveSpecies(submitData)
          ElMessage.success('创建成功')
        }
        formVisible.value = false
        getSList()
      } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error('操作失败，请重试')
      }
    }
  })
}

/**
 * 重置表单
 * 将表单数据重置为默认值，并清除验证状态
 */
const resetForm = () => {
  Object.assign(form, defaultForm)
  formRef.value?.resetFields()
}

// ==================== 其他功能方法 ====================
/**
 * 处理分类管理
 * 显示分类管理对话框
 */
const handleCategories = () => {
  categoryVisible.value = true
}

/**
 * 处理课程关联
 * 跳转到课程关联管理页面
 */
const handleCourseRelation = () => {
  router.push('/species/course-relation')
}

/**
 * 处理添加分类
 * 在分类管理对话框中添加新分类
 */
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

/**
 * 处理编辑分类（暂未实现）
 * @param row 要编辑的分类数据
 */
const handleEditCategory = (row: any) => {
  ElMessage.info('编辑分类功能开发中...')
}

/**
 * 处理删除分类
 * @param row 要删除的分类数据
 */
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

/**
 * 处理导入功能（暂未实现）
 */
const handleImport = () => {
  ElMessage.info('批量导入功能开发中...')
}

/**
 * 处理导出功能（暂未实现）
 */
const handleExport = () => {
  ElMessage.info('导出数据功能开发中...')
}

// ==================== 分页处理方法 ====================
/**
 * 处理每页条数变化
 * @param size 新的每页条数
 */
const handleSizeChange = (size: number) => {
  pagination.size = size
  getSList()
}

/**
 * 处理页码变化
 * @param page 新的页码
 */
const handleCurrentChange = (page: number) => {
  pagination.page = page
  getSList()
}

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
