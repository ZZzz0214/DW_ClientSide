<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <!-- 编号 -->
<!--      <el-form-item label="编号" prop="no">-->
<!--        <el-input-->
<!--          v-model="formData.no"-->
<!--          placeholder="请输入编号"-->
<!--          class="w-240px"-->
<!--          :disabled="isDetail"-->
<!--        />-->
<!--      </el-form-item>-->

      <!-- 产品图片 -->
      <el-form-item label="产品图片" prop="productImage">
        <UploadImg v-model="formData.productImage" :limit="1" />
      </el-form-item>

      <!-- 品牌名称 -->
      <el-form-item label="品牌名称" prop="brandId">
        <el-input
          v-model="formData.brandId"
          placeholder="请输入品牌名称"
          class="w-240px"
        />
      </el-form-item>

      <!-- 产品名称 -->
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="formData.productName"
          placeholder="请输入产品名称"
          class="w-240px"
        />
      </el-form-item>

      <!-- 产品规格 -->
      <el-form-item label="产品规格" prop="productSpec">
        <el-input
          v-model="formData.productSpec"
          placeholder="请输入产品规格"
          class="w-240px"
        />
      </el-form-item>

      <!-- 产品SKU -->
      <el-form-item label="产品SKU" prop="productSku">
        <el-input
          v-model="formData.productSku"
          placeholder="请输入产品SKU"
          class="w-240px"
        />
      </el-form-item>

      <!-- 市场价格 -->
      <el-form-item label="市场价格" prop="marketPrice">
        <el-input-number
          v-model="formData.marketPrice"
          :min="0"
          :precision="2"
          placeholder="请输入市场价格"
          class="w-240px"
        />
      </el-form-item>

      <!-- 保质日期 -->
      <el-form-item label="保质日期" prop="shelfLife">
        <el-date-picker
          v-model="formData.shelfLife"
          type="date"
          placeholder="请选择保质日期"
          class="w-240px"
          value-format="x"
        />
      </el-form-item>

      <!-- 产品库存 -->
      <el-form-item label="产品库存" prop="productStock">
        <el-input-number
          v-model="formData.productStock"
          :min="0"
          placeholder="请输入产品库存"
          class="w-240px"
        />
      </el-form-item>

      <!-- 核心卖点 -->
      <el-form-item label="核心卖点" prop="coreSellingPoint">
        <el-input
          v-model="formData.coreSellingPoint"
          type="textarea"
          placeholder="请输入核心卖点"
          class="w-240px"
          :autosize="{ minRows: 2, maxRows: 4 }"
        />
      </el-form-item>

      <!-- 备注 -->
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          placeholder="请输入备注"
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
  import type { LiveBroadcastingVO } from '@/api/erp/livebroadcasting'

  defineOptions({ name: 'ErpLiveBroadcastingInfoForm' })

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
    no: '',
    productImage: '',
    brandName: '',
    brandId:undefined,
    productName: '',
    productSpec: '',
    productSku: '',
    marketPrice: 0,
    shelfLife: '',
    productStock: 0,
    coreSellingPoint: '',
    remark: ''
  })

  const rules = reactive({
    no: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
    productName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
    brandName: [{ required: true, message: '品牌名称不能为空', trigger: 'blur' }],
    marketPrice: [{ required: true, message: '市场价格不能为空', trigger: 'blur' }],
    productStock: [{ required: true, message: '产品库存不能为空', trigger: 'blur' }]
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
