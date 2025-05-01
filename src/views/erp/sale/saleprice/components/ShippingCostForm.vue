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
      <el-input
        v-model="formData.fixedShippingFee"
        placeholder="请输入固定运费"
        :disabled="isDetail"
      />
    </el-form-item>

    <!-- 按件 - 按件数量 -->
    <el-form-item
      v-if="formData.shippingFeeType === 1"
      label="按件数量"
      prop="additionalItemQuantity"
    >
      <el-input
        v-model="formData.additionalItemQuantity"
        placeholder="请输入按件数量"
        :disabled="isDetail"
      />
    </el-form-item>

    <!-- 按件 - 按件价格 -->
    <el-form-item
      v-if="formData.shippingFeeType === 1"
      label="按件价格"
      prop="additionalItemPrice"
    >
      <el-input
        v-model="formData.additionalItemPrice"
        placeholder="请输入按件价格"
        :disabled="isDetail"
      />
    </el-form-item>

    <!-- 按重量 - 首重重量 -->
    <el-form-item
      v-if="formData.shippingFeeType === 2"
      label="首重重量"
      prop="firstWeight"
    >
      <el-input
        v-model="formData.firstWeight"
        placeholder="请输入首重重量"
        :disabled="isDetail"
      />
    </el-form-item>

    <!-- 按重量 - 首重价格 -->
    <el-form-item
      v-if="formData.shippingFeeType === 2"
      label="首重价格"
      prop="firstWeightPrice"
    >
      <el-input
        v-model="formData.firstWeightPrice"
        placeholder="请输入首重价格"
        :disabled="isDetail"
      />
    </el-form-item>

    <!-- 按重量 - 续重重量 -->
    <el-form-item
      v-if="formData.shippingFeeType === 2"
      label="续重重量"
      prop="additionalWeight"
    >
      <el-input
        v-model="formData.additionalWeight"
        placeholder="请输入续重重量"
        :disabled="isDetail"
      />
    </el-form-item>

    <!-- 按重量 - 续重价格 -->
    <el-form-item
      v-if="formData.shippingFeeType === 2"
      label="续重价格"
      prop="additionalWeightPrice"
    >
      <el-input
        v-model="formData.additionalWeightPrice"
        placeholder="请输入续重价格"
        :disabled="isDetail"
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { PropType, watch, reactive, ref } from 'vue'
import { copyValueToTarget } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import type { ShippingCostVO } from '@/api/erp/product/product/index'

defineOptions({ name: 'ShippingCostForm' })

const message = useMessage() // 消息弹窗
const formLoading = ref(false)
const props = defineProps({
  items: {
    type: Array as PropType<ShippingCostVO[]>,
    default: () => []
  },
  isDetail: propTypes.bool.def(false) // 是否作为详情组件
})
const formRef = ref() // 表单 Ref
const formData = reactive<ShippingCostVO>({
  shippingFeeType: 0, // 运费类型
  fixedShippingFee: null, // 固定运费
  additionalItemQuantity: null, // 按件数量
  additionalItemPrice: null, // 按件价格
  firstWeight: null, // 首重重量
  firstWeightPrice: null, // 首重价格
  additionalWeight: null, // 续重重量
  additionalWeightPrice: null // 续重价格
})
const rules = reactive({
  shippingFeeType: [{ required: true, message: '运费类型不能为空', trigger: 'blur' }]
})

/** 将传进来的值赋值给 formData */
watch(
  () => props.items,
  (newItems) => {
    if (newItems.length === 0) {
      formData.shippingFeeType = 0
      return
    }
    const firstItem = newItems[0]
    copyValueToTarget(formData, firstItem)
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
    // 将表单数据包装成数组格式传递给父组件
    emit('items-updated', [formData])
  } catch (e) {
    message.error('请完善运费信息')
    emit('update:activeName', 'shippingcost')
    throw e
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

  // 触发数据更新
  validate();
}

// 添加对表单数据的监听
watch(() => formData, () => {
  validate();
}, { deep: true })

/** 动态更新校验规则 */
const updateRules = () => {
  const newRules = {
    shippingFeeType: [{ required: true, message: '运费类型不能为空', trigger: 'blur' }]
  }
  Object.assign(rules, newRules)
}
</script>