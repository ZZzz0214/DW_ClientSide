<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <!-- 客户名称 -->
      <el-form-item label="客户名称" prop="customerId">
        <el-input
          v-model="formData.customerId"
          placeholder="请输入客户名称"
          class="w-80"
        />
      </el-form-item>

      <!-- 产品裸价 -->
      <el-form-item label="产品裸价" prop="productPrice">
        <el-input-number
          v-model="formData.productNakedPrice"
          :min="0"
          :precision="2"
          placeholder="请输入产品裸价"
          class="w-80"
        />
      </el-form-item>

      <!-- 快递费用 -->
      <el-form-item label="快递费用" prop="expressFee">
        <el-input-number
          v-model="formData.expressFee"
          :min="0"
          :precision="2"
          placeholder="请输入快递费用"
          class="w-80"
        />
      </el-form-item>

      <!-- 代发价格 -->
      <el-form-item label="代发价格" prop="distributionPrice">
        <el-input-number
          v-model="formData.dropshipPrice"
          :min="0"
          :precision="2"
          placeholder="请输入代发价格"
          class="w-80"
        />
      </el-form-item>
    </el-form>
  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'

  defineOptions({ name: 'ErpPrivateBroadcastingReviewPriceForm' })

  const props = defineProps({
    propFormData: {
      type: Object as PropType<any>,
      default: () => {}
    },
    isDetail: propTypes.bool.def(false)
  })

  const message = useMessage()
  const formRef = ref()
  const formData = reactive({
    customerName: '',
    productPrice: 0,
    expressFee: 0,
    distributionPrice: 0,
    customerId:0,
    productNakedPrice:0,
    dropshipPrice:0,
  })

  const rules = reactive({
    customerId: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
    productPrice: [{ required: true, message: '产品裸价不能为空', trigger: 'blur' }]
  })

  watch(
    () => props.propFormData,
    (data) => {
      if (!data) return
      copyValueToTarget(formData, data)
    },
    { immediate: true }
  )

  const emit = defineEmits(['update:activeName'])
  const validate = async () => {
    if (!formRef) return
    try {
      await unref(formRef)?.validate()
      Object.assign(props.propFormData, formData)
    } catch (e) {
      message.error('【价格机制】不完善，请填写相关信息')
      emit('update:activeName', 'price')
      throw e
    }
  }

  defineExpose({ validate })
  </script>
