<template>
  <div class="app-container">
    <!-- Search/Actions -->
    <div class="filter-container">
      <el-button type="primary" icon="Plus" @click="handleCreate">添加联系方式</el-button>
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
      
      <el-table-column label="公司地址" prop="companyAddress" min-width="200" />
      <el-table-column label="公司电话" prop="companyPhone" width="150" />
      <el-table-column label="公司邮箱" prop="companyEmail" width="200" />
      
      <el-table-column label="二维码预览" width="200" align="center">
        <template #default="{ row }">
          <div class="qr-preview">
            <el-popover placement="right" title="微信公众号" :width="200" trigger="hover" v-if="row.wechatOfficialQrCode">
              <template #reference>
                <el-tag size="small">公众号</el-tag>
              </template>
              <el-image :src="row.wechatOfficialQrCode" fit="contain" />
            </el-popover>
             <el-popover placement="right" title="微信小程序" :width="200" trigger="hover" v-if="row.wechatMiniQrCode">
              <template #reference>
                <el-tag size="small" type="success" style="margin-left: 5px">小程序</el-tag>
              </template>
              <el-image :src="row.wechatMiniQrCode" fit="contain" />
            </el-popover>
             <el-popover placement="right" title="小红书" :width="200" trigger="hover" v-if="row.xiaohongshuQrCode">
              <template #reference>
                <el-tag size="small" type="danger" style="margin-left: 5px">小红书</el-tag>
              </template>
              <el-image :src="row.xiaohongshuQrCode" fit="contain" />
            </el-popover>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="排序" prop="sort" width="80" align="center" />
      
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      
      <el-table-column label="备注" prop="remark" min-width="150" show-overflow-tooltip />
      
      <el-table-column label="更新时间" prop="updateTime" width="160" align="center" />

      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
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

    <!-- Dialog -->
    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible" width="800px">
      <el-form
        ref="dataFormRef"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 100%; padding: 0 20px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="公司电话" prop="companyPhone">
              <el-input v-model="temp.companyPhone" placeholder="请输入公司电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
             <el-form-item label="公司邮箱" prop="companyEmail">
              <el-input v-model="temp.companyEmail" placeholder="请输入公司邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="公司地址" prop="companyAddress">
          <el-input v-model="temp.companyAddress" placeholder="请输入公司地址" />
        </el-form-item>

        <el-divider content-position="left">二维码配置 (输入图片URL)</el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="微信公众号" prop="wechatOfficialQrCode">
              <el-input v-model="temp.wechatOfficialQrCode" placeholder="图片URL" />
              <el-input v-model="temp.wechatOfficialName" placeholder="公众号名称" style="margin-top: 5px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
             <el-form-item label="微信小程序" prop="wechatMiniQrCode">
              <el-input v-model="temp.wechatMiniQrCode" placeholder="图片URL" />
              <el-input v-model="temp.wechatMiniName" placeholder="小程序名称" style="margin-top: 5px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="小红书" prop="xiaohongshuQrCode">
              <el-input v-model="temp.xiaohongshuQrCode" placeholder="图片URL" />
              <el-input v-model="temp.xiaohongshuLink" placeholder="主页链接" style="margin-top: 5px" />
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="微信客服" prop="wechatServiceQrCode">
              <el-input v-model="temp.wechatServiceQrCode" placeholder="图片URL" />
            </el-form-item>
          </el-col>
        </el-row>

         <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="课程咨询" prop="courseConsultQrCode">
              <el-input v-model="temp.courseConsultQrCode" placeholder="图片URL" />
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="品牌合作" prop="brandCoopQrCode">
              <el-input v-model="temp.brandCoopQrCode" placeholder="图片URL" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider />

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="temp.sort" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
             <el-form-item label="状态" prop="status">
               <el-switch
                v-model="temp.status"
                active-text="启用"
                inactive-text="禁用"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="temp.remark" :rows="2" placeholder="请输入备注信息" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  getContactList, 
  addContact, 
  updateContact, 
  deleteContact, 
  updateContactStatus 
} from '@/api/contact'

const list = ref([])
const total = ref(0)
const listLoading = ref(true)
const listQuery = reactive({
  page: 1,
  limit: 20
})

const dialogFormVisible = ref(false)
const dialogStatus = ref('create')
const textMap: Record<string, string> = {
  update: '编辑联系方式',
  create: '添加联系方式'
}

const temp = reactive({
  id: undefined,
  companyPhone: '',
  companyEmail: '',
  companyAddress: '',
  wechatOfficialQrCode: '',
  wechatOfficialName: '',
  wechatMiniQrCode: '',
  wechatMiniName: '',
  xiaohongshuQrCode: '',
  xiaohongshuLink: '',
  wechatServiceQrCode: '',
  courseConsultQrCode: '',
  brandCoopQrCode: '',
  sort: 0,
  status: true,
  remark: ''
})

const dataFormRef = ref()
const rules = {
  companyAddress: [{ required: false, message: '请输入公司地址', trigger: 'blur' }],
  companyPhone: [{ required: false, message: '请输入公司电话', trigger: 'blur' }]
}

const resetTemp = () => {
  temp.id = undefined
  temp.companyPhone = ''
  temp.companyEmail = ''
  temp.companyAddress = ''
  temp.wechatOfficialQrCode = ''
  temp.wechatOfficialName = ''
  temp.wechatMiniQrCode = ''
  temp.wechatMiniName = ''
  temp.xiaohongshuQrCode = ''
  temp.xiaohongshuLink = ''
  temp.wechatServiceQrCode = ''
  temp.courseConsultQrCode = ''
  temp.brandCoopQrCode = ''
  temp.sort = 0
  temp.status = true
  temp.remark = ''
}

const getList = async () => {
  listLoading.value = true
  try {
    const res = await getContactList(listQuery) as any
    console.log('Contact List Response:', res)
    
    // Robust data extraction
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
        await addContact(temp)
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
  Object.assign(temp, row)
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
        await updateContact(temp)
        ElMessage.success('更新成功')
        dialogFormVisible.value = false
        getList()
      } catch (error) {
        console.error(error)
      }
    }
  })
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该联系方式吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteContact(row.id)
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      console.error(error)
    }
  })
}

const handleStatusChange = async (row: any) => {
  try {
    await updateContactStatus(row.id, row.status)
    ElMessage.success('状态更新成功')
  } catch (error) {
    row.status = !row.status
    console.error(error)
  }
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.qr-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.filter-container {
  padding-bottom: 10px;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
