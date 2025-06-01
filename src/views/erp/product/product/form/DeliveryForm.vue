<!-- 商品发布 - 快递售后信息 -->
<!--<template>-->
<!--  <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" :disabled="isDetail">-->
<!--    <el-form-item label="配送方式" prop="deliveryTypes">-->
<!--      <el-checkbox-group v-model="formData.deliveryTypes" class="w-80">-->
<!--        <el-checkbox-->
<!--          v-for="dict in getIntDictOptions(DICT_TYPE.TRADE_DELIVERY_TYPE)"-->
<!--          :key="dict.value"-->
<!--          :value="dict.value"-->
<!--        >-->
<!--          {{ dict.label }}-->
<!--        </el-checkbox>-->
<!--      </el-checkbox-group>-->
<!--    </el-form-item>-->
<!--    <el-form-item-->
<!--      label="运费模板"-->
<!--      prop="deliveryTemplateId"-->
<!--      v-if="formData.deliveryTypes?.includes(DeliveryTypeEnum.EXPRESS.type)"-->
<!--    >-->
<!--      <el-select placeholder="请选择运费模板" v-model="formData.deliveryTemplateId" class="w-80">-->
<!--        <el-option-->
<!--          v-for="item in deliveryTemplateList"-->
<!--          :key="item.id"-->
<!--          :label="item.name"-->
<!--          :value="item.id"-->
<!--        />-->
<!--      </el-select>-->
<!--    </el-form-item>-->
<!--  </el-form>-->
<!--</template>-->
<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="120px"
    :disabled="isDetail"
  >
    <!-- 发货地址 -->
    <el-form-item label="发货地址" prop="shippingAddress" >
      <el-input
        v-model="formData.shippingAddress"
        placeholder="请输入发货地址"
        class="w-80"
        :disabled="isDetail"
      />
    </el-form-item>

    <!-- 退货地址 -->
    <el-form-item label="退货地址" prop="returnAddress">
      <el-input
        v-model="formData.returnAddress"
        placeholder="请输入退货地址"
        class="w-80"
        :disabled="isDetail"
      />
    </el-form-item>

    <!-- 快递公司 -->
    <el-form-item label="快递公司" prop="logisticsCompany">
      <el-input
        v-model="formData.logisticsCompany"
        placeholder="请输入快递公司"
        class="w-80"
        :disabled="isDetail"
      />
    </el-form-item>

    <!-- 不发货区 -->
    <el-form-item label="不发货区" prop="nonshippingArea">
      <el-input
        v-model="formData.nonshippingArea"
        placeholder="请输入不发货区"
        class="w-80"
        :disabled="isDetail"
      />
    </el-form-item>

    <!-- 加邮地区 -->
    <el-form-item label="加邮地区" prop="addonShippingArea">
      <el-input
        v-model="formData.addonShippingArea"
        placeholder="请输入加邮地区"
        class="w-80"
        :disabled="isDetail"
      />
    </el-form-item>

    <!-- 售后标准 -->
    <el-form-item label="售后标准" prop="afterSalesStandard">
      <el-input
        type="textarea"
        v-model="formData.afterSalesStandard"
        placeholder="请输入售后标准"
        class="w-80"
        :disabled="isDetail"
      />
    </el-form-item>

    <!-- 售后话术 -->
    <el-form-item label="售后话术" prop="afterSalesScript">
      <el-input
        type="textarea"
        v-model="formData.afterSalesScript"
        placeholder="请输入售后话术"
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
import type { ProductVO } from '@/api/erp/product/product/index';

import * as ExpressTemplateApi from '@/api/mall/trade/delivery/expressTemplate'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { DeliveryTypeEnum } from '@/utils/constants'

defineOptions({ name: 'ErpProductDeliveryForm' })

const message = useMessage() // 消息弹窗

const props = defineProps({
  propFormData: {
    type: Object as PropType<ProductVO>,
    default: () => {}
  },
  isDetail: propTypes.bool.def(false) // 是否作为详情组件
})
const formRef = ref() // 表单 Ref
const formData = reactive<ProductVO>({
  shippingAddress: '', // 发货地址
  returnAddress: '', // 退货地址
  logisticsCompany: '', // 快递公司
  nonshippingArea: '', // 不发货区
  addonShippingArea: '', // 加邮地区
  afterSalesStandard: '', // 售后标准
  afterSalesScript: '' // 售后话术
});
const rules = reactive({
  // shippingAddress: [{ required: true, message: '发货地址不能为空', trigger: 'blur' }],
  // returnAddress: [{ required: true, message: '退货地址不能为空', trigger: 'blur' }],
  // logisticsCompany: [{ required: true, message: '快递公司不能为空', trigger: 'blur' }],
  // nonshippingArea: [{ required: true, message: '不发货区不能为空', trigger: 'blur' }],
  // addonShippingArea: [{ required: true, message: '加邮地区不能为空', trigger: 'blur' }],
  // afterSalesStandard: [{ required: true, message: '售后标准不能为空', trigger: 'blur' }],
  // afterSalesScript: [{ required: true, message: '售后话术不能为空', trigger: 'blur' }]
});

/** 将传进来的值赋值给 formData */
watch(
  () => props.propFormData,
  (data) => {
    if (!data) {
      return
    }
    copyValueToTarget(formData, data)
  },
  {
    immediate: true
  }
)

/** 表单校验 */
const emit = defineEmits(['update:activeName'])
const validate = async () => {
  if (!formRef) return
  try {
    await unref(formRef)?.validate()
    // 校验通过更新数据
    Object.assign(props.propFormData, formData)
  } catch (e) {
    message.error('【快递售后信息】不完善，请填写相关信息')
    emit('update:activeName', 'delivery')
    throw e // 目的截断之后的校验
  }
}
defineExpose({ validate })

/** 初始化 */
const deliveryTemplateList = ref([]) // 运费模版
onMounted(async () => {
  deliveryTemplateList.value = await ExpressTemplateApi.getSimpleTemplateList()
})
</script>
