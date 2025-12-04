<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑会员卡' : '新增会员卡'"
    width="700px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="会员卡名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入会员卡名称" maxlength="10" show-word-limit />
      </el-form-item>

      <el-form-item label="卡片标签" prop="label">
        <el-input v-model="form.label" placeholder="请输入卡片标签" maxlength="10" show-word-limit />
      </el-form-item>

      <el-form-item label="会员卡类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="0">试用</el-radio>
          <el-radio :label="1">期限</el-radio>
          <el-radio :label="2">永久</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="form.type !== 2" label="期限天数" prop="deadlineDay">
        <el-input-number
          v-model="form.deadlineDay"
          :min="1"
          :max="3650"
          :step="1"
          style="width: 100%"
        />
        <div class="tip">建议：30天、90天、180天、365天</div>
      </el-form-item>

      <el-form-item label="会员卡原价" prop="originalPrice">
        <el-input-number
          v-model="form.originalPrice"
          :min="0.01"
          :max="99999.99"
          :precision="2"
          :step="1"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="会员卡售价" prop="price">
        <el-input-number
          v-model="form.price"
          :min="0.01"
          :max="99999.99"
          :precision="2"
          :step="1"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="仅首充赠送" prop="isFirstChargeGive">
        <el-switch v-model="form.isFirstChargeGive" />
        <div class="tip">开启后，仅首次充值用户可购买</div>
      </el-form-item>

      <el-form-item label="赠送余额" prop="giftBalance">
        <el-input-number
          v-model="form.giftBalance"
          :min="0"
          :max="999.99"
          :precision="2"
          :step="1"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model="form.sort"
          :min="0"
          :max="9999"
          :step="1"
          style="width: 100%"
        />
        <div class="tip">数值越小，排序越靠前</div>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-switch v-model="form.status" active-text="开启" inactive-text="关闭" />
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
import { addMemberCard, editMemberCard } from '@/api/memberCard'

interface Props {
  modelValue: boolean
  cardInfo?: any
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  cardInfo: null
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => !!props.cardInfo)

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  id: undefined as number | undefined,
  name: '',
  label: '',
  type: 1,
  deadlineDay: 30,
  originalPrice: 0.01,
  price: 0.01,
  isFirstChargeGive: false,
  giftBalance: 0,
  sort: 999,
  status: true
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入会员卡名称', trigger: 'blur' },
    { max: 10, message: '会员卡名称不能超过10个字符', trigger: 'blur' }
  ],
  label: [
    { max: 10, message: '卡片标签不能超过10个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择会员卡类型', trigger: 'change' }
  ],
  deadlineDay: [
    { required: true, message: '请输入期限天数', trigger: 'blur' }
  ],
  originalPrice: [
    { required: true, message: '请输入会员卡原价', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入会员卡售价', trigger: 'blur' }
  ],
  isFirstChargeGive: [
    { required: true, message: '请选择是否仅首充赠送', trigger: 'change' }
  ],
  giftBalance: [
    { required: true, message: '请输入赠送余额', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
})

// 监听对话框打开，初始化表单
watch(() => props.modelValue, (val) => {
  if (val) {
    if (props.cardInfo) {
      // 编辑模式，填充数据
      Object.assign(form, {
        id: props.cardInfo.id,
        name: props.cardInfo.name || '',
        label: props.cardInfo.label || '',
        type: props.cardInfo.type ?? 1,
        deadlineDay: props.cardInfo.deadlineDay || 30,
        originalPrice: props.cardInfo.originalPrice || 0.01,
        price: props.cardInfo.price || 0.01,
        isFirstChargeGive: props.cardInfo.isFirstChargeGive ?? false,
        giftBalance: props.cardInfo.giftBalance || 0,
        sort: props.cardInfo.sort ?? 999,
        status: props.cardInfo.status ?? true
      })
    } else {
      // 新增模式，重置表单
      Object.assign(form, {
        id: undefined,
        name: '',
        label: '',
        type: 1,
        deadlineDay: 30,
        originalPrice: 0.01,
        price: 0.01,
        isFirstChargeGive: false,
        giftBalance: 0,
        sort: 999,
        status: true
      })
    }
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
      // 构建提交数据
      const submitData: any = {
        name: form.name,
        type: form.type,
        originalPrice: form.originalPrice,
        price: form.price,
        isFirstChargeGive: form.isFirstChargeGive,
        giftBalance: form.giftBalance,
        sort: form.sort,
        status: form.status
      }

      // 可选字段
      if (form.label) submitData.label = form.label
      if (form.type !== 2 && form.deadlineDay) submitData.deadlineDay = form.deadlineDay

      // 根据是否有ID调用不同的API
      if (form.id) {
        // 编辑模式
        submitData.id = form.id
        await editMemberCard(submitData)
      } else {
        // 新增模式
        await addMemberCard(submitData)
      }

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
.tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
