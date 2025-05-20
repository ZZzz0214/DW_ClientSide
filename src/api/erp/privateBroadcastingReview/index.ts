import request from '@/config/axios'

// ERP 私播复盘 Response VO
export interface ErpPrivateBroadcastingReviewRespVO {
  id?: number // 私播复盘编号
  no?: string // 编号
  privateBroadcastingId?: number // 私播货盘表ID
  customerId?: number // 客户ID
  productNakedPrice?: number // 产品裸价
  expressFee?: number // 快递费用
  dropshipPrice?: number // 代发价格
  sampleSendDate?: string // 寄样日期
  groupStartDate?: string // 开团日期
  groupSales?: number // 开团销量
  repeatGroupDate?: string // 复团日期
  repeatGroupSales?: number // 复团销量
  remark?: string // 备注信息
  createTime?: Date // 创建时间
}

// ERP 私播复盘保存 Request VO
export interface ErpPrivateBroadcastingReviewSaveReqVO {
  id?: number // 私播复盘编号
  no: string // 编号
  privateBroadcastingId: number // 私播货盘表ID
  customerId?: number // 客户ID
  productNakedPrice?: number // 产品裸价
  expressFee?: number // 快递费用
  dropshipPrice?: number // 代发价格
  sampleSendDate?: string // 寄样日期
  groupStartDate?: string // 开团日期
  groupSales?: number // 开团销量
  repeatGroupDate?: string // 复团日期
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
  }
}