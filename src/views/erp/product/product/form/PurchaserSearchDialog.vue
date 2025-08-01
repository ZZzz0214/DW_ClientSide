<template>
  <Dialog v-model="dialogVisible" title="选择采购人员" width="1200px"
          top="3vh"
          style="max-height: 94vh;"
          :destroy-on-close="true"
          class="purchaser-dialog">
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
              <el-form-item label="人员编号">
                <el-input
                  v-model="searchForm.no"
                  placeholder="请输入人员编号"
                  clearable
                  prefix-icon="ep:key"
                  @keyup.enter="handleQuery"
                  class="search-input"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="人员名称">
                <el-input
                  v-model="searchForm.purchaserName"
                  placeholder="请输入人员名称"
                  clearable
                  prefix-icon="ep:user"
                  @keyup.enter="handleQuery"
                  class="search-input"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系方式">
                <el-input
                  v-model="searchForm.contactPhone"
                  placeholder="请输入联系方式"
                  clearable
                  prefix-icon="ep:phone"
                  @keyup.enter="handleQuery"
                  class="search-input"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="地址">
                <el-input
                  v-model="searchForm.address"
                  placeholder="请输入地址"
                  clearable
                  prefix-icon="ep:location"
                  @keyup.enter="handleQuery"
                  class="search-input"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
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
          <span class="header-title">人员列表</span>
          <div class="table-info">
            <el-tag v-if="!loading" type="info" size="small">
              共 {{ total }} 条记录
            </el-tag>
          </div>
        </div>
        <el-table
          v-loading="loading"
          :data="purchaserList"
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
          <el-table-column label="人员编号" prop="no" min-width="210" align="center" fixed="left">
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
          <el-table-column label="人员名称" prop="purchaserName" min-width="140">
            <template #default="scope">
              <div class="name-cell">
                <el-avatar :size="28" class="name-avatar">
                  <Icon icon="ep:user" />
                </el-avatar>
                <span class="name-text">{{ scope.row.purchaserName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="联系方式" prop="contactPhone" min-width="140">
            <template #default="scope">
              <div class="contact-cell">
                <Icon icon="ep:phone" class="contact-icon" />
                <span>{{ scope.row.contactPhone }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="地址" prop="address" min-width="200">
            <template #default="scope">
              <div class="address-cell">
                <Icon icon="ep:location" class="address-icon" />
                <span class="address-text">{{ scope.row.address }}</span>
              </div>
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
        <div class="selected-info" v-if="selectedPurchaser">
          <Icon icon="ep:check" class="selected-icon" />
          <span>已选择：{{ selectedPurchaser.purchaserName }}</span>
        </div>
        <div class="footer-buttons">
          <el-button @click="dialogVisible = false" size="large" class="cancel-btn">
            <Icon icon="ep:close" class="mr-1" />
            取消
          </el-button>
          <el-button
            type="primary"
            @click="confirmSelection"
            :disabled="!selectedPurchaser"
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
import { PurchaserApi } from '@/api/erp/person/purchaser'; // 引入真实API
import { formatDate } from '@/utils/formatTime';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['purchaser-selected', 'update:visible']);

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
  purchaserName: '',
  contactPhone: '',
  address: '',
});

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
});

const purchaserList = ref<any[]>([]);
const selectedPurchaser = ref<any>(null);
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
    const response = await PurchaserApi.searchPurchaser(params);
    purchaserList.value = response || [];
    total.value = purchaserList.value.length;

  } catch (error) {
    ElMessage.error('查询失败，请重试');
    purchaserList.value = [];
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
  searchForm.purchaserName = '';
  searchForm.contactPhone = '';
  searchForm.address = '';
  queryParams.pageNo = 1;
  selectedPurchaser.value = null;
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
  selectedPurchaser.value = selection.length > 0 ? selection[0] : null;
};

// 行点击处理
const handleRowClick = (row: any) => {
  tableRef.value?.toggleRowSelection(row);
};

// 表格行样式
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (selectedPurchaser.value && selectedPurchaser.value.no === row.no) {
    return 'selected-row';
  }
  return rowIndex % 2 === 1 ? 'stripe-row' : '';
};

// 确认选择
const confirmSelection = () => {
  if (!selectedPurchaser.value) {
    ElMessage.warning('请选择一个采购人员');
    return;
  }
  emit('purchaser-selected', selectedPurchaser.value);
  dialogVisible.value = false;
  ElMessage.success(`已选择采购人员：${selectedPurchaser.value.purchaserName}`);
};

// 暴露方法
defineExpose({
  open: () => {
    dialogVisible.value = true;
  },
});
</script>

<style scoped>
.purchaser-dialog :deep(.el-dialog) {
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.purchaser-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
  border-radius: 12px 12px 0 0;
}

.purchaser-dialog :deep(.el-dialog__title) {
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
  color: #667eea;
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
  box-shadow: 0 0 0 1px #667eea;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background-color: #eff6ff !important;
}

.data-table :deep(.selected-row:hover) {
  background-color: #dbeafe !important;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  min-width: 120px;
  display: inline-block;
  cursor: pointer;
  transition: all 0.3s ease;
}

  .no-tag-auto:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100% - 30px);
    min-width: 120px;
    display: inline-block;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
  }

  .no-tag-enhanced:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  }

  .copy-btn {
    padding: 2px 4px !important;
    margin-left: 4px;
    color: #667eea;
    transition: all 0.3s ease;
    border-radius: 4px;
    min-width: 20px;
  }

  .copy-btn:hover {
    color: #5a67d8;
    background-color: #f0f4ff;
    transform: scale(1.1);
  }

.name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.name-text {
  font-weight: 500;
  color: #374151;
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
