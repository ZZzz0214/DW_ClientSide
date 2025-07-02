<template>
  <div class="finance-statistics">
    <!-- 标题和筛选区域 -->
    <div class="header-section">
      <div class="title-area">
        <h3 class="section-title">
          <Icon icon="ep:money" class="title-icon" />
          财务表统计报表
        </h3>
        <p class="section-subtitle">实时分析财务收支情况，掌握资金流向</p>
      </div>

      <!-- 筛选控件 -->
      <div class="filter-area">
        <el-form :model="queryParams" :inline="true" class="filter-form">
          <el-form-item label="财务表时间范围">
            <el-date-picker
              v-model="financeDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
              @change="handleFinanceDateRangeChange"
            />
          </el-form-item>

          <el-form-item label="财务金额表时间范围">
            <el-date-picker
              v-model="financeAmountDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
              @change="handleFinanceAmountDateRangeChange"
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

    <!-- 财务表统计概览 -->
    <div class="finance-overview-section" v-loading="loading">
      <h4 class="section-subtitle">财务表统计概览</h4>
      <div class="overview-cards">
        <div class="overview-card count-card">
          <div class="card-header">
            <h4>审核状态统计</h4>
            <Icon icon="ep:document-checked" class="card-icon" />
          </div>
          <div class="card-content">
            <div class="metric-grid">
              <div class="metric-item">
                <span class="metric-label">未审核数量</span>
                <span class="metric-value unaudited">{{ formatNumber(financeSummary.unauditedCount) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">已审核数量</span>
                <span class="metric-value audited">{{ formatNumber(financeSummary.auditedCount) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="overview-card expense-card">
          <div class="card-header">
            <h4>支出统计</h4>
            <Icon icon="ep:money" class="card-icon" />
          </div>
          <div class="card-content">
            <div class="metric-grid">
              <div class="metric-item">
                <span class="metric-label">未审核支出</span>
                <span class="metric-value expense">¥{{ formatMoney(financeSummary.unauditedExpense) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">已审核支出</span>
                <span class="metric-value expense">¥{{ formatMoney(financeSummary.auditedExpense) }}</span>
              </div>
              <div class="metric-item total">
                <span class="metric-label">总支出</span>
                <span class="metric-value total-expense">¥{{ formatMoney(financeSummary.totalExpense) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="overview-card income-card">
          <div class="card-header">
            <h4>收入统计</h4>
            <Icon icon="ep:wallet" class="card-icon" />
          </div>
          <div class="card-content">
            <div class="metric-grid">
              <div class="metric-item">
                <span class="metric-label">未审核收入</span>
                <span class="metric-value income">¥{{ formatMoney(financeSummary.unauditedIncome) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">已审核收入</span>
                <span class="metric-value income">¥{{ formatMoney(financeSummary.auditedIncome) }}</span>
              </div>
              <div class="metric-item total">
                <span class="metric-label">总收入</span>
                <span class="metric-value total-income">¥{{ formatMoney(financeSummary.totalIncome) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 财务金额表统计概览 -->
    <div class="finance-amount-overview-section" v-loading="loading">
      <h4 class="section-subtitle">财务金额表统计概览</h4>
      <div class="overview-cards">
        <div class="overview-card count-card">
          <div class="card-header">
            <h4>审核状态统计</h4>
            <Icon icon="ep:document-checked" class="card-icon" />
          </div>
          <div class="card-content">
            <div class="metric-grid">
              <div class="metric-item">
                <span class="metric-label">未审核数量</span>
                <span class="metric-value unaudited">{{ formatNumber(financeAmountSummary.unauditedCount) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">已审核数量</span>
                <span class="metric-value audited">{{ formatNumber(financeAmountSummary.auditedCount) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="overview-card wechat-card">
          <div class="card-header">
            <h4>微信充值统计</h4>
            <Icon icon="ep:chat-dot-round" class="card-icon" />
          </div>
          <div class="card-content">
            <div class="metric-grid">
              <div class="metric-item">
                <span class="metric-label">充值数量</span>
                <span class="metric-value">{{ formatNumber(financeAmountSummary.wechatCount) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">充值总额</span>
                <span class="metric-value income">¥{{ formatMoney(financeAmountSummary.wechatTotal) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="overview-card alipay-card">
          <div class="card-header">
            <h4>支付宝充值统计</h4>
            <Icon icon="ep:credit-card" class="card-icon" />
          </div>
          <div class="card-content">
            <div class="metric-grid">
              <div class="metric-item">
                <span class="metric-label">充值数量</span>
                <span class="metric-value">{{ formatNumber(financeAmountSummary.alipayCount) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">充值总额</span>
                <span class="metric-value income">¥{{ formatMoney(financeAmountSummary.alipayTotal) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="overview-card bank-card">
          <div class="card-header">
            <h4>银行卡充值统计</h4>
            <Icon icon="ep:bank-card" class="card-icon" />
          </div>
          <div class="card-content">
            <div class="metric-grid">
              <div class="metric-item">
                <span class="metric-label">充值数量</span>
                <span class="metric-value">{{ formatNumber(financeAmountSummary.bankCardCount) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">充值总额</span>
                <span class="metric-value income">¥{{ formatMoney(financeAmountSummary.bankCardTotal) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="overview-card total-card">
          <div class="card-header">
            <h4>充值总计</h4>
            <Icon icon="ep:data-analysis" class="card-icon" />
          </div>
          <div class="card-content">
            <div class="metric-grid">
              <div class="metric-item total">
                <span class="metric-label">充值总金额</span>
                <span class="metric-value total-income">¥{{ formatMoney(financeAmountSummary.totalAmount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/formatTime'
import {
  getFinanceSummary,
  getFinanceAmountSummary,
  type ErpFinanceSummaryRespVO,
  type ErpFinanceAmountSummaryRespVO
} from '@/api/erp/statistics/finance'

const loading = ref(false)

// 查询参数
const queryParams = reactive({
  financeBeginDate: '',
  financeEndDate: '',
  financeAmountBeginDate: '',
  financeAmountEndDate: ''
})

// 日期范围
const financeDateRange = ref<[Date, Date] | null>(null)
const financeAmountDateRange = ref<[Date, Date] | null>(null)

// 统计数据
const financeSummary = ref<ErpFinanceSummaryRespVO>({
  unauditedCount: 0,
  auditedCount: 0,
  unauditedExpense: 0,
  unauditedIncome: 0,
  auditedExpense: 0,
  auditedIncome: 0,
  totalExpense: 0,
  totalIncome: 0
})

const financeAmountSummary = ref<ErpFinanceAmountSummaryRespVO>({
  unauditedCount: 0,
  auditedCount: 0,
  wechatCount: 0,
  alipayCount: 0,
  bankCardCount: 0,
  wechatTotal: 0,
  alipayTotal: 0,
  bankCardTotal: 0,
  totalAmount: 0
})

// 监听数据变化
watch(financeSummary, (newVal) => {
  console.log('financeSummary数据变化：', newVal)
}, { deep: true })

watch(financeAmountSummary, (newVal) => {
  console.log('financeAmountSummary数据变化：', newVal)
}, { deep: true })

// 处理财务表日期范围变化
const handleFinanceDateRangeChange = (dates: [Date, Date] | null) => {
  if (dates) {
    queryParams.financeBeginDate = formatDate(dates[0], 'YYYY-MM-DD')
    queryParams.financeEndDate = formatDate(dates[1], 'YYYY-MM-DD')
  } else {
    queryParams.financeBeginDate = ''
    queryParams.financeEndDate = ''
  }
}

// 处理财务金额表日期范围变化
const handleFinanceAmountDateRangeChange = (dates: [Date, Date] | null) => {
  if (dates) {
    queryParams.financeAmountBeginDate = formatDate(dates[0], 'YYYY-MM-DD')
    queryParams.financeAmountEndDate = formatDate(dates[1], 'YYYY-MM-DD')
  } else {
    queryParams.financeAmountBeginDate = ''
    queryParams.financeAmountEndDate = ''
  }
}

// 获取统计数据
const getStatistics = async () => {
  try {
    loading.value = true
    console.log('开始获取统计数据，查询参数：', queryParams)

    // 获取财务表统计
    if (queryParams.financeBeginDate && queryParams.financeEndDate) {
      console.log('获取财务表统计，日期范围：', queryParams.financeBeginDate, '到', queryParams.financeEndDate)
      const financeData = await getFinanceSummary({
        beginDate: queryParams.financeBeginDate,
        endDate: queryParams.financeEndDate
      })
      console.log('财务表统计响应：', financeData)
      if (financeData) {
        const newFinanceSummary = {
          unauditedCount: Number(financeData.unauditedCount) || 0,
          auditedCount: Number(financeData.auditedCount) || 0,
          unauditedExpense: parseFloat(String(financeData.unauditedExpense || 0)),
          unauditedIncome: parseFloat(String(financeData.unauditedIncome || 0)),
          auditedExpense: parseFloat(String(financeData.auditedExpense || 0)),
          auditedIncome: parseFloat(String(financeData.auditedIncome || 0)),
          totalExpense: parseFloat(String(financeData.totalExpense || 0)),
          totalIncome: parseFloat(String(financeData.totalIncome || 0))
        }
        console.log('设置财务表统计数据：', newFinanceSummary)
        financeSummary.value = newFinanceSummary
      } else {
        console.log('财务表统计数据为空')
      }
    } else {
      console.log('财务表日期范围未设置，跳过查询')
    }

    // 获取财务金额表统计
    if (queryParams.financeAmountBeginDate && queryParams.financeAmountEndDate) {
      console.log('获取财务金额表统计，日期范围：', queryParams.financeAmountBeginDate, '到', queryParams.financeAmountEndDate)
      const financeAmountData = await getFinanceAmountSummary({
        beginDate: queryParams.financeAmountBeginDate,
        endDate: queryParams.financeAmountEndDate
      })
      console.log('财务金额表统计响应：', financeAmountData)
      if (financeAmountData) {
        const newFinanceAmountSummary = {
          unauditedCount: Number(financeAmountData.unauditedCount) || 0,
          auditedCount: Number(financeAmountData.auditedCount) || 0,
          wechatCount: Number(financeAmountData.wechatCount) || 0,
          alipayCount: Number(financeAmountData.alipayCount) || 0,
          bankCardCount: Number(financeAmountData.bankCardCount) || 0,
          wechatTotal: parseFloat(String(financeAmountData.wechatTotal || 0)),
          alipayTotal: parseFloat(String(financeAmountData.alipayTotal || 0)),
          bankCardTotal: parseFloat(String(financeAmountData.bankCardTotal || 0)),
          totalAmount: parseFloat(String(financeAmountData.totalAmount || 0))
        }
        console.log('设置财务金额表统计数据：', newFinanceAmountSummary)
        financeAmountSummary.value = newFinanceAmountSummary
      } else {
        console.log('财务金额表统计数据为空')
      }
    } else {
      console.log('财务金额表日期范围未设置，跳过查询')
    }

    ElMessage.success('统计数据获取成功')
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('获取统计数据失败')
    
    // 重置数据为默认值
    financeSummary.value = {
      unauditedCount: 0,
      auditedCount: 0,
      unauditedExpense: 0,
      unauditedIncome: 0,
      auditedExpense: 0,
      auditedIncome: 0,
      totalExpense: 0,
      totalIncome: 0
    }
    
    financeAmountSummary.value = {
      unauditedCount: 0,
      auditedCount: 0,
      wechatCount: 0,
      alipayCount: 0,
      bankCardCount: 0,
      wechatTotal: 0,
      alipayTotal: 0,
      bankCardTotal: 0,
      totalAmount: 0
    }
  } finally {
    loading.value = false
  }
}

// 重置查询
const resetQuery = () => {
  financeDateRange.value = null
  financeAmountDateRange.value = null
  queryParams.financeBeginDate = ''
  queryParams.financeEndDate = ''
  queryParams.financeAmountBeginDate = ''
  queryParams.financeAmountEndDate = ''
  
  // 重置统计数据
  financeSummary.value = {
    unauditedCount: 0,
    auditedCount: 0,
    unauditedExpense: 0,
    unauditedIncome: 0,
    auditedExpense: 0,
    auditedIncome: 0,
    totalExpense: 0,
    totalIncome: 0
  }
  
  financeAmountSummary.value = {
    unauditedCount: 0,
    auditedCount: 0,
    wechatCount: 0,
    alipayCount: 0,
    bankCardCount: 0,
    wechatTotal: 0,
    alipayTotal: 0,
    bankCardTotal: 0,
    totalAmount: 0
  }
}

// 格式化数字
const formatNumber = (num: number | string | undefined) => {
  if (num === undefined || num === null) return '0'
  const numberValue = typeof num === 'string' ? parseFloat(num) || 0 : num
  return numberValue.toLocaleString()
}

// 格式化金额
const formatMoney = (amount: number | string | undefined) => {
  if (amount === undefined || amount === null) return '0.00'
  const numberValue = typeof amount === 'string' ? parseFloat(amount) || 0 : amount
  return numberValue.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 初始化
onMounted(() => {
  // 设置默认日期范围为最近30天
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)
  
  financeDateRange.value = [startDate, endDate]
  financeAmountDateRange.value = [startDate, endDate]
  
  handleFinanceDateRangeChange(financeDateRange.value)
  handleFinanceAmountDateRangeChange(financeAmountDateRange.value)
  
  getStatistics()
})
</script>

<style lang="scss" scoped>
.finance-statistics {
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

              &.unaudited {
                color: #e6a23c;
              }

              &.audited {
                color: #67c23a;
              }

              &.expense {
                color: #f56c6c;
              }

              &.income {
                color: #67c23a;
              }

              &.total-expense {
                color: #f56c6c;
                font-size: 16px;
              }

              &.total-income {
                color: #67c23a;
                font-size: 16px;
              }
            }
          }
        }
      }

      &.count-card {
        border-left: 4px solid #409eff;
      }

      &.expense-card {
        border-left: 4px solid #f56c6c;
      }

      &.income-card {
        border-left: 4px solid #67c23a;
      }

      &.wechat-card {
        border-left: 4px solid #07c160;
      }

      &.alipay-card {
        border-left: 4px solid #1677ff;
      }

      &.bank-card {
        border-left: 4px solid #722ed1;
      }

      &.total-card {
        border-left: 4px solid #fa8c16;
      }
    }
  }

  .finance-overview-section,
  .finance-amount-overview-section {
    margin-bottom: 32px;
  }
}
</style> 