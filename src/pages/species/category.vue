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
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        row-key="id"
        :tree-props="{ children: 'children' }"
      >
        <!-- 分类名称列 - 支持树形结构显示 -->
        <el-table-column prop="name" label="分类名称" min-width="200">
          <template #default="scope">
            <div class="tree-node" :style="{ paddingLeft: getNodePadding(scope.row) }">
              <!-- 树形连接线 -->
              <div class="tree-line" v-if="scope.row.parentId"></div>
              <div class="node-content">
                <!-- 文件夹图标（有子分类）或文档图标（叶子节点） -->
                <el-icon v-if="scope.row.children && scope.row.children.length > 0" class="folder-icon">
                  <Folder />
                </el-icon>
                <el-icon v-else class="file-icon">
                  <Document />
                </el-icon>
                <!-- 分类名称 -->
                <span class="node-name">{{ scope.row.name }}</span>
                <!-- 子分类数量标签 -->
                <el-tag v-if="scope.row.children && scope.row.children.length > 0" size="small" type="primary" class="children-count">
                  {{ scope.row.children.length }}
                </el-tag>
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- 分类描述列 -->
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <!-- 物种数量列 -->
        <el-table-column prop="speciesCount" label="物种数量" width="120">
          <template #default="scope">
            <el-tag type="info">{{ scope.row.speciesCount || 0 }}</el-tag>
          </template>
        </el-table-column>
        <!-- 创建时间列 -->
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <!-- 操作列 -->
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="scope">
            <!-- 编辑分类按钮 -->
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <!-- 添加子分类按钮 -->
            <el-button type="success" size="small" @click="handleAddChild(scope.row)">
              添加子分类
            </el-button>
            <!-- 删除分类按钮 - 有物种时禁用 -->
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
        <!-- 图标输入 -->
        <el-form-item label="图标" prop="icon">
          <el-input 
            v-model="form.icon" 
            placeholder="请输入图标（可选，支持类名或URL）" 
          />
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

  </div>
</template>

<script setup lang="ts">
// Vue 3 Composition API 相关导入
import { ref, reactive, onMounted } from 'vue'
// Element Plus 消息提示和确认框
import { ElMessage, ElMessageBox } from 'element-plus'
// Element Plus 表单类型定义
import type { FormInstance, FormRules } from 'element-plus'
// 物种分类相关 API 接口
import {
  getSpeciesTree,
  updateSpeciesTree,
  deleteSpeciesTree,
  saveSpeciesTree
} from '@/api/species'

// ========== 响应式数据定义 ==========
// 页面加载状态
const loading = ref(false)
// 表单对话框显示状态
const formVisible = ref(false)
// 排序管理对话框显示状态
const sortVisible = ref(false)
// 表单对话框标题
const formTitle = ref('新增分类')
// 表单引用
const formRef = ref<FormInstance>()
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
 * @returns 标准化后的节点数组
 */
const normalizeTree = (nodes: BackendNode[] | undefined): any[] => {
  if (!nodes || nodes.length === 0) return []
  return nodes.map((n: BackendNode) => ({
    id: n.id,
    name: n.name,
    description: n.description || '',
    parentId: n.pid ?? null,
    sortOrder: 0,
    speciesCount: Array.isArray(n.speciesList) ? n.speciesList.length : 0,
    status: 1,
    createTime: '2024-01-01 00:00:00',
    children: normalizeTree(n.children)
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

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 4
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
    // 简单设置分页总数（根节点数量）
    pagination.total = tableData.value.length
  } catch (error) {
    console.error('获取分类列表失败:', error)
  } finally {
    loading.value = false
  }
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
  ElMessage.info(`查看分类"${row.name}"下的物种`)
  // 这里可以跳转到物种列表页面，并传递分类ID作为筛选条件
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

// ========== 分页处理 ==========
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

// ========== 树形结构辅助方法 ==========
/**
 * 获取节点缩进样式
 * @param row 节点行数据
 * @returns 缩进样式字符串
 */
const getNodePadding = (row: any) => {
  const level = getNodeLevel(row)
  return `${level * 20}px`
}

/**
 * 获取节点层级
 * @param row 节点行数据
 * @returns 节点层级
 */
const getNodeLevel = (row: any): number => {
  if (!row.parentId) return 0
  
  // 递归查找父节点层级
  const findParentLevel = (parentId: number, data: any[]): number => {
    for (const item of data) {
      if (item.id === parentId) {
        return getNodeLevel(item)
      }
      if (item.children) {
        const found = findParentLevel(parentId, item.children)
        if (found !== -1) return found
      }
    }
    return -1
  }
  
  const parentLevel = findParentLevel(row.parentId, originalTreeData.value)
  return parentLevel !== -1 ? parentLevel + 1 : 1
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

// 树形结构样式
.tree-node {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 32px;
  
  .tree-line {
    position: absolute;
    left: -10px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, #409eff, #67c23a);
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 10px;
      height: 1px;
      background: linear-gradient(to right, #409eff, #67c23a);
    }
    
    &::after {
      content: '';
      position: absolute;
      left: 9px;
      top: 50%;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #409eff;
      transform: translateY(-50%);
    }
  }
  
  .node-content {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: rgba(64, 158, 255, 0.1);
    }
    
    .folder-icon {
      color: #409eff;
      font-size: 16px;
      transition: all 0.3s ease;
      
      &:hover {
        transform: scale(1.1);
      }
    }
    
    .file-icon {
      color: #67c23a;
      font-size: 14px;
      transition: all 0.3s ease;
      
      &:hover {
        transform: scale(1.1);
      }
    }
    
    .node-name {
      font-weight: 500;
      color: #303133;
      transition: color 0.3s ease;
      
      &:hover {
        color: #409eff;
      }
    }
    
    .children-count {
      font-size: 11px;
      border-radius: 10px;
      padding: 1px 6px;
      background: linear-gradient(135deg, #409eff, #67c23a);
      color: white;
      border: none;
    }
  }
}

// 表格行样式增强
:deep(.el-table__row) {
  &:hover {
    background-color: #f5f7fa;
  }
}

// 展开/收起图标样式
:deep(.el-table__expand-icon) {
  color: #409eff;
  font-size: 14px;
  
  &:hover {
    color: #337ecc;
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