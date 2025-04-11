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
    <el-table :data="formData" show-summary :summary-method="getSummaries" class="-mt-10px">
      <el-table-column label="序号" type="index" align="center" width="60" />

      <el-table-column label="产品名称" min-width="180">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.productName" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="产品编号" min-width="120">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.groupProductId" />
          </el-form-item>
        </template>
      </el-table-column>

<!--      <el-table-column label="单位" min-width="80">-->
<!--        <template #default="{ row }">-->
<!--          <el-form-item class="mb-0px!">-->
<!--            <el-input disabled v-model="row.productUnitName" />-->
<!--          </el-form-item>-->
<!--        </template>-->
<!--      </el-table-column>-->

      <el-table-column label="出货单价" fixed="right" min-width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.productPrice`" class="mb-0px!">
            <el-input-number
              v-model="row.productPrice"
              controls-position="right"
              :min="0.01"
              :precision="2"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="原表数量"  min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.originalQuantity" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="出货运费"  min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.shippingFee" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="发货编码"  min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.shippingCode" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.remark`" class="mb-0px!">
            <el-input v-model="row.remark" placeholder="请输入备注" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="数量" prop="count" fixed="right" min-width="140">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.count`" :rules="formRules.count" class="mb-0px!">
            <el-input-number
              v-model="row.count"
              controls-position="right"
              :min="0.001"
              :precision="3"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="其他费用" prop="otherFees" fixed="right" min-width="140">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.otherFees`" class="mb-0px!">
            <el-input-number
              v-model="row.otherFees"
              controls-position="right"
              :min="0.001"
              :precision="3"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="金额" prop="totalProductPrice" fixed="right" min-width="100">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.totalProductPrice" :formatter="erpPriceInputFormatter" />
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
    <el-button @click="handleAdd" round>+ 添加销售产品</el-button>
  </el-row>

  <!-- 引入子组件 -->
  <Selectsaleprice ref="selectProductRef" @selected="handleProductSelected" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { SalePriceApi, SalePriceVO } from '@/api/erp/sale/saleprice';  //销售价格表
import {
  erpCountInputFormatter,
  erpPriceInputFormatter,
  erpPriceMultiply,
  getSumValue
} from '@/utils';
import Selectsaleprice from './Selectsaleprice.vue';


const props = defineProps<{
  items: any;
  disabled: boolean;
}>();
const formLoading = ref(false);
const formData = ref([]);
const formRules = reactive({
  count: [{ required: true, message: '产品数量不能为空', trigger: 'blur' }],
});
const formRef = ref([]);
const selectProductRef = ref();
const salepriceList = ref<SalePriceVO[]>([]); // 销售价格表列表

/** 初始化设置出库项 */
watch(
  () => props.items,
  async (val) => {
    formData.value = val;
  },
  { immediate: true }
);

/** 监听合同产品变化，计算合同产品总价 */
watch(
  () => formData.value,
  (val) => {
    if (!val || val.length === 0) {
      return;
    }
    val.forEach((item) => {
      item.totalProductPrice = erpPriceMultiply(item.productPrice, item.count) + erpPriceMultiply(item.otherFees, 1);
      if (item.totalProductPrice != null) {
        item.totalPrice = item.totalProductPrice
      } else {
        item.totalPrice = undefined
      }
    });
  },
  { deep: true }
);

/** 合计 */
const getSummaries = (param: any) => {
  const { columns, data } = param;
  const sums: string[] = [];
  columns.forEach((column, index: number) => {
    if (index === 0) {
      sums[index] = '合计';
      return;
    }
    if (['count', 'totalProductPrice', 'otherFees', 'totalPrice'].includes(column.property)) {
      const sum = getSumValue(data.map((item) => Number(item[column.property])));
      sums[index] =
        column.property === 'count' ? erpCountInputFormatter(sum) : erpPriceInputFormatter(sum);
    } else {
      sums[index] = '';
    }
  });
  return sums;
};

/** 添加按钮操作 */
const handleAdd = () => {
  selectProductRef.value.open();
};

/** 删除按钮操作 */
const handleDelete = (index: number) => {
  formData.value.splice(index, 1);
};

/** 处理产品选择 */
const handleProductSelected = (selectedProducts: any[]) => {
  selectedProducts.forEach((product) => {
    formData.value.push({
      groupProductId: product.groupProductId, //组品id
      productName: product.productName, // 产品名称
      productPrice: product.purchasePrice, //出货单价
      originalQuantity:  product.availableStockQuantity , //原表数量
      shippingFee:  product.fixedShippingFee, //出货运费:只有固定运费
      shippingCode: product.shippingCode, //出货编码
      remark: '',//备注
      count: 1, //数量
      otherFees: 1, //其他费用
      totalProductPrice: product.purchasePrice, //合计产品价格
      totalPrice: product.purchasePrice, //总价
    });
  });
};

/** 表单校验 */
const validate = () => {
  return formRef.value.validate();
};
defineExpose({ validate });

/** 初始化 */
onMounted(async () => {
  salepriceList.value = await SalePriceApi.getSalePriceSimpleList();
});
</script>