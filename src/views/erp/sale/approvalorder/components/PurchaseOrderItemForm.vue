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
    <el-button @click="handleAdd" round>+ 添加采购产品</el-button>
  </el-row>

  <!-- 引入子组件 -->
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
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
