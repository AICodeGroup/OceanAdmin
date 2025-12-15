<template>
  <div class="app-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <el-icon class="header-icon" :size="20">
          <Picture />
        </el-icon>
        <h1 class="page-title">轮播图管理</h1>
      </div>
      <div class="header-actions">
        <el-button type="primary" size="large" @click="handleAdd" round>
          <el-icon class="btn-icon"><Plus /></el-icon>
          新增轮播图
        </el-button>
      </div>
    </div>

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
        </el-form-item>
      </el-form>

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
        <el-table-column label="描述" prop="description" :show-overflow-tooltip="true" width="200" />
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
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入轮播图标题" />
        </el-form-item>
        <el-form-item label="小程序标题" prop="latinName">
          <el-input v-model="form.latinName" placeholder="请输入小程序标题描述" />
        </el-form-item>
        <el-form-item label="网页标题" prop="description" v-if="form.bannerType === 0">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入轮播图描述信息（选填）" 
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="轮播图" prop="imageUrl">
            <el-upload
                v-model:file-list="fileList"
                action="https://beniocean.com/api/admin/platform/uploadOss"
                list-type="picture-card"
                :limit="1"
                :on-success="handleUploadSuccess"
                :on-remove="handleRemove"
                :headers="{ Authorization: getToken() }" >
                <el-icon><Plus /></el-icon>
            </el-upload>
        </el-form-item>
        <el-form-item label="小程序跳转课程" prop="linkUrl">
          <el-select
            v-model="selectedMiniCourseId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入课程名称搜索"
            :remote-method="searchMiniCourse"
            :loading="miniCourseLoading"
            style="width: 100%"
            @change="handleMiniCourseChange"
          >
            <el-option
              v-for="item in miniCourseOptions"
              :key="item.id"
              :label="item.name || item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="网站跳转课程" prop="webLinkUrl" v-if="form.bannerType === 0">
          <el-select
            v-model="form.webLinkUrl"
            filterable
            remote
            reserve-keyword
            placeholder="请输入课程名称搜索"
            :remote-method="searchCourse"
            :loading="courseLoading"
            style="width: 100%"
          >
            <el-option
              v-for="item in courseOptions"
              :key="item.id"
              :label="item.name || item.title"
              :value="String(item.id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" />
        </el-form-item>
        <el-form-item label="轮播图类型" prop="bannerType">
          <el-radio-group v-model="form.bannerType">
            <el-radio :label="0">首页轮播图（网站、小程序）</el-radio>
            <el-radio :label="1">物种图鉴轮播图（小程序）</el-radio>
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
import { getAdminCourseList, getAdminCourseDetail } from '@/api/course';
import { getToken } from '@/utils/auth';
import { Plus, Picture } from '@element-plus/icons-vue';

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
const courseLoading = ref(false);
const courseOptions = ref<{ id: number; name: string; title?: string }[]>([]);
const miniCourseLoading = ref(false);
const miniCourseOptions = ref<{ id: number; name: string; title?: string }[]>([]);
const selectedMiniCourseId = ref<number | null>(null);

const getInitialForm = (): Omit<Banner, 'id' | 'createdAt' | 'updatedAt' | 'isDel'> => ({
  title: '',
  latinName: '',
  imageUrl: '',
  linkUrl: '',
  webLinkUrl: '',
  description: '',
  sort: 0,
  status: true,
  bannerType: 0,
});

let form = reactive(getInitialForm());

const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入轮播图标题', trigger: 'blur' }],
  latinName: [{ required: true, message: '请输入小程序标题描述', trigger: 'blur' }],
  imageUrl: [{ required: true, message: '请上传轮播图', trigger: 'change' }],
  bannerType: [{ required: true, message: '请选择轮播图类型', trigger: 'change' }],
});

// 搜索课程（网站跳转）
const searchCourse = async (query: string) => {
  if (!query) {
    courseOptions.value = [];
    return;
  }
  courseLoading.value = true;
  try {
    const response = await getAdminCourseList({ name: query, page: 1, limit: 20 });
    courseOptions.value = response.list || [];
  } catch (error) {
    console.error('搜索课程失败:', error);
    courseOptions.value = [];
  } finally {
    courseLoading.value = false;
  }
};

// 搜索课程（小程序跳转）
const searchMiniCourse = async (query: string) => {
  if (!query) {
    miniCourseOptions.value = [];
    return;
  }
  miniCourseLoading.value = true;
  try {
    const response = await getAdminCourseList({ name: query, page: 1, limit: 20 });
    miniCourseOptions.value = response.list || [];
  } catch (error) {
    console.error('搜索课程失败:', error);
    miniCourseOptions.value = [];
  } finally {
    miniCourseLoading.value = false;
  }
};

// 小程序课程选择变化
const handleMiniCourseChange = (courseId: number) => {
  if (courseId) {
    form.linkUrl = `/pages/goods/goods_details/index?id=${courseId}`;
  } else {
    form.linkUrl = '';
  }
};

// 从linkUrl中提取课程ID
const extractCourseIdFromUrl = (url: string): number | null => {
  const match = url?.match(/id=(\d+)/);
  return match ? parseInt(match[1]) : null;
};

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
  selectedMiniCourseId.value = null;
  miniCourseOptions.value = [];
  courseOptions.value = [];
};

// 新增按钮操作
const handleAdd = () => {
  resetForm();
  dialogTitle.value = '新增轮播图';
  dialogVisible.value = true;
};

// 修改按钮操作
const handleUpdate = async (row: Banner) => {
  resetForm();
  Object.assign(form, row);
  if (row.imageUrl) {
    fileList.value = [{ name: row.imageUrl, url: row.imageUrl }];
  }
  // 如果有小程序跳转链接，提取课程ID并获取课程详情
  if (row.linkUrl) {
    const miniCourseId = extractCourseIdFromUrl(row.linkUrl);
    if (miniCourseId) {
      selectedMiniCourseId.value = miniCourseId;
      try {
        const response = await getAdminCourseDetail(miniCourseId);
        if (response) {
          const courseName = response.name || response.title || response.productName || '';
          miniCourseOptions.value = [{ id: miniCourseId, name: courseName, title: courseName }];
        }
      } catch (error) {
        console.error('加载小程序课程信息失败:', error);
      }
    }
  }
  // 如果有网站跳转课程，获取课程详情
  if (row.webLinkUrl && row.bannerType === 0) {
    const webCourseId = parseInt(row.webLinkUrl);
    if (!isNaN(webCourseId)) {
      try {
        const response = await getAdminCourseDetail(webCourseId);
        if (response) {
          const courseName = response.name || response.title || response.productName || '';
          courseOptions.value = [{ id: webCourseId, name: courseName, title: courseName }];
        }
      } catch (error) {
        console.error('加载课程信息失败:', error);
      }
    }
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
        formRef.value?.clearValidate();
      } catch (error) {
        console.error('提交失败:', error);
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

.mb-4 { margin-bottom: 1rem; }
.mt-4 { margin-top: 1rem; }
.flex { display: flex; }
.justify-end { justify-content: flex-end; }
</style>