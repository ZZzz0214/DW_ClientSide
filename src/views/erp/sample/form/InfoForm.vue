<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <!-- 基本信息 -->
<!--      <el-form-item label="样品编号" prop="no">-->
<!--        <el-input-->
<!--          v-model="formData.no"-->
<!--          placeholder="请输入样品编号"-->
<!--          class="w-80"-->
<!--          :disabled="isDetail"-->
<!--        />-->
<!--      </el-form-item>-->

      <!-- 物流信息 -->
      <el-form-item label="物流公司" prop="logisticsCompany">
        <el-input
          v-model="formData.logisticsCompany"
          placeholder="请输入物流公司"
          class="w-80"
        />
      </el-form-item>

      <el-form-item label="物流单号" prop="logisticsNo">
        <el-input
          v-model="formData.logisticsNo"
          placeholder="请输入物流单号"
          class="w-80"
        />
      </el-form-item>

      <!-- 收件人信息 -->
      <el-form-item label="收件姓名" prop="receiverName">
        <el-input
          v-model="formData.receiverName"
          placeholder="请输入收件人姓名"
          class="w-80"
        />
      </el-form-item>

      <el-form-item label="联系电话" prop="contactPhone">
        <el-input
          v-model="formData.contactPhone"
          placeholder="请输入联系电话"
          class="w-80"
        />
      </el-form-item>

      <el-form-item label="详细地址" prop="address">
        <el-input
          v-model="formData.address"
          type="textarea"
          placeholder="请输入详细地址"
          class="w-80"
          :autosize="{ minRows: 2, maxRows: 4 }"
        />
      </el-form-item>

      <!-- 产品信息 -->
      <el-form-item label="组品编号" prop="comboProductId">
        <el-input
          v-model="formData.comboProductId"
          placeholder="请输入组品编号"
          class="w-80"
        />
      </el-form-item>

      <el-form-item label="产品规格" prop="productSpec">
        <el-input
          v-model="formData.productSpec"
          placeholder="请输入产品规格"
          class="w-80"
        />
      </el-form-item>

      <el-form-item label="产品数量" prop="productQuantity">
        <el-input-number
          v-model="formData.productQuantity"
          :min="1"
          placeholder="请输入产品数量"
          class="w-80"
        />
      </el-form-item>

      <!-- 客户信息 -->
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="formData.customerName"
          placeholder="请输入客户名称"
          class="w-80"
        />
      </el-form-item>

      <!-- 样品状态 -->
<!--      <el-form-item label="样品状态" prop="sampleStatus">-->
<!--        <el-select-->
<!--          v-model="formData.sampleStatus"-->
<!--          placeholder="请选择样品状态"-->
<!--          class="w-80"-->
<!--        >-->
<!--          <el-option label="待发货" :value="1" />-->
<!--          <el-option label="已发货" :value="2" />-->
<!--          <el-option label="已签收" :value="3" />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
            <!-- 样品状态 -->
            <el-form-item label="样品状态" prop="sampleStatus">
        <el-select
          v-model="formData.sampleStatus"
          placeholder="请选择样品状态"
          class="w-80"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.ERP_SAMPLE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <!-- 参考信息 -->
<!--      <el-form-item label="参考" prop="reference">-->
<!--        <el-input-->
<!--          v-model="formData.reference"-->
<!--          type="textarea"-->
<!--          placeholder="请输入参考信息"-->
<!--          class="w-80"-->
<!--          :autosize="{ minRows: 2, maxRows: 4 }"-->
<!--        />-->
<!--      </el-form-item>-->

      <!-- 备注信息 -->
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          placeholder="请输入备注"
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
  import type { SampleVO } from '@/api/erp/sample'
  import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

  defineOptions({ name: 'ErpSampleInfoForm' })

  const props = defineProps({
    propFormData: {
      type: Object as PropType<SampleVO>,
      default: () => {}
    },
    isDetail: propTypes.bool.def(false)
  })

  const message = useMessage()
  const formRef = ref()
  const formData = reactive<SampleVO>({
    no: '',
    logisticsCompany: '',
    logisticsNo: '',
    receiverName: '',
    contactPhone: '',
    address: '',
    comboProductId: '',
    productSpec: '',
    productQuantity: 1,
    customerName: '',
    sampleStatus: 1,
    reference: '',
    remark: ''
  })

  const rules = reactive({
    no: [{ required: true, message: '样品编号不能为空', trigger: 'blur' }],
    logisticsCompany: [{ required: true, message: '物流公司不能为空', trigger: 'blur' }],
    logisticsNo: [{ required: true, message: '物流单号不能为空', trigger: 'blur' }],
    receiverName: [{ required: true, message: '收件姓名不能为空', trigger: 'blur' }],
    contactPhone: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
    address: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }],
    comboProductId: [{ required: true, message: '组品编号不能为空', trigger: 'blur' }],
    productSpec: [{ required: true, message: '产品规格不能为空', trigger: 'blur' }],
    productQuantity: [{ required: true, message: '产品数量不能为空', trigger: 'blur' }],
    customerName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
    sampleStatus: [{ required: true, message: '样品状态不能为空', trigger: 'blur' }]
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
