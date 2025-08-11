<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as echarts from 'echarts'
import resize from './mixins/resize'

interface Props {
  className?: string
  width?: string
  height?: string
  chartData: {
    expectedData: number[]
    actualData: number[]
  }
}

const props = withDefaults(defineProps<Props>(), {
  className: 'chart',
  width: '100%',
  height: '350px'
})

const chart = ref<echarts.ECharts>()

const initChart = () => {
  const chartDom = document.querySelector(`.${props.className}`) as HTMLElement
  if (chartDom && !chart.value) {
    chart.value = echarts.init(chartDom)
    setOptions(props.chartData)
  }
}

const setOptions = ({ expectedData, actualData }: { expectedData: number[], actualData: number[] }) => {
  chart.value?.setOption({
    xAxis: {
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      boundaryGap: false,
      axisTick: {
        show: false
      }
    },
    grid: {
      left: 10,
      right: 10,
      bottom: 20,
      top: 30,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      padding: [5, 10]
    },
    yAxis: {
      axisTick: {
        show: false
      }
    },
    legend: {
      data: ['预期', '实际']
    },
    series: [{
      name: '预期', itemStyle: {
        color: '#FF005A',
        lineStyle: {
          color: '#FF005A',
          width: 2
        }
      },
      smooth: true,
      type: 'line',
      data: expectedData,
      animationDuration: 2800,
      animationEasing: 'cubicInOut'
    },
    {
      name: '实际',
      smooth: true,
      type: 'line',
      itemStyle: {
        color: '#3888fa',
        lineStyle: {
          color: '#3888fa',
          width: 2
        },
        areaStyle: {
          color: '#f3f8ff'
        }
      },
      data: actualData,
      animationDuration: 2800,
      animationEasing: 'quadraticOut'
    }]
  })
}

watch(() => props.chartData, (newData) => {
  setOptions(newData)
}, { deep: true })

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