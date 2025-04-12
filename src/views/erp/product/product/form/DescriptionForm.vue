<!-- 商品发布 - 库存箱规信息 -->
<!--<template>-->
<!--  <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" :disabled="isDetail">-->
<!--    &lt;!&ndash;富文本编辑器组件&ndash;&gt;-->
<!--    <el-form-item label="商品详情" prop="description">-->
<!--      <Editor v-model:modelValue="formData.description" />-->
<!--    </el-form-item>-->
<!--  </el-form>-->
<!--</template>-->
<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" :disabled="isDetail">
    <!-- 现货数量 -->
    <el-form-item label="现货数量" prop="totalQuantity">
      <el-input-number
        v-model="formData.totalQuantity"
        :min="0"
        placeholder="请输入现货数量"
        class="w-80!"
      />
    </el-form-item>

    <!-- 包材数量 -->
    <el-form-item label="包材数量" prop="packagingMaterialQuantity">
      <el-input-number
        v-model="formData.packagingMaterialQuantity"
        :min="0"
        placeholder="请输入包材数量"
        class="w-80!"
      />
    </el-form-item>

    <!-- 返单时效 -->
    <el-form-item label="返单时效" prop="orderReplenishmentLeadTime">
      <el-input
        v-model="formData.orderReplenishmentLeadTime"
        placeholder="请输入返单时效"
        class="w-80!"
      />
    </el-form-item>

    <!-- 品长宽高 -->
    <el-form-item label="品长宽高" prop="productDimensions">
      <el-input
        v-model="formData.productDimensions"
        placeholder="请输入品长宽高"
        class="w-80!"
      />
    </el-form-item>

    <!-- 产品箱规 -->
    <el-form-item label="产品箱规" prop="cartonSpecifications">
      <el-input
        v-model="formData.cartonSpecifications"
        placeholder="请输入产品箱规"
        class="w-80!"
      />
    </el-form-item>

    <!-- 箱长宽高 -->
    <el-form-item label="箱长宽高" prop="cartonDimensions">
      <el-input
        v-model="formData.cartonDimensions"
        placeholder="请输入箱长宽高"
        class="w-80!"
      />
    </el-form-item>

    <!-- 箱规重量 -->
    <el-form-item label="箱规重量" prop="cartonWeight">
      <el-input-number
        v-model="formData.cartonWeight"
        :min="0"
        placeholder="请输入箱规重量"
        class="w-80!"
      />
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
// import type { Spu } from '@/api/mall/product/spu'
import type { ProductVO } from '@/api/erp/product/product/index';
import { Editor } from '@/components/Editor'
import { PropType } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { copyValueToTarget } from '@/utils'

defineOptions({ name: 'ProductDescriptionForm' })

const message = useMessage() // 消息弹窗

const props = defineProps({
  propFormData: {
    type: Object as PropType<ProductVO>,
    default: () => {}
  },
  activeName: propTypes.string.def(''),
  isDetail: propTypes.bool.def(false) // 是否作为详情组件
})
const formRef = ref() // 表单Ref
const formData = reactive<ProductVO>({
  totalQuantity: 0, // 现货数量
  packagingMaterialQuantity: 0, // 包材数量
  orderReplenishmentLeadTime: '', // 返单时效
  productDimensions: '', // 品长宽高
  cartonSpecifications: '', // 产品箱规
  cartonDimensions: '', // 箱长宽高
  cartonWeight: 0 // 箱规重量
});

const rules = reactive({
  totalQuantity: [{ required: true, message: '现货数量不能为空', trigger: 'blur' }],
  packagingMaterialQuantity: [{ required: true, message: '包材数量不能为空', trigger: 'blur' }],
  orderReplenishmentLeadTime: [{ required: true, message: '返单时效不能为空', trigger: 'blur' }],
  productDimensions: [{ required: true, message: '品长宽高不能为空', trigger: 'blur' }],
  cartonSpecifications: [{ required: true, message: '产品箱规不能为空', trigger: 'blur' }],
  cartonDimensions: [{ required: true, message: '箱长宽高不能为空', trigger: 'blur' }],
  cartonWeight: [{ required: true, message: '箱规重量不能为空', trigger: 'blur' }]
});

// /** 富文本编辑器如果输入过再清空会有残留，需再重置一次 */
// watch(
//   () => formData.value.description,
//   (newValue) => {
//     if ('<p><br></p>' === newValue) {
//       formData.value.description = ''
//     }
//   },
//   {
//     deep: true,
//     immediate: true
//   }
// )

/** 将传进来的值赋值给 formData */
watch(
  () => props.propFormData,
  (data) => {
    if (!data) return
    // fix：三个表单组件监听赋值必须使用 copyValueToTarget 使用 formData.value = data 会监听非常多次
    copyValueToTarget(formData, data)
  },
  {
    // fix: 去掉深度监听只有对象引用发生改变的时候才执行,解决改一动多的问题
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
    message.error('【库存箱规信息】不完善，请填写相关信息')
    emit('update:activeName', 'description')
    throw e // 目的截断之后的校验
  }
}
defineExpose({ validate })
</script>
