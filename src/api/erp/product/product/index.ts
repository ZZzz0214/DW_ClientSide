import request from '@/config/axios'

// ERP 产品 VO
// export interface ProductVO {
//   id: number // 产品编号
//   name: string // 产品名称
//   barCode: string // 产品条码
//   categoryId: number // 产品类型编号
//   unitId: number // 单位编号
//   unitName?: string // 单位名字
//   status: number // 产品状态
//   standard: string // 产品规格
//   remark: string // 产品备注
//   expiryDay: number // 保质期天数
//   weight: number // 重量（kg）
//   purchasePrice: number // 采购价格，单位：元
//   salePrice: number // 销售价格，单位：元
//   minPrice: number // 最低价格，单位：元
// }
export interface ProductVO {
  id: number; // 产品编号
  name: string; // 产品名称
  image?: string; // 产品图片
  productShortName?: string; // 产品简称
  shippingCode?: string; // 发货编码
  unitId: number; // 单位编号
  standard?: string; // 产品规格
  weight?: number; // 产品重量（单位：kg）
  productionDate?: Date; // 产品日期
  expiryDay?: number; // 保质期天数
  brand?: string; // 品牌名称
  categoryId: number; // 产品品类编号
  status: number; // 产品状态
  productSellingPoints?: string; // 产品卖点
  barCode: string; // 条形编号
  productRecord?: string; // 备案编号
  executionCode?: string; // 执行编号
  trademarkCode?: string; // 商标编号
  availableStockQuantity?: number; // 现货数量
  packagingMaterialQuantity?: number; // 包材数量
  orderReplenishmentLeadTime?: string; // 返单时效
  productDimensions?: string; // 产品长宽高
  cartonSpecifications?: string; // 产品箱规
  cartonDimensions?: string; // 箱长宽高
  cartonWeight?: number; // 箱规重量
  shippingAddress?: string; // 发货地址
  returnAddress?: string; // 退货地址
  logisticsCompany?: string; // 快递公司
  nonshippingArea?: string; // 不发货区
  addonShippingArea?: string; // 加邮地区
  afterSalesStandard?: string; // 售后标准
  afterSalesScript?: string; // 售后话术
  publicDomainEventMinimumPrice?: number; // 公域活动最低价
  liveStreamingEventMinimunPrice?: number; // 直播活动最低价
  pinduoduoEventMinimumPrice?: number; // 拼多多活动最低价
  alibabaEventMinimunPrice?: number; // 阿里巴巴活动最低价
  groupBuyEventMinimunPrice?: number; // 团购活动最低价
  purchaser?: string; // 采购人员
  supplier?: string; // 供应商名
  purchasePrice?: number; // 采购单价（单位：元）
  wholesalePrice?: number; // 批发单价（单位：元）
  remark?: string; // 备注信息
  minPurchasePrice?: number; // 对外最低采购单价（单位：元）
  minWholesalePrice?: number; // 对外最低批发单价（单位：元）
  shippingFeeType?: number; // 运费类型（0：固定运费，1：按件计费，2：按重计费）
  fixedShippingFee?: number; // 固定运费（单位：元）
  firstItemQuantity?: number; // 首件数量
  firstItemPrice?: number; // 首件价格（单位：元）
  additionalItemQuantity?: number; // 续件数量
  additionalItemPrice?: number; // 续件价格（单位：元）
  firstWeight?: number; // 首重重量（单位：kg）
  firstWeightPrice?: number; // 首重价格（单位：元）
  additionalWeight?: number; // 续重重量（单位：kg）
  additionalWeightPrice?: number; // 续重价格（单位：元）
}

// ERP 产品 API
export const ProductApi = {
  // 查询产品分页
  getProductPage: async (params: any) => {
    return await request.get({ url: `/erp/product/page`, params })
  },

  // 查询产品精简列表
  getProductSimpleList: async () => {
    return await request.get({ url: `/erp/product/simple-list` })
  },

  // 查询产品详情
  getProduct: async (id: number) => {
    return await request.get({ url: `/erp/product/get?id=` + id })
  },

  // 新增产品
  createProduct: async (data: ProductVO) => {
    return await request.post({ url: `/erp/product/create`, data })
  },

  // 修改产品
  updateProduct: async (data: ProductVO) => {
    return await request.put({ url: `/erp/product/update`, data })
  },

  // 删除产品
  deleteProduct: async (id: number) => {
    return await request.delete({ url: `/erp/product/delete?id=` + id })
  },

  // 导出产品 Excel
  exportProduct: async (params) => {
    return await request.download({ url: `/erp/product/export-excel`, params })
  }
}
