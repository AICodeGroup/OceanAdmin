<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑用户' : '新增用户'"
    width="700px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入用户昵称" maxlength="50" />
      </el-form-item>

      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="form.realName" placeholder="请输入真实姓名" maxlength="50" />
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" maxlength="11" />
      </el-form-item>

      <el-form-item label="生日" prop="birthday">
        <el-date-picker
          v-model="form.birthday"
          type="date"
          placeholder="选择生日"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio :label="0">未知</el-radio>
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>

<!--      <el-form-item label="用户标签" prop="tagId">-->
<!--        <el-select-->
<!--          v-model="tagIds"-->
<!--          multiple-->
<!--          placeholder="请选择用户标签"-->
<!--          style="width: 100%"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="tag in tagList"-->
<!--            :key="tag.id"-->
<!--            :label="tag.name"-->
<!--            :value="tag.id"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->

      <el-form-item label="备注" prop="mark">
        <el-input
          v-model="form.mark"
          type="textarea"
          :rows="4"
          placeholder="请输入备注信息"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { updateUserInfo } from '@/api/user'

interface Props {
  modelValue: boolean
  userInfo?: any
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  userInfo: null
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => !!props.userInfo)

const formRef = ref<FormInstance>()
const loading = ref(false)
const tagIds = ref<number[]>([])
const tagList = ref<any[]>([
  { id: 1, name: 'VIP用户' },
  { id: 2, name: '活跃用户' },
  { id: 3, name: '优质用户' }
])

const form = reactive({
  id: 0,
  nickname: '',
  realName: '',
  phone: '',
  birthday: '',
  sex: 0,
  tagId: '',
  mark: ''
})

const rules = reactive<FormRules>({
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { max: 50, message: '昵称长度不能超过50个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
})

// 监听对话框打开，初始化表单
watch(() => props.modelValue, (val) => {
  if (val) {
    if (props.userInfo) {
      // 编辑模式，填充数据
      Object.assign(form, {
        id: props.userInfo.id,
        nickname: props.userInfo.nickname || '',
        realName: props.userInfo.realName || '',
        phone: props.userInfo.phone || '',
        birthday: props.userInfo.birthday || '',
        sex: props.userInfo.sex || 0,
        mark: props.userInfo.mark || ''
      })
      
      // 解析标签ID
      if (props.userInfo.tagId) {
        tagIds.value = props.userInfo.tagId.split(',').map((id: string) => parseInt(id))
      }
    } else {
      // 新增模式，重置表单
      Object.assign(form, {
        id: 0,
        nickname: '',
        realName: '',
        phone: '',
        birthday: '',
        sex: 0,
        tagId: '',
        mark: ''
      })
      tagIds.value = []
    }
    formRef.value?.clearValidate()
  }
})

// 监听标签选择变化
watch(tagIds, (val) => {
  form.tagId = val.join(',')
})

const handleClose = () => {
  dialogVisible.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      // 只提交有值的字段
      const submitData: any = {
        id: form.id
      }
      
      // 只添加有值的字段
      if (form.nickname) submitData.nickname = form.nickname
      if (form.realName) submitData.realName = form.realName
      if (form.phone) submitData.phone = form.phone
      if (form.birthday) submitData.birthday = form.birthday
      if (form.sex !== undefined) submitData.sex = form.sex
      if (form.tagId) submitData.tagId = form.tagId
      if (form.mark) submitData.mark = form.mark
      submitData.status = 1
      await updateUserInfo(submitData)
      ElMessage.success(isEdit.value ? '修改成功' : '新增成功')
      emit('success')
      handleClose()
    } catch (error) {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped lang="scss">
// 样式
</style>
