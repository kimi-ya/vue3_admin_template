// 角色管理模块接口
import request from '@/utils/request'
import type { RoleResponseData, RoleData, MenuResponseData } from './type'

enum API {
  // 获取全部职位接口
  ALLROLE_URL = '/admin/acl/role/',
  // 新增职位
  ADDROLE_URL = '/admin/acl/role/save',
  // 更新修改职位
  UPDATEROLE_URL = '/admin/acl/role/update',
  // 获取全部的菜单与按钮的数据
  ALLPERMISSION_URL = '/admin/acl/permission/toAssign/',
  // 给相应的职位分配权限
  SETPERMISSION_URL = '/admin/acl/permission/doAssign/?',
  // 删除职位
  REMOVEROLE_URL = '/admin/acl/role/remove/',
}

// 获取全部职位接口
export const reqAllRoleList = (page: number, limit: number, roleName: string) => {
  return request.get<any, RoleResponseData>(API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`)
}

// 新增职位|更新修改职位
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}

// 获取全部的菜单与按钮的数据
export const reqAllMenuList = (roleId: number) => request.get<any, MenuResponseData>(API.ALLPERMISSION_URL + roleId)

// 给相应的职位分配权限
export const reqSetPermission = (roleId: number, permissionId: number[]) => {
  return request.post<any, any>(API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`)
}

// 删除职位
export const reqRemoveRole = (roleId: number) => request.delete<any, any>(API.REMOVEROLE_URL + roleId)
