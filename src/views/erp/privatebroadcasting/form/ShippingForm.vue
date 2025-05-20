<template>
  <el-form ref="formRef" :model="formData" label-width="120px">
    <el-form-item label="快递公司" prop="expressCompany">
      <el-input v-model="formData.expressCompany" placeholder="请输入快递公司" :disabled="isDetail" />
    </el-form-item>
    <el-form-item label="发货时效" prop="shippingTime">
      <el-input v-model="formData.shippingTime" placeholder="请输入发货时效" :disabled="isDetail" />
    </el-form-item>
    <el-form-item label="发货地区" prop="shippingArea">
      <el-input v-model="formData.shippingArea" placeholder="请输入发货地区" :disabled="isDetail" />
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

const formRef = ref<InstanceType<typeof ElForm>>()

watch(() => props.propFormData, (newValue) => {
  formData.value = newValue
}, { deep: true })

defineExpose({
  validate: () => formRef.value?.validate()
})
</script>