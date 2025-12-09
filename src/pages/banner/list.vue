<template>
  <div class="app-container">
    <div class="page-header">
      <h1>轮播图管理</h1>
    </div>

    <!-- 操作按钮 -->
    <div class="button-group">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增轮播图
      </el-button>
      <el-button type="danger" :disabled="!multipleSelection.length" @click="handleBatchDelete">
        <el-icon><Delete /></el-icon>
        批量删除
      </el-button>
    </div>

    <!-- 表格 -->
    <div class="card-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="轮播图" width="120">
          <template #default="scope">
            <el-image
              :src="scope.row.image"
              :preview-src-list="[scope.row.image]"
              :preview-teleported="true"
              fit="cover"
              style="width: 80px; height: 45px; border-radius: 4px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="link" label="跳转链接" />
        <el-table-column prop="sort" label="排序" width="80" />
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

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入轮播图标题" />
        </el-form-item>
        <el-form-item label="轮播图" prop="image">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :headers="uploadHeaders"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :show-file-list="false"
          >
            <img v-if="form.image" :src="form.image" class="upload-image" />
            <el-icon v-else class="upload-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转链接" prop="link">
          <el-input v-model="form.link" placeholder="请输入跳转链接" />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getBannerList, createBanner, updateBanner, deleteBanner } from '@/api/banner'
import { getToken } from '@/utils/auth'

// 响应式数据
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增轮播图')
const tableData = ref([])
const multipleSelection = ref([])
const formRef = ref<FormInstance>()

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 表单数据
const form = reactive({
  id: null,
  title: '',
  image: '',
  link: '',
  sort: 0,
  status: 1
})

// 表单验证规则
const rules: FormRules = {
  title: [{ required: true, message: '请输入轮播图标题', trigger: 'blur' }],
  image: [{ required: true, message: '请上传轮播图', trigger: 'change' }],
  sort: [{ required: true, message: '请输入排序值', trigger: 'blur' }]
}

// 上传配置
const uploadUrl = '/api/upload/image'
const uploadHeaders = {
  Authorization: `${getToken()}`
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const { data } = await getBannerList({
      page: pagination.page,
      size: pagination.size
    })
    tableData.value = data.list
    pagination.total = data.total
  } catch (error) {
    console.error('获取轮播图列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理选择变化
const handleSelectionChange = (selection: any[]) => {
  multipleSelection.value = selection
}

// 处理新增
const handleAdd = () => {
  dialogTitle.value = '新增轮播图'
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑轮播图'
  Object.assign(form, row)
  dialogVisible.value = true
}

// 处理删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这个轮播图吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteBanner(row.id)
    ElMessage.success('删除成功')
    getList()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 处理批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除选中的轮播图吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const ids = multipleSelection.value.map((item: any) => item.id)
    await deleteBanner(ids)
    ElMessage.success('批量删除成功')
    getList()
  } catch (error) {
    console.error('批量删除失败:', error)
  }
}

// 处理预览
const handlePreview = (row: any) => {
  window.open(row.image, '_blank')
}

// 处理提交
const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (form.id) {
          await updateBanner(form.id, form)
          ElMessage.success('更新成功')
        } else {
          await createBanner(form)
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
    title: '',
    image: '',
    link: '',
    sort: 0,
    status: 1
  })
  formRef.value?.resetFields()
}

// 上传成功回调
const handleUploadSuccess = (response: any) => {
  form.image = response.data.url
  ElMessage.success('上传成功')
}

// 上传前验证
const beforeUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传图片只能是 JPG/PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
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
.upload-demo {
  .upload-image {
    width: 178px;
    height: 100px;
    display: block;
    border-radius: 6px;
  }
  
  .upload-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    
    &:hover {
      border-color: #409eff;
    }
  }
}
</style>