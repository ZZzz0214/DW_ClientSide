<template>
  <div class="sample-statistics">
    <!-- 标题和筛选区域 -->
    <div class="header-section">
      <div class="title-area">
        <h3 class="section-title">
          <Icon icon="ep:box" class="title-icon" />
          样品表统计报表
        </h3>
        <p class="section-subtitle">实时分析样品状态分布，掌握客户样品情况</p>
      </div>

      <!-- 筛选控件 -->
      <div class="filter-area">
        <el-form :model="queryParams" :inline="true" class="filter-form">
          <el-form-item label="样品时间范围">
            <el-date-picker
              v-model="sampleDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
              @change="handleSampleDateRangeChange"
            />
          </el-form-item>

          <el-form-item label="客户名称">
            <el-select
              v-model="queryParams.customerName"
              placeholder="请选择客户"
              clearable
              filterable
              style="width: 200px"
            >
              <el-option
                v-for="customer in customerOptions"
                :key="customer.customerName"
                :label="`${customer.customerName} (${customer.sampleCount})`"
                :value="customer.customerName"
              />
            </el-select>
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

    <!-- 样品统计概览 -->
    <div class="sample-overview-section" v-loading="loading">
      <h4 class="section-subtitle">样品状态统计概览</h4>
      <div class="overview-cards">
        <div class="overview-card total-card">
          <div class="card-header">
            <h4>总样品数量</h4>
            <Icon icon="ep:data-analysis" class="card-icon" />
          </div>
          <div class="card-content">
            <div class="metric-grid">
              <div class="metric-item total">
                <span class="metric-label">样品总数</span>
                <span class="metric-value total-count">{{ formatNumber(sampleSummary.totalCount) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 动态状态卡片 -->
        <div
          v-for="statusCard in statusCards"
          :key="statusCard.status"
          :class="['overview-card', statusCard.cardClass]"
        >
          <div class="card-header">
            <h4>{{ statusCard.title }}</h4>
            <Icon :icon="statusCard.icon" class="card-icon" />
          </div>
          <div class="card-content">
            <div class="metric-large">
<!--              <span class="metric-value">{{ formatNumber(statusCard.count) }}</span>-->
              <span class="metric-percentage">{{ statusCard.percentage }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 客户样品统计详情 -->
    <div class="customer-sample-section" v-loading="loading">
      <h4 class="section-subtitle">客户样品统计详情</h4>
      <div class="customer-cards">
        <div
          v-for="customer in sampleSummary.customerStats"
          :key="customer.customerName"
          class="customer-card"
        >
          <div class="customer-header">
            <h5 class="customer-name">{{ customer.customerName }}</h5>
            <span class="customer-total">总计: {{ formatNumber(customer.totalCount) }}</span>
          </div>
          <div class="customer-content">
            <div class="status-grid">
              <div
                v-for="statusInfo in allStatusInfo"
                :key="statusInfo.status"
                class="status-item"
              >
                <span class="status-label">{{ statusInfo.name }}</span>
                <span :class="['status-value', getStatusClass(statusInfo.status)]">
                  {{ formatNumber(customer.statusCount?.[statusInfo.name] || 0) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分页控件 -->
      <div class="pagination-container" v-if="sampleSummary.total > 0">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="sampleSummary.total"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="queryParams.pageSize"
          :current-page="queryParams.pageNo"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/formatTime'
import { erpCalculatePercentage } from '@/utils'
import {
  getSampleSummary,
  type ErpSampleSummaryRespVO
} from '@/api/erp/statistics/sample'

const loading = ref(false)

// 查询参数
const queryParams = reactive({
  sampleBeginDate: '',
  sampleEndDate: '',
  customerName: '',
  pageNo: 1,
  pageSize: 10
})

// 日期范围
const sampleDateRange = ref<[Date, Date] | null>(null)

// 统计数据
const sampleSummary = ref<ErpSampleSummaryRespVO>({
  statusCount: {},
  customerStats: [],
  totalCount: 0,
  customerOptions: [],
  total: 0,
  pageNo: 1,
  pageSize: 10
})

// 客户选项
const customerOptions = ref<Array<{ customerName: string; sampleCount: number }>>([])

// 监听数据变化
watch(sampleSummary, (newVal) => {
  console.log('sampleSummary数据变化：', newVal)
}, { deep: true })

// 计算属性：所有状态信息（用于动态生成状态卡片和客户统计）
const allStatusInfo = computed(() => {
  const statusInfoMap = new Map<string, { status: string; name: string }>()

  // 从总体状态统计中收集所有状态（只收集有数据的状态）
  if (sampleSummary.value.statusCount) {
    Object.entries(sampleSummary.value.statusCount).forEach(([statusName, count]) => {
      if (count > 0) { // 只显示有数据的状态
        statusInfoMap.set(statusName, {
          status: statusName,
          name: statusName
        })
      }
    })
  }

  // 转换为数组
  return Array.from(statusInfoMap.values())
})

// 动态状态卡片配置
const statusCards = computed(() => {
  const cards = []

  allStatusInfo.value.forEach(statusInfo => {
    const count = sampleSummary.value.statusCount?.[statusInfo.name] || 0
    const totalCount = sampleSummary.value.totalCount || 0

    // 使用统一的百分数计算函数，返回字符串格式
    const percentage = erpCalculatePercentage(count, totalCount)

    // 添加调试信息
    console.log(`状态卡片计算 - ${statusInfo.name}: 数量=${count}, 总数=${totalCount}, 百分比=${percentage}%`)

    cards.push({
      status: statusInfo.status,
      title: statusInfo.name,
      count,
      percentage: percentage + '%', // 在这里添加百分号
      icon: getStatusIcon(statusInfo.status),
      cardClass: getStatusCardClass(statusInfo.status)
    })
  })

  return cards
})

// 处理样品日期范围变化
const handleSampleDateRangeChange = (dates: [Date, Date] | null) => {
  if (dates) {
    queryParams.sampleBeginDate = formatDate(dates[0], 'YYYY-MM-DD')
    queryParams.sampleEndDate = formatDate(dates[1], 'YYYY-MM-DD')
  } else {
    queryParams.sampleBeginDate = ''
    queryParams.sampleEndDate = ''
  }
}

// 获取统计数据
const getStatistics = async () => {
  try {
    loading.value = true
    console.log('开始获取样品统计数据，查询参数：', queryParams)

    // 获取样品统计
    if (queryParams.sampleBeginDate && queryParams.sampleEndDate) {
      console.log('获取样品统计，日期范围：', queryParams.sampleBeginDate, '到', queryParams.sampleEndDate, '客户名称：', queryParams.customerName)
      const sampleData = await getSampleSummary({
        beginDate: queryParams.sampleBeginDate,
        endDate: queryParams.sampleEndDate,
        customerName: queryParams.customerName || undefined,
        pageNo: queryParams.pageNo,
        pageSize: queryParams.pageSize
      })
      console.log('样品统计响应：', sampleData)
      if (sampleData) {
        const newSampleSummary = {
          statusCount: sampleData.statusCount || {},
          customerStats: sampleData.customerStats || [],
          totalCount: Number(sampleData.totalCount) || 0,
          customerOptions: sampleData.customerOptions || [],
          total: sampleData.total || 0,
          pageNo: sampleData.pageNo || 1,
          pageSize: sampleData.pageSize || 10
        }
        console.log('设置样品统计数据：', newSampleSummary)
        sampleSummary.value = newSampleSummary
        customerOptions.value = sampleData.customerOptions || []
      } else {
        console.log('样品统计数据为空')
      }
    } else {
      console.log('样品日期范围未设置，跳过查询')
    }

    ElMessage.success('样品统计数据获取成功')
  } catch (error) {
    console.error('获取样品统计数据失败:', error)
    ElMessage.error('获取样品统计数据失败')

    // 重置数据为默认值
    sampleSummary.value = {
      statusCount: {},
      customerStats: [],
      totalCount: 0,
      customerOptions: [],
      total: 0,
      pageNo: 1,
      pageSize: 10
    }
  } finally {
    loading.value = false
  }
}

// 处理每页条数变化
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  queryParams.pageNo = 1; // 重置到第一页
  getStatistics();
}

// 处理页码变化
const handleCurrentChange = (page: number) => {
  queryParams.pageNo = page;
  getStatistics();
}

// 重置查询
const resetQuery = () => {
  sampleDateRange.value = null
  queryParams.sampleBeginDate = ''
  queryParams.sampleEndDate = ''
  queryParams.customerName = ''
  queryParams.pageNo = 1
  queryParams.pageSize = 10

  // 重置统计数据
  sampleSummary.value = {
    statusCount: {},
    customerStats: [],
    totalCount: 0,
    customerOptions: [],
    total: 0,
    pageNo: 1,
    pageSize: 10
  }
  customerOptions.value = []
}

// 格式化数字
const formatNumber = (num: number | string | undefined) => {
  if (num === undefined || num === null) return '0'
  const numberValue = typeof num === 'string' ? parseFloat(num) || 0 : num
  return numberValue.toLocaleString()
}

// 获取状态图标
const getStatusIcon = (status: string): string => {
  // 根据状态名称动态返回图标
  if (status.includes('待') || status.includes('等待')) {
    return 'ep:clock'
  } else if (status.includes('处理') || status.includes('进行')) {
    return 'ep:loading'
  } else if (status.includes('完成') || status.includes('成功')) {
    return 'ep:check'
  } else if (status.includes('取消') || status.includes('失败')) {
    return 'ep:close'
  } else {
    return 'ep:operation'
  }
}

// 获取状态卡片样式类
const getStatusCardClass = (status: string): string => {
  // 根据状态名称动态返回样式类
  if (status.includes('待') || status.includes('等待')) {
    return 'pending-card'
  } else if (status.includes('处理') || status.includes('进行')) {
    return 'processing-card'
  } else if (status.includes('完成') || status.includes('成功')) {
    return 'completed-card'
  } else if (status.includes('取消') || status.includes('失败')) {
    return 'cancelled-card'
  } else {
    return 'other-card'
  }
}

// 获取状态样式类
const getStatusClass = (status: string): string => {
  // 根据状态名称动态返回样式类
  if (status.includes('待') || status.includes('等待')) {
    return 'pending'
  } else if (status.includes('处理') || status.includes('进行')) {
    return 'processing'
  } else if (status.includes('完成') || status.includes('成功')) {
    return 'completed'
  } else if (status.includes('取消') || status.includes('失败')) {
    return 'cancelled'
  } else {
    return 'other'
  }
}

// 初始化
onMounted(() => {
  // 设置默认日期范围为最近30天
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  sampleDateRange.value = [startDate, endDate]
  handleSampleDateRangeChange(sampleDateRange.value)

  getStatistics()
})
</script>

<style lang="scss" scoped>
.sample-statistics {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 16px;

    .title-area {
      flex: 1;
      min-width: 300px;

      .section-title {
        display: flex;
        align-items: center;
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 600;
        color: #303133;

        .title-icon {
          margin-right: 8px;
          font-size: 20px;
          color: #409eff;
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
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;

        .el-form-item {
          margin-bottom: 0;
        }
      }
    }
  }

  .section-subtitle {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin: 24px 0 16px 0;
    padding-bottom: 8px;
    border-bottom: 2px solid #f0f0f0;
  }

  .overview-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    margin-bottom: 24px;

    .overview-card {
      background: #fafafa;
      border-radius: 8px;
      padding: 16px;
      border: 1px solid #e4e7ed;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #303133;
        }

        .card-icon {
          font-size: 18px;
          color: #409eff;
        }
      }

      .card-content {
        .metric-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .metric-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;

            &:last-child {
              border-bottom: none;
            }

            &.total {
              border-top: 2px solid #e4e7ed;
              padding-top: 12px;
              margin-top: 8px;
            }

            .metric-label {
              font-size: 13px;
              color: #606266;
            }

            .metric-value {
              font-size: 14px;
              font-weight: 600;

              &.pending {
                color: #e6a23c;
              }

              &.processing {
                color: #409eff;
              }

              &.completed {
                color: #67c23a;
              }

              &.cancelled {
                color: #f56c6c;
              }

              &.other {
                color: #909399;
              }

              &.total-count {
                color: #409eff;
                font-size: 16px;
              }
            }

            .metric-large {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 4px;

              .metric-value {
                font-size: 24px;
                font-weight: 700;
              }

              .metric-percentage {
                font-size: 12px;
                color: #909399;
              }
            }
          }
        }
      }

      &.total-card {
        border-left: 4px solid #409eff;
      }

      &.pending-card {
        border-left: 4px solid #e6a23c;
      }

      &.processing-card {
        border-left: 4px solid #409eff;
      }

      &.completed-card {
        border-left: 4px solid #67c23a;
      }

      &.cancelled-card {
        border-left: 4px solid #f56c6c;
      }

      &.other-card {
        border-left: 4px solid #909399;
      }
    }
  }

  .customer-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;

    .customer-card {
      background: #fafafa;
      border-radius: 8px;
      padding: 16px;
      border: 1px solid #e4e7ed;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .customer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #e4e7ed;

        .customer-name {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #303133;
        }

        .customer-total {
          font-size: 12px;
          color: #409eff;
          font-weight: 600;
        }
      }

      .customer-content {
        .status-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;

          .status-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;

            .status-label {
              font-size: 12px;
              color: #606266;
            }

            .status-value {
              font-size: 12px;
              font-weight: 600;

              &.pending {
                color: #e6a23c;
              }

              &.processing {
                color: #409eff;
              }

              &.completed {
                color: #67c23a;
              }

              &.cancelled {
                color: #f56c6c;
              }
            }
          }
        }
      }
    }
  }

  .sample-overview-section,
  .customer-sample-section {
    margin-bottom: 32px;
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
