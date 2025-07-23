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

      <el-table-column label="采购运费" min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input
              disabled
              v-model="row.shippingFee"
              :formatter="erpPriceInputFormatter"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="采购杂费" min-width="80">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input-number
              v-model="row.otherFees"
              :controls="false"
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
import { erpPriceInputFormatter } from '@/utils';
const message = useMessage() // 消息弹窗

const props = defineProps<{
  items: undefined
  disabled: false
  ssb: number
  purchaseAuditStatus: number // 新增接收审核状态
}>()

const formLoading = ref(false) // 表单的加载中
const formData = ref([]) // 🔥 修复：应该是数组，不是对象
const formRules = reactive({
  count: [{ required: true, message: '产品数量不能为空', trigger: 'blur' }]
})
const formRef = ref([]) // 表单 Ref
const productList = ref<ProductVO[]>([]) // 产品列表
const comboProductList = ref<ComboVO[]>([]); // 组合产品列表
const selectProductRef = ref(); // 定义 ref 引用

const emit = defineEmits(['productIdChanged']);
// 计算运费的方法
const calculateShippingFee = (item) => {
  if (!item || !item.count || item.count === 0) {
    if (item) item.shippingFee = 0; // 设置为0而不是null
    return;
  }

  // 确保必要的字段都存在
  if (item.shippingFeeType === undefined || item.shippingFeeType === null) {
    return;
  }

  let newShippingFee = 0;

  if (item.shippingFeeType === 0) {
    // 固定运费
    newShippingFee = Number(item.fixedShippingFee) || 0;
  } else if (item.shippingFeeType === 1) {
    // 按件运费
    const additionalItemQuantity = Number(item.additionalItemQuantity) || 1;
    const additionalItemPrice = Number(item.additionalItemPrice) || 0;

    if (item.count <= additionalItemQuantity) {
      newShippingFee = additionalItemPrice;
    } else {
      const additionalUnits = Math.ceil((item.count - additionalItemQuantity) / additionalItemQuantity);
      newShippingFee = additionalItemPrice + additionalUnits * additionalItemPrice;
    }
  } else if (item.shippingFeeType === 2) {
    // 按重量
    const weight = Number(item.weight) || 0;
    const totalWeight = item.count * weight;
    const firstWeight = Number(item.firstWeight) || 0;
    const firstWeightPrice = Number(item.firstWeightPrice) || 0;
    const additionalWeight = Number(item.additionalWeight) || 1;
    const additionalWeightPrice = Number(item.additionalWeightPrice) || 0;

    if (totalWeight <= firstWeight) {
      newShippingFee = firstWeightPrice;
    } else {
      const additionalUnits = (totalWeight - firstWeight) / additionalWeight;
      newShippingFee = firstWeightPrice + additionalUnits * additionalWeightPrice;
    }
  }

  item.shippingFee = Number(newShippingFee.toFixed(2));
};

// 更新合计的方法
const updateTotalPrice = (item) => {
  if (!item) return;

  const price = Number(item.purchasePrice) || 0;
  const count = Number(item.count) || 0;
  const shippingFee = Number(item.shippingFee) || 0;
  const otherFees = item.otherFees !== undefined ? Number(item.otherFees) : 0;

  const total = price * count + shippingFee + otherFees;
  item.totalProductPrice = Number(total.toFixed(2));
  item.totalPurchaseAmount = Number(total.toFixed(2));
};

/** 初始化设置入库项 */
watch(
  () => props.items,
  async (val) => {
    formData.value = val|| []
  },
  { immediate: true }
)

// 监听父组件传递的产品数量变化
watch(() => props.ssb, (newVal, oldVal) => {
  if (!formData.value || !Array.isArray(formData.value)) {
    return;
  }

  formData.value.forEach((item, index) => {
    if (item) {
      item.count = newVal; // 更新子组件中的产品数量
      calculateShippingFee(item); // 重新计算运费
      updateTotalPrice(item); // 重新计算合计
    }
  });
}, { immediate: true });

// 监听子组件中采购其他费用的变化
watch(() => formData.value, (newVal) => {
  if (!newVal || !Array.isArray(newVal)) return;

  newVal.forEach((item, index) => {
    if (item) {
      calculateShippingFee(item); // 重新计算运费
      updateTotalPrice(item); // 重新计算合计
    }
  });
}, { deep: true });



const handleAdd = () => {
  if (formData.value.length >= 1) {
    message.warning('只能添加一条采购信息');
    return;
  }
  selectProductRef.value.open();
};

const handleDelete = (index: number) => {
  formData.value.splice(index, 1);
};

const handleProductSelected = (selectedProducts: any[]) => {
  if (formData.value.length >= 1) {
    message.warning('只能添加一条采购信息');
    return;
  }
  selectedProducts.forEach(product => {
    formData.value.push({
      productId: product.id, //产品id
      productName: product.name, //产品名称
      shippingCode: product.shippingCode, //发货编码
      purchaser: product.purchaser, //采购人员
      supplier: product.supplier, //供应商名
      purchasePrice: product.purchasePrice, //采购代发单价
      shippingFee: 1, //采购运费
      otherFees: undefined, //采购杂费
      totalPurchaseAmount: 1, //采购总额
      purchaseRemark:'', //采购备注
      shippingCode: product.shippingCode,

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
    emit('productIdChanged', {
      id: product.id,
      no: product.no
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
