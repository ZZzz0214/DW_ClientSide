import request from '@/config/axios';
export interface ErpWholesaleVO {
  id: number; // 编号
  no: string; // 订单号
  receiverName: string; // 收件人姓名
  receiverPhone: string; // 收件人电话
  receiverAddress: string; // 收件地址
  afterSalesStatus: string; // 售后状况
  afterSalesTime?: string; // 售后时间
  remark: string; // 备注信息
  productName: string; // 产品名称
  shippingCode: string; // 发货编码
  productQuantity: number; // 产品数量
  comboProductId: number; // 组品编号
  purchaser: string; // 采购人员
  supplier: string; // 供应商名
  purchasePrice: number; // 采购单价
  truckFee: number; // 货拉拉费
  logisticsFee: number; // 物流费用
  otherFees: number; // 其他费用
  totalPurchaseAmount: number; // 采购总额
  purchaseRemark:string; //采购备注信息
  saleRemark:string; //出货备注信息
  salePriceId: number; // 关联销售价格表
  salesperson: string; // 销售人员
  customerName: string; // 客户名称
  salePrice: number; // 出货单价
  saleTruckFee: number; // 销售货拉拉费
  saleLogisticsFee: number; // 销售物流费用
  saleOtherFees: number; // 销售其他费用
  totalSaleAmount: number; // 出货总额
  tenantId: number; // 租户编号
  items:[];
  saleItems:[];
}

// ERP 批发订单 API
export const ErpWholesaleApi = {
  // 查询批发分页
  getErpWholesalePage: async (params: any) => {
    return await request.get({ url: `/erp/wholesale/page`, params });
  },

  // 查询批发详情
  getErpWholesale: async (id: number) => {
    return await request.get({ url: `/erp/wholesale/get?id=${id}` });
  },

  // 新增批发
  createErpWholesale: async (data: ErpWholesaleVO) => {
    return await request.post({ url: `/erp/wholesale/create`, data });
  },

  // 修改批发
  updateErpWholesale: async (data: ErpWholesaleVO) => {
    return await request.put({ url: `/erp/wholesale/update`, data });
  },

  // 删除批发
  deleteErpWholesale: async (ids: number[]) => {
    return await request.delete({
      url: `/erp/wholesale/delete`,
      params: {
        ids: ids.join(','),
      },
    });
  },

  // 根据ID列表获取批发列表
  getErpWholesaleListByIds: async (ids: number[]) => {
    return await request.get({
      url: `/erp/wholesale/list-by-ids`,
      params: {
        ids: ids.join(','),
      },
    });
  },

  // // 导出批发列表 Excel
  // exportErpWholesale: async (params: any) => {
  //   return await request.download({ url: `/erp/wholesale/export-excel`, params });
  // },
};