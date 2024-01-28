// SKU模块接口管理
import request from '@/utils/request'
import type { SkuResponseData, SkuInfoData } from './type'

enum API {
  // 获取已有的商品数据SKU
  SKU_URL = '/admin/product/list/',
  // 上架
  SALE_URL = '/admin/product/onSale/',
  // 下架
  CANCELSALE_URL = '/admin/product/cancelSale/',
  // 获取商品详情
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  //删除SKU商品
  DELETESKU_URL = '/admin/product/deleteSku/',
}

// 获取商品SKU数据
export const reqSkuList = (page: number, limit: number) => {
  return request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
}

// 上架商品
export const reqSaleSku = (skuId: number) => request.get<any, any>(API.SALE_URL + skuId)

// 下架商品
export const reqCancelSale = (skuId: number) => request.get<any, any>(API.CANCELSALE_URL + skuId)

// 获取商品详情
export const reqSkuInfo = (skuId: number) => request.get<any, SkuInfoData>(API.SKUINFO_URL + skuId)

//删除SKU商品
export const reqRemoveSku = (skuId: number) => request.delete<any, any>(API.DELETESKU_URL + skuId)
