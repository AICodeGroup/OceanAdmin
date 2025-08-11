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

const animationDuration = 3000

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
    radar: {
      radius: 66,
      center: ['50%', '42%'],
      splitNumber: 8,
      splitArea: {
        areaStyle: {
          color: 'rgba(127,95,132,.3)',
          opacity: 1,
          shadowBlur: 45,
          shadowColor: 'rgba(0,0,0,.5)',
          shadowOffsetX: 0,
          shadowOffsetY: 15
        }
      },
      indicator: [
        { name: '用户活跃度', max: 10000 },
        { name: '课程质量', max: 20000 },
        { name: '内容丰富度', max: 20000 },
        { name: '互动性', max: 20000 },
        { name: '学习效果', max: 20000 },
        { name: '用户满意度', max: 20000 }
      ]
    },
    legend: {
      left: 'center',
      bottom: '10',
      data: ['本月数据', '上月数据']
    },
    series: [{
      type: 'radar',
      symbolSize: 0,
      areaStyle: {
        shadowBlur: 13,
        shadowColor: 'rgba(0,0,0,.2)',
        shadowOffsetX: 0,
        shadowOffsetY: 10,
        opacity: 1
      },
      data: [
        {
          value: [5000, 7000, 12000, 11000, 15000, 14000],
          name: '本月数据',
          itemStyle: {
            color: '#b6a2de'
          }
        }, {
          value: [4000, 9000, 15000, 15000, 13000, 11000],
          name: '上月数据',
          itemStyle: {
            color: '#5ab1ef'
          }
        }
      ],
      animationDuration: animationDuration
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