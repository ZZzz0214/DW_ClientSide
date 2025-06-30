<template>
  <el-form
    ref="formRef"
    :disabled="isDetail"
    :model="formData"
    :rules="rules"
    label-width="120px"
  >

    <!-- 客户姓名 -->
    <el-form-item label="客户姓名" prop="customerName">
      <el-input
        v-model="formData.customerName"
        placeholder="请选择客户"
        class="w-80"
        readonly
        @click="openCustomerSearch"
      />
    </el-form-item>

    <!-- 客户职位 -->
    <el-form-item label="客户职位" prop="customerPosition">
      <el-select
        v-model="formData.customerPosition"
        placeholder="请选择客户职位"
        class="w-80"
        filterable
        :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRIVATE_CUSTOMER_POSITION)"
      >
        <el-option
          v-for="dict in filteredPositionOptions"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>

    <!-- 客户微信 -->
    <el-form-item label="客户微信" prop="customerWechat">
      <el-input
        v-model="formData.customerWechat"
        placeholder="请输入客户微信"
        class="w-80"
      />
    </el-form-item>

    <!-- 平台名称 -->
    <el-form-item label="平台名称" prop="platformName">
      <el-select
        v-model="formData.platformName"
        placeholder="请选择平台名称"
        class="w-80"
        filterable
        :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRIVATE_PLATFORM_NAME)"
      >
        <el-option
          v-for="dict in filteredPlatformOptions"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>

    <!-- 客户属性 -->
    <el-form-item label="客户属性" prop="customerAttribute">
      <el-select
        v-model="formData.customerAttribute"
        placeholder="请选择客户属性"
        class="w-80"
        filterable
        :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRIVATE_CUSTOMER_ATTRIBUTE)"
      >
        <el-option
          v-for="dict in filteredAttributeOptions"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>

    <!-- 客户城市 -->
    <el-form-item label="客户城市" prop="customerCity">
      <el-select
        v-model="formData.customerCity"
        placeholder="请选择客户城市"
        class="w-80"
        filterable
        :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRIVATE_CUSTOMER_CITY)"
      >
        <el-option
          v-for="dict in filteredCityOptions"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>

    <!-- 客户区县 -->
    <el-form-item label="客户区县" prop="customerDistrict">
      <el-select
        v-model="formData.customerDistrict"
        placeholder="请选择客户区县"
        class="w-80"
        filterable
        :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRIVATE_CUSTOMER_DISTRICT)"
      >
        <el-option
          v-for="dict in filteredDistrictOptions"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>

    <!-- 用户画像 -->
    <el-form-item label="用户画像" prop="userPortrait">
      <el-input
        v-model="formData.userPortrait"
        placeholder="请输入用户画像"
        class="w-80"
      />
    </el-form-item>

    <!-- 招商类目 -->
    <el-form-item label="招商类目" prop="recruitmentCategory">
      <el-input
        v-model="formData.recruitmentCategory"
        placeholder="请输入招商类目"
        class="w-80"
      />
    </el-form-item>

    <!-- 选品标准 -->
    <el-form-item label="选品标准" prop="selectionCriteria">
      <el-input
        v-model="formData.selectionCriteria"
        placeholder="请输入选品标准"
        class="w-80"
      />
    </el-form-item>

    <!-- 备注信息 -->
    <el-form-item label="备注信息" prop="remark">
      <el-input
        v-model="formData.remark"
        type="textarea"
        placeholder="请输入备注信息"
        class="w-80"
        :autosize="{ minRows: 2, maxRows: 4 }"
      />
    </el-form-item>
  </el-form>

  <!-- 客户搜索弹窗 -->
  <CustomerSearchDialog
    v-model:visible="customerSearchDialogVisible"
    @customer-selected="handleCustomerSelected"
    ref="customerSearchDialog"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, watch, PropType } from 'vue'
import { ElForm } from 'element-plus'
import { copyValueToTarget } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import type { ErpPrivateBroadcastingInfoRespVO } from '@/api/erp/privateBroadcastingInfo'
import type { CustomerVO } from '@/api/erp/sale/customer'
import CustomerSearchDialog from './CustomerSearchDialog.vue'

defineOptions({ name: 'ErpPrivateBroadcastingInfoForm' })

const props = defineProps({
  initialFormData: {
    type: Object as PropType<ErpPrivateBroadcastingInfoRespVO>,
    default: () => ({})
  },
  isDetail: propTypes.bool.def(false)
})

const formRef = ref<InstanceType<typeof ElForm>>()
const formData = reactive<ErpPrivateBroadcastingInfoRespVO>({
  id: undefined,
  no: '',
  customerId: undefined, // 客户ID（传递给后端）
  customerName: '',
  customerPosition: '',
  customerWechat: '',
  platformName: '',
  customerAttribute: '',
  customerCity: '',
  customerDistrict: '',
  userPortrait: '',
  recruitmentCategory: '',
  selectionCriteria: '',
  remark: ''
})

const rules = reactive({
  customerName: [{ required: true, message: '客户姓名不能为空', trigger: 'blur' }],
  customerPosition: [{ required: true, message: '客户职位不能为空', trigger: 'blur' }],
  //customerWechat: [{ required: true, message: '客户微信不能为空', trigger: 'blur' }],
  platformName: [{ required: true, message: '平台名称不能为空', trigger: 'blur' }],
  customerAttribute: [{ required: true, message: '客户属性不能为空', trigger: 'blur' }],
  //customerCity: [{ required: true, message: '客户城市不能为空', trigger: 'blur' }],
  //customerDistrict: [{ required: true, message: '客户区县不能为空', trigger: 'blur' }],
  //userPortrait: [{ required: true, message: '用户画像不能为空', trigger: 'blur' }],
  //recruitmentCategory: [{ required: true, message: '招商类目不能为空', trigger: 'blur' }],
  //selectionCriteria: [{ required: true, message: '选品标准不能为空', trigger: 'blur' }]
})

// 字典选项
const positionOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRIVATE_CUSTOMER_POSITION))
const platformOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRIVATE_PLATFORM_NAME))
const attributeOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRIVATE_CUSTOMER_ATTRIBUTE))
const cityOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRIVATE_CUSTOMER_CITY))
const districtOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRIVATE_CUSTOMER_DISTRICT))

// 过滤后的字典选项
const filteredPositionOptions = ref(positionOptions.value)
const filteredPlatformOptions = ref(platformOptions.value)
const filteredAttributeOptions = ref(attributeOptions.value)
const filteredCityOptions = ref(cityOptions.value)
const filteredDistrictOptions = ref(districtOptions.value)

// 字典过滤方法
const filterDictOptions = (value: string, dictType: string) => {
  const allOptions = getStrDictOptions(dictType)
  const filtered = value
    ? allOptions.filter(option => option.label.toLowerCase().includes(value.toLowerCase()))
    : allOptions

  // 更新对应的过滤选项
  switch (dictType) {
    case DICT_TYPE.ERP_PRIVATE_CUSTOMER_POSITION:
      filteredPositionOptions.value = filtered
      break
    case DICT_TYPE.ERP_PRIVATE_PLATFORM_NAME:
      filteredPlatformOptions.value = filtered
      break
    case DICT_TYPE.ERP_PRIVATE_CUSTOMER_ATTRIBUTE:
      filteredAttributeOptions.value = filtered
      break
    case DICT_TYPE.ERP_PRIVATE_CUSTOMER_CITY:
      filteredCityOptions.value = filtered
      break
    case DICT_TYPE.ERP_PRIVATE_CUSTOMER_DISTRICT:
      filteredDistrictOptions.value = filtered
      break
  }
}

// 客户搜索弹窗相关
const customerSearchDialogVisible = ref(false)
const customerSearchDialog = ref()

const openCustomerSearch = () => {
  if (props.isDetail) return
  customerSearchDialogVisible.value = true
}

const handleCustomerSelected = (customer: CustomerVO) => {
  formData.customerId = customer.id // 填充客户ID（传递给后端）
  formData.customerName = customer.name // 填充客户名称（用于显示）
}

watch(
  () => props.initialFormData,
  (data) => {
    if (!data) return
    copyValueToTarget(formData, data)

    // 如果是复制操作，清除不应该复制的字段
    if (data.id === undefined && data.no === '') {
      formData.id = undefined
      formData.no = ''
    }
  },
  { immediate: true }
)

const validate = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    return formData
  } catch (e) {
    console.error('表单校验失败', e)
    throw e
  }
}

defineExpose({ validate })
</script>
