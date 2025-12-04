<template>
  <el-dialog
    v-model="dialogVisible"
    title="用户详情"
    width="1200px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div v-loading="loading" class="user-detail-container">
      <!-- 用户基本信息卡片 -->
      <el-card class="user-info-card" shadow="never">
        <div class="user-header">
          <el-avatar :src="userInfo.avatar" :size="80" />
          <div class="user-header-info">
            <div class="user-name">
              <span class="nickname">{{ userInfo.nickname }}</span>
              <el-tag v-if="userInfo.isPaidMember" type="warning" effect="dark">付费会员</el-tag>
              <el-tag v-if="userInfo.isPromoter" type="success">推广员</el-tag>
              <el-tag :type="userInfo.status ? 'success' : 'danger'">
                {{ userInfo.status ? '正常' : '禁用' }}
              </el-tag>
            </div>
            <div class="user-meta">
              <span class="meta-item">
                <el-icon><User /></el-icon>
                用户ID: {{ userInfo.id }}
              </span>
              <span class="meta-item">
                <el-icon><Phone /></el-icon>
                {{ userInfo.phone || '未绑定' }}
              </span>
              <span class="meta-item">
                <el-icon><Calendar /></el-icon>
                注册时间: {{ userInfo.createTime }}
              </span>
            </div>
          </div>
          <div class="user-stats">
            <div class="stat-item">
              <div class="stat-value">{{ userInfo.integral }}</div>
              <div class="stat-label">积分</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ userInfo.experience }}</div>
              <div class="stat-label">经验</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ userInfo.level }}</div>
              <div class="stat-label">等级</div>
            </div>
            <!-- <div class="stat-item">
              <div class="stat-value">¥{{ userInfo.nowMoney }}</div>
              <div class="stat-label">余额</div>
            </div> -->
          </div>
        </div>
      </el-card>

      <!-- 详细信息标签页 -->
      <el-card class="detail-tabs-card" shadow="never">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="basic">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="真实姓名">{{ userInfo.realName || '-' }}</el-descriptions-item>
              <el-descriptions-item label="性别">
                {{ userInfo.sex === 1 ? '男' : userInfo.sex === 2 ? '女' : '未知' }}
              </el-descriptions-item>
              <el-descriptions-item label="生日">{{ userInfo.birthday || '-' }}</el-descriptions-item>
              <el-descriptions-item label="账号">{{ userInfo.account }}</el-descriptions-item>
              <el-descriptions-item label="手机号">{{ userInfo.phone || '-' }}</el-descriptions-item>
              <el-descriptions-item label="注册来源">
                <el-tag :type="getRegisterTypeColor(userInfo.registerType)" size="small">
                  {{ getRegisterTypeText(userInfo.registerType) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="连续签到">{{ userInfo.signNum }}天</el-descriptions-item>
              <el-descriptions-item label="购买次数">{{ userInfo.payCount }}次</el-descriptions-item>
              <!-- <el-descriptions-item label="佣金">¥{{ userInfo.brokeragePrice }}</el-descriptions-item> -->
              <el-descriptions-item label="会员到期">
                {{ userInfo.paidMemberExpirationTime || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="最近登录">{{ userInfo.lastLoginTime }}</el-descriptions-item>
              <el-descriptions-item label="最近IP">{{ userInfo.lastIp }}</el-descriptions-item>
              <el-descriptions-item label="备注" :span="2">{{ userInfo.mark || '-' }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <!-- 积分记录 -->
          <el-tab-pane label="积分记录" name="integral">
            <el-table :data="integralRecords" border>
              <el-table-column prop="createTime" label="时间" width="180" />
              <el-table-column label="变动" width="120">
                <template #default="{ row }">
                  <span :style="{ color: row.type === 1 ? '#67C23A' : '#F56C6C' }">
                    {{ row.type === 1 ? '+' : '-' }}{{ row.integral }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="balance" label="当前积分" width="120" />
              <el-table-column prop="linkType" label="关联类型" width="100">
                <template #default="{ row }">
                  <el-tag v-if="row.linkType === 'order'" type="success" size="small">订单</el-tag>
                  <el-tag v-else-if="row.linkType === 'refund'" type="warning" size="small">退款</el-tag>
                  <el-tag v-else-if="row.linkType === 'sign'" type="primary" size="small">签到</el-tag>
                  <el-tag v-else type="info" size="small">系统</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="title" label="标题" min-width="200" />
              <el-table-column prop="mark" label="备注" min-width="150" show-overflow-tooltip />
            </el-table>
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="integralPagination.page"
                v-model:page-size="integralPagination.limit"
                :total="integralPagination.total"
                :page-sizes="[10, 20, 50]"
                layout="total, sizes, prev, pager, next"
                @current-change="loadIntegralRecords"
                @size-change="loadIntegralRecords"
              />
            </div>
          </el-tab-pane>

          <!-- 经验记录 -->
          <el-tab-pane label="经验记录" name="experience">
            <el-table :data="experienceRecords" border>
              <el-table-column prop="createTime" label="时间" width="180" />
              <el-table-column label="变动" width="120">
                <template #default="{ row }">
                  <span :style="{ color: row.type === 1 ? '#67C23A' : '#F56C6C' }">
                    {{ row.type === 1 ? '+' : '-' }}{{ row.experience }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="balance" label="当前经验" width="120" />
              <el-table-column prop="title" label="标题" min-width="200" />
              <el-table-column prop="mark" label="备注" min-width="150" show-overflow-tooltip />
            </el-table>
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="experiencePagination.page"
                v-model:page-size="experiencePagination.limit"
                :total="experiencePagination.total"
                :page-sizes="[10, 20, 50]"
                layout="total, sizes, prev, pager, next"
                @current-change="loadExperienceRecords"
                @size-change="loadExperienceRecords"
              />
            </div>
          </el-tab-pane>

          <!-- 余额记录 -->
          <!-- <el-tab-pane label="余额记录" name="balance">
            <el-table :data="balanceRecords" border>
              <el-table-column prop="createTime" label="时间" width="180" />
              <el-table-column label="变动" width="120">
                <template #default="{ row }">
                  <span :style="{ color: row.type === 1 ? '#67C23A' : '#F56C6C' }">
                    {{ row.type === 1 ? '+' : '-' }}¥{{ row.money }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="当前余额" width="120">
                <template #default="{ row }">¥{{ row.balance }}</template>
              </el-table-column>
              <el-table-column prop="title" label="标题" min-width="200" />
              <el-table-column prop="mark" label="备注" min-width="150" show-overflow-tooltip />
            </el-table>
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="balancePagination.page"
                v-model:page-size="balancePagination.limit"
                :total="balancePagination.total"
                :page-sizes="[10, 20, 50]"
                layout="total, sizes, prev, pager, next"
                @current-change="loadBalanceRecords"
                @size-change="loadBalanceRecords"
              />
            </div>
          </el-tab-pane> -->

          <!-- 签到记录 -->
          <el-tab-pane label="签到记录" name="sign">
            <el-table :data="signRecords" border>
              <el-table-column prop="signDate" label="签到日期" width="120" />
              <el-table-column prop="integral" label="获得积分" width="100">
                <template #default="{ row }">
                  <span style="color: #67C23A">+{{ row.integral }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="experience" label="获得经验" width="100">
                <template #default="{ row }">
                  <span style="color: #409EFF">+{{ row.experience }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="签到时间" width="180" />
            </el-table>
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="signPagination.page"
                v-model:page-size="signPagination.limit"
                :total="signPagination.total"
                :page-sizes="[10, 20, 50]"
                layout="total, sizes, prev, pager, next"
                @current-change="loadSignRecords"
                @size-change="loadSignRecords"
              />
            </div>
          </el-tab-pane>

          <!-- 订单列表 -->
          <el-tab-pane label="订单列表" name="orders">
            <el-table :data="orders" border>
              <el-table-column prop="orderNo" label="订单号" width="180" />
              <el-table-column prop="productName" label="商品名称" min-width="200" />
              <el-table-column prop="totalPrice" label="订单金额" width="120">
                <template #default="{ row }">¥{{ row.totalPrice }}</template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
                    {{ row.status === 1 ? '已支付' : '未支付' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="payTime" label="支付时间" width="180" />
              <el-table-column prop="createTime" label="创建时间" width="180" />
            </el-table>
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="ordersPagination.page"
                v-model:page-size="ordersPagination.limit"
                :total="ordersPagination.total"
                :page-sizes="[10, 20, 50]"
                layout="total, sizes, prev, pager, next"
                @current-change="loadOrders"
                @size-change="loadOrders"
              />
            </div>
          </el-tab-pane>

          <!-- 观察记录 -->
          <el-tab-pane label="观察记录" name="observations">
            <el-table :data="observations" border>
              <el-table-column prop="speciesName" label="物种名称" width="150" />
              <el-table-column prop="observationDate" label="观察日期" width="120" />
              <el-table-column prop="location" label="地点" width="150" />
              <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 1 ? 'success' : 'warning'" size="small">
                    {{ row.status === 1 ? '已审核' : '待审核' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="180" />
            </el-table>
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="observationsPagination.page"
                v-model:page-size="observationsPagination.limit"
                :total="observationsPagination.total"
                :page-sizes="[10, 20, 50]"
                layout="total, sizes, prev, pager, next"
                @current-change="loadObservations"
                @size-change="loadObservations"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { User, Phone, Calendar } from '@element-plus/icons-vue'
import {
  getUserDetailById,
  getUserIntegralRecord,
  getUserExperienceRecord,
  getUserBalanceRecord,
  getUserSignRecord,
  getUserOrders,
  getUserObservations
} from '@/api/user'

interface Props {
  modelValue: boolean
  userId: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  userId: 0
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const loading = ref(false)
const activeTab = ref('basic')
const userInfo = ref<any>({})

// 各类记录数据
const integralRecords = ref<any[]>([])
const experienceRecords = ref<any[]>([])
const balanceRecords = ref<any[]>([])
const signRecords = ref<any[]>([])
const orders = ref<any[]>([])
const observations = ref<any[]>([])

// 分页配置
const integralPagination = reactive({ page: 1, limit: 10, total: 0 })
const experiencePagination = reactive({ page: 1, limit: 10, total: 0 })
const balancePagination = reactive({ page: 1, limit: 10, total: 0 })
const signPagination = reactive({ page: 1, limit: 10, total: 0 })
const ordersPagination = reactive({ page: 1, limit: 10, total: 0 })
const observationsPagination = reactive({ page: 1, limit: 10, total: 0 })

// 监听对话框打开
watch(dialogVisible, (val) => {
  if (val && props.userId) {
    loadUserDetail()
  }
})

// 加载用户详情
const loadUserDetail = async () => {
  loading.value = true
  try {
    const data = await getUserDetailById(props.userId)
    userInfo.value = data
  } catch (error) {
    console.error('加载用户详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 标签页切换
const handleTabClick = (tab: any) => {
  const tabName = tab.paneName
  switch (tabName) {
    case 'integral':
      if (integralRecords.value.length === 0) loadIntegralRecords()
      break
    case 'experience':
      if (experienceRecords.value.length === 0) loadExperienceRecords()
      break
    case 'balance':
      if (balanceRecords.value.length === 0) loadBalanceRecords()
      break
    case 'sign':
      if (signRecords.value.length === 0) loadSignRecords()
      break
    case 'orders':
      if (orders.value.length === 0) loadOrders()
      break
    case 'observations':
      if (observations.value.length === 0) loadObservations()
      break
  }
}

// 加载积分记录
const loadIntegralRecords = async () => {
  try {
    const data = await getUserIntegralRecord({
      userId: props.userId,
      page: integralPagination.page,
      limit: integralPagination.limit
    })
    integralRecords.value = data.list || []
    integralPagination.total = data.total || 0
  } catch (error) {
    console.error('加载积分记录失败:', error)
  }
}

// 加载经验记录
const loadExperienceRecords = async () => {
  try {
    const data = await getUserExperienceRecord({
      userId: props.userId,
      page: experiencePagination.page,
      limit: experiencePagination.limit
    })
    experienceRecords.value = data.list || []
    experiencePagination.total = data.total || 0
  } catch (error) {
    console.error('加载经验记录失败:', error)
  }
}

// 加载余额记录
const loadBalanceRecords = async () => {
  try {
    const data = await getUserBalanceRecord({
      userId: props.userId,
      page: balancePagination.page,
      limit: balancePagination.limit
    })
    balanceRecords.value = data.list || []
    balancePagination.total = data.total || 0
  } catch (error) {
    console.error('加载余额记录失败:', error)
  }
}

// 加载签到记录
const loadSignRecords = async () => {
  try {
    const data = await getUserSignRecord({
      userId: props.userId,
      page: signPagination.page,
      limit: signPagination.limit
    })
    signRecords.value = data.list || []
    signPagination.total = data.total || 0
  } catch (error) {
    console.error('加载签到记录失败:', error)
  }
}

// 加载订单列表
const loadOrders = async () => {
  try {
    const data = await getUserOrders({
      userId: props.userId,
      page: ordersPagination.page,
      limit: ordersPagination.limit
    })
    orders.value = data.list || []
    ordersPagination.total = data.total || 0
  } catch (error) {
    console.error('加载订单列表失败:', error)
  }
}

// 加载观察记录
const loadObservations = async () => {
  try {
    const data = await getUserObservations({
      userId: props.userId,
      page: observationsPagination.page,
      limit: observationsPagination.limit
    })
    observations.value = data.list || []
    observationsPagination.total = data.total || 0
  } catch (error) {
    console.error('加载观察记录失败:', error)
  }
}

// 获取注册来源文本
const getRegisterTypeText = (registerType: string) => {
  const registerTypeMap: { [key: string]: string } = {
    'public': '公众号',
    'routine': '小程序',
    'H5': 'H5',
    'iosWx': '微信iOS',
    'androidWx': '微信安卓',
    'ios': 'iOS'
  }
  return registerTypeMap[registerType] || '未知'
}

// 获取注册来源标签颜色
const getRegisterTypeColor = (registerType: string) => {
  const colorMap: { [key: string]: string } = {
    'public': 'success',
    'mini': 'primary',
    'H5': 'warning',
    'iosWx': 'info',
    'androidWx': 'info',
    'ios': ''
  }
  return colorMap[registerType] || 'info'
}

const handleClose = () => {
  dialogVisible.value = false
  activeTab.value = 'basic'
}
</script>

<style scoped lang="scss">
.user-detail-container {
  .user-info-card {
    margin-bottom: 20px;

    .user-header {
      display: flex;
      align-items: center;
      gap: 24px;

      .user-header-info {
        flex: 1;

        .user-name {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;

          .nickname {
            font-size: 20px;
            font-weight: 600;
            color: #303133;
          }
        }

        .user-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          color: #606266;
          font-size: 14px;

          .meta-item {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }

      .user-stats {
        display: flex;
        gap: 32px;

        .stat-item {
          text-align: center;

          .stat-value {
            font-size: 24px;
            font-weight: 600;
            color: #409EFF;
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 12px;
            color: #909399;
          }
        }
      }
    }
  }

  .detail-tabs-card {
    :deep(.el-card__body) {
      padding: 0;
    }

    :deep(.el-tabs__header) {
      margin: 0;
      padding: 0 20px;
      background-color: #f5f7fa;
    }

    :deep(.el-tabs__content) {
      padding: 20px;
    }
  }

  .pagination-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
