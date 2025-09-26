<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <!-- 客户名称 -->
      <el-form-item label="客户名称" prop="customerName">
        <div v-if="isDetail" class="w-80" style="padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #f5f7fa;">
          <dict-tag v-if="formData.customerName" :type="DICT_TYPE.ERP_LIVE_CUSTOMER_NAME" :value="formData.customerName" />
          <span v-else style="color: #c0c4cc;">未设置</span>
        </div>
        <el-select
          v-else
          v-model="formData.customerName"
          placeholder="请选择客户名称"
          class="w-80"
          filterable
          :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_LIVE_CUSTOMER_NAME)"
        >
          <el-option
            v-for="dict in filteredCustomerNameOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <!-- 直播平台 -->
      <el-form-item label="直播平台" prop="livePlatform">
        <el-select
          v-model="formData.livePlatform"
          placeholder="请选择直播平台"
          class="w-80"
          filterable
          :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_LIVE_PLATFORM)"
        >
          <el-option
            v-for="dict in filteredPlatformOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <!-- 直播佣金 -->
      <el-form-item label="直播佣金" prop="liveCommission">
        <div style="display: flex; align-items: center;">
          <el-input-number
            v-model="formData.liveCommission"
            :min="0"
            placeholder="请输入直播佣金"
            class="w-80!"
          />
          <span style="margin-left: 25px;">%</span>
        </div>
      </el-form-item>

      <!-- 公开佣金 -->
      <el-form-item label="公开佣金" prop="publicCommission">
        <div style="display: flex; align-items: center;">
          <el-input-number
            v-model="formData.publicCommission"
            :min="0"
            placeholder="请输入公开佣金"
            class="w-80!"
          />
          <span style="margin-left: 25px;">%</span>
        </div>
      </el-form-item>

      <!-- 服务佣金 -->
      <el-form-item label="服务佣金" prop="rebateCommission">
        <div style="display: flex; align-items: center;">
          <el-input-number
            v-model="formData.rebateCommission"
            :min="0"
            placeholder="请输入服务佣金"
            class="w-80!"
          />
          <span style="margin-left: 25px;">%</span>
        </div>
      </el-form-item>
    </el-form>


  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
  import type { LiveBroadcastingReviewVO } from '@/api/erp/livebroadcastingreview'


  defineOptions({ name: 'ErpLiveBroadcastingReviewPriceForm' })

  const props = defineProps({
    propFormData: {
      type: Object as PropType<LiveBroadcastingReviewVO>,
      default: () => {}
    },
    isDetail: propTypes.bool.def(false)
  })

  const message = useMessage()
  const formRef = ref()
  const formData = reactive({
    customerName: '', // 客户名称
    livePlatform: '',
    liveCommission: 0,
    publicCommission: 0,
    rebateCommission: 0
  })

  // 字典选项
  const filteredPlatformOptions = ref<any[]>([])
  const filteredCustomerNameOptions = ref<any[]>([])

  const rules = reactive({
    customerName: [{ required: true, message: '客户名称不能为空', trigger: 'change' }],
    livePlatform: [{ required: true, message: '直播平台不能为空', trigger: 'blur' }],
    liveCommission: [{ required: true, message: '直播佣金不能为空', trigger: 'blur' },
      { type: 'number', min: 0.01, message: '直播佣金必须大于0', trigger: 'blur' }],
    publicCommission: [{ required: true, message: '公开佣金不能为空', trigger: 'blur' },
      { type: 'number', min: 0.01, message: '公开佣金必须大于0', trigger: 'blur' }],
    //rebateCommission: [{ required: true, message: '服务佣金不能为空', trigger: 'blur' }]
  })

  // 初始化字典选项
  onMounted(() => {
    filteredPlatformOptions.value = getStrDictOptions(DICT_TYPE.ERP_LIVE_PLATFORM)
    filteredCustomerNameOptions.value = getStrDictOptions(DICT_TYPE.ERP_LIVE_CUSTOMER_NAME)
  })

  // 字典选项过滤方法
  const filterDictOptions = (value, dictType) => {
    const allOptions = getStrDictOptions(dictType)
    if (!value) {
      if (dictType === DICT_TYPE.ERP_LIVE_PLATFORM) {
        filteredPlatformOptions.value = allOptions
      } else if (dictType === DICT_TYPE.ERP_LIVE_CUSTOMER_NAME) {
        filteredCustomerNameOptions.value = allOptions
      }
      return
    }
    const filtered = allOptions.filter(item =>
      item.label.toLowerCase().includes(value.toLowerCase())
    )
    if (dictType === DICT_TYPE.ERP_LIVE_PLATFORM) {
      filteredPlatformOptions.value = filtered
    } else if (dictType === DICT_TYPE.ERP_LIVE_CUSTOMER_NAME) {
      filteredCustomerNameOptions.value = filtered
    }
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
      message.error('【价格机制】不完善，请填写相关信息')
      emit('update:activeName', 'price')
      throw e
    }
  }

  defineExpose({ validate })
  </script>
