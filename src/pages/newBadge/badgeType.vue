<template>
  <div class="app-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <el-icon class="header-icon" :size="20">
          <Folder />
        </el-icon>
        <h1 class="page-title">徽章分类管理</h1>
      </div>
      <div class="header-actions">
        <el-button type="primary" size="large" @click="handleAdd" round>
          <el-icon class="btn-icon"><Plus /></el-icon>
          新增分类
        </el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table :data="tableData" v-loading="loading" style="width: 100%" row-key="id">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" />
        <el-table-column label="图标" width="100">
          <template #default="scope">
            <el-image
              v-if="scope.row.icon"
              :src="scope.row.icon"
              fit="cover"
              style="width: 50px; height: 50px"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="level" label="级别" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.level === 1 ? 'primary' : scope.row.level === 2 ? 'success' : 'warning'">
              {{ scope.row.level }}级
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              修改
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/修改分类对话框 -->
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
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="父级分类" prop="pid">
          <el-select v-model="form.pid" placeholder="请选择父级分类" style="width: 100%">
            <el-option label="顶级分类" :value="0" />
            <el-option
              v-for="item in parentTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类级别" prop="level">
          <el-select v-model="form.level" placeholder="请选择分类级别" style="width: 100%">
            <el-option label="一级分类" :value="1" />
            <el-option label="二级分类" :value="2" />
            <el-option label="三级分类" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-upload
            v-model:file-list="fileList"
            action="/admin/platform/upload/image"
            list-type="picture-card"
            :limit="1"
            :on-success="handleUploadSuccess"
            :on-remove="handleRemove"
            :headers="{ Authorization: getToken() }"
            :data="{ model: 'system', pid: 0 }"
            name="multipart"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="排序值" prop="sort">
          <el-input-number v-model="form.sort" :min="0" controls-position="right" />
        </el-form-item>
      </el-form>
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules, UploadProps, UploadUserFile } from 'element-plus'
import { 
  getBadgeTypeList, 
  addBadgeType, 
  updateBadgeType, 
  deleteBadgeType 
} from '@/api/badge'
import { getToken } from '@/utils/auth'
import { Plus, Folder } from '@element-plus/icons-vue'

interface BadgeType {
  id: number
  pid: number
  name: string
  icon?: string
  description?: string
  level: number
  sort: number
  isDel: number
  createTime: string
  updateTime: string
}

const loading = ref(false)
const tableData = ref<BadgeType[]>([])
const parentTypeList = ref<BadgeType[]>([])
const formVisible = ref(false)
const formTitle = ref('新增分类')
const formRef = ref<FormInstance>()
const fileList = ref<UploadUserFile[]>([])

// 表单模型
const form = reactive({
  id: null as number | null,
  name: '',
  pid: 0,
  level: 1,
  icon: '',
  description: '',
  sort: 0
})

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  level: [{ required: true, message: '请选择分类级别', trigger: 'change' }]
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getBadgeTypeList()
    if (Array.isArray(res)) {
      tableData.value = res
      // 过滤出可作为父级的分类（排除当前编辑的分类）
      parentTypeList.value = res.filter((item: BadgeType) => 
        item.level < 3 && (!form.id || item.id !== form.id)
      )
    } else {
      tableData.value = []
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error('获取分类列表失败')
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  form.id = null
  form.name = ''
  form.pid = 0
  form.level = 1
  form.icon = ''
  form.description = ''
  form.sort = 0
  fileList.value = []
  formRef.value?.resetFields()
}

// 新增
const handleAdd = () => {
  resetForm()
  formTitle.value = '新增分类'
  formVisible.value = true
  getList() // 刷新父级列表
}

// 修改
const handleEdit = (row: BadgeType) => {
  resetForm()
  Object.assign(form, row)
  if (row.icon) {
    fileList.value = [{ name: row.icon, url: row.icon }]
  }
  formTitle.value = '修改分类'
  formVisible.value = true
  getList() // 刷新父级列表
}

// 提交表单
const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        const data = { ...form }
        if (data.id) {
          await updateBadgeType(data)
          ElMessage.success('更新成功')
        } else {
          await addBadgeType(data)
          ElMessage.success('添加成功')
        }
        formVisible.value = false
        getList()
      } catch (error) {
        console.error('操作失败:', error)
        ElMessage.error('操作失败')
      }
    }
  })
}

// 删除
const handleDelete = async (row: BadgeType) => {
  try {
    await ElMessageBox.confirm(`确定要删除分类 "${row.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteBadgeType(row.id)
    ElMessage.success('删除成功')
    getList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const handleUploadSuccess: UploadProps['onSuccess'] = (response) => {
  if (response.code === 200 && response.data?.url) {
    form.icon = response.data.url
    ElMessage.success('上传成功')
  } else {
    ElMessage.error('上传失败')
    fileList.value = []
  }
}

const handleRemove: UploadProps['onRemove'] = () => {
  form.icon = ''
  fileList.value = []
}

onMounted(() => {
  getList()
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

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .header-icon {
    color: #409eff;
  }

  .page-title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.btn-icon {
  margin-right: 4px;
}
</style>
