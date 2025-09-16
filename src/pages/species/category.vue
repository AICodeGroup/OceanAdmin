<template>
  <div class="app-container">
    <div class="page-header">
      <h1>物种分类管理</h1>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon total">
              <el-icon><Folder /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.total }}</div>
              <div class="stat-label">分类总数</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon species">
              <el-icon><Grid /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.species }}</div>
              <div class="stat-label">物种总数</div>
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
              <div class="stat-label">启用分类</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon recent">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.recent }}</div>
              <div class="stat-label">本月新增</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 搜索区域 -->
    <div class="card-container">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="分类名称">
          <el-input v-model="searchForm.name" placeholder="请输入分类名称" clearable />
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
        新增分类
      </el-button>
      <el-button type="success" @click="handleSort">
        <el-icon><Sort /></el-icon>
        排序管理
      </el-button>
      <el-button type="warning" @click="handleBatchOperation">
        <el-icon><Operation /></el-icon>
        批量操作
      </el-button>
    </div>

    <!-- 表格 -->
    <div class="card-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children' }"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" min-width="200">
          <template #default="scope">
            <div class="category-name">
              <el-icon v-if="scope.row.children && scope.row.children.length > 0" class="parent-icon">
                <Folder />
              </el-icon>
              <el-icon v-else class="child-icon">
                <Document />
              </el-icon>
              <span>{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="sortOrder" label="排序" width="100" />
        <el-table-column prop="speciesCount" label="物种数量" width="120">
          <template #default="scope">
            <el-tag type="info">{{ scope.row.speciesCount || 0 }}</el-tag>
          </template>
        </el-table-column>
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
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="success" size="small" @click="handleAddChild(scope.row)">
              添加子分类
            </el-button>
            <el-button type="info" size="small" @click="handleViewSpecies(scope.row)">
              查看物种
            </el-button>
            <el-button 
              type="danger" 
              size="small" 
              @click="handleDelete(scope.row)"
              :disabled="scope.row.speciesCount > 0"
            >
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
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类描述" prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入分类描述" 
          />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number 
            v-model="form.sortOrder" 
            :min="0" 
            :max="9999" 
            placeholder="排序值，数字越小排序越靠前"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
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

    <!-- 排序管理对话框 -->
    <el-dialog
      v-model="sortVisible"
      title="排序管理"
      width="800px"
    >
      <div class="sort-management">
        <el-alert
          title="拖拽调整分类顺序"
          type="info"
          show-icon
          :closable="false"
          style="margin-bottom: 20px"
        />
        <el-tree
          ref="sortTreeRef"
          :data="sortData"
          node-key="id"
          draggable
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          @node-drop="handleNodeDrop"
        >
          <template #default="{ node, data }">
            <div class="sort-tree-node">
              <el-icon><Folder /></el-icon>
              <span>{{ node.label }}</span>
              <span class="sort-order">排序: {{ data.sortOrder }}</span>
            </div>
          </template>
        </el-tree>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="sortVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveSort">保存排序</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  getSpeciesCategoryList,
  createSpeciesCategory,
  updateSpeciesCategory,
  deleteSpeciesCategory
} from '@/api/species'

// 响应式数据
const loading = ref(false)
const formVisible = ref(false)
const sortVisible = ref(false)
const formTitle = ref('新增分类')
const formRef = ref<FormInstance>()
const sortTreeRef = ref()

// 统计数据
const stats = reactive({
  total: 12,
  species: 156,
  active: 10,
  recent: 3
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '鱼类',
    description: '包括各种海洋和淡水鱼类',
    parentId: null,
    sortOrder: 1,
    speciesCount: 45,
    status: 1,
    createTime: '2024-01-01 00:00:00',
    children: [
      {
        id: 11,
        name: '热带鱼',
        description: '生活在热带海域的鱼类',
        parentId: 1,
        sortOrder: 1,
        speciesCount: 20,
        status: 1,
        createTime: '2024-01-01 00:00:00'
      },
      {
        id: 12,
        name: '冷水鱼',
        description: '生活在冷水海域的鱼类',
        parentId: 1,
        sortOrder: 2,
        speciesCount: 25,
        status: 1,
        createTime: '2024-01-01 00:00:00'
      }
    ]
  },
  {
    id: 2,
    name: '棘皮动物',
    description: '包括海星、海胆等棘皮动物',
    parentId: null,
    sortOrder: 2,
    speciesCount: 23,
    status: 1,
    createTime: '2024-01-01 00:00:00',
    children: [
      {
        id: 21,
        name: '海星类',
        description: '各种海星',
        parentId: 2,
        sortOrder: 1,
        speciesCount: 15,
        status: 1,
        createTime: '2024-01-01 00:00:00'
      },
      {
        id: 22,
        name: '海胆类',
        description: '各种海胆',
        parentId: 2,
        sortOrder: 2,
        speciesCount: 8,
        status: 1,
        createTime: '2024-01-01 00:00:00'
      }
    ]
  },
  {
    id: 3,
    name: '爬行动物',
    description: '海洋中的爬行动物',
    parentId: null,
    sortOrder: 3,
    speciesCount: 12,
    status: 1,
    createTime: '2024-01-01 00:00:00'
  },
  {
    id: 4,
    name: '哺乳动物',
    description: '海洋哺乳动物',
    parentId: null,
    sortOrder: 4,
    speciesCount: 8,
    status: 0,
    createTime: '2024-01-01 00:00:00'
  }
])

// 搜索表单
const searchForm = reactive({
  name: '',
  status: ''
})

// 表单数据
const form = reactive({
  id: null,
  name: '',
  description: '',
  parentId: null,
  sortOrder: 0,
  status: 1
})

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  sortOrder: [{ required: true, message: '请设置排序值', trigger: 'blur' }]
}

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 4
})

// 分类选项（用于上级分类选择）
const categoryOptions = ref([])
const sortData = ref([])

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    setTimeout(() => {
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取分类列表失败:', error)
    loading.value = false
  }
}

// 获取分类选项
const getCategoryOptions = () => {
  // 转换树形数据为选项格式
  const convertToOptions = (data: any[], level = 0) => {
    return data.map(item => ({
      id: item.id,
      name: item.name,
      children: item.children ? convertToOptions(item.children, level + 1) : undefined
    }))
  }
  categoryOptions.value = convertToOptions(tableData.value)
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
    status: ''
  })
  pagination.page = 1
  getList()
}

// 处理新增
const handleAdd = () => {
  formTitle.value = '新增分类'
  getCategoryOptions()
  formVisible.value = true
}

// 处理编辑
const handleEdit = (row: any) => {
  formTitle.value = '编辑分类'
  Object.assign(form, {
    id: row.id,
    name: row.name,
    description: row.description,
    parentId: row.parentId,
    sortOrder: row.sortOrder,
    status: row.status
  })
  getCategoryOptions()
  formVisible.value = true
}

// 处理添加子分类
const handleAddChild = (row: any) => {
  formTitle.value = '添加子分类'
  Object.assign(form, {
    id: null,
    name: '',
    description: '',
    parentId: row.id,
    sortOrder: 0,
    status: 1
  })
  getCategoryOptions()
  formVisible.value = true
}

// 处理查看物种
const handleViewSpecies = (row: any) => {
  ElMessage.info(`查看分类"${row.name}"下的物种`)
  // 这里可以跳转到物种列表页面，并传递分类ID作为筛选条件
}

// 处理状态变更
const handleStatusChange = (row: any) => {
  const statusText = row.status === 1 ? '启用' : '禁用'
  ElMessage.success(`分类状态已更新为${statusText}`)
}

// 处理删除
const handleDelete = async (row: any) => {
  if (row.speciesCount > 0) {
    ElMessage.warning('该分类下还有物种，无法删除')
    return
  }

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
    
    ElMessage.success('删除成功')
    getList()
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
          await updateSpeciesCategory(form.id, form)
          ElMessage.success('更新成功')
        } else {
          await createSpeciesCategory(form)
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
    name: '',
    description: '',
    parentId: null,
    sortOrder: 0,
    status: 1
  })
  formRef.value?.resetFields()
}

// 处理排序管理
const handleSort = () => {
  sortData.value = JSON.parse(JSON.stringify(tableData.value))
  sortVisible.value = true
}

// 处理批量操作
const handleBatchOperation = () => {
  ElMessage.info('批量操作功能开发中...')
}

// 拖拽相关方法
const allowDrop = (draggingNode: any, dropNode: any, type: string) => {
  return type !== 'inner'
}

const allowDrag = (draggingNode: any) => {
  return true
}

const handleNodeDrop = (draggingNode: any, dropNode: any, dropType: string) => {
  ElMessage.info('排序已更改，请点击保存按钮确认')
}

// 保存排序
const handleSaveSort = () => {
  ElMessage.success('排序保存成功')
  sortVisible.value = false
  getList()
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

.category-name {
  display: flex;
  align-items: center;
  
  .parent-icon, .child-icon {
    margin-right: 8px;
    color: #909399;
  }
  
  .parent-icon {
    color: #409eff;
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
</style>