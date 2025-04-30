import request from '@/config/axios'

// 销售价格表VO
export interface SalePriceVO {
  id?: number; // 编号
  groupProductId: number; // 组品编号
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
  tenantId?: number; // 租户编号
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
  //   return await request.get({ url: `/erp/sale-price/page`, params });
  // },

  // 查询销售价格表分页
  getSalePricePage: async (params: any) => {
    return await request.get({ url: `/erp/sale-price/page`, params });
  },

  // 获取销售价格精简列表
  getSalePriceSimpleList: async () => {
    return await request.get({ url: `/erp/sale-price/simple-list` });
  },

  // 查询销售价格表详情
  getSalePrice: async (id: number) => {
    return await request.get({ url: `/erp/sale-price/get?id=${id}` });
  },

  // 新增销售价格
  createSalePrice: async (data: SalePriceVO) => {
    return await request.post({ url: `/erp/sale-price/create`, data });
  },

  // 修改销售价格
  updateSalePrice: async (data: SalePriceVO) => {
    return await request.put({ url: `/erp/sale-price/update`, data });
  },


  // 删除销售价格
  deleteSalePrice: async (ids: number[]) => {
    return await request.delete({
      url: `/erp/sale-price/delete`,
      params: {
        ids: ids.join(',')
      }
    })
  },
  // // 导出销售价格表 Excel
  // exportSalePrice: async (params: SalePricePageReqVO) => {
  //   return await request.download({ url: `/erp/sale-price/export-excel`, params });
  // },
  // 导出销售价格表 Excel
  exportSalePrice: async (params: any) => {
    return await request.download({ url: `/erp/sale-price/export-excel`, params });
  },

  // 搜索结果
  searchSalePrice: async (params: any) => {
    return await request.get({ url: `/erp/sale-price/search`, params });
  }
};
