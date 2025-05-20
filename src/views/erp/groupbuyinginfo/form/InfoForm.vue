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
          placeholder="请输入客户姓名"
          class="w-240px"
        />
      </el-form-item>

      <!-- 客户职位 -->
      <el-form-item label="客户职位" prop="customerPosition">
        <el-input
          v-model="formData.customerPosition"
          placeholder="请输入客户职位"
          class="w-240px"
        />
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
      <el-form-item label="平台名称" prop="platformName">
        <el-input
          v-model="formData.platformName"
          placeholder="请输入平台名称"
          class="w-240px"
        />
      </el-form-item>

      <!-- 客户属性 -->
      <el-form-item label="客户属性" prop="customerAttribute">
        <el-input
          v-model="formData.customerAttribute"
          placeholder="请输入客户属性"
          class="w-240px"
        />
      </el-form-item>

      <!-- 客户城市 -->
      <el-form-item label="客户城市" prop="customerCity">
        <el-input
          v-model="formData.customerCity"
          placeholder="请输入客户城市"
          class="w-240px"
        />
      </el-form-item>

      <!-- 客户区县 -->
      <el-form-item label="客户区县" prop="customerDistrict">
        <el-input
          v-model="formData.customerDistrict"
          placeholder="请输入客户区县"
          class="w-240px"
        />
      </el-form-item>

      <!-- 用户画像 -->
      <el-form-item label="用户画像" prop="userPortrait">
        <el-input
          v-model="formData.userPortrait"
          placeholder="请输入用户画像"
          class="w-240px"
        />
      </el-form-item>

      <!-- 招商类目 -->
      <el-form-item label="招商类目" prop="recruitmentCategory">
        <el-input
          v-model="formData.recruitmentCategory"
          placeholder="请输入招商类目"
          class="w-240px"
        />
      </el-form-item>

      <!-- 选品标准 -->
      <el-form-item label="选品标准" prop="selectionCriteria">
        <el-input
          v-model="formData.selectionCriteria"
          placeholder="请输入选品标准"
          class="w-240px"
        />
      </el-form-item>

      <!-- 备注 -->
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          placeholder="请输入备注"
          class="w-240px"
          :autosize="{ minRows: 2, maxRows: 4 }"
        />
      </el-form-item>
    </el-form>
  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import type { GroupBuyingInfoVO } from '@/api/erp/groupbuyinginfo'

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
    no: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
    customerName: [{ required: true, message: '客户姓名不能为空', trigger: 'blur' }],
    platformName: [{ required: true, message: '平台名称不能为空', trigger: 'blur' }]
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
