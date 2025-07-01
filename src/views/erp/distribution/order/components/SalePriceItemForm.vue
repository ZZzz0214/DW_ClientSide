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
          <el-form-item class="mb-0px!">
            <el-input
              disabled
              v-model="row.saleShippingFee"
              :formatter="erpPriceInputFormatter"
            />
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
import { ComboApi } from '@/api/erp/product/combo';
import { erpPriceInputFormatter } from '@/utils';
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
  mode?: string // 添加mode属性，支持'detail'、'edit'、'create'
  comboProductId?: number // 组品ID
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

const comboProductId = ref(props.comboProductId || null);
const tableKey = ref(0); // 定义一个响应式的 key
const isInitialLoad = ref(true); // 标记是否为初始加载
const setComboProductId = (id) => {
  comboProductId.value = id;
};

// 监听props中的comboProductId变化
watch(() => props.comboProductId, (newVal) => {
  comboProductId.value = newVal;
}, { immediate: true });

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
  if (!item) return;

  // 确保数量是有效的数字
  const count = Number(item.count) || 0;

  if (count === 0) {
    item.saleShippingFee = 0;
    return;
  }

  // 检查运费类型是否有效
  if (item.shippingFeeType === undefined || item.shippingFeeType === null) {
    item.saleShippingFee = 0;
    return;
  }

  // 确保运费类型是数字
  const shippingFeeType = Number(item.shippingFeeType);

  if (isNaN(shippingFeeType)) {
    item.saleShippingFee = 0;
    return;
  }

  let calculatedFee = 0;

  if (shippingFeeType === 0) {
    // 固定运费
    calculatedFee = Number(item.fixedShippingFee) || 0;
  } else if (shippingFeeType === 1) {
    // 按件运费 - 修正计算逻辑，与后端保持一致
    const additionalItemQuantity = Number(item.additionalItemQuantity) || 1;
    const additionalItemPrice = Number(item.additionalItemPrice) || 0;

    // 使用与后端一致的计算逻辑：Math.ceil(数量 / 续件数量) * 续件价格
    const additionalUnits = Math.ceil(count / additionalItemQuantity);
    calculatedFee = additionalUnits * additionalItemPrice;
  } else if (shippingFeeType === 2) {
    // 按重量
    const weight = Number(item.weight) || 0;
    const firstWeight = Number(item.firstWeight) || 1;
    const firstWeightPrice = Number(item.firstWeightPrice) || 0;
    const additionalWeight = Number(item.additionalWeight) || 1;
    const additionalWeightPrice = Number(item.additionalWeightPrice) || 0;

    const totalWeight = count * weight;

    if (totalWeight <= firstWeight) {
      calculatedFee = firstWeightPrice;
    } else {
      const additionalWeightCount = (totalWeight - firstWeight) / additionalWeight;
      calculatedFee = firstWeightPrice + additionalWeightCount * additionalWeightPrice;
    }
  }

  // 确保运费是数字并四舍五入到2位小数
  item.saleShippingFee = Number(Number(calculatedFee).toFixed(2));
};

// 更新出货总额的方法：产品数量×出货单价+出货运费+出货杂费
const updateTotalSaleAmount = (item) => {
  if (!item) return;

  const price = Number(item.salePrice) || 0;
  const count = Number(item.count) || 0;
  const shippingFee = Number(item.saleShippingFee) || 0;
  const otherFees = Number(item.saleOtherFees) || 0;

  // 计算公式：产品数量×出货单价+出货运费+出货杂费
  const totalAmount = price * count + shippingFee + otherFees;
  item.totalSaleAmount = Number(totalAmount.toFixed(2));
};

// 重新计算运费并更新总额的方法（完整重新计算）
const recalculateShippingAndTotal = (item) => {
  calculateSaleShippingFee(item); // 重新计算运费
  updateTotalSaleAmount(item); // 重新计算总额
};

// 初始化设置出库项
watch(
  () => props.items,
  (val) => {
    formData.value = val || [];

    // 在详情模式下，如果总额为空则根据现有数据计算
    if (props.mode === 'detail') {
      formData.value.forEach((item) => {
        if (item && (!item.totalSaleAmount || item.totalSaleAmount === 0 || item.totalSaleAmount === '0')) {
          // 使用后端返回的原始数据进行简单计算
          const price = Number(item.salePrice) || 0;
          const count = Number(item.count) || 0;
          const shippingFee = Number(item.saleShippingFee) || 0;
          const otherFees = Number(item.saleOtherFees) || 0;

          // 简单计算：单价 × 数量 + 运费 + 杂费
          item.totalSaleAmount = Number((price * count + shippingFee + otherFees).toFixed(2));
        }
      });
      return;
    }

    // 在编辑模式下，如果有运费信息但没有计算过，则重新计算
    if (props.mode === 'update' && formData.value.length > 0) {
      const item = formData.value[0];
      if (item.shippingFeeType !== undefined && item.shippingFeeType !== null &&
          item.count > 0 && item.salePrice > 0) {
        // 确保使用正确的计算逻辑
        calculateSaleShippingFee(item);
        updateTotalSaleAmount(item);
      }
    }
  },
  { immediate: true }
);

// 监听父组件传递的产品数量变化
watch(() => props.ssb, (newVal, oldVal) => {
  if (!formData.value || !formData.value.length) return;
  // 在详情模式下跳过运费重新计算
  if (props.mode === 'detail') return;
  // 如果数量没有实际变化，跳过处理
  if (newVal === oldVal) return;

  formData.value.forEach((item, index) => {
    if (item) {
      const currentCount = item.count;

      // 只有当数量确实需要更新时才处理
      if (currentCount !== newVal) {
        // 更新数量
        item.count = newVal;

        // 检查是否有运费配置信息
        if (item.shippingFeeType !== undefined && item.shippingFeeType !== null) {
          // 直接使用现有的运费配置重新计算，避免重复获取
          calculateSaleShippingFee(item);
          updateTotalSaleAmount(item);
        } else {
          // 如果没有运费配置，只更新总额
          updateTotalSaleAmount(item);
        }
      }
    }
  });
});

// 监听出货杂费变化，只在杂费变化时重新计算总额
watch(() => formData.value?.map(item => item?.saleOtherFees), (newVals, oldVals) => {
  if (!formData.value || !newVals || !oldVals) return;
  // 在详情模式下跳过重新计算
  if (props.mode === 'detail') return;

  // 检查杂费是否真的发生了变化
  const hasChanged = newVals.some((newVal, index) => newVal !== oldVals[index]);
  if (!hasChanged) return;

  formData.value.forEach((item, index) => {
    if (item && newVals[index] !== oldVals[index]) {
      // 只重新计算总额，不重新计算运费
      updateTotalSaleAmount(item);
    }
  });
}, { deep: false });

// 添加按钮操作
const handleAdd = () => {
  if (formData.value.length >= 1) {
    message.warning('只能添加一条出货信息');
    return;
  }

  if (!comboProductId.value) {
    message.warning('请先选择采购产品');
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
    // 确定出货单价
    let salePrice = 0;
    if (product.salePrice !== undefined && product.salePrice !== null) {
      salePrice = Number(product.salePrice);
    } else if (product.distributionPrice !== undefined && product.distributionPrice !== null) {
      salePrice = Number(product.distributionPrice);
    }

    // 创建新的销售项
    const newSaleItem = {
      salesperson: undefined, //销售人员
      customerName: product.customerName, //客户名称
      salePrice: salePrice, //出货单价（使用代发价格）
      saleShippingFee: 0, //出货运费（将被重新计算）
      saleOtherFees: 0, //销售杂费
      totalSaleAmount: 0, //销售总额（将被重新计算）
      saleRemark: '', //出货备注
      transferPerson: '', //中转人员

      count: props.ssb || 0, //数量
      // 运费相关的字段
      shippingFeeType: product.shippingFeeType !== undefined ? Number(product.shippingFeeType) : 0,
      fixedShippingFee: product.fixedShippingFee !== undefined ? Number(product.fixedShippingFee) : 0,
      additionalItemQuantity: product.additionalItemQuantity !== undefined ? Number(product.additionalItemQuantity) : 1, //按件数量
      additionalItemPrice: product.additionalItemPrice !== undefined ? Number(product.additionalItemPrice) : 0, //按件费用
      weight: product.weight !== undefined ? Number(product.weight) : 0,
      firstWeight: product.firstWeight !== undefined ? Number(product.firstWeight) : 1,
      firstWeightPrice: product.firstWeightPrice !== undefined ? Number(product.firstWeightPrice) : 0,
      additionalWeight: product.additionalWeight !== undefined ? Number(product.additionalWeight) : 1,
      additionalWeightPrice: product.additionalWeightPrice !== undefined ? Number(product.additionalWeightPrice) : 0
    };

    // 添加到表单数据
    formData.value.push(newSaleItem);

    // 立即计算运费和总额
    calculateSaleShippingFee(newSaleItem);
    updateTotalSaleAmount(newSaleItem);
  });

  // 强制重新渲染表格
  tableKey.value++;
};

// 表单校验
const validate = () => {
  return formRef.value.validate();
};

// 重新计算运费
const recalculateShipping = () => {
  // 在详情模式下跳过运费重新计算
  if (props.mode === 'detail') {
    return;
  }

  formData.value?.forEach((item, index) => {
    if (item.shippingFeeType !== undefined && item.shippingFeeType !== null) {
      calculateSaleShippingFee(item); // 重新计算出货运费
    }
    updateTotalSaleAmount(item); // 重新计算出货总额
  });
  tableKey.value++; // 强制重新渲染表格
};

// 获取销售价格表运费信息的方法
const getSaleShippingInfo = async (groupProductId, customerName) => {
  try {
    const searchParams = {
      groupProductId: groupProductId,
      customerName: customerName,
    };
    const salePriceResult = await SalePriceApi.searchSalePrice(searchParams);

    if (salePriceResult && salePriceResult.length > 0) {
      // 获取组品重量信息
      let comboWeight = 0;
      try {
        const comboInfo = await ComboApi.getCombo(groupProductId);

        if (comboInfo) {
          if (comboInfo.weight !== undefined && comboInfo.weight !== null) {
            comboWeight = Number(comboInfo.weight) || 0;
          }
        }
      } catch (error) {
        console.error('获取组品重量失败:', error);
      }

      return {
        shippingFeeType: salePriceResult[0].shippingFeeType,
        fixedShippingFee: salePriceResult[0].fixedShippingFee,
        additionalItemQuantity: salePriceResult[0].additionalItemQuantity,
        additionalItemPrice: salePriceResult[0].additionalItemPrice,
        weight: comboWeight, // 使用从组品信息获取的重量
        firstWeight: salePriceResult[0].firstWeight,
        firstWeightPrice: salePriceResult[0].firstWeightPrice,
        additionalWeight: salePriceResult[0].additionalWeight,
        additionalWeightPrice: salePriceResult[0].additionalWeightPrice
      };
    }
  } catch (error) {
    console.error('获取销售价格表运费信息失败:', error);
  }
  return null;
};

// 更新运费信息的方法
const updateShippingInfo = (newShippingInfo) => {
  if (formData.value && formData.value.length > 0) {
    const item = formData.value[0];

    // 更新运费相关字段
    Object.assign(item, newShippingInfo);

    // 重新计算运费和总额
    calculateSaleShippingFee(item);
    updateTotalSaleAmount(item);

    // 强制重新渲染
    tableKey.value++;
  }
};



defineExpose({
  setComboProductId,
  validate,
  recalculateShipping,
  updateShippingInfo
});

// 初始化
onMounted(async () => {
  salepriceList.value = await SalePriceApi.getSalePriceSimpleList();
});
</script>
