<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="客户名称" prop="customerId">
        <el-input
          v-model="formData.customerId"
          placeholder="请输入客户名称"
          class="w-80"
        />
      </el-form-item>
              <el-form-item label="供货价格" prop="supplyGroupPrice">
          <el-input-number
            v-model="formData.supplyGroupPrice"
            :min="0"
            :precision="2"
            placeholder="请输入供货价格"
            class="w-80"
          />
      </el-form-item>
<!--      <el-form-item label="开团机制" prop="groupMechanism">-->
<!--        <el-input-->
<!--          v-model="formData.groupMechanism"-->
<!--          type="textarea"-->
<!--          placeholder="请输入开团机制"-->
<!--          class="w-80"-->
<!--          :autosize="{ minRows: 2, maxRows: 4 }"-->
<!--        />-->
<!--      </el-form-item>-->
    </el-form>
  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import type { GroupBuyingReviewVO } from '@/api/erp/groupbuyingreview'

  defineOptions({ name: 'ErpGroupBuyingReviewPriceForm' })
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
    customerName: '',
    supplyGroupPrice: 0,
    groupMechanism: '',
    customerId:undefined
  })

  const rules = reactive({
    customerId: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
    supplyGroupPrice: [{ required: true, message: '供货价格不能为空', trigger: 'blur' }]
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
      message.error('【价格机制】不完善，请填写相关信息')
      emit('update:activeName', 'price')
      throw e
    }
  }

  defineExpose({ validate })
  </script>
