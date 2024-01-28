<template>
  <el-button size="small" icon="Refresh" circle @click="updateRefsh"></el-button>
  <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
  <el-button size="small" icon="Setting" circle @click="setting"></el-button>
  <el-drawer v-model="drawer" append-to-body size="15%">
    <template #header>
      <span>主题颜色设置</span>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="主题颜色">
          <el-color-picker @change="setColor" size="small" v-model="color" show-alpha :predefine="predefineColors" />
        </el-form-item>
        <el-form-item label="暗黑模式">
          <el-switch @change="changeDark" v-model="dark" inline-prompt active-icon="MoonNight" inactive-icon="Sunny" />
        </el-form-item>
      </el-form>
    </template>
  </el-drawer>

  <img :src="userStore.avatar" style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%" />

  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon-right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// 获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
// 获取骨架的小仓库
import useLayOutSettingStore from '@/store/modules/setting'

let layoutSettingStore = useLayOutSettingStore()
let userStore = useUserStore()
let $router = useRouter() // 获取路由器对象
let $route = useRoute() // 获取路由对象
let dark = ref(false) // 暗黑模式开关
let drawer = ref(false) //设置抽屉开关

// 刷新按钮点击回调
const updateRefsh = () => {
  layoutSettingStore.refsh = !layoutSettingStore.refsh
}

// 全屏按钮点击回调
const fullScreen = () => {
  // DOM对象的一个属性: 可以用来判断当前是不是全屏模式(全屏: true, 不是全屏: false)
  let full = document.fullscreenElement
  // 切换为全屏模式
  if (!full) {
    // 文档根节点的方法 requestFullscreen 实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    // 变为不是全屏模式 --> 退出全屏
    document.exitFullscreen()
  }
}

// 退出登录点击的回调
const logout = async () => {
  // 第一件事情：需要向服务器发请求【退出登录接口】
  // 第二件事情：仓库当中关于用户相关的数据清空【token|username|avatar】
  // 第三件事情：跳转到登录界面
  await userStore.userLogout()
  // 跳转到登录页面
  $router.push({ path: '/login', query: { redirect: $route.path } })
}

const setting = () => {
  drawer.value = true
}

// switch 开关，暗黑模式切换
const changeDark = () => {
  // 获取html根节点
  let html = document.documentElement
  dark.value ? (html.className = 'dark') : (html.className = '')
}

const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

// 主题颜色设置
const setColor = () => {
  let html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}
</script>

<style lang="scss" scoped></style>
