<template>
  <el-form
    ref="formRef"
    :disabled="isDetail"
    :model="formData"
    :rules="rules"
    label-width="120px"
  >
 <!-- 产品编号 -->
 <el-form-item label="产品编号" prop="productId">
   <el-input
     v-model="formData.productId"
     placeholder="请输入产品编号"
     class="w-80"
     :disabled="isDetail"
   />
    </el-form-item>

    <!-- 现货库存 -->
    <el-form-item label="现货库存" prop="spotInventory">
      <el-input-number
        v-model="formData.spotInventory"
        :min="0"
        placeholder="请输入现货库存"
        class="w-80"
      />
    </el-form-item>

    <!-- 剩余库存 -->
    <el-form-item label="剩余库存" prop="remainingInventory">
      <el-input-number
        v-model="formData.remainingInventory"
        :min="0"
        placeholder="请输入剩余库存"
        class="w-80"
      />
    </el-form-item>

    <!-- 备注 -->
    <el-form-item label="备注" prop="remark">
      <el-input
        v-model="formData.remark"
        type="textarea"
        placeholder="请输入备注"
        class="w-80"
        :autosize="{ minRows: 2, maxRows: 4 }"
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { copyValueToTarget } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import type { InventoryVO } from '@/api/erp/inventory'

defineOptions({ name: 'ErpInventoryInfoForm' })

const props = defineProps({
  propFormData: {
    type: Object as PropType<InventoryVO>,
    default: () => {}
  },
  isDetail: propTypes.bool.def(false)
})

const message = useMessage()
const formRef = ref()
const formData = reactive<InventoryVO>({
  productId: undefined,
  spotInventory: 0,
  remainingInventory: 0,
  remark: ''
})

const rules = reactive({
  no: [{ required: true, message: '库存编号不能为空', trigger: 'blur' }],
  productName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
  spotInventory: [{ required: true, message: '现货库存不能为空', trigger: 'blur' }],
  remainingInventory: [{ required: true, message: '剩余库存不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
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
const emit = defineEmits(['update:activeName'])
const validate = async () => {
  if (!formRef) return
  try {
    await unref(formRef)?.validate()
    Object.assign(props.propFormData, formData)
  } catch (e) {
    message.error('【基础信息】不完善，请填写相关信息')
    emit('update:activeName', 'info')
    throw e
  }
}

defineExpose({ validate })
</script>
