<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="140px"
    >
      <!-- 寄样日期 -->
      <el-form-item label="寄样日期" prop="sampleSendDate">
        <el-date-picker
          v-model="formData.sampleSendDate"
          type="date"
          placeholder="请选择寄样日期"
          class="w-80"
          value-format="x"
        />
      </el-form-item>

      <!-- 开团日期 -->
      <el-form-item label="开团日期" prop="groupStartDate">
        <el-date-picker
          v-model="formData.groupStartDate"
          type="date"
          placeholder="请选择开团日期"
          class="w-80"
          value-format="x"
        />
      </el-form-item>

      <!-- 开团销量 -->
      <el-form-item label="开团销量" prop="groupSales">
        <el-input-number
          v-model="formData.groupSales"
          :min="0"
          placeholder="请输入开团销量"
          class="w-80"
        />
      </el-form-item>

      <!-- 复团日期 -->
      <el-form-item label="复团日期" prop="reGroupDate">
        <el-date-picker
          v-model="formData.repeatGroupDate"
          type="date"
          placeholder="请选择复团日期"
          class="w-80"
          value-format="x"
        />
      </el-form-item>

      <!-- 复团销量 -->
      <el-form-item label="复团销量" prop="reGroupSales">
        <el-input-number
          v-model="formData.repeatGroupSales"
          :min="0"
          placeholder="请输入复团销量"
          class="w-80"
        />
      </el-form-item>
    </el-form>
  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'

  defineOptions({ name: 'ErpPrivateBroadcastingReviewProgressForm' })

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
    sampleSendDate: '',
    groupStartDate: '',
    groupSales: 0,
    repeatGroupDate: '',
    repeatGroupSales: 0
  })

  const rules = reactive({
    sampleSendDate: [{ required: true, message: '寄样日期不能为空', trigger: 'change' }],
    groupStartDate: [{ required: true, message: '开团日期不能为空', trigger: 'change' }]
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
      message.error('【进展跟踪】不完善，请填写相关信息')
      emit('update:activeName', 'progress')
      throw e
    }
  }

  defineExpose({ validate })
  </script>
