<template>
  <el-dialog
    v-model="dialogVisible"
    title="会员卡管理"
    width="1200px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 搜索栏 -->
    <el-form :model="searchForm" inline>
      <el-form-item label="会员卡名称">
        <el-input 
          v-model="searchForm.name" 
          placeholder="请输入会员卡名称" 
          clearable 
          style="width: 200px"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="searchForm.type" placeholder="全部" clearable style="width: 120px">
          <el-option label="试用" :value="0" />
          <el-option label="期限" :value="1" />
          <el-option label="永久" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 120px">
          <el-option label="开启" :value="true" />
          <el-option label="关闭" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="success" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增会员卡
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 会员卡列表 -->
    <el-table v-loading="loading" :data="cardList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="会员卡名称" min-width="150" />
      <el-table-column prop="label" label="标签" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.label" type="info" size="small">{{ row.label }}</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="80">
        <template #default="{ row }">
          <el-tag v-if="row.type === 0" type="success">试用</el-tag>
          <el-tag v-else-if="row.type === 1" type="primary">期限</el-tag>
          <el-tag v-else-if="row.type === 2" type="warning">永久</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="deadlineDay" label="期限(天)" width="100" align="center">
        <template #default="{ row }">
          {{ row.type === 2 ? '永久' : row.deadlineDay }}
        </template>
      </el-table-column>
      <el-table-column prop="originalPrice" label="原价" width="100" align="right">
        <template #default="{ row }">
          ¥{{ row.originalPrice }}
        </template>
      </el-table-column>
      <el-table-column prop="price" label="售价" width="100" align="right">
        <template #default="{ row }">
          <span style="color: #F56C6C; font-weight: 500;">¥{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="giftBalance" label="赠送余额" width="100" align="right">
        <template #default="{ row }">
          ¥{{ row.giftBalance }}
        </template>
      </el-table-column>
      <el-table-column prop="isFirstChargeGive" label="首充专享" width="100" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.isFirstChargeGive" type="warning" size="small">是</el-tag>
          <el-tag v-else type="info" size="small">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="80" align="center" />
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            @change="handleSwitch(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button size="small" text type="primary" @click="handleEdit(row)">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
          <el-button size="small" text type="danger" @click="handleDelete(row)">
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>

  <!-- 会员卡编辑弹窗 -->
  <MemberCardEditDialog 
    v-model="editDialogVisible" 
    :card-info="currentCard"
    @success="handleEditSuccess" 
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { getMemberCardList, switchMemberCard, deleteMemberCard } from '@/api/memberCard'
import MemberCardEditDialog from './MemberCardEditDialog.vue'

interface Props {
  modelValue: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const loading = ref(false)
const cardList = ref<any[]>([])
const editDialogVisible = ref(false)
const currentCard = ref<any>(null)

const searchForm = reactive({
  name: '',
  type: undefined as number | undefined,
  status: undefined as boolean | undefined
})

// 监听对话框打开，加载列表
watch(() => props.modelValue, (val) => {
  if (val) {
    loadList()
  }
})

// 加载会员卡列表
const loadList = async () => {
  loading.value = true
  try {
    const params: any = {}
    if (searchForm.name) params.name = searchForm.name
    if (searchForm.type !== undefined) params.type = searchForm.type
    if (searchForm.status !== undefined) params.status = searchForm.status

    const data = await getMemberCardList(params)
    cardList.value = data || []
  } catch (error) {
    console.error('获取会员卡列表失败:', error)
    ElMessage.error('获取会员卡列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  loadList()
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.type = undefined
  searchForm.status = undefined
  loadList()
}

// 新增
const handleAdd = () => {
  currentCard.value = null
  editDialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  currentCard.value = { ...row }
  editDialogVisible.value = true
}

// 编辑成功
const handleEditSuccess = () => {
  loadList()
  emit('success')
}

// 开关切换
const handleSwitch = async (row: any) => {
  try {
    await switchMemberCard(row.id)
    ElMessage.success('状态修改成功')
    loadList()
  } catch (error) {
    console.error('状态修改失败:', error)
    ElMessage.error('状态修改失败')
    // 恢复原状态
    row.status = !row.status
  }
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除会员卡"${row.name}"吗？删除后不可恢复！`,
      '警告',
      {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }
    )

    await deleteMemberCard(row.id)
    ElMessage.success('删除成功')
    loadList()
    emit('success')
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const handleClose = () => {
  dialogVisible.value = false
}
</script>

<style scoped lang="scss">
.el-form {
  margin-bottom: 16px;
}
</style>
