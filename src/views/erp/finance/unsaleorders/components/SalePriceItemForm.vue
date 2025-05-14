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
            <el-input v-model="row.salesperson" />
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

      <el-table-column label="出货运费" min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.saleShippingFee" />
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
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { SalePriceApi, SalePriceVO } from '@/api/erp/sale/saleprice';
import Selectsaleprice from './Selectsaleprice.vue';

const props = defineProps<{
  disabled: boolean
  orderData: Object // 改为接收整个订单对象
}>()

const formLoading = ref(false);
const formData = ref([props.orderData]) // 将 orderData 包装成数组
const formRules = reactive({
  count: [{ required: true, message: '产品数量不能为空', trigger: 'blur' }]
});
const formRef = ref([]);
const selectProductRef = ref();
const salepriceList = ref<SalePriceVO[]>([]); // 销售价格表列表

const comboProductId = ref(null);

const setComboProductId = (id) => {
  comboProductId.value = id;
};

// 修改 watch 监听
watch(
  () => props.orderData,
  (newVal) => {
    formData.value = [newVal]
  },
  { deep: true, immediate: true }
)


// 添加按钮操作
const handleAdd = () => {
  selectProductRef.value.open(comboProductId.value);
};

// 删除按钮操作
const handleDelete = (index: number) => {
  formData.value.splice(index, 1);
};

const handleProductSelected = (selectedProducts: any[]) => {
  selectedProducts.forEach(product => {
    formData.value.push({
      productId: product.type === 0 ? product.id : undefined, // 如果是单品，设置productId
      comboProductId: product.type === 1 ? product.id : undefined, // 如果是组合产品，设置comboProductId
      originalProductName: product.name, // 产品名称
      purchasePrice: product.purchasePrice, //采购单价
      originalQuantity: product.totalQuantity, //原表数量
      shippingFee: 1, //采购运费
      originalStandard: product.type === 0 ? product.productDimensions : undefined, //原表规格,只有单品有
      shippingCode: product.shippingCode, //发货编码
      remark: product.remark, //备注
      count: 1, //数量
      otherFees: 1, //其他费用
      totalProductPrice: product.purchasePrice, //合计产品价格
      totalPrice: product.purchasePrice, //总价
      type: product.type, // 添加产品类型
      // 假设这些运费相关的字段已经存在于 product 对象中
      shippingFeeType: product.shippingFeeType,
      fixedShippingFee: product.fixedShippingFee,
      firstItemQuantity: product.firstItemQuantity,
      firstItemPrice: product.firstItemPrice,
      additionalItemQuantity: product.additionalItemQuantity,
      additionalItemPrice: product.additionalItemPrice,
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
