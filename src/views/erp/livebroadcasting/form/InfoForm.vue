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

      <!-- 产品图片 -->
      <el-form-item label="产品图片" prop="productImage">
        <UploadImg v-model="formData.productImage" :limit="1" />
      </el-form-item>

      <!-- 品牌名称 -->
      <el-form-item label="品牌名称" prop="brandId">
        <div v-if="isDetail" class="w-240px" style="padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #f5f7fa;">
          <dict-tag v-if="formData.brandId !== undefined && formData.brandId !== null" :type="DICT_TYPE.ERP_PRODUCT_BRAND" :value="formData.brandId" />
          <span v-else style="color: #c0c4cc;">未设置</span>
        </div>
        <el-select
          v-else
          v-model="formData.brandId"
          placeholder="请选择品牌名称"
          class="w-240px"
          filterable
          :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRODUCT_BRAND)"
        >
          <el-option
            v-for="dict in filteredBrandOptions"
            :key="dict.value"
            :label="dict.label"
            :value="Number(dict.value)"
          />
        </el-select>
      </el-form-item>

      <!-- 产品名称 -->
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="formData.productName"
          placeholder="请输入产品名称"
          class="w-240px"
        />
      </el-form-item>

      <!-- 产品规格 -->
      <el-form-item label="产品规格" prop="productSpec">
        <el-input
          v-model="formData.productSpec"
          placeholder="请输入产品规格"
          class="w-240px"
        />
      </el-form-item>

      <!-- 产品SKU -->
      <el-form-item label="产品SKU" prop="productSku">
        <el-input
          v-model="formData.productSku"
          placeholder="请输入产品SKU"
          class="w-240px"
        />
      </el-form-item>

      <!-- 市场价格 -->
      <el-form-item label="市场价格" prop="marketPrice">
        <el-input-number
          v-model="formData.marketPrice"
          :min="0"
          :precision="2"
          placeholder="请输入市场价格"
          class="w-240px"
        />
      </el-form-item>

      <!-- 保质日期 -->
      <el-form-item label="保质日期" prop="shelfLife">
        <el-date-picker
          v-model="formData.shelfLife"
          type="date"
          placeholder="请选择保质日期"
          class="w-240px"
          value-format="x"
        />
      </el-form-item>

      <!-- 产品库存 -->
      <el-form-item label="产品库存" prop="productStock">
        <el-input-number
          v-model="formData.productStock"
          :min="0"
          placeholder="请输入产品库存"
          class="w-240px"
        />
      </el-form-item>

      <!-- 货盘状态 -->
      <el-form-item label="货盘状态" prop="liveStatus">
        <div v-if="isDetail" class="w-240px" style="padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #f5f7fa;">
          <dict-tag v-if="formData.liveStatus !== undefined && formData.liveStatus !== null" :type="DICT_TYPE.ERP_LIVE_STATUS" :value="formData.liveStatus" />
          <span v-else style="color: #c0c4cc;">未设置</span>
        </div>
        <el-select
          v-else
          v-model="formData.liveStatus"
          placeholder="请选择货盘状态"
          class="w-240px"
          filterable
          :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_LIVE_STATUS)"
        >
          <el-option
            v-for="dict in filteredLiveStatusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="Number(dict.value)"
          />
        </el-select>
      </el-form-item>

      <!-- 核心卖点 -->
      <el-form-item label="核心卖点" prop="coreSellingPoint">
        <el-input
          v-model="formData.coreSellingPoint"
          type="textarea"
          placeholder="请输入核心卖点"
          class="w-240px"
          :autosize="{ minRows: 2, maxRows: 4 }"
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
  import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
  import type { LiveBroadcastingVO } from '@/api/erp/livebroadcasting'

  defineOptions({ name: 'ErpLiveBroadcastingInfoForm' })

  const props = defineProps({
    propFormData: {
      type: Object as PropType<LiveBroadcastingVO>,
      default: () => {}
    },
    isDetail: propTypes.bool.def(false)
  })

  const message = useMessage()
  const formRef = ref()
  const formData = reactive<LiveBroadcastingVO>({
    no: '',
    productImage: '',
    brandName: '',
    brandId: undefined,
    productName: '',
    productSpec: '',
    productSku: '',
    marketPrice: 0,
    shelfLife: '',
    productStock: 0,
    liveStatus: undefined,
    coreSellingPoint: '',
    remark: ''
  })

  // 字典选项
  const filteredBrandOptions = ref<any[]>([])
  const filteredLiveStatusOptions = ref<any[]>([])

  const rules = reactive({
    no: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
    productName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
    brandId: [{ required: true, message: '品牌名称不能为空', trigger: 'change' }],
    marketPrice: [{ required: true, message: '市场价格不能为空', trigger: 'blur' }],
    productStock: [{ required: true, message: '产品库存不能为空', trigger: 'blur' }],
    liveStatus: [{ required: true, message: '货盘状态不能为空', trigger: 'change' }]
  })

  // 初始化字典选项
  onMounted(() => {
    filteredBrandOptions.value = getStrDictOptions(DICT_TYPE.ERP_PRODUCT_BRAND)
    filteredLiveStatusOptions.value = getStrDictOptions(DICT_TYPE.ERP_LIVE_STATUS)
  })

  // 字典选项过滤方法
  const filterDictOptions = (value, dictType) => {
    const allOptions = getStrDictOptions(dictType)  
    if (!value) {
      if (dictType === DICT_TYPE.ERP_PRODUCT_BRAND) {
        filteredBrandOptions.value = allOptions
      } else if (dictType === DICT_TYPE.ERP_LIVE_STATUS) {
        filteredLiveStatusOptions.value = allOptions
      }
      return
    }
    const filtered = allOptions.filter(item =>
      item.label.toLowerCase().includes(value.toLowerCase())
    )
    if (dictType === DICT_TYPE.ERP_PRODUCT_BRAND) {
      filteredBrandOptions.value = filtered
    } else if (dictType === DICT_TYPE.ERP_LIVE_STATUS) {
      filteredLiveStatusOptions.value = filtered
    }
  }

  /** 将传进来的值赋值给 formData */
  watch(
    () => props.propFormData,
    (data) => {
      if (!data) return
      copyValueToTarget(formData, data)
      // 确保数值类型字段正确转换
      if (data.brandId !== undefined && data.brandId !== null) {
        formData.brandId = Number(data.brandId)
      }
      if (data.liveStatus !== undefined && data.liveStatus !== null) {
        formData.liveStatus = Number(data.liveStatus)
      }
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
