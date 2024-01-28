<template>
  <div class="sex">
    <div class="top">
      <modules-title title="男女比例" />
    </div>
    <div class="main">
      <div class="main-sex mb-15">
        <div class="man">
          <div class="mb-15">男士</div>
          <img src="@/assets/images/screen_images/man.png" />
        </div>
        <div class="woman">
          <div class="mb-15">女士</div>
          <img src="@/assets/images/screen_images/woman.png" />
        </div>
      </div>
      <div class="main-bar">
        <div class="title">
          <div>男士 60%</div>
          <div>女士 40%</div>
        </div>
        <div class="bar" ref="charts"></div>
      </div>
    </div>
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
    xAxis: {
      show: false,
      min: 0,
      max: 100,
    },
    yAxis: {
      show: false,
      type: 'category',
    },
    series: [
      {
        type: 'bar',
        data: [60],
        z: 100, //层级
        itemStyle: {
          borderRadius: 20, //圆角
        },
      },
      {
        type: 'bar',
        data: [100],
        barGap: '-100%', //位置
        itemStyle: {
          borderRadius: 20,
        },
      },
    ],

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
.sex {
  background: url(@/assets/images/screen_images/dataScreen-main-lc.png) no-repeat;
  background-size: 100% 100%;
  margin-left: 40px;
  margin-bottom: 20px;

  .top {
    height: 50px;
    display: flex;
    justify-content: space-between;
  }

  .main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 240px;
    padding: 0 60px;
    color: white;
    font-size: 20px;

    .mb-15 {
      margin-bottom: 15px;
    }

    .main-sex {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .man {
        text-align: center;
        width: 116px;
        height: 111px;
        background: url(@/assets/images/screen_images/man-bg.png) no-repeat;
        background-size: 100% 100%;
      }

      .woman {
        text-align: center;
        width: 116px;
        height: 111px;
        background: url(@/assets/images/screen_images/woman-bg.png) no-repeat;
        background-size: 100% 100%;
      }
    }

    .main-bar {
      height: 60px;

      .title {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
      }

      .bar {
        height: 25px;
      }
    }
  }
}
</style>
