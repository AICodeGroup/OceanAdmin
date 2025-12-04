<template>
  <div class="app-container">
    <div class="page-header">
      <h1>积分记录</h1>
    </div>

    <!-- 查询表单 -->
    <el-card class="search-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="用户ID">
          <el-input v-model="queryForm.uid" placeholder="请输入用户ID" clearable style="width: 200px" />
        </el-form-item>

        <el-form-item label="关联类型">
          <el-select v-model="queryForm.linkType" placeholder="请选择" clearable style="width: 150px">
            <el-option label="订单" value="order" />
            <el-option label="退款" value="refund" />
            <el-option label="签到" value="sign" />
            <el-option label="系统" value="system" />
          </el-select>
        </el-form-item>

        <el-form-item label="类型">
          <el-select v-model="queryForm.type" placeholder="请选择" clearable style="width: 120px">
            <el-option label="增加" :value="1" />
            <el-option label="扣减" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择" clearable style="width: 120px">
            <el-option label="创建" :value="1" />
            <el-option label="冻结" :value="2" />
            <el-option label="完成" :value="3" />
            <el-option label="失效" :value="4" />
          </el-select>
        </el-form-item>

        <el-form-item label="快捷日期">
          <el-select v-model="queryForm.dateLimit" placeholder="请选择" clearable style="width: 150px" @change="handleDateLimitChange">
            <el-option label="今天" value="today" />
            <el-option label="昨天" value="yesterday" />
            <el-option label="近7天" value="lately7" />
            <el-option label="近30天" value="lately30" />
            <el-option label="本月" value="month" />
            <el-option label="本年" value="year" />
          </el-select>
        </el-form-item>

        <el-form-item label="自定义时间">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 360px"
            @change="handleDateRangeChange"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card>
      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column prop="uid" label="用户ID" width="100" />
        <el-table-column prop="nickName" label="用户昵称" width="150" />
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" :size="40" />
          </template>
        </el-table-column>
        <el-table-column label="积分变化" width="120">
          <template #default="{ row }">
            <span :style="{ color: row.type === 1 ? '#67C23A' : '#F56C6C' }">
              {{ row.type === 1 ? '+' : '-' }}{{ row.integral }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="currentIntegral" label="当前积分" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="关联类型" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.linkType === 'order'" type="success">订单</el-tag>
            <el-tag v-else-if="row.linkType === 'refund'" type="warning">退款</el-tag>
            <el-tag v-else-if="row.linkType === 'sign'" type="primary">签到</el-tag>
            <el-tag v-else type="info">系统</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="linkId" label="关联ID" width="80" /> -->
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="mark" label="备注" min-width="150" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleQuery"
          @current-change="handleQuery"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getIntegralList } from '@/api/growthSystem'

const loading = ref(false)
const tableData = ref<any[]>([])
const dateRange = ref<string[]>([])

const queryForm = reactive({
  uid: '',
  linkType: '',
  type: undefined,
  status: undefined,
  dateLimit: ''
})

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

// 状态文本
const getStatusText = (status: number) => {
  const map: Record<number, string> = {
    1: '创建',
    2: '冻结',
    3: '完成',
    4: '失效'
  }
  return map[status] || '未知'
}

// 状态类型
const getStatusType = (status: number) => {
  const map: Record<number, string> = {
    1: 'info',
    2: 'warning',
    3: 'success',
    4: 'danger'
  }
  return map[status] || ''
}

// 快捷日期改变
const handleDateLimitChange = (value: string) => {
  if (value) {
    // 选择快捷日期时清空自定义时间
    dateRange.value = []
  }
}

// 自定义时间改变
const handleDateRangeChange = (value: any) => {
  if (value && value.length === 2) {
    // 选择自定义时间时清空快捷日期
    queryForm.dateLimit = ''
  }
}

// 查询
const handleQuery = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      limit: pagination.limit,
      uid: queryForm.uid,
      linkType: queryForm.linkType,
      type: queryForm.type,
      status: queryForm.status
    }

    // 优先使用快捷日期
    if (queryForm.dateLimit) {
      params.dateLimit = queryForm.dateLimit
    } else if (dateRange.value && dateRange.value.length === 2) {
      // 否则使用自定义时间范围
      params.startTime = dateRange.value[0]
      params.endTime = dateRange.value[1]
    }

    const data = await getIntegralList(params)
    tableData.value = data.list || []
    pagination.total = data.total || 0
  } catch (error) {
    console.error('查询失败:', error)
  } finally {
    loading.value = false
  }
}

// 重置
const handleReset = () => {
  queryForm.uid = ''
  queryForm.linkType = ''
  queryForm.type = undefined
  queryForm.status = undefined
  queryForm.dateLimit = ''
  dateRange.value = []
  pagination.page = 1
  handleQuery()
}

onMounted(() => {
  handleQuery()
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

.search-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
