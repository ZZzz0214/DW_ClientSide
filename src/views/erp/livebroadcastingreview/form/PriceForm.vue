<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <!-- 客户ID -->
      <el-form-item label="客户" prop="customerId">
        <el-input
          v-model="formData.customerId"
          placeholder="请选择客户"
          class="w-240px"
        />
      </el-form-item>
  
      <!-- 直播平台 -->
      <el-form-item label="直播平台" prop="livePlatform">
        <el-input
          v-model="formData.livePlatform"
          placeholder="请输入直播平台"
          class="w-240px"
        />
      </el-form-item>
  
      <!-- 直播佣金 -->
      <el-form-item label="直播佣金" prop="liveCommission">
        <el-input-number
          v-model="formData.liveCommission"
          :min="0"
          :precision="2"
          placeholder="请输入直播佣金"
          class="w-240px"
        />
      </el-form-item>
  
      <!-- 公开佣金 -->
      <el-form-item label="公开佣金" prop="publicCommission">
        <el-input-number
          v-model="formData.publicCommission"
          :min="0"
          :precision="2"
          placeholder="请输入公开佣金"
          class="w-240px"
        />
      </el-form-item>
  
      <!-- 返点佣金 -->
      <el-form-item label="返点佣金" prop="rebateCommission">
        <el-input-number
          v-model="formData.rebateCommission"
          :min="0"
          :precision="2"
          placeholder="请输入返点佣金"
          class="w-240px"
        />
      </el-form-item>
    </el-form>
  </template>
  
  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import type { LiveBroadcastingReviewVO } from '@/api/erp/livebroadcastingreview'
  
  defineOptions({ name: 'ErpLiveBroadcastingReviewPriceForm' })
  
  const props = defineProps({
    propFormData: {
      type: Object as PropType<LiveBroadcastingReviewVO>,
      default: () => {}
    },
    isDetail: propTypes.bool.def(false)
  })
  
  const message = useMessage()
  const formRef = ref()
  const formData = reactive<LiveBroadcastingReviewVO>({
    customerId: 0,
    livePlatform: '',
    liveCommission: 0,
    publicCommission: 0,
    rebateCommission: 0
  })
  
  const rules = reactive({
    customerId: [{ required: true, message: '客户不能为空', trigger: 'blur' }],
    livePlatform: [{ required: true, message: '直播平台不能为空', trigger: 'blur' }],
    liveCommission: [{ required: true, message: '直播佣金不能为空', trigger: 'blur' }]
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
      message.error('【价格机制】不完善，请填写相关信息')
      emit('update:activeName', 'price')
      throw e
    }
  }
  
  defineExpose({ validate })
  </script>