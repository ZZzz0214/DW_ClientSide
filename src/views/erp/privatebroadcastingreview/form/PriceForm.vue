<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="140px"
    >
      <!-- 客户名称 -->
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="formData.customerName"
          placeholder="请选择客户"
          class="w-80"
          readonly
          :disabled="isDetail"
          @click="openCustomerSearch"
        />
      </el-form-item>

      <!-- 产品裸价 -->
      <el-form-item label="产品裸价" prop="productPrice">
        <el-input-number
          v-model="formData.productNakedPrice"
          :min="0"
          :precision="2"
          placeholder="请输入产品裸价"
          class="w-80"
        />
      </el-form-item>

      <!-- 快递费用 -->
      <el-form-item label="快递费用" prop="expressFee">
        <el-input-number
          v-model="formData.expressFee"
          :min="0"
          :precision="2"
          placeholder="请输入快递费用"
          class="w-80"
        />
      </el-form-item>

      <!-- 代发价格 -->
      <el-form-item label="代发价格" prop="distributionPrice">
        <el-input-number
          v-model="formData.dropshipPrice"
          :min="0"
          :precision="2"
          placeholder="请输入代发价格"
          class="w-80"
        />
      </el-form-item>
    </el-form>
    
    <!-- 客户选择弹窗 -->
    <CustomerSearchDialog
      v-model:visible="customerSearchDialogVisible"
      @customer-selected="handleCustomerSelected"
    />
  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import CustomerSearchDialog from './CustomerSearchDialog.vue'

  defineOptions({ name: 'ErpPrivateBroadcastingReviewPriceForm' })

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
    customerId: undefined,
    customerName: '',
    productPrice: 0,
    expressFee: 0,
    distributionPrice: 0,
    productNakedPrice: 0,
    dropshipPrice: 0,
  })

  const rules = reactive({
    customerName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
    productNakedPrice: [{ required: true, message: '产品裸价不能为空', trigger: 'blur' }]
  })

  // 内部更新标记，避免循环更新
  const isInternalUpdate = ref(false)

  watch(
    () => props.propFormData,
    (data) => {
      if (!data || isInternalUpdate.value) return
      
      isInternalUpdate.value = true
      copyValueToTarget(formData, data)
      
      nextTick(() => {
        isInternalUpdate.value = false
      })
    },
    { immediate: true }
  )

  // 监听formData变化，实时同步到父组件
  watch(
    formData,
    (newData) => {
      if (!isInternalUpdate.value) {
        Object.assign(props.propFormData, newData)
      }
    },
    { deep: true }
  )

  // 客户选择弹窗
  const customerSearchDialogVisible = ref(false)

  const openCustomerSearch = () => {
    if (!props.isDetail) {
      customerSearchDialogVisible.value = true
    }
  }

  const handleCustomerSelected = (customer: any) => {
    formData.customerId = customer.id
    formData.customerName = customer.name
    
    // 同时更新父组件的 propFormData
    Object.assign(props.propFormData, {
      customerId: customer.id,
      customerName: customer.name
    })
  }

  const emit = defineEmits(['update:activeName'])
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
