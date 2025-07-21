import request from '@/config/axios'

export interface ErpSampleSummaryRespVO {
  statusCount: Record<string, number>
  customerStats: CustomerSampleStat[]
  totalCount: number
  customerOptions: CustomerOption[]
  total: number
  pageNo: number
  pageSize: number
}

export interface CustomerSampleStat {
  customerName: string
  statusCount: Record<string, number>
  totalCount: number
}

export interface CustomerOption {
  customerName: string
  sampleCount: number
}

// 查询样品统计
export const getSampleSummary = (params: { 
  beginDate: string; 
  endDate: string; 
  customerName?: string;
  pageNo?: number;
  pageSize?: number;
}) => {
  console.log('调用样品统计API，参数：', params)
  return request.get<ErpSampleSummaryRespVO>({ url: '/erp/sample-statistics/sample-summary', params })
} 