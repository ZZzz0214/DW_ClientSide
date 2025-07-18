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
      <el-form-item label="组品编号" prop="comboProductNo">
        <el-input
          v-model="formData.comboProductNo"
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

      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="formData.productName"
          placeholder="自动填充"
          readonly
          class="w-80"
        />
      </el-form-item>

      <el-form-item label="产品简称" prop="productShortName">
        <el-input
          v-model="formData.productShortName"
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

      <!-- 状态信息 -->
      <el-form-item label="状态信息" prop="status">
        <el-select
          v-model="formData.status"
          placeholder="请选择状态信息"
          clearable
          filterable
          class="w-80"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.ERP_DROPSHIP_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <ComboSearchDialog
      ref="comboSearchDialog"
      v-model:visible="comboSearchDialogVisible"
      @combo-selected="handleComboSelected"
    />
  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import type { DropshipAssistVO } from '@/api/erp/dropship'
  import ComboSearchDialog from './ComboSearchDialog.vue'
  import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'

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
    comboProductId: '', // 组品ID
    comboProductNo: '', // 组品编号
    productSpec: '',
    productQuantity: 0,
    remark: '', // 备注信息
    status: '', // 状态信息
    name: '', // 组品名称
    shippingCode: '', // 发货编码
    productName: '', // 产品名称
    productShortName: '' // 产品简称
  })

  const rules = reactive({
    // no: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
    //originalProduct: [{ required: true, message: '原表商品不能为空', trigger: 'blur' }],
    //originalSpec: [{ required: true, message: '原表规格不能为空', trigger: 'blur' }],
    originalQuantity: [{ required: true, message: '原表数量不能为空', trigger: 'blur' }],
    // productSpec: [{ required: true, message: '产品规格不能为空', trigger: 'blur' }],
    // productQuantity: [{ required: true, message: '产品数量不能为空', trigger: 'blur' }],
    // comboProductNo: [{ required: true, message: '组品编号不能为空', trigger: 'blur' }]
  })

  /** 将传进来的值赋值给 formData */
  watch(
    () => props.propFormData,
    (data) => {
      if (!data) return
      copyValueToTarget(formData, data)
    },
    { immediate: true, deep: true }
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
    formData.comboProductNo = combo.no; // 显示组品编号
    formData.shippingCode = combo.shippingCode;
    formData.name = combo.name; // 组品名称
    formData.productName = combo.name; // 产品名称
    formData.productShortName = combo.shortName; // 产品简称
  };

  defineExpose({ validate })
  </script>
