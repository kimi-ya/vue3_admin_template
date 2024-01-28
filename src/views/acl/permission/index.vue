<template>
  <el-table :data="permissionArr" border row-key="id" style="width: 100%; margin-bottom: 20px">
    <el-table-column sortable label="名称" prop="name"></el-table-column>
    <el-table-column sortable label="权限值" prop="code"></el-table-column>
    <el-table-column sortable label="修改时间" prop="updateTime"></el-table-column>
    <el-table-column sortable label="操作">
      <template #default="{ row }">
        <el-button
          type="primary"
          size="small"
          :disabled="row.level == 4"
          @click="addPermission(row)"
          v-has="`btn.Permission.add`"
        >
          {{ row.level == 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="row.level == 1"
          @click="updatePermission(row)"
          v-has="`btn.Permission.update`"
        >
          编辑
        </el-button>
        <el-popconfirm :title="`您确定要删除${row.name}？`" width="260px" @confirm="deletePermission(row.id)">
          <template #reference>
            <el-button type="primary" size="small" :disabled="row.level == 1" v-has="`btn.Permission.remove`">
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="dialogVisible" :title="menuData.id ? '更新菜单' : '添加菜单'" style="width: 500px">
    <el-form label-width="80px">
      <el-form-item label="名称">
        <el-input placeholder="请您输入菜单名称" v-model="menuData.name"></el-input>
      </el-form-item>
      <el-form-item label="权限值">
        <el-input placeholder="请您输入权限数值" v-model="menuData.code"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import { reqAllPermission, reqAddOrUpdateMenu, reqRemoveMenu } from '@/api/acl/menu'
import { MenuResponseData, MenuList, MenuParams, MeunData } from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'

let permissionArr = ref<MenuList>([]) //存储菜单数据
let dialogVisible = ref(false) //控制对话框显示与隐藏
let menuData = reactive<MenuParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0,
})

onMounted(() => {
  getHasMenu()
})

// 获取菜单的方法
const getHasMenu = async () => {
  let result: MenuResponseData = await reqAllPermission()
  if (result.code == 200) {
    permissionArr.value = result.data
  }
}

// 添加菜单按钮回调
const addPermission = (row: MeunData) => {
  // 清空数据
  Object.assign(menuData, {
    id: 0,
    code: '',
    level: 0,
    name: '',
    pid: 0,
  })
  dialogVisible.value = true
  // 收集菜单level数值
  menuData.level = row.level + 1
  // 搜集菜单pid(父级的id)
  menuData.pid = row.id as number
}

// 编辑按钮回调
const updatePermission = (row: MeunData) => {
  dialogVisible.value = true
  Object.assign(menuData, row)
}

// 删除按钮回调
const deletePermission = async (id: number) => {
  let result = await reqRemoveMenu(id)
  if (result.code == 200) {
    ElMessage.success('删除菜单成功')
    getHasMenu() //获取全部菜单信息
  } else {
    ElMessage.error('删除菜单失败')
  }
}

// 抽屉确认按钮的回调
const save = async () => {
  let result = await reqAddOrUpdateMenu(menuData)
  if (result.code == 200) {
    dialogVisible.value = false
    ElMessage.success(menuData.id ? '更新菜单成功' : '添加菜单成功')
    getHasMenu() //获取全部菜单信息
  } else {
    ElMessage.error(menuData.id ? '更新菜单失败' : '添加菜单失败')
    dialogVisible.value = false
  }
}
</script>

<style lang="scss" scoped></style>
