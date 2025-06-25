import request from '@/config/axios'

// 销售价格表VO
export interface SalePriceVO {
  id?: number; // 编号
  no?: string; // 业务编号
  groupProductId: number; // 组品编号
  groupProductNo?: string; // 组品编号
  productName?: string; // 产品名称
  productShortName?: string; // 产品简称
  customerName?: string; // 客户名称
  distributionPrice?: number; // 代发单价（单位：元）
  wholesalePrice?: number; // 批发单价（单位：元）
  remark?: string; // 备注信息
  shippingFeeType?: number; // 运费类型（0：固定运费，1：按件计费，2：按重计费）
  fixedShippingFee?: number; // 固定运费（单位：元）
  additionalItemQuantity?: number; // 按件数量
  additionalItemPrice?: number; // 按件价格（单位：元）
  firstWeight?: number; // 首重重量（单位：kg）
  firstWeightPrice?: number; // 首重价格（单位：元）
  additionalWeight?: number; // 续重重量（单位：kg）
  additionalWeightPrice?: number; // 续重价格（单位：元）
  comboList?: any[]; // 关联的组品列表
  tenantId?: number; // 租户编号
}

// 代发缺失价格VO
export interface DistributionMissingPriceVO {
  comboProductId: number; // 组品ID
  comboProductNo: string; // 组品编号
  productName: string; // 产品名称
  customerName: string; // 客户名称
  distributionPrice?: number; // 当前代发单价
  orderCount: number; // 订单数量
  totalProductQuantity: number; // 总产品数量
  orderNumbers: string[]; // 相关订单编号列表
  orderIds: number[]; // 相关订单ID列表
  earliestCreateTime: string; // 最早创建时间
  latestCreateTime: string; // 最晚创建时间
}

// 批发缺失价格VO
export interface WholesaleMissingPriceVO {
  comboProductId: number; // 组品ID
  comboProductNo: string; // 组品编号
  productName: string; // 产品名称
  customerName: string; // 客户名称
  wholesalePrice?: number; // 当前批发单价
  orderCount: number; // 订单数量
  totalProductQuantity: number; // 总产品数量
  orderNumbers: string[]; // 相关订单编号列表
  orderIds: number[]; // 相关订单ID列表
  earliestCreateTime: string; // 最早创建时间
  latestCreateTime: string; // 最晚创建时间
}

// 代发价格设置请求VO
export interface DistributionPriceSetReqVO {
  orderIds: number[]; // 订单ID列表
  groupProductId: number; // 组品ID
  customerName: string; // 客户名称
  distributionPrice: number; // 代发单价
}

// 批发价格设置请求VO
export interface WholesalePriceSetReqVO {
  orderIds: number[]; // 订单ID列表
  groupProductId: number; // 组品ID
  customerName: string; // 客户名称
  wholesalePrice: number; // 批发单价
}

// 统一缺失价格VO
export interface CombinedMissingPriceVO {
  comboProductId: number; // 组品ID
  comboProductNo: string; // 组品编号
  productName: string; // 产品名称
  customerName: string; // 客户名称
  currentDistributionPrice?: number; // 当前代发单价
  currentWholesalePrice?: number; // 当前批发单价
  distributionInfo?: {
    orderCount: number; // 订单数量
    totalProductQuantity: number; // 总产品数量
    orderNumbers: string[]; // 相关订单编号列表
    orderIds: number[]; // 相关订单ID列表
    earliestCreateTime: string; // 最早创建时间
    latestCreateTime: string; // 最晚创建时间
  };
  wholesaleInfo?: {
    orderCount: number; // 订单数量
    totalProductQuantity: number; // 总产品数量
    orderNumbers: string[]; // 相关订单编号列表
    orderIds: number[]; // 相关订单ID列表
    earliestCreateTime: string; // 最早创建时间
    latestCreateTime: string; // 最晚创建时间
  };
}

// 统一价格设置请求VO
export interface CombinedPriceSetReqVO {
  groupProductId: number; // 组品ID
  customerName: string; // 客户名称
  distributionPrice?: number; // 代发单价
  wholesalePrice?: number; // 批发单价
  shippingFeeType: number; // 运费类型（0：固定运费，1：按件计费，2：按重计费）
  fixedShippingFee?: number; // 固定运费
  additionalItemQuantity?: number; // 续件数量
  additionalItemPrice?: number; // 续件价格
  firstWeight?: number; // 首重重量
  firstWeightPrice?: number; // 首重价格
  additionalWeight?: number; // 续重重量
  additionalWeightPrice?: number; // 续重价格
}

// // 销售价格表分页请求VO
// export interface SalePricePageReqVO {
//   id?: number; // 编号
//   groupProductId?: number; // 组品编号
//   customerName?: string; // 客户名称
//   status?: number; // 状态
//   createTime?: string[]; // 创建时间范围
//   page?: number; // 当前页码
//   pageSize?: number; // 每页大小
// }
//
// // 销售价格表响应VO
// export interface SalePriceRespVO {
//   id: number; // 编号
//   groupProductId: number; // 组品编号
//   customerName: string; // 客户名称
//   distributionPrice: number; // 代发单价（单位：元）
//   wholesalePrice: number; // 批发单价（单位：元）
//   remark: string; // 备注信息
//   shippingFeeType: number; // 运费类型（0：固定运费，1：按件计费，2：按重计费）
//   fixedShippingFee: number; // 固定运费（单位：元）
//   firstItemQuantity: number; // 首件数量
//   firstItemPrice: number; // 首件价格（单位：元）
//   additionalItemQuantity: number; // 续件数量
//   additionalItemPrice: number; // 续件价格（单位：元）
//   firstWeight: number; // 首重重量（单位：kg）
//   firstWeightPrice: number; // 首重价格（单位：元）
//   additionalWeight: number; // 续重重量（单位：kg）
//   additionalWeightPrice: number; // 续重价格（单位：元）
//   tenantId: number; // 租户编号
//   creator: string; // 创建者
//   createTime: string; // 创建时间
//   updater: string; // 更新者
//   updateTime: string; // 更新时间
// }


  export interface SalePriceFormData {
    id?: number;
    groupProductId?: number; // 组品编号
    customerName?: string; // 客户名称
    distributionPrice?: number; // 代发单价
    wholesalePrice?: number; // 批发单价
    items: any[]; // 子表项
  }
// 销售价格表 API
export const SalePriceApi = {
  // // 查询销售价格表分页
  // getSalePricePage: async (params: SalePricePageReqVO) => {
  //   return await request.get({ url: `/erp/saleprice/page`, params });
  // },

  // 查询销售价格表分页
  getSalePricePage: async (params: any) => {
    return await request.get({ url: `/erp/saleprice/page`, params });
  },

  // 获取销售价格精简列表
  getSalePriceSimpleList: async () => {
    return await request.get({ url: `/erp/saleprice/simple-list` });
  },

  // 查询销售价格表详情
  getSalePrice: async (id: number) => {
    return await request.get({ url: `/erp/saleprice/get?id=${id}` });
  },

  // 新增销售价格
  createSalePrice: async (data: SalePriceVO) => {
    return await request.post({ url: `/erp/saleprice/create`, data });
  },

  // 修改销售价格
  updateSalePrice: async (data: SalePriceVO) => {
    return await request.put({ url: `/erp/saleprice/update`, data });
  },


  // 删除销售价格
  deleteSalePrice: async (ids: number[]) => {
    return await request.delete({
      url: `/erp/saleprice/delete`,
      params: {
        ids: ids.join(',')
      }
    })
  },

  // // 导出销售价格表 Excel
  // exportSalePrice: async (params: SalePricePageReqVO) => {
  //   return await request.download({ url: `/erp/saleprice/export-excel`, params });
  // },
  // 导出销售价格表 Excel
  exportSalePrice: async (params: any) => {
    return await request.download({ url: `/erp/saleprice/export-excel`, params });
  },

  // 搜索结果
  searchSalePrice: async (params: any) => {
    return await request.get({ url: `/erp/saleprice/search`, params });
  },

  // 获取缺失价格的销售记录
  getMissingPrices: async (params: any) => {
    return await request.get({ url: `/erp/saleprice/missing-prices`, params });
  },

  // 获取代发缺失价格记录
  getDistributionMissingPrices: async (params: any) => {
    return await request.get({ url: `/erp/saleprice/distribution-missing-prices`, params });
  },

  // 获取批发缺失价格记录
  getWholesaleMissingPrices: async (params: any) => {
    return await request.get({ url: `/erp/saleprice/wholesale-missing-prices`, params });
  },

  // 批量设置代发价格
  batchSetDistributionPrices: async (data: DistributionPriceSetReqVO[]) => {
    return await request.post({ url: `/erp/saleprice/batch-set-distribution-prices`, data });
  },

  // 批量设置批发价格
  batchSetWholesalePrices: async (data: WholesalePriceSetReqVO[]) => {
    return await request.post({ url: `/erp/saleprice/batch-set-wholesale-prices`, data });
  },

  // 获取统一缺失价格记录（代发+批发）
  getCombinedMissingPrices: async (params: any) => {
    return await request.get({ url: `/erp/saleprice/combined-missing-prices`, params });
  },

  // 批量设置统一价格（代发+批发）
  batchSetCombinedPrices: async (data: any[]) => {
    return await request.post({ url: `/erp/saleprice/batch-set-combined-prices`, data });
  }
};
