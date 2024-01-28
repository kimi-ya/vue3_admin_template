<template>
  <div class="age">
    <div class="top">
      <modules-title title="年龄比例" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import ModulesTitle from './modulesTitle.vue'

let charts = ref()

onMounted(() => {
  // 获取echarts类的实例
  let myCharts = echarts.init(charts.value)
  //   设置实例的配置项

  let option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a}<br/>{b} {d}%',
    },
    title: {
      left: '24%',
      top: '41%',
      subtext: '本日总数',
    },
    legend: {
      top: 40,
      right: 40,
      orient: 'vertical', //图列垂直
      textStyle: {
        color: 'white',
        fontSize: 16,
      },
      formatter: function (name: string) {
        // 获取legend显示内容
        let data = option.series[0].data
        let total = 0
        let tarValue = 0
        for (let i = 0, l = data.length; i < l; i++) {
          total += data[i].value
          if (data[i].name == name) {
            tarValue = data[i].value
          }
        }
        let p = ((tarValue / total) * 100).toFixed(0)
        return name + ' ' + ' ' + p + '%'
      },
    },
    series: [
      {
        name: '年龄比列',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['30%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white',
          formatter: '{d}%',
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 16, name: '10岁以下' },
          { value: 8, name: '10 - 18岁' },
          { value: 12, name: '10 - 30岁' },
          { value: 24, name: '30 - 40岁' },
          { value: 20, name: '40 - 60岁' },
          { value: 20, name: '60岁以上' },
        ],
      },
    ],
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  }
  myCharts.setOption(option)
})
</script>

<style lang="scss" scoped>
.age {
  margin-left: 40px;
  margin-bottom: 20px;
  background: url(@/assets/images/screen_images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;

  .top {
    height: 55px;
  }

  .charts {
    height: 235px;
  }
}
</style>
