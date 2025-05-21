<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <!-- 直播货盘表ID -->
      <el-form-item label="直播货盘" prop="liveBroadcastingId">
        <el-input
          v-model="formData.liveBroadcastingId"
          placeholder="请选择直播货盘"
          class="w-240px"
        />
      </el-form-item>
  
      <!-- 备注信息 -->
      <el-form-item label="备注信息" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          placeholder="请输入备注信息"
          class="w-240px"
          :autosize="{ minRows: 2, maxRows: 4 }"
        />
      </el-form-item>
    </el-form>
  </template>
  
  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import type { LiveBroadcastingReviewVO } from '@/api/erp/livebroadcastingreview'
  
  defineOptions({ name: 'ErpLiveBroadcastingReviewInfoForm' })
  
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
    liveBroadcastingId: 0,
    remark: ''
  })
  
  const rules = reactive({
    liveBroadcastingId: [{ required: true, message: '直播货盘不能为空', trigger: 'blur' }]
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
      message.error('【基础信息】不完善，请填写相关信息')
      emit('update:activeName', 'info')
      throw e
    }
  }
  
  defineExpose({ validate })
  </script>