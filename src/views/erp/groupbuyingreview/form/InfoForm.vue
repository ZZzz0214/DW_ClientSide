<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
<!--      <el-form-item label="编号" prop="no">-->
<!--        <el-input-->
<!--          v-model="formData.no"-->
<!--          placeholder="请输入编号"-->
<!--          class="w-80"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="品牌名称" prop="brandName">-->
<!--        <el-input-->
<!--          v-model="formData.brandName"-->
<!--          placeholder="请输入品牌名称"-->
<!--          class="w-80"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="产品名称" prop="productName">-->
<!--        <el-input-->
<!--          v-model="formData.productName"-->
<!--          placeholder="请输入产品名称"-->
<!--          class="w-80"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="产品规格" prop="productSpec">-->
<!--        <el-input-->
<!--          v-model="formData.productSpec"-->
<!--          placeholder="请输入产品规格"-->
<!--          class="w-80"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="产品SKU" prop="productSku">-->
<!--        <el-input-->
<!--          v-model="formData.productSku"-->
<!--          placeholder="请输入产品SKU"-->
<!--          class="w-80"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="团购货盘表ID" prop="groupBuyingId">
      <el-input
        v-model="formData.groupBuyingId"
        placeholder="请输入团购货盘表ID"
        class="w-80"
      />
    </el-form-item>
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
  import type { GroupBuyingReviewVO } from '@/api/erp/groupbuyingreview'

  defineOptions({ name: 'ErpGroupBuyingReviewInfoForm' })
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
    groupBuyingId: undefined as number | undefined,
    no: '',
    brandName: '',
    productName: '',
    productSpec: '',
    productSku: '',
    remark: ''
  })

  const rules = reactive({
    no: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
    productName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }]
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
      message.error('【基础信息】不完善，请填写相关信息')
      emit('update:activeName', 'info')
      throw e
    }
  }

  defineExpose({ validate })
  </script>
