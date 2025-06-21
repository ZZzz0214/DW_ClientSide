<template>
  <div class="distribution-wholesale-statistics">
    <!-- 标题和筛选区域 -->
    <div class="header-section">
      <div class="title-area">
        <h3 class="section-title">
          <Icon icon="ep:data-analysis" class="title-icon" />
          代发批发统计报表
        </h3>
        <p class="section-subtitle">实时分析代发和批发业务数据，助力业务决策</p>
      </div>
      
      <!-- 筛选控件 -->
      <div class="filter-area">
        <el-form :model="queryParams" :inline="true" class="filter-form">
          <el-form-item label="统计类型">
            <el-select 
              v-model="queryParams.statisticsType" 
              placeholder="请选择统计类型"
              style="width: 150px"
              @change="handleStatisticsTypeChange"
            >
              <el-option label="采购人员" value="purchaser" />
              <el-option label="供应商" value="supplier" />
              <el-option label="销售人员" value="salesperson" />
              <el-option label="客户" value="customer" />
            </el-select>
          </el-form-item>
          
          <el-form-item :label="getSearchLabel()">
            <el-select
              v-model="queryParams.searchKeyword"
              filterable
              remote
              reserve-keyword
              :placeholder="getSearchPlaceholder()"
              :remote-method="handleRemoteSearch"
              :loading="searchLoading"
              style="width: 220px"
              clearable
              @change="handleSearchChange"
            >
              <el-option
                v-for="item in searchOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
              @change="handleDateRangeChange"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="getStatistics" :loading="loading">
              <Icon icon="ep:search" />
              查询
            </el-button>
            <el-button @click="resetQuery">
              <Icon icon="ep:refresh" />
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 概览卡片区域 -->
    <div class="overview-section" v-loading="loading">
      <div class="overview-cards">
        <div class="overview-card total-card">
          <div class="card-header">
            <h4>总体概览</h4>
            <Icon icon="ep:data-board" class="card-icon" />
          </div>
          <div class="card-content">
            <div class="metric-row">
              <div class="metric-item">
                <span class="metric-label">总订单数</span>
                <span class="metric-value">{{ formatNumber(totalStats.totalOrderCount) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">总产品数量</span>
                <span class="metric-value">{{ formatNumber(totalStats.totalProductQuantity) }}</span>
              </div>
            </div>
            <div class="metric-row">
              <div class="metric-item">
                <span class="metric-label">总采购金额</span>
                <span class="metric-value amount">￥{{ formatAmount(totalStats.totalPurchaseAmount) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">总销售金额</span>
                <span class="metric-value amount">￥{{ formatAmount(totalStats.totalSaleAmount) }}</span>
              </div>
            </div>
            <div class="profit-section">
              <div class="profit-item">
                <span class="profit-label">总利润</span>
                <span :class="['profit-value', totalProfit >= 0 ? 'profit' : 'loss']">
                  ￥{{ formatAmount(totalProfit) }}
                </span>
              </div>
              <div class="profit-item">
                <span class="profit-label">利润率</span>
                <span :class="['profit-rate', totalProfitRate >= 0 ? 'profit' : 'loss']">
                  {{ totalProfitRate.toFixed(2) }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="overview-card distribution-card">
          <div class="card-header">
            <h4>代发业务</h4>
            <Icon icon="ep:truck" class="card-icon" />
          </div>
          <div class="card-content">
            <div class="metric-row">
              <div class="metric-item">
                <span class="metric-label">订单数</span>
                <span class="metric-value">{{ formatNumber(totalStats.distributionOrderCount) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">产品数量</span>
                <span class="metric-value">{{ formatNumber(totalStats.distributionProductQuantity) }}</span>
              </div>
            </div>
            <div class="metric-row">
              <div class="metric-item">
                <span class="metric-label">采购金额</span>
                <span class="metric-value amount">￥{{ formatAmount(totalStats.distributionPurchaseAmount) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">销售金额</span>
                <span class="metric-value amount">￥{{ formatAmount(totalStats.distributionSaleAmount) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="overview-card wholesale-card">
          <div class="card-header">
            <h4>批发业务</h4>
            <Icon icon="ep:box" class="card-icon" />
          </div>
          <div class="card-content">
            <div class="metric-row">
              <div class="metric-item">
                <span class="metric-label">订单数</span>
                <span class="metric-value">{{ formatNumber(totalStats.wholesaleOrderCount) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">产品数量</span>
                <span class="metric-value">{{ formatNumber(totalStats.wholesaleProductQuantity) }}</span>
              </div>
            </div>
            <div class="metric-row">
              <div class="metric-item">
                <span class="metric-label">采购金额</span>
                <span class="metric-value amount">￥{{ formatAmount(totalStats.wholesalePurchaseAmount) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">销售金额</span>
                <span class="metric-value amount">￥{{ formatAmount(totalStats.wholesaleSaleAmount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据表格区域 -->
    <div class="table-section">
      <div class="table-header">
        <h4>详细统计列表 (点击行查看详情)</h4>
        <div class="table-actions">
          <el-button type="primary" @click="exportData" :loading="exportLoading">
            <Icon icon="ep:download" />
            导出数据
          </el-button>
        </div>
      </div>
      
      <el-table 
        :data="statisticsData" 
        v-loading="loading"
        class="statistics-table"
        @row-click="handleRowClick"
        :row-class-name="getRowClassName"
        highlight-current-row
      >
        <el-table-column prop="categoryName" :label="getColumnLabel()" min-width="120" fixed="left">
          <template #default="{ row }">
            <div class="category-cell">
              <Icon :icon="getCategoryIcon()" class="category-icon" />
              <span class="category-name">{{ row.categoryName }}</span>
              <Icon icon="ep:view" class="view-icon" />
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="代发业务" align="center">
          <el-table-column prop="distributionOrderCount" label="订单数" width="80" align="center" />
          <el-table-column prop="distributionProductQuantity" label="产品数量" width="100" align="center">
            <template #default="{ row }">
              {{ formatNumber(row.distributionProductQuantity) }}
            </template>
          </el-table-column>
          <el-table-column prop="distributionPurchaseAmount" label="采购金额" width="120" align="right">
            <template #default="{ row }">
              ￥{{ formatAmount(row.distributionPurchaseAmount) }}
            </template>
          </el-table-column>
          <el-table-column prop="distributionSaleAmount" label="销售金额" width="120" align="right">
            <template #default="{ row }">
              ￥{{ formatAmount(row.distributionSaleAmount) }}
            </template>
          </el-table-column>
        </el-table-column>
        
        <el-table-column label="批发业务" align="center">
          <el-table-column prop="wholesaleOrderCount" label="订单数" width="80" align="center" />
          <el-table-column prop="wholesaleProductQuantity" label="产品数量" width="100" align="center">
            <template #default="{ row }">
              {{ formatNumber(row.wholesaleProductQuantity) }}
            </template>
          </el-table-column>
          <el-table-column prop="wholesalePurchaseAmount" label="采购金额" width="120" align="right">
            <template #default="{ row }">
              ￥{{ formatAmount(row.wholesalePurchaseAmount) }}
            </template>
          </el-table-column>
          <el-table-column prop="wholesaleSaleAmount" label="销售金额" width="120" align="right">
            <template #default="{ row }">
              ￥{{ formatAmount(row.wholesaleSaleAmount) }}
            </template>
          </el-table-column>
        </el-table-column>
        
        <el-table-column label="合计统计" align="center">
          <el-table-column prop="totalOrderCount" label="总订单数" width="100" align="center" />
          <el-table-column prop="totalProductQuantity" label="总产品数量" width="120" align="center">
            <template #default="{ row }">
              {{ formatNumber(row.totalProductQuantity) }}
            </template>
          </el-table-column>
          <el-table-column prop="totalPurchaseAmount" label="总采购金额" width="130" align="right">
            <template #default="{ row }">
              ￥{{ formatAmount(row.totalPurchaseAmount) }}
            </template>
          </el-table-column>
          <el-table-column prop="totalSaleAmount" label="总销售金额" width="130" align="right">
            <template #default="{ row }">
              ￥{{ formatAmount(row.totalSaleAmount) }}
            </template>
          </el-table-column>
          <el-table-column label="利润" width="120" align="right">
            <template #default="{ row }">
              <span :class="['profit-cell', getProfit(row) >= 0 ? 'profit' : 'loss']">
                ￥{{ formatAmount(getProfit(row)) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="利润率" width="100" align="right">
            <template #default="{ row }">
              <span :class="['profit-rate-cell', getProfitRate(row) >= 0 ? 'profit' : 'loss']">
                {{ getProfitRate(row).toFixed(2) }}%
              </span>
            </template>
          </el-table-column>
        </el-table-column>
        
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click.stop="handleViewDetail(row)">
              <Icon icon="ep:view" />
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="`${detailData?.categoryName} - 详细分析`"
      width="90%"
      top="5vh"
      :before-close="handleCloseDetail"
    >
      <div v-if="detailData" class="detail-content" v-loading="detailLoading">
        <!-- 基础信息卡片 -->
        <div class="detail-section">
          <h4 class="section-title">
            <Icon icon="ep:data-board" />
            基础统计信息
          </h4>
          <div class="detail-overview">
            <div class="detail-card">
              <div class="detail-metric">
                <span class="metric-label">总订单数</span>
                <span class="metric-value">{{ detailData.basicInfo.totalOrderCount }}</span>
              </div>
              <div class="detail-metric">
                <span class="metric-label">总产品数量</span>
                <span class="metric-value">{{ formatNumber(detailData.basicInfo.totalProductQuantity) }}</span>
              </div>
            </div>
            <div class="detail-card">
              <div class="detail-metric">
                <span class="metric-label">总采购成本</span>
                <span class="metric-value amount">￥{{ formatAmount(detailData.profitAnalysis.totalPurchaseCost) }}</span>
              </div>
              <div class="detail-metric">
                <span class="metric-label">总销售收入</span>
                <span class="metric-value amount">￥{{ formatAmount(detailData.profitAnalysis.totalSaleRevenue) }}</span>
              </div>
            </div>
            <div class="detail-card profit-card">
              <div class="detail-metric">
                <span class="metric-label">总利润</span>
                <span :class="['metric-value', 'amount', detailData.profitAnalysis.totalProfit >= 0 ? 'profit' : 'loss']">
                  ￥{{ formatAmount(detailData.profitAnalysis.totalProfit) }}
                </span>
              </div>
              <div class="detail-metric">
                <span class="metric-label">利润率</span>
                <span :class="['metric-value', detailData.profitAnalysis.profitRate >= 0 ? 'profit' : 'loss']">
                  {{ detailData.profitAnalysis.profitRate.toFixed(2) }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 图表区域 -->
        <div class="charts-section">
          <el-row :gutter="20">
            <!-- 月度趋势图 -->
            <el-col :span="12">
              <div class="chart-container">
                <h4 class="chart-title">
                  <Icon icon="ep:trend-charts" />
                  {{ getTrendChartTitle() }}
                </h4>
                <Echart :height="300" :options="trendChartOptions" />
              </div>
            </el-col>
            
            <!-- 利润分析图 -->
            <el-col :span="12">
              <div class="chart-container">
                <h4 class="chart-title">
                  <Icon icon="ep:pie-chart" />
                  利润分析
                </h4>
                <Echart :height="300" :options="profitChartOptions" />
              </div>
            </el-col>
          </el-row>
          
          <el-row :gutter="20" style="margin-top: 20px">
            <!-- 产品分布图 -->
            <el-col :span="24">
              <div class="chart-container">
                <h4 class="chart-title">
                  <Icon icon="ep:histogram" />
                  {{ getProductChartTitle() }}
                </h4>
                <Echart :height="350" :options="productChartOptions" />
              </div>
            </el-col>
          </el-row>
        </div>


      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/formatTime'
import { 
  getDistributionWholesaleStatistics, 
  getCategoryList, 
  getDetailStatistics,
  type DistributionWholesaleStatisticsReqVO, 
  type StatisticsItem,
  type DetailStatistics
} from '@/api/erp/statistics/distributionWholesale'

defineOptions({ name: 'DistributionWholesaleStatistics' })

// 响应式数据
const loading = ref(false)
const exportLoading = ref(false)
const searchLoading = ref(false)
const detailLoading = ref(false)
const statisticsData = ref<StatisticsItem[]>([])
const searchOptions = ref<string[]>([])
const dateRange = ref<[Date, Date] | null>(null)
const detailDialogVisible = ref(false)
const detailData = ref<DetailStatistics | null>(null)

// 查询参数
const queryParams = reactive<DistributionWholesaleStatisticsReqVO>({
  statisticsType: 'purchaser',
  beginTime: undefined,
  endTime: undefined,
  searchKeyword: undefined
})

// 计算属性
const totalStats = computed(() => {
  if (!statisticsData.value.length) {
    return {
      totalOrderCount: 0,
      totalProductQuantity: 0,
      totalPurchaseAmount: 0,
      totalSaleAmount: 0,
      distributionOrderCount: 0,
      distributionProductQuantity: 0,
      distributionPurchaseAmount: 0,
      distributionSaleAmount: 0,
      wholesaleOrderCount: 0,
      wholesaleProductQuantity: 0,
      wholesalePurchaseAmount: 0,
      wholesaleSaleAmount: 0
    }
  }
  
  return statisticsData.value.reduce((acc, item) => ({
    totalOrderCount: acc.totalOrderCount + item.totalOrderCount,
    totalProductQuantity: acc.totalProductQuantity + item.totalProductQuantity,
    totalPurchaseAmount: acc.totalPurchaseAmount + item.totalPurchaseAmount,
    totalSaleAmount: acc.totalSaleAmount + item.totalSaleAmount,
    distributionOrderCount: acc.distributionOrderCount + item.distributionOrderCount,
    distributionProductQuantity: acc.distributionProductQuantity + item.distributionProductQuantity,
    distributionPurchaseAmount: acc.distributionPurchaseAmount + item.distributionPurchaseAmount,
    distributionSaleAmount: acc.distributionSaleAmount + item.distributionSaleAmount,
    wholesaleOrderCount: acc.wholesaleOrderCount + item.wholesaleOrderCount,
    wholesaleProductQuantity: acc.wholesaleProductQuantity + item.wholesaleProductQuantity,
    wholesalePurchaseAmount: acc.wholesalePurchaseAmount + item.wholesalePurchaseAmount,
    wholesaleSaleAmount: acc.wholesaleSaleAmount + item.wholesaleSaleAmount
  }), {
    totalOrderCount: 0,
    totalProductQuantity: 0,
    totalPurchaseAmount: 0,
    totalSaleAmount: 0,
    distributionOrderCount: 0,
    distributionProductQuantity: 0,
    distributionPurchaseAmount: 0,
    distributionSaleAmount: 0,
    wholesaleOrderCount: 0,
    wholesaleProductQuantity: 0,
    wholesalePurchaseAmount: 0,
    wholesaleSaleAmount: 0
  })
})

const totalProfit = computed(() => totalStats.value.totalSaleAmount - totalStats.value.totalPurchaseAmount)
const totalProfitRate = computed(() => {
  if (totalStats.value.totalSaleAmount === 0) return 0
  return (totalProfit.value / totalStats.value.totalSaleAmount) * 100
})

// 图表配置
const trendChartOptions = computed(() => {
  if (!detailData.value?.monthlyTrends) return {}
  
  const months = detailData.value.monthlyTrends.map(item => item.month)
  const distributionAmounts = detailData.value.monthlyTrends.map(item => item.distributionAmount)
  const wholesaleAmounts = detailData.value.monthlyTrends.map(item => item.wholesaleAmount)
  
  // 根据统计类型确定图例标签
  const isPurchaseType = queryParams.statisticsType === 'purchaser' || queryParams.statisticsType === 'supplier'
  const amountType = isPurchaseType ? '采购金额' : '销售金额'
  
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: [`代发${amountType}`, `批发${amountType}`]
    },
    xAxis: {
      type: 'category',
      data: months
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => `￥${formatAmount(value)}`
      }
    },
    series: [
      {
        name: `代发${amountType}`,
        type: 'line',
        data: distributionAmounts,
        smooth: true,
        itemStyle: { color: '#409EFF' }
      },
      {
        name: `批发${amountType}`,
        type: 'line',
        data: wholesaleAmounts,
        smooth: true,
        itemStyle: { color: '#67C23A' }
      }
    ]
  }
})

const profitChartOptions = computed(() => {
  if (!detailData.value?.profitAnalysis) return {}
  
  const distributionProfit = detailData.value.profitAnalysis.distributionProfit || 0
  const wholesaleProfit = detailData.value.profitAnalysis.wholesaleProfit || 0
  
  // 检查是否都是负值或零值
  if (distributionProfit <= 0 && wholesaleProfit <= 0) {
    // 使用绝对值来显示亏损分布
    const distributionLoss = Math.abs(distributionProfit)
    const wholesaleLoss = Math.abs(wholesaleProfit)
    
    if (distributionLoss === 0 && wholesaleLoss === 0) {
      // 如果都是0，显示提示信息
      return {
        title: {
          text: '暂无利润数据',
          left: 'center',
          top: 'middle',
          textStyle: {
            color: '#999',
            fontSize: 16
          }
        },
        series: []
      }
    }
    
    return {
      title: {
        text: '亏损分布',
        left: 'center',
        top: '10%',
        textStyle: {
          color: '#F56C6C',
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `${params.seriesName}<br/>${params.name}: -￥${formatAmount(params.value)} (${params.percent}%)`
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: '30%'
      },
      series: [
        {
          name: '亏损分析',
          type: 'pie',
          radius: '50%',
          center: ['50%', '60%'],
          data: [
            { 
              value: distributionLoss, 
              name: '代发亏损',
              itemStyle: { color: '#FFB6C1' } // 浅红色
            },
            { 
              value: wholesaleLoss, 
              name: '批发亏损',
              itemStyle: { color: '#FFA07A' } // 浅橙色
            }
          ].filter(item => item.value > 0) // 只显示有亏损的项
        }
      ]
    }
  } else {
    // 正常的利润分布（包含正负混合的情况）
    const chartData = []
    
    if (distributionProfit > 0) {
      chartData.push({
        value: distributionProfit,
        name: '代发利润',
        itemStyle: { color: '#409EFF' }
      })
    } else if (distributionProfit < 0) {
      chartData.push({
        value: Math.abs(distributionProfit),
        name: '代发亏损',
        itemStyle: { color: '#FFB6C1' }
      })
    }
    
    if (wholesaleProfit > 0) {
      chartData.push({
        value: wholesaleProfit,
        name: '批发利润',
        itemStyle: { color: '#67C23A' }
      })
    } else if (wholesaleProfit < 0) {
      chartData.push({
        value: Math.abs(wholesaleProfit),
        name: '批发亏损',
        itemStyle: { color: '#FFA07A' }
      })
    }
    
    if (chartData.length === 0) {
      return {
        title: {
          text: '暂无利润数据',
          left: 'center',
          top: 'middle',
          textStyle: {
            color: '#999',
            fontSize: 16
          }
        },
        series: []
      }
    }
    
    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const value = params.name.includes('亏损') ? -params.value : params.value
          const sign = value >= 0 ? '' : '-'
          const absValue = Math.abs(value)
          return `${params.seriesName}<br/>${params.name}: ${sign}￥${formatAmount(absValue)} (${params.percent}%)`
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '利润分析',
          type: 'pie',
          radius: '60%',
          data: chartData
        }
      ]
    }
  }
})

const productChartOptions = computed(() => {
  if (!detailData.value?.productDistributions) return {}
  
  const products = detailData.value.productDistributions.map(item => item.productName)
  const amounts = detailData.value.productDistributions.map(item => item.saleAmount)
  
  // 根据统计类型确定金额类型标签
  const isPurchaseType = queryParams.statisticsType === 'purchaser' || queryParams.statisticsType === 'supplier'
  const amountType = isPurchaseType ? '采购金额' : '销售金额'
  
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    xAxis: {
      type: 'category',
      data: products,
      axisLabel: {
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => `￥${formatAmount(value)}`
      }
    },
    series: [
      {
        name: amountType,
        type: 'bar',
        data: amounts,
        itemStyle: {
          color: '#409EFF'
        }
      }
    ]
  }
})

// 方法
const getStatistics = async () => {
  loading.value = true
  try {
    const data = await getDistributionWholesaleStatistics(queryParams)
    statisticsData.value = data.items || []
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('获取统计数据失败')
  } finally {
    loading.value = false
  }
}

const handleStatisticsTypeChange = () => {
  queryParams.searchKeyword = undefined
  searchOptions.value = []
  getStatistics()
}

const handleRemoteSearch = async (query: string) => {
  if (!query || query.trim().length < 1) {
    searchOptions.value = []
    return
  }
  
  searchLoading.value = true
  try {
    const suggestions = await getCategoryList(queryParams.statisticsType, query.trim())
    searchOptions.value = suggestions || []
  } catch (error) {
    console.error('搜索失败:', error)
    searchOptions.value = []
  } finally {
    searchLoading.value = false
  }
}

const handleSearchChange = () => {
  getStatistics()
}

const handleDateRangeChange = (dates: [Date, Date] | null) => {
  if (dates) {
    // 设置开始时间为当天的00:00:00
    const startDate = new Date(dates[0])
    startDate.setHours(0, 0, 0, 0)
    
    // 设置结束时间为当天的23:59:59
    const endDate = new Date(dates[1])
    endDate.setHours(23, 59, 59, 999)
    
    queryParams.beginTime = formatDateTime(startDate)
    queryParams.endTime = formatDateTime(endDate)
  } else {
    queryParams.beginTime = undefined
    queryParams.endTime = undefined
  }
  getStatistics()
}

// 格式化日期时间为后端期望的格式
const formatDateTime = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const resetQuery = () => {
  queryParams.searchKeyword = undefined
  queryParams.beginTime = undefined
  queryParams.endTime = undefined
  dateRange.value = null
  searchOptions.value = []
  getStatistics()
}

const handleRowClick = (row: StatisticsItem) => {
  handleViewDetail(row)
}

const handleViewDetail = async (row: StatisticsItem) => {
  detailLoading.value = true
  detailDialogVisible.value = true
  
  try {
    // 分别传递reqVO和categoryName参数
    detailData.value = await getDetailStatistics(queryParams, row.categoryName)
  } catch (error) {
    console.error('获取详细数据失败:', error)
    ElMessage.error('获取详细数据失败')
  } finally {
    detailLoading.value = false
  }
}

const handleCloseDetail = () => {
  detailDialogVisible.value = false
  detailData.value = null
}

const exportData = () => {
  exportLoading.value = true
  try {
    const csvContent = generateCSV()
    downloadCSV(csvContent, `代发批发统计_${formatDate(new Date(), 'YYYY-MM-DD')}.csv`)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

const generateCSV = () => {
  const headers = [
    getColumnLabel(),
    '代发订单数', '代发产品数量', '代发采购金额', '代发销售金额',
    '批发订单数', '批发产品数量', '批发采购金额', '批发销售金额',
    '总订单数', '总产品数量', '总采购金额', '总销售金额', '利润', '利润率'
  ]
  
  const rows = statisticsData.value.map(item => [
    item.categoryName,
    item.distributionOrderCount,
    item.distributionProductQuantity,
    item.distributionPurchaseAmount,
    item.distributionSaleAmount,
    item.wholesaleOrderCount,
    item.wholesaleProductQuantity,
    item.wholesalePurchaseAmount,
    item.wholesaleSaleAmount,
    item.totalOrderCount,
    item.totalProductQuantity,
    item.totalPurchaseAmount,
    item.totalSaleAmount,
    getProfit(item),
    getProfitRate(item).toFixed(2) + '%'
  ])
  
  return [headers, ...rows].map(row => row.join(',')).join('\n')
}

const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

// 工具方法
const formatNumber = (num: number) => {
  return num.toLocaleString()
}

const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getColumnLabel = () => {
  const labels = {
    purchaser: '采购人员',
    supplier: '供应商',
    salesperson: '销售人员',
    customer: '客户'
  }
  return labels[queryParams.statisticsType] || '分类'
}

const getSearchLabel = () => {
  const labels = {
    purchaser: '采购人员',
    supplier: '供应商',
    salesperson: '销售人员',
    customer: '客户'
  }
  return `搜索${labels[queryParams.statisticsType] || '分类'}`
}

const getSearchPlaceholder = () => {
  const placeholders = {
    purchaser: '请输入采购人员姓名',
    supplier: '请输入供应商名称',
    salesperson: '请输入销售人员姓名',
    customer: '请输入客户名称'
  }
  return placeholders[queryParams.statisticsType] || '请输入关键词'
}

const getCategoryIcon = () => {
  const icons = {
    purchaser: 'ep:user',
    supplier: 'ep:office-building',
    salesperson: 'ep:user-filled',
    customer: 'ep:avatar'
  }
  return icons[queryParams.statisticsType] || 'ep:user'
}

const getProfit = (row: StatisticsItem) => {
  return row.totalSaleAmount - row.totalPurchaseAmount
}

const getProfitRate = (row: StatisticsItem) => {
  if (row.totalSaleAmount === 0) return 0
  return (getProfit(row) / row.totalSaleAmount) * 100
}

const getRowClassName = ({ row }: { row: StatisticsItem }) => {
  return getProfit(row) >= 0 ? 'profit-row' : 'loss-row'
}

const getTrendChartTitle = () => {
  const isPurchaseType = queryParams.statisticsType === 'purchaser' || queryParams.statisticsType === 'supplier'
  const amountType = isPurchaseType ? '采购金额' : '销售金额'
  
  // 根据选择的时间范围确定标题
  let timeRangeText = '时间范围内'
  if (dateRange.value && dateRange.value.length === 2) {
    const startDate = dateRange.value[0]
    const endDate = dateRange.value[1]
    const daysBetween = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysBetween <= 31) {
      timeRangeText = '每日'
    } else if (daysBetween <= 365) {
      timeRangeText = '月度'
    } else {
      timeRangeText = '季度'
    }
  }
  
  return `${timeRangeText}${amountType}趋势分析`
}

const getProductChartTitle = () => {
  const isPurchaseType = queryParams.statisticsType === 'purchaser' || queryParams.statisticsType === 'supplier'
  const amountType = isPurchaseType ? '采购' : '销售'
  return `产品${amountType}分布 (Top 10)`
}

// 生命周期
onMounted(() => {
  // 设置默认时间范围为当前月份
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
  
  queryParams.beginTime = formatDateTime(firstDayOfMonth)
  queryParams.endTime = formatDateTime(lastDayOfMonth)
  dateRange.value = [firstDayOfMonth, lastDayOfMonth]
  
  getStatistics()
})
</script>

<style lang="scss" scoped>
.distribution-wholesale-statistics {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;

  .header-section {
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .title-area {
      margin-bottom: 20px;

      .section-title {
        display: flex;
        align-items: center;
        font-size: 20px;
        font-weight: 600;
        color: #2c3e50;
        margin: 0 0 8px 0;

        .title-icon {
          margin-right: 8px;
          color: #409EFF;
        }
      }

      .section-subtitle {
        color: #7f8c8d;
        margin: 0;
        font-size: 14px;
      }
    }

    .filter-form {
      :deep(.el-form-item) {
        margin-bottom: 0;
      }
    }
  }

  .overview-section {
    margin-bottom: 20px;

    .overview-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 20px;

      .overview-card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-4px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;

          h4 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #2c3e50;
          }

          .card-icon {
            font-size: 24px;
          }
        }

        .card-content {
          .metric-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;

            &:last-child {
              margin-bottom: 0;
            }

            .metric-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              flex: 1;

              .metric-label {
                font-size: 12px;
                color: #7f8c8d;
                margin-bottom: 4px;
              }

              .metric-value {
                font-size: 18px;
                font-weight: 600;
                color: #2c3e50;

                &.amount {
                  color: #409EFF;
                }
              }
            }
          }

          .profit-section {
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid #ebeef5;
            display: flex;
            justify-content: space-around;

            .profit-item {
              display: flex;
              flex-direction: column;
              align-items: center;

              .profit-label {
                font-size: 12px;
                color: #7f8c8d;
                margin-bottom: 4px;
              }

              .profit-value, .profit-rate {
                font-size: 16px;
                font-weight: 600;

                &.profit {
                  color: #67C23A;
                }

                &.loss {
                  color: #F56C6C;
                }
              }
            }
          }
        }

        &.total-card .card-icon {
          color: #409EFF;
        }

        &.distribution-card .card-icon {
          color: #67C23A;
        }

        &.wholesale-card .card-icon {
          color: #E6A23C;
        }
      }
    }
  }

  .table-section {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #2c3e50;
      }
    }

    .statistics-table {
      :deep(.category-cell) {
        display: flex;
        align-items: center;
        cursor: pointer;

        .category-icon {
          margin-right: 8px;
          color: #409EFF;
        }

        .category-name {
          flex: 1;
        }

        .view-icon {
          opacity: 0;
          transition: opacity 0.3s ease;
          color: #409EFF;
        }

        &:hover .view-icon {
          opacity: 1;
        }
      }

      :deep(.profit-cell) {
        font-weight: 600;

        &.profit {
          color: #67C23A;
        }

        &.loss {
          color: #F56C6C;
        }
      }

      :deep(.profit-rate-cell) {
        font-weight: 600;

        &.profit {
          color: #67C23A;
        }

        &.loss {
          color: #F56C6C;
        }
      }

      :deep(.profit-row) {
        &:hover > td {
          background-color: #f0f9ff !important;
        }
      }

      :deep(.loss-row) {
        &:hover > td {
          background-color: #fef2f2 !important;
        }
      }

      :deep(.el-table__row) {
        cursor: pointer;
      }
    }
  }

  .detail-content {
    .detail-section {
      margin-bottom: 30px;

      .section-title {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 16px;

        svg {
          margin-right: 8px;
          color: #409EFF;
        }
      }

      .detail-overview {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;

        .detail-card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;

          &.profit-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;

            .metric-label {
              color: rgba(255, 255, 255, 0.8);
            }

            .metric-value {
              color: white;
            }
          }

          .detail-metric {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 12px;

            &:last-child {
              margin-bottom: 0;
            }

            .metric-label {
              font-size: 12px;
              color: #7f8c8d;
              margin-bottom: 4px;
            }

            .metric-value {
              font-size: 18px;
              font-weight: 600;
              color: #2c3e50;

              &.amount {
                color: #409EFF;
              }

              &.profit {
                color: #67C23A;
              }

              &.loss {
                color: #F56C6C;
              }
            }
          }
        }
      }
    }

    .charts-section {
      margin-bottom: 30px;

      .chart-container {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 20px;

        .chart-title {
          display: flex;
          align-items: center;
          font-size: 14px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 16px;

          svg {
            margin-right: 8px;
            color: #409EFF;
          }
        }
      }
    }


  }
}
</style> 