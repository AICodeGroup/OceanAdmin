<template>
  <div class="multi-image-upload">
    <div class="image-list">
      <!-- 已上传的图片 -->
      <div 
        v-for="(url, index) in imageList" 
        :key="index" 
        class="image-item"
      >
        <img :src="url" class="preview-img" />
        <div class="image-actions">
          <el-icon class="action-icon" @click="handlePreview(index)"><ZoomIn /></el-icon>
          <el-icon class="action-icon" @click="handleRemove(index)"><Delete /></el-icon>
        </div>
      </div>
      <!-- 上传按钮 -->
      <el-upload
        v-if="imageList.length < maxCount"
        class="upload-trigger"
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
        <div class="upload-placeholder">
          <el-icon class="upload-icon"><Plus /></el-icon>
          <span class="upload-text">{{ placeholder }}</span>
        </div>
      </el-upload>
    </div>
    <div class="upload-tip" v-if="tip">{{ tip }}</div>

    <!-- 图片预览 -->
    <el-image-viewer
      v-if="previewVisible"
      :url-list="imageList"
      :initial-index="previewIndex"
      @close="previewVisible = false"
      teleported
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Delete, ZoomIn } from '@element-plus/icons-vue';
import { getToken } from '@/utils/auth';

interface Props {
  modelValue: string;
  model?: string;
  pid?: number;
  placeholder?: string;
  disabled?: boolean;
  maxSize?: number;
  maxCount?: number;
  tip?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  model: 'product',
  pid: 1,
  placeholder: '上传图片',
  disabled: false,
  maxSize: 5,
  maxCount: 9,
  tip: ''
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

// 图片列表
const imageList = ref<string[]>([]);
const previewVisible = ref(false);
const previewIndex = ref(0);

// 监听 modelValue 变化，同步到 imageList
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      imageList.value = val.split(',').filter(url => url.trim());
    } else {
      imageList.value = [];
    }
  },
  { immediate: true }
);

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
  
  if (imageList.value.length >= props.maxCount) {
    ElMessage.error(`最多只能上传 ${props.maxCount} 张图片！`);
    return false;
  }
  
  return true;
};

// 上传成功
const handleSuccess = (response: any) => {
  if (response.code === 200 && response.data?.url) {
    imageList.value.push(response.data.url);
    emitValue();
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
const handlePreview = (index: number) => {
  previewIndex.value = index;
  previewVisible.value = true;
};

// 移除图片
const handleRemove = (index: number) => {
  imageList.value.splice(index, 1);
  emitValue();
};

// 同步值到父组件
const emitValue = () => {
  emit('update:modelValue', imageList.value.join(','));
};
</script>

<style scoped lang="scss">
.multi-image-upload {
  .image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .image-item {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    border: 1px solid #dcdfe6;
    
    .preview-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
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
      gap: 12px;
      opacity: 0;
      transition: opacity 0.3s;
      
      .action-icon {
        font-size: 18px;
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
  
  .upload-trigger {
    :deep(.el-upload) {
      width: 100px;
      height: 100px;
      border: 1px dashed #d9d9d9;
      border-radius: 8px;
      cursor: pointer;
      transition: border-color 0.3s;
      
      &:hover {
        border-color: #409eff;
      }
    }
  }
  
  .upload-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fafafa;
    
    .upload-icon {
      font-size: 24px;
      color: #8c939d;
    }
    
    .upload-text {
      font-size: 12px;
      color: #8c939d;
      margin-top: 6px;
    }
  }
  
  .upload-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 8px;
  }
}
</style>
