<!-- 商品发布 - 运费信息 -->
<template>
  <el-form
    ref="formRef"
    v-loading="formLoading"
    :disabled="isDetail"
    :model="formData"
    :rules="rules"
    label-width="120px"
  >
    <!-- 运费类型 -->
    <el-form-item label="运费类型" prop="shippingFeeType">
      <el-radio-group v-model="formData.shippingFeeType" @change="changeShippingFeeType">
        <el-radio :label="0">固定运费</el-radio>
        <el-radio :label="1">按件</el-radio>
        <el-radio :label="2">按重量</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 固定运费 -->
    <el-form-item
      v-if="formData.shippingFeeType === 0"
      label="固定运费"
      prop="fixedShippingFee"
    >
      <div style="display: flex; align-items: center;">
      <el-input
        v-model="formData.fixedShippingFee"
        placeholder="请输入固定运费"
        :disabled="isDetail"
      />
      <span style="margin-left: 25px;">元</span>
      </div>
    </el-form-item>

    <!-- 按件 - 按件数量 -->
    <el-form-item
      v-if="formData.shippingFeeType === 1"
      label="按件数量"
      prop="additionalItemQuantity"
    >
      <div style="display: flex; align-items: center;">
      <el-input
        v-model="formData.additionalItemQuantity"
        placeholder="请输入按件数量"
        :disabled="isDetail"
      />
        <span style="margin-left: 25px;">个</span>
      </div>
    </el-form-item>

    <!-- 按件 - 按件价格 -->
    <el-form-item
      v-if="formData.shippingFeeType === 1"
      label="按件价格"
      prop="additionalItemPrice"
    >
      <div style="display: flex; align-items: center;">
      <el-input
        v-model="formData.additionalItemPrice"
        placeholder="请输入按件价格"
        :disabled="isDetail"
      />
        <span style="margin-left: 25px;">元</span>
      </div>
    </el-form-item>

    <!-- 按重量 - 首重重量 -->
    <el-form-item
      v-if="formData.shippingFeeType === 2"
      label="首重重量"
      prop="firstWeight"
    >
      <div style="display: flex; align-items: center;">
      <el-input
        v-model="formData.firstWeight"
        placeholder="请输入首重重量"
        :disabled="isDetail"
      />
        <span style="margin-left: 25px;">g</span>
      </div>
    </el-form-item>

    <!-- 按重量 - 首重价格 -->
    <el-form-item
      v-if="formData.shippingFeeType === 2"
      label="首重价格"
      prop="firstWeightPrice"
    >
      <div style="display: flex; align-items: center;">
      <el-input
        v-model="formData.firstWeightPrice"
        placeholder="请输入首重价格"
        :disabled="isDetail"
      />
        <span style="margin-left: 25px;">元</span>
      </div>
    </el-form-item>

    <!-- 按重量 - 续重重量 -->
    <el-form-item
      v-if="formData.shippingFeeType === 2"
      label="续重重量"
      prop="additionalWeight"
    >
      <div style="display: flex; align-items: center;">
      <el-input
        v-model="formData.additionalWeight"
        placeholder="请输入续重重量"
        :disabled="isDetail"
      />
        <span style="margin-left: 25px;">g</span>
      </div>
    </el-form-item>

    <!-- 按重量 - 续重价格 -->
    <el-form-item
      v-if="formData.shippingFeeType === 2"
      label="续重价格"
      prop="additionalWeightPrice"
    >
      <div style="display: flex; align-items: center;">
      <el-input
        v-model="formData.additionalWeightPrice"
        placeholder="请输入续重价格"
        :disabled="isDetail"
      />
        <span style="margin-left: 25px;">元</span>
      </div>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { copyValueToTarget } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import type { ProductVO } from '@/api/erp/product/product/index'

defineOptions({ name: 'ProductshippingcostForm' })

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
// const formData = reactive<ProductVO>({
//   shippingFeeType: 0, // 运费类型
//   fixedShippingFee: null, // 固定运费
//   additionalItemQuantity: null, // 续件数量
//   additionalItemPrice: null, // 续件价格
//   firstWeight: null, // 首重重量
//   firstWeightPrice: null, // 首重价格
//   additionalWeight: null, // 续重重量
//   additionalWeightPrice: null // 续重价格
// })
const formData = reactive({
  shippingFeeType: 0 as number,
  fixedShippingFee: null as number | null,
  additionalItemQuantity: null as number | null,
  additionalItemPrice: null as number | null,
  firstWeight: null as number | null,
  firstWeightPrice: null as number | null,
  additionalWeight: null as number | null,
  additionalWeightPrice: null as number | null
}) as ProductVO
const rules = reactive({
  shippingFeeType: [{ required: true, message: '运费类型不能为空', trigger: 'blur' }]
})

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
  const form = unref(formRef)
  if (!form) {
    message.error('表单未初始化')
    return
  }
  try {
    await form.validate()
    // 校验通过更新数据
    Object.assign(props.propFormData, formData)
  } catch (e) {
    message.error('请完善运费信息')
    emit('update:activeName', 'shippingcost')
    throw e // 目的截断之后的校验
  }
}
defineExpose({ validate })

/** 运费类型切换 */
const changeShippingFeeType = () => {
  // 根据运费类型重置相关字段
  if (formData.shippingFeeType === 0) {
    formData.fixedShippingFee = null
  } else if (formData.shippingFeeType === 1) {
    formData.additionalItemQuantity = null
    formData.additionalItemPrice = null
  } else if (formData.shippingFeeType === 2) {
    formData.firstWeight = null
    formData.firstWeightPrice = null
    formData.additionalWeight = null
    formData.additionalWeightPrice = null
  }
  // 更新校验规则
  updateRules()
}

/** 动态更新校验规则 */
const updateRules = () => {
  const newRules = {
    shippingFeeType: [{ required: true, message: '运费类型不能为空', trigger: 'blur' }]
  }

  if (formData.shippingFeeType === 0) {
    newRules.fixedShippingFee = [{ required: true, message: '固定运费不能为空', trigger: 'blur' }]
  } else if (formData.shippingFeeType === 1) {
    newRules.additionalItemQuantity = [{ required: true, message: '续件数量不能为空', trigger: 'blur' }]
    newRules.additionalItemPrice = [{ required: true, message: '续件价格不能为空', trigger: 'blur' }]
  } else if (formData.shippingFeeType === 2) {
    newRules.firstWeight = [{ required: true, message: '首重重量不能为空', trigger: 'blur' }]
    newRules.firstWeightPrice = [{ required: true, message: '首重价格不能为空', trigger: 'blur' }]
    newRules.additionalWeight = [{ required: true, message: '续重重量不能为空', trigger: 'blur' }]
    newRules.additionalWeightPrice = [{ required: true, message: '续重价格不能为空', trigger: 'blur' }]
  }

  Object.assign(rules, newRules)
}
</script>
