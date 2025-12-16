<template>
  <div class="rich-editor-wrapper">
    <!-- 工具栏 -->
    <div class="editor-toolbar-wrapper">
      <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      
      <!-- 电商专属快捷操作 -->
      <div class="custom-toolbar">
        <el-button-group size="small">
          <el-button @click="showTemplateDialog" title="选择商品详情模板">
            <el-icon><Tickets /></el-icon>
            模板
          </el-button>
          <el-button @click="insertTemplate('params')" title="插入参数表格">
            <el-icon><Grid /></el-icon>
            参数表
          </el-button>
          <el-button @click="insertTemplate('images')" title="批量插入图片">
            <el-icon><Picture /></el-icon>
            图片组
          </el-button>
          <el-button @click="setImageWidth(750)" title="设置图片宽度750px">
            <el-icon><FullScreen /></el-icon>
            750px
          </el-button>
          <el-button @click="setImageWidth(375)" title="设置图片宽度375px">
            <el-icon><Iphone /></el-icon>
            375px
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 编辑器 -->
    <Editor
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />

    <!-- 模板选择对话框 -->
    <el-dialog
      v-model="templateDialogVisible"
      title="选择商品详情模板"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="template-selector">
        <el-alert
          type="info"
          :closable="false"
          style="margin-bottom: 20px;"
        >
          选择模板后会替换当前内容，请谨慎操作。建议在开始编辑前选择模板。
        </el-alert>
        
        <el-row :gutter="20">
          <el-col
            v-for="template in templates"
            :key="template.id"
            :xs="24"
            :sm="12"
            :md="8"
          >
            <el-card
              shadow="hover"
              class="template-card"
              :class="{ 'selected': selectedTemplateId === template.id }"
              @click="selectedTemplateId = template.id"
            >
              <div class="template-header">
                <el-tag size="small" type="primary">{{ template.category }}</el-tag>
                <h3>{{ template.name }}</h3>
              </div>
              <p class="template-preview">{{ template.preview }}</p>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <el-button @click="templateDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="applyTemplate"
          :disabled="!selectedTemplateId"
        >
          应用模板
        </el-button>
      </template>
    </el-dialog>

    <!-- 批量图片上传对话框 -->
    <el-dialog
      v-model="batchImageDialogVisible"
      title="上传图片"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-upload
        ref="uploadRef"
        class="upload-demo"
        drag
        :action="uploadUrl"
        :headers="uploadHeaders"
        :data="uploadData"
        :limit="1"
        :auto-upload="false"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :on-exceed="handleExceed"
        accept="image/*"
        list-type="picture"
        name="multipart"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将图片拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持jpg/png格式，建议尺寸750x750px，单张不超过2MB
          </div>
        </template>
      </el-upload>
      
      <template #footer>
        <el-button @click="batchImageDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUpload" :loading="uploading">
          开始上传
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onBeforeUnmount, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'
import { ElMessage, ElLoading } from 'element-plus'
import { UploadFilled, Grid, Picture, FullScreen, Iphone, Tickets } from '@element-plus/icons-vue'
import axios from 'axios'
import { productTemplates, getTemplateById, type ProductTemplate } from './templates'
import { getToken } from '@/utils/auth'

// Props定义
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: '500px'
  },
  placeholder: {
    type: String,
    default: '请输入商品详情内容...'
  }
})

const emit = defineEmits(['update:modelValue'])

// 编辑器实例
const editorRef = shallowRef()
const mode = ref('default') // 'default' | 'simple'
const valueHtml = ref('')

// 模板相关
const templateDialogVisible = ref(false)
const selectedTemplateId = ref<string>('')
const templates = ref<ProductTemplate[]>(productTemplates)

// 上传相关
const batchImageDialogVisible = ref(false)
const uploadRef = ref()
const uploading = ref(false)
const uploadUrl = '/admin/platform/upload/image'

// 动态获取认证请求头
const getUploadHeaders = () => {
  const token = getToken()
  return token ? { Authorization: token } : {}
}

const uploadHeaders = ref(getUploadHeaders())
const uploadData = ref({
  model: 'product',
  pid: 1
})

// 监听外部值变化
watch(() => props.modelValue, (newVal) => {
  if (newVal !== valueHtml.value) {
    valueHtml.value = newVal
  }
}, { immediate: true })

// 工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    'headerSelect',
    'bold',
    'italic',
    'underline',
    'through',
    '|',
    'fontSize',
    'fontFamily',
    'lineHeight',
    '|',
    'color',
    'bgColor',
    '|',
    'bulletedList',
    'numberedList',
    'todo',
    '|',
    'justifyLeft',
    'justifyCenter',
    'justifyRight',
    'justifyJustify',
    '|',
    'insertLink',
    'insertImage',
    'insertTable',
    'codeBlock',
    'divider',
    '|',
    'undo',
    'redo',
    '|',
    'fullScreen'
  ]
}

// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: props.placeholder,
  MENU_CONF: {
    // 配置上传图片
    uploadImage: {
      server: uploadUrl,
      fieldName: 'file',
      maxFileSize: 2 * 1024 * 1024, // 2M
      maxNumberOfFiles: 10,
      allowedFileTypes: ['image/*'],
      timeout: 30 * 1000,
      
      // 自定义插入图片
      customInsert(res: any, insertFn: Function) {
        if (res.data) {
          insertFn(res.data, '', res.data)
        } else {
          ElMessage.error('图片上传失败')
        }
      },
      
      // 上传错误
      onError(_file: File, err: any, res: any) {
        console.error('图片上传错误', err, res)
        ElMessage.error('图片上传失败: ' + (err.message || '未知错误'))
      },
      
      // 自定义上传
      async customUpload(file: File, insertFn: Function) {
        const formData = new FormData()
        formData.append('multipart', file)
        formData.append('model', 'product')
        formData.append('pid', '1')
        
        const loadingInstance = ElLoading.service({
          lock: true,
          text: '图片上传中...',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        
        try {
          // 获取最新的 token
          const token = getToken()
          const headers: any = {
            'Content-Type': 'multipart/form-data'
          }
          
          // 添加认证头
          if (token) {
            headers.Authorization = token
          }
          
          const response = await axios.post(uploadUrl, formData, { headers })
          
          console.log('单张上传响应:', response.data)
          
          // 处理后端响应：{code: 200, data: { url: "..." }, message: null}
          if (response.data && response.data.code === 200 && response.data.data?.url) {
            const imageUrl = response.data.data.url
            console.log('准备插入图片URL:', imageUrl)
            insertFn(imageUrl, '', imageUrl)
            console.log('图片已通过insertFn插入')
            ElMessage.success('图片上传成功')
          } else {
            console.error('响应格式不正确:', response.data)
            throw new Error(response.data?.message || '后端未返回图片URL')
          }
        } catch (error: any) {
          console.error('图片上传失败:', error)
          ElMessage.error('图片上传失败: ' + (error.message || '未知错误'))
        } finally {
          loadingInstance.close()
        }
      }
    },
    
    // 配置上传视频（如果需要）
    uploadVideo: {
      server: uploadUrl,
      fieldName: 'file',
      maxFileSize: 50 * 1024 * 1024, // 50M
      timeout: 60 * 1000
    }
  }
}

// 编辑器创建完成
const handleCreated = (editor: any) => {
  editorRef.value = editor
  
  // 设置编辑器高度
  const editorContainer = editor.getEditableContainer()
  if (editorContainer) {
    editorContainer.style.height = props.height
  }
}

// 内容变化
const handleChange = () => {
  emit('update:modelValue', valueHtml.value)
}

// 显示模板选择对话框
const showTemplateDialog = () => {
  templateDialogVisible.value = true
  selectedTemplateId.value = ''
}

// 应用选中的模板
const applyTemplate = () => {
  if (!selectedTemplateId.value || !editorRef.value) return
  
  const template = getTemplateById(selectedTemplateId.value)
  if (template) {
    // 清空当前内容并插入模板
    editorRef.value.clear()
    editorRef.value.dangerouslyInsertHtml(template.content)
    valueHtml.value = template.content
    emit('update:modelValue', template.content)
    
    templateDialogVisible.value = false
    ElMessage.success(`已应用「${template.name}」模板`)
  }
}

// 插入模板
const insertTemplate = (type: string) => {
  if (!editorRef.value) return
  
  let html = ''
  
  if (type === 'params') {
    // 插入参数表格模板
    html = `
<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <tbody>
    <tr style="background-color: #f5f7fa;">
      <td style="padding: 12px; border: 1px solid #e4e7ed; font-weight: bold; width: 30%;">商品名称</td>
      <td style="padding: 12px; border: 1px solid #e4e7ed;">请填写商品名称</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #e4e7ed; font-weight: bold;">商品规格</td>
      <td style="padding: 12px; border: 1px solid #e4e7ed;">请填写商品规格</td>
    </tr>
    <tr style="background-color: #f5f7fa;">
      <td style="padding: 12px; border: 1px solid #e4e7ed; font-weight: bold;">商品产地</td>
      <td style="padding: 12px; border: 1px solid #e4e7ed;">请填写商品产地</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #e4e7ed; font-weight: bold;">保质期</td>
      <td style="padding: 12px; border: 1px solid #e4e7ed;">请填写保质期</td>
    </tr>
  </tbody>
</table>
    `
  } else if (type === 'images') {
    // 打开图片上传对话框前，刷新认证头
    uploadHeaders.value = getUploadHeaders()
    batchImageDialogVisible.value = true
    return
  }
  
  if (html) {
    editorRef.value.dangerouslyInsertHtml(html)
    ElMessage.success('模板插入成功')
  }
}

// 设置选中图片的宽度
const setImageWidth = (width: number) => {
  if (!editorRef.value) return
  
  // 获取编辑器中所有选中的元素
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) {
    ElMessage.warning('请先选中要调整的图片')
    return
  }
  
  const range = selection.getRangeAt(0)
  const container = range.commonAncestorContainer
  
  // 查找图片元素
  let imgElement: HTMLImageElement | null = null
  
  if (container.nodeType === Node.ELEMENT_NODE) {
    const element = container as HTMLElement
    imgElement = element.querySelector('img')
  } else if (container.parentElement) {
    imgElement = container.parentElement.querySelector('img')
  }
  
  if (imgElement) {
    imgElement.style.width = width + 'px'
    imgElement.style.height = 'auto'
    imgElement.style.maxWidth = '100%'
    ElMessage.success(`图片宽度已设置为 ${width}px`)
  } else {
    ElMessage.warning('未找到选中的图片，请点击图片后再试')
  }
}

// 提交批量上传
const submitUpload = () => {
  if (!uploadRef.value) return
  
  // 在上传前刷新认证头
  uploadHeaders.value = getUploadHeaders()
  
  uploading.value = true
  uploadRef.value.submit()
}

// 上传成功回调
const handleUploadSuccess = (response: any) => {
  console.log('上传响应:', response)
  
  // el-upload的回调接收的是原始响应：{code: 200, data: { url: "..." }, message: null}
  if (response && response.code === 200 && response.data?.url && editorRef.value) {
    const imageUrl = response.data.url
    console.log('图片上传成功:', imageUrl)
    
    // 关闭弹窗
    batchImageDialogVisible.value = false
    
    // 插入图片到编辑器
    try {
      editorRef.value.focus()
      const imgHtml = `<p style="text-align: center;"><img src="${imageUrl}" style="width: 750px; max-width: 100%; height: auto;" /></p>`
      editorRef.value.dangerouslyInsertHtml(imgHtml)
      
      // 同步编辑器内容到v-model
      valueHtml.value = editorRef.value.getHtml()
      emit('update:modelValue', valueHtml.value)
      
      ElMessage.success('图片上传成功')
    } catch (error) {
      console.error('插入图片失败:', error)
      ElMessage.error('插入图片失败')
    }
    
    // 清空上传列表
    if (uploadRef.value) {
      uploadRef.value.clearFiles()
    }
  } else {
    console.error('上传失败，响应数据:', response)
    ElMessage.error('图片上传失败：' + (response?.message || '未知错误'))
  }
  
  uploading.value = false
}

// 上传失败回调
const handleUploadError = (error: any) => {
  console.error('上传失败:', error)
  ElMessage.error('图片上传失败: ' + (error.message || '网络错误'))
  uploading.value = false
}

// 超出限制回调
const handleExceed = () => {
  ElMessage.warning('只能上传一张图片，请先删除已选择的图片')
}

// 组件销毁前
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

// 暴露方法给父组件
defineExpose({
  getHtml: () => editorRef.value?.getHtml() || '',
  getText: () => editorRef.value?.getText() || '',
  clear: () => editorRef.value?.clear(),
  focus: () => editorRef.value?.focus()
})
</script>

<style lang="scss" scoped>
.rich-editor-wrapper {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;

  .editor-toolbar-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e8e8e8;
    background-color: #fafafa;
    flex-wrap: wrap;
    gap: 10px;
    padding: 5px 10px;

    .custom-toolbar {
      :deep(.el-button-group) {
        display: flex;
        
        .el-button {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 5px 10px;
          
          .el-icon {
            font-size: 14px;
          }
        }
      }
    }
  }
}

:deep(.w-e-text-container) {
  background-color: #fff;
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  table {
    border-collapse: collapse;
    margin: 10px 0;
    
    td, th {
      border: 1px solid #e4e7ed;
      padding: 8px 12px;
      min-width: 50px;
    }
    
    th {
      background-color: #f5f7fa;
      font-weight: bold;
    }
  }
}

// 上传组件样式
.upload-demo {
  :deep(.el-upload-dragger) {
    width: 100%;
    height: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  :deep(.el-icon--upload) {
    font-size: 67px;
    color: #c0c4cc;
    margin-bottom: 16px;
  }
}

// 模板选择样式
.template-selector {
  .template-card {
    cursor: pointer;
    transition: all 0.3s;
    margin-bottom: 20px;
    border: 2px solid transparent;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    &.selected {
      border-color: #409eff;
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
    
    .template-header {
      margin-bottom: 10px;
      
      h3 {
        margin: 10px 0 5px 0;
        font-size: 16px;
        color: #303133;
      }
    }
    
    .template-preview {
      font-size: 13px;
      color: #909399;
      line-height: 1.6;
      margin: 0;
    }
  }
}
</style>