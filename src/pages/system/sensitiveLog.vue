<template>
  <div class="app-container">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form :model="queryParams" ref="queryFormRef" :inline="true" class="search-form">
        <el-form-item label="模块类型" prop="methodType">
          <el-select v-model="queryParams.methodType" placeholder="请选择" clearable style="width: 150px">
            <el-option label="查询" value="SELECT" />
            <el-option label="新增" value="ADD" />
            <el-option label="修改" value="UPDATE" />
            <el-option label="删除" value="DELETE" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 150px">
            <el-option label="正常" :value="0" />
            <el-option label="异常" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="管理员" prop="adminAccount">
          <el-input v-model="queryParams.adminAccount" placeholder="管理员账号" clearable @keyup.enter="handleQuery" style="width: 150px" />
        </el-form-item>
        <el-form-item label="关键词" prop="keyword">
          <el-input v-model="queryParams.keyword" placeholder="操作描述/参数等" clearable @keyup.enter="handleQuery" style="width: 200px" />
        </el-form-item>
        <el-form-item label="操作时间">
           <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="defaultTime"
            style="width: 320px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="logList" border style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="adminAccount" label="管理员" width="120" align="center" />
        <el-table-column prop="ip" label="IP地址" width="130" align="center" />
        <el-table-column prop="description" label="操作描述" min-width="150" show-overflow-tooltip />
        <el-table-column prop="methodType" label="模块类型" width="100" align="center">
           <template #default="{ row }">
             <el-tag :type="getMethodTypeTag(row.methodType)">{{ row.methodType }}</el-tag>
           </template>
        </el-table-column>
        <el-table-column prop="requestMethod" label="请求方式" width="100" align="center">
           <template #default="{ row }">
             <el-tag type="info" effect="plain">{{ row.requestMethod }}</el-tag>
           </template>
        </el-table-column>
        <el-table-column prop="url" label="请求URL" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 0 ? 'success' : 'danger'">
              {{ row.status === 0 ? '正常' : '异常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="操作时间" width="170" align="center" />
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container" style="margin-top: 20px; text-align: right">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.limit"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog v-model="dialogVisible" title="日志详情" width="800px" destroy-on-close>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="操作描述">{{ currentLog.description }}</el-descriptions-item>
        <el-descriptions-item label="管理员">{{ currentLog.adminAccount }} (ID: {{ currentLog.adminId }})</el-descriptions-item>
        <el-descriptions-item label="IP地址">{{ currentLog.ip }}</el-descriptions-item>
        <el-descriptions-item label="请求地址">
          <span style="font-weight: bold">{{ currentLog.requestMethod }}</span> {{ currentLog.url }}
        </el-descriptions-item>
        <el-descriptions-item label="调用方法">{{ currentLog.method }}</el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ currentLog.createTime }}</el-descriptions-item>
        <el-descriptions-item label="请求参数">
           <div class="code-box">
             {{ currentLog.requestParam || '无' }}
           </div>
        </el-descriptions-item>
        <el-descriptions-item label="返回结果">
           <div class="code-box">
             {{ currentLog.result || '无' }}
           </div>
        </el-descriptions-item>
        <el-descriptions-item label="异常信息" v-if="currentLog.status === 1 || currentLog.errorMsg">
           <div class="code-box error">
             {{ currentLog.errorMsg || '无' }}
           </div>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getSensitiveLogs, SensitiveLogRecord, SensitiveLogSearchParams } from '@/api/log'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const total = ref(0)
const logList = ref<SensitiveLogRecord[]>([])
const dateRange = ref<[string, string] | null>(null)
const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59),
]

const queryParams = reactive<SensitiveLogSearchParams>({
  page: 1,
  limit: 10,
  methodType: undefined,
  startDate: undefined,
  endDate: undefined,
  adminAccount: undefined,
  status: undefined,
  keyword: undefined
})

const dialogVisible = ref(false)
const currentLog = ref<Partial<SensitiveLogRecord>>({})

// 获取日志列表
const getList = async () => {
  loading.value = true
  // 处理时间参数
  if (dateRange.value && dateRange.value.length === 2) {
    queryParams.startDate = dateRange.value[0]
    queryParams.endDate = dateRange.value[1]
  } else {
    queryParams.startDate = undefined
    queryParams.endDate = undefined
  }

  try {
    const res = await getSensitiveLogs(queryParams) as any
    // 假设返回结构是 { code: 200, data: { list: [], total: 0 } }
    // 或者直接返回 data { list: [], total: 0 }
    // 根据之前的API pattern，可能是 res.list 或 res.data.list
    const data = res.data || res
    logList.value = data.list || []
    total.value = data.total || 0
  } catch (error) {
    console.error('获取日志列表失败:', error)
    ElMessage.error('获取日志列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

// 重置
const resetQuery = () => {
  queryParams.methodType = undefined
  queryParams.adminAccount = undefined
  queryParams.status = undefined
  queryParams.keyword = undefined
  dateRange.value = null
  queryParams.page = 1
  getList()
}

// 分页
const handleSizeChange = (val: number) => {
  queryParams.limit = val
  getList()
}

const handleCurrentChange = (val: number) => {
  queryParams.page = val
  getList()
}

// 详情
const handleDetail = (row: SensitiveLogRecord) => {
  currentLog.value = row
  dialogVisible.value = true
}

// 标签颜色
const getMethodTypeTag = (type: string) => {
  const map: Record<string, string> = {
    'SELECT': 'info',
    'ADD': 'success',
    'UPDATE': 'warning',
    'DELETE': 'danger',
    '查询': 'info',
    '新增': 'success',
    '修改': 'warning',
    '删除': 'danger'
  }
  return map[type] || ''
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.code-box {
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
.code-box.error {
  color: #f56c6c;
  background-color: #fef0f0;
  border-color: #fde2e2;
}
</style>
