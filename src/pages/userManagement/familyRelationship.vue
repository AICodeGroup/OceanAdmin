<template>
  <div class="app-container">
    <!-- Search Form -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.parentPhone"
        placeholder="申请人手机号"
        style="width: 180px;"
        class="filter-item"
        clearable
        @keyup.enter="handleFilter"
      />
      <el-input
        v-model="listQuery.childPhone"
        placeholder="被申请人手机号"
        style="width: 180px;"
        class="filter-item"
        clearable
        @keyup.enter="handleFilter"
      />
      <el-input
        v-model="listQuery.parentNickname"
        placeholder="申请人昵称"
        style="width: 150px;"
        class="filter-item"
        clearable
        @keyup.enter="handleFilter"
      />
      <el-input
        v-model="listQuery.childNickname"
        placeholder="被申请人昵称"
        style="width: 150px;"
        class="filter-item"
        clearable
        @keyup.enter="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="关系状态"
        clearable
        style="width: 120px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option label="待同意" :value="0" />
        <el-option label="已同意" :value="1" />
        <el-option label="已拒绝" :value="2" />
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
      <el-button class="filter-item" @click="handleReset">重置</el-button>
    </div>

    <!-- Action Bar -->
    <div class="toolbar">
      <el-button type="primary" @click="handleCreate">
        <el-icon style="margin-right: 5px"><Plus /></el-icon>
        添加家人关系
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
      
      <el-table-column label="申请人(家长)" width="250">
        <template #default="{ row }">
          <div class="user-info">
            <el-avatar :size="45" :src="row.parentAvatar" />
            <div class="info">
              <div class="name">{{ row.parentNickname }}</div>
              <div class="phone">{{ row.parentPhone }}</div>
              <div class="real-name" v-if="row.parentRealName">{{ row.parentRealName }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="被申请人(孩子)" width="250">
        <template #default="{ row }">
          <div class="user-info">
            <el-avatar :size="45" :src="row.childAvatar" />
            <div class="info">
              <div class="name">{{ row.childNickname }}</div>
              <div class="phone">{{ row.childPhone }}</div>
              <div class="real-name" v-if="row.childRealName">{{ row.childRealName }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="关系状态" width="120" align="center">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ row.statusText }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="创建时间" prop="createdAt" width="160" align="center" />
      <el-table-column label="更新时间" prop="updatedAt" width="160" align="center" />

      <el-table-column label="操作" align="center" width="250" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleDetail(row)">
            详情
          </el-button>
          <el-button type="warning" size="small" @click="handleUpdate(row)">
            编辑
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

    <!-- Add/Edit Dialog -->
    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible" width="600px">
      <el-form
        ref="dataFormRef"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 100%; padding: 0 20px"
      >
        <el-form-item label="申请人(家长)" prop="parentUserId">
          <el-select
            v-model="temp.parentUserId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入手机号或昵称搜索用户"
            :remote-method="searchParentUsers"
            :loading="parentUserLoading"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="item in parentUserOptions"
              :key="item.id"
              :label="`${item.nickname} (${item.phone})`"
              :value="item.id"
            >
              <div style="display: flex; align-items: center; gap: 8px">
                <el-avatar :size="30" :src="item.avatar" />
                <div>
                  <div>{{ item.nickname }}</div>
                  <div style="font-size: 12px; color: #909399">{{ item.phone }}</div>
                </div>
              </div>
            </el-option>
          </el-select>
          <span class="form-tip">搜索并选择申请人(家长)</span>
        </el-form-item>
        <el-form-item label="被申请人(孩子)" prop="childUserId">
          <el-select
            v-model="temp.childUserId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入手机号或昵称搜索用户"
            :remote-method="searchChildUsers"
            :loading="childUserLoading"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="item in childUserOptions"
              :key="item.id"
              :label="`${item.nickname} (${item.phone})`"
              :value="item.id"
            >
              <div style="display: flex; align-items: center; gap: 8px">
                <el-avatar :size="30" :src="item.avatar" />
                <div>
                  <div>{{ item.nickname }}</div>
                  <div style="font-size: 12px; color: #909399">{{ item.phone }}</div>
                </div>
              </div>
            </el-option>
          </el-select>
          <span class="form-tip">搜索并选择被申请人(孩子)</span>
        </el-form-item>
        <el-form-item label="关系状态" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio :label="0">待同意</el-radio>
            <el-radio :label="1">已同意</el-radio>
            <el-radio :label="2">已拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Detail Dialog -->
    <el-dialog title="家人关系详情" v-model="detailDialogVisible" width="700px">
      <el-descriptions :column="2" border v-if="currentItem">
        <el-descriptions-item label="关系ID" :span="2">{{ currentItem.id }}</el-descriptions-item>
        
        <el-descriptions-item label="申请人ID">{{ currentItem.parentUserId }}</el-descriptions-item>
        <el-descriptions-item label="申请人昵称">{{ currentItem.parentNickname }}</el-descriptions-item>
        <el-descriptions-item label="申请人真实姓名">{{ currentItem.parentRealName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="申请人手机号">{{ currentItem.parentPhone }}</el-descriptions-item>
        
        <el-descriptions-item label="被申请人ID">{{ currentItem.childUserId }}</el-descriptions-item>
        <el-descriptions-item label="被申请人昵称">{{ currentItem.childNickname }}</el-descriptions-item>
        <el-descriptions-item label="被申请人真实姓名">{{ currentItem.childRealName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="被申请人手机号">{{ currentItem.childPhone }}</el-descriptions-item>
        
        <el-descriptions-item label="关系状态" :span="2">
          <el-tag :type="getStatusType(currentItem.status)">
            {{ currentItem.statusText }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ currentItem.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="2">{{ currentItem.updatedAt }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import {
  getFamilyRelationshipList,
  getFamilyRelationshipDetail,
  addFamilyRelationship,
  updateFamilyRelationship,
  deleteFamilyRelationship
} from '@/api/familyRelationship'
import { getUserList } from '@/api/user'

const list = ref<any[]>([])
const total = ref(0)
const listLoading = ref(true)
const dateRange = ref([])
const listQuery = reactive({
  page: 1,
  limit: 20,
  parentUserId: undefined as number | undefined,
  childUserId: undefined as number | undefined,
  status: undefined as number | undefined,
  parentPhone: '',
  childPhone: '',
  parentNickname: '',
  childNickname: '',
  dateStart: '',
  dateEnd: ''
})

const dialogFormVisible = ref(false)
const detailDialogVisible = ref(false)
const dialogStatus = ref('create')
const textMap: Record<string, string> = {
  update: '编辑家人关系',
  create: '添加家人关系'
}

const temp = reactive({
  id: undefined as number | undefined,
  parentUserId: undefined as number | undefined,
  childUserId: undefined as number | undefined,
  status: 1
})

const currentItem = ref<any>(null)
const dataFormRef = ref()

const parentUserOptions = ref<any[]>([])
const childUserOptions = ref<any[]>([])
const parentUserLoading = ref(false)
const childUserLoading = ref(false)

const rules = {
  parentUserId: [{ required: true, message: '请输入申请人ID', trigger: 'blur' }],
  childUserId: [{ required: true, message: '请输入被申请人ID', trigger: 'blur' }],
  status: [{ required: true, message: '请选择关系状态', trigger: 'change' }]
}

const getStatusType = (status: number) => {
  const map: Record<number, string> = {
    0: 'warning',
    1: 'success',
    2: 'danger'
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

    const res = await getFamilyRelationshipList(listQuery) as any
    console.log('Family Relationship List Response:', res)
    
    let actualData = res
    if (res && res.data) {
        if (res.data.list) {
             actualData = res.data
        } else if (res.data.data && res.data.data.list) {
             actualData = res.data.data
        }
    }
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

const handleReset = () => {
  listQuery.parentUserId = undefined
  listQuery.childUserId = undefined
  listQuery.status = undefined
  listQuery.parentPhone = ''
  listQuery.childPhone = ''
  listQuery.parentNickname = ''
  listQuery.childNickname = ''
  dateRange.value = []
  handleFilter()
}

const resetTemp = () => {
  temp.id = undefined
  temp.parentUserId = undefined
  temp.childUserId = undefined
  temp.status = 1
}

const handleCreate = () => {
  resetTemp()
  dialogStatus.value = 'create'
  dialogFormVisible.value = true
  if (dataFormRef.value) {
    dataFormRef.value.clearValidate()
  }
}

const createData = () => {
  dataFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await addFamilyRelationship({
          parentUserId: temp.parentUserId!,
          childUserId: temp.childUserId!,
          status: temp.status
        })
        ElMessage.success('添加成功')
        dialogFormVisible.value = false
        getList()
      } catch (error) {
        console.error(error)
      }
    }
  })
}

const handleUpdate = (row: any) => {
  temp.id = row.id
  temp.parentUserId = row.parentUserId
  temp.childUserId = row.childUserId
  temp.status = row.status
  dialogStatus.value = 'update'
  dialogFormVisible.value = true
  if (dataFormRef.value) {
    dataFormRef.value.clearValidate()
  }
}

const updateData = () => {
  dataFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await updateFamilyRelationship({
          id: temp.id!,
          parentUserId: temp.parentUserId,
          childUserId: temp.childUserId,
          status: temp.status
        })
        ElMessage.success('更新成功')
        dialogFormVisible.value = false
        getList()
      } catch (error) {
        console.error(error)
      }
    }
  })
}

const handleDetail = async (row: any) => {
  try {
    const res = await getFamilyRelationshipDetail(row.id) as any
    if (res) {
      currentItem.value = res
      detailDialogVisible.value = true
    }
  } catch (error) {
    console.error(error)
  }
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该家人关系吗? 删除后无法恢复。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteFamilyRelationship(row.id)
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      console.error(error)
    }
  })
}

const searchParentUsers = async (query: string) => {
  if (!query) {
    parentUserOptions.value = []
    return
  }
  parentUserLoading.value = true
  try {
    const res = await getUserList({
      page: 1,
      limit: 200,
      keyword: query
    }) as any
    
    let actualData = res
    if (res && res.data) {
      if (res.data.list) {
        actualData = res.data
      } else if (res.data.data && res.data.data.list) {
        actualData = res.data.data
      }
    }
    if (actualData && actualData.data && actualData.data.list) {
      actualData = actualData.data
    }
    
    if (actualData && Array.isArray(actualData.list)) {
      parentUserOptions.value = actualData.list
    } else {
      parentUserOptions.value = []
    }
  } catch (error) {
    console.error(error)
    parentUserOptions.value = []
  } finally {
    parentUserLoading.value = false
  }
}

const searchChildUsers = async (query: string) => {
  if (!query) {
    childUserOptions.value = []
    return
  }
  childUserLoading.value = true
  try {
    const res = await getUserList({
      page: 1,
      limit: 200,
      keyword: query
    }) as any
    
    let actualData = res
    if (res && res.data) {
      if (res.data.list) {
        actualData = res.data
      } else if (res.data.data && res.data.data.list) {
        actualData = res.data.data
      }
    }
    if (actualData && actualData.data && actualData.data.list) {
      actualData = actualData.data
    }
    
    if (actualData && Array.isArray(actualData.list)) {
      childUserOptions.value = actualData.list
    } else {
      childUserOptions.value = []
    }
  } catch (error) {
    console.error(error)
    childUserOptions.value = []
  } finally {
    childUserLoading.value = false
  }
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

.toolbar {
  margin-bottom: 15px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info .info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-info .name {
  font-weight: 500;
  font-size: 14px;
  color: #303133;
}

.user-info .phone {
  font-size: 12px;
  color: #909399;
}

.user-info .real-name {
  font-size: 12px;
  color: #606266;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
  display: block;
}
</style>
