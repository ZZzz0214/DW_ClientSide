<template>
  <el-form
    ref="formRef"
    :disabled="isDetail"
    :model="formData"
    label-width="120px"
  >
    <el-form-item label="主图" prop="mainImage">
      <RichTextWithUpload
        v-model="formData.mainImage"
        :disabled="isDetail"
        editor-height="800px"
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { copyValueToTarget } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import type { LiveBroadcastingVO } from '@/api/erp/LiveBroadcasting'
import { RichTextWithUpload } from '@/components/RichTextWithUpload'

defineOptions({ name: 'ErpLiveBroadcastingMainImageForm' })

const props = defineProps({
  propFormData: {
    type: Object as PropType<LiveBroadcastingVO>,
    default: () => {}
  },
  isDetail: propTypes.bool.def(false)
})

const formRef = ref()
const emit = defineEmits(['update:activeName', 'update:formData'])

const formData = reactive({
  mainImage: ''
})

watch(
  () => props.propFormData,
  (data) => {
    if (!data) return
    copyValueToTarget(formData, {
      mainImage: data.mainImage || ''
    })
  },
  { immediate: true }
)

const validate = async () => {
  const valid = await formRef.value?.validate()
  if (valid) {
    emit('update:formData', {
      mainImage: formData.mainImage
    })
  }
  return valid
}

defineExpose({ validate })
</script>

<style lang="scss" scoped>
:deep(.el-form-item) {
  margin-bottom: 24px;
}
</style>

