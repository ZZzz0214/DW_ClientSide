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
<!--          class="w-80"-->
<!--        />-->
<!--      </el-form-item>-->
<!--  -->
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
      <el-select
        v-model="formData.brandName"
        placeholder="请选择品牌名称"
        class="w-80"
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

      <!-- 产品名称 -->
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="formData.productName"
          placeholder="请输入产品名称"
          class="w-80"
        />
      </el-form-item>

      <!-- 产品规格 -->
      <el-form-item label="产品规格" prop="productSpec">
        <el-input
          v-model="formData.productSpec"
          placeholder="请输入产品规格"
          class="w-80"
        />
      </el-form-item>

      <!-- 产品SKU -->
      <el-form-item label="产品SKU" prop="productSku">
        <el-input
          v-model="formData.productSku"
          placeholder="请输入产品SKU"
          class="w-80"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
        />
      </el-form-item>

      <!-- 市场价格 -->
      <el-form-item label="市场价格" prop="marketPrice">
        <div style="display: flex; align-items: center;">
        <el-input-number
          v-model="formData.marketPrice"
          :min="0"
          :precision="2"
          placeholder="请输入市场价格"
          class="w-80!"
        />
          <span style="margin-left: 25px;">元</span>
        </div>
      </el-form-item>

      <!-- 保质日期 -->
      <el-form-item label="保质日期" prop="shelfLife">
        <el-date-picker
          v-model="formData.shelfLife"
          type="date"
          placeholder="请选择保质日期"
          class="w-80!"
          value-format="x"
        />
      </el-form-item>

      <!-- 产品库存 -->
      <el-form-item label="产品库存" prop="productStock">
        <el-input-number
          v-model="formData.productStock"
          :min="0"
          placeholder="请输入产品库存"
          class="w-80!"
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

      <!-- 货盘状态 -->
      <el-form-item label="货盘状态" prop="status">
        <el-select
          v-model="formData.status"
          placeholder="请选择货盘状态"
          class="w-80"
          filterable
          :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRODUCT_STATUS)"
        >
          <el-option
            v-for="dict in filteredStatusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import type { GroupBuyingVO } from '@/api/erp/groupbuying'
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import UploadImgs from '@/components/UploadFile/src/UploadImgs.vue'
  defineOptions({ name: 'ErpGroupBuyingInfoForm' })

  const props = defineProps({
    propFormData: {
      type: Object as PropType<GroupBuyingVO>,
      default: () => {}
    },
    isDetail: propTypes.bool.def(false)
  })

  const message = useMessage()
  const formRef = ref()
  const formData = reactive({
    no: '',
    productImage: [],
    brandName: '',
    productName: '',
    productSpec: '',
    productSku: '',
    marketPrice: 0,
    shelfLife: undefined,
    productStock: 0,
    remark: '',
    brand: '', // 品牌名称
    status: undefined, // 货盘状态
  })

  const rules = reactive({
    image: [{ required: true, message: '产品图片不能为空', trigger: 'blur' }],
    productSku: [{ required: true, message: '产品sku不能为空', trigger: 'blur' }],
     productName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
    shelfLife: [{ required: true, message: '保质日期不能为空', trigger: 'blur' }],
    status: [{ required: true, message: '货盘状态不能为空', trigger: 'change' }],
    // productStock: [{ required: true, message: '产品库存不能为空', trigger: 'blur' }]
  })

  /** 将传进来的值赋值给 formData */
  watch(
    () => props.propFormData,
    (data) => {
      if (!data) return
      
      // 复制数据
      copyValueToTarget(formData, data)
      
      // 处理产品图片：如果是字符串，转换为数组
      if (data.productImage && typeof data.productImage === 'string') {
        formData.productImage = data.productImage.split(',').filter(img => img.trim())
      } else if (Array.isArray(data.productImage)) {
        formData.productImage = [...data.productImage]
      } else {
        formData.productImage = []
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
      
      // 通过emit将数据传递给父组件
      emit('update:formData', updatedData)
    } catch (e) {
      message.error('【基础信息】不完善，请填写相关信息')
      emit('update:activeName', 'info')
      throw e
    }
  }

  /** 处理图片上传 */
  const handleImageChange = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.productImage = e.target?.result as string
    }
    reader.readAsDataURL(file.raw)
  }

const filteredBrandOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRODUCT_BRAND))
const filteredCategoryOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRODUCT_CATEGORY))
const filteredStatusOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRODUCT_STATUS))

const filterDictOptions = (value, dictType) => {
  const allOptions = getStrDictOptions(dictType)
  if (!value) {
    if (dictType === DICT_TYPE.ERP_PRODUCT_BRAND) {
      filteredBrandOptions.value = allOptions
    } else if (dictType === DICT_TYPE.ERP_PRODUCT_CATEGORY) {
      filteredCategoryOptions.value = allOptions
    } else if (dictType === DICT_TYPE.ERP_PRODUCT_STATUS) {
      filteredStatusOptions.value = allOptions
    }
    return
  }
  const filtered = allOptions.filter(item =>
    item.label.toLowerCase().includes(value.toLowerCase())
  )
  if (dictType === DICT_TYPE.ERP_PRODUCT_BRAND) {
    filteredBrandOptions.value = filtered
  } else if (dictType === DICT_TYPE.ERP_PRODUCT_CATEGORY) {
    filteredCategoryOptions.value = filtered
  } else if (dictType === DICT_TYPE.ERP_PRODUCT_STATUS) {
    filteredStatusOptions.value = filtered
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
    border: 1px solid #bae6fd;
    border-radius: 6px;
    font-size: 12px;
    color: #0369a1;

    .tip-icon {
      margin-right: 6px;
      color: #0ea5e9;
    }
  }
}
</style>
