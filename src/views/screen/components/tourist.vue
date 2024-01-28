<template>
  <div class="tourist">
    <div class="top">
      <modules-title title="实时游客统计" />
      <div class="reserved">
        可预约总量
        <div class="reserved-number">999999</div>
        人
      </div>
    </div>
    <div class="people">
      <div class="people-number" v-for="(item, index) in people" :key="index">{{ item }}</div>
    </div>
    <!-- echarts 图表 -->
    <div class="echarts" ref="charts"></div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import ModulesTitle from './modulesTitle.vue'
import { ref, onMounted } from 'vue'
import 'echarts-liquidfill' //水球图-echarts拓展插件

let people = ref('216908人')
let charts = ref()

onMounted(() => {
  // 获取echarts类的实例
  let myCharts = echarts.init(charts.value)
  //   设置实例的配置项
  myCharts.setOption({
    series: {
      type: 'liquidFill',
      data: [0.6],
      waveAnimation: true, //动画开启
      animationDuration: 3, //动画时间
      animationDurationUpdate: 0,
      radius: '80%', //半径
      outline: {
        show: true,
        borderDistance: 8,
        itemStyle: {
          color: 'red',
          borderColor: '#294D99',
          borderWidth: 8,
          borderBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.25)',
        },
      },
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  })
})
</script>

<style lang="scss" scoped>
.tourist {
  margin: 20px 0 20px 40px;
  background: url(@/assets/images/screen_images/dataScreen-main-lt.png) no-repeat;
  background-size: 100% 100%;

  .top {
    height: 50px;
    display: flex;
    justify-content: space-between;

    .reserved {
      display: flex;
      align-items: self-end;
      color: white;
      font-size: 20px;
      margin-right: 20px;
      .reserved-number {
        margin: 0 5px;
        color: yellowgreen;
      }
    }
  }

  .people {
    display: flex;
    margin-top: 20px;
    justify-content: center;
    .people-number {
      width: 55px;
      height: 55px;
      margin: 0 2px;
      font-size: 30px;
      color: #29fcff;
      line-height: 55px;
      text-align: center;
      background: url(@/assets/images/screen_images/total.png) no-repeat;
    }
  }

  .echarts {
    width: 100%;
    height: 253px;
  }
}
</style>
