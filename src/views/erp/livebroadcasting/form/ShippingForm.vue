<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <!-- 快递公司 -->
      <el-form-item label="快递公司" prop="expressCompany">
        <el-input
          v-model="formData.expressCompany"
          placeholder="请输入快递公司"
          class="w-240px"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 6}"
        />
      </el-form-item>

      <!-- 发货时效 -->
      <el-form-item label="发货时效" prop="shippingTime">
        <el-input
          v-model="formData.shippingTime"
          placeholder="请输入发货时效"
          class="w-240px"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 6}"
        />
      </el-form-item>

      <!-- 发货地区 -->
      <el-form-item label="发货地区" prop="shippingArea">
        <el-input
          v-model="formData.shippingArea"
          placeholder="请输入发货地区"
          class="w-240px"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 6}"
        />
      </el-form-item>
    </el-form>
  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import type { LiveBroadcastingVO } from '@/api/erp/livebroadcasting'

  defineOptions({ name: 'ErpLiveBroadcastingShippingForm' })

  const props = defineProps({
    propFormData: {
      type: Object as PropType<LiveBroadcastingVO>,
      default: () => {}
    },
    isDetail: propTypes.bool.def(false)
  })

  const message = useMessage()
  const formRef = ref()
  const formData = reactive<LiveBroadcastingVO>({
    expressCompany: '',
    shippingTime: '',
    shippingArea: ''
  })

  const rules = reactive({
   // expressCompany: [{ required: true, message: '快递公司不能为空', trigger: 'blur' }],
    //shippingTime: [{ required: true, message: '发货时效不能为空', trigger: 'blur' }]
  })

  /** 将传进来的值赋值给 formData */
  watch(
    () => props.propFormData,
    (data) => {
      if (!data) return
      copyValueToTarget(formData, data)
    },
    { immediate: true }
  )

  /** 表单校验 */
  const emit = defineEmits(['update:activeName'])
  const validate = async () => {
    if (!formRef) return
    try {
      await unref(formRef)?.validate()
      Object.assign(props.propFormData, formData)
    } catch (e) {
      message.error('【发货信息】不完善，请填写相关信息')
      emit('update:activeName', 'shipping')
      throw e
    }
  }

  defineExpose({ validate })
  </script>
