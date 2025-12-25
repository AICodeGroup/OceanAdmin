<template>
  <div class="multi-image-upload-container">
    <el-upload
      class="multi-image-uploader"
      :action="uploadUrl"
      :headers="uploadHeaders"
      :data="uploadData"
      list-type="picture-card"
      :file-list="fileList"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :disabled="disabled"
      :limit="limit"
      :on-exceed="handleExceed"
      :on-preview="handlePreview"
      name="multipart"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>

    <!-- 图片预览弹窗 -->
    <el-dialog v-model="previewVisible" title="图片预览" width="600px">
      <img :src="previewUrl" style="width: 100%;" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { getToken } from '@/utils/auth';

interface Props {
  modelValue: string; // 逗号分隔的URL字符串
  model?: string;
  pid?: number;
  placeholder?: string;
  disabled?: boolean;
  maxSize?: number; // MB
  limit?: number; // 最大上传数量
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  model: 'product',
  pid: 1,
  placeholder: '上传图片',
  disabled: false,
  maxSize: 5,
  limit: 5
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const previewVisible = ref(false);
const previewUrl = ref('');

// 将逗号分隔的URL字符串转换为文件列表
const fileList = ref<any[]>([]);

// 监听modelValue变化，更新fileList
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    const urls = newVal.split(',').filter(url => url.trim());
    fileList.value = urls.map((url, index) => ({
      name: `image-${index}`,
      url: url.trim()
    }));
  } else {
    fileList.value = [];
  }
}, { immediate: true });

// 上传地址
const uploadUrl = '/admin/platform/upload/image';

// 上传额外参数
const uploadData = computed(() => ({
  model: props.model,
  pid: props.pid
}));

// 上传请求头
const uploadHeaders = computed(() => ({
  Authorization: getToken()
}));

// 上传前校验
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    ElMessage.error('只能上传图片文件！');
    return false;
  }
  
  const isLtMaxSize = file.size / 1024 / 1024 < props.maxSize;
  if (!isLtMaxSize) {
    ElMessage.error(`图片大小不能超过 ${props.maxSize}MB！`);
    return false;
  }
  
  return true;
};

// 上传成功
const handleSuccess = (response: any, file: any) => {
  if (response.code === 200 && response.data?.url) {
    // 获取当前所有URL
    const currentUrls = props.modelValue ? props.modelValue.split(',').filter(url => url.trim()) : [];
    currentUrls.push(response.data.url);
    emit('update:modelValue', currentUrls.join(','));
    ElMessage.success('上传成功');
  } else {
    ElMessage.error(response.message || '上传失败');
    // 从文件列表中移除失败的文件
    const index = fileList.value.findIndex(f => f.uid === file.uid);
    if (index > -1) {
      fileList.value.splice(index, 1);
    }
  }
};

// 上传失败
const handleError = () => {
  ElMessage.error('上传失败，请重试');
};

// 移除图片
const handleRemove = (file: any) => {
  const url = file.url || file.response?.data?.url;
  if (url) {
    const currentUrls = props.modelValue ? props.modelValue.split(',').filter(u => u.trim()) : [];
    const index = currentUrls.indexOf(url);
    if (index > -1) {
      currentUrls.splice(index, 1);
    }
    emit('update:modelValue', currentUrls.join(','));
  }
};

// 超出限制
const handleExceed = () => {
  ElMessage.warning(`最多只能上传 ${props.limit} 张图片`);
};

// 预览图片
const handlePreview = (file: any) => {
  previewUrl.value = file.url || file.response?.data?.url;
  previewVisible.value = true;
};
</script>

<style scoped lang="scss">
.multi-image-upload-container {
  width: 100%;
}

.multi-image-uploader {
  :deep(.el-upload--picture-card) {
    width: 100px;
    height: 100px;
    line-height: 100px;
    border-radius: 8px;
  }
  
  :deep(.el-upload-list--picture-card .el-upload-list__item) {
    width: 100px;
    height: 100px;
    border-radius: 8px;
  }
  
  :deep(.el-upload-list--picture-card .el-upload-list__item-thumbnail) {
    object-fit: cover;
  }
}
</style>
