import request from '@/config/axios'

export interface ErpFinanceSummaryRespVO {
  unauditedCount: number | string
  auditedCount: number | string
  unauditedExpense: number | string
  unauditedIncome: number | string
  auditedExpense: number | string
  auditedIncome: number | string
  totalExpense: number | string
  totalIncome: number | string
}

export interface ErpFinanceAmountSummaryRespVO {
  unauditedCount: number | string
  auditedCount: number | string
  wechatCount: number | string
  alipayCount: number | string
  bankCardCount: number | string
  wechatTotal: number | string
  alipayTotal: number | string
  bankCardTotal: number | string
  totalAmount: number | string
}

// 查询财务表统计
export const getFinanceSummary = (params: { beginDate: string; endDate: string }) => {
  console.log('调用财务表统计API，参数：', params)
  return request.get<ErpFinanceSummaryRespVO>({ url: '/erp/finance-statistics/finance-summary', params })
}

// 查询财务金额表统计
export const getFinanceAmountSummary = (params: { beginDate: string; endDate: string }) => {
  console.log('调用财务金额表统计API，参数：', params)
  return request.get<ErpFinanceAmountSummaryRespVO>({ url: '/erp/finance-statistics/finance-amount-summary', params })
} 