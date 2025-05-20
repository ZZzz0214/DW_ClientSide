<template>
  <el-form ref="formRef" :model="formData" label-width="120px" :rules="rules">
    <el-form-item label="编号" prop="no">
      <el-input v-model="formData.no" placeholder="请输入编号" :disabled="isDetail" />
    </el-form-item>
    <el-form-item label="产品图片" prop="productImage">
      <el-input v-model="formData.productImage" placeholder="请输入产品图片链接" :disabled="isDetail" />
    </el-form-item>
    <el-form-item label="品牌名称" prop="brandId">
      <el-input v-model="formData.brandId" placeholder="请输入品牌名称" :disabled="isDetail" />
    </el-form-item>
    <el-form-item label="产品名称" prop="productName">
      <el-input v-model="formData.productName" placeholder="请输入产品名称" :disabled="isDetail" />
    </el-form-item>
    <el-form-item label="产品规格" prop="productSpec">
      <el-input v-model="formData.productSpec" placeholder="请输入产品规格" :disabled="isDetail" />
    </el-form-item>
    <el-form-item label="产品SKU" prop="productSku">
      <el-input v-model="formData.productSku" placeholder="请输入产品SKU" :disabled="isDetail" />
    </el-form-item>
    <el-form-item label="市场价格" prop="marketPrice">
      <el-input v-model.number="formData.marketPrice" placeholder="请输入市场价格" :disabled="isDetail" />
    </el-form-item>
    <el-form-item label="保质日期" prop="shelfLife">
      <el-date-picker
        v-model="formData.shelfLife"
        type="date"
        placeholder="请选择保质日期"
        value-format="YYYY-MM-DD"
        :disabled="isDetail"
      />
    </el-form-item>
    <el-form-item label="产品库存" prop="productStock">
      <el-input v-model.number="formData.productStock" placeholder="请输入产品库存" :disabled="isDetail" />
    </el-form-item>
    <el-form-item label="备注信息" prop="remark">
      <el-input v-model="formData.remark" placeholder="请输入备注信息" :disabled="isDetail" />
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
  no: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
  productName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
  productStock: [{ required: true, message: '产品库存不能为空', trigger: 'blur' }],
  marketPrice: [{ required: true, message: '市场价格不能为空', trigger: 'blur' }]
}

const formRef = ref<InstanceType<typeof ElForm>>()

watch(() => props.propFormData, (newValue) => {
  formData.value = newValue
}, { deep: true })

defineExpose({
  validate: () => formRef.value?.validate()
})
</script>