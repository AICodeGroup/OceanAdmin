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

  chart.value.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      top: 10,
      left: '2%',
      right: '2%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisTick: {
        alignWithLabel: true
      }
    }],
    yAxis: [{
      type: 'value',
      axisTick: {
        show: false
      }
    }],
    series: [{
      name: '课程报名数',
      type: 'bar',
      stack: 'vistors',
      barWidth: '60%',
      data: [79, 52, 200, 334, 390, 330, 220, 150, 200, 334, 390, 330],
      animationDuration: 3000
    }, {
      name: '课程完成数',
      type: 'bar',
      stack: 'vistors',
      barWidth: '60%',
      data: [80, 52, 200, 334, 390, 330, 220, 120, 180, 300, 350, 280],
      animationDuration: 3000
    }]
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