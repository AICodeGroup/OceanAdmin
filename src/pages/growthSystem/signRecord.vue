<template>
  <div class="app-container">
    <div class="page-header">
      <h1>签到记录</h1>
    </div>

    <!-- 查询表单 -->
    <el-card class="search-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="用户ID">
          <el-input v-model="queryForm.uid" placeholder="请输入用户ID" clearable style="width: 200px" />
        </el-form-item>

        <el-form-item label="签到日期">
          <el-date-picker
            v-model="queryForm.date"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            style="width: 200px"
            clearable
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
        <el-table-column prop="nickname" label="用户昵称" width="150" />
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" :size="40" />
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="date" label="签到日期" width="120" />
        <el-table-column prop="day" label="连续签到天数" width="120">
          <template #default="{ row }">
            <el-tag type="primary">{{ row.day }}天</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="基础奖励" width="120">
          <template #default="{ row }">
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="color: #67C23A; font-size: 12px;">积分: +{{ row.integral }}</span>
              <span style="color: #409EFF; font-size: 12px;">经验: +{{ row.experience }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="连续签到奖励" width="140">
          <template #default="{ row }">
            <div v-if="row.awardIntegral || row.awardExperience" style="display: flex; flex-direction: column; gap: 4px;">
              <span v-if="row.awardIntegral" style="color: #F56C6C; font-size: 12px; font-weight: bold;">
                积分: +{{ row.awardIntegral }}
              </span>
              <span v-if="row.awardExperience" style="color: #E6A23C; font-size: 12px; font-weight: bold;">
                经验: +{{ row.awardExperience }}
              </span>
            </div>
            <span v-else style="color: #909399; font-size: 12px;">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="mark" label="备注" min-width="150" />
        <el-table-column prop="createTime" label="添加时间" width="180" />
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
import { getSignRecordList } from '@/api/growthSystem'

const loading = ref(false)
const tableData = ref<any[]>([])

const queryForm = reactive({
  uid: '',
  date: ''
})

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

// 查询
const handleQuery = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      limit: pagination.limit,
      ...queryForm
    }

    const data = await getSignRecordList(params)
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
  queryForm.date = ''
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
