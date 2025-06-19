import request from '@/config/axios'

// ERP 财务记录 VO
export interface ErpFinanceVO {
  id?: number
  no?: string
  carouselImages?: string
  billName?: string
  amount?: number
  incomeExpense?: number
  category?: string
  account?: string
  status?: number
  remark?: string
  orderDate?: string
  auditStatus?: number
  auditor?: string
  auditTime?: Date
  auditRemark?: string
  creator?: string
  createTime?: Date
  updateTime?: Date
}

// ERP 财务记录分页 Request VO
export interface ErpFinancePageReqVO {
  pageNo?: number
  pageSize?: number
  no?: string
  billName?: string
  incomeExpense?: number
  category?: string
  account?: string
  status?: number
  auditStatus?: number
  creator?: string
  auditor?: string
  orderDate?: string[]
  createTime?: string[]
  auditTime?: string[]
}

// ERP 财务金额 VO
export interface ErpFinanceAmountVO {
  id?: number
  no?: string
  carouselImages?: string
  channelType?: string // 充值渠道（微信、支付宝、银行卡）
  amount?: number // 充值金额
  operationType?: number // 操作类型（1：充值，2：消费）
  beforeBalance?: number // 操作前余额
  afterBalance?: number // 操作后余额
  orderDate?: string // 订单日期
  remark?: string
  auditStatus?: number
  auditor?: string
  auditTime?: Date
  auditRemark?: string
  creator?: string
  createTime?: Date
  updateTime?: Date
  // 兼容字段（已废弃）
  wechatRecharge?: number
  alipayRecharge?: number
  bankCardRecharge?: number
  wechatBalance?: number
  alipayBalance?: number
  bankCardBalance?: number
}

// 余额汇总 VO
export interface ErpBalanceSummaryVO {
  wechatBalance?: number
  alipayBalance?: number
  bankCardBalance?: number
  wechatRecharge?: number
  alipayRecharge?: number
  bankCardRecharge?: number
}

// ERP 财务金额分页 Request VO
export interface ErpFinanceAmountPageReqVO {
  pageNo?: number
  pageSize?: number
  no?: string
  channelType?: string
  operationType?: number
  wechatRecharge?: number
  alipayRecharge?: number
  bankCardRecharge?: number
  wechatBalance?: number
  alipayBalance?: number
  bankCardBalance?: number
  orderDate?: string[]
  auditStatus?: number
  creator?: string
  auditor?: string
  createTime?: string[]
  auditTime?: string[]
}

// ========== 财务记录 API ==========

// 查询财务记录分页
export const getFinancePage = async (params: ErpFinancePageReqVO) => {
  return await request.get({ url: `/erp/finance/page`, params })
}

// 查询财务记录详情
export const getFinance = async (id: number) => {
  return await request.get({ url: `/erp/finance/get?id=` + id })
}

// 新增财务记录
export const createFinance = async (data: ErpFinanceVO) => {
  return await request.post({ url: `/erp/finance/create`, data })
}

// 修改财务记录
export const updateFinance = async (data: ErpFinanceVO) => {
  return await request.put({ url: `/erp/finance/update`, data })
}

// 删除财务记录
export const deleteFinance = async (ids: number[]) => {
  return await request.delete({ url: `/erp/finance/delete`, params: { ids: ids.join(',') } })
}

// 导出财务记录 Excel
export const exportFinanceExcel = async (params: ErpFinancePageReqVO) => {
  return await request.download({ url: `/erp/finance/export-excel`, params })
}

// 获取财务记录导入模板
export const importFinanceTemplate = async () => {
  return await request.download({ url: `/erp/finance/get-import-template` })
}

// 导入财务记录
export const importFinanceList = async (data: any[], updateSupport: boolean) => {
  const formData = new FormData()
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  formData.append('file', blob, 'finance.json')
  formData.append('updateSupport', updateSupport.toString())
  return await request.post({ 
    url: `/erp/finance/import`, 
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// ========== 财务金额 API ==========

// 查询财务金额分页
export const getFinanceAmountPage = async (params: ErpFinanceAmountPageReqVO) => {
  return await request.get({ url: `/erp/finance-amount/page`, params })
}

// 查询财务金额详情
export const getFinanceAmount = async (id: number) => {
  return await request.get({ url: `/erp/finance-amount/get?id=` + id })
}

// 新增财务金额
export const createFinanceAmount = async (data: ErpFinanceAmountVO) => {
  return await request.post({ url: `/erp/finance-amount/create`, data })
}

// 修改财务金额
export const updateFinanceAmount = async (data: ErpFinanceAmountVO) => {
  return await request.put({ url: `/erp/finance-amount/update`, data })
}

// 删除财务金额
export const deleteFinanceAmount = async (ids: number[]) => {
  return await request.delete({ url: `/erp/finance-amount/delete`, params: { ids: ids.join(',') } })
}

// 导出财务金额 Excel
export const exportFinanceAmountExcel = async (params: ErpFinanceAmountPageReqVO) => {
  return await request.download({ url: `/erp/finance-amount/export-excel`, params })
}

// 获取财务金额导入模板
export const importFinanceAmountTemplate = async () => {
  return await request.download({ url: `/erp/finance-amount/get-import-template` })
}

// 导入财务金额
export const importFinanceAmountList = async (data: any[], updateSupport: boolean) => {
  const formData = new FormData()
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  formData.append('file', blob, 'financeAmount.json')
  formData.append('updateSupport', updateSupport.toString())
  return await request.post({ 
    url: `/erp/finance-amount/import`, 
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 获取用户余额汇总
export const getUserBalanceSummary = async (): Promise<ErpBalanceSummaryVO> => {
  return await request.get({ url: `/erp/finance-amount/balance-summary` })
}

// 获取指定渠道的余额
export const getChannelBalance = async (channelType: string) => {
  return await request.get({ url: `/erp/finance-amount/channel-balance`, params: { channelType } })
}

// 充值操作
export const recharge = async (channelType: string, amount: number) => {
  return await request.post({ 
    url: `/erp/finance-amount/recharge`, 
    params: { channelType, amount }
  })
}

// 充值操作（带图片和备注）
export const rechargeWithImages = async (channelType: string, amount: number, carouselImages?: string, remark?: string, orderDate?: string) => {
  return await request.post({ 
    url: `/erp/finance-amount/recharge-with-images`, 
    data: { channelType, amount, carouselImages, remark, orderDate }
  })
}

// 初始化用户财务金额记录
export const initUserFinanceAmount = async () => {
  return await request.post({ url: `/erp/finance-amount/init` })
}

// ========== 审核相关 API ==========

// 审核财务记录
export const auditFinance = async (ids: number[], auditStatus: number, auditRemark?: string) => {
  return await request.post({ 
    url: `/erp/finance/audit`, 
    data: { ids, auditStatus, auditRemark }
  })
}

// 反审核财务记录
export const unauditFinance = async (ids: number[]) => {
  return await request.post({ 
    url: `/erp/finance/unaudit`, 
    params: { ids: ids.join(',') }
  })
}

// 审核财务金额记录
export const auditFinanceAmount = async (ids: number[], auditStatus: number, auditRemark?: string) => {
  return await request.post({ 
    url: `/erp/finance-amount/audit`, 
    data: { ids, auditStatus, auditRemark }
  })
}

// 反审核财务金额记录
export const unauditFinanceAmount = async (ids: number[]) => {
  return await request.post({ 
    url: `/erp/finance-amount/unaudit`, 
    params: { ids: ids.join(',') }
  })
} 