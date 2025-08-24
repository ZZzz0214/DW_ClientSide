import request from '@/config/axios'

export interface ErpDistributionWholesaleProductStatisticsReqVO {
  startDate: string
  endDate: string
  supplier?: string
  customerName?: string
  pageNo: number
  pageSize: number
}

export interface ErpDistributionWholesaleProductStatisticsExportReqVO {
  startDate: string
  endDate: string
}

export interface SingleProductStatistics {
  productName: string
  productSpecification: string
  distributionCount: number
  wholesaleCount: number
  totalCount: number
  distributionPercentage: number
  wholesalePercentage: number
}

export interface ComboProductItemDetail {
  productName: string
  productSpecification: string
  itemQuantity: number
}

export interface ComboProductStatistics {
  comboProductId: number
  comboProductName: string
  comboProductNo: string
  distributionComboCount: number
  wholesaleComboCount: number
  totalComboCount: number
  distributionPercentage: number
  wholesalePercentage: number
  itemDetails: ComboProductItemDetail[]
}

export interface ErpDistributionWholesaleProductStatisticsRespVO {
  singleProductPageResult: {
    list: SingleProductStatistics[]
    total: number
  }
  comboProductPageResult: {
    list: ComboProductStatistics[]
    total: number
  }
  totalDistributionSingleCount: number
  totalWholesaleSingleCount: number
  totalSingleCount: number
  totalDistributionComboCount: number
  totalWholesaleComboCount: number
  totalComboCount: number
}

export const DistributionWholesaleProductStatisticsApi = {
  // 获得代发批发产品组品统计
  getDistributionWholesaleProductStatistics: async (params: ErpDistributionWholesaleProductStatisticsReqVO) => {
    return await request.get({ url: `/erp/statistics/distribution-wholesale-product/get`, params })
  },

  // 获得代发批发产品组品统计（分页）
  getDistributionWholesaleProductStatisticsPage: async (params: ErpDistributionWholesaleProductStatisticsReqVO) => {
    return await request.get({ url: `/erp/statistics/distribution-wholesale-product/page`, params })
  },

  // 导出代发批发产品组品统计
  exportDistributionWholesaleProductStatistics: async (params: ErpDistributionWholesaleProductStatisticsExportReqVO) => {
    return await request.download({ url: `/erp/statistics/distribution-wholesale-product/export`, params })
  }
} 