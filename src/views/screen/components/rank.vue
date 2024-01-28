<template>
  <div class="rank">
    <div class="top">
      <modules-title title="热门景区排行" />
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
  const myCharts = echarts.init(charts.value)
  const myColor = [
    '#eb2100',
    '#eb3600',
    '#d0570e',
    '#d0a00e',
    '#34da62',
    '#00e9db',
    '#00c0e9',
    '#0096f3',
    '#33CCFF',
    '#33FFCC',
  ]
  const Ydata = [
    '庐山',
    '长江三峡',
    '张家界武陵源',
    '杭州西湖',
    '台湾日月潭',
    '泰山',
    '华山',
    '峨眉山',
    '黄山',
    '桂林漓江',
  ]
  const Xdata = [10, 13, 25, 29, 38, 47, 56, 68, 76, 82]
  const option = {
    //你的代码
    // backgroundColor: '#0e2147',
    grid: {
      left: '10%',
      top: '10%',
      right: '10%',
      bottom: '0%',
      containLabel: true,
    },
    dataZoom: [
      {
        yAxisIndex: 0, //这里是从X轴的0刻度开始
        show: false, //是否显示滑动条，不影响使用
        type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
        startValue: 0, // 从头开始。
        endValue: 4, // 一次性展示5个。。
      },
    ],
    xAxis: [
      {
        show: false,
      },
    ],
    yAxis: [
      {
        axisTick: 'none',
        axisLine: 'none',
        offset: '27',
        axisLabel: {
          textStyle: {
            color: '#ffffff',
            fontSize: '16',
          },
        },
        data: Ydata,
      },
      {
        axisTick: 'none',
        axisLine: 'none',
        axisLabel: {
          textStyle: {
            color: '#ffffff',
            fontSize: '16',
          },
        },
        data: ['5', '4', '3', '2', '1'],
      },
      {
        nameGap: '50',
        nameTextStyle: {
          color: '#ffffff',
          fontSize: '16',
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(0,0,0,0)',
          },
        },
        data: [],
      },
    ],
    series: [
      {
        name: '条',
        type: 'bar',
        yAxisIndex: 0,
        data: Xdata,
        label: {
          normal: {
            show: true,
            position: 'right',
            textStyle: {
              color: '#ffffff',
              fontSize: '16',
            },
          },
        },
        barWidth: 12,
        barGap: 1000,
        itemStyle: {
          normal: {
            color: function (params: any) {
              let num = myColor.length
              return myColor[params.dataIndex % num]
            },
          },
        },
        z: 2,
      },
      {
        name: '白框',
        type: 'bar',
        yAxisIndex: 1,
        barGap: '-100%',
        data: [99, 99.5, 99.5, 99.5, 99.5],
        barWidth: 20,
        itemStyle: {
          normal: {
            color: '#0e2147',
            barBorderRadius: 5,
          },
        },
        z: 1,
      },
      {
        name: '外框',
        type: 'bar',
        yAxisIndex: 2,
        barGap: '-100%',
        data: [100, 100, 100, 100, 100],
        barWidth: 24,
        itemStyle: {
          normal: {
            color: function (params: any) {
              let num = myColor.length
              return myColor[params.dataIndex % num]
            },
            barBorderRadius: 5,
          },
        },
        z: 0,
      },
    ],
  }
  setInterval(() => {
    if (option.dataZoom[0].endValue == Xdata.length) {
      option.dataZoom[0].endValue = 4
      option.dataZoom[0].startValue = 0
    } else {
      option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1
      option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1
    }
    myCharts.setOption(option)
  }, 2000)
  myCharts.setOption(option)
})
</script>

<style lang="scss" scoped>
.rank {
  margin: 20px 40px 20px 0;
  background: url(@/assets/images/screen_images/dataScreen-main-rt.png) no-repeat;
  background-size: 100% 100%;

  .top {
    height: 55px;
  }

  .charts {
    height: 323px;
  }
}
</style>
