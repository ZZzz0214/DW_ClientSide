import request from '@/config/axios'

// ERP 中转销售 VO
export interface TransitSaleVO {
  id: number; // 中转销售编号
  no: string; // 编号
  groupProductId: number; // 组品编号
  transitPerson: string; // 中转人员
  distributionPrice: number; // 代发单价（单位：元）
  wholesalePrice: number; // 批发单价（单位：元）
  remark?: string; // 备注信息
  shippingFeeType?: number; // 运费类型（0：固定运费，1：按件计费，2：按重计费）
  fixedShippingFee?: number; // 固定运费（单位：元）
  firstItemQuantity?: number; // 首件数量
  firstItemPrice?: number; // 首件价格（单位：元）
  additionalItemQuantity?: number; // 续件数量
  additionalItemPrice?: number; // 续件价格（单位：元）
  firstWeight?: number; // 首重重量（单位：kg）
  firstWeightPrice?: number; // 首重价格（单位：元）
  additionalWeight?: number; // 续重重量（单位：kg）
  additionalWeightPrice?: number; // 续重价格（单位：元）
  createTime?: Date; // 创建时间
}

// ERP 中转销售 API
export const TransitSaleApi = {
  // 查询中转销售分页
  getTransitSalePage: async (params: any) => {
    return await request.get({ url: `/erp/transit-sale/page`, params })
  },

  // 查询中转销售详情
  getTransitSale: async (id: number) => {
    return await request.get({ url: `/erp/transit-sale/get?id=${id}` })
  },

  // 新增中转销售
  createTransitSale: async (data: TransitSaleVO) => {
    return await request.post({ url: `/erp/transit-sale/create`, data })
  },

  // 修改中转销售
  updateTransitSale: async (data: TransitSaleVO) => {
    return await request.put({ url: `/erp/transit-sale/update`, data })
  },

  // 删除中转销售
  deleteTransitSale: async (ids: number[]) => {
    return await request.delete({
      url: `/erp/transit-sale/delete`,
      params: {
        ids: ids.join(',')
      }
    })
  },

  // 导出中转销售 Excel
  exportTransitSale: async (params: any) => {
    return await request.download({ url: `/erp/transit-sale/export-excel`, params })
  },

  // 导入中转销售
  importTransitSale: async (data: FormData) => {
    return await request.upload({ url: `/erp/transit-sale/import`, data })
  },
  importTransitSaleTemplate: async () => {
    return await request.download({ url: `/erp/transit-sale/get-import-template` });
  },
}
