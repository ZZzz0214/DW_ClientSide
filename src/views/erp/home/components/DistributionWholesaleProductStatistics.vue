<template>
  <div class="distribution-wholesale-product-statistics">
    <!-- 标题和筛选区域 -->
    <div class="header-section">
      <div class="title-area">
        <h3 class="section-title">
          <Icon icon="ep:goods" class="title-icon" />
          代发批发产品组品统计报表
        </h3>
        <p class="section-subtitle">实时分析代发批发产品数据，掌握业务发展趋势</p>
      </div>

      <!-- 筛选控件 -->
      <div class="filter-area">
        <el-form :model="queryParams" :inline="true" class="filter-form">
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

          <el-form-item label="供应商名称">
            <el-input
              v-model="queryParams.supplier"
              placeholder="请输入供应商名称"
              clearable
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="客户名称">
            <el-input
              v-model="queryParams.customerName"
              placeholder="请输入客户名称"
              clearable
              style="width: 200px"
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

    <!-- 总体概览卡片 -->
    <div class="overview-section" v-loading="loading">
      <div class="overview-cards">
        <div class="overview-card total-card">
          <div class="card-header">
            <h4>总体概览</h4>
            <Icon icon="ep:data-board" class="card-icon" />
          </div>
          <div class="card-content">
            <div class="metric-grid">
              <div class="metric-item">
                <span class="metric-label">单品总数</span>
                <span class="metric-value">{{ formatNumber(totalStats.totalSingleProductCount) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">组品总数</span>
                <span class="metric-value">{{ formatNumber(totalStats.totalComboProductCount) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 代发表统计卡片 -->
        <div class="overview-card distribution-card">
          <div class="card-header">
            <h4>代发表统计</h4>
            <Icon icon="ep:truck" class="card-icon" />
          </div>
          <div class="card-content">
            <div class="metric-grid">
              <div class="metric-item">
                <span class="metric-label">单品数量</span>
                <span class="metric-value">{{ formatNumber(totalStats.distributionSingleProductCount) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">组品数量</span>
                <span class="metric-value">{{ formatNumber(totalStats.distributionComboProductCount) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 批发表统计卡片 -->
        <div class="overview-card wholesale-card">
          <div class="card-header">
            <h4>批发表统计</h4>
            <Icon icon="ep:shopping-cart" class="card-icon" />
          </div>
          <div class="card-content">
            <div class="metric-grid">
              <div class="metric-item">
                <span class="metric-label">单品数量</span>
                <span class="metric-value">{{ formatNumber(totalStats.wholesaleSingleProductCount) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">组品数量</span>
                <span class="metric-value">{{ formatNumber(totalStats.wholesaleComboProductCount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图表展示区域 -->
    <div class="charts-section" v-loading="loading">
      <el-row :gutter="20">
        <!-- 饼图：单品vs组品分布 -->
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h4>单品与组品分布</h4>
            </div>
            <div class="chart-content">
              <div ref="pieChartRef" class="chart-container"></div>
            </div>
          </div>
        </el-col>

        <!-- 柱状图：代发vs批发对比 -->
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h4>代发批发对比</h4>
            </div>
            <div class="chart-content">
              <div ref="barChartRef" class="chart-container"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 数据表格区域 -->
    <div class="table-section">
      <div class="table-header">
        <h4>产品统计详情</h4>
        <div class="table-actions">
          <el-button type="primary" @click="exportData" :loading="exportLoading">
            <Icon icon="ep:download" />
            导出数据
          </el-button>
        </div>
      </div>

      <!-- 单品统计表格 -->
      <div class="table-subsection">
        <h5 class="subsection-title">
          <Icon icon="ep:goods" />
          单品统计
        </h5>
        <el-table
          :data="singleProductStatistics"
          :loading="loading"
          class="statistics-table"
          highlight-current-row
          :empty-text="loading ? '加载中...' : '暂无数据'"
          row-key="productName"
        >
          <el-table-column prop="productName" label="单品名称" min-width="200">
            <template #default="{ row }">
              <div class="product-cell">
                <Icon icon="ep:goods" class="product-icon" />
                <span class="product-name">{{ row.productName }}</span>
                <el-tag type="primary" size="small">单品</el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="distributionCount" label="代发数量" width="120" align="center">
            <template #default="{ row }">
              <span class="count-value distribution">{{ formatNumber(row.distributionCount) }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="wholesaleCount" label="批发数量" width="120" align="center">
            <template #default="{ row }">
              <span class="count-value wholesale">{{ formatNumber(row.wholesaleCount) }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="totalCount" label="总数量" width="120" align="center">
            <template #default="{ row }">
              <span class="count-value total">{{ formatNumber(row.totalCount) }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="distributionPercentage" label="代发占比" width="120" align="center">
            <template #default="{ row }">
              <div class="percentage-cell">
                <el-progress
                  :percentage="row.distributionPercentage"
                  :color="getProgressColor(row.distributionPercentage)"
                  :stroke-width="6"
                  :show-text="false"
                  style="width: 60px; margin-right: 8px;"
                />
                <span class="percentage-text">{{ row.distributionPercentage.toFixed(1) }}%</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="wholesalePercentage" label="批发占比" width="120" align="center">
            <template #default="{ row }">
              <div class="percentage-cell">
                <el-progress
                  :percentage="row.wholesalePercentage"
                  :color="getProgressColor(row.wholesalePercentage)"
                  :stroke-width="6"
                  :show-text="false"
                  style="width: 60px; margin-right: 8px;"
                />
                <span class="percentage-text">{{ row.wholesalePercentage.toFixed(1) }}%</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 单品统计分页 -->
        <div class="pagination-wrapper" v-if="singleProductPagination.total > 0">
          <el-pagination
            v-model:current-page="singleProductPagination.currentPage"
            v-model:page-size="singleProductPagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="singleProductPagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSingleProductSizeChange"
            @current-change="handleSingleProductPageChange"
          />
        </div>
      </div>

      <!-- 组品统计表格 -->
      <div class="table-subsection">
        <h5 class="subsection-title">
          <Icon icon="ep:collection" />
          组品统计
        </h5>
        <el-table
          :data="comboProductStatistics"
          :loading="loading"
          class="statistics-table"
          highlight-current-row
          :expand-row-keys="expandedRows"
          @expand-change="handleExpandChange"
          :empty-text="loading ? '加载中...' : '暂无数据'"
          row-key="comboProductId"
        >
          <el-table-column type="expand" width="50">
            <template #default="{ row }">
              <div class="combo-detail">
                <h6>组品单品明细</h6>
                <el-table :data="row.itemDetails || []" size="small" border row-key="productName">
                  <el-table-column prop="productName" label="单品名称" min-width="150" />
                  <el-table-column prop="productSpecification" label="规格" width="120" />
                  <el-table-column prop="itemQuantity" label="单品数量" width="100" align="center">
                    <template #default="{ row: item }">
                      <span class="count-value total">{{ formatNumber(item?.itemQuantity || 0) }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="comboProductName" label="组品名称" min-width="200">
            <template #default="{ row }">
              <div class="product-cell">
                <Icon icon="ep:collection" class="product-icon" />
                <span class="product-name">{{ row.comboProductName }}</span>
                <el-tag type="success" size="small">组品</el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="comboProductNo" label="组品编号" width="120" />

          <el-table-column prop="distributionComboCount" label="代发组品数量" width="140" align="center">
            <template #default="{ row }">
              <span class="count-value distribution">{{ formatNumber(row.distributionComboCount) }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="wholesaleComboCount" label="批发组品数量" width="140" align="center">
            <template #default="{ row }">
              <span class="count-value wholesale">{{ formatNumber(row.wholesaleComboCount) }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="totalComboCount" label="组品总数量" width="140" align="center">
            <template #default="{ row }">
              <span class="count-value total">{{ formatNumber(row.totalComboCount) }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="distributionPercentage" label="代发占比" width="120" align="center">
            <template #default="{ row }">
              <div class="percentage-cell">
                <el-progress
                  :percentage="row.distributionPercentage"
                  :color="getProgressColor(row.distributionPercentage)"
                  :stroke-width="6"
                  :show-text="false"
                  style="width: 60px; margin-right: 8px;"
                />
                <span class="percentage-text">{{ row.distributionPercentage.toFixed(1) }}%</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="wholesalePercentage" label="批发占比" width="120" align="center">
            <template #default="{ row }">
              <div class="percentage-cell">
                <el-progress
                  :percentage="row.wholesalePercentage"
                  :color="getProgressColor(row.wholesalePercentage)"
                  :stroke-width="6"
                  :show-text="false"
                  style="width: 60px; margin-right: 8px;"
                />
                <span class="percentage-text">{{ row.wholesalePercentage.toFixed(1) }}%</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 组品统计分页 -->
        <div class="pagination-wrapper" v-if="comboProductPagination.total > 0">
          <el-pagination
            v-model:current-page="comboProductPagination.currentPage"
            v-model:page-size="comboProductPagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="comboProductPagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleComboProductSizeChange"
            @current-change="handleComboProductPageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { formatDate } from '@/utils/formatTime'
import download from '@/utils/download'
import {
  DistributionWholesaleProductStatisticsApi,
  type ErpDistributionWholesaleProductStatisticsReqVO,
  type ErpDistributionWholesaleProductStatisticsExportReqVO,
  type ErpDistributionWholesaleProductStatisticsRespVO,
  type SingleProductStatistics,
  type ComboProductStatistics
} from '@/api/erp/statistics/distributionWholesaleProduct'

const loading = ref(false)
const exportLoading = ref(false)
const searchLoading = ref(false)

// 查询参数
const queryParams = reactive<ErpDistributionWholesaleProductStatisticsReqVO>({
  startDate: undefined,
  endDate: undefined,
  supplier: undefined,
  customerName: undefined,
  pageNo: 1,
  pageSize: 10
})

// 单品查询参数
const singleProductQueryParams = reactive<ErpDistributionWholesaleProductStatisticsReqVO>({
  startDate: undefined,
  endDate: undefined,
  supplier: undefined,
  customerName: undefined,
  pageNo: 1,
  pageSize: 10
})

// 组品查询参数
const comboProductQueryParams = reactive<ErpDistributionWholesaleProductStatisticsReqVO>({
  startDate: undefined,
  endDate: undefined,
  supplier: undefined,
  customerName: undefined,
  pageNo: 1,
  pageSize: 10
})

// 日期范围
const dateRange = ref<[Date, Date] | null>(null)

// 统计数据
const totalStats = ref({
  totalSingleProductCount: 0,
  totalComboProductCount: 0,
  distributionSingleProductCount: 0,
  distributionComboProductCount: 0,
  wholesaleSingleProductCount: 0,
  wholesaleComboProductCount: 0
})

const singleProductStatistics = ref<SingleProductStatistics[]>([])
const comboProductStatistics = ref<ComboProductStatistics[]>([])

// 分页信息
const singleProductPagination = ref({
  total: 0,
  currentPage: 1,
  pageSize: 10
})

const comboProductPagination = ref({
  total: 0,
  currentPage: 1,
  pageSize: 10
})

// 展开行控制
const expandedRows = ref<number[]>([])

// 图表引用
const pieChartRef = ref<HTMLElement>()
const barChartRef = ref<HTMLElement>()
let pieChart: echarts.ECharts | null = null
let barChart: echarts.ECharts | null = null

// 处理日期范围变化
const handleDateRangeChange = (dates: [Date, Date] | null) => {
  if (dates) {
    queryParams.startDate = formatDate(dates[0], 'YYYY-MM-DD')
    queryParams.endDate = formatDate(dates[1], 'YYYY-MM-DD')
  } else {
    queryParams.startDate = undefined
    queryParams.endDate = undefined
  }
}

// 获取统计数据
const getStatistics = async () => {
  // 如果没有设置日期范围，使用默认的最近30天
  if (!queryParams.startDate || !queryParams.endDate) {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)
    dateRange.value = [startDate, endDate]
    queryParams.startDate = formatDate(startDate, 'YYYY-MM-DD')
    queryParams.endDate = formatDate(endDate, 'YYYY-MM-DD')
  }
  
  // 同步查询参数到单品和组品查询参数
  singleProductQueryParams.startDate = queryParams.startDate
  singleProductQueryParams.endDate = queryParams.endDate
  singleProductQueryParams.supplier = queryParams.supplier
  singleProductQueryParams.customerName = queryParams.customerName
  comboProductQueryParams.startDate = queryParams.startDate
  comboProductQueryParams.endDate = queryParams.endDate
  comboProductQueryParams.supplier = queryParams.supplier
  comboProductQueryParams.customerName = queryParams.customerName
  
  loading.value = true
  try {
    console.log('开始获取统计数据，参数:', queryParams)
    const data = await DistributionWholesaleProductStatisticsApi.getDistributionWholesaleProductStatisticsPage(queryParams)
    console.log('获取到统计数据:', data)
    
    // 使用nextTick确保DOM更新完成后再设置数据
    await nextTick()
    // 构建totalStats对象
    totalStats.value = {
      totalSingleProductCount: data.totalSingleCount || 0,
      totalComboProductCount: data.totalComboCount || 0,
      distributionSingleProductCount: data.totalDistributionSingleCount || 0,
      distributionComboProductCount: data.totalDistributionComboCount || 0,
      wholesaleSingleProductCount: data.totalWholesaleSingleCount || 0,
      wholesaleComboProductCount: data.totalWholesaleComboCount || 0
    }
    console.log('构建的totalStats:', totalStats.value)
    singleProductStatistics.value = data.singleProductPageResult?.list || []
    comboProductStatistics.value = data.comboProductPageResult?.list || []
    
    // 更新分页信息
    singleProductPagination.value = {
      total: data.singleProductPageResult?.total || 0,
      currentPage: singleProductQueryParams.pageNo,
      pageSize: singleProductQueryParams.pageSize
    }
    comboProductPagination.value = {
      total: data.comboProductPageResult?.total || 0,
      currentPage: comboProductQueryParams.pageNo,
      pageSize: comboProductQueryParams.pageSize
    }
    
    console.log('单品统计数量:', singleProductStatistics.value.length)
    console.log('组品统计数量:', comboProductStatistics.value.length)
    
    // 重置展开行
    expandedRows.value = []
    
    // 初始化图表
    await nextTick()
    initCharts()
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('获取统计数据失败')
  } finally {
    loading.value = false
  }
}

// 获取单品统计数据
const getSingleProductStatistics = async () => {
  try {
    const data = await DistributionWholesaleProductStatisticsApi.getDistributionWholesaleProductStatisticsPage(singleProductQueryParams)
    singleProductStatistics.value = data.singleProductPageResult?.list || []
    singleProductPagination.value = {
      total: data.singleProductPageResult?.total || 0,
      currentPage: singleProductQueryParams.pageNo,
      pageSize: singleProductQueryParams.pageSize
    }
  } catch (error) {
    console.error('获取单品统计数据失败:', error)
    ElMessage.error('获取单品统计数据失败')
  }
}

// 获取组品统计数据
const getComboProductStatistics = async () => {
  try {
    const data = await DistributionWholesaleProductStatisticsApi.getDistributionWholesaleProductStatisticsPage(comboProductQueryParams)
    comboProductStatistics.value = data.comboProductPageResult?.list || []
    comboProductPagination.value = {
      total: data.comboProductPageResult?.total || 0,
      currentPage: comboProductQueryParams.pageNo,
      pageSize: comboProductQueryParams.pageSize
    }
  } catch (error) {
    console.error('获取组品统计数据失败:', error)
    ElMessage.error('获取组品统计数据失败')
  }
}

// 重置查询
const resetQuery = () => {
  dateRange.value = null
  queryParams.startDate = undefined
  queryParams.endDate = undefined
  queryParams.supplier = undefined
  queryParams.customerName = undefined
  queryParams.pageNo = 1
  
  // 重置单品查询参数
  singleProductQueryParams.startDate = undefined
  singleProductQueryParams.endDate = undefined
  singleProductQueryParams.supplier = undefined
  singleProductQueryParams.customerName = undefined
  singleProductQueryParams.pageNo = 1
  singleProductQueryParams.pageSize = 10
  
  // 重置组品查询参数
  comboProductQueryParams.startDate = undefined
  comboProductQueryParams.endDate = undefined
  comboProductQueryParams.supplier = undefined
  comboProductQueryParams.customerName = undefined
  comboProductQueryParams.pageNo = 1
  comboProductQueryParams.pageSize = 10
  
  getStatistics()
}

// 处理单品分页变化
const handleSingleProductPageChange = (page: number) => {
  singleProductQueryParams.pageNo = page
  singleProductPagination.value.currentPage = page
  getSingleProductStatistics()
}

// 处理单品每页大小变化
const handleSingleProductSizeChange = (size: number) => {
  singleProductQueryParams.pageSize = size
  singleProductPagination.value.pageSize = size
  singleProductQueryParams.pageNo = 1
  singleProductPagination.value.currentPage = 1
  getSingleProductStatistics()
}

// 处理组品分页变化
const handleComboProductPageChange = (page: number) => {
  comboProductQueryParams.pageNo = page
  comboProductPagination.value.currentPage = page
  getComboProductStatistics()
}

// 处理组品每页大小变化
const handleComboProductSizeChange = (size: number) => {
  comboProductQueryParams.pageSize = size
  comboProductPagination.value.pageSize = size
  comboProductQueryParams.pageNo = 1
  comboProductPagination.value.currentPage = 1
  getComboProductStatistics()
}

// 处理展开行变化
const handleExpandChange = (row: ComboProductStatistics, expanded: boolean) => {
  const rowId = row.comboProductId
  if (expanded) {
    if (!expandedRows.value.includes(rowId)) {
      expandedRows.value = [...expandedRows.value, rowId]
    }
  } else {
    expandedRows.value = expandedRows.value.filter(id => id !== rowId)
  }
}

// 格式化数字
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('zh-CN').format(num)
}

// 获取进度条颜色
const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return '#67C23A'
  if (percentage >= 60) return '#E6A23C'
  if (percentage >= 40) return '#F56C6C'
  return '#909399'
}



// 初始化饼图
const initPieChart = () => {
  if (!pieChartRef.value) return

  // 销毁旧的图表实例
  if (pieChart) {
    pieChart.dispose()
  }

  pieChart = echarts.init(pieChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['单品', '组品']
    },
    series: [
      {
        name: '产品分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          {
            value: totalStats.value.totalSingleProductCount || 0,
            name: '单品',
            itemStyle: { color: '#409EFF' }
          },
          {
            value: totalStats.value.totalComboProductCount || 0,
            name: '组品',
            itemStyle: { color: '#67C23A' }
          }
        ]
      }
    ]
  }
  pieChart.setOption(option)
}

// 初始化柱状图
const initBarChart = () => {
  if (!barChartRef.value) return

  // 销毁旧的图表实例
  if (barChart) {
    barChart.dispose()
  }

  barChart = echarts.init(barChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['单品', '组品']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['代发表', '批发表']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '单品',
        type: 'bar',
        data: [
          totalStats.value.distributionSingleProductCount || 0,
          totalStats.value.wholesaleSingleProductCount || 0
        ],
        itemStyle: { color: '#409EFF' }
      },
      {
        name: '组品',
        type: 'bar',
        data: [
          totalStats.value.distributionComboProductCount || 0,
          totalStats.value.wholesaleComboProductCount || 0
        ],
        itemStyle: { color: '#67C23A' }
      }
    ]
  }
  barChart.setOption(option)
}

// 初始化图表
const initCharts = () => {
  try {
    initPieChart()
    initBarChart()
  } catch (error) {
    console.error('初始化图表失败:', error)
  }
}

// 导出数据
const exportData = async () => {
  exportLoading.value = true
  try {
    // 导出时使用不包含分页信息的参数
    const exportParams = {
      startDate: queryParams.startDate,
      endDate: queryParams.endDate
    }
    console.log('导出参数:', exportParams)
    const res = await DistributionWholesaleProductStatisticsApi.exportDistributionWholesaleProductStatistics(exportParams)
    download.excel(res, '代发批发产品组品统计.xlsx')
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

// 监听窗口大小变化
const handleResize = () => {
  try {
    pieChart?.resize()
    barChart?.resize()
  } catch (error) {
    console.error('图表大小调整失败:', error)
  }
}

onMounted(() => {
  getStatistics()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  try {
    window.removeEventListener('resize', handleResize)
    if (pieChart) {
      pieChart.dispose()
      pieChart = null
    }
    if (barChart) {
      barChart.dispose()
      barChart = null
    }
  } catch (error) {
    console.error('组件卸载清理失败:', error)
  }
})
</script>

<style lang="scss" scoped>
.distribution-wholesale-product-statistics {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e4e7ed;

    .title-area {
      .section-title {
        display: flex;
        align-items: center;
        margin: 0 0 8px 0;
        font-size: 20px;
        font-weight: 600;
        color: #303133;

        .title-icon {
          margin-right: 8px;
          color: #409EFF;
          font-size: 24px;
        }
      }

      .section-subtitle {
        margin: 0;
        color: #909399;
        font-size: 14px;
      }
    }

    .filter-area {
      .filter-form {
        .el-form-item {
          margin-bottom: 0;
          margin-right: 16px;
        }
      }
    }
  }

  .overview-section {
    margin-bottom: 24px;

    .overview-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;

      .overview-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        padding: 20px;
        color: white;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

        &.total-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        &.distribution-card {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        &.wholesale-card {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;

          h4 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
          }

          .card-icon {
            font-size: 24px;
            opacity: 0.8;
          }
        }

        .card-content {
          .metric-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;

            .metric-item {
              text-align: center;

              .metric-label {
                display: block;
                font-size: 12px;
                opacity: 0.8;
                margin-bottom: 4px;
              }

              .metric-value {
                display: block;
                font-size: 24px;
                font-weight: 700;
              }
            }
          }
        }
      }
    }
  }

  .charts-section {
    margin-bottom: 24px;

    .chart-card {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .chart-header {
        margin-bottom: 16px;

        h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #303133;
        }
      }

      .chart-content {
        .chart-container {
          height: 300px;
        }
      }
    }
  }

  .table-section {
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }

      .table-actions {
        .el-button {
          margin-left: 8px;
        }
      }
    }

    .table-subsection {
      margin-bottom: 24px;

      .subsection-title {
        display: flex;
        align-items: center;
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 600;
        color: #606266;

        .el-icon {
          margin-right: 6px;
          color: #409EFF;
        }
      }

      .statistics-table {
        .product-cell {
          display: flex;
          align-items: center;
          gap: 8px;

          .product-icon {
            color: #409EFF;
            font-size: 16px;
          }

          .product-name {
            flex: 1;
            font-weight: 500;
          }
        }

        .count-value {
          font-weight: 600;
          font-size: 14px;

          &.distribution {
            color: #f093fb;
          }

          &.wholesale {
            color: #4facfe;
          }

          &.total {
            color: #409EFF;
          }
        }

        .percentage-cell {
          display: flex;
          align-items: center;

          .percentage-text {
            font-size: 12px;
            color: #606266;
            min-width: 40px;
          }
        }
      }

      .combo-detail {
        padding: 16px;
        background: #f8f9fa;
        border-radius: 8px;

        h6 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: #303133;
        }
      }

      .pagination-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #e4e7ed;
      }
    }
  }
}

@media (max-width: 768px) {
  .distribution-wholesale-product-statistics {
    padding: 16px;

    .header-section {
      flex-direction: column;
      gap: 16px;

      .filter-area {
        width: 100%;
      }
    }

    .overview-section {
      .overview-cards {
        grid-template-columns: 1fr;
      }
    }

    .charts-section {
      .el-row {
        .el-col {
          margin-bottom: 16px;
        }
      }
    }
  }
}
</style> 