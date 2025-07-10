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
              <el-form-item label="收件人">
                <el-input
                  v-model="searchForm.receiverName"
                  placeholder="请输入收件人"
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
            <el-col :span="6">
              <el-form-item label="微信账号">
                <el-input
                  v-model="searchForm.wechatAccount"
                  placeholder="请输入微信账号"
                  clearable
                  prefix-icon="ep:chat-dot-round"
                  @keyup.enter="handleQuery"
                  class="search-input"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="支付宝号">
                <el-input
                  v-model="searchForm.alipayAccount"
                  placeholder="请输入支付宝号"
                  clearable
                  prefix-icon="ep:wallet"
                  @keyup.enter="handleQuery"
                  class="search-input"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="银行账号">
                <el-input
                  v-model="searchForm.bankAccount"
                  placeholder="请输入银行账号"
                  clearable
                  prefix-icon="ep:credit-card"
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
          <el-table-column label="客户编号" prop="no" min-width="210" align="center" fixed="left">
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
          <!-- 收件人 -->
          <el-table-column label="收件人" prop="receiverName" min-width="120">
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
          <el-table-column label="地址" prop="address" min-width="200">
            <template #default="scope">
              <div class="address-cell">
                <Icon icon="ep:location" class="address-icon" />
                <span class="address-text">{{ scope.row.address }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 微信账号 -->
          <el-table-column label="微信账号" prop="wechatAccount" min-width="140">
            <template #default="scope">
              <div class="account-cell">
                <Icon icon="ep:chat-dot-round" class="wechat-icon" />
                <span>{{ scope.row.wechatAccount }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 支付宝号 -->
          <el-table-column label="支付宝号" prop="alipayAccount" min-width="140">
            <template #default="scope">
              <div class="account-cell">
                <Icon icon="ep:wallet" class="alipay-icon" />
                <span>{{ scope.row.alipayAccount }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 银行账号 -->
          <el-table-column label="银行账号" prop="bankAccount" min-width="160">
            <template #default="scope">
              <div class="account-cell">
                <Icon icon="ep:credit-card" class="bank-icon" />
                <span>{{ scope.row.bankAccount }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 创建时间 -->
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
import { ref, reactive, watch, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { CustomerApi } from '@/api/erp/sale/customer';
import { SalePriceApi } from '@/api/erp/sale/saleprice';
import { ComboApi } from '@/api/erp/product/combo';
import { formatDate } from '@/utils/formatTime';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  comboProductId: {
    type: [String, Number],
    default: null,
  },
});

const emit = defineEmits(['customer-selected', 'update:visible']);

// 响应式数据
const dialogVisible = ref(false);

const loading = ref(false);
const tableRef = ref();
const searchForm = reactive({
  no: '',
  name: '',
  receiverName: '',
  telephone: '',
  address: '',
  wechatAccount: '',
  alipayAccount: '',
  bankAccount: '',
});

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
});

const customerList = ref<any[]>([]);
const selectedCustomer = ref<any>(null);
const total = ref(0);

// 监听弹窗显示状态
watch(() => dialogVisible.value, (newValue) => {
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
    const response = await CustomerApi.searchCustomerPage(params);
    customerList.value = response.list || [];
    total.value = response.total || 0;

  } catch (error) {
    ElMessage.error('查询失败，请重试');
    customerList.value = [];
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
  searchForm.receiverName = '';
  searchForm.telephone = '';
  searchForm.address = '';
  searchForm.wechatAccount = '';
  searchForm.alipayAccount = '';
  searchForm.bankAccount = '';
  queryParams.pageNo = 1;
  selectedCustomer.value = null;
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
  selectedCustomer.value = selection.length > 0 ? selection[0] : null;
};

// 行点击处理
const handleRowClick = (row: any) => {
  tableRef.value?.toggleRowSelection(row);
};

// 表格行样式
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (selectedCustomer.value && selectedCustomer.value.id === row.id) {
    return 'selected-row';
  }
  return rowIndex % 2 === 1 ? 'stripe-row' : '';
};

// 确认选择 - 保持原有的业务逻辑
const confirmSelection = async () => {
  if (!selectedCustomer.value) {
    ElMessage.warning('请选择一个客户');
    return;
  }

  // 确保组品ID是数字类型
  const groupProductId = Number(props.comboProductId);
  if (!groupProductId || isNaN(groupProductId)) {
    ElMessage.error('组品ID无效，请先选择组品');
    return;
  }

  // 根据组品编号和客户名称查询销售价格表
  const searchParams = {
    groupProductId: groupProductId,
    customerName: selectedCustomer.value.name,
  };
  
  try {
    // 方案1：首先尝试标准搜索接口
    let salePriceResult = await SalePriceApi.searchSalePrice(searchParams);
    
    // 方案2：如果标准搜索失败，尝试分页查询
    if (!salePriceResult || salePriceResult.length === 0) {
      try {
        const pageParams = {
          pageNo: 1,
          pageSize: 10,
          groupProductId: searchParams.groupProductId,
          customerName: searchParams.customerName,
        };
        const pageResult = await SalePriceApi.getSalePricePage(pageParams);
        
        if (pageResult && pageResult.list && pageResult.list.length > 0) {
          salePriceResult = pageResult.list;
        }
      } catch (pageError) {
        // 分页查询失败，继续尝试其他方案
      }
    }
    
    // 方案3：如果仍然没有结果，尝试模糊查询
    if (!salePriceResult || salePriceResult.length === 0) {
      try {
        const fuzzyParams = {
          pageNo: 1,
          pageSize: 50,
          groupProductId: searchParams.groupProductId,
          // 去掉客户名称，只按组品查询
        };
        const fuzzyResult = await SalePriceApi.getSalePricePage(fuzzyParams);
        
        if (fuzzyResult && fuzzyResult.list && fuzzyResult.list.length > 0) {
          // 在结果中查找匹配的客户名称
          const matchedRecords = fuzzyResult.list.filter(item => 
            item.customerName === searchParams.customerName ||
            item.customerName?.trim() === searchParams.customerName?.trim()
          );
          
          if (matchedRecords.length > 0) {
            salePriceResult = matchedRecords;
          }
        }
      } catch (fuzzyError) {
        // 模糊查询失败，使用默认值
      }
    }
    
    if (salePriceResult && salePriceResult.length > 0) {
      const priceData = salePriceResult[0];
      
      // 获取组品信息以获取重量
      let comboWeight = 0;
      try {
        const comboInfo = await ComboApi.getCombo(groupProductId);
        
        if (comboInfo) {
          if (comboInfo.weight !== undefined && comboInfo.weight !== null) {
            comboWeight = Number(comboInfo.weight) || 0;
          }
        }
      } catch (error) {
        console.error('获取组品重量失败:', error);
      }
      
      // 返回包含完整运费信息和代发价格的数据
      emit('customer-selected', [
        {
          customerName: selectedCustomer.value.name,
          salePrice: priceData.distributionPrice || 0, // 使用代发价格作为出货单价
          shippingFeeType: priceData.shippingFeeType,
          fixedShippingFee: priceData.fixedShippingFee,
          additionalItemQuantity: priceData.additionalItemQuantity, //按件数量
          additionalItemPrice: priceData.additionalItemPrice, //按件费用
          weight: comboWeight, // 使用从组品信息获取的重量
          firstWeight: priceData.firstWeight,
          firstWeightPrice: priceData.firstWeightPrice,
          additionalWeight: priceData.additionalWeight,
          additionalWeightPrice: priceData.additionalWeightPrice
        },
      ]);
    } else {
      ElMessage.warning(`未找到组品ID: ${groupProductId} 和客户: ${selectedCustomer.value.name} 的销售价格配置。
      
请检查：
1. 销售价格表中是否存在该记录
2. 组品ID是否正确（当前: ${groupProductId}）
3. 客户名称是否完全匹配（当前: "${selectedCustomer.value.name}"）
4. 数据是否被删除或状态异常`);
      
      // 如果没有搜索到销售价格表数据，返回客户名称，价格和运费信息为默认值
      emit('customer-selected', [
        {
          customerName: selectedCustomer.value.name,
          salePrice: 0, // 默认价格为0
          shippingFeeType: 0, // 默认固定运费
          fixedShippingFee: 0, // 默认运费为0
          additionalItemQuantity: 1, //按件数量
          additionalItemPrice: 0, //按件费用
          weight: 0,
          firstWeight: 1,
          firstWeightPrice: 0,
          additionalWeight: 1,
          additionalWeightPrice: 0
        },
      ]);
    }
  } catch (error) {
    console.error('查询销售价格表失败:', error);
    console.error('错误详情:', {
      message: error.message,
      stack: error.stack,
      searchParams: searchParams
    });
    ElMessage.error('查询销售价格表失败: ' + (error.message || '未知错误'));
    
    // 出错时返回默认数据
    emit('customer-selected', [
      {
        customerName: selectedCustomer.value.name,
        salePrice: 0,
        shippingFeeType: 0,
        fixedShippingFee: 0,
        additionalItemQuantity: 1,
        additionalItemPrice: 0,
        weight: 0,
        firstWeight: 1,
        firstWeightPrice: 0,
        additionalWeight: 1,
        additionalWeightPrice: 0
      },
    ]);
  }
  
  dialogVisible.value = false;
};

// 暴露方法
defineExpose({
  open: () => {
    dialogVisible.value = true;
  },
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

.account-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.wechat-icon {
  color: #10b981;
  font-size: 14px;
}

.alipay-icon {
  color: #3b82f6;
  font-size: 14px;
}

.bank-icon {
  color: #8b5cf6;
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
