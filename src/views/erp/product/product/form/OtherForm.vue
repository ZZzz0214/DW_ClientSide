<!-- 商品发布 - 机制信息 -->
<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="120px"
    :disabled="isDetail"
  >
    <!-- 公域活动最低价 -->
    <el-form-item label="公域活动最低价" prop="publicDomainEventMinimumPrice">
      <el-input
        v-model="formData.publicDomainEventMinimumPrice"
        placeholder="请输入公域活动最低价"
        class="w-80!"
      />
    </el-form-item>

    <!-- 直播活动最低价 -->
    <el-form-item label="直播活动最低价" prop="liveStreamingEventMinimunPrice">
      <el-input
        v-model="formData.liveStreamingEventMinimunPrice"
        placeholder="请输入直播活动最低价"
        class="w-80!"
      />
    </el-form-item>

    <!-- 多多活动最低价 -->
    <el-form-item label="多多活动最低价" prop="pinduoduoEventMinimumPrice">
      <el-input
        v-model="formData.pinduoduoEventMinimumPrice"
        placeholder="请输入多多活动最低价"
        class="w-80!"
      />
    </el-form-item>

    <!-- 阿里活动最低价 -->
    <el-form-item label="阿里活动最低价" prop="alibabaEventMinimunPrice">
      <el-input
        v-model="formData.alibabaEventMinimunPrice"
        placeholder="请输入阿里活动最低价"
        class="w-80!"
      />
    </el-form-item>

    <!-- 团购活动最低价 -->
    <el-form-item label="团购活动最低价" prop="groupBuyEventMinimunPrice">
      <el-input
        v-model="formData.groupBuyEventMinimunPrice"
        placeholder="请输入团购活动最低价"
        class="w-80!"
      />
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
// import type { Spu } from '@/api/mall/product/spu'
import type { ProductVO } from '@/api/erp/product/product/index';
import { PropType } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { copyValueToTarget } from '@/utils'

defineOptions({ name: 'ProductOtherForm' })

const message = useMessage() // 消息弹窗

const props = defineProps({
  propFormData: {
    type: Object as PropType<ProductVO>,
    default: () => {}
  },
  isDetail: propTypes.bool.def(false) // 是否作为详情组件
})

const formRef = ref() // 表单Ref
// 表单数据
const formData = reactive<ProductVO>({
  publicDomainEventMinimumPrice: '', // 公域活动最低价
  liveStreamingEventMinimunPrice: '', // 直播活动最低价
  pinduoduoEventMinimumPrice: '', // 多多活动最低价
  alibabaEventMinimunPrice: '', // 阿里活动最低价
  groupBuyEventMinimunPrice: '' // 团购活动最低价
});

const rules = reactive({
  publicDomainEventMinimumPrice: [{ required: true, message: '公域活动最低价不能为空', trigger: 'blur' }],
  liveStreamingEventMinimunPrice: [{ required: true, message: '直播活动最低价不能为空', trigger: 'blur' }],
  pinduoduoEventMinimumPrice: [{ required: true, message: '多多活动最低价不能为空', trigger: 'blur' }],
  alibabaEventMinimunPrice: [{ required: true, message: '阿里活动最低价不能为空', trigger: 'blur' }],
  groupBuyEventMinimunPrice: [{ required: true, message: '团购活动最低价不能为空', trigger: 'blur' }]
});

/** 将传进来的值赋值给 formData */
watch(
  () => props.propFormData,
  (data) => {
    if (!data) {
      return
    }
    copyValueToTarget(formData, data)
  },
  {
    immediate: true
  }
)

/** 表单校验 */
const emit = defineEmits(['update:activeName'])
const validate = async () => {
  if (!formRef) return
  try {
    await unref(formRef)?.validate()
    // 校验通过更新数据
    Object.assign(props.propFormData, formData)
  } catch (e) {
    message.error('【机制信息】不完善，请填写相关信息')
    emit('update:activeName', 'other')
    throw e // 目的截断之后的校验
  }
}
defineExpose({ validate })
</script>
