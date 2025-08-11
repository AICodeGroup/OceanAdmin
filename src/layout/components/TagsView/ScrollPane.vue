<template>
  <div
    ref="scrollContainer"
    class="scroll-container"
    @wheel.prevent="handleScroll"
  >
    <div ref="scrollWrapper" class="scroll-wrapper">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits<{
  scroll: [{ e: WheelEvent; data: any }]
}>()

const scrollContainer = ref<HTMLElement>()
const scrollWrapper = ref<HTMLElement>()

const handleScroll = (e: WheelEvent) => {
  const eventDelta = e.wheelDelta || -e.deltaY * 40
  const $scrollWrapper = scrollWrapper.value!
  $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
  emit('scroll', { e, data: null })
}

const moveToTarget = (currentTag: HTMLElement) => {
  const $container = scrollContainer.value!
  const $containerWidth = $container.offsetWidth
  const $scrollWrapper = scrollWrapper.value!
  const $scrollWrapperWidth = $scrollWrapper.offsetWidth

  let firstTag = null
  let lastTag = null

  if ($scrollWrapper.firstElementChild) {
    firstTag = $scrollWrapper.firstElementChild as HTMLElement
  }
  if ($scrollWrapper.lastElementChild) {
    lastTag = $scrollWrapper.lastElementChild as HTMLElement
  }

  if (firstTag === currentTag) {
    $scrollWrapper.scrollLeft = 0
  } else if (lastTag === currentTag) {
    $scrollWrapper.scrollLeft = $scrollWrapperWidth - $containerWidth
  } else {
    const currentIndex = Array.from($scrollWrapper.children).findIndex(item => item === currentTag)
    const prevTag = $scrollWrapper.children[currentIndex - 1] as HTMLElement
    const nextTag = $scrollWrapper.children[currentIndex + 1] as HTMLElement

    const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + 4
    const beforePrevTagOffsetLeft = prevTag.offsetLeft - 4

    if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
      $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
    } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
      $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
    }
  }
}

defineExpose({
  moveToTarget
})
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;

  .scroll-wrapper {
    position: absolute;
    white-space: nowrap;
    transition: left 0.3s ease;
  }
}
</style>