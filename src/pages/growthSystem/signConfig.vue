<template>
  <div class="app-container">
    <div class="page-header">
      <h1>签到配置</h1>
    </div>

    <!-- 基础签到配置 -->
    <el-card class="config-card" v-loading="loading">
      <div class="card-header">
        <h3>基础签到配置</h3>
      </div>
      <el-form :model="baseConfig" :rules="baseRules" ref="baseFormRef" label-width="150px">
        <el-form-item label="签到规则说明" prop="signRuleDescription">
          <el-input 
            v-model="baseConfig.signRuleDescription" 
            type="textarea" 
            :rows="3" 
            placeholder="向用户展示的签到规则说明..."
          />
        </el-form-item>

        <el-form-item label="奖励积分" prop="isIntegral">
          <el-switch v-model="baseConfig.isIntegral" />
          <el-input-number 
            v-if="baseConfig.isIntegral"
            v-model="baseConfig.integral" 
            :min="0" 
            :precision="0" 
            style="margin-left: 10px"
          />
          <span class="form-tip" v-if="baseConfig.isIntegral">每日签到获得的积分</span>
        </el-form-item>

        <el-form-item label="奖励经验" prop="isExperience">
          <el-switch v-model="baseConfig.isExperience" />
          <el-input-number 
            v-if="baseConfig.isExperience"
            v-model="baseConfig.experience" 
            :min="0" 
            :precision="0" 
            style="margin-left: 10px"
          />
          <span class="form-tip" v-if="baseConfig.isExperience">每日签到获得的经验</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSaveBase">保存基础配置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 连续签到配置 -->
    <el-card class="config-card">
      <div class="card-header">
        <h3>连续签到奖励配置</h3>
        <el-button type="primary" @click="handleAddAward">
          <el-icon><Plus /></el-icon>
          新增奖励
        </el-button>
      </div>

      <el-table :data="awardConfigList" border>
        <el-table-column prop="day" label="连续签到天数" width="150" sortable>
          <template #default="{ row }">
            <el-tag>{{ row.day }}天</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="奖励积分" width="200">
          <template #default="{ row }">
            <span v-if="row.isIntegral" style="color: #67C23A">
              <el-icon><Coin /></el-icon>
              +{{ row.integral }}积分
            </span>
            <span v-else style="color: #909399">不奖励</span>
          </template>
        </el-table-column>
        <el-table-column label="奖励经验" width="200">
          <template #default="{ row }">
            <span v-if="row.isExperience" style="color: #409EFF">
              <el-icon><TrendCharts /></el-icon>
              +{{ row.experience }}经验
            </span>
            <span v-else style="color: #909399">不奖励</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEditAward(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDeleteAward(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑连续签到配置对话框 -->
    <el-dialog :title="awardDialogTitle" v-model="awardDialogVisible" width="500px">
      <el-form :model="awardForm" :rules="awardRules" ref="awardFormRef" label-width="120px">
        <el-form-item label="连续签到天数" prop="day">
          <el-input-number v-model="awardForm.day" :min="1" :precision="0" />
          <span class="form-tip">天</span>
        </el-form-item>

        <el-form-item label="奖励积分" prop="isIntegral">
          <el-switch v-model="awardForm.isIntegral" />
          <el-input-number 
            v-if="awardForm.isIntegral"
            v-model="awardForm.integral" 
            :min="0" 
            :precision="0" 
            style="margin-left: 10px"
          />
        </el-form-item>

        <el-form-item label="奖励经验" prop="isExperience">
          <el-switch v-model="awardForm.isExperience" />
          <el-input-number 
            v-if="awardForm.isExperience"
            v-model="awardForm.experience" 
            :min="0" 
            :precision="0" 
            style="margin-left: 10px"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="awardDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveAward">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Coin, TrendCharts } from '@element-plus/icons-vue'
import {
  getSignConfig,
  editBaseSignConfig,
  addSignConfig,
  editAwardSignConfig,
  deleteSignConfig
} from '@/api/growthSystem'

const loading = ref(false)
const baseFormRef = ref()
const awardFormRef = ref()
const awardDialogVisible = ref(false)
const editAwardMode = ref(false)

// 基础签到配置
const baseConfig = ref({
  id: undefined,
  day: 0,
  isIntegral: true,
  integral: 2,
  isExperience: true,
  experience: 2,
  signRuleDescription: ''
})

// 连续签到配置列表
const awardConfigList = ref<any[]>([])

// 连续签到表单
const awardForm = ref({
  id: undefined,
  day: 3,
  isIntegral: true,
  integral: 5,
  isExperience: true,
  experience: 5
})

const baseRules = {
  signRuleDescription: [
    { required: true, message: '请输入签到规则说明', trigger: 'blur' }
  ]
}

const awardRules = {
  day: [
    { required: true, message: '请输入连续签到天数', trigger: 'blur' }
  ]
}

const awardDialogTitle = computed(() => editAwardMode.value ? '编辑连续签到奖励' : '新增连续签到奖励')

// 加载配置
const loadConfig = async () => {
  loading.value = true
  try {
    const data = await getSignConfig()
    if (data) {
      // 基础签到配置
      if (data.baseSignConfig) {
        baseConfig.value = { ...data.baseSignConfig }
      }
      // 签到规则说明
      if (data.signRuleDescription) {
        baseConfig.value.signRuleDescription = data.signRuleDescription
      }
      // 连续签到配置列表
      if (data.signConfigList) {
        awardConfigList.value = data.signConfigList
      }
    }
  } catch (error) {
    console.error('加载配置失败:', error)
  } finally {
    loading.value = false
  }
}

// 保存基础配置
const handleSaveBase = async () => {
  if (!baseFormRef.value) return

  await baseFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    loading.value = true
    try {
      await editBaseSignConfig(baseConfig.value)
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

// 新增连续签到奖励
const handleAddAward = () => {
  editAwardMode.value = false
  awardForm.value = {
    id: undefined,
    day: 3,
    isIntegral: true,
    integral: 5,
    isExperience: true,
    experience: 5
  }
  awardDialogVisible.value = true
}

// 编辑连续签到奖励
const handleEditAward = (row: any) => {
  editAwardMode.value = true
  awardForm.value = { ...row }
  awardDialogVisible.value = true
}

// 保存连续签到奖励
const handleSaveAward = async () => {
  if (!awardFormRef.value) return

  await awardFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    loading.value = true
    try {
      if (editAwardMode.value) {
        await editAwardSignConfig(awardForm.value)
        ElMessage.success('更新成功')
      } else {
        await addSignConfig(awardForm.value)
        ElMessage.success('新增成功')
      }
      awardDialogVisible.value = false
      loadConfig()
    } catch (error) {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    } finally {
      loading.value = false
    }
  })
}

// 删除连续签到奖励
const handleDeleteAward = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该连续签到奖励配置吗？', '提示', {
      type: 'warning'
    })

    await deleteSignConfig(row.id)
    ElMessage.success('删除成功')
    loadConfig()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
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

.config-card {
  margin-bottom: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin: 0;
    }
  }
}

.form-tip {
  margin-left: 10px;
  font-size: 12px;
  color: #909399;
}
</style>
