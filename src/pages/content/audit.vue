<template>
  <div class="app-container">
    <div class="page-header">
      <h1>内容审核</h1>
    </div>

    <!-- 审核统计卡片 -->
    <div class="stats-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon pending">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.pending }}</div>
              <div class="stat-label">待审核</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon approved">
              <el-icon><Check /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.approved }}</div>
              <div class="stat-label">已通过</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon rejected">
              <el-icon><Close /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.rejected }}</div>
              <div class="stat-label">已拒绝</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon reported">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.reported }}</div>
              <div class="stat-label">被举报</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 搜索区域 -->
    <div class="card-container">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="内容类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="观察日记" value="diary" />
            <el-option label="评论" value="comment" />
            <el-option label="回复" value="reply" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待审核" :value="0" />
            <el-option label="已通过" :value="1" />
            <el-option label="已拒绝" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="请输入关键词" clearable />
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
      <el-button type="success" :disabled="!multipleSelection.length" @click="handleBatchApprove">
        <el-icon><Check /></el-icon>
        批量通过
      </el-button>
      <el-button type="danger" :disabled="!multipleSelection.length" @click="handleBatchReject">
        <el-icon><Close /></el-icon>
        批量拒绝
      </el-button>
      <el-button type="warning" @click="handleSensitiveWords">
        <el-icon><Filter /></el-icon>
        敏感词管理
      </el-button>
      <el-button type="info" @click="handleAuditLog">
        <el-icon><Document /></el-icon>
        审核日志
      </el-button>
    </div>

    <!-- 表格 -->
    <div class="card-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="内容类型" width="100">
          <template #default="scope">
            <el-tag :type="getTypeColor(scope.row.type)">
              {{ getTypeText(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="title" label="标题/内容" min-width="200">
          <template #default="scope">
            <div class="content-preview">
              <div class="content-title">{{ scope.row.title || '无标题' }}</div>
              <div class="content-text">{{ scope.row.content }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="100">
          <template #default="scope">
            <el-image
              v-if="scope.row.images && scope.row.images.length > 0"
              :src="scope.row.images[0]"
              :preview-src-list="scope.row.images"
              :preview-teleported="true"
              fit="cover"
              style="width: 60px; height: 40px; border-radius: 4px"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reportCount" label="举报次数" width="100">
          <template #default="scope">
            <span v-if="scope.row.reportCount > 0" class="report-count">
              {{ scope.row.reportCount }}
            </span>
            <span v-else>0</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleView(scope.row)">
              详情
            </el-button>
            <el-button 
              v-if="scope.row.status === 0"
              type="success" 
              size="small" 
              @click="handleApprove(scope.row)"
            >
              通过
            </el-button>
            <el-button 
              v-if="scope.row.status === 0"
              type="danger" 
              size="small" 
              @click="handleReject(scope.row)"
            >
              拒绝
            </el-button>
            <el-button 
              v-if="scope.row.reportCount > 0"
              type="warning" 
              size="small" 
              @click="handleViewReports(scope.row)"
            >
              举报详情
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

    <!-- 内容详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="内容详情"
      width="800px"
    >
      <div v-if="currentContent" class="content-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="内容ID">{{ currentContent.id }}</el-descriptions-item>
          <el-descriptions-item label="内容类型">
            <el-tag :type="getTypeColor(currentContent.type)">
              {{ getTypeText(currentContent.type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="用户名">{{ currentContent.username }}</el-descriptions-item>
          <el-descriptions-item label="用户手机">{{ currentContent.userPhone }}</el-descriptions-item>
          <el-descriptions-item label="审核状态">
            <el-tag :type="getStatusType(currentContent.status)">
              {{ getStatusText(currentContent.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="举报次数">{{ currentContent.reportCount || 0 }}</el-descriptions-item>
          <el-descriptions-item label="发布时间">{{ currentContent.createTime }}</el-descriptions-item>
          <el-descriptions-item label="审核时间">{{ currentContent.auditTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="标题" :span="2">{{ currentContent.title || '-' }}</el-descriptions-item>
          <el-descriptions-item label="内容" :span="2">
            <div class="content-full">{{ currentContent.content }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="审核备注" :span="2">{{ currentContent.auditRemark || '-' }}</el-descriptions-item>
        </el-descriptions>
        
        <!-- 内容图片 -->
        <div v-if="currentContent.images && currentContent.images.length > 0" class="content-images">
          <h4>相关图片</h4>
          <div class="image-gallery">
            <el-image
              v-for="(image, index) in currentContent.images"
              :key="index"
              :src="image"
              :preview-src-list="currentContent.images"
              :preview-teleported="true"
              fit="cover"
              class="gallery-image"
            />
          </div>
        </div>
      </div>
      
      <!-- 审核操作 -->
      <div v-if="currentContent && currentContent.status === 0" class="audit-actions">
        <el-divider>审核操作</el-divider>
        <el-form :model="auditForm" label-width="100px">
          <el-form-item label="审核结果">
            <el-radio-group v-model="auditForm.result">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="2">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核备注">
            <el-input v-model="auditForm.remark" type="textarea" :rows="3" placeholder="请输入审核备注" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAuditSubmit">提交审核</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 敏感词管理对话框 -->
    <el-dialog
      v-model="sensitiveWordsVisible"
      title="敏感词管理"
      width="600px"
    >
      <div class="sensitive-words-content">
        <div class="add-word">
          <el-input
            v-model="newSensitiveWord"
            placeholder="请输入敏感词"
            style="width: 200px; margin-right: 10px"
          />
          <el-button type="primary" @click="handleAddSensitiveWord">添加</el-button>
        </div>
        
        <div class="words-list">
          <el-tag
            v-for="word in sensitiveWords"
            :key="word.id"
            closable
            @close="handleDeleteSensitiveWord(word.id)"
            style="margin: 5px"
          >
            {{ word.word }}
          </el-tag>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 响应式数据
const loading = ref(false)
const detailVisible = ref(false)
const sensitiveWordsVisible = ref(false)
const currentContent = ref<any>(null)
const multipleSelection = ref([])
const newSensitiveWord = ref('')

// 统计数据
const stats = reactive({
  pending: 25,
  approved: 156,
  rejected: 12,
  reported: 8
})

const tableData = ref([
  {
    id: 1,
    type: 'diary',
    username: '小海豚',
    userPhone: '13800138001',
    title: '今天的海洋观察日记',
    content: '今天在海洋馆看到了很多美丽的海洋生物，特别是那些五彩斑斓的热带鱼...',
    images: ['https://via.placeholder.com/300x200'],
    status: 0,
    reportCount: 0,
    createTime: '2024-01-31 10:30:00',
    auditTime: null,
    auditRemark: null
  },
  {
    id: 2,
    type: 'comment',
    username: '海洋妈妈',
    userPhone: '13800138002',
    title: null,
    content: '这个课程真的很棒，孩子学到了很多海洋知识！',
    images: [],
    status: 1,
    reportCount: 0,
    createTime: '2024-01-31 09:15:00',
    auditTime: '2024-01-31 09:20:00',
    auditRemark: '内容健康，通过审核'
  },
  {
    id: 3,
    type: 'diary',
    username: '小鲸鱼',
    userPhone: '13800138003',
    title: '深海探险记录',
    content: '今天体验了深海探险，感觉非常刺激和有趣...',
    images: ['https://via.placeholder.com/300x200', 'https://via.placeholder.com/300x200'],
    status: 0,
    reportCount: 2,
    createTime: '2024-01-31 14:20:00',
    auditTime: null,
    auditRemark: null
  }
])

// 搜索表单
const searchForm = reactive({
  type: '',
  status: '',
  username: '',
  keyword: ''
})

// 审核表单
const auditForm = reactive({
  result: 1,
  remark: ''
})

// 敏感词列表
const sensitiveWords = ref([
  { id: 1, word: '垃圾' },
  { id: 2, word: '骗子' },
  { id: 3, word: '广告' }
])

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 3
})

// 获取类型颜色
const getTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    diary: 'primary',
    comment: 'success',
    reply: 'info'
  }
  return colorMap[type] || 'info'
}

// 获取类型文本
const getTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    diary: '观察日记',
    comment: '评论',
    reply: '回复'
  }
  return textMap[type] || type
}

// 获取状态类型
const getStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    0: 'warning',
    1: 'success',
    2: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: number) => {
  const textMap: Record<number, string> = {
    0: '待审核',
    1: '已通过',
    2: '已拒绝'
  }
  return textMap[status] || '未知'
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    setTimeout(() => {
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取内容列表失败:', error)
    loading.value = false
  }
}

// 处理选择变化
const handleSelectionChange = (selection: any[]) => {
  multipleSelection.value = selection
}

// 处理搜索
const handleSearch = () => {
  pagination.page = 1
  getList()
}

// 处理重置
const handleReset = () => {
  Object.assign(searchForm, {
    type: '',
    status: '',
    username: '',
    keyword: ''
  })
  pagination.page = 1
  getList()
}

// 处理查看详情
const handleView = (row: any) => {
  currentContent.value = row
  auditForm.result = 1
  auditForm.remark = ''
  detailVisible.value = true
}

// 处理通过审核
const handleApprove = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要通过此内容的审核吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    row.status = 1
    row.auditTime = new Date().toLocaleString()
    row.auditRemark = '内容健康，通过审核'
    ElMessage.success('审核通过')
  } catch (error) {
    console.error('审核失败:', error)
  }
}

// 处理拒绝审核
const handleReject = async (row: any) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入拒绝原因', '拒绝审核', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入拒绝原因'
    })
    
    row.status = 2
    row.auditTime = new Date().toLocaleString()
    row.auditRemark = value
    ElMessage.success('审核拒绝')
  } catch (error) {
    console.error('审核失败:', error)
  }
}

// 处理批量通过
const handleBatchApprove = async () => {
  try {
    await ElMessageBox.confirm('确定要批量通过选中的内容吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    multipleSelection.value.forEach((item: any) => {
      if (item.status === 0) {
        item.status = 1
        item.auditTime = new Date().toLocaleString()
        item.auditRemark = '批量审核通过'
      }
    })
    ElMessage.success('批量审核通过')
  } catch (error) {
    console.error('批量审核失败:', error)
  }
}

// 处理批量拒绝
const handleBatchReject = async () => {
  try {
    const { value } = await ElMessageBox.prompt('请输入拒绝原因', '批量拒绝审核', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入拒绝原因'
    })
    
    multipleSelection.value.forEach((item: any) => {
      if (item.status === 0) {
        item.status = 2
        item.auditTime = new Date().toLocaleString()
        item.auditRemark = value
      }
    })
    ElMessage.success('批量审核拒绝')
  } catch (error) {
    console.error('批量审核失败:', error)
  }
}

// 处理审核提交
const handleAuditSubmit = () => {
  if (currentContent.value) {
    currentContent.value.status = auditForm.result
    currentContent.value.auditTime = new Date().toLocaleString()
    currentContent.value.auditRemark = auditForm.remark || (auditForm.result === 1 ? '审核通过' : '审核拒绝')
    
    ElMessage.success('审核提交成功')
    detailVisible.value = false
  }
}

// 处理查看举报详情
const handleViewReports = (row: any) => {
  ElMessage.info('举报详情功能开发中...')
}

// 处理敏感词管理
const handleSensitiveWords = () => {
  sensitiveWordsVisible.value = true
}

// 处理添加敏感词
const handleAddSensitiveWord = () => {
  if (!newSensitiveWord.value.trim()) {
    ElMessage.warning('请输入敏感词')
    return
  }
  
  const newId = Math.max(...sensitiveWords.value.map(w => w.id)) + 1
  sensitiveWords.value.push({
    id: newId,
    word: newSensitiveWord.value.trim()
  })
  
  newSensitiveWord.value = ''
  ElMessage.success('添加成功')
}

// 处理删除敏感词
const handleDeleteSensitiveWord = (id: number) => {
  const index = sensitiveWords.value.findIndex(w => w.id === id)
  if (index > -1) {
    sensitiveWords.value.splice(index, 1)
    ElMessage.success('删除成功')
  }
}

// 处理审核日志
const handleAuditLog = () => {
  ElMessage.info('审核日志功能开发中...')
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.size = size
  getList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  getList()
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.stats-container {
  margin-bottom: 20px;
  
  .stat-card {
    display: flex;
    align-items: center;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      font-size: 24px;
      color: white;
      
      &.pending {
        background: #e6a23c;
      }
      
      &.approved {
        background: #67c23a;
      }
      
      &.rejected {
        background: #f56c6c;
      }
      
      &.reported {
        background: #909399;
      }
    }
    
    .stat-content {
      .stat-number {
        font-size: 28px;
        font-weight: bold;
        color: #303133;
        line-height: 1;
      }
      
      .stat-label {
        font-size: 14px;
        color: #909399;
        margin-top: 5px;
      }
    }
  }
}

.search-form {
  .el-form-item {
    margin-bottom: 0;
  }
}

.content-preview {
  .content-title {
    font-weight: bold;
    color: #303133;
    margin-bottom: 5px;
  }
  
  .content-text {
    color: #606266;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
  }
}

.report-count {
  color: #f56c6c;
  font-weight: bold;
}

.content-detail {
  .el-descriptions {
    margin-bottom: 20px;
  }
  
  .content-full {
    max-height: 200px;
    overflow-y: auto;
    padding: 10px;
    background: #f5f7fa;
    border-radius: 4px;
    line-height: 1.6;
  }
}

.content-images {
  margin-top: 20px;
  
  h4 {
    margin-bottom: 10px;
    color: #303133;
  }
  
  .image-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    
    .gallery-image {
      width: 120px;
      height: 80px;
      border-radius: 4px;
      cursor: pointer;
    }
  }
}

.audit-actions {
  margin-top: 20px;
}

.sensitive-words-content {
  .add-word {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }
  
  .words-list {
    max-height: 300px;
    overflow-y: auto;
  }
}
</style>