export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 菜单与按钮数据
export interface MeunData {
  id?: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: string
  toCode: string
  type: number
  status: null
  level: number
  children?: MenuList
  slelct: boolean
}

export type MenuList = MeunData[]

export interface MenuResponseData extends ResponseData {
  data: MenuList
}

// 添加与修改菜单携带的参数类型
export interface MenuParams {
  id?: number
  code: string
  level: number
  name: string
  pid: number
}
