<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="500px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="操作类型" prop="operateType">
        <el-radio-group v-model="form.operateType">
          <el-radio label="add">增加</el-radio>
          <el-radio label="sub">减少</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="operateLabel" prop="value">
        <el-input-number
          v-model="form.value"
          :min="1"
          :max="999999"
          :precision="operateType === 'balance' ? 2 : 0"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item v-if="operateType !== 'integral'" label="备注" prop="mark">
        <el-input
          v-model="form.mark"
          type="textarea"
          :rows="3"
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
import { operateUserIntegral, operateUserExperience, operateUserBalance } from '@/api/user'

interface Props {
  modelValue: boolean
  userId: number
  operateType: 'integral' | 'experience' | 'balance'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  userId: 0,
  operateType: 'integral'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const dialogTitle = computed(() => {
  const typeMap = {
    integral: '积分',
    experience: '经验',
    balance: '余额'
  }
  return `操作用户${typeMap[props.operateType]}`
})

const operateLabel = computed(() => {
  const labelMap = {
    integral: '积分数量',
    experience: '经验数量',
    balance: '金额'
  }
  return labelMap[props.operateType]
})

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  operateType: 'add' as 'add' | 'sub',
  value: 0,
  mark: ''
})

const rules = reactive<FormRules>({
  operateType: [
    { required: true, message: '请选择操作类型', trigger: 'change' }
  ],
  value: [
    { required: true, message: '请输入数值', trigger: 'blur' },
    { type: 'number', min: 1, max: 999999, message: '数值范围: 1-999999', trigger: 'blur' }
  ]
})

// 重置表单
watch(dialogVisible, (val) => {
  if (val) {
    form.operateType = 'add'
    form.value = 0
    form.mark = ''
    formRef.value?.clearValidate()
  }
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
      const params = {
        userId: props.userId,
        operateType: form.operateType
      }

      if (props.operateType === 'integral') {
        await operateUserIntegral({
          ...params,
          integral: form.value
        })
      } else if (props.operateType === 'experience') {
        await operateUserExperience({
          ...params,
          experience: form.value,
          mark: form.mark
        })
      } else {
        await operateUserBalance({
          ...params,
          money: form.value
        })
      }

      ElMessage.success('操作成功')
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
.el-input-number {
  width: 100%;
}
</style>
