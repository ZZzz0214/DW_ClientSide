<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
    :disabled="disabled"
  >
    <el-table :data="formData" class="-mt-10px">
      <el-table-column label="销售人员" min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input
              v-model="row.salesperson"
              placeholder="请选择销售人员"
              @focus="openSalespersonSearch(row)"
              readonly
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="客户名称" min-width="120">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.customerName" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="出货单价" min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.salePrice" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="销售物流费用" min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input
              disabled
              v-model="row.saleLogisticsFee"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="销售货拉拉费用" min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input-number
              v-model="row.saleTruckFee"
              controls-position="right"
              :min="0"
              :precision="2"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="出货其他费用" min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input-number
              v-model="row.saleOtherFees"
              controls-position="right"
              :min="0"
              :precision="2"
              @change="() => updateTotalSaleAmount(row)"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="出货总额" min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.totalSaleAmount" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column align="center" fixed="right" label="操作" width="60">
        <template #default="{ $index }">
          <el-button @click="handleDelete($index)" link>—</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>

  <el-row justify="center" class="mt-3" v-if="!disabled">
    <el-button @click="handleAdd" round>+ 添加出货产品</el-button>
  </el-row>

  <!-- 引入子组件 -->
  <Selectsaleprice ref="selectProductRef" @selected="handleProductSelected" :comboProductId="comboProductId"/>
  <!-- 销售人员搜索弹窗 -->
  <SalespersonSearchDialog
    v-model:visible="salespersonSearchDialogVisible"
    @salesperson-selected="handleSalespersonSelected"
    ref="salespersonSearchDialog"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { SalePriceApi, SalePriceVO } from '@/api/erp/sale/saleprice';
import {
  erpCountInputFormatter,
  erpPriceInputFormatter,
  erpPriceMultiply,
  getSumValue
} from '@/utils';
import Selectsaleprice from './Selectsaleprice.vue';
import SalespersonSearchDialog from './SalespersonSearchDialog.vue'; // 引入销售人员搜索弹窗组件

const props = defineProps<{
  items: any[];
  disabled: boolean;
  ssb: number; // 父组件传递的产品数量
}>();

const formLoading = ref(false);
const formData = ref(props.items);
const formRules = reactive({
  count: [{ required: true, message: '产品数量不能为空', trigger: 'blur' }]
});
const formRef = ref([]);
const selectProductRef = ref();
const salepriceList = ref<SalePriceVO[]>([]); // 销售价格表列表
const salespersonSearchDialogVisible = ref(false); // 销售人员搜索弹窗的显示状态

const comboProductId = ref(null);

const setComboProductId = (id) => {
  comboProductId.value = id;
};

const openSalespersonSearch = (row) => {
  salespersonSearchDialogVisible.value = true;
  row.salesperson = ''; // 清空当前销售人员
};

const handleSalespersonSelected = (salesperson: any) => {
  formData.value.forEach((row) => {
    if (!row.salesperson) {
      row.salesperson = salesperson.name; // 填充销售人员名称
    }
  });
};

// 初始化设置出库项
watch(
  () => props.items,
  (val) => {
    formData.value = val;
  },
  { immediate: true }
);

// 监听父组件传递的产品数量变化
watch(() => props.ssb, (newVal) => {
  formData.value.forEach((item) => {
    item.count = newVal; // 更新子组件中的产品数量
    calculateSaleShippingFee(item); // 重新计算出货运费
    updateTotalSaleAmount(item); // 重新计算出货总额
  });
}, { immediate: true });

// 监听子组件中出货其他费用的变化
watch(() => formData.value, (newVal) => {
  newVal.forEach((item) => {
    calculateSaleShippingFee(item); // 重新计算出货运费
    updateTotalSaleAmount(item); // 重新计算出货总额
  });
}, { deep: true });

// 计算出货运费的方法
const calculateSaleShippingFee = (item) => {
  if (item.shippingFeeType === 0) {
    // 固定运费
    item.saleLogisticsFee = item.fixedShippingFee;
  } else if (item.shippingFeeType === 1) {
    // 按件运费
    if (item.count <= item.additionalItemQuantity) {
      item.saleLogisticsFee = item.additionalItemPrice;
    } else {
      item.saleLogisticsFee = item.additionalItemPrice + Math.ceil((item.count - item.additionalItemQuantity) / item.additionalItemQuantity) * item.additionalItemPrice;
    }
  } else if (item.shippingFeeType === 2) {
    // 按重量
    const totalWeight = item.count * item.weight;
    if (totalWeight <= item.firstWeight) {
      item.saleLogisticsFee = item.firstWeightPrice;
    } else {
      item.saleLogisticsFee = item.firstWeightPrice + Math.ceil((totalWeight - item.firstWeight) / item.additionalWeight) * item.additionalWeightPrice;
    }
  }
};

// 更新出货总额的方法
const updateTotalSaleAmount = (item) => {
  item.totalSaleAmount =
    item.salePrice * item.count + item.saleLogisticsFee + item.saleOtherFees + item.saleTruckFee;
};

// 添加按钮操作
const handleAdd = () => {
  selectProductRef.value.open(comboProductId.value);
};

// 删除按钮操作
const handleDelete = (index: number) => {
  formData.value.splice(index, 1);
};

// 产品选择后的处理
const handleProductSelected = (selectedProducts: any[]) => {
  selectedProducts.forEach(product => {
    formData.value.push({
      salesperson: undefined, //销售人员
      customerName: product.customerName, //客户名称
      salePrice: product.wholesalePrice, //出货批发单价
      saleLogisticsFee: 1, //销售物流费用
      saleTruckFee: 1, //销售货拉拉费
      saleOtherFees: 1, //销售其他费用
      totalSaleAmount: 1, //销售总额

      count: 1, //数量
      // 假设这些运费相关的字段已经存在于 product 对象中
      shippingFeeType: product.shippingFeeType,
      fixedShippingFee: product.fixedShippingFee,
      additionalItemQuantity: product.additionalItemQuantity, //按件数量
      additionalItemPrice: product.additionalItemPrice, //按件费用
      weight: product.weight,
      firstWeight: product.firstWeight,
      firstWeightPrice: product.firstWeightPrice,
      additionalWeight: product.additionalWeight,
      additionalWeightPrice: product.additionalWeightPrice
    });
  });
};

// 表单校验
const validate = () => {
  return formRef.value.validate();
};
defineExpose({
  setComboProductId,
  validate
});

// 初始化
onMounted(async () => {
  salepriceList.value = await SalePriceApi.getSalePriceSimpleList();
});
</script>