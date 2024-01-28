<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input type="number" placeholder="价格(元)" v-model="skuParams.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input placeholder="重量(克)" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input type="textarea" placeholder="SKU描述" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item v-for="item in attrArr" :key="item.id" :label="item.attrName">
          <el-select placeholder="请选择" v-model="item.attrIdAndValueId">
            <el-option
              :value="`${item.id}:${attrValue.id}`"
              v-for="attrValue in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item v-for="item in saleArr" :key="item.id" :label="item.saleAttrName">
          <el-select placeholder="请选择" v-model="item.saleIdAndValueId">
            <el-option
              :value="`${item.id}:${saleArrValue.id}`"
              v-for="saleArrValue in item.spuSaleAttrValueList"
              :key="saleArrValue.id"
              :label="saleArrValue.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #default="{ row }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handler(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { reqAttr } from '@/api/product/attr'
import { reqSpuImageList, reqSpuHasSaleAttr, reqAddSku } from '@/api/product/spu'
import type { SkuData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'

let $emit = defineEmits(['changeScene']) // 自定义事件方法
let table = ref() //获取table组件实列vc
let attrArr = ref<any>([]) //平台属性
let saleArr = ref<any>([]) //销售属性
let imgArr = ref<any>([]) //照片数据
let skuParams = reactive<SkuData>({
  // 父组件传过来的数据
  category3Id: '', //三级分类的ID
  spuId: '', //已有的SPU的ID
  tmId: '', //SPU品牌的ID

  // v-model 收集数据
  skuName: '', //SKU的名字
  price: '', //SKU的价格
  weight: '', //SKU的重量
  skuDesc: '', //SKU的描述
  //平台属性的收集
  skuAttrValueList: [
    /* {
      attrId: '', //平台属性的ID
      valueId: '', //属性值的ID
    }, */
  ],
  // 销售属性
  skuSaleAttrValueList: [
    /*  {
      saleAttrId: '', //属性ID
      saleAttrValueId: '', //属性值的ID
    }, */
  ],
  skuDefaultImg: '', //SKU图片地址
})

// 取消按钮回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}

// 当前子组件的方法对外暴露
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: any) => {
  // 收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId

  // 获取平台属性
  let result = await reqAttr(c1Id, c2Id, spu.category3Id)
  // 获取对应的销售属性
  let result1 = await reqSpuHasSaleAttr(spu.id)
  // 获取照片墙数据
  let result2 = await reqSpuImageList(spu.id)

  attrArr.value = result.data //平台属性
  saleArr.value = result1.data //销售属性
  imgArr.value = result2.data //照片数据
}

// 设置默认图片回调
const handler = (row: any) => {
  // 点击的时候，全部的图片复选款不勾选
  imgArr.value.forEach((item: any) => {
    table.value.toggleRowSelection(row, false)
  })
  // 复选框选中图片勾选
  table.value.toggleRowSelection(row, true)
  // 收集图片地址
  skuParams.skuDefaultImg = row.imgUrl
}

// sku保存回调
const save = async () => {
  // 整理参数
  // 平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId,
      })
    }
    return prev
  }, [])
  // 销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
    if (next.saleIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
      prev.push({
        saleAttrId,
        saleAttrValueId,
      })
    }
    return prev
  }, [])
  // 发请求
  let result = await reqAddSku(skuParams)
  if (result.code == 200) {
    // 成功
    ElMessage.success('添加SKU成功')
    // 通知父组件切换场景为0
    $emit('changeScene', { flag: 0, params: '' })
  } else {
    // 失败
    ElMessage.error('添加SKU失败')
  }
}

// 对外暴露方法
defineExpose({ initSkuData })
</script>

<style lang="scss" scoped></style>
