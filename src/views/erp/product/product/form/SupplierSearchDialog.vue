<template>
  <Dialog v-model="dialogVisible" title="选择供应商" width="1200px"
          top="3vh"
          style="max-height: 94vh;"
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
                  @keyup.enter="handleQuery"
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
                  @keyup.enter="handleQuery"
                  class="search-input"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系方式">
                <el-input
                  v-model="searchForm.mobile"
                  placeholder="请输入联系方式"
                  clearable
                  prefix-icon="ep:phone"
                  @keyup.enter="handleQuery"
                  class="search-input"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系人">
                <el-input
                  v-model="searchForm.contact"
                  placeholder="请输入联系人"
                  clearable
                  prefix-icon="ep:user"
                  @keyup.enter="handleQuery"
                  class="search-input"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="状态">
                <el-select
                  v-model="searchForm.status"
                  placeholder="请选择状态"
                  clearable
                  class="w-full search-select"
                >
                  <el-option label="合作中" :value="1">
                    <span class="option-item">
                      <el-tag type="success" size="small">合作中</el-tag>
                    </span>
                  </el-option>
                  <el-option label="已停用" :value="0">
                    <span class="option-item">
                      <el-tag type="danger" size="small">已停用</el-tag>
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item class="search-buttons">
                <el-button type="primary" @click="handleQuery" :loading="loading" class="search-btn">
                  <Icon icon="ep:search" class="mr-1" />
                  查询
                </el-button>
                <el-button @click="resetSearch" class="reset-btn">
                  <Icon icon="ep:refresh" class="mr-1" />
                  重置
                </el-button>
                <el-button type="info" plain @click="handleQuery" class="refresh-btn">
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
              共 {{ total }} 条记录
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
          <!-- 完美解决方案：自适应宽度 + Tooltip + 复制功能 -->
          <el-table-column label="供应商编号" prop="no" min-width="280" align="center" fixed="left">
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
                <el-button
                  v-if="isNoOverflow(scope.row.no)"
                  type="text"
                  size="small"
                  class="copy-btn"
                  @click="copyToClipboard(scope.row.no)"
                  title="复制完整编号"
                >
                  <Icon icon="ep:copy-document" />
                </el-button>
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
          <el-table-column label="联系方式" prop="mobile" min-width="140">
            <template #default="scope">
              <div class="contact-cell">
                <Icon icon="ep:phone" class="contact-icon" />
                <span>{{ scope.row.mobile }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="联系人" prop="contact" min-width="120">
            <template #default="scope">
              <div class="person-cell">
                <el-avatar :size="24" class="person-avatar">
                  <Icon icon="ep:user" />
                </el-avatar>
                <span class="person-name">{{ scope.row.contact }}</span>
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
          <el-table-column label="状态" prop="status" width="120" align="center">
            <template #default="scope">
              <el-tag
                :type="scope.row.status === 1 ? 'success' : 'danger'"
                size="small"
                :effect="scope.row.status === 1 ? 'light' : 'dark'"
                class="status-tag"
              >
                <Icon :icon="scope.row.status === 1 ? 'ep:check' : 'ep:close'" class="mr-1" />
                {{ scope.row.status === 1 ? '合作中' : '已停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" width="180" align="center">
            <template #default="scope">
              <div class="time-cell">
                <Icon icon="ep:calendar" class="time-icon" />
                <span>{{ formatDate(scope.row.createTime) }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <div class="pagination-section">
          <Pagination
            :total="total"
            v-model:page="queryParams.pageNo"
            v-model:limit="queryParams.pageSize"
            @pagination="handleSearch"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
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
          <el-button
            type="primary"
            @click="confirmSelection"
            :disabled="!selectedSupplier"
            size="large"
            class="confirm-btn"
          >
            <Icon icon="ep:check" class="mr-1" />
            确定选择
          </el-button>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { SupplierApi } from '@/api/erp/purchase/supplier'; // 引入真实API
import { formatDate } from '@/utils/formatTime';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['supplier-selected', 'update:visible']);

// 响应式数据
const dialogVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit('update:visible', value);
  }
});

const loading = ref(false);
const tableRef = ref();
const searchForm = reactive({
  no: '',
  name: '',
  mobile: '',
  contact: '',
  status: undefined,
});

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
});

const supplierList = ref<any[]>([]);
const selectedSupplier = ref<any>(null);
const total = ref(0);

// 监听弹窗显示状态
watch(() => props.visible, (newValue) => {
  if (newValue) {
    resetSearch();
    handleSearch();
  }
});

// 搜索功能
const handleSearch = async () => {
  loading.value = true;
  try {
    const params = {
      ...searchForm,
      ...queryParams,
    };
    const response = await SupplierApi.searchSupplier(params);
    supplierList.value = response || [];
    total.value = supplierList.value.length;

  } catch (error) {
    ElMessage.error('查询失败，请重试');
    supplierList.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

// 查询按钮点击
const handleQuery = () => {
  queryParams.pageNo = 1;
  handleSearch();
};

// 重置搜索
const resetSearch = () => {
  searchForm.no = '';
  searchForm.name = '';
  searchForm.mobile = '';
  searchForm.contact = '';
  searchForm.status = undefined;
  queryParams.pageNo = 1;
  selectedSupplier.value = null;
  if (tableRef.value) {
    tableRef.value.clearSelection();
  }
};

// 判断编号是否超出显示范围
const isNoOverflow = (no: string) => {
  if (!no) return false;
  // 根据编号长度判断是否需要显示Tooltip
  return no.length > 20; // 超过20个字符显示Tooltip
};

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success(`编号已复制：${text}`);
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    ElMessage.success(`编号已复制：${text}`);
  }
};

// 选择变化处理
const handleSelectionChange = (selection: any[]) => {
  selectedSupplier.value = selection.length > 0 ? selection[0] : null;
};

// 行点击处理
const handleRowClick = (row: any) => {
  tableRef.value?.toggleRowSelection(row);
};

// 表格行样式
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (selectedSupplier.value && selectedSupplier.value.no === row.no) {
    return 'selected-row';
  }
  return rowIndex % 2 === 1 ? 'stripe-row' : '';
};

// 确认选择
const confirmSelection = () => {
  if (!selectedSupplier.value) {
    ElMessage.warning('请选择一个供应商');
    return;
  }
  emit('supplier-selected', selectedSupplier.value);
  dialogVisible.value = false;
  ElMessage.success(`已选择供应商：${selectedSupplier.value.name}`);
};

// 暴露方法
defineExpose({
  open: () => {
    dialogVisible.value = true;
  },
});
</script>

<style scoped>
.supplier-dialog :deep(.el-dialog) {
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.supplier-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 20px 24px;
  border-radius: 12px 12px 0 0;
}

.supplier-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
}

.dialog-content {
  padding: 0;
  max-height: calc(94vh - 200px);
  overflow-y: auto;
}

.search-section {
  background: #f8fafc;
  border-radius: 8px;
  margin: 20px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-weight: 600;
  color: #374151;
}

.header-icon {
  font-size: 18px;
  color: #f5576c;
  margin-right: 8px;
}

.header-title {
  font-size: 16px;
}

.table-info {
  margin-left: auto;
}

.search-form {
  margin-top: 16px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.search-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #f5576c;
}

.search-select :deep(.el-select__wrapper) {
  border-radius: 8px;
}

.option-item {
  display: flex;
  align-items: center;
}

.search-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.search-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
}

.reset-btn, .refresh-btn {
  border-radius: 8px;
  padding: 10px 16px;
  margin-left: 12px;
}

.table-section {
  margin: 20px;
}

.data-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-top: 16px;
}

.data-table :deep(.el-table__header) {
  background: #f1f5f9;
}

.data-table :deep(.el-table__header th) {
  background: #f1f5f9;
  color: #374151;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
}

.data-table :deep(.selected-row) {
  background-color: #fef7f7 !important;
}

.data-table :deep(.selected-row:hover) {
  background-color: #fecaca !important;
}

.data-table :deep(.el-table__row:hover) {
  background-color: #f8fafc;
  cursor: pointer;
}

.no-tag {
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.no-tag-auto {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 6px;
  padding: 4px 8px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  color: white;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  min-width: 140px;
  display: inline-block;
  cursor: pointer;
  transition: all 0.3s ease;
}

  .no-tag-auto:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
  }

  .no-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
  }

  .no-tag-enhanced {
    font-family: 'Courier New', monospace;
    font-weight: 600;
    letter-spacing: 0.5px;
    border-radius: 6px;
    padding: 4px 8px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    border: none;
    color: white;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100% - 30px);
    min-width: 140px;
    display: inline-block;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
  }

  .no-tag-enhanced:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
    background: linear-gradient(135deg, #ec4899 0%, #ef4444 100%);
  }

  .copy-btn {
    padding: 2px 4px !important;
    margin-left: 4px;
    color: #f5576c;
    transition: all 0.3s ease;
    border-radius: 4px;
    min-width: 20px;
  }

  .copy-btn:hover {
    color: #ef4444;
    background-color: #fef7f7;
    transform: scale(1.1);
  }

.company-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.company-avatar {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.company-info {
  display: flex;
  flex-direction: column;
}

.company-name {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.company-type {
  font-size: 12px;
  color: #9ca3af;
}

.contact-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.contact-icon {
  color: #10b981;
  font-size: 14px;
}

.person-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.person-avatar {
  background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
}

.person-name {
  font-weight: 500;
  color: #374151;
}

.address-cell {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.address-icon {
  color: #f59e0b;
  font-size: 14px;
  margin-top: 2px;
  flex-shrink: 0;
}

.address-text {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.status-tag {
  font-weight: 500;
}

.time-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
}

.time-icon {
  color: #8b5cf6;
  font-size: 14px;
}

.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.selected-info {
  display: flex;
  align-items: center;
  color: #059669;
  font-weight: 500;
}

.selected-icon {
  margin-right: 6px;
  color: #10b981;
}

.footer-buttons {
  display: flex;
  gap: 12px;
}

.cancel-btn {
  border-radius: 8px;
  padding: 10px 20px;
}

.confirm-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-weight: 500;
}

.confirm-btn:disabled {
  background: #d1d5db;
  color: #9ca3af;
}
</style>
