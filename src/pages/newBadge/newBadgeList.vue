<template>
    <div class="app-container">
      <div class="page-header">
        <h1>授予徽章</h1>
      </div>
  
      <!-- 表格 -->
      <div class="card-container">
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column label="徽章图标" width="100">
            <template #default="scope">
              <div class="badge-icon">
                <el-image
                  v-if="scope.row.iconUrl"
                  :src="scope.row.iconUrl"
                  fit="cover"
                  style="width: 50px; height: 50px; border-radius: 50%"
                />
                <div v-else class="default-icon">
                  <el-icon><Medal /></el-icon>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="徽章名称" />
          <el-table-column prop="typeName" label="徽章类型" width="120" />
          <el-table-column prop="description" label="描述" show-overflow-tooltip />
          <el-table-column prop="level" label="等级" width="80" />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button type="success" size="small" @click="handleGrant(scope.row)">
                授予
              </el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <!-- 分页 -->
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
  
      <!-- 授予徽章对话框 -->
      <el-dialog
        v-model="grantVisible"
        title="授予徽章"
        width="500px"
        @close="resetGrantForm"
      >
        <el-form
          ref="grantFormRef"
          :model="grantForm"
          :rules="grantRules"
          label-width="100px"
        >
          <el-form-item label="徽章">
            <div class="award-badge-info">
              <div class="badge-icon-small">
                <el-image
                  v-if="currentBadge?.iconUrl"
                  :src="currentBadge.iconUrl"
                  fit="cover"
                  style="width: 40px; height: 40px; border-radius: 50%"
                />
                <div v-else class="default-icon-small">
                  <el-icon><Medal /></el-icon>
                </div>
              </div>
              <span>{{ currentBadge?.name }}</span>
            </div>
          </el-form-item>
          <el-form-item label="用户手机号" prop="phone">
            <el-input 
              v-model="grantForm.phone" 
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
            <div v-if="phoneCheckMessage" :class="['phone-check-message', phoneCheckMessage.type]">
              {{ phoneCheckMessage.text }}
            </div>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="grantVisible = false">取消</el-button>
            <el-button 
              type="primary" 
              @click="handleGrantSubmit" 
              :disabled="!grantForm.userId || phoneChecking"
            >
              确定授予
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { getGrantedBadge, grantUserBadge } from '@/api/badge'
  import { judgeUser } from '@/api/newOrder'
  import { Loading, Medal } from '@element-plus/icons-vue'
  
  // 响应式数据
  const loading = ref(false)
  const grantVisible = ref(false)
  const currentBadge = ref<any>(null)
  const grantFormRef = ref<FormInstance>()
  
  const tableData = ref([])
  
  // 授予表单
  const grantForm = reactive({
    phone: '',
    userId: null
  })
  
  // 手机号检查
  const phoneChecking = ref(false)
  const phoneCheckMessage = ref<{text: string, type: 'error' | 'success'} | null>(null)
  
  // 表单验证规则
  const grantRules: FormRules = {
    phone: [{ required: true, message: '请输入用户手机号', trigger: 'blur' }]
  }
  
  // 分页数据
  const pagination = reactive({
    current: 1,
    size: 10,
    total: 0
  })
  
  // 获取列表数据
  const getList = async () => {
    loading.value = true
    try {
      const res = await getGrantedBadge({ 
        current: pagination.current, 
        size: pagination.size,
      })
      console.log(res)
      tableData.value = res.records
      pagination.total = res.total
    } catch (error) {
      console.error('获取可授予徽章列表失败:', error)
      ElMessage.error('获取徽章列表失败')
    } finally {
      loading.value = false
    }
  }
  
  // 处理授予
  const handleGrant = (row: any) => {
    currentBadge.value = row
    grantVisible.value = true
  }

  // 检查手机号
  const handlePhoneBlur = async () => {
    const phone = grantForm.phone.trim()
    grantForm.userId = null
    phoneCheckMessage.value = null

    if (!phone) {
      return
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      phoneCheckMessage.value = { text: '请输入正确的手机号', type: 'error' }
      return
    }

    try {
      phoneChecking.value = true
      const res = await judgeUser(phone)
      if (res) {
        grantForm.userId = res
        phoneCheckMessage.value = { text: '用户存在', type: 'success' }
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
  
  // 处理授予提交
  const handleGrantSubmit = () => {
    grantFormRef.value?.validate(async (valid) => {
      if (valid && grantForm.userId && currentBadge.value) {
        console.log(grantForm.userId, currentBadge.value.id)
        try {
          await grantUserBadge(grantForm.userId, currentBadge.value.id)
          ElMessage.success('徽章授予成功')
          grantVisible.value = false
          getList() // 刷新列表
        } catch (error) {
          console.error('授予失败:', error)
          ElMessage.error('授予失败')
        }
      }
    })
  }
  
  // 重置授予表单
  const resetGrantForm = () => {
    grantForm.phone = ''
    grantForm.userId = null
    phoneCheckMessage.value = null
    phoneChecking.value = false
    currentBadge.value = null
    grantFormRef.value?.resetFields()
  }
  
  // 分页处理
  const handleSizeChange = (size: number) => {
    pagination.size = size
    getList()
  }
  
  const handleCurrentChange = (page: number) => {
    pagination.current = page
    getList()
  }
  
  onMounted(() => {
    getList()
  })
  </script>
  
  <style lang="scss" scoped>
  .card-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }

  .page-header {
    margin-bottom: 20px;
  }

  .badge-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    
    .default-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: #999;
    }
  }
  
  .award-badge-info {
    display: flex;
    align-items: center;
    
    .badge-icon-small {
      margin-right: 10px;
      
      .default-icon-small {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: #999;
      }
    }
  }

  .phone-check-message {
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;

    &.success {
      color: #67c23a;
    }

    &.error {
      color: #f56c6c;
    }
  }
  </style>