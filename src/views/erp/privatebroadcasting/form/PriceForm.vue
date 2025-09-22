<template>
  <el-form ref="formRef" :model="formData" label-width="120px" :rules="rules">
    <el-form-item label="直播价格" prop="livePrice">
      <el-input v-model="formData.livePrice" placeholder="请输入直播价格" :disabled="isDetail" @input="handleUpdate" />
    </el-form-item>
    <el-form-item label="产品裸价" prop="productNakedPrice">
      <el-input v-model="formData.productNakedPrice" placeholder="请输入产品裸价" :disabled="isDetail" @input="handleUpdate" />
    </el-form-item>
    <el-form-item label="快递费用" prop="expressFee">
      <el-input v-model="formData.expressFee" placeholder="请输入快递费用" :disabled="isDetail" @input="handleUpdate" />
    </el-form-item>
    <el-form-item label="代发价格" prop="dropshipPrice">
      <el-input v-model="formData.dropshipPrice" placeholder="请输入代发价格" :disabled="isDetail" @input="handleUpdate" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ElForm } from 'element-plus'
import { ref, watch, defineExpose, defineEmits } from 'vue'

const props = defineProps({
  isDetail: Boolean,
  propFormData: Object
})

const emit = defineEmits(['update:formData'])

const formData = ref(props.propFormData)
const rules = {
  livePrice: [
    { required: true, message: '直播价格不能为空', trigger: 'blur' },
    { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效的价格格式（最多两位小数）', trigger: 'blur' }
  ],
  productNakedPrice: [
    { required: true, message: '产品裸价不能为空', trigger: 'blur' },
    { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效的价格格式（最多两位小数）', trigger: 'blur' }
  ],
  expressFee: [
    { required: true, message: '快递费用不能为空', trigger: 'blur' },
    { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效的价格格式（最多两位小数）', trigger: 'blur' }
  ],
  dropshipPrice: [
    { required: true, message: '代发价格不能为空', trigger: 'blur' },
    { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效的价格格式（最多两位小数）', trigger: 'blur' }
  ]
}

const formRef = ref<InstanceType<typeof ElForm>>()

watch(() => props.propFormData, (newValue) => {
  formData.value = newValue
}, { deep: true })

const handleUpdate = () => {
  emit('update:formData', {
    livePrice: formData.value.livePrice,
    productNakedPrice: formData.value.productNakedPrice,
    expressFee: formData.value.expressFee,
    dropshipPrice: formData.value.dropshipPrice
  })
}

defineExpose({
  validate: async () => {
    const valid = await formRef.value?.validate()
    if (valid) {
      emit('update:formData', {
        livePrice: formData.value.livePrice,
        productNakedPrice: formData.value.productNakedPrice,
        expressFee: formData.value.expressFee,
        dropshipPrice: formData.value.dropshipPrice
      })
    }
    return valid
  }
})
</script>