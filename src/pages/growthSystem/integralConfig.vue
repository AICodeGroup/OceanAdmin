<template>
  <div class="app-container">
    <div class="page-header">
      <h1>积分配置</h1>
    </div>

    <el-card v-loading="loading">
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="180px">
        <!-- 积分/经验任务配置模块 -->
        <el-divider content-position="left">积分/经验任务配置</el-divider>
        
        <div class="task-config-section">
          <!-- 物种观察配置 -->
          <div class="config-group">
            <div class="config-group-title">物种观察</div>
            <el-table :data="speciesConfigList" border style="width: 100%" size="small">
              <el-table-column prop="label" label="物种等级" width="150" />
              <el-table-column label="积分" width="180">
                <template #default="{ row }">
                  <el-input-number 
                    v-model="taskConfigData[row.integralKey]" 
                    :min="0" 
                    :precision="0"
                    controls-position="right"
                    size="small"
                    style="width: 100%"
                  />
                </template>
              </el-table-column>
              <el-table-column label="经验" width="180">
                <template #default="{ row }">
                  <el-input-number 
                    v-model="taskConfigData[row.experienceKey]" 
                    :min="0" 
                    :precision="0"
                    controls-position="right"
                    size="small"
                    style="width: 100%"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="desc" label="说明" />
            </el-table>
          </div>

          <!-- 营期参与配置 -->
          <div class="config-group">
            <div class="config-group-title">营期参与</div>
            <el-table :data="campConfigList" border style="width: 100%" size="small">
              <el-table-column prop="label" label="营期类型" width="150" />
              <el-table-column label="积分" width="180">
                <template #default="{ row }">
                  <el-input-number 
                    v-model="taskConfigData[row.integralKey]" 
                    :min="0" 
                    :precision="0"
                    controls-position="right"
                    size="small"
                    style="width: 100%"
                  />
                </template>
              </el-table-column>
              <el-table-column label="经验" width="180">
                <template #default="{ row }">
                  <el-input-number 
                    v-model="taskConfigData[row.experienceKey]" 
                    :min="0" 
                    :precision="0"
                    controls-position="right"
                    size="small"
                    style="width: 100%"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="desc" label="说明" />
            </el-table>
          </div>

          <!-- 观察记录配置 -->
          <div class="config-group">
            <div class="config-group-title">观察记录</div>
            <el-table :data="observationConfigList" border style="width: 100%" size="small">
              <el-table-column prop="label" label="行为类型" width="150" />
              <el-table-column label="积分" width="180">
                <template #default="{ row }">
                  <el-input-number 
                    v-model="taskConfigData[row.integralKey]" 
                    :min="0" 
                    :precision="0"
                    controls-position="right"
                    size="small"
                    style="width: 100%"
                  />
                </template>
              </el-table-column>
              <el-table-column label="经验" width="180">
                <template #default="{ row }">
                  <el-input-number 
                    v-model="taskConfigData[row.experienceKey]" 
                    :min="0" 
                    :precision="0"
                    controls-position="right"
                    size="small"
                    style="width: 100%"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="desc" label="说明" />
            </el-table>
          </div>

          <el-form-item style="margin-top: 20px;">
            <el-button type="primary" @click="handleTaskConfigSubmit">保存积分/经验任务配置</el-button>
            <el-button @click="loadTaskConfig">重置</el-button>
          </el-form-item>
        </div>

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
            :min="0" 
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
            <el-option label="订单完成后" value="complete" />
          </el-select>
          <span class="form-tip">积分从哪个节点开始计算冻结时间</span>
        </el-form-item>

        <el-divider content-position="left">定时任务设置</el-divider>

        <el-form-item label="积分发放任务">
          <el-switch v-model="taskConfigForm.enabled" active-text="开启" inactive-text="关闭" />
          <span class="form-tip">开启后，系统将定时扫描并发放满足条件的积分</span>
        </el-form-item>

        <el-form-item label="执行频率">
          <el-select v-model="taskConfigForm.cronType" placeholder="请选择" @change="handleCronTypeChange" style="width: 300px">
            <el-option label="每小时" value="0 0 0/1 * * ?" />
            <el-option label="每天凌晨2点" value="0 0 2 * * ?" />
            <el-option label="每30分钟" value="0 0/30 * * * ?" />
            <el-option label="自定义" value="custom" />
          </el-select>
        </el-form-item>

        <el-form-item label="Cron表达式" v-if="taskConfigForm.cronType === 'custom'">
          <el-input v-model="taskConfigForm.cronExpression" placeholder="请输入Cron表达式" style="width: 300px" />
          <span class="form-tip">例如: 0 0 12 * * ? (每天中午12点)</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleCronTaskSubmit">保存定时任务配置</el-button>
        </el-form-item>

        <el-divider />

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存基础配置</el-button>
          <el-button @click="loadConfig">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getIntegralConfig, setIntegralConfig, configIntegralGrantTask, getIntegralTaskConfig, setIntegralTaskConfig } from '@/api/growthSystem'
import type { IntegralTaskConfig } from '@/api/growthSystem'

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

const taskConfigForm = reactive({
  enabled: true,
  cronType: '0 0 0/1 * * ?',
  cronExpression: '0 0 0/1 * * ?'
})

// 积分/经验任务配置数据
const taskConfigData = reactive<IntegralTaskConfig>({
  // 积分配置
  speciesLcIntegral: 2,
  speciesNtIntegral: 3,
  speciesVuIntegral: 5,
  speciesEnIntegral: 10,
  speciesCrIntegral: 20,
  campDomesticHalfIntegral: 10,
  campDomesticFullIntegral: 20,
  campAbroadHalfIntegral: 15,
  campAbroadFullIntegral: 30,
  observationIntegral: 10,
  // 经验配置
  speciesLcExperience: 2,
  speciesNtExperience: 3,
  speciesVuExperience: 5,
  speciesEnExperience: 10,
  speciesCrExperience: 20,
  campDomesticHalfExperience: 10,
  campDomesticFullExperience: 20,
  campAbroadHalfExperience: 15,
  campAbroadFullExperience: 30,
  observationExperience: 10
})

const taskConfigLoading = ref(false)

// 表格配置数据
const speciesConfigList = [
  { label: '无危物种(LC)', integralKey: 'speciesLcIntegral', experienceKey: 'speciesLcExperience', desc: '激励用户观察常见物种' },
  { label: '近危物种(NT)', integralKey: 'speciesNtIntegral', experienceKey: 'speciesNtExperience', desc: '近危物种奖励稍高' },
  { label: '易危物种(VU)', integralKey: 'speciesVuIntegral', experienceKey: 'speciesVuExperience', desc: '易危物种奖励适中' },
  { label: '濒危物种(EN)', integralKey: 'speciesEnIntegral', experienceKey: 'speciesEnExperience', desc: '濒危物种奖励较高' },
  { label: '极危物种(CR)', integralKey: 'speciesCrIntegral', experienceKey: 'speciesCrExperience', desc: '极危物种奖励最高' }
]

const campConfigList = [
  { label: '国内营期半天', integralKey: 'campDomesticHalfIntegral', experienceKey: 'campDomesticHalfExperience', desc: '国内半天营期奖励' },
  { label: '国内营期一天', integralKey: 'campDomesticFullIntegral', experienceKey: 'campDomesticFullExperience', desc: '国内一天营期奖励' },
  { label: '国外营期半天', integralKey: 'campAbroadHalfIntegral', experienceKey: 'campAbroadHalfExperience', desc: '国外半天营期奖励' },
  { label: '国外营期一天', integralKey: 'campAbroadFullIntegral', experienceKey: 'campAbroadFullExperience', desc: '国外一天营期奖励' }
]

const observationConfigList = [
  { label: '观察记录', integralKey: 'observationIntegral', experienceKey: 'observationExperience', desc: '每次提交观察记录可获得' }
]

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

const handleCronTypeChange = (val: string) => {
  if (val !== 'custom') {
    taskConfigForm.cronExpression = val
  }
}

// 加载积分/经验任务配置
const loadTaskConfig = async () => {
  taskConfigLoading.value = true
  try {
    const data = await getIntegralTaskConfig()
    if (data) {
      // 积分配置
      taskConfigData.speciesLcIntegral = data.speciesLcIntegral ?? 2
      taskConfigData.speciesNtIntegral = data.speciesNtIntegral ?? 3
      taskConfigData.speciesVuIntegral = data.speciesVuIntegral ?? 5
      taskConfigData.speciesEnIntegral = data.speciesEnIntegral ?? 10
      taskConfigData.speciesCrIntegral = data.speciesCrIntegral ?? 20
      taskConfigData.campDomesticHalfIntegral = data.campDomesticHalfIntegral ?? 10
      taskConfigData.campDomesticFullIntegral = data.campDomesticFullIntegral ?? 20
      taskConfigData.campAbroadHalfIntegral = data.campAbroadHalfIntegral ?? 15
      taskConfigData.campAbroadFullIntegral = data.campAbroadFullIntegral ?? 30
      taskConfigData.observationIntegral = data.observationIntegral ?? 10
      // 经验配置
      taskConfigData.speciesLcExperience = data.speciesLcExperience ?? 2
      taskConfigData.speciesNtExperience = data.speciesNtExperience ?? 3
      taskConfigData.speciesVuExperience = data.speciesVuExperience ?? 5
      taskConfigData.speciesEnExperience = data.speciesEnExperience ?? 10
      taskConfigData.speciesCrExperience = data.speciesCrExperience ?? 20
      taskConfigData.campDomesticHalfExperience = data.campDomesticHalfExperience ?? 10
      taskConfigData.campDomesticFullExperience = data.campDomesticFullExperience ?? 20
      taskConfigData.campAbroadHalfExperience = data.campAbroadHalfExperience ?? 15
      taskConfigData.campAbroadFullExperience = data.campAbroadFullExperience ?? 30
      taskConfigData.observationExperience = data.observationExperience ?? 10
    }
  } catch (error) {
    console.error('加载积分/经验任务配置失败:', error)
  } finally {
    taskConfigLoading.value = false
  }
}

// 保存积分/经验任务配置
const handleTaskConfigSubmit = async () => {
  taskConfigLoading.value = true
  try {
    await setIntegralTaskConfig(taskConfigData)
    ElMessage.success('积分/经验任务配置保存成功')
    loadTaskConfig()
  } catch (error) {
    console.error('积分/经验任务配置保存失败:', error)
    ElMessage.error('积分/经验任务配置保存失败')
  } finally {
    taskConfigLoading.value = false
  }
}

// 保存定时任务配置
const handleCronTaskSubmit = async () => {
  loading.value = true
  try {
    await configIntegralGrantTask({
      status: taskConfigForm.enabled ? 0 : 1,
      cronExpression: taskConfigForm.cronExpression
    })
    ElMessage.success('定时任务配置保存成功')
  } catch (error) {
    console.error('定时任务配置保存失败:', error)
    ElMessage.error('定时任务配置保存失败')
  } finally {
    loading.value = false
  }
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
      
      // 加载任务配置
      if (data.orderIntegralGrantCron) {
        taskConfigForm.enabled = data.orderIntegralGrantStatus === 0
        taskConfigForm.cronExpression = data.orderIntegralGrantCron
        const presets = ['0 0 0/1 * * ?', '0 0 2 * * ?', '0 0/30 * * * ?']
        if (presets.includes(data.orderIntegralGrantCron)) {
          taskConfigForm.cronType = data.orderIntegralGrantCron
        } else {
          taskConfigForm.cronType = 'custom'
        }
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
  loadTaskConfig()
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

.task-config-section {
  margin-bottom: 20px;
}

.config-group {
  background-color: #fafafa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;

  .config-group-title {
    font-size: 14px;
    font-weight: 600;
    color: #606266;
    margin-bottom: 16px;
    padding-left: 10px;
    border-left: 3px solid #409eff;
  }

  :deep(.el-table) {
    .el-input-number {
      width: 100%;
    }
  }
}
</style>
