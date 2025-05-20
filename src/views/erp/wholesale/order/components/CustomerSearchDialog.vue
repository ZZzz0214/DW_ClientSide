<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1080">
    <el-form :model="searchForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="客户编号">
            <el-input v-model="searchForm.id" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户名称">
            <el-input v-model="searchForm.name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button @click="handleSearch">查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="customerList" @selection-change="handleSelectionChange" ref="table">
      <el-table-column type="selection" width="55" />
      <el-table-column label="客户编号" prop="id" />
      <el-table-column label="客户名称" prop="name" />
      <el-table-column label="联系人" prop="contact" />
      <el-table-column label="联系电话" prop="mobile" />
    </el-table>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button @click="confirmSelection" type="primary">确 定</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, defineProps, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
import { CustomerApi } from '@/api/erp/sale/customer';
import { SalePriceApi } from '@/api/erp/sale/saleprice';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  comboProductId: {
    type: String,
    default: null,
  },
});

const dialogVisible = ref(props.visible);
watch(() => props.visible, (newValue) => {
  dialogVisible.value = newValue;
});

const emit = defineEmits(['customer-selected', 'update:visible']);

const dialogTitle = ref('选择客户');
const searchForm = reactive({
  id: '',
  name: '',
});
const customerList = ref<any[]>([]);
const selectedCustomer = ref<any>(null);

const handleSearch = async () => {
  try {
    const params = {
      id: searchForm.id,
      name: searchForm.name,
    };
    const response = await CustomerApi.searchCustomer(params);
    console.log("123333333");
    console.log(response);
    console.log(props.comboProductId);
    if (Array.isArray(response)) {
      customerList.value = response;
    } else {
      customerList.value = []; // 如果不是数组，清空列表
    }
  } catch (error) {
    ElMessage.error('查询失败');
  }
};

const handleSelectionChange = (selection: any[]) => {
  if (selection.length > 0) {
    selectedCustomer.value = selection[0];
  } else {
    selectedCustomer.value = null;
  }
};

const confirmSelection = async () => {
  if (!selectedCustomer.value) {
    ElMessage.warning('请选择一个客户');
    return;
  }

// 调用 SalePriceApi.searchSalePrice 方法
  const searchParams = {
    groupProductId: props.comboProductId,
    customerName: selectedCustomer.value.name,
  };
  try {
    const salePriceResult = await SalePriceApi.searchSalePrice(searchParams);
    console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzz')
    console.log(salePriceResult)
    console.log(salePriceResult[0].wholesalePrice)
    if (salePriceResult.length > 0) {
      // 如果搜索到出货单价，返回对应数据
      emit('customer-selected',  [
        {
          customerName: selectedCustomer.value.name,
          salePrice: salePriceResult[0].wholesalePrice,
          shippingFeeType: salePriceResult[0].shippingFeeType,
          fixedShippingFee: salePriceResult[0].fixedShippingFee,
          additionalItemQuantity: salePriceResult[0].additionalItemQuantity, //按件数量
          additionalItemPrice: salePriceResult[0].additionalItemPrice, //按件费用
          weight: salePriceResult[0].weight,
          firstWeight: salePriceResult[0].firstWeight,
          firstWeightPrice: salePriceResult[0].firstWeightPrice,
          additionalWeight: salePriceResult[0].additionalWeight,
          additionalWeightPrice: salePriceResult[0].additionalWeightPrice
        },
      ]);
    } else {
      // 如果没有搜索到，返回客户名称，出货单价为 null
      emit('customer-selected',  [
        {
          customerName: selectedCustomer.value.name,
          salePrice: null,
          shippingFeeType: null,
          fixedShippingFee: null,
          additionalItemQuantity: null, //按件数量
          additionalItemPrice: null, //按件费用
          weight: null,
          firstWeight: null,
          firstWeightPrice: null,
          additionalWeight: null,
          additionalWeightPrice: null
        },
      ]);
    }
  } catch (error) {
    emit('customer-selected', [
      {
        customerName: selectedCustomer.value.name,
        salePrice: null,
        shippingFeeType: null,
        fixedShippingFee: null,
        additionalItemQuantity: null, //按件数量
        additionalItemPrice: null, //按件费用
        weight: null,
        firstWeight: null,
        firstWeightPrice: null,
        additionalWeight: null,
        additionalWeightPrice: null
      },
    ]);
  }

  dialogVisible.value = false;
  emit('update:visible', false);
};


defineExpose({
  open: () => {
    dialogVisible.value = true;
  },
});
</script>