<template>
  <div class="review-statistics">
    <!-- 标题和筛选区域 -->
    <div class="header-section">
      <div class="title-area">
        <h3 class="section-title">
          <Icon icon="ep:data-analysis" class="title-icon" />
          复盘统计报表
        </h3>
        <p class="section-subtitle">实时分析复盘数据，掌握产品复盘情况</p>
      </div>

      <!-- 筛选控件 -->
      <div class="filter-area">
        <el-form :model="queryParams" :inline="true" class="filter-form">
          <el-form-item label="复盘时间范围">
            <el-date-picker
              v-model="reviewDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
              @change="handleReviewDateRangeChange"
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
                v-for="customer in reviewData.customerOptions"
                :key="customer.customerName"
                :label="`${customer.customerName} (${customer.reviewCount})`"
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

    <!-- 团购复盘统计 -->
    <div class="review-section" v-loading="loading">
      <h4 class="section-subtitle">
        <Icon icon="ep:shopping-cart" class="section-icon" />
        团购复盘统计
      </h4>
      <div class="review-cards">
        <div
          v-for="stat in reviewData.groupBuyingStats"
          :key="stat.productName"
          class="review-card"
        >
          <div class="card-header">
            <h5 class="product-name">{{ stat.productName }}</h5>
            <span class="total-count">总计: {{ formatNumber(stat.sampleSendCount + stat.notSampleSendCount) }}</span>
          </div>
          <div class="card-content">
            <div class="stat-grid">
              <!-- 寄样统计 -->
              <div class="stat-group">
                <h6 class="stat-title">寄样情况</h6>
                <div class="stat-items">
                  <div class="stat-item">
                    <span class="stat-label">已寄样</span>
                    <span class="stat-value success">{{ formatNumber(stat.sampleSendCount) }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">未寄样</span>
                    <span class="stat-value warning">{{ formatNumber(stat.notSampleSendCount) }}</span>
                  </div>
                  <div v-if="stat.sampleSendDate" class="stat-item">
                    <span class="stat-label">寄样日期</span>
                    <span class="stat-value date">{{ stat.sampleSendDate }}</span>
                  </div>
                </div>
              </div>

              <!-- 开团统计 -->
              <div class="stat-group">
                <h6 class="stat-title">开团情况</h6>
                <div class="stat-items">
                  <div class="stat-item">
                    <span class="stat-label">已开团</span>
                    <span class="stat-value success">{{ formatNumber(stat.groupStartCount) }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">未开团</span>
                    <span class="stat-value warning">{{ formatNumber(stat.notGroupStartCount) }}</span>
                  </div>
                  <div v-if="stat.groupStartDate" class="stat-item">
                    <span class="stat-label">开团日期</span>
                    <span class="stat-value date">{{ stat.groupStartDate }}</span>
                  </div>
                </div>
              </div>

              <!-- 复团统计 -->
              <div class="stat-group">
                <h6 class="stat-title">复团情况</h6>
                <div class="stat-items">
                  <div class="stat-item">
                    <span class="stat-label">已复团</span>
                    <span class="stat-value success">{{ formatNumber(stat.repeatGroupCount) }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">未复团</span>
                    <span class="stat-value warning">{{ formatNumber(stat.notRepeatGroupCount) }}</span>
                  </div>
                  <div v-if="stat.repeatGroupDate" class="stat-item">
                    <span class="stat-label">复团日期</span>
                    <span class="stat-value date">{{ stat.repeatGroupDate }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 私播复盘统计 -->
    <div class="review-section" v-loading="loading">
      <h4 class="section-subtitle">
        <Icon icon="ep:video-camera" class="section-icon" />
        私播复盘统计
      </h4>
      <div class="review-cards">
        <div
          v-for="stat in reviewData.privateBroadcastingStats"
          :key="stat.productName"
          class="review-card"
        >
          <div class="card-header">
            <h5 class="product-name">{{ stat.productName }}</h5>
            <span class="total-count">总计: {{ formatNumber(stat.sampleSendCount + stat.notSampleSendCount) }}</span>
          </div>
          <div class="card-content">
            <div class="stat-grid">
              <!-- 寄样统计 -->
              <div class="stat-group">
                <h6 class="stat-title">寄样情况</h6>
                <div class="stat-items">
                  <div class="stat-item">
                    <span class="stat-label">已寄样</span>
                    <span class="stat-value success">{{ formatNumber(stat.sampleSendCount) }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">未寄样</span>
                    <span class="stat-value warning">{{ formatNumber(stat.notSampleSendCount) }}</span>
                  </div>
                  <div v-if="stat.sampleSendDate" class="stat-item">
                    <span class="stat-label">寄样日期</span>
                    <span class="stat-value date">{{ stat.sampleSendDate }}</span>
                  </div>
                </div>
              </div>

              <!-- 开团统计 -->
              <div class="stat-group">
                <h6 class="stat-title">开团情况</h6>
                <div class="stat-items">
                  <div class="stat-item">
                    <span class="stat-label">已开团</span>
                    <span class="stat-value success">{{ formatNumber(stat.groupStartCount) }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">未开团</span>
                    <span class="stat-value warning">{{ formatNumber(stat.notGroupStartCount) }}</span>
                  </div>
                  <div v-if="stat.groupStartDate" class="stat-item">
                    <span class="stat-label">开团日期</span>
                    <span class="stat-value date">{{ stat.groupStartDate }}</span>
                  </div>
                </div>
              </div>

              <!-- 复团统计 -->
              <div class="stat-group">
                <h6 class="stat-title">复团情况</h6>
                <div class="stat-items">
                  <div class="stat-item">
                    <span class="stat-label">已复团</span>
                    <span class="stat-value success">{{ formatNumber(stat.repeatGroupCount) }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">未复团</span>
                    <span class="stat-value warning">{{ formatNumber(stat.notRepeatGroupCount) }}</span>
                  </div>
                  <div v-if="stat.repeatGroupDate" class="stat-item">
                    <span class="stat-label">复团日期</span>
                    <span class="stat-value date">{{ stat.repeatGroupDate }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 直播复盘统计 -->
    <div class="review-section" v-loading="loading">
      <h4 class="section-subtitle">
        <Icon icon="ep:video-play" class="section-icon" />
        直播复盘统计
      </h4>
      <div class="review-cards">
        <div
          v-for="stat in reviewData.liveBroadcastingStats"
          :key="stat.productName"
          class="review-card"
        >
          <div class="card-header">
            <h5 class="product-name">{{ stat.productName }}</h5>
            <span class="total-count">总计: {{ formatNumber(stat.sampleSendCount + stat.notSampleSendCount) }}</span>
          </div>
          <div class="card-content">
            <div class="stat-grid">
              <!-- 寄样统计 -->
              <div class="stat-group">
                <h6 class="stat-title">寄样情况</h6>
                <div class="stat-items">
                  <div class="stat-item">
                    <span class="stat-label">已寄样</span>
                    <span class="stat-value success">{{ formatNumber(stat.sampleSendCount) }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">未寄样</span>
                    <span class="stat-value warning">{{ formatNumber(stat.notSampleSendCount) }}</span>
                  </div>
                  <div v-if="stat.sampleSendDate" class="stat-item">
                    <span class="stat-label">寄样日期</span>
                    <span class="stat-value date">{{ stat.sampleSendDate }}</span>
                  </div>
                </div>
              </div>

              <!-- 开团统计 -->
              <div class="stat-group">
                <h6 class="stat-title">开播情况</h6>
                <div class="stat-items">
                  <div class="stat-item">
                    <span class="stat-label">已开播</span>
                    <span class="stat-value success">{{ formatNumber(stat.groupStartCount) }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">未开播</span>
                    <span class="stat-value warning">{{ formatNumber(stat.notGroupStartCount) }}</span>
                  </div>
                  <div v-if="stat.groupStartDate" class="stat-item">
                    <span class="stat-label">开播日期</span>
                    <span class="stat-value date">{{ stat.groupStartDate }}</span>
                  </div>
                </div>
              </div>

              <!-- 复团统计 -->
              <div class="stat-group">
                <h6 class="stat-title">复播情况</h6>
                <div class="stat-items">
                  <div class="stat-item">
                    <span class="stat-label">已复播</span>
                    <span class="stat-value success">{{ formatNumber(stat.repeatGroupCount) }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">未复播</span>
                    <span class="stat-value warning">{{ formatNumber(stat.notRepeatGroupCount) }}</span>
                  </div>
                  <div v-if="stat.repeatGroupDate" class="stat-item">
                    <span class="stat-label">复播日期</span>
                    <span class="stat-value date">{{ stat.repeatGroupDate }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/formatTime'
import {
  getReviewStatistics,
  type ErpReviewStatisticsRespVO
} from '@/api/erp/statistics/review'

const loading = ref(false)

// 查询参数
const queryParams = reactive({
  beginDate: '',
  endDate: '',
  customerName: ''
})

// 日期范围
const reviewDateRange = ref<[Date, Date] | null>(null)

// 统计数据
const reviewData = ref<ErpReviewStatisticsRespVO>({
  groupBuyingStats: [],
  privateBroadcastingStats: [],
  liveBroadcastingStats: [],
  customerOptions: []
})

// 处理复盘日期范围变化
const handleReviewDateRangeChange = (dates: [Date, Date] | null) => {
  if (dates) {
    queryParams.beginDate = formatDate(dates[0], 'YYYY-MM-DD')
    queryParams.endDate = formatDate(dates[1], 'YYYY-MM-DD')
  } else {
    queryParams.beginDate = ''
    queryParams.endDate = ''
  }
}

// 获取统计数据
const getStatistics = async () => {
  try {
    loading.value = true
    console.log('开始获取复盘统计数据，查询参数：', queryParams)

    if (queryParams.beginDate && queryParams.endDate) {
      console.log('获取复盘统计，日期范围：', queryParams.beginDate, '到', queryParams.endDate, '客户名称：', queryParams.customerName)
      const data = await getReviewStatistics({
        beginDate: queryParams.beginDate,
        endDate: queryParams.endDate,
        customerName: queryParams.customerName || undefined
      })
      console.log('复盘统计响应：', data)
      if (data) {
        reviewData.value = data
      } else {
        console.log('复盘统计数据为空')
      }
    } else {
      console.log('复盘日期范围未设置，跳过查询')
    }

    ElMessage.success('复盘统计数据获取成功')
  } catch (error) {
    console.error('获取复盘统计数据失败:', error)
    ElMessage.error('获取复盘统计数据失败')

    // 重置数据为默认值
    reviewData.value = {
      groupBuyingStats: [],
      privateBroadcastingStats: [],
      liveBroadcastingStats: [],
      customerOptions: []
    }
  } finally {
    loading.value = false
  }
}

// 重置查询
const resetQuery = () => {
  reviewDateRange.value = null
  queryParams.beginDate = ''
  queryParams.endDate = ''
  queryParams.customerName = ''

  // 重置统计数据
  reviewData.value = {
    groupBuyingStats: [],
    privateBroadcastingStats: [],
    liveBroadcastingStats: [],
    customerOptions: []
  }
}

// 格式化数字
const formatNumber = (num: number | string | undefined) => {
  if (num === undefined || num === null) return '0'
  const numberValue = typeof num === 'string' ? parseFloat(num) || 0 : num
  return numberValue.toLocaleString()
}

// 初始化
onMounted(() => {
  // 设置默认日期范围为最近30天
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  reviewDateRange.value = [startDate, endDate]
  handleReviewDateRangeChange(reviewDateRange.value)

  getStatistics()
})
</script>

<style lang="scss" scoped>
.review-statistics {
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
        flex-wrap: wrap;
        gap: 12px;
        align-items: flex-end;
      }
    }
  }

  .review-section {
    margin-bottom: 32px;

    .section-subtitle {
      display: flex;
      align-items: center;
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: #303133;

      .section-icon {
        margin-right: 8px;
        font-size: 18px;
        color: #409eff;
      }
    }

    .review-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 16px;

      .review-card {
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        padding: 16px;
        background: #fafafa;

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e4e7ed;

          .product-name {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #303133;
          }

          .total-count {
            font-size: 14px;
            color: #909399;
            font-weight: 500;
          }
        }

        .card-content {
          .stat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 16px;

            .stat-group {
              .stat-title {
                margin: 0 0 8px 0;
                font-size: 14px;
                font-weight: 600;
                color: #606266;
                text-align: center;
                padding: 4px 8px;
                background: #f5f7fa;
                border-radius: 4px;
              }

              .stat-items {
                display: flex;
                flex-direction: column;
                gap: 6px;

                .stat-item {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 4px 0;

                  .stat-label {
                    font-size: 12px;
                    color: #909399;
                  }

                  .stat-value {
                    font-size: 12px;
                    font-weight: 600;

                    &.success {
                      color: #67c23a;
                    }

                    &.warning {
                      color: #e6a23c;
                    }

                    &.date {
                      color: #409eff;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style> 