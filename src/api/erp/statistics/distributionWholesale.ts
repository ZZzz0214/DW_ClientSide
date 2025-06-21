import request from '@/config/axios'

export interface DistributionWholesaleStatisticsReqVO {
  statisticsType: string // 统计类型：purchaser, supplier, salesperson, customer
  searchKeyword?: string // 搜索关键词
  beginTime?: string // 格式：yyyy-MM-dd HH:mm:ss
  endTime?: string // 格式：yyyy-MM-dd HH:mm:ss
}

export interface StatisticsItem {
  categoryName: string
  distributionOrderCount: number
  distributionProductQuantity: number
  distributionPurchaseAmount: number
  distributionSaleAmount: number
  wholesaleOrderCount: number
  wholesaleProductQuantity: number
  wholesalePurchaseAmount: number
  wholesaleSaleAmount: number
  totalOrderCount: number
  totalProductQuantity: number
  totalPurchaseAmount: number
  totalSaleAmount: number
}

// 详细统计数据
export interface DetailStatistics {
  categoryName: string
  statisticsType: string
  basicInfo: StatisticsItem
  monthlyTrends: MonthlyTrend[]
  productDistributions: ProductDistribution[]
  profitAnalysis: ProfitAnalysis
  recentOrders: OrderDetail[]
}

// 月度趋势
export interface MonthlyTrend {
  month: string
  distributionOrderCount: number
  wholesaleOrderCount: number
  distributionAmount: number
  wholesaleAmount: number
}

// 产品分布
export interface ProductDistribution {
  productName: string
  orderCount: number
  productQuantity: number
  saleAmount: number
}

// 利润分析
export interface ProfitAnalysis {
  totalPurchaseCost: number
  totalSaleRevenue: number
  totalProfit: number
  profitRate: number
  distributionProfit: number
  wholesaleProfit: number
}

// 订单明细
export interface OrderDetail {
  orderNo: string
  orderType: string
  productName: string
  quantity: number
  purchaseAmount: number
  saleAmount: number
  createTime: string
}

export interface DistributionWholesaleStatisticsRespVO {
  statisticsType: string
  items: StatisticsItem[]
}

// 获得代发批发统计
export const getDistributionWholesaleStatistics = (params: DistributionWholesaleStatisticsReqVO): Promise<DistributionWholesaleStatisticsRespVO> => {
  return request.get({
    url: '/erp/statistics/distribution-wholesale/get',
    params
  })
}

// 获得统计分类列表
export const getCategoryList = (statisticsType: string, keyword?: string): Promise<string[]> => {
  return request.get({
    url: '/erp/statistics/distribution-wholesale/get-category-list',
    params: { statisticsType, keyword }
  })
}

// 获得人员详细统计
export const getDetailStatistics = (data: DistributionWholesaleStatisticsReqVO & { categoryName: string }): Promise<DetailStatistics> => {
  return request.get({
    url: '/erp/statistics/distribution-wholesale/get-detail',
    params: data
  })
} 