<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-width="100px"
    v-loading="formLoading"
  >
    <ContentWrap>
      <!-- 价格信息 -->
      <el-form-item label="供应商名" prop="supplier">
        <el-input
          :disabled="isDetail"
          v-model="formData.supplier"
          placeholder="请输入供应商名"
          @focus="openSupplierSearch"
          class="w-80"
        />
      </el-form-item>

      <el-form-item label="采购单价" prop="purchasePrice">
        <el-input v-model="formData.purchasePrice" placeholder="采购单价" disabled />
      </el-form-item>

      <el-form-item label="批发单价" prop="wholesalePrice">
        <el-input v-model="formData.wholesalePrice" placeholder="批发单价" disabled />
      </el-form-item>

      <el-form-item label="备注信息" prop="totalQuantity">
        <el-input v-model="formData.totalQuantity" placeholder="产品数量" :disabled="isDetail" />
      </el-form-item>
    </ContentWrap>

    <!-- 供应商搜索弹窗 -->
    <SupplierSearchDialog
      v-model:visible="supplierSearchDialogVisible"
      @supplier-selected="handleSupplierSelected"
      ref="supplierSearchDialog"
    />
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import SupplierSearchDialog from './SupplierSearchDialog.vue'
import { copyValueToTarget } from "@/utils"
import * as ProductComboApi from '@/api/erp/product/combo'

const props = defineProps({
  propFormData: {
    type: Object as PropType<ProductComboApi.ComboVO>,
    default: () => ({})
  },
  isDetail: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:activeName'])

const formRef = ref()
const formLoading = ref(false)
const supplierSearchDialogVisible = ref(false)

const formData = ref<ProductComboApi.ComboVO>({
  supplier: '',
  purchasePrice: 0,
  wholesalePrice: 0,
  totalQuantity: ''
})

const formRules = reactive({
  totalQuantity: [{ required: true, message: '产品数量不能为空', trigger: 'blur' }]
})

const openSupplierSearch = () => {
  supplierSearchDialogVisible.value = true
}

const handleSupplierSelected = (supplier: any) => {
  formData.value.supplier = supplier.name
}

const validate = async () => {
  const form = unref(formRef)
  if (!form) return
  try {
    await form.validate()
    Object.assign(props.propFormData, formData.value)
  } catch (e) {
    emit('update:activeName', 'price')
    throw e
  }
}

defineExpose({ validate })

watch(
  () => props.propFormData,
  (data) => {
    if (!data) return
    copyValueToTarget(formData.value, data)
  },
  { immediate: true }
)
</script>