<template>
  <el-form
    ref="formRef"
    :disabled="isDetail"
    :model="formData"
    :rules="rules"
    label-width="120px"
  >
    <!-- 天猫京东 -->
    <el-form-item label="天猫京东" prop="tmallJd">
      <el-input
        v-model="formData.tmallJd"
        placeholder="请输入天猫京东信息"
        class="w-80"
      />
    </el-form-item>

    <!-- 公域数据 -->
    <el-form-item label="公域数据" prop="publicData">
      <el-input
        v-model="formData.publicData"
        type="textarea"
        placeholder="请输入公域数据"
        class="w-80"
        :autosize="{ minRows: 2, maxRows: 4 }"
      />
    </el-form-item>

    <!-- 私域数据 -->
    <el-form-item label="私域数据" prop="privateData">
      <el-input
        v-model="formData.privateData"
        type="textarea"
        placeholder="请输入私域数据"
        class="w-80"
        :autosize="{ minRows: 2, maxRows: 4 }"
      />
    </el-form-item>

    <!-- 品牌背书 -->
    <el-form-item label="品牌背书" prop="brandEndorsement">
      <el-input
        v-model="formData.brandEndorsement"
        type="textarea"
        placeholder="请输入品牌背书"
        class="w-80"
        :autosize="{ minRows: 2, maxRows: 4 }"
      />
    </el-form-item>

    <!-- 竞品分析 -->
    <el-form-item label="竞品分析" prop="competitiveAnalysis">
      <el-input
        v-model="formData.competitiveAnalysis"
        type="textarea"
        placeholder="请输入竞品分析"
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
import type { GroupBuyingVO } from '@/api/erp/groupbuying'

defineOptions({ name: 'ErpGroupBuyingDataForm' })

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
  tmallJd: '',
  publicData: '',
  privateData: '',
  brandEndorsement: '',
  competitiveAnalysis: ''
})

const rules = reactive({
  // publicData: [{ required: true, message: '公域数据不能为空', trigger: 'blur' }],
  // privateData: [{ required: true, message: '私域数据不能为空', trigger: 'blur' }]
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
    message.error('【数据信息】不完善，请填写相关信息')
    emit('update:activeName', 'data')
    throw e
  }
}

defineExpose({ validate })
</script>
