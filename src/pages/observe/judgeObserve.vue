<template>
  <div class="app-container">
    <el-table :data="pendingObservations" style="width: 100%" border v-loading="loading">
      <el-table-column prop="userInfo" label="用户信息" width="180">
        <template #default="scope">
          <div class="user-info-cell">
            <el-avatar :src="scope.row.userAvatar" />
            <span class="nickname">{{ scope.row.userNickname }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="content" label="观察内容" width="250">
        <template #default="scope">
          <div class="content-cell">
            <h4 class="title">{{ scope.row.title }}</h4>
            <p class="content-text">{{ scope.row.content }}</p>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="productName" label="课程名称" width="150" />

      <el-table-column label="观察图片">
        <template #default="scope">
          <div class="gallery-cell">
            <el-image
              v-for="(url, index) in scope.row.imageUrls"
              :key="index"
              :src="url"
              :preview-src-list="scope.row.imageUrls"
              :preview-teleported="true"
              fit="cover"
              class="table-gallery-item"
            />
          </div>
        </template>
      </el-table-column>

      <el-table-column label="关联物种">
        <template #default="scope">
          <div class="gallery-cell">
            <div v-for="species in scope.row.selectedSpecies" :key="species.id" class="species-item">
              <el-image :src="species.imageUrl" :preview-teleported="true" fit="cover" class="table-gallery-item" />
              <span class="species-name">{{ species.name }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="createdAt" label="提交时间" width="180" />

      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button type="success" size="small" @click="handleApprove(scope.row.id)">通过</el-button>
          <el-button type="danger" size="small" @click="handleReject(scope.row.id)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="!loading && pendingObservations.length === 0" class="empty-state">
      <p>暂无待审核记录</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPendingAuditObservations, approveObservation, rejectObservation } from '@/api/observe'
import { ElMessage, ElMessageBox } from 'element-plus'

const pendingObservations = ref<any[]>([])
const loading = ref(true)

// 获取待审核列表
const fetchPendingObservations = async () => {
  loading.value = true
  try {
    const res = await getPendingAuditObservations()
    console.log('API Response:', res) // 增加日志，观察返回数据
    pendingObservations.value = res || [] // 直接使用 res，并确保是数组
  } catch (error) {
    console.error('获取待审核列表失败:', error)
    ElMessage.error('获取待审核列表失败')
  } finally {
    loading.value = false
  }
}

// 通过
const handleApprove = async (id: number) => {
  try {
    await approveObservation(id)
    ElMessage.success('审核通过')
    // 刷新列表
    fetchPendingObservations()
  } catch (error) {
    console.error('审核通过操作失败:', error)
    ElMessage.error('操作失败')
  }
}

// 拒绝
const handleReject = async (id: number) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入拒绝原因', '审核拒绝', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /.+/,
      inputErrorMessage: '拒绝原因不能为空'
    })

    await rejectObservation(id, value)
    ElMessage.success('已拒绝')
    // 刷新列表
    fetchPendingObservations()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('审核拒绝操作失败:', error)
      ElMessage.error('操作失败')
    }
  }
}

onMounted(() => {
  fetchPendingObservations()
})
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.user-info-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nickname {
  font-weight: bold;
}

.content-cell .title {
  margin: 0 0 5px 0;
  font-size: 14px;
}

.content-cell .content-text {
  margin: 0;
  color: #606266;
  font-size: 12px;
  line-height: 1.4;
}

.gallery-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.table-gallery-item {
  width: 60px;
  height: 60px;
  border-radius: 4px;
}

.species-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  font-size: 12px;
}

.empty-state {
  text-align: center;
  color: #909399;
  padding: 40px 0;
}
</style>