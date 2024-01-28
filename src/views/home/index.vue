<template>
  <el-card>
    <div class="card">
      <img :src="avatar" class="avatar" />
      <div>
        <div class="name">{{ getTime() + '好呀' + username }}</div>
        <div class="title">{{ title }}</div>
      </div>
    </div>
  </el-card>
  <div class="background">
    <svg-icon name="welcome" width="480px" height="480px"></svg-icon>
  </div>
</template>

<script lang="ts" setup>
import { getTime } from '@/utils/time'
import setting from '@/setting'
import useUserStore from '@/store/modules/user'

let { avatar, username } = useUserStore()
let { title } = setting
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  align-items: center;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 20px;
  }
  .name {
    font-size: 28px;
    font-weight: 900;
    margin-bottom: 20px;
  }
  .title {
    font-style: italic;
    color: rgb(0, 21, 43);
  }
}

.background {
  display: flex;
  justify-content: center;
}
</style>
