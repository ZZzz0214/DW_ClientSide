<!-- 商品发布 - 价格信息 -->
<!--<template>-->
<!--  <el-form-->
<!--    ref="formRef"-->
<!--    v-loading="formLoading"-->
<!--    :disabled="isDetail"-->
<!--    :model="formData"-->
<!--    :rules="rules"-->
<!--    label-width="120px"-->
<!--  >-->
<!--    <el-form-item label="分销类型" prop="subCommissionType">-->
<!--      <el-radio-group-->
<!--        v-model="formData.subCommissionType"-->
<!--        class="w-80"-->
<!--        @change="changeSubCommissionType"-->
<!--      >-->
<!--        <el-radio :value="false">默认设置</el-radio>-->
<!--        <el-radio :value="true" class="radio">单独设置</el-radio>-->
<!--      </el-radio-group>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="商品规格" prop="specType">-->
<!--      <el-radio-group v-model="formData.specType" class="w-80" @change="onChangeSpec">-->
<!--        <el-radio :value="false" class="radio">单规格</el-radio>-->
<!--        <el-radio :value="true">多规格</el-radio>-->
<!--      </el-radio-group>-->
<!--    </el-form-item>-->
<!--    &lt;!&ndash; 多规格添加&ndash;&gt;-->
<!--    <el-form-item v-if="!formData.specType">-->
<!--      <SkuList-->
<!--        ref="skuListRef"-->
<!--        :prop-form-data="formData"-->
<!--        :property-list="propertyList"-->
<!--        :rule-config="ruleConfig"-->
<!--      />-->
<!--    </el-form-item>-->
<!--    <el-form-item v-if="formData.specType" label="商品属性">-->
<!--      <el-button class="mb-10px mr-15px" @click="attributesAddFormRef.open">添加属性</el-button>-->
<!--      <ProductAttributes-->
<!--        :is-detail="isDetail"-->
<!--        :property-list="propertyList"-->
<!--        @success="generateSkus"-->
<!--      />-->
<!--    </el-form-item>-->
<!--    <template v-if="formData.specType && propertyList.length > 0">-->
<!--      <el-form-item v-if="!isDetail" label="批量设置">-->
<!--        <SkuList :is-batch="true" :prop-form-data="formData" :property-list="propertyList" />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="规格列表">-->
<!--        <SkuList-->
<!--          ref="skuListRef"-->
<!--          :is-detail="isDetail"-->
<!--          :prop-form-data="formData"-->
<!--          :property-list="propertyList"-->
<!--          :rule-config="ruleConfig"-->
<!--        />-->
<!--      </el-form-item>-->
<!--    </template>-->
<!--  </el-form>-->

<!--  &lt;!&ndash; 商品属性添加 Form 表单 &ndash;&gt;-->
<!--  <ProductPropertyAddForm ref="attributesAddFormRef" :propertyList="propertyList" />-->
<!--</template>-->
<template>
  <el-form
    ref="formRef"
    v-loading="formLoading"
    :disabled="isDetail"
    :model="formData"
    :rules="rules"
    label-width="160px"
  >
    <!-- 采购人员 -->
<!--    <el-form-item label="采购人员" prop="purchaser">-->
<!--      <el-input-->
<!--        v-model="formData.purchaser"-->
<!--        placeholder="请输入采购人员信息"-->
<!--        @focus="openPurchaserSearch"-->
<!--        readonly-->
<!--        class="w-80"-->
<!--      />-->
<!--    </el-form-item>-->

    <!-- 供应商名 -->
    <el-form-item label="供应商名" prop="supplier">
      <el-input
        v-model="formData.supplier"
        placeholder="请输入供应商名"
        class="w-80"
        @click="openSupplierSearch"
        readonly
      />
    </el-form-item>

    <!-- 采购单价 -->
    <el-form-item label="采购单价" prop="purchasePrice">
      <div style="display: flex; align-items: center;">
      <el-input-number
        v-model="formData.purchasePrice"
        :min="0"
        placeholder="请输入采购单价"
        style="width: 200px"
      />
        <span style="margin-left: 25px;">元</span>
      </div>
    </el-form-item>

    <!-- 批发单价 -->
    <el-form-item label="批发单价" prop="wholesalePrice">
      <div style="display: flex; align-items: center;">
      <el-input-number
        v-model="formData.wholesalePrice"
        :min="0"
        placeholder="请输入批发单价"
        style="width: 200px"
      />
        <span style="margin-left: 25px;">元</span>
      </div>
    </el-form-item>

    <!-- 备注信息 -->
    <el-form-item label="备注信息" prop="remark">
      <el-input
        v-model="formData.remark"
        placeholder="请输入备注信息"
        class="w-80"
      />
    </el-form-item>

    <!-- 对外最低采购单价 -->
    <el-form-item label="对外最低出货单价" prop="minPurchasePrice">
      <div style="display: flex; align-items: center;">
      <el-input-number
        v-model="formData.minPurchasePrice"
        :min="0"
        placeholder="对外最低出货单价"
        style="width: 200px"
      />
        <span style="margin-left: 25px;">元</span>
      </div>
    </el-form-item>

    <!-- 对外最低批发单价 -->
<!--    <el-form-item label="对外最低批发单价" prop="minWholesalePrice">-->
<!--      <el-input-number-->
<!--        v-model="formData.minWholesalePrice"-->
<!--        :min="0"-->
<!--        placeholder="请输入对外最低批发单价"-->
<!--        class="w-80"-->
<!--      />-->
<!--    </el-form-item>-->
  </el-form>

  <!-- 采购人员搜索弹窗 -->
  <PurchaserSearchDialog
    v-model:visible="purchaserSearchDialogVisible"
    @purchaser-selected="handlePurchaserSelected"
    ref="purchaserSearchDialog"
  />

  <!-- 供应商搜索弹窗 -->
  <SupplierSearchDialog
    v-model:visible="supplierSearchDialogVisible"
    @supplier-selected="handleSupplierSelected"
    ref="supplierSearchDialog"
  />
</template>
<script lang="ts" setup>
import { PropType } from 'vue'
import { copyValueToTarget } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import {
  getPropertyList,
  PropertyAndValues,
  RuleConfig,
  SkuList
} from '@/views/mall/product/spu/components/index'
import PurchaserSearchDialog from './PurchaserSearchDialog.vue'; // 引入采购人员搜索弹窗组件
import SupplierSearchDialog from './SupplierSearchDialog.vue'; // 引入供应商搜索弹窗组件
// import ProductAttributes from './ProductAttributes.vue'
// import ProductPropertyAddForm from './ProductPropertyAddForm.vue'
import type { ProductVO } from '@/api/erp/product/product/index';

defineOptions({ name: 'ProductSpuSkuForm' })

const message = useMessage() // 消息弹窗
const formLoading = ref(false)
const props = defineProps({
  propFormData: {
    type: Object as PropType<ProductVO>,
    default: () => {}
  },
  isDetail: propTypes.bool.def(false) // 是否作为详情组件
})
const formRef = ref() // 表单 Ref
const purchaserSearchDialogVisible = ref(false); // 采购人员搜索弹窗的显示状态
const supplierSearchDialogVisible = ref(false); // 供应商搜索弹窗的显示状态

const formData = reactive<ProductVO>({
  purchaser: '', // 采购人员
  supplier: '', // 供应商名
  purchasePrice: 0, // 采购单价
  wholesalePrice: 0, // 批发单价
  remark: '', // 备注信息
  minPurchasePrice: 0, // 对外最低采购单价
  minWholesalePrice: 0, // 对外最低批发单价
})
const rules = reactive({
  supplier: [{ required: true, message: '供应商名不能为空', trigger: 'blur' }],
  purchasePrice: [{ required: true, message: '采购单价不能为空', trigger: 'blur' }],
  wholesalePrice: [{ required: true, message: '批发单价不能为空', trigger: 'blur' }],
});

const openPurchaserSearch = () => {
  purchaserSearchDialogVisible.value = true;
};

const handlePurchaserSelected = (purchaser: any) => {
  formData.purchaser = purchaser.name; // 填充采购人员名称
};

const openSupplierSearch = () => {
  supplierSearchDialogVisible.value = true;
};

const handleSupplierSelected = (supplier: any) => {
  formData.supplier = supplier.name; // 填充供应商名称
};

/** 将传进来的值赋值给 formData */
watch(
  () => props.propFormData,
  (data) => {
    if (!data) {
      return
    }
    copyValueToTarget(formData, data)
    // 将 SKU 的属性，整理成 PropertyAndValues 数组
    // propertyList.value = getPropertyList(data)
  },
  {
    immediate: true
  }
)

/** 表单校验 */
const emit = defineEmits(['update:activeName']);
const validate = async () => {
  if (!formRef.value) return;
  try {
    await unref(formRef)?.validate()
    Object.assign(props.propFormData, formData);
  } catch (e) {
    message.error('【库存价格】不完善，请填写相关信息');
    emit('update:activeName', 'price');
    throw e; // 目的截断之后的校验
  }
};
defineExpose({ validate })

// /** 分销类型 */
// const changeSubCommissionType = () => {
//   // 默认为零，类型切换后也要重置为零
//   for (const item of formData.skus!) {
//     item.firstBrokeragePrice = 0
//     item.secondBrokeragePrice = 0
//   }
// }
//
// /** 选择规格 */
// const onChangeSpec = () => {
//   // 重置商品属性列表
//   propertyList.value = []
//   // 重置sku列表
//   formData.skus = [
//     {
//       price: 0,
//       marketPrice: 0,
//       costPrice: 0,
//       barCode: '',
//       picUrl: '',
//       stock: 0,
//       weight: 0,
//       volume: 0,
//       firstBrokeragePrice: 0,
//       secondBrokeragePrice: 0
//     }
//   ]
// }

// /** 调用 SkuList generateTableData 方法*/
// const generateSkus = (propertyList: any[]) => {
//   skuListRef.value.generateTableData(propertyList)
// };
</script>
