import request from '@/config/axios'

// ERP 客户 VO
export interface CustomerVO {
  id: number // 客户编号
  no: string // 客户业务编号
  name: string // 客户名称
  receiverName: string // 收件姓名
  telephone: string // 联系电话
  address: string // 详细地址
  wechatAccount: string // 微信账号
  alipayAccount: string // 支付宝号
  bankAccount: string // 银行账号
  remark: string // 备注信息
  creator: string // 创建人员
  createTime: Date // 创建时间
}

// ERP 客户 API
export const CustomerApi = {
  // 查询客户分页
  getCustomerPage: async (params: any) => {
    return await request.get({ url: `/erp/customer/page`, params })
  },

  // 查询客户详情
  getCustomer: async (id: number) => {
    return await request.get({ url: `/erp/customer/get?id=` + id })
  },

  // 新增客户
  createCustomer: async (data: CustomerVO) => {
    return await request.post({ url: `/erp/customer/create`, data })
  },

  // 修改客户
  updateCustomer: async (data: CustomerVO) => {
    return await request.put({ url: `/erp/customer/update`, data })
  },

  // 删除客户
  deleteCustomer: async (id: number) => {
    return await request.delete({ url: `/erp/customer/delete?id=` + id })
  },

  // 导出客户 Excel
  exportCustomer: async (params) => {
    return await request.download({ url: `/erp/customer/export-excel`, params })
  },

  // 获取导入模板
  importCustomerTemplate: async () => {
    return await request.download({ url: `/erp/customer/get-import-template` })
  },

  // 导入客户
  importCustomer: async (data: FormData) => {
    return await request.upload({ url: `/erp/customer/import`, data })
  },

  // 搜索结果
  searchCustomer: async (params: any) => {
    return await request.get({ url: `/erp/customer/search`, params });
  },

  // 分页搜索结果
  searchCustomerPage: async (params: any) => {
    return await request.get({ url: `/erp/customer/search-page`, params });
  }
}
