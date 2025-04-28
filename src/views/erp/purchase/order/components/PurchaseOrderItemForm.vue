<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="120px"
    :inline-message="true"
    :disabled="disabled"
  >
    <div
      v-for="(item, index) in formData"
      :key="index"
      class="form-row"
    >
      <el-form-item label="产品名称">
        <el-input disabled v-model="item.originalProductName" />
      </el-form-item>
      <el-form-item label="产品类型">
        <el-input disabled :value="formatProductType(item.type)" />
      </el-form-item>
      <el-form-item label="采购代发单价">
        <el-input disabled v-model="item.purchasePrice" />
      </el-form-item>
      <el-form-item label="原表数量">
        <el-input disabled v-model="item.originalQuantity" />
      </el-form-item>
      <el-form-item label="采购运费">
        <el-input disabled v-model="item.shippingFee" />
      </el-form-item>
      <el-form-item label="原表规格">
        <el-input disabled v-model="item.originalStandard" />
      </el-form-item>
      <el-form-item label="发货编码">
        <el-input disabled v-model="item.shippingCode" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="item.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="数量">
        <el-input-number
          v-model="item.count"
          controls-position="right"
          :min="0.01"
          :precision="2"
          class="!w-100%"
        />
      </el-form-item>
      <el-form-item label="其他费用">
        <el-input-number
          v-model="item.otherFees"
          controls-position="right"
          :min="0.01"
          :precision="2"
          class="!w-100%"
        />
      </el-form-item>
      <el-form-item label="金额">
        <el-input
          disabled
          v-model="item.totalProductPrice"
          :formatter="erpPriceInputFormatter"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleDelete(index)" link>删除</el-button>
      </el-form-item>
    </div>
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
      console.log('------------[]][][][][][][][]')
      console.log(item)
      // 计算运费
      if (item.shippingFeeType === 0) {
        // 固定运费
        item.shippingFee = item.fixedShippingFee;
      } else if (item.shippingFeeType === 1) {
        // 按件运费
        if (item.count <= item.firstItemQuantity) {
          item.shippingFee = item.firstItemPrice;
        } else {
          item.shippingFee = item.firstItemPrice + Math.ceil((item.count - item.firstItemQuantity) / item.additionalItemQuantity) * item.additionalItemPrice;
        }
      } else if (item.shippingFeeType === 2) {
        // 按重量
        const totalWeight = item.count * item.weight;
        if (totalWeight <= item.firstWeight) {
          item.shippingFee = item.firstWeightPrice;
        } else {
          item.shippingFee = item.firstWeightPrice + Math.ceil((totalWeight - item.firstWeight) / item.additionalWeight) * item.additionalWeightPrice;
        }
      }
      item.totalProductPrice = erpPriceMultiply(item.purchasePrice, item.count) + erpPriceMultiply(item.otherFees, 1) + erpPriceMultiply(item.shippingFee, 1);
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
    if (['count', 'shippingFee', 'totalProductPrice', 'otherFees', 'totalPrice'].includes(column.property)) {
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
