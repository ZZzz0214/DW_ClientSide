<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
    :disabled="disabled|| (purchaseAuditStatus === 20)"
  >
<el-table :data="formData" class="-mt-10px">
      <el-table-column label="采购人员" min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input disabled v-model="row.purchaser" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="供应商名" min-width="80">
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

      <el-table-column label="采购货拉拉费" min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input-number
              v-model="row.truckFee"
              controls-position="right"
              :precision="2"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="采购物流费用" min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input-number
              v-model="row.logisticsFee"
              controls-position="right"
              :precision="2"
              @change="updateTotalPrice(row)"
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
  ssb: number
  purchaseAuditStatus: number // 新增接收审核状态
}>()

const formLoading = ref(false) // 表单的加载中
// const formData = ref([])
const formData = ref({
  // ...其他字段
  purchaseAuditStatus: 0, // 采购审核状态
  saleAuditStatus: 0, // 销售审核状态
  // ...其他字段
})
const formRules = reactive({
  count: [{ required: true, message: '产品数量不能为空', trigger: 'blur' }]
})
const formRef = ref([]) // 表单 Ref
const productList = ref<ProductVO[]>([]) // 产品列表
const comboProductList = ref<ComboVO[]>([]); // 组合产品列表
const selectProductRef = ref(); // 定义 ref 引用

const emit = defineEmits(['productIdChanged']);
/** 初始化设置入库项 */
watch(
  () => props.items,
  async (val) => {
    formData.value = val
  },
  { immediate: true }
)

// 监听父组件传递的产品数量变化
watch(() => props.ssb, (newVal) => {
  formData.value.forEach((item) => {
    item.count = newVal; // 更新子组件中的产品数量
    //calculateShippingFee(item); // 重新计算运费
    updateTotalPrice(item); // 重新计算合计
  });
}, { immediate: true });

// 监听子组件中采购其他费用的变化
watch(() => formData.value, (newVal) => {
  newVal.forEach((item) => {
    //calculateShippingFee(item); // 重新计算运费
    updateTotalPrice(item); // 重新计算合计
  });
}, { deep: true });

// 计算运费的方法
const calculateShippingFee = (item) => {
  console.log('7777777777777777777777777')
  console.log(item.count)
  if (!item.count || item.count === 0) {
    item.shippingFee = 0; // 设置为null而不是0
    return;
  }
  if (item.shippingFeeType === 0) {
    // 固定运费
    item.logisticsFee = item.fixedShippingFee;
  } else if (item.shippingFeeType === 1) {
    // 按件运费
    if (item.count <= item.additionalItemQuantity) {
      item.logisticsFee = item.additionalItemPrice;
    } else {
      item.logisticsFee = item.additionalItemPrice + Math.ceil((item.count - item.additionalItemQuantity) / item.additionalItemQuantity) * item.additionalItemPrice;
    }
  } else if (item.shippingFeeType === 2) {
    // 按重量
    const totalWeight = item.count * item.weight;
    if (totalWeight <= item.firstWeight) {
      item.logisticsFee = item.firstWeightPrice;
    } else {
      item.logisticsFee = item.firstWeightPrice + Math.ceil((totalWeight - item.firstWeight) / item.additionalWeight) * item.additionalWeightPrice;
    }
  }
};



// 更新合计的方法
const updateTotalPrice = (item) => {
  item.totalProductPrice =
   item.purchasePrice * item.count + item.logisticsFee + item.otherFees + item.truckFee;
 item.totalPurchaseAmount = Number(item.totalProductPrice.toFixed(2));
};
// 更新合计的方法
// const updateTotalPrice = (item) => {
//   const total = item.purchasePrice * item.count + item.shippingFee + item.otherFees;
//   item.totalProductPrice = Number(total.toFixed(2));
//   item.totalPurchaseAmount = Number(total.toFixed(2));
// };



const handleAdd = () => {
  selectProductRef.value.open(); // 调用子组件的 open 方法
};

const handleDelete = (index: number) => {
  formData.value.splice(index, 1);
};

const handleProductSelected = (selectedProducts: any[]) => {
  selectedProducts.forEach(product => {
    formData.value.push({
      productId: product.id, //产品id
      productName: product.name, //产品名称
      purchaser: product.purchaser, //采购人员
      supplier: product.supplier, //供应商名
      purchasePrice: product.wholesalePrice, //采购批发单价
      logisticsFee: 0, //物流费用
      truckFee: 0, //货拉拉费
      otherFees: 0, //采购杂费
      totalPurchaseAmount: 1, //采购总额
      purchaseRemark:'', //采购备注

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
    emit('productIdChanged', product.id);
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
