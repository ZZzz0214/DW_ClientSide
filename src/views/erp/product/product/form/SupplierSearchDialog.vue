<template>
  <Dialog v-model="dialogVisible" title="选择供应商" width="1200px"
          top="3vh"
          style="max-height: 94vh; z-index: 9999;"
          :destroy-on-close="true"
          class="supplier-dialog">
    <div class="dialog-content">
      <!-- 搜索表单区域 -->
      <div class="search-section">
        <div class="section-header">
          <Icon icon="ep:search" class="header-icon" />
          <span class="header-title">搜索条件</span>
        </div>
        <el-form :model="searchForm" label-width="90px" class="search-form">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="供应商编号">
                <el-input
                  v-model="searchForm.no"
                  placeholder="请输入供应商编号"
                  clearable
                  prefix-icon="ep:key"
                  @keyup.enter="handleSearch"
                  class="search-input"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商名称">
                <el-input
                  v-model="searchForm.name"
                  placeholder="请输入供应商名称"
                  clearable
                  prefix-icon="ep:office-building"
                  @keyup.enter="handleSearch"
                  class="search-input"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系方式">
                <el-input
                  v-model="searchForm.telephone"
                  placeholder="请输入联系方式"
                  clearable
                  prefix-icon="ep:phone"
                  @keyup.enter="handleSearch"
                  class="search-input"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系人">
                <el-input
                  v-model="searchForm.receiverName"
                  placeholder="请输入联系人"
                  clearable
                  prefix-icon="ep:user"
                  @keyup.enter="handleSearch"
                  class="search-input"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="地址">
                <el-input
                  v-model="searchForm.address"
                  placeholder="请输入地址"
                  clearable
                  prefix-icon="ep:location"
                  @keyup.enter="handleSearch"
                  class="search-input"
                />
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item class="search-buttons">
                <el-button type="primary" @click="handleSearch" :loading="loading" class="search-btn">
                  <Icon icon="ep:search" class="mr-1" />
                  查询
                </el-button>
                <el-button @click="resetSearch" class="reset-btn">
                  <Icon icon="ep:refresh" class="mr-1" />
                  重置
                </el-button>
                <el-button type="info" plain @click="handleSearch" class="refresh-btn">
                  <Icon icon="ep:refresh-right" class="mr-1" />
                  刷新数据
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!-- 数据表格区域 -->
      <div class="table-section">
        <div class="section-header">
          <Icon icon="ep:list" class="header-icon" />
          <span class="header-title">供应商列表</span>
          <div class="table-info">
            <el-tag v-if="!loading" type="info" size="small">
              共 {{ pagination.total }} 条记录
            </el-tag>
          </div>
        </div>
        <el-table
          v-loading="loading"
          :data="supplierList"
          @selection-change="handleSelectionChange"
          ref="tableRef"
          stripe
          :show-overflow-tooltip="true"
          class="data-table"
          :row-class-name="tableRowClassName"
          @row-click="handleRowClick"
        >
          <el-table-column type="selection" width="50" align="center" fixed="left" />
          <el-table-column label="供应商编号" prop="no" min-width="120" align="center" fixed="left">
            <template #default="scope">
              <div class="no-container">
                <el-tooltip
                  :content="`完整编号：${scope.row.no}，点击复制`"
                  placement="top"
                  effect="dark"
                >
                  <el-tag
                    type="primary"
                    size="small"
                    class="no-tag-enhanced"
                    @click="copyToClipboard(scope.row.no)"
                  >
                    {{ scope.row.no }}
                  </el-tag>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="供应商名称" prop="name" min-width="200">
            <template #default="scope">
              <div class="company-cell">
                <el-avatar :size="32" class="company-avatar">
                  <Icon icon="ep:office-building" />
                </el-avatar>
                <div class="company-info">
                  <div class="company-name">{{ scope.row.name }}</div>
                  <div class="company-type">企业</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="联系方式" prop="telephone" min-width="140">
            <template #default="scope">
              <div class="contact-cell">
                <Icon icon="ep:phone" class="contact-icon" />
                <span>{{ scope.row.telephone }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="联系人" prop="receiverName" min-width="120">
            <template #default="scope">
              <div class="person-cell">
                <el-avatar :size="24" class="person-avatar">
                  <Icon icon="ep:user" />
                </el-avatar>
                <span class="person-name">{{ scope.row.receiverName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="地址" prop="address" min-width="220">
            <template #default="scope">
              <div class="address-cell">
                <Icon icon="ep:location" class="address-icon" />
                <span class="address-text">{{ scope.row.address }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页组件 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.pageNo"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            class="pagination"
          />
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <div class="selected-info" v-if="selectedSupplier">
          <Icon icon="ep:check" class="selected-icon" />
          <span>已选择：{{ selectedSupplier.name }}</span>
        </div>
        <div class="footer-buttons">
          <el-button @click="dialogVisible = false" size="large" class="cancel-btn">
            <Icon icon="ep:close" class="mr-1" />
            取消
          </el-button>
          <el-button @click="confirmSelection" type="primary" size="large" class="confirm-btn" :disabled="!selectedSupplier">
            <Icon icon="ep:check" class="mr-1" />
            确定选择
          </el-button>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, defineProps, defineEmits, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { SupplierApi } from '@/api/erp/purchase/supplier';
import { formatDate } from '@/utils/formatTime';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const dialogVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit('update:visible', value);
  }
});

watch(() => props.visible, (newValue) => {
  dialogVisible.value = newValue;
  if (newValue) {
    handleSearch();
  }
});

const searchForm = reactive({
  no: '',
  name: '',
  telephone: '',
  receiverName: '',
  address: ''
});

const supplierList = ref<any[]>([]);
const selectedSupplier = ref<any>(null);
const loading = ref(false);
const tableRef = ref();

// 分页配置
const pagination = reactive({
  pageNo: 1,
  pageSize: 20,
  total: 0
});

const handleSearch = async () => {
  loading.value = true;
  try {
    const params = {
      pageNo: pagination.pageNo,
      pageSize: pagination.pageSize,
      no: searchForm.no,
      name: searchForm.name,
      telephone: searchForm.telephone,
      receiverName: searchForm.receiverName,
      address: searchForm.address
    };
    const response = await SupplierApi.getSupplierPage(params);
    if (response && response.list) {
      supplierList.value = response.list;
      pagination.total = response.total;
    } else {
      supplierList.value = [];
      pagination.total = 0;
    }
  } catch (error) {
    ElMessage.error('查询失败');
    supplierList.value = [];
    pagination.total = 0;
  } finally {
    loading.value = false;
  }
};

const resetSearch = () => {
  searchForm.no = '';
  searchForm.name = '';
  searchForm.telephone = '';
  searchForm.receiverName = '';
  searchForm.address = '';
  pagination.pageNo = 1;
  handleSearch();
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.pageNo = 1;
  handleSearch();
};

const handleCurrentChange = (page: number) => {
  pagination.pageNo = page;
  handleSearch();
};

const handleSelectionChange = (selection: any[]) => {
  if (selection.length > 0) {
    selectedSupplier.value = selection[0];
  } else {
    selectedSupplier.value = null;
  }
};

const handleRowClick = (row: any) => {
  // 点击行时选中该行
  tableRef.value?.clearSelection();
  tableRef.value?.toggleRowSelection(row, true);
};

const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (selectedSupplier.value && row.id === selectedSupplier.value.id) {
    return 'selected-row';
  }
  return '';
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success('已复制到剪贴板');
  } catch (err) {
    ElMessage.error('复制失败');
  }
};

const confirmSelection = () => {
  if (!selectedSupplier.value) {
    ElMessage.warning('请选择一个供应商');
    return;
  }
  emit('supplier-selected', selectedSupplier.value);
  dialogVisible.value = false;
};

const emit = defineEmits(['supplier-selected', 'update:visible']);

defineExpose({
  open: () => {
    dialogVisible.value = true;
  },
});
</script>

<style scoped>
.supplier-dialog {
  z-index: 9999 !important;
}

.supplier-dialog .dialog-content {
  max-height: 70vh;
  overflow-y: auto;
}

.supplier-dialog .search-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
}

.supplier-dialog .search-section .section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #dee2e6;
}

.supplier-dialog .search-section .section-header .header-icon {
  color: #007bff;
  margin-right: 8px;
  font-size: 18px;
}

.supplier-dialog .search-section .section-header .header-title {
  font-size: 16px;
  font-weight: 600;
  color: #495057;
}

.supplier-dialog .search-section .search-form .search-input {
  width: 100%;
}

.supplier-dialog .search-section .search-form .search-select {
  width: 100%;
}

.supplier-dialog .search-section .search-form .search-buttons {
  margin-bottom: 0;
  text-align: right;
}

.supplier-dialog .search-section .search-form .search-buttons .search-btn {
  margin-right: 10px;
}

.supplier-dialog .search-section .search-form .search-buttons .reset-btn {
  margin-right: 10px;
}

.supplier-dialog .table-section .section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #dee2e6;
}

.supplier-dialog .table-section .section-header .header-icon {
  color: #28a745;
  margin-right: 8px;
  font-size: 18px;
}

.supplier-dialog .table-section .section-header .header-title {
  font-size: 16px;
  font-weight: 600;
  color: #495057;
}

.supplier-dialog .table-section .section-header .table-info .el-tag {
  font-size: 12px;
}

.supplier-dialog .table-section .data-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.supplier-dialog .table-section .data-table .no-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.supplier-dialog .table-section .data-table .no-container .no-tag-enhanced {
  cursor: pointer;
  transition: all 0.3s ease;
}

.supplier-dialog .table-section .data-table .no-container .no-tag-enhanced:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.supplier-dialog .table-section .data-table .company-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.supplier-dialog .table-section .data-table .company-cell .company-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.supplier-dialog .table-section .data-table .company-cell .company-info .company-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.supplier-dialog .table-section .data-table .company-cell .company-info .company-type {
  font-size: 12px;
  color: #6c757d;
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.supplier-dialog .table-section .data-table .contact-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.supplier-dialog .table-section .data-table .contact-cell .contact-icon {
  color: #28a745;
  font-size: 16px;
}

.supplier-dialog .table-section .data-table .person-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.supplier-dialog .table-section .data-table .person-cell .person-avatar {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.supplier-dialog .table-section .data-table .person-cell .person-name {
  font-weight: 500;
  color: #495057;
}

.supplier-dialog .table-section .data-table .address-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.supplier-dialog .table-section .data-table .address-cell .address-icon {
  color: #ffc107;
  font-size: 16px;
}

.supplier-dialog .table-section .data-table .address-cell .address-text {
  color: #6c757d;
  line-height: 1.4;
}

.supplier-dialog .table-section .data-table .selected-row {
  background-color: #e3f2fd !important;
}

.supplier-dialog .table-section .pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.supplier-dialog .table-section .pagination-container .pagination .el-pagination__total {
  margin-right: 16px;
}

.supplier-dialog .table-section .pagination-container .pagination .el-pagination__sizes {
  margin-right: 16px;
}

.supplier-dialog .dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-top: 1px solid #e9ecef;
}

.supplier-dialog .dialog-footer .selected-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #28a745;
  font-weight: 500;
}

.supplier-dialog .dialog-footer .selected-info .selected-icon {
  font-size: 16px;
}

.supplier-dialog .dialog-footer .footer-buttons {
  display: flex;
  gap: 12px;
}

.supplier-dialog .dialog-footer .footer-buttons .cancel-btn {
  border-color: #6c757d;
  color: #6c757d;
}

.supplier-dialog .dialog-footer .footer-buttons .cancel-btn:hover {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
}

.supplier-dialog .dialog-footer .footer-buttons .confirm-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.supplier-dialog .dialog-footer .footer-buttons .confirm-btn:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

.supplier-dialog .dialog-footer .footer-buttons .confirm-btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .supplier-dialog {
    width: 95vw !important;
    max-width: 1200px;
  }
}

@media (max-width: 768px) {
  .supplier-dialog .search-section .search-form .el-row .el-col {
    margin-bottom: 16px;
  }

  .supplier-dialog .dialog-footer {
    flex-direction: column;
    gap: 16px;
  }

  .supplier-dialog .dialog-footer .selected-info {
    justify-content: center;
  }

  .supplier-dialog .dialog-footer .footer-buttons {
    width: 100%;
    justify-content: center;
  }
}
</style>
