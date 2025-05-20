import request from '@/config/axios'

// ERP 直播货盘 VO
export interface LiveBroadcastingVO {
  id?: number // 直播货盘编号
  no?: string // 编号
  productImage?: string // 产品图片
  brandId?: number // 品牌ID
  productName?: string // 产品名称
  productSpec?: string // 产品规格
  productSku?: string // 产品SKU
  marketPrice?: number // 市场价格
  shelfLife?: Date // 保质日期
  productStock?: number // 产品库存
  coreSellingPoint?: string // 核心卖点
  remark?: string // 备注信息
  livePrice?: number // 直播价格
  liveCommission?: number // 直播佣金
  publicCommission?: number // 公开佣金
  rebateCommission?: number // 返点佣金
  expressCompany?: string // 快递公司
  shippingTime?: string // 发货时效
  shippingArea?: string // 发货地区
  createTime?: Date // 创建时间
}

// ERP 直播货盘保存 Request VO
export interface LiveBroadcastingSaveReqVO {
  id?: number // 直播货盘ID
  no: string // 编号
  productImage?: string // 产品图片
  brandId: number // 品牌ID
  productName: string // 产品名称
  productSpec?: string // 产品规格
  productSku?: string // 产品SKU
  marketPrice: number // 市场价格
  shelfLife?: Date // 保质日期
  productStock: number // 产品库存
  coreSellingPoint?: string // 核心卖点
  remark?: string // 备注信息
  livePrice: number // 直播价格
  liveCommission: number // 直播佣金
  publicCommission?: number // 公开佣金
  rebateCommission?: number // 返点佣金
  expressCompany?: string // 快递公司
  shippingTime?: string // 发货时效
  shippingArea?: string // 发货地区
}

// ERP 直播货盘分页 Request VO
export interface LiveBroadcastingPageReqVO {
  no?: string // 编号
  brandId?: number // 品牌ID
  productName?: string // 产品名称
  createTime?: Date[] // 创建时间
}

// ERP 直播货盘 API
export const LiveBroadcastingApi = {
  // 查询直播货盘分页
  getLiveBroadcastingPage: async (params: LiveBroadcastingPageReqVO) => {
    return await request.get({ url: `/erp/live-broadcasting/page`, params })
  },

  // 查询直播货盘详情
  getLiveBroadcasting: async (id: number) => {
    return await request.get({ url: `/erp/live-broadcasting/get?id=` + id })
  },

  // 新增直播货盘
  createLiveBroadcasting: async (data: LiveBroadcastingSaveReqVO) => {
    return await request.post({ url: `/erp/live-broadcasting/create`, data })
  },

  // 修改直播货盘
  updateLiveBroadcasting: async (data: LiveBroadcastingSaveReqVO) => {
    return await request.put({ url: `/erp/live-broadcasting/update`, data })
  },

  // 删除直播货盘
  deleteLiveBroadcasting: async (ids: number[]) => {
    return await request.delete({ url: `/erp/live-broadcasting/delete`, params: { ids: ids.join(',') } })
  },

  // 根据ID列表获取直播货盘列表
  getLiveBroadcastingListByIds: async (ids: number[]) => {
    return await request.get({ url: `/erp/live-broadcasting/list-by-ids`, params: { ids } })
  },

  // 导出直播货盘 Excel
  exportLiveBroadcasting: async (params: LiveBroadcastingPageReqVO) => {
    return await request.download({ url: `/erp/live-broadcasting/export-excel`, params })
  }
}