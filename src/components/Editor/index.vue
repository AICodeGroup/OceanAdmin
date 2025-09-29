<template>
	<div class="rich-text-editor-container">
	  <QuillEditor
		ref="quillEditorRef"
		v-model:content="content"
		theme="snow"
		:options="editorOptions"
		content-type="html"
		@update:content="onContentChange"
	  />
	</div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { QuillEditor } from '@vueup/vue-quill';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
  import axios from 'axios'; // 引入请求库
  import { ElLoading, ElMessage } from 'element-plus';

  // --- v-model 协议 ---
  const props = defineProps({
	modelValue: {
	  type: String,
	  default: ''
	}
  });
  const emit = defineEmits(['update:modelValue']);
  
  const quillEditorRef = ref(null);
  const content = ref('');
  
  watch(() => props.modelValue, (newVal) => {
	if (newVal !== content.value) {
	  content.value = newVal;
	}
  }, { immediate: true });
  
  const onContentChange = () => {
	emit('update:modelValue', content.value);
  };
  
  // --- 编辑器配置 ---
  const editorOptions = {
	modules: {
	  toolbar: {
		container: [
		  ['bold', 'italic', 'underline'],
		  [{ 'header': 1 }, { 'header': 2 }],
		  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
		  ['link', 'image']
		],
		handlers: {
		  'image': customImageHandler // 关键：绑定自定义处理函数
		}
	  }
	},
	placeholder: '请填写内容...输入内容与客户端展示内容、格式均一致，不需要以JSON格式写入'
  };
  
  // --- V2: 直接上传的图片处理函数 ---
  function customImageHandler() {
	const fileInput = document.createElement('input');
	fileInput.setAttribute('type', 'file');
	fileInput.setAttribute('accept', 'image/*');
	
	fileInput.addEventListener('change', async () => {
	  if (!fileInput.files || !fileInput.files[0]) return;
	  
	  const file = fileInput.files[0];
	  const formData = new FormData();
	  formData.append('file', file);
  
	  // **步骤1：显示加载提示**
	  console.log("图片上传中，请稍候...");
	  // 2. 调用 ElLoading.service 并保存返回的实例
    const loadingInstance = ElLoading.service({ 
        lock: true,
        text: '图片上传中...',
        background: 'rgba(0, 0, 0, 0.7)',
    });
  
	  try {
		// **步骤2：直接上传图片到后端**
		// 替换为您的后端上传API地址
		const response = await axios.post('https://beniocean.com/api/admin/platform/uploadOss', formData, {
		  headers: {
			'Content-Type': 'multipart/form-data'
		  }
		});
		
		// **步骤3：获取后端返回的永久URL**
		const permanentUrl = response.data.data; // 确保后端返回格式为 { data: '...' }
		if (!permanentUrl) {
			throw new Error('后端未返回有效的图片URL');
		}
		// **步骤4：将永久URL直接插入编辑器**
		const quill = quillEditorRef.value.getQuill();
		const range = quill.getSelection(true);
		quill.insertEmbed(range.index, 'image', permanentUrl);
		quill.setSelection(range.index + 1);
  
	  } catch (error) {
		console.error('图片上传失败:', error);
      // 使用 ElMessage (同样需要导入) 给出错误提示
      ElMessage.error('图片上传失败，请重试');
	  } finally {
		// 3. 在 finally 块中，使用实例的 close() 方法关闭加载提示
		loadingInstance.close();
		console.log("上传流程结束。");
	  }
	});
	
	fileInput.click();
  }
  </script>
  
  <style lang="scss">
  /* 注意：这里的样式不能加 scoped */
  .rich-text-editor-container {
	width: 100%;
	.ql-editor img {
    /* 固定宽度为 500px，如果编辑器宽度小于500px，图片可能会溢出 */
    max-width: 180px;
    height: auto; /* 高度依然自适应 */
  }
	.ql-container {
	  min-height: 130px;
	  width: 100%;
	}
  }
  </style>