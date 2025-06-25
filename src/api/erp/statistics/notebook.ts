import request from '@/config/axios'

// ERP 记事本统计 Request VO
export interface ErpNotebookStatisticsReqVO {
  taskPerson?: string // 任务人员
  beginTime?: string // 开始时间
  endTime?: string // 结束时间
}

// 总体统计
export interface TotalStatistics {
  totalTaskCount: number // 总任务数
  pendingTaskCount: number // 未完成任务数
  inProgressTaskCount: number // 正在做任务数
  completedTaskCount: number // 已完成任务数
  totalPersonCount: number // 总人员数
}

// 状态分布
export interface StatusDistribution {
  taskStatus: number // 任务状态
  statusName: string // 状态名称
  taskCount: number // 任务数量
  percentage: number // 占比
}

// 人员统计
export interface PersonStatistics {
  taskPerson: string // 任务人员
  totalTaskCount: number // 总任务数
  pendingTaskCount: number // 未完成任务数
  inProgressTaskCount: number // 正在做任务数
  completedTaskCount: number // 已完成任务数
  completionRate: number // 完成率
  statusDistributions: StatusDistribution[] // 状态分布
}

// 任务人员选项
export interface TaskPersonOption {
  value: string // 字典值
  label: string // 字典标签
}

// ERP 记事本统计 Response VO
export interface ErpNotebookStatisticsRespVO {
  totalStatistics: TotalStatistics // 总体统计
  personStatisticsList: PersonStatistics[] // 人员统计列表
}

// ERP 记事本统计 API
export const NotebookStatisticsApi = {
  // 获得记事本统计
  getNotebookStatistics: async (params: ErpNotebookStatisticsReqVO) => {
    return await request.get({ url: `/erp/statistics/notebook/get`, params })
  },

  // 获得任务人员列表
  getTaskPersonList: async (keyword?: string) => {
    return await request.get({ url: `/erp/statistics/notebook/get-task-person-list`, params: { keyword } })
  },

  // 获得任务人员选项列表
  getTaskPersonOptions: async (keyword?: string) => {
    return await request.get({ url: `/erp/statistics/notebook/get-task-person-options`, params: { keyword } })
  }
} 