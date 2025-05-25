import request from '@/config/axios'

// ERP 代发辅助 VO
export interface DropshipAssistVO {
  id?: number // 代发辅助表编号
  no?: string // 编号
  originalProduct?: string // 原表商品
  originalSpec?: string // 原表规格
  originalQuantity?: number // 原表数量
  comboProductId?: string // 组品编号
  shippingCode?: string // 发货编码
  productName?: string // 产品名称
  productShortName?: string // 产品简称
  productSpec?: string // 产品规格
  productQuantity?: number // 产品数量
  createTime?: Date // 创建时间
}

// ERP 代发辅助保存 Request VO
export interface DropshipAssistSaveReqVO {
  id?: number // 代发辅助表编号
  no: string // 编号
  originalProduct?: string // 原表商品
  originalSpec?: string // 原表规格
  originalQuantity?: number // 原表数量
  comboProductId?: string // 组品编号
  productSpec?: string // 产品规格
  productQuantity?: number // 产品数量
}

// ERP 代发辅助分页 Request VO
export interface DropshipAssistPageReqVO {
  no?: string // 编号
  originalProduct?: string // 原表商品
  comboProductId?: string // 组品编号
  createTime?: Date[] // 创建时间
}

// ERP 代发辅助 API
export const DropshipAssistApi = {
  // 查询代发辅助分页
  getDropshipAssistPage: async (params: DropshipAssistPageReqVO) => {
    return await request.get({ url: `/erp/dropship-assist/page`, params })
  },

  // 查询代发辅助详情
  getDropshipAssist: async (id: number) => {
    return await request.get({ url: `/erp/dropship-assist/get?id=` + id })
  },

  // 新增代发辅助
  createDropshipAssist: async (data: DropshipAssistSaveReqVO) => {
    return await request.post({ url: `/erp/dropship-assist/create`, data })
  },

  // 修改代发辅助
  updateDropshipAssist: async (data: DropshipAssistSaveReqVO) => {
    return await request.put({ url: `/erp/dropship-assist/update`, data })
  },

  // 删除代发辅助
  deleteDropshipAssist: async (ids: number[]) => {
    return await request.delete({ url: `/erp/dropship-assist/delete`, params: { ids: ids.join(',') } })
  },

  // 根据ID列表获取代发辅助列表
  getDropshipAssistListByIds: async (ids: number[]) => {
    return await request.get({ url: `/erp/dropship-assist/list-by-ids`, params: { ids } })
  },

  // 导出代发辅助 Excel
  exportDropshipAssist: async (params: DropshipAssistPageReqVO) => {
    return await request.download({ url: `/erp/dropship-assist/export-excel`, params })
  }
}