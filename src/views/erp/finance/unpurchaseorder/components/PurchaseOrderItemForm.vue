<!--<template>-->
<!--  <el-form-->
<!--    ref="formRef"-->
<!--    :model="formData"-->
<!--    :rules="formRules"-->
<!--    v-loading="formLoading"-->
<!--    label-width="0px"-->
<!--    :inline-message="true"-->
<!--    :disabled="disabled"-->
<!--  >-->
<!--&lt;!&ndash;    <el-table :data="formData" show-summary :summary-method="getSummaries" class="-mt-10px">&ndash;&gt;-->
<!--    <el-table :data="formData"  class="-mt-10px">-->
<!--&lt;!&ndash;      <el-table-column label="序号" type="index" align="center" width="60" />&ndash;&gt;-->
<!--      <el-table-column label="采购人员" min-width="80">-->
<!--        <template #default="{ row }">-->
<!--          <el-form-item class="mb-0px!">-->
<!--            <el-input disabled v-model="row.purchaser" />-->
<!--          </el-form-item>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column label="供应商名" min-width="120">-->
<!--        <template #default="{ row }">-->
<!--          <el-form-item class="mb-0px!">-->
<!--            <el-input disabled v-model="row.supplier" />-->
<!--          </el-form-item>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column label="采购单价" min-width="80">-->
<!--        <template #default="{ row }">-->
<!--          <el-form-item class="mb-0px!">-->
<!--            <el-input-->
<!--              disabled-->
<!--              v-model="row.purchasePrice"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column label="采购运费" min-width="80">-->
<!--        <template #default="{ row }">-->
<!--          <el-form-item class="mb-0px!">-->
<!--            <el-input-->
<!--              disabled-->
<!--              v-model="row.shippingFee"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column label="采购杂费" min-width="80">-->
<!--        <template #default="{ row }">-->
<!--          <el-form-item class="mb-0px!">-->
<!--            <el-input-number-->
<!--              v-model="row.otherFees"-->
<!--              controls-position="right"-->
<!--              :min="0"-->
<!--              :precision="2"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column label="采购总额" min-width="80">-->
<!--        <template #default="{ row }">-->
<!--          <el-form-item class="mb-0px!">-->
<!--            <el-input-->
<!--              disabled-->
<!--              v-model="row.totalPurchaseAmount"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="采购备注" min-width="100">-->
<!--        <template #default="{ row }">-->
<!--          <el-form-item class="mb-0px!">-->
<!--            <el-input-->
<!--              v-model="row.purchaseRemark"-->
<!--              placeholder="请输入备注"-->
<!--              type="textarea"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column align="center" fixed="right" label="操作" width="60">-->
<!--        <template #default="{ $index }">-->
<!--          <el-button @click="handleDelete($index)" link>—</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->
<!--  </el-form>-->
<!--  <el-row justify="center" class="mt-3" v-if="!disabled">-->
<!--    <el-button @click="handleAdd" round>+ 添加采购产品</el-button>-->
<!--  </el-row>-->

<!--  &lt;!&ndash; 引入子组件 &ndash;&gt;-->
<!--  <SelectProduct ref="selectProductRef" @selected="handleProductSelected" />-->
<!--</template>-->
<!--<script setup lang="ts">-->
<!--import { ref, onMounted, watch } from 'vue';-->
<!--import SelectProduct from './SelectProduct.vue';-->
<!--import { ProductApi, ProductVO } from '@/api/erp/product/product';-->
<!--import { ComboApi, ComboVO } from '@/api/erp/product/combo';-->

<!--const props = defineProps<{-->
<!--  disabled: boolean-->
<!--  orderData: Object // 改为接收整个订单对象-->
<!--}>()-->
<!--const formLoading = ref(false) // 表单的加载中-->
<!--const formData = ref([])-->
<!--const formRules = reactive({-->
<!--  count: [{ required: true, message: '产品数量不能为空', trigger: 'blur' }]-->
<!--})-->
<!--const formRef = ref([]) // 表单 Ref-->
<!--const productList = ref<ProductVO[]>([]) // 产品列表-->
<!--const comboProductList = ref<ComboVO[]>([]); // 组合产品列表-->
<!--const selectProductRef = ref(); // 定义 ref 引用-->

<!--/** 初始化设置入库项 */-->
<!--watch(-->
<!--  () => props.orderData,-->
<!--  (newVal) => {-->
<!--    formData.value = [newVal]-->
<!--  },-->
<!--  { deep: true, immediate: true }-->
<!--)-->

<!--const handleProductSelected = (selectedProducts: any[]) => {-->
<!--  selectedProducts.forEach(product => {-->
<!--    formData.value.push({-->
<!--      productId: product.type === 0 ? product.id : undefined, // 如果是单品，设置productId-->
<!--      comboProductId: product.type === 1 ? product.id : undefined, // 如果是组合产品，设置comboProductId-->
<!--      originalProductName: product.name, // 产品名称-->
<!--      purchasePrice: product.purchasePrice, //采购单价-->
<!--      originalQuantity: product.totalQuantity, //原表数量-->
<!--      shippingFee: 1, //采购运费-->
<!--      originalStandard: product.type === 0 ? product.productDimensions : undefined, //原表规格,只有单品有-->
<!--      shippingCode: product.shippingCode, //发货编码-->
<!--      remark: product.remark, //备注-->
<!--      count: 1, //数量-->
<!--      otherFees: 1, //其他费用-->
<!--      totalProductPrice: product.purchasePrice, //合计产品价格-->
<!--      totalPrice: product.purchasePrice, //总价-->
<!--      type: product.type, // 添加产品类型-->
<!--      // 假设这些运费相关的字段已经存在于 product 对象中-->
<!--      shippingFeeType: product.shippingFeeType,-->
<!--      fixedShippingFee: product.fixedShippingFee,-->
<!--      firstItemQuantity: product.firstItemQuantity,-->
<!--      firstItemPrice: product.firstItemPrice,-->
<!--      additionalItemQuantity: product.additionalItemQuantity,-->
<!--      additionalItemPrice: product.additionalItemPrice,-->
<!--      weight: product.weight,-->
<!--      firstWeight: product.firstWeight,-->
<!--      firstWeightPrice: product.firstWeightPrice,-->
<!--      additionalWeight: product.additionalWeight,-->
<!--      additionalWeightPrice: product.additionalWeightPrice-->
<!--    });-->
<!--  });-->

<!--};-->


<!--const handleAdd = () => {-->
<!--  selectProductRef.value.open(); // 调用子组件的 open 方法-->
<!--};-->

<!--const handleDelete = (index: number) => {-->
<!--  formData.value.splice(index, 1);-->
<!--};-->


<!--/** 表单校验 */-->
<!--const validate = () => {-->
<!--  return formRef.value.validate()-->
<!--}-->
<!--defineExpose({ validate })-->

<!--/** 初始化 */-->
<!--onMounted(async () => {-->
<!--  productList.value = await ProductApi.getProductSimpleList();-->
<!--  comboProductList.value = await ComboApi.getComboSimpleList();-->
<!--});-->
<!--</script>-->
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
    <!--    <el-table :data="formData" show-summary :summary-method="getSummaries" class="-mt-10px">-->
    <el-table :data="formData"  class="-mt-10px">
      <!--      <el-table-column label="序号" type="index" align="center" width="60" />-->
      <el-table-column label="采购人员" min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.purchaser" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="供应商名" min-width="120">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.supplier" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="采购单价" min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input
              disabled
              v-model="row.purchasePrice"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="采购运费" min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input
              disabled
              v-model="row.shippingFee"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="采购杂费" min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input-number
              v-model="row.otherFees"
              controls-position="right"
              :min="0"
              :precision="2"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="采购总额" min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input
              disabled
              v-model="row.totalPurchaseAmount"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="采购备注" min-width="100">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input
              v-model="row.purchaseRemark"
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
    <el-button @click="handleAdd" round>+ 添加采购产品</el-button>
  </el-row>

  <!-- 引入子组件 -->
  <SelectProduct ref="selectProductRef" @selected="handleProductSelected" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import SelectProduct from './SelectProduct.vue';
import { ProductApi, ProductVO } from '@/api/erp/product/product';
import { ComboApi, ComboVO } from '@/api/erp/product/combo';

const props = defineProps<{
  disabled: boolean
  orderData: Object // 改为接收整个订单对象
}>()

const formData = ref([props.orderData]) // 将 orderData 包装成数组

// 修改 watch 监听
watch(
  () => props.orderData,
  (newVal) => {
    formData.value = [newVal]
  },
  { deep: true, immediate: true }
)

const formLoading = ref(false) // 表单的加载中
// const formData = ref([])
const formRules = reactive({
  count: [{ required: true, message: '产品数量不能为空', trigger: 'blur' }]
})
const formRef = ref([]) // 表单 Ref
const productList = ref<ProductVO[]>([]) // 产品列表
const comboProductList = ref<ComboVO[]>([]); // 组合产品列表
const selectProductRef = ref(); // 定义 ref 引用

/** 初始化设置入库项 */


/** 合计 */
// const getSummaries = (param: any) => {
//   const { columns, data } = param;
//   const sums: string[] = [];
//   columns.forEach((column, index: number) => {
//     if (index === 0) {
//       sums[index] = '合计';
//       return;
//     }
//     if (['count', 'shippingFee', 'totalProductPrice', 'otherFees', 'totalPrice'].includes(column.property)) {
//       const sum = getSumValue(data.map((item) => Number(item[column.property])));
//       sums[index] =
//         column.property === 'count' ? erpCountInputFormatter(sum) : erpPriceInputFormatter(sum);
//     } else {
//       sums[index] = '';
//     }
//   });
//   return sums
// }

const handleAdd = () => {
  selectProductRef.value.open(); // 调用子组件的 open 方法
};

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

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}
defineExpose({ validate })

/** 初始化 */
onMounted(async () => {
  productList.value = await ProductApi.getProductSimpleList();
  comboProductList.value = await ComboApi.getComboSimpleList();
});
</script>
