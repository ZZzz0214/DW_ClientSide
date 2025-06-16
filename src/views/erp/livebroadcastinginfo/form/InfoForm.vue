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
<!--      <el-form-item label="客户职位" prop="customerPosition">-->
<!--        <el-input-->
<!--          v-model="formData.customerPosition"-->
<!--          placeholder="请输入客户职位"-->
<!--          class="w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="客户职位" prop="customerPosition">
        <el-select
          v-model="formData.customerPosition"
          placeholder="请选择客户职位"
          class="w-80"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.ERP_LIVE_CUSTOMER_POSITION)"
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
          class="w-80"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.ERP_LIVE_PLATFORM_NAME)"
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
          class="w-80"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.ERP_LIVE_CUSTOMER_ATTRIBUTE)"
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
          class="w-80"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.ERP_LIVE_CUSTOMER_CITY)"
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
          class="w-80"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.ERP_LIVE_CUSTOMER_DISTRICT)"
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
  import type { LiveBroadcastingInfoVO } from '@/api/erp/livebroadcastinginfo'
  import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
  import type { CustomerVO } from '@/api/erp/sale/customer'
  import CustomerSearchDialog from './CustomerSearchDialog.vue'

  defineOptions({ name: 'ErpLiveBroadcastingInfoForm' })

  const props = defineProps({
    propFormData: {
      type: Object as PropType<LiveBroadcastingInfoVO>,
      default: () => ({})
    },
    isDetail: propTypes.bool.def(false)
  })

  const message = useMessage()
  const formRef = ref<InstanceType<typeof ElForm>>()
  const formData = reactive<LiveBroadcastingInfoVO>({
    id: undefined,
    no: '',
    customerId: undefined,
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
    no: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
    customerId: [{ required: true, message: '客户姓名不能为空', trigger: 'blur' }],
    customerPosition: [{ required: true, message: '客户职位不能为空', trigger: 'blur' }],
    customerWechat: [{ required: true, message: '客户微信不能为空', trigger: 'blur' }],
    platformName: [{ required: true, message: '平台名称不能为空', trigger: 'blur' }],
    customerAttribute: [{ required: true, message: '客户属性不能为空', trigger: 'blur' }],
    customerCity: [{ required: true, message: '客户城市不能为空', trigger: 'blur' }],
    customerDistrict: [{ required: true, message: '客户区县不能为空', trigger: 'blur' }],
    userPortrait: [{ required: true, message: '用户画像不能为空', trigger: 'blur' }],
    recruitmentCategory: [{ required: true, message: '招商类目不能为空', trigger: 'blur' }],
    selectionCriteria: [{ required: true, message: '选品标准不能为空', trigger: 'blur' }]
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

  // 监听内部表单数据变化，同步到父组件
  watch(
    () => formData,
    (data) => {
      if (props.propFormData) {
        copyValueToTarget(props.propFormData, data)
      }
    },
    { deep: true }
  )

  const emit = defineEmits(['update:activeName'])
  /** 表单校验 */
  const validate = async () => {
    if (!formRef.value) return
    try {
      await formRef.value.validate()
      // 确保返回最新的表单数据
      if (props.propFormData) {
        copyValueToTarget(props.propFormData, formData)
      }
      return formData
    } catch (e) {
      console.error('表单校验失败', e)
      throw e
    }
  }

  defineExpose({ validate })

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
  </script>
