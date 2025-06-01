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
<!--          class="w-80"-->
<!--          :disabled="isDetail"-->
<!--        />-->
<!--      </el-form-item>-->

      <!-- 原表商品 -->
      <el-form-item label="原表商品" prop="originalProduct">
        <el-input
          v-model="formData.originalProduct"
          placeholder="请输入原表商品"
          class="w-80"
        />
      </el-form-item>

      <!-- 原表规格 -->
      <el-form-item label="原表规格" prop="originalSpec">
        <el-input
          v-model="formData.originalSpec"
          placeholder="请输入原表规格"
          class="w-80"
        />
      </el-form-item>

      <!-- 原表数量 -->
      <el-form-item label="原表数量" prop="originalQuantity">
        <el-input-number
          v-model="formData.originalQuantity"
          :min="0"
          placeholder="请输入原表数量"
          class="w-80"
        />
      </el-form-item>

      <!-- 组品编号 -->
      <el-form-item label="组品编号" prop="comboProductId">
        <el-input
          v-model="formData.comboProductId"
          placeholder="请输入组品编号"
          class="w-80"
          @click="openComboSearch"
          readonly
        />
      </el-form-item>



      <el-form-item label="发货编码" prop="shippingCode">
    <el-input
      v-model="formData.shippingCode"
      placeholder="自动填充"
      readonly
      class="w-80"
    />
  </el-form-item>
      <el-form-item label="产品名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="自动填充"
          readonly
          class="w-80"
        />
      </el-form-item>

      <!-- 产品规格 -->
      <el-form-item label="产品规格" prop="productSpec">
        <el-input
          v-model="formData.productSpec"
          placeholder="请输入产品规格"
          class="w-80"
        />
      </el-form-item>

      <!-- 产品数量 -->
      <el-form-item label="产品数量" prop="productQuantity">
        <el-input-number
          v-model="formData.productQuantity"
          :min="0"
          placeholder="请输入产品数量"
          class="w-80"
        />
      </el-form-item>
    </el-form>

    <ComboSearchDialog
    v-model:visible="comboSearchDialogVisible"
    @combo-selected="handleComboSelected"
    ref="comboSearchDialog"
  />
  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import type { DropshipAssistVO } from '@/api/erp/dropship'

  defineOptions({ name: 'ErpDropshipAssistInfoForm' })

  const props = defineProps({
    propFormData: {
      type: Object as PropType<DropshipAssistVO>,
      default: () => {}
    },
    isDetail: propTypes.bool.def(false)
  })

  const message = useMessage()
  const formRef = ref()
  const formData = reactive<DropshipAssistVO>({
    no: '',
    originalProduct: '',
    originalSpec: '',
    originalQuantity: 0,
    comboProductId: '',
    productSpec: '',
    productQuantity: 0,
    name: '', // 新增的属性
    shippingCode: '' // 新增的属性
  })

  const rules = reactive({
    no: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
    originalProduct: [{ required: true, message: '原表商品不能为空', trigger: 'blur' }],
    originalQuantity: [{ required: true, message: '原表数量不能为空', trigger: 'blur' }],
    productQuantity: [{ required: true, message: '产品数量不能为空', trigger: 'blur' }]
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

const comboSearchDialogVisible = ref(false);
const comboSearchDialog = ref();

const openComboSearch = () => {
  comboSearchDialog.value?.open();
};

const handleComboSelected = (combo: any) => {
  formData.comboProductId = combo.id;
  formData.shippingCode = combo.shippingCode;
  formData.name = combo.name; // 如果产品名称需要填充
};

  defineExpose({ validate })
  </script>
