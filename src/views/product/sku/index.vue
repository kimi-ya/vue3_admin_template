<template>
  <el-card>
    <el-table border :data="skuArr" class="m-10">
      <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
      <el-table-column label="名称" show-overflow-tooltip width="150px" prop="skuName"></el-table-column>
      <el-table-column label="描述" show-overflow-tooltip prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片" width="150px">
        <template #default="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="重量(g)" width="150px" prop="weight"></el-table-column>
      <el-table-column label="价格(元)" width="150px" prop="price"></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            :title="row.isSale == 1 ? '下架SKU' : '上架SKU'"
            @click="updateSale(row)"
            v-has="`btn.Sku.updown`"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            title="编辑SKU"
            @click="updateSku"
            v-has="`btn.Sku.update`"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="InfoFilled"
            title="查看SKU"
            @click="findSku(row)"
            v-has="`btn.Sku.detail`"
          ></el-button>
          <el-popconfirm :title="`您确定删除${row.skuName}吗？`" width="200px" @confirm="deleteSku(row)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete" title="删除SKU" v-has="`btn.Sku.remove`"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器组件 -->
    <el-pagination
      @size-change="changeSize"
      @current-change="getHasSku"
      v-model:page-size="pageSize"
      v-model:current-page="pageNo"
      :total="total"
      :background="true"
      :page-sizes="[10, 20, 30, 40]"
      layout="prev, pager, next, jumper, ->, sizes,total "
    />

    <!-- 抽屉组件 展示商品的详情 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>查看商品的详情</h4>
      </template>
      <template #default>
        <el-row class="m-15">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row class="m-15">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row class="m-15">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row class="m-15">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag class="m-5" v-for="item in skuInfo.skuAttrValueList" :key="item.id">{{ item.valueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row class="m-15">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag class="m-5" v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id">
              {{ item.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row class="m-15">
          <el-col>商品图片</el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" style="width: 100%; height: 100%" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { SkuResponseData, SkuData, SkuInfoData } from '@/api/product/sku/type'
import { reqSkuList, reqSaleSku, reqCancelSale, reqSkuInfo, reqRemoveSku } from '@/api/product/sku'

let pageNo = ref(1) //分页器当前页码
let pageSize = ref(10) // 每一页展示几条数据
let total = ref(0)
let skuArr = ref<SkuData[]>([])
let drawer = ref(false) //控制抽屉组件显示与隐藏
let skuInfo = ref<any>({})

// 组件挂载时展示数据
onMounted(() => {
  getHasSku()
})

const getHasSku = async (pager = 1) => {
  pageNo.value = pager
  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code == 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}

// 分页器下拉菜单发生变化时触发回调
const changeSize = () => {
  getHasSku()
}

// 商品上下架操作回调
const updateSale = async (row: SkuData) => {
  // isSale == 1 上架状态
  // isSale == 0 下架状态
  if (row.isSale == 1) {
    // 下架操作
    await reqCancelSale(row.id as number)
    ElMessage.success('下架成功')
    // 发送请求获取更新完毕的全部已有的SKU
    getHasSku(pageNo.value)
  } else {
    // 上架操作
    await reqSaleSku(row.id as number)
    ElMessage.success('上架成功')
    getHasSku(pageNo.value)
  }
}

// 更新已有的SKU
const updateSku = () => {
  ElMessage.success('开发功能还未研发')
}

// 查看商品详情按钮回调
const findSku = async (row: SkuData) => {
  drawer.value = true
  // 获取已有商品详情数据
  let result: SkuInfoData = await reqSkuInfo(row.id as number)
  if (result.code == 200) {
    skuInfo.value = result.data
  }
}

// 删除SKU按钮回调
const deleteSku = async (row: SkuData) => {
  let result: any = await reqRemoveSku(row.id as number)
  if (result.code == 200) {
    ElMessage.success('删除成功')
    getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败或系统数据不能删除')
  }
}
</script>

<style lang="scss" scoped>
.m-15 {
  margin: 15px 0;
}
.m-10 {
  margin: 10px 0;
}
.m-5 {
  margin: 5px;
}
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
