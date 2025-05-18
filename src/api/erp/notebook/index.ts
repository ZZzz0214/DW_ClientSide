import request from '@/config/axios'

// ERP 记事本 VO
export interface NotebookVO {
  id?: number // 记事本编号
  no?: string // 编号
  carouselImage?: string // 轮播图片
  taskName?: string // 任务名称
  taskStatus?: number // 任务状态
  taskPerson?: string // 任务人员
  remark?: string // 备注信息
  createTime?: Date // 创建时间
}

// ERP 记事本保存 Request VO
export interface NotebookSaveReqVO {
  id?: number // 记事本编号
  no: string // 编号
  carouselImage?: string // 轮播图片
  taskName: string // 任务名称
  taskStatus: number // 任务状态
  taskPerson: string // 任务人员
  remark?: string // 备注信息
}

// ERP 记事本分页 Request VO
export interface NotebookPageReqVO {
  no?: string // 编号
  taskName?: string // 任务名称
  taskStatus?: number // 任务状态
  taskPerson?: string // 任务人员
  createTime?: Date[] // 创建时间
}

// ERP 记事本 API
export const NotebookApi = {
  // 查询记事本分页
  getNotebookPage: async (params: NotebookPageReqVO) => {
    return await request.get({ url: `/erp/notebook/page`, params })
  },

  // 查询记事本详情
  getNotebook: async (id: number) => {
    return await request.get({ url: `/erp/notebook/get?id=` + id })
  },

  // 新增记事本
  createNotebook: async (data: NotebookSaveReqVO) => {
    return await request.post({ url: `/erp/notebook/create`, data })
  },

  // 修改记事本
  updateNotebook: async (data: NotebookSaveReqVO) => {
    return await request.put({ url: `/erp/notebook/update`, data })
  },

  // 删除记事本
  deleteNotebook: async (ids: number[]) => {
    return await request.delete({ url: `/erp/notebook/delete`, params: { ids: ids.join(',') } })
  },

  // 根据ID列表获取记事本列表
  getNotebookListByIds: async (ids: number[]) => {
    return await request.get({ url: `/erp/notebook/list-by-ids`, params: { ids } })
  },

  // 导出记事本 Excel
  exportNotebook: async (params: NotebookPageReqVO) => {
    return await request.download({ url: `/erp/notebook/export-excel`, params })
  }
}
