<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <!-- 核心价格 -->
      <el-form-item label="核心价格" prop="corePrice">
        <div style="display: flex; align-items: center;">
        <el-input-number
          v-model="formData.corePrice"
          :min="0"
          :precision="2"
          placeholder="请输入核心价格"
          class="w-80!"
        />
          <span style="margin-left: 25px;">元</span>
        </div>
      </el-form-item>

      <!-- 分发价格 -->
      <el-form-item label="分发价格" prop="distributionPrice">
        <div style="display: flex; align-items: center;">
        <el-input-number
          v-model="formData.distributionPrice"
          :min="0"
          :precision="2"
          placeholder="请输入分发价格"
          class="w-80!"
        />
        <span style="margin-left: 25px;">元</span>
        </div>
      </el-form-item>
    </el-form>
  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import type { GroupBuyingVO } from '@/api/erp/groupbuying'

  defineOptions({ name: 'ErpGroupBuyingCoreForm' })

  const props = defineProps({
    propFormData: {
      type: Object as PropType<GroupBuyingVO>,
      default: () => {}
    },
    isDetail: propTypes.bool.def(false)
  })

  const message = useMessage()
  const formRef = ref()
  const formData = reactive({
    corePrice: 0,
    distributionPrice: 0
  })

  const rules = reactive({
    corePrice: [{ required: true, message: '核心价格不能为空', trigger: 'blur' }],
    distributionPrice: [{ required: true, message: '分发价格不能为空', trigger: 'blur' }]
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
  const emit = defineEmits(['update:activeName', 'update:formData'])
  const validate = async () => {
    if (!formRef) return
    try {
      await unref(formRef)?.validate()
      
      // 通过emit事件将数据传递给父组件，而不是直接修改props
      const updatedData = { ...formData }
      emit('update:formData', updatedData)
    } catch (e) {
      message.error('【核心机制】不完善，请填写相关信息')
      emit('update:activeName', 'core')
      throw e
    }
  }

  defineExpose({ validate })
  </script>
