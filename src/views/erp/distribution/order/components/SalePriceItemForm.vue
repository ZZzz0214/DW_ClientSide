<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
    :disabled="disabled|| (saleAuditStatus === 20)"
  >
    <el-table :data="formData" :key="tableKey" class="-mt-10px">
      <el-table-column label="销售人员" min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input
              v-model="row.salesperson"
              placeholder="请选择销售人员"
              @click="openSalespersonSearch(row)"
              readonly
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="客户名称" min-width="80">
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

      <el-table-column label="出货运费" min-width="80">
        <template #default="{ row }">
<!--          <el-form-item class="mb-0px!">-->
<!--            <el-input-number-->
<!--              v-model="row.saleShippingFee"-->
<!--              controls-position="right"-->
<!--              :min="0"-->
<!--              :precision="2"-->
<!--              disabled-->
<!--            />-->
<!--          </el-form-item>-->
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.saleShippingFee" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="出货杂费" min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input-number
              v-model="row.saleOtherFees"
              :controls="false"
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

      <el-table-column label="出货备注" min-width="100">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input
              v-model="row.saleRemark"
              placeholder="请输入备注"
              type="textarea"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="中转人员" min-width="100">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input
              v-model="row.transferPerson"
              placeholder="请输入备注"
              type="textarea"
            />
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
    <el-button @click="handleAdd" round>+ 选择客户</el-button>
  </el-row>

  <!-- 引入子组件 -->
<!--  <Selectsaleprice ref="selectProductRef" @selected="handleProductSelected" :comboProductId="comboProductId"/>-->
  <CustomerSearchDialog
    ref="selectCustomRef"
    @customer-selected="handleProductSelected"
    :comboProductId="comboProductId"/>

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
import SalespersonSearchDialog from './SalespersonSearchDialog.vue'; // 引入销售人员搜索弹窗组件
import CustomerSearchDialog from './CustomerSearchDialog.vue'; // 引入客户人员搜索弹窗组件
const message = useMessage() // 消息弹窗
// const props = defineProps<{
//   items: any[];
//   disabled: boolean;
//   ssb: number; // 父组件传递的产品数量
// }>();

const props = defineProps<{
  items: any[]
  disabled: false
  ssb: number
  saleAuditStatus: number // 新增接收审核状态
}>()

const formLoading = ref(false);
const formData = ref(props.items);
// const formData = ref({
//   // ...其他字段
//   purchaseAuditStatus: 0, // 采购审核状态
//   saleAuditStatus: 0, // 销售审核状态
//   // ...其他字段
// })
const formRules = reactive({
  salesperson: [{ required: true, message: '销售人员不能为空', trigger: 'blur' }]
});
const formRef = ref([]);
const selectProductRef = ref();
const selectCustomRef = ref();
const salepriceList = ref<SalePriceVO[]>([]); // 销售价格表列表
const salespersonSearchDialogVisible = ref(false); // 销售人员搜索弹窗的显示状态

const comboProductId = ref(null);
const tableKey = ref(0); // 定义一个响应式的 key
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
      row.salesperson = salesperson.salespersonName; // 填充销售人员名称
    }
  });
  tableKey.value++; // 强制重新渲染表格
};
//计算出货运费的方法
const calculateSaleShippingFee = (item) => {
  if (!item || !item.count || item.count === 0) {
    if (item) item.saleShippingFee = 0; // 设置为0而不是null
    return;
  }
  
  if (!item.salePrice && item.salePrice !== 0) {
    item.saleShippingFee = 0;
    return;
  }

  if (item.shippingFeeType === 0) {
    // 固定运费
    item.saleShippingFee = item.fixedShippingFee;
  } else if (item.shippingFeeType === 1) {
    // 按件运费
    if (item.count <= item.additionalItemQuantity) {
      item.saleShippingFee = item.additionalItemPrice;
    } else {
      item.saleShippingFee = item.additionalItemPrice + Math.ceil((item.count - item.additionalItemQuantity) / item.additionalItemQuantity) * item.additionalItemPrice;
    }
  } else if (item.shippingFeeType === 2) {
    // 按重量
    const totalWeight = item.count * item.weight;
    if (totalWeight <= item.firstWeight) {
      item.saleShippingFee = item.firstWeightPrice;
    } else {
      item.saleShippingFee = item.firstWeightPrice + Math.ceil((totalWeight - item.firstWeight) / item.additionalWeight) * item.additionalWeightPrice;
    }
  } else {
    // 如果没有指定运费类型，默认为0
    item.saleShippingFee = 0;
  }
};

// 更新出货总额的方法
const updateTotalSaleAmount = (item) => {
  if (!item) return;
  
  const price = Number(item.salePrice) || 0;
  const count = Number(item.count) || 0;
  const shippingFee = Number(item.saleShippingFee) || 0;
  const otherFees = Number(item.saleOtherFees) || 0;

  item.totalSaleAmount = price * count + shippingFee + otherFees;
  item.totalSaleAmount = Number(item.totalSaleAmount.toFixed(2));
};

// 初始化设置出库项
watch(
  () => props.items,
  (val) => {
    formData.value = val || [];
  },
  { immediate: true }
);

// 监听父组件传递的产品数量变化
watch(() => props.ssb, (newVal) => {
  if (!formData.value) return;
  formData.value.forEach((item) => {
    if (item) {
      item.count = newVal; // 更新子组件中的产品数量
      calculateSaleShippingFee(item); // 重新计算出货运费
      updateTotalSaleAmount(item); // 重新计算出货总额
    }
  });
}, { immediate: true });

// 监听子组件中出货其他费用的变化
watch(() => formData.value, (newVal) => {
  if (!newVal) return;
  newVal.forEach((item) => {
    if (item) {
      calculateSaleShippingFee(item); // 重新计算出货运费
      updateTotalSaleAmount(item); // 重新计算出货总额
    }
  });
}, { deep: true });

// 添加按钮操作
const handleAdd = () => {
  // selectProductRef.value.open(comboProductId.value);

  if (formData.value.length >= 1) {
    message.warning('只能添加一条出货信息');
    return;
  }
  selectCustomRef.value.open();
};

// 删除按钮操作
const handleDelete = (index: number) => {
  formData.value.splice(index, 1);
};

// 产品选择后的处理
const handleProductSelected = (selectedProducts: any[]) => {
  if (formData.value.length >= 1) {
    message.warning('只能添加一条出货信息');
    return;
  }
  selectedProducts.forEach(product => {
    console.log(product)
    formData.value.push({
      salesperson: undefined, //销售人员
      customerName: product.customerName, //客户名称
      salePrice: product.salePrice, //出货单价
      saleShippingFee: 0, //出货运费
      saleOtherFees: 0, //销售杂费
      totalSaleAmount: 1, //销售总额
      saleRemark:'', //出货备注

      count: props.ssb, //数量
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
  console.log('nnnnnnnnnnnnnnnnnnnnnnnnnnnnn')
};

// 表单校验
const validate = () => {
  return formRef.value.validate();
};

// 重新计算运费
const recalculateShipping = () => {
  console.log('重新计算运费被调用')
  formData.value?.forEach((item) => {
    console.log('计算运费前的item:', item)
    calculateSaleShippingFee(item); // 重新计算出货运费
    updateTotalSaleAmount(item); // 重新计算出货总额
    console.log('计算运费后的item:', item)
  });
  tableKey.value++; // 强制重新渲染表格
};

defineExpose({
  setComboProductId,
  validate,
  recalculateShipping
});

// 初始化
onMounted(async () => {
  salepriceList.value = await SalePriceApi.getSalePriceSimpleList();
});
</script>
