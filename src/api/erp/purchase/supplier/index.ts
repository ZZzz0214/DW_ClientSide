import request from '@/config/axios'

// ERP 供应商 VO
export interface SupplierVO {
  id: number // 供应商编号
  no: string // 供应商编号
  name: string // 供应商名称
  receiverName: string // 收件姓名
  telephone: string // 联系电话
  address: string // 详细地址
  wechatAccount: string // 微信账号
  alipayAccount: string // 支付宝号
  bankAccount: string // 银行账号
  remark: string // 备注信息
}

// ERP 供应商 API
export const SupplierApi = {
  // 查询供应商分页
  getSupplierPage: async (params: any) => {
    return await request.get({ url: `/erp/supplier/page`, params })
  },

  // 获得供应商精简列表
  getSupplierSimpleList: async () => {
    return await request.get({ url: `/erp/supplier/simple-list` })
  },

  // 查询供应商详情
  getSupplier: async (id: number) => {
    return await request.get({ url: `/erp/supplier/get?id=` + id })
  },

  // 新增供应商
  createSupplier: async (data: SupplierVO) => {
    return await request.post({ url: `/erp/supplier/create`, data })
  },

  // 修改供应商
  updateSupplier: async (data: SupplierVO) => {
    return await request.put({ url: `/erp/supplier/update`, data })
  },

  // 删除供应商
  deleteSupplier: async (id: number) => {
    return await request.delete({ url: `/erp/supplier/delete?id=` + id })
  },

  // 导出供应商 Excel
  exportSupplier: async (params) => {
    return await request.download({ url: `/erp/supplier/export-excel`, params })
  },

  // 搜索供应商人员
  searchSupplier: async (params: any) => {
    return await request.get({ url: `/erp/supplier/search`, params });
  },

  // 获取导入模板
  importSupplierTemplate: async () => {
    return await request.download({ url: `/erp/supplier/get-import-template` })
  },

  // 导入供应商
  importSupplier: async (data: FormData) => {
    return await request.upload({ url: `/erp/supplier/import`, data })
  }
}
