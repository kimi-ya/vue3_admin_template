<template>
  <div class="container">
    <div class="screen" ref="screen">
      <div class="top"><Top /></div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist" />
          <Sex class="sex" />
          <Age class="age" />
        </div>
        <div class="center">
          <div class="info">
            <div class="notice">
              <div class="text">平台高峰预警信息（2条）</div>
            </div>
            <div class="info-title">景区实时客流量</div>
          </div>
          <Map class="map" />
          <Line class="line" />
        </div>
        <div class="right">
          <Rank class="rank" />
          <Year class="year" />
          <Count class="count" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Top from './components/top.vue'
import Tourist from './components/tourist.vue'
import Sex from './components/sex.vue'
import Age from './components/age.vue'
import Map from './components/map.vue'
import Line from './components/line.vue'
import Rank from './components/rank.vue'
import Year from './components/year.vue'
import Count from './components/count.vue'

let screen = ref()

onMounted(() => {
  getScale()
})

// 大屏缩放比列
const getScale = (width = 1920, height = 1080) => {
  const screenWidth = window.innerWidth / width
  const screenHeight = window.innerHeight / height
  const scale = screenWidth < screenHeight ? screenWidth : screenHeight
  //屏幕缩放比例
  screen.value.style.transform = `scale(${scale}) translate(-50%,-50%)`
}

// 监听视口变化
window.onresize = () => getScale()
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background: url(@/assets/images/screen_images/bg.png) no-repeat;
  background-size: cover;

  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    left: 50%;
    top: 50%;
    transform-origin: left top;
  }

  .top {
    width: 100%;
    height: 40px;
  }

  .bottom {
    display: flex;

    .left {
      flex: 1;
      height: 1040px;
      display: flex;
      flex-direction: column;
      .tourist {
        flex: 1.3;
      }
      .sex {
        flex: 1;
      }
      .age {
        flex: 1;
      }
    }

    .center {
      flex: 2;
      display: flex;
      flex-direction: column;
      .info {
        position: absolute;
        width: 50%;
        height: 120px;
        top: 70px;
        z-index: 99;

        .notice {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 30px;
        }

        .text {
          width: 662px;
          height: 50px;
          color: white;
          font-size: 20px;
          text-align: center;
          line-height: 50px;
          background: url(@/assets/images/screen_images/dataScreen-header-warn-bg.png) no-repeat;
          background-size: 100% 100%;
        }
        .info-title {
          width: 300px;
          height: 30px;
          margin-left: 40px;
          color: white;
          font-size: 20px;
          padding-left: 30px;
          line-height: 30px;
          background: url(@/assets/images/screen_images/map-title-bg.png) no-repeat;
          background-size: 100% 100%;
        }
      }
      .map {
        flex: 2.5;
      }
      .line {
        flex: 1;
      }
    }

    .right {
      flex: 1;
      height: 1040px;
      display: flex;
      flex-direction: column;

      .rank {
        flex: 1.3;
      }
      .year {
        flex: 1;
      }
      .count {
        flex: 1;
      }
    }
  }
}
</style>
