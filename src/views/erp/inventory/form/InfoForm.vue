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
        :value="formData.productNo || ''"
        placeholder="请点击选择产品"
     class="w-80"
     :disabled="isDetail"
        readonly
        @click="openProductSelect"
        style="cursor: pointer;"
      >
        <template #append>
          <el-button @click="openProductSelect" :disabled="isDetail">
            <Icon icon="ep:search" />
          </el-button>
        </template>
      </el-input>
    </el-form-item>

    <!-- 产品名称 -->
    <el-form-item label="产品名称" prop="productName">
      <el-input
        v-model="formData.productName"
        placeholder="选择产品后自动填充"
        class="w-80"
        :disabled="true"
      />
    </el-form-item>

    <!-- 产品简称 -->
    <el-form-item label="产品简称" prop="productShortName">
      <el-input
        v-model="formData.productShortName"
        placeholder="选择产品后自动填充"
        class="w-80"
        :disabled="true"
      />
    </el-form-item>

    <!-- 品牌名称 -->
    <el-form-item label="品牌名称" prop="brand">
      <el-input
        v-model="brandDisplayValue"
        placeholder="选择产品后自动填充"
        class="w-80"
        :disabled="true"
      />
    </el-form-item>

    <!-- 产品品类 -->
    <el-form-item label="产品品类" prop="category">
      <el-input
        v-model="categoryDisplayValue"
        placeholder="选择产品后自动填充"
        class="w-80"
        :disabled="true"
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

          <!-- 剩余库存 - 仅在详情页面显示 -->
      <el-form-item v-if="isDetail" label="剩余库存" prop="remainingInventory">
        <el-input-number
          v-model="formData.remainingInventory"
          :precision="0"
          placeholder="系统自动计算"
          class="!w-1/1"
          disabled
        />
        <div class="text-xs text-gray-500 mt-1">
          剩余库存 = 现货库存 - (代发订单中该产品的总数量 + 批发订单中该产品的总数量)
        </div>
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

  <!-- 产品选择弹窗 -->
  <SelectProduct ref="selectProductRef" @selected="handleProductSelected" />
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { copyValueToTarget } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import type { InventoryVO } from '@/api/erp/inventory'
import SelectProduct from './SelectProduct.vue'
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'

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
const selectProductRef = ref()

// 字典转换的计算属性
const brandDisplayValue = computed(() => {
  if (!formData.brand) return ''
  const brandOptions = getStrDictOptions(DICT_TYPE.ERP_PRODUCT_BRAND)
  // 将数值转换为字符串进行匹配，因为字典值通常是字符串
  const brandValue = String(formData.brand)
  const brandOption = brandOptions.find(option => option.value === brandValue)
  return brandOption ? brandOption.label : formData.brand
})

const categoryDisplayValue = computed(() => {
  if (!formData.category) return ''
  const categoryOptions = getStrDictOptions(DICT_TYPE.ERP_PRODUCT_CATEGORY)
  // 将数值转换为字符串进行匹配，因为字典值通常是字符串
  const categoryValue = String(formData.category)
  const categoryOption = categoryOptions.find(option => option.value === categoryValue)
  return categoryOption ? categoryOption.label : formData.category
})

const formData = reactive<InventoryVO>({
  productId: undefined,
  productNo: '',
  productName: '',
  productShortName: '',
  brand: '',
  category: '',
  spotInventory: 0,
  remark: ''
})

const rules = reactive({
  productId: [{ required: true, message: '产品编号不能为空', trigger: 'blur' }],
  productName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
  spotInventory: [{ required: true, message: '现货库存不能为空', trigger: 'blur' }]
  // 剩余库存为系统自动计算，无需验证
})

/** 打开产品选择弹窗 */
const openProductSelect = () => {
  if (!props.isDetail) {
    selectProductRef.value?.open()
  }
}

/** 处理产品选择 */
const handleProductSelected = (product: any) => {
  formData.productId = product.id  // 保存产品ID用于后端
  formData.productNo = product.no || product.id || ''  // 保存产品编号用于显示
  formData.productName = product.name || ''
  formData.productShortName = product.productShortName || ''
  formData.brand = product.brand || ''
  formData.category = product.categoryId || ''  // 注意：这里使用categoryId
  
  // 同步到父组件的数据
  Object.assign(props.propFormData, formData)
}

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
