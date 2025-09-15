<template>
  <div class="app-container">
    <el-card>
      <!-- 筛选条件 -->
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="mb-4">
        <el-form-item label="轮播图类型" prop="bannerType" style="width: 222px;">
          <el-select v-model="queryParams.bannerType" placeholder="请选择类型" clearable @change="handleQuery">
            <el-option label="首页轮播图" :value="0" />
            <el-option label="物种轮播图" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 操作按钮 -->
      <el-row :gutter="10" class="mb-4">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="Plus" @click="handleAdd">新增轮播图</el-button>
        </el-col>
      </el-row>

      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="bannerList">
        <el-table-column label="ID" prop="id" width="80" />
        <el-table-column label="轮播图" align="center" width="150">
          <template #default="scope">
            <el-image
              style="width: 100px; height: 50px"
              :src="scope.row.imageUrl"
              :preview-src-list="[scope.row.imageUrl]"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title" :show-overflow-tooltip="true" />
        <el-table-column label="跳转链接" prop="linkUrl" :show-overflow-tooltip="true" />
        <el-table-column label="排序" prop="sort" width="100" align="center" />
        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'info'">{{ scope.row.status ? '显示' : '隐藏' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="轮播图类型" prop="bannerType" width="270" align="center">
          <template #default="scope">
            <span>{{ scope.row.bannerType === 0 ? '首页轮播图' : '物种轮播图' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createdAt" width="180" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" icon="Edit" size="small" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button type="danger" icon="Delete" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="mt-4 flex justify-end">
        <el-pagination
          :current-page="queryParams.page"
          :page-size="queryParams.limit"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/修改轮播图弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px" destroy-on-close @close="handleCancel">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入轮播图标题" />
        </el-form-item>
        <el-form-item label="轮播图" prop="imageUrl">
            <el-upload
                v-model:file-list="fileList"
                action="http://47.112.106.127:8080/api/admin/platform/uploadOss"
                list-type="picture-card"
                :limit="1"
                :on-success="handleUploadSuccess"
                :on-remove="handleRemove"
                :headers="{ Authorization: 'Bearer ' + getToken() }" >
                <el-icon><Plus /></el-icon>
            </el-upload>
        </el-form-item>
        <el-form-item label="跳转链接" prop="linkUrl">
          <el-input v-model="form.linkUrl" placeholder="请输入跳转链接" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" />
        </el-form-item>
        <el-form-item label="轮播图类型" prop="bannerType">
          <el-radio-group v-model="form.bannerType">
            <el-radio :label="0">首页轮播图</el-radio>
            <el-radio :label="1">物种轮播图</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules, UploadProps, UploadUserFile } from 'element-plus';
import { getBannersList, createBanner, updateBanner, deleteBanner, Banner } from '@/api/banner';
import { getToken } from '@/utils/auth';

const loading = ref(true);
const bannerList = ref<Banner[]>([]);
const total = ref(0);
const queryParams = reactive({
  page: 1,
  limit: 10,
  bannerType: undefined,
});

const dialogVisible = ref(false);
const dialogTitle = ref('');
const formRef = ref<FormInstance>();
const fileList = ref<UploadUserFile[]>([]);

const getInitialForm = (): Omit<Banner, 'id' | 'createdAt' | 'updatedAt' | 'isDel'> => ({
  title: '',
  imageUrl: '',
  linkUrl: '',
  sort: 0,
  status: true,
  bannerType: 0,
});

let form = reactive(getInitialForm());

const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入轮播图标题', trigger: 'blur' }],
  imageUrl: [{ required: true, message: '请上传轮播图', trigger: 'change' }],
  bannerType: [{ required: true, message: '请选择轮播图类型', trigger: 'change' }],
});

// 查询按钮操作
const handleQuery = () => {
  queryParams.page = 1;
  getList();
};

// 重置查询
const resetQuery = () => {
  queryParams.page = 1;
  queryParams.bannerType = undefined;
  getList();
};

// 获取轮播图列表
const getList = async () => {
  loading.value = true;
  try {
    const response = await getBannersList(queryParams);
    bannerList.value = response.list;
    total.value = response.total;
  } catch (error) {
    ElMessage.error('获取轮播图列表失败');
  } finally {
    loading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  // 彻底清空响应式对象，防止属性（尤其是 id）残留
  Object.keys(form).forEach(key => {
    delete (form as any)[key];
  });
  Object.assign(form, getInitialForm());
  fileList.value = [];
};

// 新增按钮操作
const handleAdd = () => {
  resetForm();
  dialogTitle.value = '新增轮播图';
  dialogVisible.value = true;
};

// 修改按钮操作
const handleUpdate = (row: Banner) => {
  resetForm();
  Object.assign(form, row);
  if (row.imageUrl) {
    fileList.value = [{ name: row.imageUrl, url: row.imageUrl }];
  }
  dialogTitle.value = '修改轮播图';
  dialogVisible.value = true;
};

// 删除按钮操作
const handleDelete = (row: Banner) => {
  ElMessageBox.confirm(`确定要删除标题为 "${row.title}" 的轮播图吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteBanner(row.id!);
      ElMessage.success('删除成功');
      getList();
    } catch (error) {
      ElMessage.error('删除失败');
    }
  }).catch(() => {});
};

// 图片上传成功回调
const handleUploadSuccess: UploadProps['onSuccess'] = (response) => {
  if (response.code === 200) {
    form.imageUrl = response.data;
    fileList.value = [{ name: response.data, url: response.data }];
  } else {
    ElMessage.error('图片上传失败');
  }
};

// 图片移除回调
const handleRemove: UploadProps['onRemove'] = () => {
  form.imageUrl = '';
  fileList.value = [];
};

// 弹窗取消按钮
const handleCancel = () => {
  dialogVisible.value = false;
  resetForm();
  formRef.value?.clearValidate(); // 只清除校验状态
};

// 弹窗提交按钮
const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      // @ts-ignore
      const isUpdate = !!form.id;
      try {
        if (isUpdate) {
          await updateBanner(form as Banner);
        } else {
          await createBanner(form as Banner);
        }
        ElMessage.success(isUpdate ? '修改成功' : '新增成功');
        dialogVisible.value = false;
        getList();
        formRef.value?.clearValidate(); // 清除校验状态
      } catch (error) {
        ElMessage.error(isUpdate ? '修改失败' : '新增失败');
      }
    }
  });
};

// 分页大小改变
const handleSizeChange = (val: number) => {
  queryParams.limit = val;
  getList();
};

// 当前页改变
const handleCurrentChange = (val: number) => {
  queryParams.page = val;
  getList();
};

onMounted(() => {
  getList();
});
</script>

<style scoped>
.mt-4 { margin-top: 1rem; }
.mb-4 { margin-bottom: 1rem; }
.flex { display: flex; }
.justify-end { justify-content: flex-end; }
</style>