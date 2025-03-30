import request from '@/config/axios'

// 组合产品VO
export interface ComboVO {
  id: number; // 组品编号
  name: string; // 组合产品名称
  short_name?: string; // 产品简称
  image?: string; // 产品图片
  shipping_code?: string; // 发货编码
  weight?: number; // 产品重量（单位：kg）
  purchaser?: string; // 采购人员
  supplier?: string; // 供应商名
  purchase_price?: number; // 采购单价（单位：元）
  wholesale_price?: number; // 批发单价（单位：元）
  remark?: string; // 备注信息
  shipping_fee_type?: number; // 运费类型（0：固定运费，1：按件计费，2：按重计费）
  fixed_shipping_fee?: number; // 固定运费（单位：元）
  first_item_quantity?: number; // 首件数量
  first_item_price?: number; // 首件价格（单位：元）
  additional_item_quantity?: number; // 续件数量
  additional_item_price?: number; // 续件价格（单位：元）
  first_weight?: number; // 首重重量（单位：kg）
  first_weight_price?: number; // 首重价格（单位：元）
  additional_weight?: number; // 续重重量（单位：kg）
  additional_weight_price?: number; // 续重价格（单位：元）
  total_quantity?: number; // 产品数量（组合产品中包含的单品总数）
  creator?: string; // 创建者
  create_time?: Date; // 创建时间
  updater?: string; // 更新者
  update_time?: Date; // 更新时间
  deleted?: boolean; // 是否删除
  tenant_id?: number; // 租户编号
  status: number; // 产品状态
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
  }
};
