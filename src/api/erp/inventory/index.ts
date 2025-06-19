import request from '@/config/axios'

// ERP 库存 VO
export interface InventoryVO {
  id?: number // 库存编号
  no?: string // 库存编号
  productId?: number // 单品ID
  productNo?: string // 产品编号
  productImage?: string // 产品图片
  productName?: string // 产品名称
  productShortName?: string // 产品简称
  brand?: string // 品牌名称
  category?: string // 产品品类
  spotInventory?: number // 现货库存
  remainingInventory?: number // 剩余库存
  remark?: string // 备注信息
  creator?: string // 创建人员
  createTime?: Date // 创建时间
}

// ERP 库存保存 Request VO
export interface InventorySaveReqVO {
  id?: number // 库存ID
  no?: string // 库存编号
  productId: number // 单品ID
  productNo?: string // 产品编号
  productName?: string // 产品名称
  productShortName?: string // 产品简称
  brand?: string // 品牌名称
  category?: string // 产品品类
  spotInventory: number // 现货库存
  remainingInventory: number // 剩余库存
  remark?: string // 备注信息
}

// ERP 库存分页 Request VO
export interface InventoryPageReqVO {
  no?: string // 库存编号
  productId?: number // 单品ID
  productNo?: string // 产品编号
  productName?: string // 产品名称
  productShortName?: string // 产品简称
  brand?: string // 品牌名称
  category?: string // 产品品类
  spotInventory?: number // 现货库存
  remainingInventory?: number // 剩余库存
  creator?: string // 创建人员
  createTime?: Date[] // 创建时间
}

// ERP 库存 API
export const InventoryApi = {
  // 查询库存分页
  getInventoryPage: async (params: InventoryPageReqVO) => {
    return await request.get({ url: `/erp/inventory/page`, params })
  },

  // 查询库存详情
  getInventory: async (id: number) => {
    return await request.get({ url: `/erp/inventory/get?id=` + id })
  },

  // 新增库存
  createInventory: async (data: InventorySaveReqVO) => {
    return await request.post({ url: `/erp/inventory/create`, data })
  },

  // 修改库存
  updateInventory: async (data: InventorySaveReqVO) => {
    return await request.put({ url: `/erp/inventory/update`, data })
  },

  // 删除库存
  deleteInventory: async (ids: number[]) => {
    return await request.delete({ url: `/erp/inventory/delete`, params: { ids: ids.join(',') } })
  },

  // 根据ID列表获取库存列表
  getInventoryListByIds: async (ids: number[]) => {
    return await request.get({ url: `/erp/inventory/list-by-ids`, params: { ids } })
  },

  // 导出库存 Excel
  exportInventory: async (params: InventoryPageReqVO) => {
    return await request.download({ url: `/erp/inventory/export-excel`, params })
  },

  // 获取库存导入模板
  importInventoryTemplate: async () => {
    return await request.download({ url: `/erp/inventory/get-import-template` })
  },

  // 导入库存
  // importInventory: async (file: File, updateSupport: boolean) => {
  //   const formData = new FormData()
  //   formData.append('file', file)
  //   formData.append('updateSupport', String(updateSupport))
  //   return await request.post({ url: `/erp/inventory/import`, data: formData })
  // }
}
