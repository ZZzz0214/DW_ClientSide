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
        <div class="image-upload-container">
          <UploadImgs
            v-model="formData.productImage"
            :disabled="isDetail"
            :limit="5"
            :is-show-tip="false"
          />
          <div class="upload-tip">
            <Icon icon="ep:info-filled" class="tip-icon" />
            最多可上传5张图片，列表显示第一张
          </div>
        </div>
      </el-form-item>

      <!-- 品牌名称 -->
      <el-form-item label="品牌名称" prop="brandName">
        <div v-if="isDetail" class="w-240px" style="padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #f5f7fa;">
          <dict-tag v-if="formData.brandName" :type="DICT_TYPE.ERP_PRODUCT_BRAND" :value="formData.brandName" />
          <span v-else style="color: #c0c4cc;">未设置</span>
        </div>
        <el-select
          v-else
          v-model="formData.brandName"
          placeholder="请选择品牌名称"
          class="w-240px"
          filterable
          :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRODUCT_BRAND)"
        >
          <el-option
            v-for="dict in filteredBrandOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <!-- 产品分类 -->
      <el-form-item label="产品分类" prop="categoryId">
        <div v-if="isDetail" class="w-240px" style="padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #f5f7fa;">
          <dict-tag v-if="formData.categoryId" :type="DICT_TYPE.ERP_PRODUCT_CATEGORY" :value="formData.categoryId" />
          <span v-else style="color: #c0c4cc;">未设置</span>
        </div>
        <el-select
          v-else
          v-model="formData.categoryId"
          placeholder="请选择产品分类"
          clearable
          filterable
          class="w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.ERP_PRODUCT_CATEGORY)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
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
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 6}"
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
          <template v-if="formData.liveStatusList && formData.liveStatusList.length > 0">
            <dict-tag
              v-for="status in formData.liveStatusList"
              :key="status"
              :type="DICT_TYPE.ERP_LIVE_STATUS"
              :value="status"
              style="margin-right: 4px;"
            />
          </template>
          <span v-else style="color: #c0c4cc;">未设置</span>
        </div>
        <el-select
          v-else
          v-model="formData.liveStatusList"
          placeholder="请选择货盘状态（可多选）"
          class="w-240px"
          multiple
          filterable
          :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_LIVE_STATUS)"
        >
          <el-option
            v-for="dict in filteredLiveStatusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
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

      <!-- 备注信息 -->
      <el-form-item label="备注信息" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          placeholder="请输入备注信息"
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
  import { getStrDictOptions, getIntDictOptions, DICT_TYPE } from '@/utils/dict'
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
    categoryId: undefined, // 产品分类编号
    productName: '',
    productSpec: '',
    productSku: '',
    marketPrice: 0,
    shelfLife: '',
    productStock: 0,
    liveStatus: undefined, // 货盘状态（逗号分隔字符串）
    liveStatusList: [], // 货盘状态数组（用于多选组件）
    coreSellingPoint: '',
    remark: ''
  })

  // 字典选项
  const filteredBrandOptions = ref<any[]>([])
  const filteredLiveStatusOptions = ref<any[]>([])

  const rules = reactive({
    no: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
    productName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
    productSku: [{ required: true, message: '产品SKU不能为空', trigger: 'change' }],
    //marketPrice: [{ required: true, message: '市场价格不能为空', trigger: 'blur' }],
    //productStock: [{ required: true, message: '产品库存不能为空', trigger: 'blur' }],
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

      // 处理产品图片：将逗号分隔的字符串转换为数组
      if (data.productImage && typeof data.productImage === 'string') {
        formData.productImage = data.productImage.split(',').filter(img => img.trim())
      } else if (Array.isArray(data.productImage)) {
        formData.productImage = [...data.productImage]
      }

      // 处理货盘状态：将逗号分隔的字符串转换为数组
      if (data.liveStatus && typeof data.liveStatus === 'string') {
        formData.liveStatusList = data.liveStatus.split(',').filter(s => s.trim())
        formData.liveStatus = data.liveStatus
      } else if (Array.isArray(data.liveStatus)) {
        formData.liveStatusList = [...data.liveStatus]
        formData.liveStatus = data.liveStatus.join(',')
      } else {
        formData.liveStatusList = []
        formData.liveStatus = undefined
      }

      // 如果是复制操作，清除不应该复制的字段
      if (data.id === undefined && data.no === '') {
        formData.id = undefined
        formData.no = ''
      }
    },
    { immediate: true }
  )

  /** 表单校验 */
  const emit = defineEmits(['update:activeName', 'update:formData'])
  const validate = async () => {
    if (!formRef) return
    try {
      await unref(formRef)?.validate()

      // 通过emit事件将数据传递给父组件，而不是直接修改props
      const updatedData = { ...formData }

      // 确保productImage是数组格式
      if (Array.isArray(formData.productImage)) {
        updatedData.productImage = [...formData.productImage]
      }

      // 将状态数组转换为逗号分隔的字符串
      if (Array.isArray(formData.liveStatusList) && formData.liveStatusList.length > 0) {
        updatedData.liveStatus = formData.liveStatusList.join(',')
        updatedData.liveStatusList = formData.liveStatusList
      } else {
        updatedData.liveStatus = undefined
        updatedData.liveStatusList = []
      }

      // 通过emit将数据传递给父组件
      emit('update:formData', updatedData)
    } catch (e) {
      message.error('【基础信息】不完善，请填写相关信息')
      emit('update:activeName', 'info')
      throw e
    }
  }

  defineExpose({ validate })
  </script>

<style lang="scss" scoped>
.image-upload-container {
  .upload-tip {
    display: flex;
    align-items: center;
    margin-top: 8px;
    padding: 8px 12px;
    background-color: #f0f9ff;
    border: 1px solid #e1f5fe;
    border-radius: 4px;
    font-size: 12px;
    color: #0288d1;

    .tip-icon {
      margin-right: 4px;
      color: #0288d1;
    }
  }
}
</style>
