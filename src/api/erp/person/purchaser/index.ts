import request from '@/config/axios';

// ERP 采购人员 VO
export interface PurchaserVO {
  id: number; // 编号
  purchaserName: string; // 采购人员姓名
  receiverName: string; // 收件姓名
  contactPhone: string; // 联系电话
  address: string; // 详细地址
  wechatAccount?: string; // 微信账号
  alipayAccount?: string; // 支付宝账号
  bankAccount?: string; // 银行账号
  remark?: string; //备注信息
}

// ERP 采购人员 API
export const PurchaserApi = {
  // 查询采购人员分页
  getPurchaserPage: async (params: any) => {
    return await request.get({ url: `/erp/purchaser/page`, params });
  },

  // 查询采购人员详情
  getPurchaser: async (id: number) => {
    return await request.get({ url: `/erp/purchaser/get`, params: { id } });
  },

  // 新增采购人员
  createPurchaser: async (data: PurchaserVO) => {
    return await request.post({ url: `/erp/purchaser/create`, data });
  },

  // 修改采购人员
  updatePurchaser: async (data: PurchaserVO) => {
    return await request.put({ url: `/erp/purchaser/update`, data });
  },

  // 删除采购人员
  deletePurchaser: async (ids: number[]) => {
    return await request.delete({ url: `/erp/purchaser/delete`, params: { ids } });
  },

  // 根据ID列表获得采购人员列表
  getPurchaserListByIds: async (ids: number[]) => {
    return await request.delete({ url: `/erp/purchaser/list-by-ids`, params: { ids } });
  },

  // // 导出采购人员 Excel
  // exportPurchaser: async (params: any) => {
  //   return await request.download({ url: `/erp/purchaser/export-excel`, params });
  // },
  //
  // 搜索采购人员
  searchPurchaser: async (params: any) => {
    return await request.get({ url: `/erp/purchaser/search`, params });
  }
};