import request from '@/config/axios'


export interface PurchaseOrderVO {
  id: number; // 订单工单编号
  no: string; // 采购订单号
  customerId: number; // 客户编号（后端对应 supplierId）
  orderTime: Date; // 订单时间
  totalCount: number; // 合计数量
  totalPrice: number; // 合计金额，单位：元
  status: number; // 状态
  remark: string; // 备注
  outCount: number; // 采购出库数量（后端对应 inCount）
  returnCount: number; // 采购退货数量
  logisticsCompany: string; // 物流公司
  trackingNumber: string; // 物流单号
  receiverName: string; // 收件姓名
  receiverPhone: string; // 联系电话
  receiverAddress: string; // 详细地址
  totalProductPrice: number; // 合计产品价格
  totalTaxPrice: number; // 合计税额
  discountPercent: number; // 优惠率，百分比
  discountPrice: number; // 优惠金额，单位：元
  shippingFee: number; // 采购运费
  otherFees: number; // 其他费用
  totalPurchaseAmount: number; // 采购总额
  items: PurchaseOrderItemVO[]; // 订单清单列表
  fileUrl: string; // 附件地址（新增字段）
  purchaser: string; // 采购人员（新增字段）
  depositPrice: number; // 定金金额（新增字段）
}

export interface PurchaseOrderItemVO {
  id: number; // 订单项编号
  orderId: number; // 采购订单编号
  type: number; // 产品类型：0-单品，1-组合产品
  productId: number; // 产品编号
  comboProductId: number; // 组品编号
  originalProductName: string; // 原表商品名称
  originalStandard: string; // 原表规格
  originalQuantity: number; // 原表数量
  afterSalesStatus: number; // 售后状况
  shippingCode: string; // 发货编码
  productQuantity: number; // 产品数量
  purchasePrice: number; // 采购单价
  logisticsFee: number; // 物流费用（新增字段）
  hulalaFee: number; // 货拉拉费用（新增字段）
  otherFees: number; // 其他费用
  totalPurchaseAmount: number; // 采购总额
  totalPrice: number; // 总价
  productUnitId: number; // 产品单位编号
  count: number; // 数量
  taxPercent: number; // 税率，百分比
  taxPrice: number; // 税额，单位：元
  remark: string; // 备注
  inCount: number; // 采购入库数量（新增字段）
  returnCount: number; // 采购退货数量（新增字段）
  purchaser: string; // 采购人员（新增字段）
}
// ... 其他代码 ...

// 批发采购售后信息更新请求VO
export interface ErpWholesalePurchaseAfterSalesUpdateReqVO {
  id: number; // 编号
  purchaseAfterSalesStatus?: number; // 采购售后状态
  purchaseAfterSalesSituation?: string; // 采购售后情况
  purchaseAfterSalesAmount?: number; // 采购售后金额
  purchaseAfterSalesTime?: string; // 采购售后时间
}

// 批发销售售后信息更新请求VO
export interface ErpWholesaleSaleAfterSalesUpdateReqVO {
  id: number; // 编号
  saleAfterSalesStatus?: number; // 销售售后状态
  saleAfterSalesSituation?: string; // 销售售后情况
  saleAfterSalesAmount?: number; // 销售售后金额
  saleAfterSalesTime?: string; // 销售售后时间
}

// ... 其他代码 ...

// ERP 采购订单 API
export const PurchaseOrderApi = {
  // 查询采购订单分页
  getPurchaseOrderPage: async (params: any) => {
    return await request.get({ url: `/erp/wholesale/purchase/unreviewed-page`, params })
  },
  getPurchaseReviewedOrderPage: async (params: any) => {
    return await request.get({ url: `/erp/wholesale/purchase/reviewed-page`, params })
  },


  // 查询采购订单详情
  getPurchaseOrder: async (id: number) => {
    return await request.get({ url: `/erp/wholesale/purchase/get?id=` + id })
  },

  // // 新增采购订单
  // createPurchaseOrder: async (data: PurchaseOrderVO) => {
  //   return await request.post({ url: `/erp/wholesale-purchase-order/create`, data })
  // },
  //
  // // 修改采购订单
  // updatePurchaseOrder: async (data: PurchaseOrderVO) => {
  //   return await request.put({ url: `/erp/wholesale-purchase-order/update`, data })
  // },

  // // 更新采购订单的状态
  // updatePurchaseOrderStatus: async (id: number, status: number) => {
  //   return await request.put({
  //     url: `/erp/wholesale-purchase-order/update-status`,
  //     params: {
  //       id,
  //       status
  //     }
  //   })
  // },
  // 更新采购订单的状态
  updatePurchaseOrderStatus: async (params: { id: number; purchaseAuditStatus: number; otherFees: number }) => {
    return await request.put({
      url: `/erp/wholesale/update-purchase-audit-status`, // 更新接口路径
      params // 使用 params 传递参数
    })
  },

  updateSaleOrderStatus: async (params: { id: number; saleAuditStatus: number; otherFees: number }) => {
    return await request.put({
      url: `/erp/wholesale/update-sale-audit-status`, // 更新接口路径
      params // 使用 params 传递参数
    })
  },
  // 更新采购售后信息（新增方法）
  updatePurchaseAfterSales: async (data: ErpWholesalePurchaseAfterSalesUpdateReqVO) => {
    return await request.put({
      url: `/erp/wholesale/update-purchase-after-sales`,
      data
    })
  },
  // 更新销售售后信息（新增方法）
  updateSalesAfterSales: async (data: ErpWholesaleSaleAfterSalesUpdateReqVO) => {
    return await request.put({
      url: `/erp/wholesale/update-sale-after-sales`,
      data
    })
  },
  //
  // // 删除采购订单
  // deletePurchaseOrder: async (ids: number[]) => {
  //   return await request.delete({
  //     url: `/erp/wholesale-purchase-order/delete`,
  //     params: {
  //       ids: ids.join(',')
  //     }
  //   })
  // },

  // 导出采购订单 Excel
  exportPurchaseOrder: async (params: any) => {
    return await request.download({ url: `/erp/wholesale-purchase-order/export-excel`, params })
  }
}
