// 菜单模块管理接口
import request from '@/utils/request'
import type { MenuResponseData, MenuParams } from './type'

enum API {
  // 获取全部菜单与按钮标识数据
  ALLPERMISSION_URL = '/admin/acl/permission',
  // 新增菜单
  ADDMENU_URL = '/admin/acl/permission/save',
  // 更新菜单
  UPDATEMENU_URL = '/admin/acl/permission/update',
  // 删除菜单
  REMOVEMENU_URL = '/admin/acl/permission/remove/',
}

// 获取全部菜单
export const reqAllPermission = () => request.get<any, MenuResponseData>(API.ALLPERMISSION_URL)

// 添加|更新菜单
export const reqAddOrUpdateMenu = (data: MenuParams) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEMENU_URL, data)
  } else {
    return request.post<any, any>(API.ADDMENU_URL, data)
  }
}

// 删除菜单
export const reqRemoveMenu = (id: number) => request.delete<any, any>(API.REMOVEMENU_URL + id)
