import request from '@/config/axios'

// ERP 团购复盘 VO
export interface GroupBuyingReviewVO {
  id?: number // 团购复盘编号
  no?: string // 编号
  remark?: string // 备注信息
  customerId?: number // 客户编号
  customerName?: string // 客户名称（用于显示）
  groupBuyingId?: number // 团购货盘表ID
  groupBuyingNo?: string // 货盘编号（用于显示）
  // 团购货盘相关字段
  brandName?: string // 品牌名称
  productName?: string // 产品名称
  productSpec?: string // 产品规格
  productSku?: string // 产品SKU
  groupMechanism?: string // 开团机制
  expressFee?: number // 快递费用
  supplyGroupPrice?: number // 供团价格
  groupPrice?: number // 开团价格
  status?: number // 货盘状态
  sampleSendDate?: Date // 寄样日期
  groupStartDate?: Date // 开团日期
  groupSales?: number // 开团销量
  repeatGroupDate?: Date // 复团日期
  reviewStatus?: string // 复盘状态
  createTime?: Date // 创建时间
}

// ERP 团购复盘保存 Request VO
export interface GroupBuyingReviewSaveReqVO {
  id?: number // 团购复盘ID
  no: string // 编号
  remark?: string // 备注信息
  customerId: number // 客户编号
  groupBuyingId: number // 团购货盘表ID
  supplyGroupPrice?: number // 供团价格
  groupPrice?: number // 开团价格
  status?: number // 货盘状态
  sampleSendDate?: Date // 寄样日期
  groupStartDate?: Date // 开团日期
  groupSales?: number // 开团销量
  repeatGroupDate?: Date // 复团日期
  reviewStatus?: string // 复盘状态
}

// ERP 团购复盘分页 Request VO
export interface GroupBuyingReviewPageReqVO {
  no?: string // 编号
  groupBuyingNo?: string // 团购货盘编号
  brandName?: string // 品牌名称
  productName?: string // 产品名称
  productSpec?: string // 产品规格
  productSku?: string // 产品SKU
  customerName?: string // 客户名称
  supplyGroupPrice?: string // 供团价格
  expressFee?: string // 快递费用
  groupPrice?: string // 开团价格
  sampleSendDate?: Date[] // 寄样日期
  groupStartDate?: Date[] // 开团日期
  status?: string // 货盘状态
  reviewStatus?: string // 复盘状态
  creator?: string // 创建人员
  customerId?: number // 客户编号
  groupBuyingId?: number // 团购货盘表ID
  createTime?: Date[] // 创建时间
}

// ERP 团购复盘 API
export const GroupBuyingReviewApi = {
  // 查询团购复盘分页
  getGroupBuyingReviewPage: async (params: GroupBuyingReviewPageReqVO) => {
    return await request.get({ url: `/erp/group-buying-review/page`, params })
  },

  // 查询团购复盘详情
  getGroupBuyingReview: async (id: number) => {
    return await request.get({ url: `/erp/group-buying-review/get?id=` + id })
  },

  // 新增团购复盘
  createGroupBuyingReview: async (data: GroupBuyingReviewSaveReqVO) => {
    return await request.post({ url: `/erp/group-buying-review/create`, data })
  },

  // 修改团购复盘
  updateGroupBuyingReview: async (data: GroupBuyingReviewSaveReqVO) => {
    return await request.put({ url: `/erp/group-buying-review/update`, data })
  },

  // 删除团购复盘
  deleteGroupBuyingReview: async (ids: number[]) => {
    // 如果是单个删除，使用 /delete 接口
    if (ids.length === 1) {
      return await request.delete({ url: `/erp/group-buying-review/delete`, params: { id: ids[0] } })
    }
    // 如果是批量删除，使用 /batch-delete 接口
    return await request.delete({ url: `/erp/group-buying-review/batch-delete`, params: { ids: ids.join(',') } })
  },

  // 根据ID列表获取团购复盘列表
  getGroupBuyingReviewListByIds: async (ids: number[]) => {
    return await request.get({ url: `/erp/group-buying-review/list-by-ids`, params: { ids } })
  },

  // 导出团购复盘 Excel
  exportGroupBuyingReview: async (params: GroupBuyingReviewPageReqVO) => {
    return await request.download({ url: `/erp/group-buying-review/export-excel`, params })
  },

  // 下载团购货盘导入模板
  importGroupBuyingReviewTemplate: async () => {
    return await request.download({ url: `/erp/group-buying-review/get-import-template` })
  }
}
