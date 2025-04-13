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

      <el-table-column label="产品名称"  min-width="120">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.originalProductName" />
          </el-form-item>
        </template>
      </el-table-column>

      <!-- 使用 formatProductType 方法格式化 -->
      <el-table-column label="产品类型"  min-width="110">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input
              disabled
              :value="formatProductType(row.type)"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="采购代发单价"  min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.purchasePrice" />
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
      <el-table-column label="采购运费"  min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.shippingFee" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="原表规格"  min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.originalStandard" />
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

      <el-table-column label="数量" prop="count" fixed="right" min-width="110">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.count`" :rules="formRules.count" class="mb-0px!">
            <el-input-number
              v-model="row.count"
              controls-position="right"
              :min="0.01"
              :precision="2"
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
              :min="0.01"
              :precision="2"
              class="!w-100%"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="金额" fixed="right" prop="totalProductPrice"  min-width="100">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.totalProductPrice`" class="mb-0px!">
            <el-input
              disabled
              v-model="row.totalProductPrice"
              :formatter="erpPriceInputFormatter"
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
import { StockApi } from '@/api/erp/stock/stock';
import {
  erpCountInputFormatter,
  erpPriceInputFormatter,
  erpPriceMultiply,
  getSumValue
} from '@/utils'

const props = defineProps<{
  items: undefined
  disabled: false
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  count: [{ required: true, message: '产品数量不能为空', trigger: 'blur' }]
})
const formRef = ref([]) // 表单 Ref
const productList = ref<ProductVO[]>([]) // 产品列表
const comboProductList = ref<ComboVO[]>([]); // 组合产品列表
const selectProductRef = ref(); // 定义 ref 引用

/** 初始化设置入库项 */
watch(
  () => props.items,
  async (val) => {
    formData.value = val
  },
  { immediate: true }
)

/** 监听合同产品变化，计算合同产品总价 */
watch(
  () => formData.value,
  (val) => {
    if (!val || val.length === 0) {
      return
    }
    // 循环处理
    val.forEach((item) => {
      item.totalProductPrice = erpPriceMultiply(item.purchasePrice, item.count) + erpPriceMultiply(item.otherFees, 1)
      if (item.totalProductPrice != null) {
        item.totalPrice = item.totalProductPrice
      } else {
        item.totalPrice = undefined
      }
    })
  },
  { deep: true }
)

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
  return sums
}

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
      shippingFee:  product.fixedShippingFee, //采购运费:只有固定运费
      originalStandard: product.type === 0 ? product.productDimensions : undefined, //原表规格,只有单品有
      shippingCode: product.shippingCode, //发货编码
      remark: product.remark, //备注
      count: 1, //数量
      otherFees: 1, //其他费用
      totalProductPrice: product.purchasePrice, //合计产品价格
      totalPrice: product.purchasePrice, //总价
      type: product.type, // 添加产品类型
    });
  });

};

/** 处理产品变更 */
const onChangeProduct = (productId, row) => {
  const product = productList.value.find((item) => item.id === productId);
  if (product) {
    // row.productUnitName = product.unitName;
    row.productBarCode = product.barCode;
    row.purchasePrice = product.purchasePrice;
    row.type = product.type; // 设置产品类型
  }
  // 加载库存
  setStockCount(row);
};

/** 加载库存 */
const setStockCount = async (row: any) => {
  if (!row.productId) {
    return
  }
  const count = await StockApi.getStockCount(row.productId)
  row.stockCount = count || 0
}

const formatProductType = (type: number) => {
  return type === 0 ? '单品' : '组合产品';
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
