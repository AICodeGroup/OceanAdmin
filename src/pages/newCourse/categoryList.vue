<template>
  <div class="app-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <el-icon class="header-icon" :size="20">
          <Menu />
        </el-icon>
        <h1 class="page-title">课程分类管理</h1>
      </div>
      <div class="header-actions">
        <el-button type="primary" size="large" @click="handleAdd" round>
          <el-icon class="btn-icon"><Plus /></el-icon>
          新增分类
        </el-button>
      </div>
    </div>

    <el-card>
      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="sortedCategoryList" row-key="id" @sort-change="handleSortChange">
        <el-table-column label="ID" prop="id" width="80" align="center" />
        <el-table-column label="分类图标" width="100" align="center">
          <template #default="scope">
            <el-image
              v-if="scope.row.icon"
              style="width: 40px; height: 40px"
              :src="formatIconUrl(scope.row.icon)"
              fit="cover"
            />
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
        <el-table-column label="分类名称" prop="name" min-width="200" />
        <el-table-column label="排序" prop="sort" width="100" align="center" sortable="custom" />
        <el-table-column label="显示状态" width="120" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isShow"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
<!--        <el-table-column label="创建时间" prop="createTime" width="180" />-->
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" icon="Edit" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" icon="Delete" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/修改分类弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" destroy-on-close @close="handleCancel">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="分类图标" prop="icon">
          <div class="icon-upload-wrapper">
            <el-upload
              class="icon-uploader"
              action="/admin/platform/upload/image"
              :headers="{ Authorization: getToken() }"
              :data="{ model: 'category', pid: 1 }"
              :show-file-list="false"
              :on-success="handleIconUploadSuccess"
              name="multipart"
            >
              <el-image
                v-if="form.icon"
                :src="form.icon"
                class="icon-preview"
                fit="cover"
              />
              <el-icon v-else class="icon-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <el-button v-if="form.icon" type="danger" size="small" text @click="form.icon = ''">删除</el-button>
          </div>
          <div class="upload-tip">建议尺寸：100x100px</div>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="9999" controls-position="right" style="width: 100%" />
          <div class="form-tip">数值越小越靠前</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules, UploadProps } from 'element-plus';
import { Plus, Menu } from '@element-plus/icons-vue';
import { getToken } from '@/utils/auth';
import {
  getAllCourseCategory,
  addCourseCategory,
  updateCourseCategory,
  deleteCourseCategory,
  updateCourseCategoryStatus,
  CourseProductCategory
} from '@/api/course';

const loading = ref(false);
const submitLoading = ref(false);
const categoryList = ref<CourseProductCategory[]>([]);
const sortOrder = ref<'ascending' | 'descending' | null>(null);
const sortProp = ref<string>('');

const dialogVisible = ref(false);
const dialogTitle = ref('');
const formRef = ref<FormInstance>();

const getInitialForm = () => ({
  id: undefined as number | undefined,
  pid: 0,
  name: '',
  icon: '',
  level: 1,
  sort: 0
});

const form = reactive(getInitialForm());

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序值', trigger: 'blur' }]
});

// 排序后的分类列表
const sortedCategoryList = computed(() => {
  if (!sortProp.value || !sortOrder.value) {
    return categoryList.value;
  }
  const list = [...categoryList.value];
  list.sort((a, b) => {
    const aVal = (a as any)[sortProp.value];
    const bVal = (b as any)[sortProp.value];
    if (sortOrder.value === 'ascending') {
      return aVal - bVal;
    } else {
      return bVal - aVal;
    }
  });
  return list;
});

// 排序变化处理
const handleSortChange = ({ prop, order }: { prop: string; order: 'ascending' | 'descending' | null }) => {
  sortProp.value = prop;
  sortOrder.value = order;
};

// 获取分类列表
const getList = async () => {
  loading.value = true;
  try {
    const response = await getAllCourseCategory() as CourseProductCategory[];
    // 只取一级分类（pid === 0 或 level === 1）
    categoryList.value = (response || []).filter(item => item.pid === 0 || item.level === 1);
  } catch (error) {
    console.error('获取分类列表失败:', error);
    ElMessage.error('获取分类列表失败');
  } finally {
    loading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(form, getInitialForm());
  formRef.value?.clearValidate();
};

// 新增按钮操作
const handleAdd = () => {
  resetForm();
  dialogTitle.value = '新增分类';
  dialogVisible.value = true;
};

// 修改按钮操作
const handleUpdate = (row: CourseProductCategory) => {
  resetForm();
  Object.assign(form, {
    id: row.id,
    pid: row.pid,
    name: row.name,
    icon: row.icon || '',
    level: row.level,
    sort: row.sort
  });
  dialogTitle.value = '修改分类';
  dialogVisible.value = true;
};

// 删除按钮操作
const handleDelete = (row: CourseProductCategory) => {
  ElMessageBox.confirm(`确定要删除分类 "${row.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteCourseCategory(row.id);
      ElMessage.success('删除成功');
      getList();
    } catch (error: any) {
      ElMessage.error(error.message || '删除失败');
    }
  }).catch(() => {});
};

// 切换显示状态
const handleStatusChange = async (row: CourseProductCategory) => {
  try {
    await updateCourseCategoryStatus(row.id);
    ElMessage.success('状态更新成功');
  } catch (error) {
    // 恢复原状态
    row.isShow = !row.isShow;
    ElMessage.error('状态更新失败');
  }
};

// 图标上传成功
const handleIconUploadSuccess: UploadProps['onSuccess'] = (response) => {
  if (response.code === 200 && response.data?.url) {
    form.icon = response.data.url;
    ElMessage.success('图标上传成功');
  } else {
    ElMessage.error(response.message || '图标上传失败');
  }
};

// 弹窗取消按钮
const handleCancel = () => {
  dialogVisible.value = false;
  resetForm();
};

// 弹窗提交按钮
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    submitLoading.value = true;
    
    const isUpdate = !!form.id;
    const submitData = {
      id: form.id,
      pid: 0, // 一级分类pid固定为0
      name: form.name,
      icon: form.icon,
      level: 1, // 一级分类level固定为1
      sort: form.sort
    };
    
    if (isUpdate) {
      await updateCourseCategory(submitData);
    } else {
      await addCourseCategory(submitData);
    }
    
    ElMessage.success(isUpdate ? '修改成功' : '新增成功');
    dialogVisible.value = false;
    getList();
  } catch (error: any) {
    if (error !== 'cancel' && error !== false) {
      ElMessage.error(error.message || (form.id ? '修改失败' : '新增失败'));
    }
  } finally {
    submitLoading.value = false;
  }
};

// 格式化图标URL
const formatIconUrl = (icon: string) => {
  if (!icon) return '';
  if (icon.startsWith('https://') || icon.startsWith('http://')) {
    return icon;
  }
  return `http://beniocean.com/${icon}`;
};

onMounted(() => {
  getList();
});
</script>

<style scoped lang="scss">
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

.text-muted {
  color: #c0c4cc;
}

.icon-upload-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-uploader {
  :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;

    &:hover {
      border-color: #409eff;
    }
  }
}

.icon-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-preview {
  width: 80px;
  height: 80px;
  display: block;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
