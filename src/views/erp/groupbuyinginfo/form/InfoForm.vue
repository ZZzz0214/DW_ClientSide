<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <!-- 编号 -->
<!--      <el-form-item label="编号" prop="no">-->
<!--        <el-input-->
<!--          v-model="formData.no"-->
<!--          placeholder="请输入编号"-->
<!--          class="w-240px"-->
<!--          :disabled="isDetail"-->
<!--        />-->
<!--      </el-form-item>-->

      <!-- 客户姓名 -->
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="formData.customerName"
          placeholder="请输入客户名称"
          class="w-240px"
          @click="openCustomerSearch"
          readonly
        />
      </el-form-item>

      <!-- 客户职位 -->
<!--      <el-form-item label="客户职位" prop="customerPosition">-->
<!--        <el-input-->
<!--          v-model="formData.customerPosition"-->
<!--          placeholder="请输入客户职位"-->
<!--          class="w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="客户职位" prop="customerPosition">-->
<!--        <el-select-->
<!--          v-model="formData.customerPosition"-->
<!--          placeholder="请选择客户职位"-->
<!--          class="w-240px"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="dict in getStrDictOptions(DICT_TYPE.ERP_CUSTOMER_POSITION)"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="客户职位" prop="customerPosition">
        <el-select
          v-model="formData.customerPosition"
          placeholder="请选择客户职位"
          class="w-240px"
          filterable
          :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_CUSTOMER_POSITION)"
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
          class="w-240px"
        />
      </el-form-item>

      <!-- 平台名称 -->
<!--      <el-form-item label="平台名称" prop="platformName">-->
<!--        <el-input-->
<!--          v-model="formData.platformName"-->
<!--          placeholder="请输入平台名称"-->
<!--          class="w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="平台名称" prop="platformName">
        <el-select
          v-model="formData.platformName"
          placeholder="请选择平台名称"
          class="w-240px"
          filterable
    :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PLATFORM_NAME)"
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
<!--      <el-form-item label="客户属性" prop="customerAttribute">-->
<!--        <el-input-->
<!--          v-model="formData.customerAttribute"-->
<!--          placeholder="请输入客户属性"-->
<!--          class="w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="客户属性" prop="customerAttribute">
        <el-select
          v-model="formData.customerAttribute"
          placeholder="请选择客户属性"
          class="w-240px"
          filterable
    :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_CUSTOMER_ATTRIBUTE)"
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
<!--      <el-form-item label="客户城市" prop="customerCity">-->
<!--        <el-input-->
<!--          v-model="formData.customerCity"-->
<!--          placeholder="请输入客户城市"-->
<!--          class="w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="客户城市" prop="customerCity">
        <el-select
          v-model="formData.customerCity"
          placeholder="请选择客户城市"
          class="w-240px"
          filterable
          :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_CUSTOMER_CITY)"
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
<!--      <el-form-item label="客户区县" prop="customerDistrict">-->
<!--        <el-input-->
<!--          v-model="formData.customerDistrict"-->
<!--          placeholder="请输入客户区县"-->
<!--          class="w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="客户区县" prop="customerDistrict">
        <el-select
          v-model="formData.customerDistrict"
          placeholder="请选择客户区县"
          class="w-240px"
              filterable
    :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_CUSTOMER_DISTRICT)"
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
          class="w-240px"
          type="textarea"
        />
      </el-form-item>

      <!-- 招商类目 -->
      <el-form-item label="招商类目" prop="recruitmentCategory">
        <el-input
          v-model="formData.recruitmentCategory"
          placeholder="请输入招商类目"
          class="w-240px"
          type="textarea"
        />
      </el-form-item>

      <!-- 选品标准 -->
      <el-form-item label="选品标准" prop="selectionCriteria">
        <el-input
          v-model="formData.selectionCriteria"
          placeholder="请输入选品标准"
          class="w-240px"
          type="textarea"
        />
      </el-form-item>

<!--      <el-form-item label="用户画像" prop="userPortrait">-->
<!--  <el-select-->
<!--    v-model="formData.userPortrait"-->
<!--    placeholder="请选择用户画像"-->
<!--    class="w-240px"-->
<!--    filterable-->
<!--    :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_USER_PORTRAIT)"-->
<!--  >-->
<!--    <el-option-->
<!--      v-for="dict in filteredPortraitOptions"-->
<!--      :key="dict.value"-->
<!--      :label="dict.label"-->
<!--      :value="dict.value"-->
<!--    />-->
<!--  </el-select>-->
<!--</el-form-item>-->

<!--<el-form-item label="招商类目" prop="recruitmentCategory">-->
<!--  <el-select-->
<!--    v-model="formData.recruitmentCategory"-->
<!--    placeholder="请选择招商类目"-->
<!--    class="w-240px"-->
<!--    filterable-->
<!--    :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_RECRUITMENT_CATEGORY)"-->
<!--  >-->
<!--    <el-option-->
<!--      v-for="dict in filteredRecruitmentOptions"-->
<!--      :key="dict.value"-->
<!--      :label="dict.label"-->
<!--      :value="dict.value"-->
<!--    />-->
<!--  </el-select>-->
<!--</el-form-item>-->

<!--<el-form-item label="选品标准" prop="selectionCriteria">-->
<!--  <el-select-->
<!--    v-model="formData.selectionCriteria"-->
<!--    placeholder="请选择选品标准"-->
<!--    class="w-240px"-->
<!--    filterable-->
<!--    :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_SELECTION_CRITERIA)"-->
<!--  >-->
<!--    <el-option-->
<!--      v-for="dict in filteredCriteriaOptions"-->
<!--      :key="dict.value"-->
<!--      :label="dict.label"-->
<!--      :value="dict.value"-->
<!--    />-->
<!--  </el-select>-->
<!--</el-form-item>-->

      <!-- 备注 -->
      <el-form-item label="备注信息" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          placeholder="请输入备注"
          class="w-240px"
          :autosize="{ minRows: 2, maxRows: 4 }"
        />
      </el-form-item>
    </el-form>

  <CustomerSearchDialog
    v-model:visible="customerSearchDialogVisible"
    @customer-selected="handleCustomerSelected"
    ref="customerSearchDialog"
  />
  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import type { GroupBuyingInfoVO } from '@/api/erp/groupbuyinginfo'
  import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
  import CustomerSearchDialog from "@/views/erp/sale/saleprice/components/CustomerSearchDialog.vue";

  defineOptions({ name: 'ErpGroupBuyingInfoForm' })

  const props = defineProps({
    propFormData: {
      type: Object as PropType<GroupBuyingInfoVO>,
      default: () => {}
    },
    isDetail: propTypes.bool.def(false)
  })

  const message = useMessage()
  const formRef = ref()
  const formData = reactive<GroupBuyingInfoVO>({
    no: '',
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
    customerName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
    customerPosition: [{ required: true, message: '客户职位不能为空', trigger: 'blur' }],
    platformName: [{ required: true, message: '平台名称不能为空', trigger: 'blur' }],
    customerAttribute: [{ required: true, message: '客户属性不能为空', trigger: 'blur' }],
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



  const filteredPositionOptions = ref(getStrDictOptions(DICT_TYPE.ERP_CUSTOMER_POSITION))
const filteredPlatformOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PLATFORM_NAME))
const filteredAttributeOptions = ref(getStrDictOptions(DICT_TYPE.ERP_CUSTOMER_ATTRIBUTE))
const filteredCityOptions = ref(getStrDictOptions(DICT_TYPE.ERP_CUSTOMER_CITY))
const filteredDistrictOptions = ref(getStrDictOptions(DICT_TYPE.ERP_CUSTOMER_DISTRICT))

const filteredPortraitOptions = ref(getStrDictOptions(DICT_TYPE.ERP_USER_PORTRAIT))
const filteredRecruitmentOptions = ref(getStrDictOptions(DICT_TYPE.ERP_RECRUITMENT_CATEGORY))
const filteredCriteriaOptions = ref(getStrDictOptions(DICT_TYPE.ERP_SELECTION_CRITERIA))

// 修改filterDictOptions方法
const filterDictOptions = (value, dictType) => {
  const allOptions = getStrDictOptions(dictType)
  if (!value) {
    if (dictType === DICT_TYPE.ERP_CUSTOMER_POSITION) {
      filteredPositionOptions.value = allOptions
    } else if (dictType === DICT_TYPE.ERP_PLATFORM_NAME) {
      filteredPlatformOptions.value = allOptions
    } else if (dictType === DICT_TYPE.ERP_CUSTOMER_ATTRIBUTE) {
      filteredAttributeOptions.value = allOptions
    } else if (dictType === DICT_TYPE.ERP_CUSTOMER_CITY) {
      filteredCityOptions.value = allOptions
    } else if (dictType === DICT_TYPE.ERP_CUSTOMER_DISTRICT) {
      filteredDistrictOptions.value = allOptions
    }
    else if (dictType === DICT_TYPE.ERP_USER_PORTRAIT) {
      filteredPortraitOptions.value = allOptions
    } else if (dictType === DICT_TYPE.ERP_RECRUITMENT_CATEGORY) {
      filteredRecruitmentOptions.value = allOptions
    } else if (dictType === DICT_TYPE.ERP_SELECTION_CRITERIA) {
      filteredCriteriaOptions.value = allOptions
    }
    return
  }
  const filtered = allOptions.filter(item =>
    item.label.toLowerCase().includes(value.toLowerCase())
  )
  if (dictType === DICT_TYPE.ERP_CUSTOMER_POSITION) {
    filteredPositionOptions.value = filtered
  } else if (dictType === DICT_TYPE.ERP_PLATFORM_NAME) {
    filteredPlatformOptions.value = filtered
  } else if (dictType === DICT_TYPE.ERP_CUSTOMER_ATTRIBUTE) {
    filteredAttributeOptions.value = filtered
  } else if (dictType === DICT_TYPE.ERP_CUSTOMER_CITY) {
    filteredCityOptions.value = filtered
  } else if (dictType === DICT_TYPE.ERP_CUSTOMER_DISTRICT) {
    filteredDistrictOptions.value = filtered
  }
  else if (dictType === DICT_TYPE.ERP_USER_PORTRAIT) {
    filteredPortraitOptions.value = filtered
  } else if (dictType === DICT_TYPE.ERP_RECRUITMENT_CATEGORY) {
    filteredRecruitmentOptions.value = filtered
  } else if (dictType === DICT_TYPE.ERP_SELECTION_CRITERIA) {
    filteredCriteriaOptions.value = filtered
  }
}

  // 客户搜索弹窗相关
  const customerSearchDialogVisible = ref(false); // 客户搜索弹窗的显示状态

  const openCustomerSearch = () => {
    console.log("Opening customer search dialog");
    customerSearchDialogVisible.value = true;
  };

  const handleCustomerSelected = (customer: CustomerVO) => {
    formData.customerName = customer.name; // 填充客户名称
  };
  defineExpose({ validate })
  </script>
