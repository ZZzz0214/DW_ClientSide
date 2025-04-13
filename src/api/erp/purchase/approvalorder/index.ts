import request from '@/config/axios'

// ERP 采购订单 VO
// export interface PurchaseOrderVO {
//   id: number // 订单工单编号
//   no: string // 采购订单号
//   customerId: number // 客户编号
//   orderTime: Date // 订单时间
//   totalCount: number // 合计数量
//   totalPrice: number // 合计金额，单位：元
//   status: number // 状态
//   remark: string // 备注
//   outCount: number // 采购出库数量
//   returnCount: number // 采购退货数量
// }
export interface PurchaseOrderVO {
  id: number; // 订单工单编号
  no: string; // 采购订单号
  customerId: number; // 客户编号
  orderTime: Date; // 订单时间
  totalCount: number; // 合计数量
  totalPrice: number; // 合计金额，单位：元
  status: number; // 状态
  remark: string; // 备注
  outCount: number; // 采购出库数量
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
  shippingFee: number; // 采购运费
  otherFees: number; // 其他费用
  totalPurchaseAmount: number; // 采购总额
  totalPrice: number; // 总价
  productUnitId: number; // 产品单位编号
  count: number; // 数量
  taxPercent: number; // 税率，百分比
  taxPrice: number; // 税额，单位：元
  remark: string; // 备注
  inCount: number; // 采购入库数量
  returnCount: number; // 采购退货数量
  deleted: boolean; // 是否删除
  tenantId: number; // 租户编号
}
// ERP 采购订单 API
export const PurchaseOrderApi = {
  // 查询采购订单分页
  getPurchaseOrderPage: async (params: any) => {
    return await request.get({ url: `/erp/purchase-order/page2`, params })
  },

  // 查询采购订单详情
  getPurchaseOrder: async (id: number) => {
    return await request.get({ url: `/erp/purchase-order/get?id=` + id })
  },

  // 新增采购订单
  createPurchaseOrder: async (data: PurchaseOrderVO) => {
    return await request.post({ url: `/erp/purchase-order/create`, data })
  },

  // 修改采购订单
  updatePurchaseOrder: async (data: PurchaseOrderVO) => {
    return await request.put({ url: `/erp/purchase-order/update`, data })
  },

  // 更新采购订单的状态
  updatePurchaseOrderStatus: async (id: number, status: number) => {
    return await request.put({
      url: `/erp/purchase-order/update-status`,
      params: {
        id,
        status
      }
    })
  },

  // 删除采购订单
  deletePurchaseOrder: async (ids: number[]) => {
    return await request.delete({
      url: `/erp/purchase-order/delete`,
      params: {
        ids: ids.join(',')
      }
    })
  },

  // 导出采购订单 Excel
  exportPurchaseOrder: async (params: any) => {
    return await request.download({ url: `/erp/purchase-order/export-excel`, params })
  }
}
