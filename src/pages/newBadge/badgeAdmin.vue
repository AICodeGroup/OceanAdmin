<template>
  <div class="app-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <el-icon class="header-icon" :size="20">
          <Medal />
        </el-icon>
        <h1 class="page-title">徽章管理</h1>
      </div>
      <div class="header-actions">
        <el-button type="primary" size="large" @click="handleAdd" round>
          <el-icon class="btn-icon"><Plus /></el-icon>
          新增徽章
        </el-button>
        <el-button type="danger" size="large" @click="handleBatchDelete" :disabled="selectedIds.length === 0" round>
          <el-icon class="btn-icon"><Delete /></el-icon>
          批量删除
        </el-button>
      </div>
    </div>

    <!-- 搜索表单 -->
    <el-card shadow="never" class="mb-4">
      <el-form :model="searchForm" label-width="80px" :inline="true">
        <el-form-item label="徽章名称">
          <el-input v-model="searchForm.name" placeholder="请输入徽章名称" style="width: 200px" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearchForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table :data="tableData" v-loading="loading" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column label="图标" width="100">
          <template #default="scope">
            <el-image
              v-if="scope.row.iconUrl"
              :src="scope.row.iconUrl"
              fit="cover"
              style="width: 50px; height: 50px; border-radius: 50%"
            />
          </template>
        </el-table-column>
        <el-table-column prop="isGranted" label="是否可授予" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isGranted === 1 ? 'success' : 'info'">
              {{ scope.row.isGranted === 1 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
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

      <!-- 分页 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/修改徽章对话框 -->
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
        <el-form-item label="徽章名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入徽章名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="图标" prop="iconUrl">
          <el-upload
            v-model:file-list="fileList"
            action="https://beniocean.com/api/admin/platform/uploadOss"
            list-type="picture-card"
            :limit="1"
            :on-success="handleUploadSuccess"
            :on-remove="handleRemove"
            :headers="{ Authorization: 'Bearer ' + getToken() }"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="类型ID" prop="typeId">
          <el-input-number v-model="form.typeId" :min="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-input-number v-model="form.level" :min="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="是否可授权" prop="isGranted">
          <el-switch v-model="form.isGranted" :active-value="1" :inactive-value="0" />
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
import { getBadgeList, addBadge, updateBadge, deleteBadge, batchDeleteBadges } from '@/api/badge'
import { getToken } from '@/utils/auth'
import { Plus, Medal, Delete } from '@element-plus/icons-vue'

interface Badge {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  typeId: number;
  level: number;
  isGranted: number;
  createdAt: string;
}

const loading = ref(false)
const tableData = ref<Badge[]>([])
const selectedIds = ref<number[]>([])
const formVisible = ref(false)
const formTitle = ref('新增徽章')
const formRef = ref<FormInstance>()
const fileList = ref<UploadUserFile[]>([])

// 表单模型
const form = reactive({
  id: null as number | null,
  name: '',
  description: '',
  iconUrl: '',
  typeId: 1,
  level: 1,
  isGranted: 0
})

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入徽章名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  iconUrl: [{ required: true, message: '请输入图标URL', trigger: 'blur' }],
  typeId: [{ required: true, message: '请输入类型ID', trigger: 'blur' }],
  level: [{ required: true, message: '请输入等级', trigger: 'blur' }]
}

// 搜索表单
const searchForm = reactive({
  name: '',
  typeId: null as number | null
})

// 分页数据
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const params = {
      name: searchForm.name || null,
      typeId: searchForm.typeId || null,
      // current: pagination.current, // 接口文档没有分页参数，暂时注释
      // size: pagination.size
    }
    const res = await getBadgeList(params)
    console.log(res)
    // 按创建时间降序排序
    if (Array.isArray(res)) {
      tableData.value = res.sort((a: Badge, b: Badge) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else {
      // 如果返回的数据不是数组，可能需要根据实际情况处理，这里暂时置空
      tableData.value = []
    }
    // pagination.total = res.data.total // 接口返回没有total，暂时注释
  } catch (error) {
    console.error('获取徽章列表失败:', error)
    ElMessage.error('获取徽章列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  getList()
}

// 重置搜索
const resetSearchForm = () => {
  searchForm.name = ''
  searchForm.typeId = null
  handleSearch()
}

// 重置表单
const resetForm = () => {
  form.id = null
  form.name = ''
  form.description = ''
  form.iconUrl = ''
  form.typeId = 1
  form.level = 1
  form.isGranted = 0
  fileList.value = []
  formRef.value?.resetFields()
}

// 新增
const handleAdd = () => {
  resetForm()
  formTitle.value = '新增徽章'
  formVisible.value = true
}

// 修改
const handleEdit = (row: any) => {
  resetForm()
  Object.assign(form, row)
  if (row.iconUrl) {
    fileList.value = [{ name: row.iconUrl, url: row.iconUrl }]
  }
  formTitle.value = '修改徽章'
  formVisible.value = true
}

// 提交表单
const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        const data = { ...form }
        if (data.id) {
          await updateBadge(data)
          ElMessage.success('更新成功')
        } else {
          await addBadge(data)
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
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除徽章 “${row.name}” 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteBadge(row.id)
    ElMessage.success('删除成功')
    getList() // 重新加载列表
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 个徽章吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await batchDeleteBadges(selectedIds.value)
    ElMessage.success('批量删除成功')
    getList() // 重新加载列表
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  }
}

// 处理表格选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.size = size
  getList()
}

const handleCurrentChange = (page: number) => {
  pagination.current = page
  getList()
}

const handleUploadSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  if (response.code === 200 && typeof response.data === 'string' && response.data) {
    form.iconUrl = response.data
    fileList.value = fileList.value.map(file => {
      if (file.uid === uploadFile.uid) {
        return { ...file, url: response.data }
      }
      return file
    })
    ElMessage.success('上传成功')
  } else {
    ElMessage.error('上传失败')
    fileList.value = fileList.value.filter(file => file.uid !== uploadFile.uid)
  }
}

const handleRemove: UploadProps['onRemove'] = () => {
  form.iconUrl = ''
  fileList.value = []
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.app-container {
  padding: 12px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 12px 20px;
  background: #f5f7fa;
  border-radius: 12px;
  border: 1px solid #e4e7ed;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .header-icon {
      color: #606266;
      font-size: 20px;
    }

    .page-title {
      font-size: 20px;
      font-weight: 700;
      color: #303133;
      margin: 0;
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.btn-icon {
  margin-right: 4px;
}

.mb-4 {
  margin-bottom: 16px;
}

.flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}

.mt-4 {
  margin-top: 16px;
}
</style>