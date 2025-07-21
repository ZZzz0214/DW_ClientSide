<template>
  <Dialog v-model="dialogVisible" title="选择客户" width="1200px"
          top="3vh"
          style="max-height: 94vh;"
          :destroy-on-close="true"
          class="customer-dialog">
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
              <el-form-item label="客户编号">
                <el-input
                  v-model="searchForm.no"
                  placeholder="请输入客户编号"
                  clearable
                  prefix-icon="ep:key"
                  @keyup.enter="handleQuery"
                  class="search-input"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户名称">
                <el-input
                  v-model="searchForm.name"
                  placeholder="请输入客户名称"
                  clearable
                  prefix-icon="ep:user"
                  @keyup.enter="handleQuery"
                  class="search-input"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系电话">
                <el-input
                  v-model="searchForm.telephone"
                  placeholder="请输入联系电话"
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
          <span class="header-title">客户列表</span>
          <div class="table-info">
            <el-tag v-if="!loading" type="info" size="small">
              共 {{ total }} 条记录
            </el-tag>
          </div>
        </div>
        <el-table
          v-loading="loading"
          :data="customerList"
          @selection-change="handleSelectionChange"
          ref="tableRef"
          stripe
          :show-overflow-tooltip="true"
          class="data-table"
          :row-class-name="tableRowClassName"
          @row-click="handleRowClick"
        >
          <el-table-column type="selection" width="50" align="center" fixed="left" />
          <!-- 客户编号 -->
          <el-table-column label="客户编号" prop="no" min-width="120" align="center" fixed="left">
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
          <!-- 客户名称 -->
          <el-table-column label="客户名称" prop="name" min-width="140">
            <template #default="scope">
              <div class="name-cell">
                <el-avatar :size="28" class="name-avatar">
                  <Icon icon="ep:user" />
                </el-avatar>
                <span class="name-text">{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 联系人 -->
          <el-table-column label="联系人" prop="receiverName" min-width="120">
            <template #default="scope">
              <div class="contact-cell">
                <Icon icon="ep:user" class="contact-icon" />
                <span>{{ scope.row.receiverName }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 联系电话 -->
          <el-table-column label="联系电话" prop="telephone" min-width="140">
            <template #default="scope">
              <div class="contact-cell">
                <Icon icon="ep:phone" class="contact-icon" />
                <span>{{ scope.row.telephone }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 地址 -->
          <el-table-column label="客户地址" prop="address" min-width="200">
            <template #default="scope">
              <div class="address-cell">
                <Icon icon="ep:location" class="address-icon" />
                <span class="address-text">{{ scope.row.address }}</span>
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
        <div class="selected-info" v-if="selectedCustomer">
          <Icon icon="ep:check" class="selected-icon" />
          <span>已选择：{{ selectedCustomer.name }}</span>
        </div>
        <div class="footer-buttons">
          <el-button @click="dialogVisible = false" size="large" class="cancel-btn">
            <Icon icon="ep:close" class="mr-1" />
            取消
          </el-button>
          <el-button
            type="primary"
            @click="confirmSelection"
            :disabled="!selectedCustomer"
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
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { CustomerApi } from '@/api/erp/sale/customer/index'

const dialogVisible = ref(false)
const loading = ref(false)
const tableRef = ref()

const searchForm = reactive({
  no: '',
  name: '',
  telephone: '',
  address: '',
});

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
});

const customerList = ref<any[]>([])
const selectedCustomer = ref<any>(null)
const total = ref(0)

// 搜索功能
const handleSearch = async () => {
  loading.value = true;
  try {
    console.log('搜索客户参数:', { ...searchForm, ...queryParams })
    const params = {
      ...searchForm,
      ...queryParams,
    };
    const response = await CustomerApi.searchCustomerPage(params);
    console.log('客户搜索结果:', response)
    
    customerList.value = response.list || [];
    total.value = response.total || 0;
  } catch (error) {
    console.error('客户搜索失败:', error)
    ElMessage.error('查询客户失败')
    customerList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 查询按钮点击
const handleQuery = () => {
  queryParams.pageNo = 1
  handleSearch()
}

const resetSearch = () => {
  Object.assign(searchForm, {
    no: '',
    name: '',
    telephone: '',
    address: '',
  });
  queryParams.pageNo = 1;
  handleSearch();
};

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success(`编号已复制：${text}`)
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success(`编号已复制：${text}`)
  }
}

// 选择变化处理
const handleSelectionChange = (selection: any[]) => {
  selectedCustomer.value = selection.length > 0 ? selection[0] : null
}

// 行点击处理
const handleRowClick = (row: any) => {
  tableRef.value?.toggleRowSelection(row)
}

// 表格行样式
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (selectedCustomer.value && selectedCustomer.value.id === row.id) {
    return 'selected-row'
  }
  return rowIndex % 2 === 1 ? 'stripe-row' : ''
}

// 确认选择
const confirmSelection = () => {
  if (!selectedCustomer.value) {
    ElMessage.warning('请选择一个客户')
    return
  }
  
  console.log('选择的客户:', selectedCustomer.value)
  emit('customer-selected', selectedCustomer.value)
  dialogVisible.value = false
  ElMessage.success(`已选择客户：${selectedCustomer.value.name}`)
}

const emit = defineEmits(['customer-selected'])

// 暴露方法
defineExpose({
  open: () => {
    dialogVisible.value = true;
  }
});

// 监听弹窗显示状态
watch(() => dialogVisible.value, (newValue) => {
  if (newValue) {
    resetSearch();
    handleSearch();
  }
});
</script>

<style scoped>
.customer-dialog :deep(.el-dialog) {
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.customer-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
  border-radius: 12px 12px 0 0;
}

.customer-dialog :deep(.el-dialog__title) {
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

.address-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.address-icon {
  color: #f59e0b;
  font-size: 14px;
}

.address-text {
  word-break: break-all;
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