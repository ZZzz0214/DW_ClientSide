import request from '@/config/axios';

// ERP 销售人员 VO
export interface SalespersonVO {
  id: number; // 编号
  salespersonName: string; // 销售人员姓名
  receiverName: string; // 收件姓名
  contactPhone: string; // 联系电话
  address: string; // 详细地址
  wechatAccount?: string; // 微信账号
  alipayAccount?: string; // 支付宝账号
  bankAccount?: string; // 银行账号
  remark?: string; //备注信息
}

// ERP 销售人员 API
export const ErpSalespersonApi = {
  // 创建销售人员
  createSalesperson: async (data: SalespersonVO) => {
    return await request.post({ url: `/erp/salesperson/create`, data });
  },

  // 更新销售人员
  updateSalesperson: async (data: SalespersonVO) => {
    return await request.put({ url: `/erp/salesperson/update`, data });
  },

  // 删除销售人员
  deleteSalesperson: async (ids: number[]) => {
    return await request.delete({ url: `/erp/salesperson/delete`, params: { ids } });
  },

  // 获取销售人员详情
  getSalesperson: async (id: number) => {
    return await request.get({ url: `/erp/salesperson/get`, params: { id } });
  },

  // 获取销售人员分页
  getSalespersonPage: async (params: SalespersonVO) => {
    return await request.get({ url: `/erp/salesperson/page`, params });
  },

  // 根据ID列表获取销售人员列表
  getSalespersonListByIds: async (ids: number[]) => {
    return await request.get({ url: `/erp/salesperson/list-by-ids`, params: { ids } });
  },
};