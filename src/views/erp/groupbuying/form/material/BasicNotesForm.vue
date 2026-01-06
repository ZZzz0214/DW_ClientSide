<template>
  <el-form
    ref="formRef"
    :disabled="isDetail"
    :model="formData"
    label-width="120px"
  >
    <el-form-item label="基础笔记" prop="basicNotes">
      <RichTextWithUpload
        v-model="formData.basicNotes"
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
import type { GroupBuyingVO } from '@/api/erp/groupbuying'
import { RichTextWithUpload } from '@/components/RichTextWithUpload'

defineOptions({ name: 'ErpGroupBuyingBasicNotesForm' })

const props = defineProps({
  propFormData: {
    type: Object as PropType<GroupBuyingVO>,
    default: () => {}
  },
  isDetail: propTypes.bool.def(false)
})

const formRef = ref()
const emit = defineEmits(['update:activeName', 'update:formData'])

const formData = reactive({
  basicNotes: ''
})

watch(
  () => props.propFormData,
  (data) => {
    if (!data) return
    copyValueToTarget(formData, {
      basicNotes: data.basicNotes || ''
    })
  },
  { immediate: true }
)

const validate = async () => {
  const valid = await formRef.value?.validate()
  if (valid) {
    emit('update:formData', {
      basicNotes: formData.basicNotes
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

