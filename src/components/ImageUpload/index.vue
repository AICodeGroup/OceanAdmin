<template>
  <div class="image-upload-container">
    <el-upload
      class="image-uploader"
      :action="uploadUrl"
      :headers="uploadHeaders"
      :data="uploadData"
      :show-file-list="false"
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      :disabled="disabled"
      name="multipart"
    >
      <div v-if="modelValue" class="image-preview">
        <img :src="modelValue" class="preview-img" />
        <div class="image-actions">
          <el-icon class="action-icon" @click.stop="handlePreview"><ZoomIn /></el-icon>
          <el-icon class="action-icon" @click.stop="handleRemove"><Delete /></el-icon>
        </div>
      </div>
      <div v-else class="upload-placeholder">
        <el-icon class="upload-icon"><Plus /></el-icon>
        <span class="upload-text">{{ placeholder }}</span>
      </div>
    </el-upload>

    <!-- 图片预览弹窗 -->
    <el-dialog v-model="previewVisible" title="图片预览" width="600px">
      <img :src="modelValue" style="width: 100%;" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Delete, ZoomIn } from '@element-plus/icons-vue';
import { getToken } from '@/utils/auth';

interface Props {
  modelValue: string;
  model?: string;
  pid?: number;
  placeholder?: string;
  disabled?: boolean;
  maxSize?: number; // MB
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  model: 'product',
  pid: 1,
  placeholder: '上传图片',
  disabled: false,
  maxSize: 5
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const previewVisible = ref(false);

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
const handleSuccess = (response: any) => {
  if (response.code === 200 && response.data?.url) {
    emit('update:modelValue', response.data.url);
    ElMessage.success('上传成功');
  } else {
    ElMessage.error(response.message || '上传失败');
  }
};

// 上传失败
const handleError = () => {
  ElMessage.error('上传失败，请重试');
};

// 预览图片
const handlePreview = () => {
  previewVisible.value = true;
};

// 移除图片
const handleRemove = () => {
  emit('update:modelValue', '');
};
</script>

<style scoped lang="scss">
.image-upload-container {
  display: inline-block;
}

.image-uploader {
  :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
    
    &:hover {
      border-color: #409eff;
    }
  }
}

.upload-placeholder {
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fafafa;
  
  .upload-icon {
    font-size: 28px;
    color: #8c939d;
  }
  
  .upload-text {
    font-size: 12px;
    color: #8c939d;
    margin-top: 8px;
  }
}

.image-preview {
  width: 120px;
  height: 120px;
  position: relative;
  
  .preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .image-actions {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    opacity: 0;
    transition: opacity 0.3s;
    border-radius: 8px;
    
    .action-icon {
      font-size: 20px;
      color: #fff;
      cursor: pointer;
      
      &:hover {
        color: #409eff;
      }
    }
  }
  
  &:hover .image-actions {
    opacity: 1;
  }
}
</style>
