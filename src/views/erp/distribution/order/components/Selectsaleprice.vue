<template>
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="1080">
    <el-form :model="searchForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="组品编号">
            <el-input v-model="searchForm.groupProductId" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="组品名称">
            <el-input v-model="searchForm.productName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="组品简称">
            <el-input v-model="searchForm.productShortName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户名称">
            <el-input v-model="searchForm.customerName" placeholder="请输入客户名称" />
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
      <el-table-column label="客户名称" prop="customerName" />
      <el-table-column label="出货代发单价" prop="distributionPrice" />
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
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { SalePriceApi } from '@/api/erp/sale/saleprice';

const dialogVisible = ref(false);
const dialogTitle = ref('选择销售价格');

const props = defineProps({
  comboProductId: {
    type: String,
    default: null,
  },
});

const searchForm = reactive({
  groupProductId: props.comboProductId || '', // 默认值为传递的 comboProductId
  productName: '',
  productShortName: '',
  createTime: '',
  customerName: '', // 用户可以输入的客户名称
});

const salePriceList = ref<any[]>([]);
const selectedProducts = ref<any[]>([]);

// 默认搜索逻辑
const handleDefaultSearch = async () => {
  try {
    const searchParams = {
      groupProductId: searchForm.groupProductId,
    };
    console.log("222222222222")
    console.log(searchParams)
    salePriceList.value = await SalePriceApi.searchSalePrice(searchParams);
  } catch (error) {
    ElMessage.error('默认查询失败');
  }
};

// 用户点击搜索按钮时的搜索逻辑
const handleSearch = async () => {
  try {
    const searchParams = {
      groupProductId: searchForm.groupProductId,
      customerName: searchForm.customerName, // 包含用户输入的客户名称
    };
    salePriceList.value = await SalePriceApi.searchSalePrice(searchParams);
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
  open: (comboProductId) => {
    dialogVisible.value = true;
    // 设置 comboProductId
    searchForm.groupProductId = comboProductId;
    handleDefaultSearch(); // 打开对话框时执行默认搜索
  },
});

const emit = defineEmits(['selected']);

onMounted(() => {
  // 如果需要在组件加载时进行默认搜索，可以在这里调用 handleDefaultSearch
});
</script>