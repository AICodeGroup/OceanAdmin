<template>
  <div class="app-container">
    <div class="page-header">
      <div class="header-left">
        <el-icon class="header-icon" :size="20">
          <TrophyBase />
        </el-icon>
        <h1 class="page-title">积分管理</h1>
      </div>
    </div>

    <el-card shadow="never">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        style="max-width: 600px; margin-top: 20px"
      >
        <el-form-item label="用户手机号" prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="请输入用户手机号"
            clearable
            @blur="handlePhoneBlur"
          >
            <template #suffix>
              <el-icon v-if="phoneChecking" class="is-loading">
                <Loading />
              </el-icon>
            </template>
          </el-input>
          <div v-if="phoneCheckMessage" :class="['phone-check-message', `is-${phoneCheckMessage.type}`]">
            {{ phoneCheckMessage.text }}
          </div>
        </el-form-item>

        <el-form-item label="操作类型" prop="operateType">
          <el-select v-model="form.operateType" placeholder="请选择操作类型" clearable>
            <el-option label="增加积分" value="add" />
            <el-option label="减少积分" value="sub" />
          </el-select>
        </el-form-item>

        <el-form-item label="积分" prop="integral">
            <el-input-number
            v-model="form.integral"
            placeholder="请输入积分"
            style="width: 100%"
          />
          <!-- <el-input-number
            v-model="form.integral"
            :min="1"
            :max="9999999"
            placeholder="请输入积分"
            style="width: 100%"
          /> -->
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Loading, TrophyBase } from '@element-plus/icons-vue'
import { judgeUser } from '@/api/newOrder' // 沿用订单模块的接口
import { operateUserIntegral } from '@/api/user' // 引入新的积分操作接口

const formRef = ref<FormInstance>()
const phoneChecking = ref(false)
const phoneCheckMessage = ref<{ text: string; type: 'error' | 'success' } | null>(null)

// 表单数据
const form = reactive({
  phone: '',
  uid: null as number | null,
  operateType: '' as 'add' | 'sub' | '',
  integral: undefined as number | undefined
})

// 表单验证规则
const rules: FormRules = {
  phone: [{ required: true, message: '请输入用户手机号', trigger: 'blur' }],
  operateType: [{ required: true, message: '请选择操作类型', trigger: 'change' }],
  integral: [
    { required: true, message: '积分不能为空', trigger: 'blur' },
    { type: 'number', min: 1, max: 999999, message: '积分范围为1~999999', trigger: 'blur' }
  ]
}

// 手机号失焦事件处理
const handlePhoneBlur = async () => {
  const phone = form.phone.trim()
  form.uid = null // 重置uid
  if (!phone) {
    phoneCheckMessage.value = null
    return
  }

  if (!/^1[3-9]\d{9}$/.test(phone)) {
    phoneCheckMessage.value = { text: '请输入正确的手机号', type: 'error' }
    return
  }

  try {
    phoneChecking.value = true
    phoneCheckMessage.value = null
    const res = await judgeUser(phone)
    console.log(res)
    if (res) {
      form.uid = res
      phoneCheckMessage.value = { text: `用户ID: ${res}，验证通过`, type: 'success' }
    } else {
      phoneCheckMessage.value = { text: '该手机号未注册，请确认后重试', type: 'error' }
    }
  } catch (error) {
    console.error('检查手机号失败:', error)
    phoneCheckMessage.value = { text: '检查手机号失败，请稍后重试', type: 'error' }
  } finally {
    phoneChecking.value = false
  }
}

// 提交表单
const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      if (!form.uid) {
        ElMessage.error('请先输入有效的用户手机号并验证通过')
        return
      }
      try {
        await operateUserIntegral({
          uid: form.uid,
          operateType: form.operateType as 'add' | 'sub',
          integral: form.integral as number
        })
        ElMessage.success('积分操作成功')
        resetForm()
      } catch (error) {
        console.error('积分操作失败:', error)
        ElMessage.error('积分操作失败，请稍后重试')
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
  form.phone = ''
  form.uid = null
  form.operateType = ''
  form.integral = undefined
  phoneCheckMessage.value = null
}
</script>

<style lang="scss" scoped>
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
}

.phone-check-message {
  font-size: 12px;
  line-height: 1.5;
  margin-top: 4px;

  &.is-error {
    color: var(--el-color-error);
  }

  &.is-success {
    color: var(--el-color-success);
  }
}
</style>