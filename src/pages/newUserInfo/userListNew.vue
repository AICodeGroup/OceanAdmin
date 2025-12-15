<template>
  <div class="user-list-page">
    <!-- 页面标题栏 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">用户管理</h1>
        <el-tag type="info" size="large">共 {{ pagination.total }} 位用户</el-tag>
      </div>
<!--      <div class="header-actions">-->
<!--        <el-button type="primary" @click="handleExport">-->
<!--          <el-icon><Download /></el-icon>-->
<!--          导出数据-->
<!--        </el-button>-->
<!--      </div>-->
    </div>

    <!-- 搜索筛选区 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="搜索关键词">
          <el-input
            v-model="searchForm.keywords"
            placeholder="昵称/手机号"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="用户等级">
          <el-select
            v-model="searchForm.levelId"
            placeholder="全部等级"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="level in levelList"
              :key="level.id"
              :label="level.name"
              :value="level.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="用户状态">
          <el-select
            v-model="searchForm.status"
            placeholder="全部状态"
            clearable
            style="width: 120px"
          >
            <el-option label="正常" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </el-form-item>

        <el-form-item label="付费会员">
          <el-select
            v-model="searchForm.isPaidMember"
            placeholder="全部"
            clearable
            style="width: 120px"
          >
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>

        <el-form-item label="推广员">
          <el-select
            v-model="searchForm.isPromoter"
            placeholder="全部"
            clearable
            style="width: 120px"
          >
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>

        <el-form-item label="注册时间">
          <el-select
            v-model="searchForm.dateLimit"
            placeholder="选择时间范围"
            clearable
            style="width: 150px"
          >
            <el-option label="今天" value="today" />
            <el-option label="昨天" value="yesterday" />
            <el-option label="近7天" value="lately7" />
            <el-option label="近30天" value="lately30" />
            <el-option label="本月" value="month" />
            <el-option label="本年" value="year" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="loading"
        :data="userList"
        border
        stripe
        style="width: 100%"
      >
        <!-- 用户信息 -->
        <el-table-column label="用户信息" min-width="250" fixed="left">
          <template #default="{ row }">
            <div class="user-info-cell">
              <el-avatar :src="row.avatar" :size="50" />
              <div class="user-details">
                <div class="user-name-line">
                  <span class="nickname">{{ row.nickname }}</span>
                  <el-tag v-if="row.isPaidMember" type="warning" size="small" effect="dark">会员</el-tag>
                  <el-tag v-if="row.isPromoter" type="success" size="small">推广员</el-tag>
                </div>
                <div class="user-meta">
                  <span>ID: {{ row.id }}</span>
                  <span v-if="row.phone">{{ row.phone }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- 成长数据 -->
        <el-table-column label="成长数据" width="200" align="center">
          <template #default="{ row }">
            <div class="growth-data">
              <div class="data-row">
                <span class="label">等级</span>
                <el-tag type="primary" size="small">Lv.{{ row.level }}</el-tag>
              </div>
              <div class="data-row">
                <span class="label">积分</span>
                <span class="value">{{ row.integral }}</span>
              </div>
              <div class="data-row">
                <span class="label">经验</span>
                <span class="value">{{ row.experience }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- 余额 -->
        <el-table-column prop="nowMoney" label="余额" width="120" align="center">
          <template #default="{ row }">
            <span class="money-value">¥{{ row.nowMoney }}</span>
          </template>
        </el-table-column>

        <!-- 状态 -->
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'">
              {{ row.status ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 注册时间 -->
        <el-table-column prop="createTime" label="注册时间" width="180" />

        <!-- 最近登录 -->
        <el-table-column prop="lastLoginTime" label="最近登录" width="180">
          <template #default="{ row }">
            {{ row.lastLoginTime || '-' }}
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作" width="360" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button size="small" type="primary" link @click="handleViewDetail(row)">
                <el-icon><View /></el-icon>
                详情
              </el-button>
              <el-button size="small" type="primary" link @click="handleEdit(row)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-dropdown @command="(cmd: string) => handleCommand(cmd, row)">
                <el-button size="small" link>
                  更多
                  <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="integral">
                      <el-icon><Coin /></el-icon>
                      操作积分
                    </el-dropdown-item>
                    <el-dropdown-item command="experience">
                      <el-icon><TrendCharts /></el-icon>
                      操作经验
                    </el-dropdown-item>
                    <el-dropdown-item command="balance">
                      <el-icon><Money /></el-icon>
                      操作余额
                    </el-dropdown-item>
                    <el-dropdown-item command="member" divided>
                      <el-icon><Medal /></el-icon>
                      赠送会员
                    </el-dropdown-item>
                    <el-dropdown-item :command="row.status ? 'disable' : 'enable'" divided>
                      <el-icon><Switch /></el-icon>
                      {{ row.status ? '禁用账号' : '启用账号' }}
                    </el-dropdown-item>
                    <el-dropdown-item command="delete" divided>
                      <el-icon><Delete /></el-icon>
                      删除账号
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSearch"
          @current-change="handleSearch"
        />
      </div>
    </el-card>

    <!-- 对话框 -->
    <UserDetailDialog
      v-model="detailDialogVisible"
      :user-id="currentUserId"
    />

    <UserEditDialog
      v-model="editDialogVisible"
      :user-info="currentUser"
      @success="handleSearch"
    />

    <UserOperateDialog
      v-model="operateDialogVisible"
      :user-id="currentUserId"
      :operate-type="operateType"
      @success="handleSearch"
    />

    <GiftMemberDialog
      v-model="memberDialogVisible"
      :user-info="currentUser"
      @success="handleSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search, Refresh, Download, View, Edit, ArrowDown,
  Coin, TrendCharts, Money, Medal, Switch, Delete
} from '@element-plus/icons-vue'
import { getUserList, updateUserStatusNew, deleteUserById, exportUserExcel } from '@/api/user'
import { getUserLevelList } from '@/api/growthSystem'
import UserDetailDialog from '@/components/user/UserDetailDialog.vue'
import UserEditDialog from '@/components/user/UserEditDialog.vue'
import UserOperateDialog from '@/components/user/UserOperateDialog.vue'
import GiftMemberDialog from '@/components/user/GiftMemberDialog.vue'

const loading = ref(false)
const userList = ref<any[]>([])
const levelList = ref<any[]>([])

const searchForm = reactive({
  keywords: '',
  levelId: undefined,
  status: undefined,
  isPaidMember: undefined,
  isPromoter: undefined,
  dateLimit: ''
})

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

// 对话框控制
const detailDialogVisible = ref(false)
const editDialogVisible = ref(false)
const operateDialogVisible = ref(false)
const memberDialogVisible = ref(false)

const currentUserId = ref(0)
const currentUser = ref<any>(null)
const operateType = ref<'integral' | 'experience' | 'balance'>('integral')

// 加载用户列表
const loadUserList = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      limit: pagination.limit,
      ...searchForm
    }

    const data = await getUserList(params)
    userList.value = data.list || []
    pagination.total = data.total || 0
  } catch (error) {
    console.error('加载用户列表失败:', error)
    ElMessage.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

// 加载等级列表
const loadLevelList = async () => {
  try {
    const data = await getUserLevelList()
    levelList.value = data || []
  } catch (error) {
    console.error('加载等级列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadUserList()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    keywords: '',
    levelId: undefined,
    status: undefined,
    isPaidMember: undefined,
    isPromoter: undefined,
    dateLimit: ''
  })
  handleSearch()
}

// 查看详情
const handleViewDetail = (row: any) => {
  currentUserId.value = row.id
  detailDialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  currentUser.value = row
  editDialogVisible.value = true
}

// 更多操作
const handleCommand = async (command: string, row: any) => {
  currentUserId.value = row.id
  currentUser.value = row

  switch (command) {
    case 'integral':
      operateType.value = 'integral'
      operateDialogVisible.value = true
      break
    case 'experience':
      operateType.value = 'experience'
      operateDialogVisible.value = true
      break
    case 'balance':
      operateType.value = 'balance'
      operateDialogVisible.value = true
      break
    case 'member':
      memberDialogVisible.value = true
      break
    case 'enable':
    case 'disable':
      await handleStatusChange(row, command === 'enable')
      break
    case 'delete':
      await handleDelete(row)
      break
  }
}

// 修改状态
const handleStatusChange = async (row: any, status: boolean) => {
  try {
    await ElMessageBox.confirm(
      `确定要${status ? '启用' : '禁用'}用户 ${row.nickname} 吗？`,
      '提示',
      {
        type: 'warning'
      }
    )

    await updateUserStatusNew({
      userId: row.id,
      status
    })

    ElMessage.success('操作成功')
    loadUserList()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    }
  }
}

// 删除用户
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 ${row.nickname} 吗？此操作不可恢复！`,
      '警告',
      {
        type: 'error',
        confirmButtonText: '确定删除',
        cancelButtonText: '取消'
      }
    )

    await deleteUserById(row.id)
    ElMessage.success('删除成功')
    loadUserList()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 导出数据
const handleExport = async () => {
  try {
    loading.value = true
    const blob = await exportUserExcel(searchForm)
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `用户数据_${new Date().getTime()}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUserList()
  loadLevelList()
})
</script>

<style scoped lang="scss">
.user-list-page {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;

      .page-title {
        font-size: 24px;
        font-weight: 600;
        color: #303133;
        margin: 0;
      }
    }
  }

  .search-card {
    margin-bottom: 20px;

    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }

  .table-card {
    .user-info-cell {
      display: flex;
      align-items: center;
      gap: 12px;

      .user-details {
        flex: 1;
        min-width: 0;

        .user-name-line {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;

          .nickname {
            font-size: 14px;
            font-weight: 500;
            color: #303133;
          }
        }

        .user-meta {
          display: flex;
          gap: 8px;
          font-size: 12px;
          color: #909399;
        }
      }
    }

    .growth-data {
      .data-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 0;
        gap: 8px;

        .label {
          font-size: 12px;
          color: #909399;
        }

        .value {
          font-size: 14px;
          font-weight: 500;
          color: #409EFF;
        }
      }
    }

    .money-value {
      font-size: 16px;
      font-weight: 600;
      color: #67C23A;
    }

    .action-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .pagination-container {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
