<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <el-icon class="hamburger" :class="{ 'is-active': isActive }">
      <Expand v-if="isActive" />
      <Fold v-else />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isActive: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  toggleClick: []
}>()

const toggleClick = () => {
  emit('toggleClick')
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>