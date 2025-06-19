<template>
  <el-form ref="formRef" :model="formData" label-width="120px">
    <el-form-item label="公域链接" prop="publicLink">
      <el-input v-model="formData.publicLink" placeholder="请输入公域链接" :disabled="isDetail" @input="handleUpdate" />
    </el-form-item>
    <el-form-item label="核心卖点" prop="coreSellingPoint">
      <el-input v-model="formData.coreSellingPoint" placeholder="请输入核心卖点" :disabled="isDetail" @input="handleUpdate" />
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

const formRef = ref<InstanceType<typeof ElForm>>()

watch(() => props.propFormData, (newValue) => {
  formData.value = newValue
}, { deep: true })

const handleUpdate = () => {
  emit('update:formData', {
    publicLink: formData.value.publicLink,
    coreSellingPoint: formData.value.coreSellingPoint
  })
}

defineExpose({
  validate: async () => {
    const valid = await formRef.value?.validate()
    if (valid) {
      emit('update:formData', {
        publicLink: formData.value.publicLink,
        coreSellingPoint: formData.value.coreSellingPoint
      })
    }
    return valid
  }
})
</script>