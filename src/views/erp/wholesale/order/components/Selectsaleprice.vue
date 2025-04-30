<template>
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="1080">
    <el-form :model="searchForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="组品编号">
            <el-input v-model="searchForm.groupProductId" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="组品名称">
            <el-input v-model="searchForm.productName" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="组品简称">
            <el-input v-model="searchForm.productShortName" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="searchForm.createTime"
              type="date"
              value-format="x"
              placeholder="选择创建时间"
              class="!w-1/1"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-button @click="handleSearch">查询</el-button>
    </el-form>

    <el-table :data="salePriceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="组品编号" prop="groupProductId" />
      <el-table-column label="组品名称" prop="productName" />
      <el-table-column label="组品简称" prop="productShortName" />
      <el-table-column label="出货批发单价" prop="wholesalePrice" />
      <el-table-column label="备注信息" prop="remark" />
      <el-table-column label="运费信息" prop="fixedShippingFee" />
    </el-table>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button @click="confirmSelection" type="primary">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { SalePriceApi } from '@/api/erp/sale/saleprice';

const dialogVisible = ref(false);
const dialogTitle = ref('选择销售价格');

const searchForm = reactive({
  groupProductId: '',
  productName: '',
  productShortName: '',
  createTime: '',
});

const salePriceList = ref<any[]>([]);
const selectedProducts = ref<any[]>([]);

const handleSearch = async () => {
  try {
    salePriceList.value = await SalePriceApi.searchSalePrice(searchForm);
  } catch (error) {
    ElMessage.error('查询失败');
  }
};

const handleSelectionChange = (selection: any[]) => {
  selectedProducts.value = selection;
};

const confirmSelection = () => {
  emit('selected', selectedProducts.value);
  dialogVisible.value = false;
};

defineExpose({
  open: () => {
    dialogVisible.value = true;
  },
});

const emit = defineEmits(['selected']);
</script>