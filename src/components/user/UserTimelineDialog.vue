<template>
  <el-dialog
    v-model="visible"
    title="用户成长轨迹"
    width="800px"
    destroy-on-close
    @close="handleClose"
  >
    <div class="user-timeline">
      <div class="filters">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="loadTimeline"
        />
        
        <el-select v-model="eventType" placeholder="事件类型" clearable @change="loadTimeline" style="margin-left: 10px; width: 150px;">
          <el-option label="全部" value="" />
          <el-option label="观察记录" value="observation" />
          <el-option label="积分变动" value="integral" />
          <el-option label="勋章获得" value="badge" />
          <el-option label="任务完成" value="task" />
        </el-select>
      </div>

      <div class="timeline-container" v-loading="loading">
        <el-empty v-if="timeline.length === 0 && !loading" description="暂无数据" />
        
        <el-timeline v-else>
          <el-timeline-item
            v-for="event in timeline"
            :key="`${event.eventType}-${event.id}`"
            :timestamp="formatTime(event.eventTime)"
            :icon="getEventIcon(event.eventType)"
            :type="getEventTagType(event.eventType)"
            :color="getEventColor(event.eventType)"
            placement="top"
          >
            <div class="timeline-card">
              <div class="event-header">
                <h4>{{ event.title }}</h4>
                <el-tag :type="getEventTagType(event.eventType)" size="small">
                  {{ getEventTypeLabel(event.eventType) }}
                </el-tag>
              </div>
              
              <div class="event-content">
                <p v-if="event.description" class="description">{{ event.description }}</p>
                
                <!-- 观察记录 -->
                <div v-if="event.eventType === 'observation' && event.iconUrl" class="observation-image">
                  <el-image 
                    :src="event.iconUrl" 
                    fit="cover" 
                    :preview-src-list="[event.iconUrl]"
                    style="width: 100px; height: 100px; border-radius: 4px;"
                  />
                </div>
                <div v-if="event.productName" class="product-info">
                  <el-icon><Reading /></el-icon>
                  <span>{{ event.productName }}</span>
                </div>
                
                <!-- 积分变动 -->
                <div v-if="event.eventType === 'integral'" class="integral-info">
                  <span class="integral-change" :class="event.integralType === 1 ? 'increase' : 'decrease'">
                    {{ event.integralType === 1 ? '+' : '' }}{{ event.integralChange }} 积分
                  </span>
                  <span class="integral-balance">
                    (余额：{{ event.integralBalance }})
                  </span>
                </div>
                
                <!-- 勋章获得 -->
                <div v-if="event.eventType === 'badge'" class="badge-info">
                  <el-image v-if="event.iconUrl" :src="event.iconUrl" class="badge-icon" />
                  <div class="badge-details">
                    <div class="badge-name">{{ event.badgeName }}</div>
                    <div class="badge-level">等级 {{ event.badgeLevel }}</div>
                  </div>
                </div>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { getUserTimelineList } from '@/api/userTimeline'
import dayjs from 'dayjs'
import {
  Edit,
  Coin,
  Trophy,
  Check,
  InfoFilled,
  Reading
} from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const loading = ref(false)
const timeline = ref<any[]>([])
const dateRange = ref([])
const eventType = ref('integral')

watch(() => props.modelValue, (val) => {
  if (val && props.userId) {
    // Reset filters when opening
    dateRange.value = []
    eventType.value = 'integral'
    loadTimeline()
  }
})

const loadTimeline = async () => {
  if (!props.userId) return
  
  loading.value = true
  try {
    const params: any = {
      userId: props.userId,
      eventType: eventType.value || undefined
    }
    
    if (dateRange.value && dateRange.value.length === 2) {
      params.dateStart = dateRange.value[0]
      params.dateEnd = dateRange.value[1]
    }
    
    const res = await getUserTimelineList(params) as any
    console.log('User Timeline Response:', res)
    
    // Handle response: interceptor returns data array directly
    if (Array.isArray(res)) {
      timeline.value = res
    } else if (res && Array.isArray(res.data)) {
      timeline.value = res.data
    } else {
      timeline.value = []
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  visible.value = false
}

const getEventIcon = (type: string) => {
  const icons: Record<string, any> = {
    observation: Edit,
    integral: Coin,
    badge: Trophy,
    task: Check
  }
  return icons[type] || InfoFilled
}

const getEventColor = (type: string) => {
   const colors: Record<string, string> = {
    observation: '#409EFF',
    integral: '#E6A23C',
    badge: '#67C23A',
    task: '#909399'
  }
  return colors[type] || '#909399'
}

const getEventTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    observation: '观察记录',
    integral: '积分变动',
    badge: '勋章获得',
    task: '任务完成'
  }
  return labels[type] || type
}

const getEventTagType = (type: string) => {
  const types: Record<string, string> = {
    observation: '',
    integral: 'warning',
    badge: 'success',
    task: 'info'
  }
  return types[type] || 'info' as any
}

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}
</script>

<style scoped>
.user-timeline {
  padding: 10px;
  max-height: 60vh;
  overflow-y: auto;
}

.filters {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.timeline-container {
  padding: 0 10px;
}

.timeline-card {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.event-header h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.description {
  color: #606266;
  font-size: 14px;
  margin: 0 0 8px 0;
}

.observation-image {
  margin-bottom: 8px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #909399;
  font-size: 13px;
}

.integral-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.integral-change {
  font-weight: bold;
}

.integral-change.increase {
  color: #67C23A;
}

.integral-change.decrease {
  color: #F56C6C;
}

.integral-balance {
  color: #909399;
  font-size: 13px;
}

.badge-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.badge-icon {
  width: 48px;
  height: 48px;
}

.badge-details .badge-name {
  font-weight: bold;
  font-size: 14px;
  color: #303133;
}

.badge-details .badge-level {
  font-size: 12px;
  color: #909399;
}
</style>
