<!-- 商品发布 - 合格证信息 -->
<template>
  <el-form
    ref="formRef"
    v-loading="formLoading"
    :disabled="isDetail"
    :model="formData"
    :rules="rules"
    label-width="120px"
  >
    <!-- 条形编号 -->
    <el-form-item label="条形编号" prop="barCode">
      <el-input
        v-model="formData.barCode"
        placeholder="请输入条形编号"
        class="w-80"
        :disabled="isDetail"
      />
    </el-form-item>

    <!-- 备案编号 -->
    <el-form-item label="备案编号" prop="productRecord">
      <el-input
        v-model="formData.productRecord"
        placeholder="请输入备案编号"
        class="w-80"
        :disabled="isDetail"
      />
    </el-form-item>

    <!-- 执行编号 -->
    <el-form-item label="执行编号" prop="executionCode">
      <el-input
        v-model="formData.executionCode"
        placeholder="请输入执行编号"
        class="w-80"
        :disabled="isDetail"
      />
    </el-form-item>

    <!-- 商标编号 -->
    <el-form-item label="商标编号" prop="trademarkCode">
      <el-input
        v-model="formData.trademarkCode"
        placeholder="请输入商标编号"
        class="w-80"
        :disabled="isDetail"
      />
    </el-form-item>
  </el-form>
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
import ProductAttributes from './ProductAttributes.vue'
import ProductPropertyAddForm from './ProductPropertyAddForm.vue'

import type { ProductVO } from '@/api/erp/product/product/index';
defineOptions({ name: 'ErpProductForm' })


// sku 相关属性校验规则
// const ruleConfig: RuleConfig[] = [
//   {
//     name: 'stock',
//     rule: (arg) => arg >= 0,
//     message: '商品库存必须大于等于 1 ！！！'
//   },
//   {
//     name: 'price',
//     rule: (arg) => arg >= 0.01,
//     message: '商品销售价格必须大于等于 0.01 元！！！'
//   },
//   {
//     name: 'marketPrice',
//     rule: (arg) => arg >= 0.01,
//     message: '商品市场价格必须大于等于 0.01 元！！！'
//   },
//   {
//     name: 'costPrice',
//     rule: (arg) => arg >= 0.01,
//     message: '商品成本价格必须大于等于 0.00 元！！！'
//   }
// ]

const message = useMessage() // 消息弹窗
const formLoading = ref(false)
const props = defineProps({
  propFormData: {
    type: Object as PropType<ProductVO>,
    default: () => {}
  },
  isDetail: propTypes.bool.def(false) // 是否作为详情组件
})
const attributesAddFormRef = ref() // 添加商品属性表单
const formRef = ref() // 表单 Ref
const propertyList = ref<PropertyAndValues[]>([]) // 商品属性列表
const skuListRef = ref() // 商品属性列表 Ref
const formData = reactive<ProductVO>({
  barCode: '', // 条形编号
  productRecord: '', // 备案编号
  executionCode: '', // 执行编号
  trademarkCode: '' // 商标编号
});
const rules = reactive({
  barCode: [{ required: true, message: '条形编号不能为空', trigger: 'blur' }],
  productRecord: [{ required: true, message: '备案编号不能为空', trigger: 'blur' }],
  executionCode: [{ required: true, message: '执行编号不能为空', trigger: 'blur' }],
  trademarkCode: [{ required: true, message: '商标编号不能为空', trigger: 'blur' }]
});

/** 将传进来的值赋值给 formData */
watch(
  () => props.propFormData,
  (data) => {
    if (!data) {
      return
    }
    copyValueToTarget(formData, data)
    // 将 SKU 的属性，整理成 PropertyAndValues 数组
    //propertyList.value = getPropertyList(data)
  },
  {
    immediate: true
  }
)

/** 表单校验 */
const emit = defineEmits(['update:activeName'])
// const validate = async () => {
//   if (!formRef) return
//   try {
//     // 校验 sku
//     skuListRef.value.validateSku()
//     await unref(formRef).validate()
//     // 校验通过更新数据
//     Object.assign(props.propFormData, formData)
//   } catch (e) {
//     message.error('【合格证信息】不完善，请填写相关信息')
//     emit('update:activeName', 'sku')
//     throw e // 目的截断之后的校验
//   }
// }
const validate = async () => {
  if (!formRef) return
  try {
    await unref(formRef)?.validate()
    // 校验通过更新数据
    Object.assign(props.propFormData, formData)
  } catch (e) {
    message.error('【合格证信息】不完善，请填写相关信息')
    emit('update:activeName', 'info')
    throw e // 目的截断之后的校验
  }
}
defineExpose({ validate })

/** 分销类型 */
// const changeSubCommissionType = () => {
//   // 默认为零，类型切换后也要重置为零
//   for (const item of formData.skus!) {
//     item.firstBrokeragePrice = 0
//     item.secondBrokeragePrice = 0
//   }
// }

/** 选择规格 */
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

/** 调用 SkuList generateTableData 方法*/
// const generateSkus = (propertyList: any[]) => {
//   skuListRef.value.generateTableData(propertyList)
// }
</script>
