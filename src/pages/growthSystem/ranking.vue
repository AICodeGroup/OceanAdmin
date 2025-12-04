<template>
  <div class="app-container">
    <div class="page-header">
      <h1>排行榜管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="handleUpdateCache">
          <el-icon><RefreshRight /></el-icon>
          更新缓存
        </el-button>
        <el-button type="danger" @click="handleClearCache">
          <el-icon><Delete /></el-icon>
          清空缓存
        </el-button>
      </div>
    </div>

    <!-- 查询表单 -->
    <el-card class="search-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="排行类型">
          <el-select v-model="queryForm.rankType" @change="handleQuery" style="width: 150px">
            <el-option label="积分排行" value="integral" />
            <el-option label="经验排行" value="experience" />
            <el-option label="徽章排行" value="badge" />
          </el-select>
        </el-form-item>

        <el-form-item label="时间范围">
          <el-select v-model="queryForm.timeRange" @change="handleQuery" style="width: 150px">
            <el-option label="全部" value="all" />
            <el-option label="本月" value="month" />
            <el-option label="本周" value="week" />
            <el-option label="今日" value="today" />
          </el-select>
        </el-form-item>

        <el-form-item label="等级筛选" v-if="queryForm.rankType === 'integral'">
          <el-select v-model="queryForm.levelId" placeholder="全部等级" clearable style="width: 150px">
            <el-option 
              v-for="item in levelList" 
              :key="item.id" 
              :label="item.name" 
              :value="item.id" 
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 排行榜数据 -->
    <el-card>
      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column label="排名" width="80">
          <template #default="{ $index }">
            <div class="rank-cell">
              <el-icon v-if="$index === 0" class="rank-icon gold"><Trophy /></el-icon>
              <el-icon v-else-if="$index === 1" class="rank-icon silver"><Trophy /></el-icon>
              <el-icon v-else-if="$index === 2" class="rank-icon bronze"><Trophy /></el-icon>
              <span v-else>{{ (pagination.page - 1) * pagination.limit + $index + 1 }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column label="用户信息" width="250">
          <template #default="{ row }">
            <div class="user-info">
              <el-avatar :src="row.avatar" :size="40" />
              <div class="user-detail">
                <div class="nickname">{{ row.nickname }}</div>
                <div class="level-tag" v-if="row.levelName">
                  <el-tag size="small">{{ row.levelName }}</el-tag>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="queryForm.rankType === 'integral'" label="积分" width="150">
          <template #default="{ row }">
            <div class="score-cell">
              <el-icon class="score-icon"><Coin /></el-icon>
              <span class="score-value">{{ row.integral }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="queryForm.rankType === 'experience'" label="经验" width="150">
          <template #default="{ row }">
            <div class="score-cell">
              <el-icon class="score-icon"><TrendCharts /></el-icon>
              <span class="score-value">{{ row.experience }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="queryForm.rankType === 'badge'" label="徽章数" width="150">
          <template #default="{ row }">
            <div class="score-cell">
              <el-icon class="score-icon"><Medal /></el-icon>
              <span class="score-value">{{ row.badgeCount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="趋势" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.trend === 'up'" type="success">
              <el-icon><Top /></el-icon>
              上升
            </el-tag>
            <el-tag v-else-if="row.trend === 'down'" type="danger">
              <el-icon><Bottom /></el-icon>
              下降
            </el-tag>
            <el-tag v-else type="info">持平</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180" />
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Search, RefreshRight, Delete, Trophy, Coin, TrendCharts, Medal, Top, Bottom 
} from '@element-plus/icons-vue'
import {
  getIntegralRanking,
  getExperienceRanking,
  getBadgeRanking,
  getUserLevelList,
  updateRankingCache,
  clearRankingCache
} from '@/api/growthSystem'

const loading = ref(false)
const tableData = ref<any[]>([])
const levelList = ref<any[]>([])

const queryForm = reactive({
  rankType: 'integral',
  timeRange: 'all',
  levelId: undefined
})

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

// 加载等级列表
const loadLevelList = async () => {
  try {
    const data = await getUserLevelList()
    levelList.value = data || []
  } catch (error) {
    console.error('加载等级列表失败:', error)
  }
}

// 查询排行榜
const handleQuery = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      limit: pagination.limit,
      timeRange: queryForm.timeRange
    }

    if (queryForm.levelId) {
      params.levelId = queryForm.levelId
    }

    let data: any
    if (queryForm.rankType === 'integral') {
      data = await getIntegralRanking(params)
    } else if (queryForm.rankType === 'experience') {
      data = await getExperienceRanking(params)
    } else {
      data = await getBadgeRanking(params)
    }

    tableData.value = data.list || []
    pagination.total = data.total || 0
  } catch (error) {
    console.error('查询失败:', error)
  } finally {
    loading.value = false
  }
}

// 更新缓存
const handleUpdateCache = async () => {
  try {
    await ElMessageBox.confirm('确认更新排行榜缓存吗？', '提示', {
      type: 'info'
    })

    loading.value = true
    await updateRankingCache({
      rankType: queryForm.rankType,
      timeRange: queryForm.timeRange
    })
    ElMessage.success('缓存更新成功')
    handleQuery()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('更新缓存失败:', error)
      ElMessage.error('更新缓存失败')
    }
  } finally {
    loading.value = false
  }
}

// 清空缓存
const handleClearCache = async () => {
  try {
    await ElMessageBox.confirm('确认清空排行榜缓存吗？清空后需要重新计算。', '提示', {
      type: 'warning'
    })

    loading.value = true
    await clearRankingCache({
      rankType: queryForm.rankType,
      timeRange: queryForm.timeRange
    })
    ElMessage.success('缓存清空成功')
    handleQuery()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('清空缓存失败:', error)
      ElMessage.error('清空缓存失败')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadLevelList()
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

  .header-actions {
    display: flex;
    gap: 10px;
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

.rank-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;

  .rank-icon {
    font-size: 24px;

    &.gold {
      color: #FFD700;
    }

    &.silver {
      color: #C0C0C0;
    }

    &.bronze {
      color: #CD7F32;
    }
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;

  .user-detail {
    flex: 1;

    .nickname {
      font-weight: 500;
      color: #303133;
      margin-bottom: 4px;
    }

    .level-tag {
      font-size: 12px;
    }
  }
}

.score-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .score-icon {
    font-size: 18px;
    color: #409EFF;
  }

  .score-value {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }
}
</style>
