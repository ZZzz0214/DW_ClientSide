<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="货盘编号" prop="liveBroadcastingNo">
        <el-input
          v-model="formData.liveBroadcastingNo"
          placeholder="请选择直播货盘"
          class="w-80"
          @click="openLiveBroadcastingSearch"
          readonly
        />
      </el-form-item>

      <!-- 品牌名称 -->
      <el-form-item label="品牌名称" prop="brandName">
        <div class="w-80" style="padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #f5f7fa;">
          <dict-tag v-if="formData.brandName" :type="DICT_TYPE.ERP_PRODUCT_BRAND" :value="formData.brandName" />
          <span v-else style="color: #c0c4cc;">自动填充</span>
        </div>
      </el-form-item>

      <!-- 产品名称 -->
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="formData.productName"
          placeholder="自动填充"
          readonly
          class="w-80"
        />
      </el-form-item>

      <!-- 产品规格 -->
      <el-form-item label="产品规格" prop="productSpec">
        <el-input
          v-model="formData.productSpec"
          placeholder="自动填充"
          readonly
          class="w-80"
        />
      </el-form-item>

      <!-- 产品SKU -->
      <el-form-item label="产品SKU" prop="productSku">
        <el-input
          v-model="formData.productSku"
          placeholder="自动填充"
          readonly
          class="w-80"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 6}"
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
          :disabled="isDetail"
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

      <!-- 直播价格 -->
      <el-form-item label="直播价格" prop="livePrice">
        <div class="price-input-container" style="width: 50vw; min-width: 400px;">
          <el-input
            v-model="formData.livePrice"
            placeholder="请输入直播价格"
            class="price-input"
            :class="{ 'detail-mode': isDetail }"
            :disabled="isDetail"
            style="width: 100% !important;"
          >
            <template #append>
              <span class="unit-text">元</span>
            </template>
          </el-input>
        </div>
      </el-form-item>

      <!-- 直播佣金 -->
      <el-form-item label="直播佣金" prop="liveCommission">
        <div style="display: flex; align-items: center;">
          <el-input
            v-model="formData.liveCommission"
            placeholder="请输入直播佣金"
            class="w-80"
            :disabled="isDetail"
          />
          <span style="margin-left: 8px; color: #909399;">%</span>
        </div>
      </el-form-item>

      <!-- 公开佣金 -->
      <el-form-item label="公开佣金" prop="publicCommission">
        <div style="display: flex; align-items: center;">
          <el-input
            v-model="formData.publicCommission"
            placeholder="请输入公开佣金"
            class="w-80"
            :disabled="isDetail"
          />
          <span style="margin-left: 8px; color: #909399;">%</span>
        </div>
      </el-form-item>

      <!-- 服务佣金 -->
      <el-form-item label="服务佣金" prop="rebateCommission">
        <div style="display: flex; align-items: center;">
          <el-input
            v-model="formData.rebateCommission"
            placeholder="请输入服务佣金"
            class="w-80"
            :disabled="isDetail"
          />
          <span style="margin-left: 8px; color: #909399;">%</span>
        </div>
      </el-form-item>

      <!-- 货盘状态 -->
      <el-form-item label="货盘状态" prop="liveStatus">
        <div class="w-80" style="padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #f5f7fa;">
          <dict-tag v-if="formData.liveStatus !== undefined && formData.liveStatus !== null" :type="DICT_TYPE.ERP_LIVE_STATUS" :value="formData.liveStatus" />
          <span v-else style="color: #c0c4cc;">自动填充</span>
        </div>
      </el-form-item>

      <!-- 复盘状态 -->
      <el-form-item label="复盘状态" prop="reviewStatus">
        <el-select
          v-model="formData.reviewStatus"
          placeholder="请选择复盘状态"
          class="w-80"
          :disabled="isDetail"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.ERP_LIVE_BROADCASTING_REVIEW_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

    </el-form>

    <!-- 直播货盘搜索弹窗 -->
    <LiveBroadcastingSearchDialog
      v-model:visible="liveBroadcastingSearchDialogVisible"
      @livebroadcasting-selected="handleLiveBroadcastingSelected"
      ref="liveBroadcastingSearchDialog"
    />
  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
  import type { LiveBroadcastingReviewVO } from '@/api/erp/livebroadcastingreview'
  import LiveBroadcastingSearchDialog from "./LiveBroadcastingSearchDialog.vue"

  defineOptions({ name: 'ErpLiveBroadcastingReviewInfoForm' })
  const message = useMessage()
  const props = defineProps({
    propFormData: {
      type: Object as PropType<LiveBroadcastingReviewVO>,
      default: () => {}
    },
    isDetail: propTypes.bool.def(false)
  })

  const emit = defineEmits(['update:activeName'])
  const formRef = ref()
  const formData = reactive({
    liveBroadcastingId: undefined as number | undefined,
    liveBroadcastingNo: '', // 货盘编号（用于显示）
    productName: '',
    brandName: '', // 品牌名称
    productSpec: '',
    productSku: '',
    remark: '',
    customerName: '', // 客户名称
    livePrice: '',
    livePlatform: '', // 直播平台
    liveCommission: '', // 直播佣金
    publicCommission: '', // 公开佣金
    rebateCommission: '', // 服务佣金
    liveStatus: undefined, // 货盘状态（使用liveStatus）
    reviewStatus: undefined // 复盘状态
  })



  const rules = reactive({
    liveBroadcastingNo: [{ required: true, message: '请选择直播货盘', trigger: 'blur' }],
    customerName: [{ required: true, message: '客户名称不能为空', trigger: 'change' }],
    livePlatform: [{ required: true, message: '直播平台不能为空', trigger: 'blur' }],
    reviewStatus: [{ required: true, message: '复盘状态不能为空', trigger: 'change' }],
    liveCommission: [
      { 
        validator: (rule, value, callback) => {
          if (!value || value === '') {
            callback()
            return
          }
          if (!/^\d+(\.\d{1,2})?$/.test(value)) {
            callback(new Error('请输入有效的佣金格式（最多两位小数）'))
            return
          }
          callback()
        },
        trigger: 'blur'
      }
    ],
    publicCommission: [
      { 
        validator: (rule, value, callback) => {
          if (!value || value === '') {
            callback()
            return
          }
          if (!/^\d+(\.\d{1,2})?$/.test(value)) {
            callback(new Error('请输入有效的佣金格式（最多两位小数）'))
            return
          }
          callback()
        },
        trigger: 'blur'
      }
    ],
    rebateCommission: [
      { 
        validator: (rule, value, callback) => {
          if (!value || value === '') {
            callback()
            return
          }
          if (!/^\d+(\.\d{1,2})?$/.test(value)) {
            callback(new Error('请输入有效的佣金格式（最多两位小数）'))
            return
          }
          callback()
        },
        trigger: 'blur'
      }
    ]
  })





  // 字典选项
  const filteredPlatformOptions = ref<any[]>([])
  const filteredCustomerNameOptions = ref<any[]>([])

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

  // 直播货盘搜索弹窗相关
  const liveBroadcastingSearchDialogVisible = ref(false)
  const liveBroadcastingSearchDialog = ref()

  const openLiveBroadcastingSearch = () => {
    liveBroadcastingSearchDialog.value?.open()
  }

  const handleLiveBroadcastingSelected = (liveBroadcasting: any) => {
    console.log("Selected live broadcasting data:", liveBroadcasting)
    // 填充货盘ID（使用真实的ID传递给后端）
    formData.liveBroadcastingId = liveBroadcasting.id
    // 填充货盘编号（用于显示）
    formData.liveBroadcastingNo = liveBroadcasting.no || ''
    // 自动填充货盘相关信息
    formData.productName = liveBroadcasting.productName || ''
    formData.brandName = liveBroadcasting.brandName || '' // 保留brandName
    formData.productSpec = liveBroadcasting.productSpec || ''
    formData.productSku = liveBroadcasting.productSku || ''
    formData.liveStatus = liveBroadcasting.liveStatus // 使用liveStatus
    // 自动填充直播价格（可修改）
    formData.livePrice = liveBroadcasting.livePrice || ''
    // 自动填充佣金信息（可以更改）
    formData.liveCommission = liveBroadcasting.liveCommission || ''
    formData.publicCommission = liveBroadcasting.publicCommission || ''
    formData.rebateCommission = liveBroadcasting.rebateCommission || ''
    console.log("Updated form data:", { brandName: formData.brandName, liveStatus: formData.liveStatus, livePrice: formData.livePrice, liveCommission: formData.liveCommission })
  }

  defineExpose({ validate })
  </script>

<style lang="scss" scoped>
.price-input-container {
  display: flex;
  align-items: center;
  
  .price-input {
    width: 50vw !important;
    min-width: 400px;
    
    &.detail-mode {
      :deep(.el-input__wrapper) {
        background-color: #f5f7fa;
        border-color: #e4e7ed;
        box-shadow: 0 0 0 1px #e4e7ed inset;
      }
    }
    
    :deep(.el-input-group__append) {
      background-color: #fafafa;
      border-left: 0;
      color: #606266;
      font-weight: 500;
      padding: 0 15px;
      
      .unit-text {
        font-size: 14px;
      }
    }
  }
}</style>
