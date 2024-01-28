<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索">
        <el-input placeholder="请您输入搜索职位关键字" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="!keyword" @click="search">搜索</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card class="m-10">
    <el-button type="primary" size="default" @click="addRole" v-has="`btn.Role.add`">添加职位</el-button>
    <el-table class="m-10" border :data="allRole">
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id" width="80px"></el-table-column>
      <el-table-column label="职位名称" align="center" prop="roleName"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180px"></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180px"></el-table-column>
      <el-table-column label="操作" align="center" width="280px">
        <template #default="{ row }">
          <el-button type="primary" size="small" icon="User" @click="setPermission(row)" v-has="`btn.Role.assgin`">
            分配权限
          </el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)" v-has="`btn.Role.update`">
            编辑
          </el-button>
          <el-popconfirm :title="`您确定要删除${row.roleName}？`" width="260px" @confirm="deleteRole(row.id)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete" v-has="`btn.Role.remove`">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器组件 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="getHasRole"
      v-model:page-size="pageSize"
      v-model:current-page="pageNo"
      :total="total"
      :background="true"
      :page-sizes="[10, 20, 30, 40]"
      layout="prev, pager, next, jumper, ->, sizes,total "
    />
  </el-card>

  <!-- 添加职位|更新职位 对话框 -->
  <el-dialog v-model="dialogVisite" :title="roleParams.id ? '更新职位' : '新增职位'">
    <el-form :model="roleParams" :rules="rules" ref="form">
      <el-form-item label="角色名称" prop="roleName">
        <el-input placeholder="请填写职位名称" v-model="roleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="dialogVisite = false">取消</el-button>
      <el-button type="primary" size="default" @click="save">确定</el-button>
    </template>
  </el-dialog>

  <!-- 抽屉组件：分配职位的菜单权限与按钮权限 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配权限</h4>
    </template>
    <template #default>
      <!-- 树形控件 -->
      <el-tree
        ref="tree"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <el-button @click="drawer = false">取消</el-button>
      <el-button type="primary" @click="handler">确定</el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import useLayOutSettingStore from '@/store/modules/setting'
import { reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermission, reqRemoveRole } from '@/api/acl/role'
import { Records, RoleResponseData, RoleData, MenuResponseData, MenuList } from '@/api/acl/role/type'

let pageNo = ref(1) // 页码
let pageSize = ref(10) // 一页展示条数
let total = ref(0) //用户总数
let keyword = ref('') //搜索关键字
let allRole = ref<Records>([]) //存储全部职位列表
let settingStore = useLayOutSettingStore() //获取模板setting仓库
let dialogVisite = ref(false) //对话框显示与隐藏变量
let form = ref() //获取form组件实例
let drawer = ref(false) //控制抽屉显示与隐藏
let menuArr = ref<MenuList>([]) //存储用户权限数据
let selectArr = ref<number[]>([]) //存储已勾选权限的ID
let tree = ref() //获取tree组件实例
// 收集新增岗位数据
let roleParams = reactive<RoleData>({
  roleName: '',
})

onMounted(() => {
  getHasRole()
})

const getHasRole = async (pager = 1) => {
  pageNo.value = pager //修改当前页码
  let result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
  if (result.code == 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}

// 分页器条数切换
const sizeChange = () => {
  getHasRole()
}

// 搜索按钮的回调
const search = () => {
  // 根据关键字获取职位数据
  getHasRole()
  // 清空关键字
  keyword.value = ''
}

// 重置按钮回调
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}

// 添加职位按钮
const addRole = () => {
  dialogVisite.value = true
  // 清空数据
  Object.assign(roleParams, {
    roleName: '',
    id: 0,
  })
  // 清空上一次表单验证的错误信息
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

// 编辑职位按钮
const updateRole = (row: RoleData) => {
  dialogVisite.value = true
  Object.assign(roleParams, row)
}

// 自定义校验规则的回调
const validatorRoleName = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('职位名称至少2位'))
  }
}

//职位校验规则
const rules = {
  roleName: [{ require: true, trigger: 'blur', validator: validatorRoleName }],
}

// 新增或更新职位确定按钮回调
const save = async () => {
  // 表单校验结果通过再发请求，没通过不发请求
  await form.value.validate()
  let result = await reqAddOrUpdateRole(roleParams)
  if (result.code == 200) {
    ElMessage.success(roleParams.id ? '更新成功' : '添加成功')
    dialogVisite.value = false
    getHasRole(roleParams.id ? pageNo.value : 1)
  } else {
    ElMessage.error(roleParams.id ? '更新失败' : '添加失败')
  }
}

// 分配权限按钮回调
const setPermission = async (row: RoleData) => {
  drawer.value = true
  // 收集当前要分类权限的职位数据
  Object.assign(roleParams, row)
  // 根据职位获取权限的数据
  let result: MenuResponseData = await reqAllMenuList(row.id as number)
  if (result.code == 200) {
    menuArr.value = result.data
  }
  selectArr.value = filterSelectArr(menuArr.value, [])
}

const defaultProps = {
  children: 'children',
  label: 'name',
}

const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}

// 抽屉确认按钮回调
const handler = async () => {
  // 职位ID
  const roleId = roleParams.id as number
  // 选中复选的ID
  let arr = tree.value.getCheckedKeys()
  // 半选的id
  let arr1 = tree.value.getHalfCheckedKeys()
  let permissionId = arr.concat(arr1)
  let result = await reqSetPermission(roleId, permissionId)
  if (result.code == 200) {
    // 抽屉关闭
    drawer.value = false
    // 页面刷新
    ElMessage.success('分配权限成功')
    window.location.reload()
  } else {
    ElMessage.error('分配权限失败')
  }
}

// 删除职位
const deleteRole = async (roleId: number) => {
  let result = await reqRemoveRole(roleId)
  if (result.code == 200) {
    ElMessage.success('删除职位成功')
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除职位失败')
  }
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
