<template>
  <div class="notebook-statistics">
    <!-- 标题和筛选区域 -->
    <div class="header-section">
      <div class="title-area">
        <h3 class="section-title">
          <Icon icon="ep:notebook" class="title-icon" />
          记事本任务统计报表
        </h3>
        <p class="section-subtitle">实时分析任务完成情况，提升工作效率管理</p>
      </div>

      <!-- 筛选控件 -->
      <div class="filter-area">
        <el-form :model="queryParams" :inline="true" class="filter-form">
          <el-form-item label="任务人员">
            <el-select
              v-model="queryParams.taskPerson"
              filterable
              remote
              reserve-keyword
              placeholder="请选择任务人员"
              :remote-method="handleRemoteSearch"
              :loading="searchLoading"
              style="width: 200px"
              clearable
              @change="handlePersonChange"
            >
              <el-option
                v-for="item in personOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
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
                <span class="metric-label">总任务数</span>
                <span class="metric-value">{{ formatNumber(totalStats.totalTaskCount) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">总人员数</span>
                <span class="metric-value">{{ formatNumber(totalStats.totalPersonCount) }}</span>
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
              <span class="metric-value">{{ formatNumber(statusCard.count) }}</span>
              <span class="metric-percentage">{{ statusCard.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据表格区域 -->
    <div class="table-section">
      <div class="table-header">
        <h4>人员任务统计详情</h4>
        <div class="table-actions">
          <el-button type="primary" @click="exportData" :loading="exportLoading">
            <Icon icon="ep:download" />
            导出数据
          </el-button>
        </div>
      </div>

      <el-table
        :data="personStatistics"
        v-loading="loading"
        class="statistics-table"
        highlight-current-row
      >
        <el-table-column prop="taskPerson" label="任务人员" min-width="120" fixed="left">
          <template #default="{ row }">
            <div class="person-cell">
              <Icon icon="ep:user" class="person-icon" />
              <span class="person-name">{{ row.taskPerson }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="totalTaskCount" label="总任务数" width="100" align="center" />

        <!-- 动态状态列 -->
        <el-table-column
          v-for="statusInfo in allStatusInfo"
          :key="statusInfo.status"
          :label="statusInfo.name"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-tag
              :type="getStatusTagType(statusInfo.status)"
              size="small"
            >
              {{ getPersonStatusCount(row, statusInfo.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="completionRate" label="完成率" width="120" align="center">
          <template #default="{ row }">
            <div class="completion-rate">
              <el-progress
                :percentage="row.completionRate"
                :color="getProgressColor(row.completionRate)"
                :stroke-width="6"
                :show-text="false"
                style="width: 60px; margin-right: 8px;"
              />
              <span :class="['rate-text', getProgressClass(row.completionRate)]">
                {{ row.completionRate.toFixed(1) }}%
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="状态分布" min-width="200">
          <template #default="{ row }">
            <div class="status-distribution">
              <div
                v-for="status in row.statusDistributions"
                :key="status.taskStatus"
                class="status-item"
              >
                <span :class="['status-dot', getStatusClass(status.taskStatus)]"></span>
                <span class="status-name">{{ status.statusName }}</span>
                <span class="status-count">{{ status.taskCount }}</span>
                <span class="status-percentage">({{ status.percentage.toFixed(1) }}%)</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/formatTime'
import {
  NotebookStatisticsApi,
  type ErpNotebookStatisticsReqVO,
  type ErpNotebookStatisticsRespVO,
  type TotalStatistics,
  type PersonStatistics,
  type TaskPersonOption
} from '@/api/erp/statistics/notebook'

defineOptions({ name: 'NotebookStatistics' })

// 响应式数据
const loading = ref(false)
const exportLoading = ref(false)
const searchLoading = ref(false)
const personOptions = ref<TaskPersonOption[]>([])
const dateRange = ref<[Date, Date] | null>(null)
const statisticsData = ref<ErpNotebookStatisticsRespVO | null>(null)

// 查询参数
const queryParams = reactive<ErpNotebookStatisticsReqVO>({
  taskPerson: undefined,
  beginTime: undefined,
  endTime: undefined
})

// 计算属性
const totalStats = computed<TotalStatistics>(() => {
  return statisticsData.value?.totalStatistics || {
    totalTaskCount: 0,
    pendingTaskCount: 0,
    inProgressTaskCount: 0,
    completedTaskCount: 0,
    totalPersonCount: 0
  }
})

const personStatistics = computed<PersonStatistics[]>(() => {
  return statisticsData.value?.personStatisticsList || []
})

// 所有状态信息（用于动态生成表格列）
const allStatusInfo = computed(() => {
  const statusInfoMap = new Map<number, { status: number; name: string }>()

  // 添加基础状态
  // statusInfoMap.set(0, { status: 0, name: '未完成' })
  // statusInfoMap.set(1, { status: 1, name: '正在做' })
  // statusInfoMap.set(2, { status: 2, name: '已完成' })

  // 从人员统计中收集所有状态
  personStatistics.value.forEach(person => {
    person.statusDistributions?.forEach(statusDist => {
      if (!statusInfoMap.has(statusDist.taskStatus)) {
        statusInfoMap.set(statusDist.taskStatus, {
          status: statusDist.taskStatus,
          name: statusDist.statusName
        })
      }
    })
  })

  // 转换为数组并按状态值排序
  return Array.from(statusInfoMap.values()).sort((a, b) => a.status - b.status)
})

// 动态状态卡片配置
const statusCards = computed(() => {
  const cards = []

  // 如果有其他状态，也添加到卡片中
  if (personStatistics.value.length > 0) {
    const allStatuses = new Set<number>()
    personStatistics.value.forEach(person => {
      person.statusDistributions?.forEach(status => {
        allStatuses.add(status.taskStatus)
      })
    })

    // 添加其他状态的卡片（除了0,1,2之外的状态）
    allStatuses.forEach(status => {
        const statusName = getStatusName(status)
        const count = getStatusCount(status)
        const percentage = getStatusPercentage(status)

        cards.push({
          status,
          title: statusName,
          count,
          percentage,
          icon: 'ep:operation',
          cardClass: 'other-card'
        })
    })
  }

  return cards
})

// 方法
const getStatistics = async () => {
  loading.value = true
  try {
    const data = await NotebookStatisticsApi.getNotebookStatistics(queryParams)
    statisticsData.value = data
  } catch (error) {
    console.error('获取记事本统计数据失败:', error)
    ElMessage.error('获取统计数据失败')
  } finally {
    loading.value = false
  }
}

const handleRemoteSearch = async (query: string) => {
  if (!query || query.trim().length < 1) {
    // 如果没有查询条件，获取所有用户选项
    searchLoading.value = true
    try {
      const suggestions = await NotebookStatisticsApi.getTaskPersonOptions('')
      personOptions.value = suggestions || []
    } catch (error) {
      console.error('获取人员列表失败:', error)
      personOptions.value = []
    } finally {
      searchLoading.value = false
    }
    return
  }

  searchLoading.value = true
  try {
    const suggestions = await NotebookStatisticsApi.getTaskPersonOptions(query.trim())
    personOptions.value = suggestions || []
  } catch (error) {
    console.error('搜索人员失败:', error)
    personOptions.value = []
  } finally {
    searchLoading.value = false
  }
}

const handlePersonChange = () => {
  getStatistics()
}

const handleDateRangeChange = (dates: [Date, Date] | null) => {
  if (dates) {
    const startDate = new Date(dates[0])
    startDate.setHours(0, 0, 0, 0)

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
  queryParams.taskPerson = undefined
  queryParams.beginTime = undefined
  queryParams.endTime = undefined
  dateRange.value = null
  personOptions.value = []
  getStatistics()
}

const exportData = () => {
  exportLoading.value = true
  try {
    const csvContent = generateCSV()
    downloadCSV(csvContent, `记事本任务统计_${formatDate(new Date(), 'YYYY-MM-DD')}.csv`)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

const generateCSV = () => {
  // 动态生成表头
  const headers = ['任务人员', '总任务数']

  // 添加所有状态列
  allStatusInfo.value.forEach(statusInfo => {
    headers.push(statusInfo.name)
  })

  headers.push('完成率')

  // 生成数据行
  const rows = personStatistics.value.map(item => {
    const row = [item.taskPerson, item.totalTaskCount]

    // 添加各状态的数量
    allStatusInfo.value.forEach(statusInfo => {
      row.push(getPersonStatusCount(item, statusInfo.status))
    })

    row.push(item.completionRate.toFixed(2) + '%')
    return row
  })

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

const getPendingPercentage = () => {
  if (totalStats.value.totalTaskCount === 0) return 0
  return ((totalStats.value.pendingTaskCount / totalStats.value.totalTaskCount) * 100).toFixed(1)
}

const getProgressPercentage = () => {
  if (totalStats.value.totalTaskCount === 0) return 0
  return ((totalStats.value.inProgressTaskCount / totalStats.value.totalTaskCount) * 100).toFixed(1)
}

const getCompletedPercentage = () => {
  if (totalStats.value.totalTaskCount === 0) return 0
  return ((totalStats.value.completedTaskCount / totalStats.value.totalTaskCount) * 100).toFixed(1)
}

// 获取其他状态的统计信息
const getStatusName = (status: number): string => {
  // 从人员统计中找到对应状态的名称
  for (const person of personStatistics.value) {
    const statusDist = person.statusDistributions?.find(s => s.taskStatus === status)
    if (statusDist) {
      return statusDist.statusName
    }
  }
  return `状态${status}`
}

const getStatusCount = (status: number): number => {
  let count = 0
  personStatistics.value.forEach(person => {
    const statusDist = person.statusDistributions?.find(s => s.taskStatus === status)
    if (statusDist) {
      count += statusDist.taskCount
    }
  })
  return count
}

const getStatusPercentage = (status: number): string => {
  const count = getStatusCount(status)
  if (totalStats.value.totalTaskCount === 0) return '0'
  return ((count / totalStats.value.totalTaskCount) * 100).toFixed(1)
}

// 获取个人在指定状态下的任务数量
const getPersonStatusCount = (person: PersonStatistics, status: number): number => {
  const statusDist = person.statusDistributions?.find(s => s.taskStatus === status)
  return statusDist ? statusDist.taskCount : 0
}

// 获取状态对应的标签类型
const getStatusTagType = (status: number): string => {
  switch (status) {
    case 0: return 'warning'  // 未完成 - 橙色
    case 1: return 'primary'  // 正在做 - 蓝色
    case 2: return 'success'  // 已完成 - 绿色
    default: return 'info'    // 其他状态 - 灰色
  }
}

const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return '#67C23A'
  if (percentage >= 60) return '#E6A23C'
  if (percentage >= 40) return '#F56C6C'
  return '#909399'
}

const getProgressClass = (percentage: number) => {
  if (percentage >= 80) return 'high'
  if (percentage >= 60) return 'medium'
  if (percentage >= 40) return 'low'
  return 'very-low'
}

const getStatusClass = (status: number) => {
  switch (status) {
    case 0: return 'pending'
    case 1: return 'progress'
    case 2: return 'completed'
    default: return 'other'
  }
}

// 生命周期
onMounted(async () => {
  // 设置默认时间范围为当前月份
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

  queryParams.beginTime = formatDateTime(firstDayOfMonth)
  queryParams.endTime = formatDateTime(lastDayOfMonth)
  dateRange.value = [firstDayOfMonth, lastDayOfMonth]

  // 初始化时加载所有用户选项
  try {
    const allUsers = await NotebookStatisticsApi.getTaskPersonOptions('')
    personOptions.value = allUsers || []
  } catch (error) {
    console.error('初始化用户选项失败:', error)
  }

  getStatistics()
})
</script>

<style lang="scss" scoped>
.notebook-statistics {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 12px;
  margin-top: 20px;

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
          color: #6366f1;
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
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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
          .metric-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;

            .metric-item {
              display: flex;
              flex-direction: column;
              align-items: center;

              .metric-label {
                font-size: 12px;
                color: #7f8c8d;
                margin-bottom: 4px;
              }

              .metric-value {
                font-size: 18px;
                font-weight: 600;
                color: #2c3e50;
              }
            }
          }

          .metric-large {
            display: flex;
            align-items: baseline;
            justify-content: center;
            gap: 8px;

            .metric-value {
              font-size: 28px;
              font-weight: 700;
              color: #2c3e50;
            }

            .metric-percentage {
              font-size: 14px;
              font-weight: 500;
              color: #7f8c8d;
            }
          }
        }

        &.total-card .card-icon {
          color: #6366f1;
        }

        &.pending-card .card-icon {
          color: #f59e0b;
        }

        &.progress-card .card-icon {
          color: #3b82f6;
        }

        &.completed-card .card-icon {
          color: #10b981;
        }

        &.other-card .card-icon {
          color: #8b5cf6;
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
      :deep(.person-cell) {
        display: flex;
        align-items: center;

        .person-icon {
          margin-right: 8px;
          color: #6366f1;
        }

        .person-name {
          font-weight: 500;
        }
      }

      :deep(.completion-rate) {
        display: flex;
        align-items: center;

        .rate-text {
          font-weight: 600;
          font-size: 12px;

          &.high {
            color: #67C23A;
          }

          &.medium {
            color: #E6A23C;
          }

          &.low {
            color: #F56C6C;
          }

          &.very-low {
            color: #909399;
          }
        }
      }

      .status-distribution {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .status-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;

          .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;

            &.pending {
              background-color: #f59e0b;
            }

            &.progress {
              background-color: #3b82f6;
            }

            &.completed {
              background-color: #10b981;
            }

            &.other {
              background-color: #8b5cf6;
            }
          }

          .status-name {
            font-weight: 500;
            color: #374151;
          }

          .status-count {
            font-weight: 600;
            color: #1f2937;
          }

          .status-percentage {
            color: #6b7280;
          }
        }
      }
    }
  }
}
</style>
