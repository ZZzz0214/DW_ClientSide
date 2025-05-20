<template>
  <el-form
    ref="formRef"
    :disabled="isDetail"
    :model="formData"
    :rules="rules"
    label-width="120px"
  >
    <!-- 编号 -->
    <el-form-item label="编号" prop="no">
      <el-input
        v-model="formData.no"
        placeholder="请输入编号"
        class="w-80"
      />
    </el-form-item>

    <!-- 客户姓名 -->
    <el-form-item label="客户姓名" prop="customerName">
      <el-input
        v-model="formData.customerName"
        placeholder="请输入客户姓名"
        class="w-80"
      />
    </el-form-item>

    <!-- 客户职位 -->
    <el-form-item label="客户职位" prop="customerPosition">
      <el-input
        v-model="formData.customerPosition"
        placeholder="请输入客户职位"
        class="w-80"
      />
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
      <el-input
        v-model="formData.platformName"
        placeholder="请输入平台名称"
        class="w-80"
      />
    </el-form-item>

    <!-- 客户属性 -->
    <el-form-item label="客户属性" prop="customerAttribute">
      <el-input
        v-model="formData.customerAttribute"
        placeholder="请输入客户属性"
        class="w-80"
      />
    </el-form-item>

    <!-- 客户城市 -->
    <el-form-item label="客户城市" prop="customerCity">
      <el-input
        v-model="formData.customerCity"
        placeholder="请输入客户城市"
        class="w-80"
      />
    </el-form-item>

    <!-- 客户区县 -->
    <el-form-item label="客户区县" prop="customerDistrict">
      <el-input
        v-model="formData.customerDistrict"
        placeholder="请输入客户区县"
        class="w-80"
      />
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
</template>

<script lang="ts" setup>
import { ref, reactive, watch, PropType } from 'vue'
import { ElForm } from 'element-plus'
import { copyValueToTarget } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import type { ErpPrivateBroadcastingInfoRespVO } from '@/api/erp/privateBroadcastingInfo'

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

watch(
  () => props.initialFormData,
  (data) => {
    if (!data) return
    copyValueToTarget(formData, data)
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