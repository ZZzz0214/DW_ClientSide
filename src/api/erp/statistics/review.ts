import request from '@/config/axios'

export interface ErpReviewStatisticsRespVO {
  groupBuyingStats: GroupBuyingReviewStat[]
  privateBroadcastingStats: PrivateBroadcastingReviewStat[]
  liveBroadcastingStats: LiveBroadcastingReviewStat[]
  productOptions: ProductOption[]
  total: number
  pageNo: number
  pageSize: number
}

export interface GroupBuyingReviewStat {
  productName: string
  sampleSendCount: number
  notSampleSendCount: number
  sampleSendDate?: string
  groupStartCount: number
  notGroupStartCount: number
  groupStartDate?: string
  repeatGroupCount: number
  notRepeatGroupCount: number
  repeatGroupDate?: string
}

export interface PrivateBroadcastingReviewStat {
  productName: string
  sampleSendCount: number
  notSampleSendCount: number
  sampleSendDate?: string
  groupStartCount: number
  notGroupStartCount: number
  groupStartDate?: string
  repeatGroupCount: number
  notRepeatGroupCount: number
  repeatGroupDate?: string
}

export interface LiveBroadcastingReviewStat {
  productName: string
  sampleSendCount: number
  notSampleSendCount: number
  sampleSendDate?: string
  groupStartCount: number
  notGroupStartCount: number
  groupStartDate?: string
  repeatGroupCount: number
  notRepeatGroupCount: number
  repeatGroupDate?: string
}

export interface ProductOption {
  productName: string
  reviewCount: number
}

// 查询复盘统计
export const getReviewStatistics = (params: { 
  beginDate: string; 
  endDate: string; 
  productName?: string;
  pageNo?: number;
  pageSize?: number;
}) => {
  console.log('调用复盘统计API，参数：', params)
  return request.get<ErpReviewStatisticsRespVO>({ url: '/erp/statistics/review/get', params })
} 