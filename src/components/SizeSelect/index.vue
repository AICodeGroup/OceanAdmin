<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div>
      <el-icon>
        <Operation />
      </el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item of sizeOptions"
          :key="item.value"
          :disabled="size === item.value"
          :command="item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const size = ref('default')

const sizeOptions = [
  { label: '默认', value: 'default' },
  { label: '中等', value: 'default' },
  { label: '小型', value: 'small' },
  { label: '迷你', value: 'small' }
]

const handleSetSize = (size: string) => {
  // 这里可以设置全局组件大小
  ElMessage({
    message: '切换尺寸成功',
    type: 'success'
  })
}
</script>