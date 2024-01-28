<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <Breadcrumb></Breadcrumb>
    </div>
    <div class="tabbar_right">
      <Setting></Setting>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
</script>

<style lang="scss" scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(#e7e7e7, 0.5);
  // background-image: linear-gradient(to right, white, black, white);

  .tabbar_left {
    display: flex;
    align-items: center;
    margin: 20px;
  }

  .tabbar_right {
    display: flex;
    align-items: center;
    margin: 20px;
  }
}
</style>
