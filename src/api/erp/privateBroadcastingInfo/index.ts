import request from '@/config/axios'

// ERP 私播信息 Response VO
export interface ErpPrivateBroadcastingInfoRespVO {
  id?: number // 私播信息编号
  no?: string // 编号
  customerName?: string // 客户姓名
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

// ERP 私播信息保存 Request VO
export interface ErpPrivateBroadcastingInfoSaveReqVO {
  id?: number // 私播信息编号
  no: string // 编号
  customerName?: string // 客户姓名
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

// ERP 私播信息分页 Request VO
export interface ErpPrivateBroadcastingInfoPageReqVO {
  no?: string // 编号
  createTime?: Date[] // 创建时间范围
}

// ERP 私播信息 API
export const ErpPrivateBroadcastingInfoApi = {
  // 查询私播信息分页
  getPrivateBroadcastingInfoPage: async (params: ErpPrivateBroadcastingInfoPageReqVO) => {
    return await request.get({ url: `/erp/private-broadcasting-info/page`, params })
  },

  // 查询私播信息详情
  getPrivateBroadcastingInfo: async (id: number) => {
    return await request.get({ url: `/erp/private-broadcasting-info/get?id=${id}` })
  },

  // 新增私播信息
  createPrivateBroadcastingInfo: async (data: ErpPrivateBroadcastingInfoSaveReqVO) => {
    return await request.post({ url: `/erp/private-broadcasting-info/create`, data })
  },

  // 修改私播信息
  updatePrivateBroadcastingInfo: async (data: ErpPrivateBroadcastingInfoSaveReqVO) => {
    return await request.put({ url: `/erp/private-broadcasting-info/update`, data })
  },

  // 删除私播信息
  deletePrivateBroadcastingInfo: async (ids: number[]) => {
    return await request.delete({ url: `/erp/private-broadcasting-info/delete`, params: { ids: ids.join(',') } })
  },

  // 根据ID列表获取私播信息列表
  getPrivateBroadcastingInfoListByIds: async (ids: number[]) => {
    return await request.get({ url: `/erp/private-broadcasting-info/list-by-ids`, params: { ids } })
  }
}