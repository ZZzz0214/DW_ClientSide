import request from '@/config/axios'

// 组合产品VO
export interface ComboVO {
  id?: number; // 组品编号
  name: string; // 组合产品名称
  shortName?: string; // 产品简称（修改：改为驼峰命名）
  image?: string; // 产品图片
  shippingCode?: string; // 发货编码（修改：改为驼峰命名）
  weight?: number; // 产品重量（单位：kg）
  purchaser?: string; // 采购人员
  supplier?: string; // 供应商名
  purchasePrice?: number; // 采购单价（单位：元）（修改：改为驼峰命名）
  wholesalePrice?: number; // 批发单价（单位：元）（修改：改为驼峰命名）
  remark?: string; // 备注信息
  shippingFeeType?: number; // 运费类型（0：固定运费，1：按件计费，2：按重计费）（修改：改为驼峰命名）
  fixedShippingFee?: number; // 固定运费（单位：元）（修改：改为驼峰命名）
  firstItemQuantity?: number; // 首件数量（修改：改为驼峰命名）
  firstItemPrice?: number; // 首件价格（单位：元）（修改：改为驼峰命名）
  additionalItemQuantity?: number; // 续件数量（修改：改为驼峰命名）
  additionalItemPrice?: number; // 续件价格（单位：元）（修改：改为驼峰命名）
  firstWeight?: number; // 首重重量（单位：kg）（修改：改为驼峰命名）
  firstWeightPrice?: number; // 首重价格（单位：元）（修改：改为驼峰命名）
  additionalWeight?: number; // 续重重量（单位：kg）（修改：改为驼峰命名）
  additionalWeightPrice?: number; // 续重价格（单位：元）（修改：改为驼峰命名）
  totalQuantity: number; // 产品数量（组合产品中包含的单品总数）（修改：必填）
  creator?: string; // 创建者
  createTime?: Date; // 创建时间（修改：改为驼峰命名）
  updater?: string; // 更新者
  updateTime?: Date; // 更新时间（修改：改为驼峰命名）
  deleted?: boolean; // 是否删除
  tenantId?: number; // 租户编号（修改：改为驼峰命名）
  status: number; // 产品状态（修改：改为必填）
  items: ComboItem[]; // 关联的单品列表（新增：必填）
}

// 组合产品中的单品VO
export interface ComboItem {
  productId: number; // 单品编号（新增：必填）
  count: number; // 组_单数量关系（新增：必填）
}

// 组合产品 API
export const ComboApi = {
  // 查询组合产品分页
  getComboPage: async (params: any) => {
    return await request.get({ url: `/erp/combo/page`, params });
  },

  // 查询组合产品精简列表
  getComboSimpleList: async () => {
    return await request.get({ url: `/erp/combo/simple-list` });
  },

  // 查询组合产品详情
  getCombo: async (id: number) => {
    return await request.get({ url: `/erp/combo/get?id=${id}` });
  },

  // 新增组合产品
  createCombo: async (data: ComboVO) => {
    return await request.post({ url: `/erp/combo/create`, data });
  },

  // 修改组合产品
  updateCombo: async (data: ComboVO) => {
    return await request.put({ url: `/erp/combo/update`, data });
  },

  // 删除组合产品
  deleteCombo: async (id: number) => {
    return await request.delete({ url: `/erp/combo/delete?id=${id}` });
  },

  // 导出组合产品 Excel
  exportCombo: async (params: any) => {
    return await request.download({ url: `/erp/combo/export-excel`, params });
  },

  // 搜索结果
  searchCombos: async (params: any) => {
    return await request.get({ url: `/erp/combo/search`, params });
  }
};
