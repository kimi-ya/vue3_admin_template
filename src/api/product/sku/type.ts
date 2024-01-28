// 服务器全部接口返回的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 定义SKU对象的ts类型
export interface Attr {
  id?: number
  attrId: string | number //平台属性的ID
  valueId: string | number //属性值的ID
}

export interface saleAttr {
  id?: number
  saleAttrId: string | number //属性ID
  saleAttrValueId: string | number //属性值的ID
}

export interface SkuData {
  category3Id?: string | number //三级分类的ID
  spuId?: string | number //已有的SPU的ID
  tmId?: string | number //SPU品牌的ID
  skuName?: string //SKU的名字
  price?: string | number //SKU的价格
  weight?: string | number //SKU的重量
  skuDesc?: string //SKU的描述
  skuAttrValueList?: Attr[] //平台属性的收集
  skuSaleAttrValueList?: saleAttr[] // 销售属性
  skuDefaultImg?: string //SKU图片地址
  isSale?: number // 商品上架与下架
  id?: number
}

// 获取SKU接口返回数据ts类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
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

// 获取SKU商品详情接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
