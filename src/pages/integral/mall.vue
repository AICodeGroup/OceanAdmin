<template>
  <div class="app-container">
    <div class="page-header">
      <h1>积分商城管理</h1>
    </div>

    <!-- 搜索区域 -->
    <div class="card-container">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.name" placeholder="请输入商品名称" clearable />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="searchForm.category" placeholder="请选择分类" clearable>
            <el-option label="实物商品" value="physical" />
            <el-option label="虚拟商品" value="virtual" />
            <el-option label="优惠券" value="coupon" />
            <el-option label="会员权益" value="membership" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
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
    </div>

    <!-- 操作按钮 -->
    <div class="button-group">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增商品
      </el-button>
      <el-button type="success" @click="handleExchangeRecords">
        <el-icon><Document /></el-icon>
        兑换记录
      </el-button>
    </div>

    <!-- 表格 -->
    <div class="card-container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="商品图片" width="100">
          <template #default="scope">
            <el-image
              v-if="scope.row.image"
              :src="scope.row.image"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 8px"
            />
            <div v-else class="no-image">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" />
        <el-table-column label="商品分类" width="120">
          <template #default="scope">
            <el-tag :type="getCategoryColor(scope.row.category)">
              {{ getCategoryText(scope.row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="所需积分" width="100">
          <template #default="scope">
            <span class="points">{{ scope.row.points }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80" />
        <el-table-column prop="exchangeCount" label="兑换次数" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="info" size="small" @click="handleView(scope.row)">
              详情
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 商品详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="商品详情"
      width="600px"
    >
      <div v-if="currentProduct" class="product-detail">
        <div class="product-header">
          <div class="product-image">
            <el-image
              v-if="currentProduct.image"
              :src="currentProduct.image"
              fit="cover"
              style="width: 120px; height: 120px; border-radius: 8px"
            />
            <div v-else class="no-image-large">
              <el-icon><Picture /></el-icon>
            </div>
          </div>
          <div class="product-info">
            <h3>{{ currentProduct.name }}</h3>
            <el-tag :type="getCategoryColor(currentProduct.category)">
              {{ getCategoryText(currentProduct.category) }}
            </el-tag>
            <div class="points-info">
              <span class="points-label">所需积分：</span>
              <span class="points-value">{{ currentProduct.points }}</span>
            </div>
          </div>
        </div>
        
        <el-descriptions :column="2" border>
          <el-descriptions-item label="商品ID">{{ currentProduct.id }}</el-descriptions-item>
          <el-descriptions-item label="库存数量">{{ currentProduct.stock }}</el-descriptions-item>
          <el-descriptions-item label="兑换次数">{{ currentProduct.exchangeCount }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentProduct.status === 1 ? 'success' : 'danger'">
              {{ currentProduct.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentProduct.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentProduct.updateTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="商品描述" :span="2">{{ currentProduct.description }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- 添加/编辑商品对话框 -->
    <el-dialog
      v-model="formVisible"
      :title="formTitle"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
            <el-option label="实物商品" value="physical" />
            <el-option label="虚拟商品" value="virtual" />
            <el-option label="优惠券" value="coupon" />
            <el-option label="会员权益" value="membership" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品图片" prop="image">
          <el-input v-model="form.image" placeholder="请输入图片URL" />
        </el-form-item>
        <el-form-item label="所需积分" prop="points">
          <el-input-number v-model="form.points" :min="1" placeholder="请输入所需积分" />
        </el-form-item>
        <el-form-item label="库存数量" prop="stock">
          <el-input-number v-model="form.stock" :min="0" placeholder="请输入库存数量" />
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入商品描述" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// 响应式数据
const loading = ref(false)
const detailVisible = ref(false)
const formVisible = ref(false)
const formTitle = ref('新增商品')
const currentProduct = ref<any>(null)
const formRef = ref<FormInstance>()

const tableData = ref([
  {
    id: 1,
    name: '海洋主题T恤',
    category: 'physical',
    image: 'https://via.placeholder.com/60x60',
    points: 500,
    stock: 100,
    exchangeCount: 25,
    status: 1,
    description: '100%纯棉海洋主题T恤，舒适透气',
    createTime: '2024-01-31 10:30:00',
    updateTime: null
  },
  {
    id: 2,
    name: '课程优惠券',
    category: 'coupon',
    image: 'https://via.placeholder.com/60x60',
    points: 200,
    stock: 500,
    exchangeCount: 89,
    status: 1,
    description: '任意课程8折优惠券，有效期30天',
    createTime: '2024-01-30 09:15:00',
    updateTime: '2024-01-31 14:20:00'
  },
  {
    id: 3,
    name: '会员月卡',
    category: 'membership',
    image: 'https://via.placeholder.com/60x60',
    points: 1000,
    stock: 200,
    exchangeCount: 45,
    status: 1,
    description: '30天会员权益，享受专属课程和服务',
    createTime: '2024-01-29 14:00:00',
    updateTime: null
  }
])

// 搜索表单
const searchForm = reactive({
  name: '',
  category: '',
  status: ''
})

// 表单数据
const form = reactive({
  id: null,
  name: '',
  category: '',
  image: '',
  points: 0,
  stock: 0,
  description: '',
  status: 1
})

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  points: [{ required: true, message: '请输入所需积分', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
  description: [{ required: true, message: '请输入商品描述', trigger: 'blur' }]
}

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 3
})

// 获取分类颜色
const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    physical: 'primary',
    virtual: 'success',
    coupon: 'warning',
    membership: 'danger'
  }
  return colorMap[category] || 'info'
}

// 获取分类文本
const getCategoryText = (category: string) => {
  const textMap: Record<string, string> = {
    physical: '实物商品',
    virtual: '虚拟商品',
    coupon: '优惠券',
    membership: '会员权益'
  }
  return textMap[category] || category
}

// 处理搜索
const handleSearch = () => {
  pagination.page = 1
  // 搜索逻辑
}

// 处理重置
const handleReset = () => {
  Object.assign(searchForm, {
    name: '',
    category: '',
    status: ''
  })
  pagination.page = 1
}

// 处理新增
const handleAdd = () => {
  formTitle.value = '新增商品'
  formVisible.value = true
}

// 处理编辑
const handleEdit = (row: any) => {
  formTitle.value = '编辑商品'
  Object.assign(form, row)
  formVisible.value = true
}

// 处理查看详情
const handleView = (row: any) => {
  currentProduct.value = row
  detailVisible.value = true
}

// 处理状态变更
const handleStatusChange = (row: any) => {
  const statusText = row.status === 1 ? '上架' : '下架'
  ElMessage.success(`商品${statusText}成功`)
}

// 处理删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除此商品吗？删除后无法恢复！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      pagination.total--
    }
    ElMessage.success('删除成功')
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 处理提交
const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (form.id) {
          ElMessage.success('更新成功')
        } else {
          ElMessage.success('创建成功')
        }
        formVisible.value = false
      } catch (error) {
        console.error('提交失败:', error)
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: null,
    name: '',
    category: '',
    image: '',
    points: 0,
    stock: 0,
    description: '',
    status: 1
  })
  formRef.value?.resetFields()
}

// 处理兑换记录
const handleExchangeRecords = () => {
  ElMessage.info('兑换记录功能开发中...')
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.size = size
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
}

onMounted(() => {
  // 初始化数据
})
</script>

<style lang="scss" scoped>
.search-form {
  .el-form-item {
    margin-bottom: 0;
  }
}

.no-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  font-size: 24px;
}

.points {
  color: #e6a23c;
  font-weight: bold;
}

.product-detail {
  .product-header {
    display: flex;
    margin-bottom: 20px;
    
    .product-image {
      margin-right: 20px;
      
      .no-image-large {
        width: 120px;
        height: 120px;
        border-radius: 8px;
        background: #f5f7fa;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #c0c4cc;
        font-size: 48px;
      }
    }
    
    .product-info {
      flex: 1;
      
      h3 {
        margin: 0 0 10px 0;
        color: #303133;
        font-size: 20px;
      }
      
      .points-info {
        margin-top: 15px;
        
        .points-label {
          color: #606266;
          font-size: 14px;
        }
        
        .points-value {
          color: #e6a23c;
          font-size: 18px;
          font-weight: bold;
          margin-left: 5px;
        }
      }
    }
  }
}
</style>