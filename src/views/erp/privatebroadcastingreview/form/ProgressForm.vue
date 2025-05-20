<template>
  <el-form ref="formRef" :model="formData" label-width="120px" :rules="rules">
    <el-form-item label="寄样日期" prop="sampleSendDate">
      <el-date-picker
        v-model="formData.sampleSendDate"
        type="date"
        placeholder="请选择寄样日期"
        value-format="YYYY-MM-DD"
        :disabled="isDetail"
      />
    </el-form-item>
    <el-form-item label="开团日期" prop="groupStartDate">
      <el-date-picker
        v-model="formData.groupStartDate"
        type="date"
        placeholder="请选择开团日期"
        value-format="YYYY-MM-DD"
        :disabled="isDetail"
      />
    </el-form-item>
    <el-form-item label="开团销量" prop="groupSales">
      <el-input v-model.number="formData.groupSales" placeholder="请输入开团销量" :disabled="isDetail" />
    </el-form-item>
    <el-form-item label="复团日期" prop="repeatGroupDate">
      <el-date-picker
        v-model="formData.repeatGroupDate"
        type="date"
        placeholder="请选择复团日期"
        value-format="YYYY-MM-DD"
        :disabled="isDetail"
      />
    </el-form-item>
    <el-form-item label="复团销量" prop="repeatGroupSales">
      <el-input v-model.number="formData.repeatGroupSales" placeholder="请输入复团销量" :disabled="isDetail" />
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
  sampleSendDate: [{ required: true, message: '寄样日期不能为空', trigger: 'blur' }],
  groupStartDate: [{ required: true, message: '开团日期不能为空', trigger: 'blur' }]
}

const formRef = ref<InstanceType<typeof ElForm>>()

watch(() => props.propFormData, (newValue) => {
  formData.value = newValue
}, { deep: true })

defineExpose({
  validate: () => formRef.value?.validate()
})
</script>