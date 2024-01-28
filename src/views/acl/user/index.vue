<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名：">
        <el-input placeholder="请您输入搜索的用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="!keyword" @click="search">搜索</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card class="m-10">
    <el-button type="primary" size="default" @click="addUser" v-has="`btn.User.add`">添加</el-button>
    <el-button
      type="primary"
      size="default"
      :disabled="!selectIdArr.length"
      @click="deleteSelectUser"
      v-has="`btn.User.remove`"
    >
      批量删除
    </el-button>
    <el-table @selection-change="selectChange" class="m-10" border :data="userArr">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id" width="80px"></el-table-column>
      <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180px"></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180px"></el-table-column>
      <el-table-column label="操作" align="center" width="280px">
        <template #default="{ row }">
          <el-button type="primary" size="small" icon="User" @click="setRole(row)" v-has="`btn.User.assgin`">
            分配角色
          </el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)" v-has="`btn.User.update`">
            编辑
          </el-button>
          <el-popconfirm :title="`您确定要删除${row.username}？`" width="260px" @confirm="deleteUser(row.id)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete" v-has="`btn.User.remove`">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="getHasUser"
      v-model:page-size="pageSize"
      v-model:current-page="pageNo"
      :total="total"
      :background="true"
      :page-sizes="[5, 7, 9, 11]"
      layout="prev, pager, next, jumper, ->, sizes,total "
    />
  </el-card>

  <!-- 抽屉结构：完成添加新的用户账号|更新已有的账号信息 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input placeholder="请您输入用户姓名" v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input placeholder="请您输入用户昵称" v-model="userParams.name"></el-input>
        </el-form-item>
        <el-form-item v-if="!userParams.id" label="用户密码" prop="password">
          <el-input placeholder="请您输入用户密码" v-model="userParams.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
      <el-button type="primary" size="default" @click="save">确定</el-button>
    </template>
  </el-drawer>

  <!-- 抽屉结构：用户某一个已有的账号进行职业分配 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色用户</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
            全选
          </el-checkbox>
          <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
            <!-- <el-checkbox v-for="role in allRole" :key="role.id" :label="role" v-show="role.roleName !== ''"> -->
            <el-checkbox v-for="role in allRole" :key="role.id" :label="role">{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button type="primary" size="default" @click="drawer1 = false">取消</el-button>
      <el-button type="primary" size="default" @click="saveRole">确定</el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref, onMounted, reactive, nextTick } from 'vue'
import useLayOutSettingStore from '@/store/modules/setting'
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  reqSelectUser,
} from '@/api/acl/user'
import type { UserResponseData, Records, User, AllRoleResponseData, AllRole, SetRoleData } from '@/api/acl/user/type'

let pageNo = ref(1) // 页码
let pageSize = ref(5) // 一页展示条数
let total = ref(0) //用户总数
let userArr = ref<Records>([]) // 存储全部用户数组
let drawer = ref(false) //抽屉显示与隐藏
let drawer1 = ref(false) //分配角色抽屉显示与隐藏
let formRef = ref() //获取form组件实列
let checkAll = ref(false) //复选框是否全选
let isIndeterminate = ref(true) //设置不确定状态
let allRole = ref<AllRole>([]) //存储全部职位
let userRole = ref<AllRole>([]) //存储当前用户已有的职位
let selectIdArr = ref<User[]>([]) //存储批量删除用户的ID
let keyword = ref('') //保存搜索关键字
let settingStore = useLayOutSettingStore() //获取模板setting仓库
// 收集用户信息的响应式信息
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})

// 组件挂载初始化数据获取展示
onMounted(() => {
  getHasUser()
})

// 获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value)
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}

// 分页器下拉菜单
const sizeChange = () => {
  getHasUser()
}

// 添加用户
const addUser = () => {
  // 抽屉显示
  drawer.value = true
  // 清空数据
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  })
  // 清除上一次的错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}

// 修改用户
const updateUser = (row: User) => {
  drawer.value = true //抽屉显示
  // 存储收集到的账号信息
  Object.assign(userParams, row)
  // 清除上一次的错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}

// 新增或修改用户保存按钮回调
const save = async () => {
  // 点击保存按钮的时候，务必需要保证表单全部符合条件再去发送请求
  await formRef.value.validate()
  // 保存按钮：添加新的用户|更新已有的用户账号信息
  let result = await reqAddOrUpdateUser(userParams)
  // 添加或者更新成功
  if (result.code) {
    // 关闭抽屉
    drawer.value = false
    // 提示信息
    ElMessage.success(userParams.id ? '更新成功' : '添加成功')
    // 获取最新的全部账号信息
    getHasUser(userParams.id ? pageNo.value : 1)
    // 浏览器自动刷新一次
    // 需求判断是不是修改现在登录的账号，是再进行刷新
    window.location.reload()
  } else {
    // 关闭抽屉
    drawer.value = false
    // 提示信息
    ElMessage.error(userParams.id ? '更新失败' : '添加失败')
  }
}

// 取消按钮的回调
const cancel = () => {
  // 关闭抽屉
  drawer.value = false
}

// 检验用户名字的回调函数
const validatorUsername = (_rule: any, value: any, callBack: any) => {
  // 用户名字|昵称，长度至少5位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位'))
  }
}

// 检验用户昵称的回调函数
const validatorname = (_rule: any, value: any, callBack: any) => {
  // 用户名字|昵称，长度至少5位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}

// 检验用户密码的回调函数
const validatorPassword = (_rule: any, value: any, callBack: any) => {
  // 用户名字|昵称，长度至少5位
  if (value.trim().length >= 6) {
    callBack()
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}

// 表单校验规则对象
const rules = {
  // 用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  // 用户昵称
  name: [{ required: true, trigger: 'blur', validator: validatorname }],
  // 用户密码
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

// 分配角色按钮的回调
const setRole = async (row: User) => {
  // 存储已有用户信息
  Object.assign(userParams, row)
  let result: AllRoleResponseData = await reqAllRole(row.id as number)
  if (result.code == 200) {
    drawer1.value = true //抽屉显示
    userRole.value = result.data.assignRoles //存储当前用户已有的职位
    allRole.value = result.data.allRolesList //存储全部职位
  }
}

// 分配角色 顶部复选框change事件
const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}

const handleCheckedCitiesChange = (value: string[]) => {
  console.log(value)
  // 已经勾选的数组的长度
  checkAll.value = value.length === allRole.value.length
  // 不确定样式
  isIndeterminate.value = value.length !== allRole.value.length
}

// 保存分配角色
const saveRole = async () => {
  // 收集参数
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    }),
  }
  // 分配用户职位
  let result = await reqSetUserRole(data)
  if (result.code == 200) {
    ElMessage.success('分配职务成功') //提示信息
    drawer1.value = false //关闭抽屉
    getHasUser(pageNo.value) //获取更新完的用户信息
  } else {
    ElMessage.error('分配职务失败')
  }
}

// 删除一个用户
const deleteUser = async (userId: number) => {
  let result = await reqRemoveUser(userId)
  if (result.code == 200) {
    ElMessage.success('删除成功')
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败')
  }
}

// table复选款勾选触发的事件
const selectChange = (value: any) => {
  selectIdArr.value = value
}

// 批量删除按钮回调
const deleteSelectUser = async () => {
  // 整理批量删除的参数
  let idList: any = selectIdArr.value.map((item) => {
    return item.id
  })
  let result = await reqSelectUser(idList)
  if (result.code == 200) {
    ElMessage.success('批量删除成功')
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('批量删除失败')
  }
}

// 搜索按钮的回调
const search = () => {
  // 根据关键字获取用户数据
  getHasUser()
  // 清空关键字
  keyword.value = ''
}

// 重置按钮回调
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.m-10 {
  margin: 10px 0px;
}
</style>
