<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请您输入SPU名称" v-model="SpuParams.spuName"></el-input>
    </el-form-item>

    <el-form-item label="SPU品牌">
      <el-select placeholder="请您选择品牌" v-model="SpuParams.tmId">
        <el-option v-for="item in allTradeMark" :key="item.id" :label="item.tmName" :value="item.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="请您输入SPU描述" v-model="SpuParams.description"></el-input>
    </el-form-item>

    <el-form-item label="SPU照片">
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-update="handleUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="height: 100%; width: 100%" />
      </el-dialog>
    </el-form-item>

    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select
        v-model="saleAttrIdAndValueName"
        :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '无'"
      >
        <el-option
          :value="`${item.id} : ${item.name}`"
          v-for="item in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
        ></el-option>
      </el-select>
      <el-button
        @click="addSaleAttr"
        :disabled="!saleAttrIdAndValueName"
        type="primary"
        size="default"
        icon="Plus"
        style="margin-left: 10px"
      >
        添加属性
      </el-button>
      <!-- 展示销售属性与属性值的地方 -->
      <el-table border style="margin: 10px 0px" :data="saleAttr">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="销售属性名" width="120px" prop="saleAttrName"></el-table-column>
        <el-table-column label="销售属性值">
          <!-- row: 即为当前SPU已有的销售属性对象 -->
          <template #default="{ row }">
            <el-tag
              v-for="(item, index) in row.spuSaleAttrValueList"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              :key="item.id"
              class="mx-1"
              closable
              style="margin: 0px 5px"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              v-if="row.flag == true"
              @blur="toLook(row)"
              v-model="row.saleAttrValue"
              placeholder="请您输入属性值"
              size="small"
              style="width: 100px"
            ></el-input>
            <el-button v-else @click="toEdit(row)" type="primary" size="small" icon="Plus"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #default="{ $index }">
            <el-button type="primary" size="small" icon="Delete" @click="saleAttr.splice($index, 1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button :disabled="!saleAttr.length" type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type {
  SpuImg,
  SpuData,
  SaleAttr,
  SpuHasImg,
  Trademark,
  HasSaleAttr,
  AllTradeMark,
  SaleAttrValue,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
} from '@/api/product/spu/type'
import type { UploadUserFile } from 'element-plus'
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
} from '@/api/product/spu'

let $emit = defineEmits(['changeScene'])
let dialogImageUrl = ref<string>('') // 存储照片墙预览图片的地址
let dialogVisible = ref<boolean>(false) //控制照片墙对话框的显示与隐藏
let allTradeMark = ref<Trademark[]>([]) //存储已有的SPU这些数据
let imgList = ref<SpuImg[] | UploadUserFile[]>([]) // 商品图片
let saleAttr = ref<SaleAttr[]>([]) // 已有的SPU销售属性
let allSaleAttr = ref<HasSaleAttr[]>([]) // 全部销售属性
let saleAttrIdAndValueName = ref<string>('') // 将来收集还未选择的销售属性的ID与属性值的名字
// 存储已有的SPU对象
let SpuParams = ref<SpuData>({
  category3Id: '', //三级分类ID
  spuName: '', // SPU名字
  description: '', //SPU描述
  tmId: '', //品牌ID
  spuImageList: [],
  spuSaleAttrList: [],
})
// 计算出当前SPU未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  // 全部的销售属性
  let unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})

// 点击取消按钮，通知父组件切换场景为0，展示已有的SPU数据
const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}

// 子组件书写一个方法
const initHasSpuData = async (spu: SpuData) => {
  SpuParams.value = spu // 存储已有的SPU对象
  // spu：即为父组件传递过来的已有的SPU对象【不完整】
  // 获取全部品牌的数据
  let result: AllTradeMark = await reqAllTradeMark()
  // 获取某一个品牌旗下全部售卖商品的图片
  let result1: SpuHasImg = await reqSpuImageList(spu.id as number)
  // 获取已有的SPU销售性的数据
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  // 获取整个项目全部SPU的销售属性
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr()

  allTradeMark.value = result.data // 存储品牌的额数据
  // SPU对应的商品图片
  imgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  saleAttr.value = result2.data // 存储已有的SPU的销售属性
  allSaleAttr.value = result3.data // 存储全部的销售属性
}

// 照片墙点击预览回调
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

// 照片墙删除回调
const handleRemove = () => {
  console.log('删除')
}

// 照片墙上传成功前的钩子用来约束文件的大小与类型
const handleUpload = (file: any) => {
  if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage.error('上传的文件务必不大于3M')
      return false
    }
  } else {
    ElMessage.error('上传的文件务必为PNG|JPG|GIF')
    return false
  }
}

// 添加销售属性的方法
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  // 追加到数组当中
  saleAttr.value.push(newSaleAttr)
  // 清空收集的数据
  saleAttrIdAndValueName.value = ''
}

// 属性值按钮的点击事件
const toEdit = (row: SaleAttr) => {
  // 点击按钮的时候，input组件就出来了 --> 编辑模式
  row.flag = true
  row.saleAttrValue = ''
}

// 表单元素失去焦点的事件回调
const toLook = (row: SaleAttr) => {
  // 整理收集的属性的ID与属性值的名字
  const { baseSaleAttrId, saleAttrValue } = row
  // 整理成服务器需要的属性值形式
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }
  // 非法情况判断
  if ((saleAttrValue as string).trim() == '') {
    ElMessage.error('属性值不能为空')
    return
  }
  // 判断属性值是否在数组当中存在
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })
  if (repeat) {
    ElMessage.error('属性值重复')
    return
  }
  // 追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  // 切换为查看模式
  row.flag = false
}

// 保存按钮的回调
const save = async () => {
  // 整理参数
  // 1.照片墙数据
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  // 2.整理销售属性的数据
  SpuParams.value.spuSaleAttrList = saleAttr.value

  // 发送请求：添加SPU|更新已有的SPU
  let result = await reqAddOrUpdateSpu(SpuParams.value)
  if (result.code == 200) {
    // 成功
    ElMessage.success(SpuParams.value.id ? '更新成功' : '添加成功')
    $emit('changeScene', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' }) //切换场景 0
  } else {
    // 失败
    ElMessage.error(SpuParams.value.id ? '更新失败' : '添加失败')
  }
}

// 添加一个新的SPU初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
  // 清空数据
  Object.assign(SpuParams.value, {
    category3Id: '', //三级分类ID
    spuName: '', // SPU名字
    description: '', //SPU描述
    tmId: '', //品牌ID
    spuImageList: [],
    spuSaleAttrList: [],
  })
  imgList.value = [] //清空照片墙
  saleAttr.value = [] // 清空属性值
  saleAttrIdAndValueName.value = ''
  // 存储三级分类的ID
  SpuParams.value.category3Id = c3Id
  // 获取全部品牌的数据
  let result: AllTradeMark = await reqAllTradeMark()
  // 获取整个项目全部SPU的销售属性
  let result1: HasSaleAttrResponseData = await reqAllSaleAttr()
  // 存储数据
  allTradeMark.value = result.data
  allSaleAttr.value = result1.data
}

// 对外暴露
defineExpose({ initHasSpuData, initAddSpu })
</script>

<style lang="scss" scoped></style>
