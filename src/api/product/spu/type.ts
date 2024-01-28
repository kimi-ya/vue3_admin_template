// 服务器全部接口返回的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SPU数据的类型
export interface SpuData {
  id?: number
  spuName: string
  tmId: number | string
  description: string
  category3Id: number | string
  spuImageList: null | SpuImg[]
  spuSaleAttrList: null | SaleAttr[]
  spuPosterList?: null
  createTime?: string
  updateTime?: string
}

// 数组：元素都是已有SPU数据类型
export type Records = SpuData[]

// 定义获取已有的SPU接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    orders: any[]
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

// 所有品牌数据的类型
export interface Trademark {
  id: number
  createTime: string
  updateTime: string
  tmName: string
  logoUrl: string
}

// 品牌接口返回数据类型
export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}

// 商品图片的ts类型
export interface SpuImg {
  id?: number
  imgName: string
  imgUrl: string
  spuId?: number
  createTime?: string
  updateTime?: string
}

// 已有的SPU的照片墙数据类型
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}

// 已有的销售属性值对象ts类型
export interface SaleAttrValue {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}

// 存储已有的销售属性值数组类型
export type spuSaleAttrValueList = SaleAttrValue[]

// 销售属性对象ts类型
export interface SaleAttr {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: spuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
}

// SPU已有的销售属性接口返回数据ts类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

// 已有的全部SPU的返回数据ts类型
export interface HasSaleAttr {
  id: number
  createTime: string
  updateTime: string
  name: string
}

export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}

export interface Attr {
  attrId: string | number //平台属性的ID
  valueId: string | number //属性值的ID
}

export interface saleAttr {
  saleAttrId: string | number //属性ID
  saleAttrValueId: string | number //属性值的ID
}

// 添加SKU携带的参数类型
export interface SkuData {
  category3Id: string | number //三级分类的ID
  spuId: string | number //已有的SPU的ID
  tmId: string | number //SPU品牌的ID
  skuName: string //SKU的名字
  price: string | number //SKU的价格
  weight: string | number //SKU的重量
  skuDesc: string //SKU的描述
  skuAttrValueList?: Attr[] //平台属性的收集
  skuSaleAttrValueList?: saleAttr[] // 销售属性
  skuDefaultImg: string //SKU图片地址
}

// 获取SKU数据接口的数据ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
