<template>
  <div class="app-container">
    <!-- Search/Actions -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.keywords"
        placeholder="搜索姓名/电话/邮箱"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter="handleFilter"
      />
      <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 120px" class="filter-item" @change="handleFilter">
        <el-option label="待处理" :value="0" />
        <el-option label="处理中" :value="1" />
        <el-option label="已处理" :value="2" />
      </el-select>
       <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
        class="filter-item"
        style="margin-left: 10px"
        @change="handleFilter"
      />
      <el-button type="primary" class="filter-item" style="margin-left: 10px" @click="handleFilter">
        <el-icon style="margin-right: 5px"><Search /></el-icon>
        搜索
      </el-button>
    </div>

    <!-- Table -->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column label="ID" prop="id" align="center" width="80" />
      
      <el-table-column label="咨询人" width="200">
        <template #default="{ row }">
          <div style="display: flex; align-items: center; gap: 5px;">
            <el-icon><User /></el-icon> {{ row.name }}
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <el-icon><Iphone /></el-icon> {{ row.phone }}
          </div>
          <div v-if="row.email" style="display: flex; align-items: center; gap: 5px;">
            <el-icon><Message /></el-icon> {{ row.email }}
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="咨询内容" prop="content" min-width="300" show-overflow-tooltip />
      
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusName(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="提交时间" prop="createTime" width="160" align="center" />
      
      <el-table-column label="处理人" prop="handlerName" width="120" align="center">
        <template #default="{ row }">
            {{ row.handlerName || '-' }}
        </template>
      </el-table-column>
      
      <el-table-column label="处理时间" prop="handleTime" width="160" align="center">
         <template #default="{ row }">
            {{ row.handleTime || '-' }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleDetail(row)">
            详情/处理
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination-container" v-if="total > 0">
      <el-pagination
        v-model:current-page="listQuery.page"
        v-model:page-size="listQuery.limit"
        :page-sizes="[10, 20, 30, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- Detail Dialog -->
    <el-dialog title="咨询详情处理" v-model="dialogVisible" width="600px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="姓名">{{ currentItem.name }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ currentItem.phone }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ currentItem.email || '-' }}</el-descriptions-item>
        <el-descriptions-item label="提交时间">{{ currentItem.createTime }}</el-descriptions-item>
        <el-descriptions-item label="咨询内容">
          <div style="white-space: pre-wrap;">{{ currentItem.content }}</div>
        </el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">处理结果</el-divider>
      
      <el-form :model="processForm" label-width="80px">
        <el-form-item label="当前状态">
           <el-tag :type="getStatusType(currentItem.status)">
            {{ getStatusName(currentItem.status) }}
          </el-tag>
        </el-form-item>
        <el-form-item label="更新状态">
          <el-radio-group v-model="processForm.status">
            <el-radio :label="0">待处理</el-radio>
            <el-radio :label="1">处理中</el-radio>
            <el-radio :label="2">已处理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理备注">
          <el-input type="textarea" v-model="processForm.remark" :rows="3" placeholder="请输入处理备注" />
        </el-form-item>
        <el-form-item label="处理人" v-if="currentItem.handlerName">
             {{ currentItem.handlerName }} ({{ currentItem.handleTime }})
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="updateStatus">提交处理</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  getConsultationList, 
  updateConsultationStatus, 
  deleteConsultation 
} from '@/api/consultation'

const list = ref<any[]>([])
const total = ref(0)
const listLoading = ref(true)
const dateRange = ref([])
const listQuery = reactive({
  page: 1,
  limit: 20,
  keywords: '',
  status: undefined as number | undefined,
  dateStart: '',
  dateEnd: ''
})

const dialogVisible = ref(false)
const currentItem = ref<any>({})
const processForm = reactive({
  status: 0,
  remark: ''
})

const getStatusName = (status: number) => {
  const map: Record<number, string> = {
    0: '待处理',
    1: '处理中',
    2: '已处理'
  }
  return map[status] || '未知'
}

const getStatusType = (status: number) => {
  const map: Record<number, string> = {
    0: 'danger',
    1: 'warning',
    2: 'success'
  }
  return map[status] || 'info'
}

const getList = async () => {
  listLoading.value = true
  try {
    if (dateRange.value && dateRange.value.length === 2) {
      listQuery.dateStart = dateRange.value[0]
      listQuery.dateEnd = dateRange.value[1]
    } else {
      listQuery.dateStart = ''
      listQuery.dateEnd = ''
    }

    const res = await getConsultationList(listQuery) as any
    console.log('Consultation List Response:', res)
    
    // Robust data extraction
    let actualData = res
    // If response has a 'data' property that looks like the payload (e.g. from Axios or wrapper)
    if (res && res.data) {
        // Check if res.data is the actual list container or another wrapper
        if (res.data.list) {
             actualData = res.data
        } else if (res.data.data && res.data.data.list) {
             actualData = res.data.data
        }
    }
    // Also check if 'data' property exists on the extracted object (common in some backends)
    if (actualData && actualData.data && actualData.data.list) {
        actualData = actualData.data
    }

    if (actualData && Array.isArray(actualData.list)) {
        list.value = actualData.list
        total.value = Number(actualData.total) || 0
    } else {
        list.value = []
        total.value = 0
    }
  } catch (error) {
    console.error(error)
  } finally {
    listLoading.value = false
  }
}

const handleSizeChange = (val: number) => {
  listQuery.limit = val
  getList()
}

const handleCurrentChange = (val: number) => {
  listQuery.page = val
  getList()
}

const handleFilter = () => {
  listQuery.page = 1
  getList()
}

const handleDetail = (row: any) => {
  currentItem.value = row
  processForm.status = row.status
  processForm.remark = row.remark || ''
  dialogVisible.value = true
}

const updateStatus = async () => {
  try {
    await updateConsultationStatus({
      id: currentItem.value.id,
      status: processForm.status,
      remark: processForm.remark
    })
    ElMessage.success('处理成功')
    dialogVisible.value = false
    getList()
  } catch (error) {
    console.error(error)
  }
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该咨询记录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteConsultation(row.id)
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      console.error(error)
    }
  })
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.filter-container {
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.filter-item {
  margin-right: 10px;
  margin-bottom: 10px;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
