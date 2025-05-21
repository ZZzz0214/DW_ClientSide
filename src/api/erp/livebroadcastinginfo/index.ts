import request from '@/config/axios'

// ERP 直播信息 VO
export interface LiveBroadcastingInfoVO {
  id?: number // 直播信息编号
  no?: string // 编号
  customerId?: number // 客户ID
  customerPosition?: string // 客户职位
  customerWechat?: string // 客户微信
  platformName?: string // 平台名称
  customerAttribute?: string // 客户属性
  customerCity?: string // 客户城市
  customerDistrict?: string // 客户区县
  userPortrait?: string // 用户画像
  recruitmentCategory?: string // 招商类目
  selectionCriteria?: string // 选品标准
  remark?: string // 备注信息
  createTime?: Date // 创建时间
}

// ERP 直播信息保存 Request VO
export interface LiveBroadcastingInfoSaveReqVO {
  id?: number // 直播信息ID
  no: string // 编号
  customerId: number // 客户ID
  customerPosition?: string // 客户职位
  customerWechat?: string // 客户微信
  platformName?: string // 平台名称
  customerAttribute?: string // 客户属性
  customerCity?: string // 客户城市
  customerDistrict?: string // 客户区县
  userPortrait?: string // 用户画像
  recruitmentCategory?: string // 招商类目
  selectionCriteria?: string // 选品标准
  remark?: string // 备注信息
}

// ERP 直播信息分页 Request VO
export interface LiveBroadcastingInfoPageReqVO {
  no?: string // 编号
  customerId?: number // 客户ID
  platformName?: string // 平台名称
  createTime?: Date[] // 创建时间
}

// ERP 直播信息 API
export const LiveBroadcastingInfoApi = {
  // 查询直播信息分页
  getLiveBroadcastingInfoPage: async (params: LiveBroadcastingInfoPageReqVO) => {
    return await request.get({ url: `/erp/live-broadcasting-info/page`, params })
  },

  // 查询直播信息详情
  getLiveBroadcastingInfo: async (id: number) => {
    return await request.get({ url: `/erp/live-broadcasting-info/get?id=` + id })
  },

  // 新增直播信息
  createLiveBroadcastingInfo: async (data: LiveBroadcastingInfoSaveReqVO) => {
    return await request.post({ url: `/erp/live-broadcasting-info/create`, data })
  },

  // 修改直播信息
  updateLiveBroadcastingInfo: async (data: LiveBroadcastingInfoSaveReqVO) => {
    return await request.put({ url: `/erp/live-broadcasting-info/update`, data })
  },

  // 删除直播信息
  deleteLiveBroadcastingInfo: async (ids: number[]) => {
    return await request.delete({ url: `/erp/live-broadcasting-info/delete`, params: { ids: ids.join(',') } })
  },

  // 根据ID列表获取直播信息列表
  getLiveBroadcastingInfoListByIds: async (ids: number[]) => {
    return await request.get({ url: `/erp/live-broadcasting-info/list-by-ids`, params: { ids } })
  },

  // 导出直播信息 Excel
  exportLiveBroadcastingInfo: async (params: LiveBroadcastingInfoPageReqVO) => {
    return await request.download({ url: `/erp/live-broadcasting-info/export-excel`, params })
  }
}