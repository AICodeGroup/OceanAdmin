<template>
  <el-dialog
    v-model="dialogVisible"
    title="赠送付费会员"
    width="500px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="用户信息">
        <div class="user-info">
          <el-avatar :src="userInfo.avatar" :size="40" />
          <div class="user-detail">
            <div class="nickname">{{ userInfo.nickname }}</div>
            <div class="user-id">ID: {{ userInfo.id }}</div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="会员卡" prop="cardId">
        <div style="display: flex; gap: 8px;">
          <el-select 
            v-model="form.cardId" 
            placeholder="请选择会员卡" 
            style="flex: 1;"
            :loading="cardListLoading"
          >
            <el-option
              v-for="card in cardList"
              :key="card.id"
              :label="`${card.name}${card.label ? ' [' + card.label + ']' : ''} - ${card.deadlineDay}天 - ¥${card.price}`"
              :value="card.id"
            />
          </el-select>
          <el-button @click="handleConfigCard">配置</el-button>
        </div>
      </el-form-item>

      <el-alert
        v-if="selectedCard"
        :title="`将为用户赠送 ${selectedCard.name}（${selectedCard.deadlineDay}天有效期）${parseFloat(selectedCard.giftBalance) > 0 ? '，并赠送余额 ¥' + selectedCard.giftBalance : ''}`"
        type="info"
        :closable="false"
        show-icon
      />
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        确定赠送
      </el-button>
    </template>
  </el-dialog>

  <!-- 会员卡列表管理对话框 -->
  <MemberCardListDialog 
    v-model="cardListDialogVisible" 
    @success="handleCardConfigSuccess" 
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { giftPaidMember, getPaidMemberCardList } from '@/api/user'
import MemberCardListDialog from '@/components/memberCard/MemberCardListDialog.vue'

interface Props {
  modelValue: boolean
  userInfo: any
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  userInfo: () => ({})
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formRef = ref<FormInstance>()
const loading = ref(false)
const cardListLoading = ref(false)
const cardList = ref<any[]>([])
const cardListDialogVisible = ref(false)

const form = reactive({
  cardId: undefined as number | undefined
})

const rules = reactive<FormRules>({
  cardId: [
    { required: true, message: '请选择会员卡', trigger: 'change' }
  ]
})

// 获取当前选中的会员卡信息
const selectedCard = computed(() => {
  if (!form.cardId) return null
  return cardList.value.find(card => card.id === form.cardId)
})

// 监听对话框打开，加载会员卡列表
watch(() => props.modelValue, (val) => {
  if (val) {
    loadCardList()
  }
})

// 加载会员卡列表
const loadCardList = async () => {
  cardListLoading.value = true
  try {
    const data = await getPaidMemberCardList()
    cardList.value = data || []
  } catch (error) {
    console.error('获取会员卡列表失败:', error)
    ElMessage.error('获取会员卡列表失败')
  } finally {
    cardListLoading.value = false
  }
}

const handleClose = () => {
  dialogVisible.value = false
  form.cardId = undefined
  formRef.value?.resetFields()
}

// 打开会员卡列表管理对话框
const handleConfigCard = () => {
  cardListDialogVisible.value = true
}

// 会员卡配置成功后重新加载列表
const handleCardConfigSuccess = () => {
  loadCardList()
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      await giftPaidMember({
        ids: props.userInfo.id,
        cardId: form.cardId!
      })
      ElMessage.success('赠送成功')
      emit('success')
      handleClose()
    } catch (error) {
      console.error('赠送失败:', error)
      ElMessage.error('赠送失败')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;

  .user-detail {
    .nickname {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
      margin-bottom: 4px;
    }

    .user-id {
      font-size: 12px;
      color: #909399;
    }
  }
}

.tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

:deep(.el-alert) {
  margin-top: 8px;
}
</style>
