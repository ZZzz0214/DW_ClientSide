import request from '@/config/axios'

// ERP 团购信息 VO
export interface GroupBuyingInfoVO {
  id?: number // 团购信息编号
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

// ERP 团购信息保存 Request VO
export interface GroupBuyingInfoSaveReqVO {
  id?: number // 团购信息ID
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

// ERP 团购信息分页 Request VO
export interface GroupBuyingInfoPageReqVO {
  no?: string // 编号
  customerName?: string // 客户姓名
  platformName?: string // 平台名称
  customerCity?: string // 客户城市
  createTime?: Date[] // 创建时间
}

// ERP 团购信息 API
export const GroupBuyingInfoApi = {
  // 查询团购信息分页
  getGroupBuyingInfoPage: async (params: GroupBuyingInfoPageReqVO) => {
    return await request.get({ url: `/erp/group-buying-info/page`, params })
  },

  // 查询团购信息详情
  getGroupBuyingInfo: async (id: number) => {
    return await request.get({ url: `/erp/group-buying-info/get?id=` + id })
  },

  // 新增团购信息
  createGroupBuyingInfo: async (data: GroupBuyingInfoSaveReqVO) => {
    return await request.post({ url: `/erp/group-buying-info/create`, data })
  },

  // 修改团购信息
  updateGroupBuyingInfo: async (data: GroupBuyingInfoSaveReqVO) => {
    return await request.put({ url: `/erp/group-buying-info/update`, data })
  },

  // 删除团购信息
  deleteGroupBuyingInfo: async (ids: number[]) => {
    return await request.delete({ url: `/erp/group-buying-info/delete`, params: { ids: ids.join(',') } })
  },

  // 根据ID列表获取团购信息列表
  getGroupBuyingInfoListByIds: async (ids: number[]) => {
    return await request.get({ url: `/erp/group-buying-info/list-by-ids`, params: { ids } })
  },

  // 导出团购信息 Excel
  exportGroupBuyingInfo: async (params: GroupBuyingInfoPageReqVO) => {
    return await request.download({ url: `/erp/group-buying-info/export-excel`, params })
  }
}