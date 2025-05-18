import request from '@/config/axios'

// ERP 样品 VO
export interface SampleVO {
  id?: number // 样品编号
  no?: string // 编号
  logisticsCompany?: string // 物流公司
  logisticsNo?: string // 物流单号
  receiverName?: string // 收件姓名
  contactPhone?: string // 联系电话
  address?: string // 详细地址
  comboProductId?: string // 组品编号
  shippingCode?: string // 发货编码
  comboProductName?: string // 组合产品名称
  productSpec?: string // 产品规格
  productQuantity?: number // 产品数量
  customerName?: string // 客户名称
  sampleStatus?: number // 样品状态
  reference?: string // 参考
  remark?: string // 备注信息
  createTime?: Date // 创建时间
}

// ERP 样品保存 Request VO
export interface SampleSaveReqVO {
  id?: number // 样品编号
  no: string // 编号
  logisticsCompany: string // 物流公司
  logisticsNo: string // 物流单号
  receiverName: string // 收件姓名
  contactPhone: string // 联系电话
  address: string // 详细地址
  comboProductId: string // 组品编号
  productSpec: string // 产品规格
  productQuantity: number // 产品数量
  customerName: string // 客户名称
  sampleStatus: number // 样品状态
  reference?: string // 参考
  remark?: string // 备注信息
}

// ERP 样品分页 Request VO
export interface SamplePageReqVO {
  no?: string // 编号
  customerName?: string // 客户名称
  sampleStatus?: number // 样品状态
  createTime?: Date[] // 创建时间
}

// ERP 样品 API
export const SampleApi = {
  // 查询样品分页
  getSamplePage: async (params: SamplePageReqVO) => {
    return await request.get({ url: `/erp/sample/page`, params })
  },

  // 查询样品详情
  getSample: async (id: number) => {
    return await request.get({ url: `/erp/sample/get?id=` + id })
  },

  // 新增样品
  createSample: async (data: SampleSaveReqVO) => {
    return await request.post({ url: `/erp/sample/create`, data })
  },

  // 修改样品
  updateSample: async (data: SampleSaveReqVO) => {
    return await request.put({ url: `/erp/sample/update`, data })
  },

  // 删除样品
  deleteSample: async (ids: number[]) => {
    return await request.delete({ url: `/erp/sample/delete`, params: { ids: ids.join(',') } })
  },

  // 根据ID列表获取样品列表
  getSampleListByIds: async (ids: number[]) => {
    return await request.get({ url: `/erp/sample/list-by-ids`, params: { ids } })
  },

  // 导出样品 Excel
  exportSample: async (params: SamplePageReqVO) => {
    return await request.download({ url: `/erp/sample/export-excel`, params })
  }
}