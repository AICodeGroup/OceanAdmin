<template>
  <div class="app-container">
    <div class="page-header">
      <h1>徽章管理</h1>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增徽章
      </el-button>
    </div>

    <!-- 查询表单 -->
    <el-card class="search-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="徽章名称">
          <el-input v-model="queryForm.name" placeholder="请输入徽章名称" clearable style="width: 200px" />
        </el-form-item>

        <el-form-item label="徽章类型">
          <el-select v-model="queryForm.typeId" placeholder="请选择" clearable style="width: 150px">
            <el-option 
              v-for="item in badgeTypeList" 
              :key="item.id" 
              :label="item.name" 
              :value="item.id" 
            />
          </el-select>
        </el-form-item>

        <el-form-item label="技能编码">
          <el-select v-model="queryForm.skillCode" placeholder="请选择" clearable style="width: 150px">
            <el-option label="水肺潜水" value="scuba" />
            <el-option label="浮潜" value="snorkel" />
            <el-option label="游泳" value="swim" />
            <el-option label="帆船" value="sailing" />
            <el-option label="桨板" value="paddleboard" />
            <el-option label="冲浪" value="surf" />
            <el-option label="皮划艇" value="kayak" />
            <el-option label="全技能" value="all_skill" />
          </el-select>
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
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="徽章图标" width="100">
          <template #default="{ row }">
            <el-image :src="row.iconUrl" style="width: 50px; height: 50px" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="徽章名称" width="150" />
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column prop="typeName" label="徽章类型" width="120" />
        <el-table-column label="技能编码" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.skillCode">{{ row.skillCode }}</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="等级" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.level === 1" type="success">初级</el-tag>
            <el-tag v-else-if="row.level === 2" type="warning">中级</el-tag>
            <el-tag v-else-if="row.level === 3" type="danger">高级</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="授予方式" width="120">
          <template #default="{ row }">
            <el-tag :type="row.isGranted ? 'primary' : 'success'">
              {{ row.isGranted ? '手动授予' : '自动授予' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="自动授予" width="100">
          <template #default="{ row }">
            <el-tag :type="row.canAutoGrant === 1 ? 'success' : 'info'">
              {{ row.canAutoGrant === 1 ? '允许' : '禁止' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="threshold" label="自动获取阈值" width="120">
          <template #default="{ row }">
            {{ row.threshold || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="success" @click="handleGrant(row)">授予</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
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
          @size-change="handleQuery"
          @current-change="handleQuery"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="徽章名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入徽章名称" />
        </el-form-item>

        <el-form-item label="徽章描述" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入获取条件说明" />
        </el-form-item>

        <el-form-item label="徽章图标" prop="iconUrl">
          <ImageUpload v-model="formData.iconUrl" model="system" :pid="0" placeholder="上传图标" />
        </el-form-item>

        <el-form-item label="徽章类型" prop="typeId">
          <el-select v-model="formData.typeId" placeholder="请选择" style="width: 100%">
            <el-option 
              v-for="item in badgeTypeList" 
              :key="item.id" 
              :label="item.name" 
              :value="item.id" 
            />
          </el-select>
        </el-form-item>

        <el-form-item label="技能编码" prop="skillCode">
          <el-select v-model="formData.skillCode" placeholder="请选择" clearable style="width: 100%">
            <el-option label="水肺潜水" value="scuba" />
            <el-option label="浮潜" value="snorkel" />
            <el-option label="游泳" value="swim" />
            <el-option label="帆船" value="sailing" />
            <el-option label="桨板" value="paddleboard" />
            <el-option label="冲浪" value="surf" />
            <el-option label="皮划艇" value="kayak" />
            <el-option label="全技能" value="all_skill" />
          </el-select>
          <span class="form-tip">技能类徽章必填</span>
        </el-form-item>

        <el-form-item label="徽章等级" prop="level">
          <el-select v-model="formData.level" placeholder="请选择" clearable style="width: 100%">
            <el-option label="初级" :value="1" />
            <el-option label="中级" :value="2" />
            <el-option label="高级" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="达成条件参数" prop="conditionParam">
          <el-input v-model="formData.conditionParam" placeholder='如：{"sessions": 5}' />
          <span class="form-tip">JSON格式的条件参数</span>
        </el-form-item>

        <el-form-item label="授予方式" prop="isGranted">
          <el-radio-group v-model="formData.isGranted">
            <el-radio :value="0">系统自动授予</el-radio>
            <el-radio :value="1">后台手动授予</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="允许自动授予" prop="canAutoGrant">
          <el-radio-group v-model="formData.canAutoGrant">
            <el-radio :value="1">允许</el-radio>
            <el-radio :value="0">禁止</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="自动获取阈值" prop="threshold" v-if="formData.canAutoGrant === 1">
          <el-input-number v-model="formData.threshold" :min="0" :precision="0" />
          <span class="form-tip">达到该节数后自动获取</span>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" :precision="0" />
          <span class="form-tip">数字越小越靠前</span>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 授予徽章对话框 -->
    <el-dialog title="授予徽章" v-model="grantDialogVisible" width="500px">
      <el-form :model="grantForm" ref="grantFormRef" label-width="100px">
        <el-form-item label="用户ID" prop="userIds">
          <el-input v-model="grantForm.userIds" type="textarea" :rows="3" placeholder="请输入用户ID，多个用逗号分隔" />
        </el-form-item>

        <el-form-item label="授予备注">
          <el-input v-model="grantForm.remark" type="textarea" :rows="2" placeholder="选填" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="grantDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleGrantSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import ImageUpload from '@/components/ImageUpload/index.vue'
import {
  getBadgeList,
  addBadge,
  updateBadge,
  deleteBadge,
  getBadgeTypeList,
  batchGrantBadge
} from '@/api/growthSystem'

const loading = ref(false)
const tableData = ref<any[]>([])
const badgeTypeList = ref<any[]>([])
const dialogVisible = ref(false)
const grantDialogVisible = ref(false)
const formRef = ref()
const grantFormRef = ref()
const editMode = ref(false)

const queryForm = reactive({
  name: '',
  typeId: undefined,
  skillCode: ''
})

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

const formData = ref({
  id: undefined,
  name: '',
  description: '',
  iconUrl: '',
  typeId: undefined,
  skillCode: '',
  level: undefined,
  conditionParam: '',
  isGranted: 0,
  canAutoGrant: 0,
  threshold: undefined,
  sort: 0
})

const grantForm = ref({
  badgeId: undefined,
  userIds: '',
  remark: ''
})

const rules = {
  name: [{ required: true, message: '请输入徽章名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入徽章描述', trigger: 'blur' }],
  iconUrl: [{ required: true, message: '请上传徽章图标', trigger: 'change' }],
  typeId: [{ required: true, message: '请选择徽章类型', trigger: 'change' }],
  isGranted: [{ required: true, message: '请选择授予方式', trigger: 'change' }]
}

const dialogTitle = computed(() => editMode.value ? '编辑徽章' : '新增徽章')

// 加载徽章类型列表
const loadBadgeTypeList = async () => {
  try {
    const data = await getBadgeTypeList()
    badgeTypeList.value = data || []
  } catch (error) {
    console.error('加载徽章类型失败:', error)
  }
}

// 查询
const handleQuery = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      limit: pagination.limit,
      ...queryForm
    }

    const data = await getBadgeList(params)
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
  queryForm.name = ''
  queryForm.typeId = undefined
  queryForm.skillCode = ''
  pagination.page = 1
  handleQuery()
}

// 新增
const handleAdd = () => {
  editMode.value = false
  formData.value = {
    id: undefined,
    name: '',
    description: '',
    iconUrl: '',
    typeId: undefined,
    skillCode: '',
    level: undefined,
    conditionParam: '',
    isGranted: 0,
    canAutoGrant: 0,
    threshold: undefined,
    sort: 0
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
        await updateBadge(formData.value)
        ElMessage.success('更新成功')
      } else {
        await addBadge(formData.value)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      handleQuery()
    } catch (error) {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    } finally {
      loading.value = false
    }
  })
}

// 授予
const handleGrant = (row: any) => {
  grantForm.value = {
    badgeId: row.id,
    userIds: '',
    remark: ''
  }
  grantDialogVisible.value = true
}

// 提交授予
const handleGrantSubmit = async () => {
  if (!grantForm.value.userIds) {
    ElMessage.warning('请输入用户ID')
    return
  }

  try {
    const userIdArray = grantForm.value.userIds.split(',').map(id => id.trim()).filter(id => id)
    await batchGrantBadge({
      badgeId: grantForm.value.badgeId,
      userIds: userIdArray,
      remark: grantForm.value.remark
    })
    ElMessage.success('授予成功')
    grantDialogVisible.value = false
  } catch (error) {
    console.error('授予失败:', error)
    ElMessage.error('授予失败')
  }
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该徽章吗？', '提示', {
      type: 'warning'
    })

    await deleteBadge(row.id)
    ElMessage.success('删除成功')
    handleQuery()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadBadgeTypeList()
  handleQuery()
})
</script>

<style scoped lang="scss">
.app-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.form-tip {
  margin-left: 10px;
  font-size: 12px;
  color: #909399;
}
</style>
