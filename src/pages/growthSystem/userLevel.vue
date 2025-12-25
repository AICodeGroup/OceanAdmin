<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" type="card">
      <!-- 等级列表 -->
      <el-tab-pane label="等级列表" name="list">
        <div class="tab-header">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增等级
          </el-button>
        </div>

        <el-table 
          :data="levelList" 
          v-loading="loading"
          border
          style="width: 100%"
        >
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="等级名称" width="150" />
          <el-table-column prop="grade" label="等级序号" width="100" sortable />
          <el-table-column prop="experience" label="所需经验" width="120" sortable />
          <el-table-column label="等级图标" width="100">
            <template #default="{ row }">
              <el-image 
                v-if="row.icon" 
                :src="row.icon" 
                style="width: 40px; height: 40px"
                fit="cover"
              />
            </template>
          </el-table-column>
          <el-table-column label="背景颜色" width="120">
            <template #default="{ row }">
              <div class="color-block" :style="{ backgroundColor: row.backColor }">
                {{ row.backColor }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="discount" label="享受折扣" width="100">
            <template #default="{ row }">
              {{ row.discount }}%
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.isShow ? 'success' : 'info'">
                {{ row.isShow ? '显示' : '隐藏' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="180">
            <template #default="{ row }">
              {{ row.createTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button link type="warning" @click="handleToggleShow(row)">
                {{ row.isShow ? '隐藏' : '显示' }}
              </el-button>
              <el-button link type="danger" @click="handleDelete(row)" :disabled="row.grade === 0">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 等级规则 -->
      <el-tab-pane label="等级规则" name="rule">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>等级规则说明</span>
            </div>
          </template>
          <div v-loading="ruleLoading">
            <RichEditor v-model="ruleContent" placeholder="请输入等级规则内容..." />
            <div class="form-actions">
              <el-button type="primary" @click="handleSaveRule" :loading="ruleSaving">保存规则</el-button>
            </div>
          </div>
        </el-card>
      </el-tab-pane>

      <!-- 等级配置 -->
      <el-tab-pane label="等级配置" name="config">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>等级配置</span>
            </div>
          </template>
          <el-form :model="configForm" label-width="200px" v-loading="configLoading" style="max-width: 600px;">
            <el-form-item label="用户等级功能开关">
              <el-switch 
                v-model="configForm.userLevelSwitch" 
                active-value="true" 
                inactive-value="false"
                active-text="开启"
                inactive-text="关闭"
              />
            </el-form-item>
            <el-form-item label="每次观察记录获得经验">
              <el-input-number v-model="configForm.userLevelCommunityNotesExp" :min="0" :precision="0" />
              <span class="form-tip">经验值</span>
            </el-form-item>
            <el-form-item label="每日最多获取经验的记录数">
              <el-input-number v-model="configForm.userLevelCommunityNotesNum" :min="0" :precision="0" />
              <span class="form-tip">观察记录数量(0代表无限制)</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSaveConfig" :loading="configSaving">保存配置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 新增/编辑对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="dialogVisible"
      width="600px"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="等级名称" prop="name">
          <el-input v-model="formData.name" placeholder="如：探索者、航海者" />
        </el-form-item>

        <el-form-item label="等级序号" prop="grade">
          <el-input-number v-model="formData.grade" :min="editMode && formData.grade === 0 ? 0 : 1" :precision="0" :disabled="editMode && formData.grade === 0" />
          <span class="form-tip">数字越大等级越高（等级0不可修改）</span>
        </el-form-item>

        <el-form-item label="所需经验" prop="experience">
          <el-input-number v-model="formData.experience" :min="0" :precision="0" :disabled="editMode && formData.grade === 0" />
          <span class="form-tip" v-if="editMode && formData.grade === 0">等级0不可修改经验</span>
        </el-form-item>

        <el-form-item label="等级图标" prop="icon">
          <ImageUpload v-model="formData.icon" model="system" :pid="0" placeholder="上传图标" />
        </el-form-item>

        <el-form-item label="背景图" prop="backImage">
          <ImageUpload v-model="formData.backImage" model="system" :pid="0" placeholder="上传背景图" />
        </el-form-item>

        <el-form-item label="背景颜色" prop="backColor">
          <el-color-picker v-model="formData.backColor" />
          <el-input v-model="formData.backColor" placeholder="#3498db" style="width: 200px; margin-left: 10px" />
        </el-form-item>

        <el-form-item label="享受折扣" prop="discount">
          <el-input-number v-model="formData.discount" :min="0" :max="100" :precision="0" />
          <span class="form-tip">%，100表示原价，95表示95折</span>
        </el-form-item>

        <el-form-item label="是否显示" prop="isShow">
          <el-switch v-model="formData.isShow" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import ImageUpload from '@/components/ImageUpload/index.vue'
import RichEditor from '@/components/Editor/RichEditor.vue'
import {
  getUserLevelList,
  saveUserLevel,
  updateUserLevel,
  deleteUserLevel,
  toggleUserLevelShow,
  getUserLevelRule,
  updateUserLevelRule,
  getUserLevelConfig,
  updateUserLevelConfig
} from '@/api/growthSystem'

// Tab页
const activeTab = ref('list')

// 等级列表相关
const loading = ref(false)
const levelList = ref<any[]>([])
const dialogVisible = ref(false)
const formRef = ref()
const editMode = ref(false)

const formData = ref({
  id: undefined,
  name: '',
  grade: 1,
  experience: 0,
  icon: '',
  backImage: '',
  backColor: '#3498db',
  discount: 100,
  isShow: true
})

const rules = {
  name: [{ required: true, message: '请输入等级名称', trigger: 'blur' }],
  grade: [{ required: true, message: '请输入等级序号', trigger: 'blur' }],
  experience: [{ required: true, message: '请输入所需经验', trigger: 'blur' }],
  icon: [{ required: true, message: '请上传等级图标', trigger: 'change' }],
  backImage: [{ required: true, message: '请上传背景图', trigger: 'change' }],
  backColor: [{ required: true, message: '请选择背景颜色', trigger: 'change' }]
}

const dialogTitle = computed(() => editMode.value ? '编辑等级' : '新增等级')

// 等级规则相关
const ruleContent = ref('')
const ruleLoading = ref(false)
const ruleSaving = ref(false)

// 等级配置相关
const configLoading = ref(false)
const configSaving = ref(false)
const configForm = ref({
  userLevelSwitch: 'true',
  userLevelCommunityNotesExp: 5,
  userLevelCommunityNotesNum: 3
})

// 加载等级列表
const loadLevelList = async () => {
  loading.value = true
  try {
    const data = await getUserLevelList()
    levelList.value = data || []
  } catch (error) {
    console.error('加载等级列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载等级规则
const loadLevelRule = async () => {
  ruleLoading.value = true
  try {
    const data = await getUserLevelRule()
    ruleContent.value = data || ''
  } catch (error) {
    console.error('加载等级规则失败:', error)
  } finally {
    ruleLoading.value = false
  }
}

// 加载等级配置
const loadLevelConfig = async () => {
  configLoading.value = true
  try {
    const data = await getUserLevelConfig()
    if (data) {
      configForm.value = {
        userLevelSwitch: data.userLevelSwitch || 'true',
        userLevelCommunityNotesExp: data.userLevelCommunityNotesExp || 0,
        userLevelCommunityNotesNum: data.userLevelCommunityNotesNum || 0
      }
    }
  } catch (error) {
    console.error('加载等级配置失败:', error)
  } finally {
    configLoading.value = false
  }
}

// 新增
const handleAdd = () => {
  editMode.value = false
  formData.value = {
    id: undefined,
    name: '',
    grade: 1,
    experience: 0,
    icon: '',
    backImage: '',
    backColor: '#3498db',
    discount: 100,
    isShow: true
  }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  editMode.value = true
  formData.value = { ...row }
  dialogVisible.value = true
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    loading.value = true
    try {
      if (editMode.value) {
        await updateUserLevel(formData.value)
        ElMessage.success('更新成功')
      } else {
        await saveUserLevel(formData.value)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      loadLevelList()
    } catch (error) {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    } finally {
      loading.value = false
    }
  })
}

// 切换显示/隐藏
const handleToggleShow = async (row: any) => {
  try {
    await toggleUserLevelShow(row.id, !row.isShow)
    ElMessage.success('操作成功')
    loadLevelList()
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  }
}

// 删除
const handleDelete = async (row: any) => {
  if (row.grade === 0) {
    ElMessage.warning('等级0不可删除')
    return
  }
  
  try {
    await ElMessageBox.confirm('确认删除该等级吗？删除后将清除关联的用户等级数据！', '提示', {
      type: 'warning'
    })

    await deleteUserLevel(row.id)
    ElMessage.success('删除成功')
    loadLevelList()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 保存规则
const handleSaveRule = async () => {
  ruleSaving.value = true
  try {
    await updateUserLevelRule({ rule: ruleContent.value })
    ElMessage.success('规则保存成功')
  } catch (error) {
    console.error('保存规则失败:', error)
    ElMessage.error('保存规则失败')
  } finally {
    ruleSaving.value = false
  }
}

// 保存配置
const handleSaveConfig = async () => {
  configSaving.value = true
  try {
    await updateUserLevelConfig(configForm.value)
    ElMessage.success('配置保存成功')
  } catch (error) {
    console.error('保存配置失败:', error)
    ElMessage.error('保存配置失败')
  } finally {
    configSaving.value = false
  }
}

// 监听tab切换
watch(activeTab, (newTab) => {
  if (newTab === 'rule') {
    loadLevelRule()
  } else if (newTab === 'config') {
    loadLevelConfig()
  }
})

onMounted(() => {
  loadLevelList()
})
</script>

<style scoped lang="scss">
.app-container {
  padding: 20px;
}

.tab-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.color-block {
  padding: 4px 8px;
  border-radius: 4px;
  color: #fff;
  text-align: center;
  font-size: 12px;
}

.form-tip {
  margin-left: 10px;
  font-size: 12px;
  color: #909399;
}

.form-actions {
  margin-top: 20px;
  text-align: right;
}
</style>
