<template>
  <div class="app-container">
    <div class="page-header">
      <h1>徽章类型管理</h1>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增类型
      </el-button>
    </div>

    <!-- 数据表格 -->
    <el-card>
      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="类型名称" width="200" />
        <el-table-column prop="description" label="类型描述" min-width="300" />
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" fixed="right" width="150">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入类型名称" />
        </el-form-item>

        <el-form-item label="类型描述" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入类型描述" />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" :precision="0" />
          <span class="form-tip">数字越小越靠前</span>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getBadgeTypeList,
  addBadgeType,
  updateBadgeType,
  deleteBadgeType
} from '@/api/growthSystem'

const loading = ref(false)
const tableData = ref<any[]>([])
const dialogVisible = ref(false)
const formRef = ref()
const editMode = ref(false)

const formData = ref({
  id: undefined,
  name: '',
  description: '',
  sort: 0
})

const rules = {
  name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入类型描述', trigger: 'blur' }]
}

const dialogTitle = computed(() => editMode.value ? '编辑类型' : '新增类型')

// 加载列表
const loadList = async () => {
  loading.value = true
  try {
    const data = await getBadgeTypeList()
    tableData.value = data || []
  } catch (error) {
    console.error('加载列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 新增
const handleAdd = () => {
  editMode.value = false
  formData.value = {
    id: undefined,
    name: '',
    description: '',
    sort: 0
  }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  editMode.value = true
  formData.value = { ...row }
  dialogVisible.value = true
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    loading.value = true
    try {
      if (editMode.value) {
        await updateBadgeType(formData.value)
        ElMessage.success('更新成功')
      } else {
        await addBadgeType(formData.value)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      loadList()
    } catch (error) {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    } finally {
      loading.value = false
    }
  })
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该类型吗？删除后关联的徽章可能受影响。', '提示', {
      type: 'warning'
    })

    await deleteBadgeType(row.id)
    ElMessage.success('删除成功')
    loadList()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadList()
})
</script>

<style scoped lang="scss">
.app-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin: 0;
  }
}

.form-tip {
  margin-left: 10px;
  font-size: 12px;
  color: #909399;
}
</style>
