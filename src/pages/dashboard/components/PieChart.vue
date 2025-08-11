<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as echarts from 'echarts'

interface Props {
  className?: string
  width?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: 'chart',
  width: '100%',
  height: '300px'
})

const chart = ref<echarts.ECharts>()

const initChart = () => {
  const chartDom = document.querySelector(`.${props.className}`) as HTMLElement
  if (chartDom && !chart.value) {
    chart.value = echarts.init(chartDom)
  }

  chart.value.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      left: 'center',
      bottom: '10',
      data: ['海洋生物课程', '海洋环保课程', '海洋探索课程', '海洋科学课程', '其他课程']
    },
    series: [
      {
        name: '课程分布',
        type: 'pie',
        roseType: 'radius',
        radius: [15, 95],
        center: ['50%', '38%'],
        data: [
          { value: 320, name: '海洋生物课程' },
          { value: 240, name: '海洋环保课程' },
          { value: 149, name: '海洋探索课程' },
          { value: 100, name: '海洋科学课程' },
          { value: 59, name: '其他课程' }
        ],
        animationEasing: 'cubicInOut',
        animationDuration: 2600
      }
    ]
  })
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => {
    chart.value?.resize()
  })
})

onBeforeUnmount(() => {
  if (!chart.value) {
    return
  }
  chart.value.dispose()
  chart.value = undefined
})
</script>