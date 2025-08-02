import request from '@/config/axios'

// // ERP 销售订单 VO
// export interface SaleOrderVO {
//   id: number // 订单工单编号
//   no: string // 销售订单号
//   customerId: number // 客户编号
//   orderTime: Date // 订单时间
//   totalCount: number // 合计数量
//   totalPrice: number // 合计金额，单位：元
//   status: number // 状态
//   remark: string // 备注
//   outCount: number // 销售出库数量
//   returnCount: number // 销售退货数量
// }

// ERP 销售订单 VO
export interface SaleOrderVO {
  id?: number // 订单工单编号
  no?: string // 销售订单号
  orderNumber?: string // 订单号
  customerId?: number // 客户编号
  status?: number // 销售状态
  accountId?: number // 结算账户编号
  saleUserId?: number // 销售员编号
  orderTime?: Date // 下单时间
  logisticsCompany?: string // 物流公司
  logisticsNumber?: string // 物流单号
  consigneeName?: string // 收件姓名
  contactNumber?: string // 联系电话
  detailedAddress?: string // 详细地址
  afterSaleStatus?: string // 售后状况
  remark?: string // 备注信息
  totalCount?: number // 合计数量
  totalPrice?: number // 合计价格，单位：元
  totalProductPrice?: number // 合计产品价格，单位：元
  totalTaxPrice?: number // 合计税额，单位：元
  discountPercent?: number // 优惠率，百分比
  discountPrice?: number // 优惠金额，单位：元
  depositPrice?: number // 定金金额，单位：元
  totalShippingFee?: number // 出货运费合计
  totalOtherFees?: number // 其他费用合计
  totalSaleAmount?: number // 销售总额（合计）
  fileUrl?: string // 附件地址
  outCount?: number // 销售出库数量
  returnCount?: number // 销售退货数量
  items?: SaleOrderItemVO[] // 订单项列表
}

// 订单项 VO
export interface SaleOrderItemVO {
  id?: number // 订单项编号
  orderId?: number // 销售订单编号
  groupProductId?: number // 组品编号
  productName?: string // 产品名称
  customerName?: string // 客户名称
  salesPerson?: string // 销售人员
  originalProduct?: string // 原表商品
  originalSpecification?: string // 原表规格
  originalQuantity?: number // 原表数量
  shippingCode: string; // 发货编码
  productQuantity?: number // 产品数量
  shippingFee?: number // 出货运费
  otherFees?: number // 其他费用
  shippingTotal?: number // 出货总额
  productId?: number // 产品编号
  productUnitId?: number // 产品单位单位
  productPrice?: number // 产品单价（出货单价）
  count?: number // 数量
  totalPrice?: number // 总价
  taxPercent?: number // 税率，百分比
  taxPrice?: number // 税额，单位：元
  remark?: string // 备注
  outCount?: number // 销售出库数量
  returnCount?: number // 销售退货数量
}
// ERP 销售订单 API
export const SaleOrderApi = {
  // 查询销售订单分页
  getSaleOrderUnreviewedPage: async (params: any) => {
    return await request.get({ url: `/erp/distribution/sale/unreviewed-page`, params })
  },
  getSaleOrderReviewedPage: async (params: any) => {
    return await request.get({ url: `/erp/distribution/sale/reviewed-page`, params })
  },

  // 获取已审核销售订单合计
  getSaleOrderReviewedSummary: async (params: any) => {
    return await request.get({ url: `/erp/distribution/sale/reviewed-summary`, params })
  },

  // 查询销售订单详情
  getSaleOrder: async (id: number) => {
    return await request.get({ url: `/erp/sale-order/get?id=` + id })
  },

  // 新增销售订单
  createSaleOrder: async (data: SaleOrderVO) => {
    return await request.post({ url: `/erp/sale-order/create`, data })
  },

  // 修改销售订单
  updateSaleOrder: async (data: SaleOrderVO) => {
    return await request.put({ url: `/erp/sale-order/update`, data })
  },

  // 更新销售订单的状态
  updateSaleOrderStatus: async (id: number, status: number) => {
    return await request.put({
      url: `/erp/sale-order/update-status`,
      params: {
        id,
        status
      }
    })
  },

  // 删除销售订单
  deleteSaleOrder: async (ids: number[]) => {
    return await request.delete({
      url: `/erp/sale-order/delete`,
      params: {
        ids: ids.join(',')
      }
    })
  },

  // 导出销售订单 Excel
  exportSaleOrder: async (params: any) => {
    return await request.download({ url: `/erp/distribution/export-sale-audit-excel`, params })
  },

  exportSaleOrder2: async (params: any) => {
    return await request.download({ url: `/erp/distribution/export-reviewed-sale-excel`, params })
  },

  // 导入销售订单模板
  importSaleOrderTemplate: async () => {
    return await request.download({
      url: `/erp/distribution/sale/get-import-template`
    })
  },

  // 批量更新销售审核状态
  batchUpdateSaleAuditStatus: async (ids: number[], saleAuditStatus: number) => {
    return await request.put({
      url: `/erp/distribution/batch-update-sale-audit-status`,
      params: {
        ids: ids.join(','),
        saleAuditStatus
      }
    })
  },

  // 批量更新销售售后状态
  batchUpdateSaleAfterSales: async (ids: number[], saleAfterSalesStatus: number) => {
    return await request.put({
      url: `/erp/distribution/batch-update-sale-after-sales`,
      params: {
        ids: ids.join(','),
        saleAfterSalesStatus
      }
    })
  }
}
