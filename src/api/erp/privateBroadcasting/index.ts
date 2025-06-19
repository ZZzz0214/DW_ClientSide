import request from '@/config/axios'

// ERP 私播货盘 Response VO
export interface ErpPrivateBroadcastingRespVO {
  id?: number // 私播货盘编号
  no?: string // 编号
  productImage?: string | string[] // 产品图片（多张，逗号分隔）
  brandName?: string // 品牌名称
  productName?: string // 产品名称
  productSpec?: string // 产品规格
  productSku?: string // 产品SKU
  marketPrice?: number // 市场价格
  shelfLife?: string // 保质日期
  productStock?: number // 产品库存
  livePrice?: number // 直播价格
  productNakedPrice?: number // 产品裸价
  expressFee?: number // 快递费用
  dropshipPrice?: number // 代发价格
  publicLink?: string // 公域链接
  coreSellingPoint?: string // 核心卖点
  expressCompany?: string // 快递公司
  shippingTime?: string // 发货时效
  shippingArea?: string // 发货地区
  remark?: string // 备注信息
  privateStatus?: string // 私播货盘状态
  createTime?: Date // 创建时间
}

// ERP 私播货盘保存 Request VO
export interface ErpPrivateBroadcastingSaveReqVO {
  id?: number // 私播货盘编号
  no: string // 编号
  productImage?: string // 产品图片（多张，逗号分隔）
  brandName?: string // 品牌名称
  productName: string // 产品名称
  productSpec?: string // 产品规格
  productSku?: string // 产品SKU
  marketPrice?: number // 市场价格
  shelfLife?: string // 保质日期
  productStock: number // 产品库存
  livePrice: number // 直播价格
  productNakedPrice?: number // 产品裸价
  expressFee?: number // 快递费用
  dropshipPrice?: number // 代发价格
  publicLink?: string // 公域链接
  coreSellingPoint?: string // 核心卖点
  expressCompany?: string // 快递公司
  shippingTime?: string // 发货时效
  shippingArea?: string // 发货地区
  remark?: string // 备注信息
  privateStatus?: string // 私播货盘状态
}

// ERP 私播货盘分页 Request VO
export interface ErpPrivateBroadcastingPageReqVO {
  no?: string // 编号
  createTime?: Date[] // 创建时间范围
  // 其他分页参数（可根据实际需求添加）
  current?: number // 当前页码
  size?: number // 每页大小
}

// ERP 私播货盘 API
export const ErpPrivateBroadcastingApi = {
  // 查询私播货盘分页
  getPrivateBroadcastingPage: async (params: ErpPrivateBroadcastingPageReqVO) => {
    return await request.get({ url: `/erp/private-broadcasting/page`, params })
  },

  // 查询私播货盘详情
  getPrivateBroadcasting: async (id: number) => {
    return await request.get({ url: `/erp/private-broadcasting/get?id=${id}` })
  },

  // 新增私播货盘
  createPrivateBroadcasting: async (data: ErpPrivateBroadcastingSaveReqVO) => {
    return await request.post({ url: `/erp/private-broadcasting/create`, data })
  },

  // 修改私播货盘
  updatePrivateBroadcasting: async (data: ErpPrivateBroadcastingSaveReqVO) => {
    return await request.put({ url: `/erp/private-broadcasting/update`, data })
  },

  // 删除私播货盘
  deletePrivateBroadcasting: async (ids: number[]) => {
    return await request.delete({ url: `/erp/private-broadcasting/delete`, params: { ids: ids.join(',') } })
  },

  // 根据ID列表获取私播货盘列表
  getPrivateBroadcastingListByIds: async (ids: number[]) => {
    return await request.get({ url: `/erp/private-broadcasting/list-by-ids`, params: { ids } })
  },

  // 导出私播货盘
  exportPrivateBroadcasting: async (params: ErpPrivateBroadcastingPageReqVO) => {
    return await request.download({ url: `/erp/private-broadcasting/export-excel`, params })
  },

  // 下载私播货盘导入模版
  importPrivateBroadcastingTemplate: async () => {
    return await request.download({ url: `/erp/private-broadcasting/get-import-template` })
  },

  // 导入私播货盘
  importPrivateBroadcasting: async (params: any) => {
    return await request.upload({ url: `/erp/private-broadcasting/import`, ...params })
  }
}