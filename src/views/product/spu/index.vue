<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene" />

    <el-card style="margin: 10px 0px">
      <!-- v-if 与 v-show 都可以显示与隐藏，v-if更消耗性能，建议使用v-show -->
      <!-- 显示已有SPU -->
      <div v-show="scene == 0">
        <el-button
          @click="addSpu"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="!categoryStore.c3Id"
          v-has="`btn.Spu.add`"
        >
          添加SPU
        </el-button>
        <el-table border style="margin: 10px 0px" :data="records">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
          <el-table-column label="SPU操作">
            <template #default="{ row }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
                @click="addSku(row)"
                v-has="`btn.Spu.addsku`"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                title="修改SPU"
                @click="updateSpu(row)"
                v-has="`btn.Spu.update`"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="View"
                title="查看SKU列表"
                @click="findSku(row)"
                v-has="`btn.Spu.skus`"
              ></el-button>
              <el-popconfirm
                :title="`您确定删除${row.spuName}吗？`"
                width="200px"
                @confirm="deleteSpu(row)"
                v-has="`btn.Spu.delete`"
              >
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete" title="删除SPU"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器组件 -->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>

      <!-- 添加SPU|修改SPU的子组件 -->
      <SpuForm ref="spuForm" v-show="scene == 1" @changeScene="changeScene" />

      <!-- 添加SKU的子组件 -->
      <SkuForm ref="skuForm" v-show="scene == 2" @changeScene="changeScene" />

      <!-- dialog 对话框：展示已有SKU数据列表 -->
      <el-dialog title-="SKU列表" v-model="show">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #default="{ row }">
              <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu/index'
import { type HasSpuResponseData, type Records, type SpuData, type SkuInfoData, SkuData } from '@/api/product/spu/type'
import useCategoryStore from '@/store/modules/category' // 引入分类的仓库
import { ElMessage } from 'element-plus'

let categoryStore = useCategoryStore()
let scene = ref<number>(0) //场景的数据： 0-显示已有SPU 1-添加或修改已有SPU 2-添加SKU的结构
let pageNo = ref<number>(1) //分页器默认页码
let pageSize = ref<number>(3) //每一页展示几条数据
let total = ref<number>(0) //存储已有SPU的总数
let records = ref<Records>([]) //存储已有的SPU数据
let spuForm = ref<any>() //获取子组件实列SpuForm
let skuForm = ref<any>() //获取子组件实列SkuForm
let skuArr = ref<SkuData[]>([]) //存储全部SKU数据
let show = ref(false) //dialog的展示变量

// 路由组件销毁前，清空仓库关于分类的数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})

// 监听三级分类ID的变化
watch(
  () => categoryStore.c3Id,
  () => {
    // 务必保证有三级分类ID
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)

// 获取某一个三级分类下全部已有的SPU
const getHasSpu = async (pager = 1) => {
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
  if (result.code == 200) {
    total.value = result.data.total
    records.value = result.data.records
  }
}

// 分页器下拉菜单触发回调
const changeSize = () => {
  getHasSpu()
}

// 添加SPU
const addSpu = () => {
  scene.value = 1 // 切换为场景1 SpuForm
  // 点击添加SPU按钮，调用子组件的方法初始化数据
  spuForm.value.initAddSpu(categoryStore.c3Id)
}

// 子组件SpuForm绑定自定义事件：目前是让子组件通知父组件切换场景为0
const changeScene = (obj: any) => {
  // 父组件接受子组件值num,切换对应的场景
  scene.value = obj.flag
  // 再次获取已有的SPU
  if (obj.params == 'update') {
    getHasSpu(pageNo.value) // 更新
  } else {
    getHasSpu() //添加
  }
}

// 修改SPU
const updateSpu = (row: SpuData) => {
  scene.value = 1 // 切换为场景1 SpuForm
  // 调用子组件实例方法获取完整已有的SPU数据
  spuForm.value.initHasSpuData(row)
}

// 添加SKU
const addSku = (row: SpuData) => {
  // 切换为场景2 SkuForm
  scene.value = 2
  skuForm.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

// 查看Sku
const findSku = async (row: SpuData) => {
  let result: SkuInfoData = await reqSkuList(row.id as number)
  if (result.code == 200) {
    skuArr.value = result.data
    show.value = true // 对话框显示
  }
}

// 删除SPU
const deleteSpu = async (row: SpuData) => {
  let result = await reqRemoveSpu(row.id as number)
  if (result.code == 200) {
    ElMessage.success('删除成功')
    // 获取剩余已有SPU数据
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败')
  }
}
</script>

<style lang="scss" scoped></style>
