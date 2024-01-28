<template>
  <div class="top">
    <div class="left"></div>
    <div class="center">
      <div class="center-left-btn" @click="goHome">首页</div>
      <div class="center-title">智慧旅游可视化大数据平台</div>
      <div class="center-right-btn">统计报告</div>
    </div>
    <div class="right">
      <div class="right-time">当前时间：{{ time }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import moment from 'moment'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

let $router = useRouter() //路由器对象
let time = ref(moment().format('YYYY年MM月DD日 HH:mm:ss'))
let timer = ref(0)

// 组件挂载完实时更新时间
onMounted(() => {
  timer.value = setInterval(() => {
    time.value = moment().format('YYYY年MM月DD日 HH:mm:ss')
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
})

// 点击首页按钮
const goHome = () => {
  $router.push('/home')
}
</script>

<style lang="scss" scoped>
.top {
  width: 100%;
  height: 40px;
  display: flex;

  .left {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    background-size: cover;
    background: url(@/assets/images/screen_images/dataScreen-header-left-bg.png) no-repeat;
  }
  .center {
    flex: 2;
    display: flex;

    .center-left-btn {
      width: 180px;
      height: 40px;
      margin-left: -10px;
      color: #29fcff;
      font-size: 20px;
      background: url(@/assets/images/screen_images/dataScreen-header-btn-bg-l.png) no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .center-title {
      width: 100%;
      height: 74px;
      color: #29fcff;
      font-size: 30px;
      background: url(@/assets/images/screen_images/dataScreen-header-center-bg.png) no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .center-right-btn {
      width: 180px;
      height: 40px;
      margin-right: -10px;
      color: #29fcff;
      font-size: 20px;
      background: url(@/assets/images/screen_images/dataScreen-header-btn-bg-r.png) no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
  .right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background: url(@/assets/images/screen_images/dataScreen-header-right-bg.png) no-repeat;

    .right-time {
      color: #29fcff;
      margin-right: 50px;
    }
  }
}
</style>
