// 商品分类全局组件的小仓库
import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { CategoryResponseData } from '@/api/product/attr/type'
import type { CategoryState } from './types/type'

const useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      c1Arr: [], // 存储一级分类的数据
      c1Id: '', // 存储一级分类的ID
      c2Arr: [], // 存储二级分类的数据
      c2Id: '', // 存储二级分类的ID
      c3Arr: [], // 存储三级分类的数据
      c3Id: '', // 存储三级分类的ID
    }
  },
  actions: {
    // 获取一级分类的方法
    async getC1() {
      // 发送请求获取一级分类数据
      const result: CategoryResponseData = await reqC1()
      if (result.code == 200) {
        this.c1Arr = result.data
      }
    },

    // 获取二级分类的方法
    async getC2() {
      const result: CategoryResponseData = await reqC2(this.c1Id)
      if (result.code == 200) {
        this.c2Arr = result.data
      }
    },

    // 获取三级分类的方法
    async getC3() {
      const result: CategoryResponseData = await reqC3(this.c2Id)
      if (result.code == 200) {
        this.c3Arr = result.data
      }
    },
  },
  getters: {},
})

export default useCategoryStore
