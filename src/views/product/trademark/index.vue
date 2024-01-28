<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片顶部添加品牌按钮 -->
      <el-button type="primary" size="default" icon="Plus" @click="addTrademark" v-has="`btn.Trademark.add`">
        添加品牌
      </el-button>
      <!-- 表格组件：用于展示已有的品牌数据 -->
      <!-- 
        table
          border：可以设置表格纵向是否有边框
        table-column
          label：某一个列表标题
          width：设置这列宽度
          align：设置这一列对齐方式
       -->
      <el-table border :data="trademarkArr" style="margin: 10px 0px">
        <!-- el-table-column: 默认展示数据用div -->
        <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
        <el-table-column label="品牌名称" prop="tmName"></el-table-column>
        <el-table-column label="品牌LOGO">
          <template #default="{ row }">
            <img :src="row.logoUrl" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateTrademark(row)"
              v-has="`btn.Trademark.update`"
            ></el-button>
            <el-popconfirm
              :title="`您确定要删除${row.tmName}?`"
              width="250px"
              icon="Delete"
              @confirm="removeTradeMark(row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" icon="Delete" v-has="`btn.Trademark.remove`"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器组件
        pagination
          v-model:current-page：设置分页器当前页码
          v-model:page-size：设置每一个展示数据条数
          page-sizes：用于设置下拉菜单数据
          background: 设置分页器按钮背景颜色
          layout：可以设置分页器六个子组件布局调整
       -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="getHasTrademark"
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :pager-count="9"
        :background="true"
        :total="total"
        layout="prev, pager, next, jumper, ->, sizes, total"
      />
    </el-card>
    <!-- 对话框组件：在添加品牌与修改已有品牌的业务时候使用结构 -->
    <!-- 
      v-model： 属性用户控制对话框的显示与隐藏的 true显示 false隐藏
      title： 设置对话框左上角标题
     -->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
      <el-form style="width: 80%" label-width="100px" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input placeholder="请您输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <!-- el-upload组件属性
            action: 图片上传路径书写不带/api，代理服务器不发送这次post请求
           -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽： footer -->
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
        <el-button type="primary" size="default" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
// 引入组合式API函数ref
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark'
import { Records, TradeMarkResponseData, TradeMark } from '@/api/product/trademark/type'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'

let pageNo = ref<number>(1) // 当前页码
let limit = ref<number>(3) // 每一页展示多少条数据
let total = ref<number>(0) // 存储已有品牌数据总数
let trademarkArr = ref<Records>([]) // 存储已有品牌的数据
let dialogFormVisible = ref<boolean>(false) // 控制对话框的显示与隐藏
let formRef = ref() // 获取el-form组件实例
// 定义收集新增品牌数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})

// 组件挂载完毕钩子 -- 发一次请求，获取第一页、一页三个已有品牌数据
onMounted(() => {
  getHasTrademark()
})

// 分页器当前页码发生变化的时候会触发
// 对于当前页码发生变化自定义事件，组件pagination父组件回传了数据（当前的页码）
// const changePageNo = () => {
//   // 当前页码发生变化的时候再次发请求获取对应已有品牌数据展示
//   getHasTrademark()
// }

// 当下拉菜单几条/页发生变化的时候触发此方法
// 这个自定义事件，分页器组件会将下拉菜单选中数据返回
const sizeChange = () => {
  // 当前每一页的数据量发生变化的时候，当前页码归1
  // pageNo.value = 1
  getHasTrademark()
}

// 获取已有品牌的接口封装为一个函数：在任何情况下向获取数据，调用函数即可
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  let result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
  if (result.code == 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}

// 添加品牌按钮的回调
const addTrademark = () => {
  // 对话框显示
  dialogFormVisible.value = true
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''

  // 第一种写法：ts的问号方法
  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')
  nextTick(() => {
    formRef.value?.clearValidate('tmName')
    formRef.value?.clearValidate('logoUrl')
  })
}

// 修改已有品牌的按钮的回调
// row: row即为当前已有的品牌
const updateTrademark = (row: TradeMark) => {
  // 清除校验规则错误提示信息
  nextTick(() => {
    formRef.value?.clearValidate('tmName')
    formRef.value?.clearValidate('logoUrl')
  })
  dialogFormVisible.value = true
  // 展示已有品牌数据
  // ES6语法合并对象
  Object.assign(trademarkParams, row)
}

// 会话框底部取消按钮
const cancel = () => {
  // 对话框隐藏
  dialogFormVisible.value = false
}

// 会话框底部确定按钮
const confirm = async () => {
  // 在你发请求之前，要对于整个表单进行校验
  // 调用在这个方法进行全部表单想校验，如果校验全部通过，再执行后面的语法
  await formRef.value.validate()

  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  // 添加|修改品牌成功
  if (result.code == 200) {
    dialogFormVisible.value = false // 关闭对话框
    ElMessage.success(trademarkParams.id ? '修改品牌成功' : '添加品牌成功')
    // 添加成功后，再次发送请求获取已有全部品牌的更新
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    // 添加失败
    ElMessage.error(trademarkParams.id ? '修改品牌失败' : '添加品牌失败')
    dialogFormVisible.value = false
  }
}

// 上传图片组件  上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 钩子是在图片上传成功之前触发，上传文件之前可以约束文件类型与大小
  // 要求：上传文件格式png|jpg|gif 大小：4M
  if (rawFile.type == 'image/jpeg' || rawFile.type == 'image/png' || rawFile.type == 'image/gif') {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage.error('上传文件大小要求小于4M')
      return false
    }
  } else {
    ElMessage.error('上传文件格式必须是PNG|JPG|GIF')
    return false
  }
}

// 图片上传成功的钩子
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, _uploadFile) => {
  // response： 即为当前这次上传图片post请求服务器返回的数据
  // 收集上传图片地址，添加一个新的品牌的时候带给服务器
  trademarkParams.logoUrl = response.data
  // 图片上传成功，清除掉对应图片校验的结果
  formRef.value.clearValidate('logoUrl')
}

// 品牌自定义校验规则方法
const validatorTmName = (_rule: any, value: any, callBack: any) => {
  // 是当表单元素触发blur时候，会触发此方法
  // 自定义校验规则
  if (value.trim().length >= 2) {
    callBack()
  } else {
    // 校验未通过返回的错误的提示信息
    callBack(new Error('品牌名称位数大于等于两位'))
  }
}

// 品牌logo图片的自定义校验规则方法
const validatorLogoUrl = (_rule: any, value: any, callBack: any) => {
  // 如果图片上传
  if (value) {
    callBack()
  } else {
    callBack(new Error('LOGO图片务必上传'))
  }
}

// 表单校验规则对象
const rules = {
  /**
   * required: 这个字段务必校验，表单项前面出现星号
   * trigger：代表触发校验规则时机[blur, change]
   */
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}

// 气泡确认框确定按钮的回调
const removeTradeMark = async (id: number) => {
  let result: any = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage.success('删除品牌成功')
    getHasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除品牌失败')
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
