<template>
  <div class="app-container">
    <div class="page-header">
      <h1>课程分类管理</h1>
    </div>

    <!-- 操作按钮 -->
    <div class="button-group">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增分类
      </el-button>
    </div>

    <!-- 表格 -->
    <div class="card-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="分类名称" />
        <el-table-column label="分类图标" width="100">
          <template #default="scope">
            <el-icon v-if="scope.row.icon" :size="24">
              <component :is="scope.row.icon" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="courseCount" label="课程数量" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button 
              v-if="!scope.row.children || scope.row.children.length === 0"
              type="success" 
              size="small" 
              @click="handleAddChild(scope.row)"
            >
              添加子分类
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="上级分类" prop="parentId" v-if="form.parentId">
          <el-input :value="parentCategoryName" disabled />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类图标" prop="icon">
          <el-select v-model="form.icon" placeholder="请选择图标">
            <el-option label="海洋生物" value="Fish">
              <el-icon><Fish /></el-icon>
              海洋生物
            </el-option>
            <el-option label="环保" value="Sunny">
              <el-icon><Sunny /></el-icon>
              环保
            </el-option>
            <el-option label="探索" value="Search">
              <el-icon><Search /></el-icon>
              探索
            </el-option>
            <el-option label="科学" value="Experiment">
              <el-icon><Operation /></el-icon>
              科学
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入分类描述" 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// 响应式数据
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增分类')
const formRef = ref<FormInstance>()
const currentParent = ref<any>(null)

const tableData = ref([
  {
    id: 1,
    name: '海洋生物',
    icon: 'Fish',
    sort: 1,
    courseCount: 15,
    status: 1,
    createTime: '2024-01-15 10:30:00',
    children: [
      {
        id: 11,
        name: '鱼类',
        icon: 'Fish',
        sort: 1,
        courseCount: 8,
        status: 1,
        createTime: '2024-01-15 10:35:00',
        parentId: 1
      },
      {
        id: 12,
        name: '海洋哺乳动物',
        icon: 'Fish',
        sort: 2,
        courseCount: 7,
        status: 1,
        createTime: '2024-01-15 10:40:00',
        parentId: 1
      }
    ]
  },
  {
    id: 2,
    name: '海洋环保',
    icon: 'Sunny',
    sort: 2,
    courseCount: 12,
    status: 1,
    createTime: '2024-01-14 14:20:00'
  },
  {
    id: 3,
    name: '海洋探索',
    icon: 'Search',
    sort: 3,
    courseCount: 8,
    status: 1,
    createTime: '2024-01-13 09:15:00'
  },
  {
    id: 4,
    name: '海洋科学',
    icon: 'Operation',
    sort: 4,
    courseCount: 5,
    status: 0,
    createTime: '2024-01-12 16:45:00'
  }
])

// 表单数据
const form = reactive({
  id: null,
  parentId: null,
  name: '',
  icon: '',
  sort: 0,
  status: 1,
  description: ''
})

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  icon: [{ required: true, message: '请选择分类图标', trigger: 'change' }],
  sort: [{ required: true, message: '请输入排序值', trigger: 'blur' }]
}

// 计算属性
const parentCategoryName = computed(() => {
  if (!currentParent.value) return ''
  return currentParent.value.name
})

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    // 模拟加载延迟
    setTimeout(() => {
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取分类列表失败:', error)
    loading.value = false
  }
}

// 处理新增
const handleAdd = () => {
  dialogTitle.value = '新增分类'
  currentParent.value = null
  dialogVisible.value = true
}

// 处理添加子分类
const handleAddChild = (row: any) => {
  dialogTitle.value = '新增子分类'
  currentParent.value = row
  form.parentId = row.id
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑分类'
  Object.assign(form, row)
  
  // 如果有父级分类，找到父级分类信息
  if (row.parentId) {
    currentParent.value = findParentCategory(row.parentId)
  } else {
    currentParent.value = null
  }
  
  dialogVisible.value = true
}

// 查找父级分类
const findParentCategory = (parentId: number) => {
  for (const category of tableData.value) {
    if (category.id === parentId) {
      return category
    }
  }
  return null
}

// 处理删除
const handleDelete = async (row: any) => {
  try {
    if (row.children && row.children.length > 0) {
      ElMessage.warning('该分类下还有子分类，无法删除')
      return
    }
    
    if (row.courseCount > 0) {
      ElMessage.warning('该分类下还有课程，无法删除')
      return
    }
    
    await ElMessageBox.confirm('确定要删除这个分类吗？', '提示', {
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
          ElMessage.success('更新成功')
        } else {
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
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
    parentId: null,
    name: '',
    icon: '',
    sort: 0,
    status: 1,
    description: ''
  })
  currentParent.value = null
  formRef.value?.resetFields()
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.el-table {
  :deep(.el-table__row) {
    .el-table__cell {
      border-bottom: 1px solid #ebeef5;
    }
  }
}
</style>