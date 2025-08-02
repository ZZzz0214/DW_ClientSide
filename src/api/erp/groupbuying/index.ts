import request from '@/config/axios'

// ERP 团购货盘 VO
export interface GroupBuyingVO {
  id?: number // 团购货盘编号
  no?: string // 编号
  productImage?: string | string[] // 产品图片（多张，逗号分隔或数组）
  brandName?: string // 品牌名称
  productName?: string // 产品名称
  productSpec?: string // 产品规格
  productSku?: string // 产品SKU
  marketPrice?: number // 市场价格
  shelfLife?: Date // 保质日期
  productStock?: number // 产品库存
  remark?: string // 备注信息
  status?: number // 货盘状态
  corePrice?: number // 核心价格
  distributionPrice?: number // 分发价格
  supplyGroupPrice?: number // 供团价格
  sellingCommission?: number // 帮卖佣金
  groupPrice?: number // 开团价格
  channelProfit?: number // 渠道毛利
  groupMechanism?: string // 开团机制
  expressFee?: number // 快递费用
  tmallJd?: string // 天猫京东
  publicData?: string // 公域数据
  privateData?: string // 私域数据
  brandEndorsement?: string // 品牌背书
  competitiveAnalysis?: string // 竞品分析
  expressCompany?: string // 快递公司
  shippingTime?: string // 发货时效
  shippingArea?: string // 发货地区
  createTime?: Date // 创建时间
}

// ERP 团购货盘保存 Request VO
export interface GroupBuyingSaveReqVO {
  id?: number // 团购货盘编号
  no: string // 编号
  productImage?: string | string[] // 产品图片（多张，逗号分隔或数组）
  brandName?: string // 品牌名称
  productName: string // 产品名称
  productSpec?: string // 产品规格
  productSku?: string // 产品SKU
  marketPrice?: number // 市场价格
  shelfLife?: Date // 保质日期
  productStock?: number // 产品库存
  remark?: string // 备注信息
  status?: number // 货盘状态
  corePrice?: number // 核心价格
  distributionPrice?: number // 分发价格
  supplyGroupPrice?: number // 供团价格
  sellingCommission?: number // 帮卖佣金
  groupPrice?: number // 开团价格
  channelProfit?: number // 渠道毛利
  groupMechanism?: string // 开团机制
  expressFee?: number // 快递费用
  tmallJd?: string // 天猫京东
  publicData?: string // 公域数据
  privateData?: string // 私域数据
  brandEndorsement?: string // 品牌背书
  competitiveAnalysis?: string // 竞品分析
  expressCompany?: string // 快递公司
  shippingTime?: string // 发货时效
  shippingArea?: string // 发货地区
}

// ERP 团购货盘分页 Request VO
export interface GroupBuyingPageReqVO {
  no?: string // 编号
  productName?: string // 产品名称
  brandName?: string // 品牌名称
  createTime?: Date[] // 创建时间
}

// ERP 团购货盘 API
export const GroupBuyingApi = {
  // 查询团购货盘分页
  getGroupBuyingPage: async (params: GroupBuyingPageReqVO) => {
    return await request.get({ url: `/erp/group-buying/page`, params })
  },

  // 查询团购货盘详情
  getGroupBuying: async (id: number) => {
    return await request.get({ url: `/erp/group-buying/get?id=` + id })
  },

  // 新增团购货盘
  createGroupBuying: async (data: GroupBuyingSaveReqVO) => {
    return await request.post({ url: `/erp/group-buying/create`, data })
  },

  // 修改团购货盘
  updateGroupBuying: async (data: GroupBuyingSaveReqVO) => {
    return await request.put({ url: `/erp/group-buying/update`, data })
  },

  // 删除团购货盘
  deleteGroupBuying: async (ids: number[]) => {
    return await request.delete({ url: `/erp/group-buying/delete`, params: { ids: ids.join(',') } })
  },

  // 根据ID列表获取团购货盘列表
  getGroupBuyingListByIds: async (ids: number[]) => {
    return await request.get({ url: `/erp/group-buying/list-by-ids`, params: { ids } })
  },

  // 导出团购货盘 Excel
  exportGroupBuying: async (params: GroupBuyingPageReqVO) => {
    return await request.download({ url: `/erp/group-buying/export-excel`, params })
  },

  // 下载团购货盘导入模板
  importGroupBuyingTemplate: async () => {
    return await request.download({ url: `/erp/group-buying/get-import-template` })
  },

  // 批量下载团购货盘图片
  downloadImages: async (ids: number[]) => {
    return await request.download({ 
      url: `/erp/group-buying/download-images`, 
      params: { ids: ids.join(',') } 
    })
  },

  // 按查询条件下载团购货盘图片
  downloadImagesByQuery: async (params: GroupBuyingPageReqVO) => {
    return await request.download({ 
      url: `/erp/group-buying/download-images-by-query`, 
      params
    })
  }
}