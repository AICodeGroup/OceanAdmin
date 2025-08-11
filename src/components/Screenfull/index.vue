<template>
  <div @click="click">
    <el-icon>
      <FullScreen v-if="!isFullscreen" />
      <Aim v-else />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import screenfull from 'screenfull'

const isFullscreen = ref(false)

const click = () => {
  if (!screenfull.isEnabled) {
    ElMessage({
      message: '您的浏览器不支持全屏',
      type: 'warning'
    })
    return false
  }
  screenfull.toggle()
}

const change = () => {
  isFullscreen.value = screenfull.isFullscreen
}

onMounted(() => {
  if (screenfull.isEnabled) {
    screenfull.on('change', change)
  }
})

onUnmounted(() => {
  if (screenfull.isEnabled) {
    screenfull.off('change', change)
  }
})
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>