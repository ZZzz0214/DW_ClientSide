import request from '@/config/axios';

// 组品分类 VO
export interface ComboCategoryVO {
  id: number; // 分类编号
  parentId: number; // 父分类编号
  name: string; // 分类名称
  code: string; // 分类编码
  sort: number; // 分类排序
  status: number; // 开启状态
}

// 组品分类 API
export const ComboCategoryApi = {
  // 查询组品分类列表
  getComboCategoryList: async () => {
    return await request.get({ url: `/erp/combo-category/list` });
  },

  // 查询组品分类精简列表
  getComboCategorySimpleList: async () => {
    return await request.get({ url: `/erp/combo-category/simple-list` });
  },

  // 查询组品分类详情
  getComboCategory: async (id: number) => {
    return await request.get({ url: `/erp/combo-category/get?id=${id}` });
  },

  // 新增组品分类
  createComboCategory: async (data: ComboCategoryVO) => {
    return await request.post({ url: `/erp/combo-category/create`, data });
  },

  // 修改组品分类
  updateComboCategory: async (data: ComboCategoryVO) => {
    return await request.put({ url: `/erp/combo-category/update`, data });
  },

  // 删除组品分类
  deleteComboCategory: async (id: number) => {
    return await request.delete({ url: `/erp/combo-category/delete?id=${id}` });
  },

  // 导出组品分类 Excel
  exportComboCategory: async (params) => {
    return await request.download({ url: `/erp/combo-category/export-excel`, params });
  }
};