import request from '@/config/axios'

// ERP 私播复盘 Response VO
export interface ErpPrivateBroadcastingReviewRespVO {
  id?: number // 私播复盘编号
  no?: string // 编号
  privateBroadcastingId?: number // 私播货盘表ID
  privateBroadcastingNo?: string // 私播货盘表编号
  brandName?: any // 品牌名称
  productName?: string // 产品名称
  productSpec?: string // 产品规格
  productSku?: string // 产品SKU
  livePrice?: number // 直播价格
  privateStatus?: any // 货盘状态
  customerId?: number // 客户ID
  customerName?: string // 客户名称
  productPrice?: number // 产品价格
  productNakedPrice?: number // 产品裸价
  expressFee?: number // 快递费用
  distributionPrice?: number // 代发价格
  dropshipPrice?: number // 代发价格
  sampleSendDate?: string // 寄样日期
  groupStartDate?: string // 开团日期
  groupSales?: number // 开团销量
  reGroupDate?: string // 复团日期
  repeatGroupDate?: string // 复团日期
  reGroupSales?: number // 复团销量
  repeatGroupSales?: number // 复团销量
  remark?: string // 备注信息
  createTime?: Date // 创建时间
}

// ERP 私播复盘保存 Request VO
export interface ErpPrivateBroadcastingReviewSaveReqVO {
  id?: number // 私播复盘编号
  no: string // 编号
  privateBroadcastingId: number // 私播货盘表ID
  privateBroadcastingNo?: string // 私播货盘表编号
  brandName?: any // 品牌名称
  productName?: string // 产品名称
  productSpec?: string // 产品规格
  productSku?: string // 产品SKU
  livePrice?: number // 直播价格
  privateStatus?: any // 货盘状态
  customerId?: number // 客户ID
  customerName?: string // 客户名称
  productPrice?: number // 产品价格
  productNakedPrice?: number // 产品裸价
  expressFee?: number // 快递费用
  distributionPrice?: number // 代发价格
  dropshipPrice?: number // 代发价格
  sampleSendDate?: string // 寄样日期
  groupStartDate?: string // 开团日期
  groupSales?: number // 开团销量
  reGroupDate?: string // 复团日期
  repeatGroupDate?: string // 复团日期
  reGroupSales?: number // 复团销量
  repeatGroupSales?: number // 复团销量
  remark?: string // 备注信息
}

// ERP 私播复盘分页 Request VO
export interface ErpPrivateBroadcastingReviewPageReqVO {
  no?: string // 编号
  privateBroadcastingId?: number // 私播货盘表ID
  createTime?: Date[] // 创建时间范围
}

// ERP 私播复盘 API
export const ErpPrivateBroadcastingReviewApi = {
  // 查询私播复盘分页
  getPrivateBroadcastingReviewPage: async (params: ErpPrivateBroadcastingReviewPageReqVO) => {
    return await request.get({ url: `/erp/private-broadcasting-review/page`, params })
  },

  // 查询私播复盘详情
  getPrivateBroadcastingReview: async (id: number) => {
    return await request.get({ url: `/erp/private-broadcasting-review/get?id=${id}` })
  },

  // 新增私播复盘
  createPrivateBroadcastingReview: async (data: ErpPrivateBroadcastingReviewSaveReqVO) => {
    return await request.post({ url: `/erp/private-broadcasting-review/create`, data })
  },

  // 修改私播复盘
  updatePrivateBroadcastingReview: async (data: ErpPrivateBroadcastingReviewSaveReqVO) => {
    return await request.put({ url: `/erp/private-broadcasting-review/update`, data })
  },

  // 删除私播复盘
  deletePrivateBroadcastingReview: async (ids: number[]) => {
    return await request.delete({ url: `/erp/private-broadcasting-review/delete`, params: { ids: ids.join(',') } })
  },

  // 根据ID列表获取私播复盘列表
  getPrivateBroadcastingReviewListByIds: async (ids: number[]) => {
    return await request.get({ url: `/erp/private-broadcasting-review/list-by-ids`, params: { ids } })
  },

  // 导出私播复盘
  exportPrivateBroadcastingReview: async (params: ErpPrivateBroadcastingReviewPageReqVO) => {
    return await request.download({ url: `/erp/private-broadcasting-review/export-excel`, params })
  },

  // 下载私播复盘导入模版
  importPrivateBroadcastingReviewTemplate: async () => {
    return await request.download({ url: `/erp/private-broadcasting-review/get-import-template` })
  },

  // 导入私播复盘
  importPrivateBroadcastingReview: async (params: any) => {
    return await request.upload({ url: `/erp/private-broadcasting-review/import`, ...params })
  }
}