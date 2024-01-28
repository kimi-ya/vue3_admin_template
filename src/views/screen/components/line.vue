<template>
  <div class="line">
    <div class="top">
      <modules-title title="未来30天游客量趋势图" />
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
  myCharts.setOption({
    //标题组件
    title: {
      text: '访问量',
    },
    //x|y轴
    xAxis: {
      type: 'category',
      //两侧不留白
      boundaryGap: false,
      //分割线不要
      splitLine: {
        show: false,
      },
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      //轴线的设置
      axisLine: {
        show: true,
      },
      //刻度
      axisTick: {
        show: true,
      },
    },
    yAxis: {
      splitLine: {
        show: false,
      },
      //轴线的设置
      axisLine: {
        show: true,
      },
      //刻度
      axisTick: {
        show: true,
      },
    },
    grid: {
      left: 60,
      top: 40,
      right: 20,
      bottom: 20,
    },
    //系列
    series: [
      {
        type: 'line',
        data: [120, 1240, 66, 2299, 321, 890, 1200],
        //平滑曲线的设置
        smooth: true,
        //区域填充样式
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'red', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'blue', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    ],
  })
})
</script>

<style lang="scss" scoped>
.line {
  margin: 20px 30px;
  background: url(@/assets/images/screen_images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;

  .top {
    height: 60px;
  }

  .charts {
    height: 215px;
  }
}
</style>
