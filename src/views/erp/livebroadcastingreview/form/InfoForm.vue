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
      <el-form-item label="品牌名称" prop="brandId">
        <div class="w-80" style="padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #f5f7fa;">
          <dict-tag v-if="formData.brandId !== undefined && formData.brandId !== null" :type="DICT_TYPE.ERP_PRODUCT_BRAND" :value="formData.brandId" />
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
        />
      </el-form-item>

      <!-- 货盘状态 -->
      <el-form-item label="货盘状态" prop="liveStatus">
        <div class="w-80" style="padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #f5f7fa;">
          <dict-tag v-if="formData.liveStatus !== undefined && formData.liveStatus !== null" :type="DICT_TYPE.ERP_LIVE_STATUS" :value="formData.liveStatus" />
          <span v-else style="color: #c0c4cc;">自动填充</span>
        </div>
      </el-form-item>

      <!-- 直播价格 -->
      <el-form-item label="直播价格" prop="livePrice">
        <div class="w-80" style="padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #f5f7fa;">
          <span v-if="formData.livePrice && formData.livePrice > 0">{{ formData.livePrice }}元</span>
          <span v-else style="color: #c0c4cc;">自动填充</span>
        </div>
      </el-form-item>

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
  import { DICT_TYPE } from '@/utils/dict'
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
    brandId: undefined as number | undefined, // 品牌ID（用于字典显示）
    brandName: '', // 品牌名称
    productSpec: '',
    productSku: '',
    liveStatus: undefined, // 货盘状态（使用liveStatus）
    remark: '',
    livePrice: 0
  })

  const rules = reactive({
    liveBroadcastingNo: [{ required: true, message: '请选择直播货盘', trigger: 'blur' }]
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
    formData.brandId = liveBroadcasting.brandId // 使用brandId用于字典显示
    formData.brandName = liveBroadcasting.brandName || '' // 保留brandName
    formData.productSpec = liveBroadcasting.productSpec || ''
    formData.productSku = liveBroadcasting.productSku || ''
    formData.liveStatus = liveBroadcasting.liveStatus // 使用liveStatus
    // 自动填充直播价格（不可变更）
    formData.livePrice = liveBroadcasting.livePrice || 0
    console.log("Updated form data:", { brandId: formData.brandId, liveStatus: formData.liveStatus, livePrice: formData.livePrice })
  }

  defineExpose({ validate })
  </script>
