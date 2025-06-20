import request from '@/config/axios'


export interface ErpDistributionVO {
  id: number; // 编号
  no: string; // 订单编号
  orderNumber: string; // 订单号
  logisticsCompany: string; // 物流公司
  trackingNumber: string; // 物流单号
  receiverName: string; // 收件姓名
  receiverPhone: string; // 收件电话
  receiverAddress: string; // 收件地址
  originalProductName: string; // 原表商品名称
  originalStandard: string; // 原表规格
  originalQuantity: number; // 原表数量

  afterSalesStatus: string; //售后状况
  afterSalesTime?: string; // 售后时间
  remark: string; //备注信息
  shippingCode: string; //发货编码
  comboProductNo: string; // 组品编号

  productSpecification:string; //产品规格
  productName: string; // 产品名称
  productQuantity: number; // 产品数量
  purchaser: string; // 采购人员
  supplier: string; // 供应商名
  purchasePrice: number; // 采购单价
  shippingFee: number; // 采购运费
  otherFees: number; // 采购其他费用
  totalPurchaseAmount: number; // 采购总额
  purchaseRemark:string; //采购备注信息
  saleRemark:string; //出货备注信息
  comboProductId: number; // 关联组品表(也是组品编号)
  salesperson: string; // 销售人员
  customerName: string; // 客户名称
  transferPerson: string; // 中转人员
  salePrice: number; // 出货单价
  saleShippingFee: number; // 出货运费
  saleOtherFees: number; // 销售其他费用
  totalSaleAmount: number; // 出货总额
  salePriceId: number; // 关联销售价格表
  tenantId: number; // 租户编号
  creator: string; // 创建人员
  createTime: string; // 创建时间
  items:[];
  saleItems:[];
}

// ERP 代发订单 API
export const ErpDistributionApi = {
  // 查询代发分页
  getErpDistributionPage: async (params: any) => {
    return await request.get({ url: `/erp/distribution/page`, params });
  },

  // 查询代发详情
  getErpDistribution: async (id: number) => {
    return await request.get({ url: `/erp/distribution/get?id=${id}` });
  },

  // 新增代发
  createErpDistribution: async (data: ErpDistributionVO) => {
    return await request.post({ url: `/erp/distribution/create`, data });
  },

  // 修改代发
  updateErpDistribution: async (data: ErpDistributionVO) => {
    return await request.put({ url: `/erp/distribution/update`, data });
  },

  // 删除代发
  deleteErpDistribution: async (ids: number[]) => {
    return await request.delete({
      url: `/erp/distribution/delete`,
      params: {
        ids: ids.join(','),
      },
    });
  },

  // 根据ID列表获取代发列表
  getErpDistributionListByIds: async (ids: number[]) => {
    return await request.get({
      url: `/erp/distribution/list-by-ids`,
      params: {
        ids: ids.join(','),
      },
    });
  },

  // 导出代发列表 Excel
  exportErpDistribution: async (params: any) => {
    return await request.download({ url: `/erp/distribution/export-excel`, params })
  },

  // 导出代发基础信息 Excel
  exportBasicExcel: async (params: any) => {
    return await request.download({ url: `/erp/distribution/export-basic-excel`, params })
  },

  // 导出代发采购信息 Excel
  exportPurchaseExcel: async (params: any) => {
    return await request.download({ url: `/erp/distribution/export-purchase-excel`, params })
  },

  // 导出代发出货信息 Excel
  exportSaleExcel: async (params: any) => {
    return await request.download({ url: `/erp/distribution/export-sale-excel`, params })
  },

  // 导出代发发货信息 Excel
  exportShipExcel: async (params: any) => {
    return await request.download({ url: `/erp/distribution/export-ship-excel`, params })
  },

  importDistributionTemplate: async () => {
    return await request.download({ url: `/erp/distribution/get-import-template` });
  },

};
