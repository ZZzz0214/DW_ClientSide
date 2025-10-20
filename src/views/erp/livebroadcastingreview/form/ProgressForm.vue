<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <!-- 寄样日期 -->
      <el-form-item label="寄样日期" prop="sampleSendDate">
        <el-date-picker
          v-model="formData.sampleSendDate"
          type="date"
          placeholder="请选择寄样日期"
          class="w-240px"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <!-- 开播日期 -->
      <el-form-item label="开播日期" prop="liveStartDate">
        <el-date-picker
          v-model="formData.liveStartDate"
          type="date"
          placeholder="请选择开播日期"
          class="w-240px"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <!-- 开播销量 -->
      <el-form-item label="开播销量" prop="liveSales">
        <el-input-number
          v-model="formData.liveSales"
          :min="0"
          placeholder="请输入开播销量"
          class="w-240px"
        />
      </el-form-item>

      <!-- 复播日期 -->
      <el-form-item label="复播日期" prop="repeatLiveDate">
        <el-date-picker
          v-model="formData.repeatLiveDate"
          type="date"
          placeholder="请选择复播日期"
          class="w-240px"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <!-- 复盘状态 -->
      <el-form-item label="复盘状态" prop="reviewStatus">
        <el-select
          v-model="formData.reviewStatus"
          placeholder="请选择复盘状态"
          clearable
          class="w-240px"
        >
          <el-option
            v-for="dict in getDictOptions(DICT_TYPE.ERP_LIVE_BROADCASTING_REVIEW_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import { DICT_TYPE, getDictOptions } from '@/utils/dict'
  import type { LiveBroadcastingReviewVO } from '@/api/erp/livebroadcastingreview'

  defineOptions({ name: 'ErpLiveBroadcastingReviewProgressForm' })

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
    sampleSendDate: '',
    liveStartDate: '',
    liveSales: 0,
    repeatLiveDate: '',
    reviewStatus: undefined
  })

  const rules = reactive({
   // sampleSendDate: [{ required: true, message: '寄样日期不能为空', trigger: 'blur' }],
    //liveStartDate: [{ required: true, message: '开播日期不能为空', trigger: 'blur' }]
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
      message.error('【进展跟踪】不完善，请填写相关信息')
      emit('update:activeName', 'progress')
      throw e
    }
  }

  defineExpose({ validate })
  </script>
