export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 一个职位的ts类型
export interface RoleData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark?: null
}

// 全部职位列表
export type Records = RoleData[]

// 获取全部职位的接口返回的数据ts类型
export interface RoleResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

// 菜单与按钮数据
export interface MeunData {
  id: number
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
