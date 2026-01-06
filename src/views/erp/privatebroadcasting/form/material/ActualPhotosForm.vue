<template>
  <el-form
    ref="formRef"
    :disabled="isDetail"
    :model="formData"
    label-width="120px"
  >
    <el-form-item label="实拍" prop="actualPhotos">
      <RichTextWithUpload
        v-model="formData.actualPhotos"
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
import type { PrivateBroadcastingVO } from '@/api/erp/PrivateBroadcasting'
import { RichTextWithUpload } from '@/components/RichTextWithUpload'

defineOptions({ name: 'ErpPrivateBroadcastingActualPhotosForm' })

const props = defineProps({
  propFormData: {
    type: Object as PropType<PrivateBroadcastingVO>,
    default: () => {}
  },
  isDetail: propTypes.bool.def(false)
})

const formRef = ref()
const emit = defineEmits(['update:activeName', 'update:formData'])

const formData = reactive({
  actualPhotos: ''
})

watch(
  () => props.propFormData,
  (data) => {
    if (!data) return
    copyValueToTarget(formData, {
      actualPhotos: data.actualPhotos || ''
    })
  },
  { immediate: true }
)

const validate = async () => {
  const valid = await formRef.value?.validate()
  if (valid) {
    emit('update:formData', {
      actualPhotos: formData.actualPhotos
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

