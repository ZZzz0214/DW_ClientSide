import request from '@/config/axios'

// ERP 直播复盘 VO
export interface LiveBroadcastingReviewVO {
  id?: number // 直播复盘编号
  no?: string // 编号
  liveBroadcastingId?: number // 直播货盘表ID
  remark?: string // 备注信息
  customerId?: number // 客户ID
  livePlatform?: string // 直播平台
  liveCommission?: number // 直播佣金
  publicCommission?: number // 公开佣金
  rebateCommission?: number // 返点佣金
  sampleSendDate?: Date // 寄样日期
  liveStartDate?: Date // 开播日期
  liveSales?: number // 开播销量
  repeatLiveDate?: Date // 复播日期
  repeatLiveSales?: number // 复播销量
  createTime?: Date // 创建时间
}

// ERP 直播复盘保存 Request VO
export interface LiveBroadcastingReviewSaveReqVO {
  id?: number // 直播复盘ID
  no: string // 编号
  liveBroadcastingId: number // 直播货盘表ID
  remark?: string // 备注信息
  customerId?: number // 客户ID
  livePlatform?: string // 直播平台
  liveCommission?: number // 直播佣金
  publicCommission?: number // 公开佣金
  rebateCommission?: number // 返点佣金
  sampleSendDate?: Date // 寄样日期
  liveStartDate?: Date // 开播日期
  liveSales?: number // 开播销量
  repeatLiveDate?: Date // 复播日期
  repeatLiveSales?: number // 复播销量
}

// ERP 直播复盘分页 Request VO
export interface LiveBroadcastingReviewPageReqVO {
  no?: string // 编号
  liveBroadcastingId?: number // 直播货盘表ID
  customerId?: number // 客户ID
  livePlatform?: string // 直播平台
  createTime?: Date[] // 创建时间
}

// ERP 直播复盘 API
export const LiveBroadcastingReviewApi = {
  // 查询直播复盘分页
  getLiveBroadcastingReviewPage: async (params: LiveBroadcastingReviewPageReqVO) => {
    return await request.get({ url: `/erp/live-broadcasting-review/page`, params })
  },

  // 查询直播复盘详情
  getLiveBroadcastingReview: async (id: number) => {
    return await request.get({ url: `/erp/live-broadcasting-review/get?id=` + id })
  },

  // 新增直播复盘
  createLiveBroadcastingReview: async (data: LiveBroadcastingReviewSaveReqVO) => {
    return await request.post({ url: `/erp/live-broadcasting-review/create`, data })
  },

  // 修改直播复盘
  updateLiveBroadcastingReview: async (data: LiveBroadcastingReviewSaveReqVO) => {
    return await request.put({ url: `/erp/live-broadcasting-review/update`, data })
  },

  // 删除直播复盘
  deleteLiveBroadcastingReview: async (ids: number[]) => {
    return await request.delete({ url: `/erp/live-broadcasting-review/delete`, params: { ids: ids.join(',') } })
  },

  // 根据ID列表获取直播复盘列表
  getLiveBroadcastingReviewListByIds: async (ids: number[]) => {
    return await request.get({ url: `/erp/live-broadcasting-review/list-by-ids`, params: { ids } })
  },

  // 导出直播复盘 Excel
  exportLiveBroadcastingReview: async (params: LiveBroadcastingReviewPageReqVO) => {
    return await request.download({ url: `/erp/live-broadcasting-review/export-excel`, params })
  }
}