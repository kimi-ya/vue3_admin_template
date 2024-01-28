<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select :disabled="!!scene" v-model="categoryStore.c1Id" @change="handler1">
          <!-- label：即为展示数据 value：即为select下拉菜单收集的数据 -->
          <el-option v-for="c1 in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select :disabled="!!scene" v-model="categoryStore.c2Id" @change="handler2">
          <el-option v-for="c2 in categoryStore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select :disabled="!!scene" v-model="categoryStore.c3Id" @change="handler3">
          <el-option v-for="c3 in categoryStore.c3Arr" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
// 引入组件挂载完毕方法
import { onMounted } from 'vue'
// 引入分类相关的仓库
import useCategoryStore from '@/store/modules/category'

let categoryStore = useCategoryStore()
defineProps(['scene']) //接受父组件传过来的值

// 分类全局组件挂载完毕，通知仓库发请求获取一级分类数据
onMounted(() => {
  getC1()
})

// 通知仓库获取一级分类的方法
const getC1 = () => {
  // 通知分类仓库发请求获取一级分类的数据
  categoryStore.getC1()
}

// 一级分类下拉菜单的change事件（选中值的时候会触发，保证一级分类ID有了）
const handler1 = () => {
  // 需要将二级三级分类的数据清空
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  categoryStore.c3Arr = []
  categoryStore.getC2() // 获取二级分类的数据
}

// 二级分类下拉菜单的change事件
const handler2 = () => {
  // 需要将二级三级分类的数据清空
  categoryStore.c3Id = ''
  categoryStore.getC3()
}

// 三级分类下拉菜单的change事件
const handler3 = () => {
  categoryStore.getC3()
}
</script>

<style lang="scss" scoped></style>
