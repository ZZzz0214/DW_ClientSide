<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="140px"
    >
      <!-- 私播货盘编号 -->
      <el-form-item label="私播货盘编号" prop="privateBroadcastingNo">
        <el-input
          v-model="formData.privateBroadcastingNo"
          placeholder="请选择私播货盘表"
          class="w-80"
          :disabled="isDetail"
          @click="openPrivateBroadcastingSearch"
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
          type="textarea" :autosize="{ minRows: 1, maxRows: 6}"
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
        <el-input
          v-model="formData.customerName"
          placeholder="请选择客户"
          class="w-80"
          readonly
          :disabled="isDetail"
          @click="openCustomerSearch"
        />
      </el-form-item>

      <!-- 直播价格 -->
      <el-form-item label="直播价格" prop="livePrice">
        <el-input
          v-model="formData.livePrice"
          placeholder="从私播货盘表获取，可修改"
          :disabled="isDetail"
          class="w-80"
        >
          <template #suffix>
            <span style="color: #909399;">元</span>
          </template>
        </el-input>
      </el-form-item>

      <!-- 产品裸价 -->
      <el-form-item label="产品裸价" prop="productNakedPrice">
        <el-input
          v-model="formData.productNakedPrice"
          placeholder="请输入产品裸价"
          class="w-80"
          :disabled="isDetail"
        >
          <template #suffix>
            <span style="color: #909399;">元</span>
          </template>
        </el-input>
      </el-form-item>

      <!-- 快递费用 -->
      <el-form-item label="快递费用" prop="expressFee">
        <el-input
          v-model="formData.expressFee"
          placeholder="请输入快递费用"
          class="w-80"
          :disabled="isDetail"
        >
          <template #suffix>
            <span style="color: #909399;">元</span>
          </template>
        </el-input>
      </el-form-item>

      <!-- 代发价格 -->
      <el-form-item label="代发价格" prop="dropshipPrice">
        <el-input
          v-model="formData.dropshipPrice"
          placeholder="请输入代发价格"
          class="w-80"
          :disabled="isDetail"
        >
          <template #suffix>
            <span style="color: #909399;">元</span>
          </template>
        </el-input>
      </el-form-item>

      <!-- 货盘状态 -->
      <el-form-item label="货盘状态" prop="privateStatus">
        <div class="w-80" style="padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #f5f7fa;">
          <dict-tag v-if="formData.privateStatus" :type="DICT_TYPE.ERP_PRIVATE_STATUS" :value="formData.privateStatus" />
          <span v-else style="color: #c0c4cc;">自动填充</span>
        </div>
      </el-form-item>

      <!-- 复盘状态 -->
      <el-form-item label="复盘状态" prop="reviewStatus">
        <el-select
          v-model="formData.reviewStatus"
          placeholder="请选择复盘状态"
          clearable
          class="w-80"
          :disabled="isDetail"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.ERP_PRIVATE_BROADCASTING_REVIEW_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 私播货盘表选择弹窗 -->
    <PrivateBroadcastingSearchDialog
      v-model:visible="privateBroadcastingSearchDialogVisible"
      @private-broadcasting-selected="handlePrivateBroadcastingSelected"
    />
    
    <!-- 客户搜索弹窗 -->
    <CustomerSearchDialog
      v-model:visible="customerSearchDialogVisible"
      @customer-selected="handleCustomerSelected"
    />
  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
  import PrivateBroadcastingSearchDialog from './PrivateBroadcastingSearchDialog.vue'
  import CustomerSearchDialog from "@/views/erp/sale/saleprice/components/CustomerSearchDialog.vue"

  defineOptions({ name: 'ErpPrivateBroadcastingReviewInfoForm' })

  const props = defineProps({
    propFormData: {
      type: Object as PropType<any>,
      default: () => {}
    },
    isDetail: propTypes.bool.def(false)
  })

  const message = useMessage()
  const formRef = ref()
  const formData = reactive({
    privateBroadcastingId: undefined,
    privateBroadcastingNo: '',
    brandName: '',
    productName: '',
    productSpec: '',
    productSku: '',
    remark: '',
    customerId: undefined,
    customerName: '',
    livePrice: '',
    productNakedPrice: '',
    expressFee: '',
    dropshipPrice: '',
    privateStatus: '',
    reviewStatus: undefined // 复盘状态
  })

  const rules = reactive({
    privateBroadcastingNo: [{ required: true, message: '私播货盘表编号不能为空', trigger: 'blur' }],
    customerName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
    productNakedPrice: [
      { 
        validator: (rule, value, callback) => {
          if (!value || value === '') {
            callback()
            return
          }
          if (!/^\d+(\.\d{1,2})?$/.test(value)) {
            callback(new Error('请输入有效的价格格式（最多两位小数）'))
            return
          }
          callback()
        },
        trigger: 'blur'
      }
    ],
    expressFee: [
      { 
        validator: (rule, value, callback) => {
          if (!value || value === '') {
            callback()
            return
          }
          if (!/^\d+(\.\d{1,2})?$/.test(value)) {
            callback(new Error('请输入有效的价格格式（最多两位小数）'))
            return
          }
          callback()
        },
        trigger: 'blur'
      }
    ],
    dropshipPrice: [
      { 
        validator: (rule, value, callback) => {
          if (!value || value === '') {
            callback()
            return
          }
          if (!/^\d+(\.\d{1,2})?$/.test(value)) {
            callback(new Error('请输入有效的价格格式（最多两位小数）'))
            return
          }
          callback()
        },
        trigger: 'blur'
      }
    ],
    livePrice: [
      { 
        validator: (rule, value, callback) => {
          if (!value || value === '') {
            callback()
            return
          }
          if (!/^\d+(\.\d{1,2})?$/.test(value)) {
            callback(new Error('请输入有效的价格格式（最多两位小数）'))
            return
          }
          callback()
        },
        trigger: 'blur'
      }
    ]
  })

  // 内部更新标记，避免循环更新
  const isInternalUpdate = ref(false)

  watch(
    () => props.propFormData,
    (data) => {
      if (!data || isInternalUpdate.value) return

      isInternalUpdate.value = true
      copyValueToTarget(formData, data)

      nextTick(() => {
        isInternalUpdate.value = false
      })
    },
    { immediate: true }
  )

  // 监听formData变化，实时同步到父组件
  watch(
    formData,
    (newData) => {
      if (!isInternalUpdate.value) {
        Object.assign(props.propFormData, newData)
      }
    },
    { deep: true }
  )

  // 私播货盘表搜索弹窗
  const privateBroadcastingSearchDialogVisible = ref(false)
  
  // 客户搜索弹窗
  const customerSearchDialogVisible = ref(false)

  const openPrivateBroadcastingSearch = () => {
    if (!props.isDetail) {
      privateBroadcastingSearchDialogVisible.value = true
    }
  }
  
  const openCustomerSearch = () => {
    if (!props.isDetail) {
      customerSearchDialogVisible.value = true
    }
  }
  
  const handleCustomerSelected = (customer: any) => {
    formData.customerId = customer.id
    formData.customerName = customer.name
    
    // 同时更新父组件的 propFormData
    Object.assign(props.propFormData, {
      customerId: customer.id,
      customerName: customer.name
    })
  }

  const handlePrivateBroadcastingSelected = (privateBroadcasting: any) => {
    console.log("选中的私播货盘表数据:", privateBroadcasting)
    console.log("brandName值:", privateBroadcasting.brandName, "类型:", typeof privateBroadcasting.brandName)
    console.log("brandId值:", privateBroadcasting.brandId, "类型:", typeof privateBroadcasting.brandId)

    // 从私播货盘数据中提取品牌名称
    // 如果后端返回的是brandName，直接使用；如果是brandId，需要转换
    let brandNameValue = ''
    if (privateBroadcasting.brandName) {
      brandNameValue = privateBroadcasting.brandName
    } else if (privateBroadcasting.brandId) {
      // 如果只有brandId，从字典中查找对应的label作为brandName
      const brandOptions = getStrDictOptions(DICT_TYPE.ERP_PRODUCT_BRAND)
      const brandOption = brandOptions.find(option => option.value === String(privateBroadcasting.brandId))
      brandNameValue = brandOption ? brandOption.value : String(privateBroadcasting.brandId)
    }

    // 先更新本地 formData
    formData.privateBroadcastingId = privateBroadcasting.id
    formData.privateBroadcastingNo = privateBroadcasting.no
    formData.brandName = brandNameValue
    formData.productName = privateBroadcasting.productName
    formData.productSpec = privateBroadcasting.productSpec
    formData.productSku = privateBroadcasting.productSku
    formData.livePrice = privateBroadcasting.livePrice
    formData.productNakedPrice = privateBroadcasting.productNakedPrice
    formData.expressFee = privateBroadcasting.expressFee
    formData.dropshipPrice = privateBroadcasting.dropshipPrice
    formData.privateStatus = privateBroadcasting.privateStatus

    // 同时更新父组件的 propFormData，避免被 watch 覆盖
    Object.assign(props.propFormData, {
      privateBroadcastingId: privateBroadcasting.id,
      privateBroadcastingNo: privateBroadcasting.no,
      brandName: brandNameValue,
      productName: privateBroadcasting.productName,
      productSpec: privateBroadcasting.productSpec,
      productSku: privateBroadcasting.productSku,
      livePrice: privateBroadcasting.livePrice,
      productNakedPrice: privateBroadcasting.productNakedPrice,
      expressFee: privateBroadcasting.expressFee,
      dropshipPrice: privateBroadcasting.dropshipPrice,
      privateStatus: privateBroadcasting.privateStatus
    })

    console.log("赋值后的formData.brandName:", formData.brandName)
    console.log("赋值后的props.propFormData.brandName:", props.propFormData.brandName)
  }

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
