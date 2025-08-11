<template>
  <div v-if="errorLogs.length > 0">
    <el-badge :value="errorLogs.length" class="item">
      <el-icon style="width: 1em; height: 1em; vertical-align: middle">
        <Warning />
      </el-icon>
    </el-badge>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useErrorLogStore } from '@/stores/errorLog'

const errorLogStore = useErrorLogStore()
const errorLogs = computed(() => errorLogStore.logs)
</script>