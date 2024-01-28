<template>
  <div class="title">
    <div class="text">{{ title }}</div>
    <div class="title-bg"></div>
  </div>
</template>

<script lang="ts" setup>
defineProps(['title']) //接受父组件传过来的值
</script>

<style lang="scss" scoped>
.title {
  .text {
    color: white;
    font-size: 20px;
    margin-bottom: 10px;
  }
  .title-bg {
    width: 68px;
    height: 7px;
    background-size: 100% 100%;
    background: url(@/assets/images/screen_images/dataScreen-title.png) no-repeat;
  }
}
</style>
