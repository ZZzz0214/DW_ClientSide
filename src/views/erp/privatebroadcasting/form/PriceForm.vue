<template>
  <el-form ref="formRef" :model="formData" label-width="120px" :rules="rules">
    <el-form-item label="直播价格" prop="livePrice">
      <el-input v-model.number="formData.livePrice" placeholder="请输入直播价格" :disabled="isDetail" />
    </el-form-item>
    <el-form-item label="产品裸价" prop="productNakedPrice">
      <el-input v-model.number="formData.productNakedPrice" placeholder="请输入产品裸价" :disabled="isDetail" />
    </el-form-item>
    <el-form-item label="快递费用" prop="expressFee">
      <el-input v-model.number="formData.expressFee" placeholder="请输入快递费用" :disabled="isDetail" />
    </el-form-item>
    <el-form-item label="代发价格" prop="dropshipPrice">
      <el-input v-model.number="formData.dropshipPrice" placeholder="请输入代发价格" :disabled="isDetail" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ElForm } from 'element-plus'
import { ref, watch, defineExpose } from 'vue'

const props = defineProps({
  isDetail: Boolean,
  propFormData: Object
})
const formData = ref(props.propFormData)
const rules = {
  livePrice: [{ required: true, message: '直播价格不能为空', trigger: 'blur' }],
  productNakedPrice: [{ required: true, message: '产品裸价不能为空', trigger: 'blur' }],
  expressFee: [{ required: true, message: '快递费用不能为空', trigger: 'blur' }],
  dropshipPrice: [{ required: true, message: '代发价格不能为空', trigger: 'blur' }]
}

const formRef = ref<InstanceType<typeof ElForm>>()

watch(() => props.propFormData, (newValue) => {
  formData.value = newValue
}, { deep: true })

defineExpose({
  validate: () => formRef.value?.validate()
})
</script>