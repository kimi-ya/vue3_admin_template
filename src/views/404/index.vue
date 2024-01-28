<template>
  <div class="bg">
    <div class="img">
      <img src="@/assets/images/error_images/404.png" />
    </div>
    <el-button type="primary" size="default" @click="goHome">回到首页</el-button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

let $router = useRouter()

const goHome = () => {
  $router.push('/home')
}
</script>

<style lang="scss" scoped>
.bg {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .img {
    margin-top: -40px;
    height: 556px;
    width: 600px;
  }
}
</style>
