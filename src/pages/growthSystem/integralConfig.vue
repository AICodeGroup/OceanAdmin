<template>
  <div class="app-container">
    <div class="page-header">
      <h1>积分配置</h1>
    </div>

    <el-card v-loading="loading">
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="180px">
        <el-divider content-position="left">积分抵扣设置</el-divider>
        
        <el-form-item label="积分抵扣开关" prop="integralDeductionSwitch">
          <el-switch v-model="formData.integralDeductionSwitch" />
          <span class="form-tip">开启后，用户可在下单时使用积分抵扣</span>
        </el-form-item>

        <el-form-item label="抵扣开启金额" prop="integralDeductionStartMoney">
          <el-input-number 
            v-model="formData.integralDeductionStartMoney" 
            :min="0" 
            :precision="0"
          />
          <span class="form-tip">元，订单满多少元可使用积分抵扣</span>
        </el-form-item>

        <el-form-item label="积分抵扣金额" prop="integralDeductionMoney">
          <el-input-number 
            v-model="formData.integralDeductionMoney" 
            :min="0.01" 
            :precision="2"
            :step="0.01"
          />
          <span class="form-tip">元，1积分可抵扣多少元（如：0.01表示100积分抵1元）</span>
        </el-form-item>

        <el-form-item label="积分抵扣比例" prop="integralDeductionRatio">
          <el-input-number 
            v-model="formData.integralDeductionRatio" 
            :min="0" 
            :max="100"
            :precision="0"
          />
          <span class="form-tip">%，订单中积分可抵扣商品金额的百分比</span>
        </el-form-item>

        <el-divider content-position="left">积分获取设置</el-divider>

        <el-form-item label="下单赠送积分比例" prop="orderGiveIntegral">
          <el-input-number 
            v-model="formData.orderGiveIntegral" 
            :min="0" 
            :precision="0"
          />
          <span class="form-tip">元，实际支付多少元赠送1积分（如：100表示消费100元得1积分）</span>
        </el-form-item>

        <el-form-item label="积分冻结天数" prop="freezeIntegralDay">
          <el-input-number 
            v-model="formData.freezeIntegralDay" 
            :min="0" 
            :precision="0"
          />
          <span class="form-tip">天，0表示不冻结，立即到账</span>
        </el-form-item>

        <el-form-item label="积分冻结节点" prop="integralFreezeNode">
          <el-select v-model="formData.integralFreezeNode">
            <el-option label="订单支付后" value="pay" />
            <el-option label="订单收货后" value="receipt" />
            <el-option label="订单完成后" value="complete" />
          </el-select>
          <span class="form-tip">积分从哪个节点开始计算冻结时间</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存配置</el-button>
          <el-button @click="loadConfig">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getIntegralConfig, setIntegralConfig } from '@/api/growthSystem'

const loading = ref(false)
const formRef = ref()

const formData = ref({
  integralDeductionSwitch: true,
  integralDeductionStartMoney: 100,
  integralDeductionMoney: 0.01,
  integralDeductionRatio: 50,
  orderGiveIntegral: 100,
  freezeIntegralDay: 7,
  integralFreezeNode: 'pay'
})

const rules = {
  integralDeductionStartMoney: [
    { required: true, message: '请输入抵扣开启金额', trigger: 'blur' }
  ],
  integralDeductionMoney: [
    { required: true, message: '请输入积分抵扣金额', trigger: 'blur' }
  ],
  integralDeductionRatio: [
    { required: true, message: '请输入积分抵扣比例', trigger: 'blur' }
  ],
  orderGiveIntegral: [
    { required: true, message: '请输入下单赠送积分比例', trigger: 'blur' }
  ],
  freezeIntegralDay: [
    { required: true, message: '请输入积分冻结天数', trigger: 'blur' }
  ],
  integralFreezeNode: [
    { required: true, message: '请选择积分冻结节点', trigger: 'change' }
  ]
}

// 加载配置
const loadConfig = async () => {
  loading.value = true
  try {
    const data = await getIntegralConfig()
    if (data) {
      formData.value = {
        integralDeductionSwitch: data.integralDeductionSwitch,
        integralDeductionStartMoney: data.integralDeductionStartMoney,
        integralDeductionMoney: data.integralDeductionMoney,
        integralDeductionRatio: data.integralDeductionRatio,
        orderGiveIntegral: data.orderGiveIntegral,
        freezeIntegralDay: data.freezeIntegralDay,
        integralFreezeNode: data.integralFreezeNode
      }
    }
  } catch (error) {
    console.error('加载配置失败:', error)
  } finally {
    loading.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    loading.value = true
    try {
      await setIntegralConfig(formData.value)
      ElMessage.success('保存成功')
      loadConfig()
    } catch (error) {
      console.error('保存失败:', error)
      ElMessage.error('保存失败')
    } finally {
      loading.value = false
    }
  })
}

onMounted(() => {
  loadConfig()
})
</script>

<style scoped lang="scss">
.app-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin: 0;
  }
}

.form-tip {
  margin-left: 10px;
  font-size: 12px;
  color: #909399;
}

:deep(.el-divider__text) {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}
</style>
