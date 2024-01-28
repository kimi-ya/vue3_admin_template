<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin: 10px 0px">
      <div v-if="scene == 0">
        <el-button
          @click="addAttr"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="!categoryStore.c3Id"
          v-has="`btn.Attr.add`"
        >
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称">
            <!-- #default="{ row }" 自定义作用域插槽 -->
            <template #default="{ row }">
              <el-tag style="margin: 5px" v-for="item in row.attrValueList" :key="item.id">{{ item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #default="{ row }">
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
                v-has="`btn.Attr.update`"
              ></el-button>
              <el-popconfirm
                :title="`您确定要删除${row.attrName}?`"
                width="200px"
                icon="Delete"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete" v-has="`btn.Attr.remove`"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-else>
        <!-- 展示添加属性与修改数据的结构 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请您输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="addAttrValue" :disabled="!attrParams.attrName" type="primary" size="default" icon="Plus">
          添加属性值
        </el-button>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
        <el-table border style="margin: 10px 0px" :data="attrParams.attrValueList">
          <el-table-column width="80px" type="index" align="center" label="序号"></el-table-column>
          <el-table-column label="属性值名称">
            <template #default="{ row, $index }">
              <el-input
                v-if="row.flag"
                :ref="(vc: any) => (inputArr[$index] = vc)"
                @blur="toLook(row, $index)"
                size="small"
                placeholder="请您输入属性值名称"
                v-model="row.valueName"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #default="{ $index }">
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" size="default" @click="save" :disabled="attrParams.attrValueList.length <= 0">
          保存
        </el-button>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
import useCategoryStore from '@/store/modules/category'
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr' // 引入获取已有属性与属性值接口
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'

let categoryStore = useCategoryStore() // 获取分类的仓库
let attrArr = ref<Attr[]>([]) //存储已有的属性与属性值
// 定义card组件内容切换变量；0：显示table，1：显示添加与修改属性结构
let scene = ref<number>(0)
// 准备一个数组：将来存储对应的组件实列el-input
let inputArr = ref<any>([])
// 收集新增的属性的数据
let attrParams = reactive<Attr>({
  attrName: '', //新增的属性的名字
  attrValueList: [], //新增的属性值数组
  categoryId: '', //三级分类的ID
  categoryLevel: 3, //三级分类
})

// 路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  // 清空仓库的数据
  categoryStore.$reset()
})

// 监听仓库三级分类ID的变化
watch(
  () => categoryStore.c3Id,
  () => {
    // 清空上一次查询的属性与属性值
    attrArr.value = []
    // 保证三级分类id有才能发送请求
    if (!categoryStore.c3Id) return
    // 获取分类id
    getAttr()
  },
)

// 获取已有属性与属性值接口方法
const getAttr = async () => {
  // 获取分类的ID
  const { c1Id, c2Id, c3Id } = categoryStore
  const result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code == 200) {
    attrArr.value = result.data
  }
}

// 添加属性按钮的回调
const addAttr = () => {
  // 每一次点击的时候，先清空下数据再收集数据
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: categoryStore.c3Id, // 收集三级分类的ID
    categoryLevel: 3,
  })
  scene.value = 1 // 切换为添加与修改属性的结构
}

// table表格修改已有属性按钮的回调
const updateAttr = (row: Attr) => {
  // 切换为添加与修改属性的结构
  scene.value = 1
  // 将已有的属性对象赋值给attrParams对象
  // ES6 -> Object.assign进行对象合并
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

// 删除某一个已有属性的方法回调
const deleteAttr = async (attrId: number) => {
  let result: any = await reqRemoveAttr(attrId)
  if (result.code == 200) {
    ElMessage.success('删除成功')
    getAttr() //删除成功后重新获取一次已有属性与属性值
  } else {
    ElMessage.error('删除失败')
  }
}

// 添加属性值按钮回调
const addAttrValue = () => {
  // 点击添加属性值按钮的时候，向数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, //每一个属性编辑与查看模式切换
  })
  // 获取最后el-input组件聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

// 取消按钮的回调
const cancel = () => {
  scene.value = 0
}

// 保存按钮的回调
const save = async () => {
  // 发送请求
  let result: any = await reqAddOrUpdateAttr(attrParams)
  // 添加或修改属性成功
  if (result.code == 200) {
    scene.value = 0 // 切换场景
    getAttr() //成功后获取已有的属性与属性值
    ElMessage.success(attrParams.id ? '修改成功' : '添加成功')
  } else {
    ElMessage.error(attrParams.id ? '修改失败' : '添加失败')
  }
}

// 属性值表单元素失去焦点 查看模式
const toLook = (row: AttrValue, $index: number) => {
  // 非法情况1的判断
  if (row.valueName.trim() == '') {
    // 删除调用对应属性为空的元素
    attrParams.attrValueList.splice($index, 1)
    // 提示信息
    ElMessage.error('属性值不能为空')
    return
  }
  // 非法情况2的判断
  let repeat = attrParams.attrValueList.find((item) => {
    // 切记把当前失去焦点属性值对象从当前数组中扣除判断
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    // 将重复的属性值从数组中删除
    attrParams.attrValueList.splice($index, 1)
    // 提示信息
    ElMessage.error('属性值不能重复')
    return
  }

  row.flag = false
}

// 编辑模式
const toEdit = (row: AttrValue, $index: number) => {
  // 相应的属性值对象flag：变为true，展示input
  row.flag = true
  // nextTick: 响应式数据发生变化，获取更新的DOM（组件实例）
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}
</script>

<style lang="scss" scoped></style>
