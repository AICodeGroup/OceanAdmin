<template>
  <div class="app-container">
    <div class="page-header">
      <h1>用户等级管理</h1>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增等级
      </el-button>
    </div>

    <!-- 等级列表 -->
    <el-table 
      :data="levelList" 
      v-loading="loading"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="等级名称" width="150" />
      <el-table-column prop="grade" label="等级序号" width="100" sortable />
      <el-table-column prop="experience" label="所需经验" width="120" sortable />
      <el-table-column label="等级图标" width="100">
        <template #default="{ row }">
          <el-image 
            v-if="row.icon" 
            :src="row.icon" 
            style="width: 40px; height: 40px"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="背景颜色" width="120">
        <template #default="{ row }">
          <div class="color-block" :style="{ backgroundColor: row.backColor }">
            {{ row.backColor }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="discount" label="享受折扣" width="100">
        <template #default="{ row }">
          {{ row.discount }}%
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.isShow ? 'success' : 'info'">
            {{ row.isShow ? '显示' : '隐藏' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template #default="{ row }">
          {{ row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="warning" @click="handleToggleShow(row)">
            {{ row.isShow ? '隐藏' : '显示' }}
          </el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="dialogVisible"
      width="600px"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="等级名称" prop="name">
          <el-input v-model="formData.name" placeholder="如：探索者、航海者" />
        </el-form-item>

        <el-form-item label="等级序号" prop="grade">
          <el-input-number v-model="formData.grade" :min="1" :precision="0" />
          <span class="form-tip">数字越大等级越高</span>
        </el-form-item>

        <el-form-item label="所需经验" prop="experience">
          <el-input-number v-model="formData.experience" :min="0" :precision="0" />
        </el-form-item>

        <el-form-item label="等级图标" prop="icon">
          <el-input v-model="formData.icon" placeholder="图标URL地址" />
        </el-form-item>

        <el-form-item label="背景图" prop="backImage">
          <el-input v-model="formData.backImage" placeholder="背景图URL地址" />
        </el-form-item>

        <el-form-item label="背景颜色" prop="backColor">
          <el-color-picker v-model="formData.backColor" />
          <el-input v-model="formData.backColor" placeholder="#3498db" style="width: 200px; margin-left: 10px" />
        </el-form-item>

        <el-form-item label="享受折扣" prop="discount">
          <el-input-number v-model="formData.discount" :min="0" :max="100" :precision="0" />
          <span class="form-tip">%，100表示原价，95表示95折</span>
        </el-form-item>

        <el-form-item label="是否显示" prop="isShow">
          <el-switch v-model="formData.isShow" />
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
  getUserLevelList,
  saveUserLevel,
  updateUserLevel,
  deleteUserLevel,
  toggleUserLevelShow
} from '@/api/growthSystem'

const loading = ref(false)
const levelList = ref<any[]>([])
const dialogVisible = ref(false)
const formRef = ref()
const editMode = ref(false)

const formData = ref({
  id: undefined,
  name: '',
  grade: 1,
  experience: 0,
  icon: '',
  backImage: '',
  backColor: '#3498db',
  discount: 100,
  isShow: true
})

const rules = {
  name: [{ required: true, message: '请输入等级名称', trigger: 'blur' }],
  grade: [{ required: true, message: '请输入等级序号', trigger: 'blur' }],
  experience: [{ required: true, message: '请输入所需经验', trigger: 'blur' }]
}

const dialogTitle = computed(() => editMode.value ? '编辑等级' : '新增等级')

// 加载等级列表
const loadLevelList = async () => {
  loading.value = true
  try {
    const data = await getUserLevelList()
    levelList.value = data || []
  } catch (error) {
    console.error('加载等级列表失败:', error)
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
    grade: 1,
    experience: 0,
    icon: '',
    backImage: '',
    backColor: '#3498db',
    discount: 100,
    isShow: true
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
        await updateUserLevel(formData.value)
        ElMessage.success('更新成功')
      } else {
        await saveUserLevel(formData.value)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      loadLevelList()
    } catch (error) {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    } finally {
      loading.value = false
    }
  })
}

// 切换显示/隐藏
const handleToggleShow = async (row: any) => {
  try {
    await toggleUserLevelShow(row.id, !row.isShow)
    ElMessage.success('操作成功')
    loadLevelList()
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  }
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该等级吗？', '提示', {
      type: 'warning'
    })

    await deleteUserLevel(row.id)
    ElMessage.success('删除成功')
    loadLevelList()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadLevelList()
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

.color-block {
  padding: 4px 8px;
  border-radius: 4px;
  color: #fff;
  text-align: center;
  font-size: 12px;
}

.form-tip {
  margin-left: 10px;
  font-size: 12px;
  color: #909399;
}
</style>
