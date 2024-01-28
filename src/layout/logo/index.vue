<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" />
    <p v-if="!LayoutSettingStore.fold">{{ setting.title }}</p>
  </div>
</template>

<script lang="ts" setup>
// 引入设置标题与logo的配置文件
import setting from '@/setting'
import useLayOutSettingStore from '@/store/modules/setting'
// 获取layout配置仓库
let LayoutSettingStore = useLayOutSettingStore()
</script>

<style lang="scss" scoped>
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  img {
    width: 30px;
    height: 30px;
  }

  p {
    font-size: $base-menu-logo-title-fontSize;
    font-weight: bold;
  }
}
</style>
