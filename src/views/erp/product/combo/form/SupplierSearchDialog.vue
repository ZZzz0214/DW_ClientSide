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
                  v-model="searchForm.id"
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
                  v-model="searchForm.mobile"
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
                  v-model="searchForm.contact"
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
              共 {{ supplierList.length }} 条记录
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
          <el-table-column label="供应商编号" prop="id" min-width="120" align="center" fixed="left">
            <template #default="scope">
              <div class="no-container">
                <el-tooltip
                  :content="`完整编号：${scope.row.id}，点击复制`"
                  placement="top"
                  effect="dark"
                >
                  <el-tag
                    type="primary"
                    size="small"
                    class="no-tag-enhanced"
                    @click="copyToClipboard(scope.row.id)"
                  >
                    {{ scope.row.id }}
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
              >
                {{ scope.row.status === 1 ? '合作中' : '已停用' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
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
  id: '',
  name: '',
  mobile: '',
  contact: '',
  status: undefined
});

const supplierList = ref<any[]>([]);
const selectedSupplier = ref<any>(null);
const loading = ref(false);
const tableRef = ref();

const handleSearch = async () => {
  loading.value = true;
  try {
    const params = {
      id: searchForm.id,
      name: searchForm.name,
      mobile: searchForm.mobile,
      contact: searchForm.contact,
      status: searchForm.status
    };
    const response = await SupplierApi.searchSupplier(params);
    if (Array.isArray(response)) {
      supplierList.value = response;
    } else {
      supplierList.value = [];
    }
  } catch (error) {
    ElMessage.error('查询失败');
    supplierList.value = [];
  } finally {
    loading.value = false;
  }
};

const resetSearch = () => {
  searchForm.id = '';
  searchForm.name = '';
  searchForm.mobile = '';
  searchForm.contact = '';
  searchForm.status = undefined;
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
  .dialog-content {
    max-height: 70vh;
    overflow-y: auto;
  }

  .search-section {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid #e9ecef;

    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #dee2e6;

      .header-icon {
        color: #007bff;
        margin-right: 8px;
        font-size: 18px;
      }

      .header-title {
        font-size: 16px;
        font-weight: 600;
        color: #495057;
      }
    }

    .search-form {
      .search-input {
        width: 100%;
      }

      .search-select {
        width: 100%;
      }

      .search-buttons {
        margin-bottom: 0;
        text-align: right;

        .search-btn {
          margin-right: 10px;
        }

        .reset-btn {
          margin-right: 10px;
        }
      }
    }
  }

  .table-section {
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #dee2e6;

      .header-icon {
        color: #28a745;
        margin-right: 8px;
        font-size: 18px;
      }

      .header-title {
        font-size: 16px;
        font-weight: 600;
        color: #495057;
      }

      .table-info {
        .el-tag {
          font-size: 12px;
        }
      }
    }

    .data-table {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .no-container {
        display: flex;
        align-items: center;
        justify-content: center;

        .no-tag-enhanced {
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            transform: scale(1.05);
            box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
          }
        }
      }

      .company-cell {
        display: flex;
        align-items: center;
        gap: 12px;

        .company-avatar {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
        }

        .company-info {
          .company-name {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 2px;
          }

          .company-type {
            font-size: 12px;
            color: #7f8c8d;
            background: #ecf0f1;
            padding: 2px 6px;
            border-radius: 4px;
            display: inline-block;
          }
        }
      }

      .contact-cell {
        display: flex;
        align-items: center;
        gap: 6px;

        .contact-icon {
          color: #28a745;
          font-size: 14px;
        }
      }

      .person-cell {
        display: flex;
        align-items: center;
        gap: 8px;

        .person-avatar {
          background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
        }

        .person-name {
          font-weight: 500;
          color: #2c3e50;
        }
      }

      .address-cell {
        display: flex;
        align-items: flex-start;
        gap: 6px;

        .address-icon {
          color: #ffc107;
          font-size: 14px;
          margin-top: 2px;
        }

        .address-text {
          color: #6c757d;
          line-height: 1.4;
        }
      }

      .selected-row {
        background-color: #e3f2fd !important;
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-top: 1px solid #e9ecef;

    .selected-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #28a745;
      font-weight: 500;

      .selected-icon {
        color: #28a745;
      }
    }

    .footer-buttons {
      display: flex;
      gap: 10px;

      .cancel-btn {
        border-color: #6c757d;
        color: #6c757d;

        &:hover {
          background-color: #6c757d;
          color: white;
        }
      }

      .confirm-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        &:disabled {
          background: #e9ecef;
          color: #6c757d;
          transform: none;
          box-shadow: none;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .supplier-dialog {
    .dialog-content {
      max-height: 80vh;
    }

    .search-section {
      padding: 15px;

      .search-form {
        .el-row {
          .el-col {
            margin-bottom: 15px;
          }
        }
      }
    }

    .dialog-footer {
      flex-direction: column;
      gap: 15px;
      align-items: stretch;

      .footer-buttons {
        justify-content: center;
      }
    }
  }
}
</style>
