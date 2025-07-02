<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="寄样日期" prop="sampleSendDate">
        <el-date-picker
          v-model="formData.sampleSendDate"
          type="date"
          placeholder="请选择寄样日期"
          class="w-80!"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="开团日期" prop="groupStartDate">
        <el-date-picker
          v-model="formData.groupStartDate"
          type="date"
          placeholder="请选择开团日期"
          class="w-80!"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="开团销量" prop="groupSales">
        <el-input-number
          v-model="formData.groupSales"
          :min="0"
          placeholder="请输入开团销量"
          class="w-80!"
        />
      </el-form-item>
      <el-form-item label="复团日期" prop="repeatGroupDate">
        <el-date-picker
          v-model="formData.repeatGroupDate"
          type="date"
          placeholder="请选择复团日期"
          class="w-80!"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="复团销量" prop="repeatGroupSales">
        <el-input-number
          v-model="formData.repeatGroupSales"
          :min="0"
          placeholder="请输入复团销量"
          class="w-80!"
        />
      </el-form-item>
    </el-form>
  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import type { GroupBuyingReviewVO } from '@/api/erp/groupbuyingreview'

  defineOptions({ name: 'ErpGroupBuyingReviewProgressForm' })
  const message = useMessage()
  const props = defineProps({
    propFormData: {
      type: Object as PropType<GroupBuyingReviewVO>,
      default: () => {}
    },
    isDetail: propTypes.bool.def(false)
  })

  const emit = defineEmits(['update:activeName'])
  const formRef = ref()
  const formData = reactive({
    sampleSendDate: undefined,
    groupStartDate: undefined,
    groupSales: 0,
    repeatGroupDate: undefined,
    repeatGroupSales: 0
  })

  const rules = reactive({
   // groupStartDate: [{ required: true, message: '开团日期不能为空', trigger: 'blur' }],
    //groupSales: [{ required: true, message: '开团销量不能为空', trigger: 'blur' }]
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
