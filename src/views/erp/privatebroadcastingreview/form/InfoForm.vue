<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <!-- 私播货盘表ID -->
      <el-form-item label="私播货盘表ID" prop="privateBroadcastingId">
        <el-input
          v-model="formData.privateBroadcastingId"
          placeholder="请输入私播货盘表ID"
          class="w-80"
          :disabled="isDetail"
        />
      </el-form-item>

      <!-- 备注信息 -->
      <el-form-item label="备注信息" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          placeholder="请输入备注信息"
          class="w-80"
          :autosize="{ minRows: 2, maxRows: 4 }"
        />
      </el-form-item>
    </el-form>
  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'

  defineOptions({ name: 'ErpPrivateBroadcastingReviewInfoForm' })

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
    privateBroadcastingId: undefined,
    remark: ''
  })

  const rules = reactive({
    groupBuyingId: [{ required: true, message: '私播货盘表ID不能为空', trigger: 'blur' }]
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
      message.error('【基础信息】不完善，请填写相关信息')
      emit('update:activeName', 'info')
      throw e
    }
  }

  defineExpose({ validate })
  </script>
