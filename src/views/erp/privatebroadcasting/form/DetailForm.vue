<template>
  <el-form
    ref="formRef"
    :disabled="isDetail"
    :model="formData"
    label-width="120px"
  >
    <!-- 这里可以添加库存明细相关的表单字段 -->
    <el-form-item label="产品ID" prop="productId">
      <el-input
        v-model="formData.productId"
        placeholder="请输入产品ID"
        class="w-80"
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { copyValueToTarget } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import type { InventoryVO } from '@/api/erp/inventory'

defineOptions({ name: 'ErpInventoryDetailForm' })

const props = defineProps({
  propFormData: {
    type: Object as PropType<InventoryVO>,
    default: () => {}
  },
  isDetail: propTypes.bool.def(false)
})

const formRef = ref()
const formData = reactive({
  productId: undefined
})

/** 将传进来的值赋值给 formData */
watch(
  () => props.propFormData,
  (data) => {
    if (!data) return
    copyValueToTarget(formData, data)
  },
  { immediate: true }
)

/** 表单校验 */
const validate = async () => {
  // 这里可以添加明细表单的校验逻辑
}

defineExpose({ validate })
</script>