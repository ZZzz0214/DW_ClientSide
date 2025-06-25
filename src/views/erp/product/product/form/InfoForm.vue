<!-- 商品发布 - 产品基础信息 -->
<template>
  <div class="info-form-container">
    <!-- 标题区域 -->
    <div class="form-header">
      <div class="header-icon">
        <Icon icon="ep:goods" class="text-2xl" />
      </div>
      <div class="header-text">
        <h3 class="header-title">产品基础信息</h3>
        <p class="header-subtitle">请填写产品的基本信息</p>
      </div>
    </div>

    <!-- 表单内容区域 -->
    <div class="form-content">
      <el-form
        ref="formRef"
        v-loading="formLoading"
        :disabled="isDetail"
        :model="formData"
        :rules="rules"
        label-width="120px"
        class="beautiful-form"
      >
        <!-- 产品图片 -->
        <div class="form-section">
          <div class="section-title">
            <Icon icon="ep:picture" class="section-icon" />
            <span>产品展示</span>
          </div>
          <el-form-item label="产品图片" prop="image" class="image-form-item">
            <div class="image-upload-container">
              <UploadImgs
                v-model="formData.image"
                :disabled="isDetail"
                :limit="5"
                :file-size="20"
                :is-show-tip="false"
              />
              <div class="upload-tip">
                <Icon icon="ep:info-filled" class="tip-icon" />
                最多可上传5张图片，列表显示第一张
              </div>
            </div>
          </el-form-item>
        </div>

        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-title">
            <Icon icon="ep:document" class="section-icon" />
            <span>基本信息</span>
          </div>
          <div class="form-grid">
            <!-- 产品名称 -->
            <el-form-item label="产品名称" prop="name" class="grid-item">
              <el-input
                v-model="formData.name"
                placeholder="请输入产品名称"
                class="beautiful-input"
                prefix-icon="ep:goods"
              />
            </el-form-item>

            <!-- 产品简称 -->
            <el-form-item label="产品简称" prop="productShortName" class="grid-item">
              <el-input
                v-model="formData.productShortName"
                placeholder="请输入产品简称"
                class="beautiful-input"
                prefix-icon="ep:edit"
              />
            </el-form-item>

            <!-- 发货编码 -->
            <el-form-item label="发货编码" prop="shippingCode" class="grid-item">
              <el-input
                v-model="formData.shippingCode"
                placeholder="请输入发货编码"
                class="beautiful-input"
                prefix-icon="ep:postcard"
              />
            </el-form-item>

            <!-- 产品规格 -->
            <el-form-item label="产品规格" prop="standard" class="grid-item">
              <el-input
                v-model="formData.standard"
                placeholder="请输入产品规格"
                class="beautiful-input"
                prefix-icon="ep:scale-to-original"
              />
            </el-form-item>
          </div>
        </div>

        <!-- 时间信息 -->
        <div class="form-section">
          <div class="section-title">
            <Icon icon="ep:calendar" class="section-icon" />
            <span>时间信息</span>
          </div>
          <div class="form-grid">
            <!-- 产品日期 -->
            <el-form-item label="产品日期" prop="productionDate" class="grid-item">
              <el-date-picker
                v-model="formData.productionDate"
                type="date"
                value-format="x"
                placeholder="请选择产品日期"
                class="beautiful-date-picker"
                prefix-icon="ep:calendar"
              />
            </el-form-item>

            <!-- 保质日期 -->
            <el-form-item label="保质日期" prop="expiryDay" class="grid-item">
              <div class="input-with-unit">
                <el-input-number
                  v-model="formData.expiryDay"
                  :min="0"
                  placeholder="请输入保质日期数值"
                  class="beautiful-number-input"
                />
                <span class="unit-label">年</span>
              </div>
            </el-form-item>
          </div>
        </div>

        <!-- 分类信息 -->
        <div class="form-section">
          <div class="section-title">
            <Icon icon="ep:collection-tag" class="section-icon" />
            <span>分类信息</span>
          </div>
          <div class="form-grid">
            <!-- 品牌名称 -->
            <el-form-item label="品牌名称" prop="brand" class="grid-item">
              <el-select
                v-model="formData.brand"
                placeholder="请选择品牌名称"
                class="beautiful-select"
                filterable
                :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRODUCT_BRAND)"
                prefix-icon="ep:star"
              >
                <el-option
                  v-for="dict in filteredBrandOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>

            <!-- 产品品类 -->
            <el-form-item label="产品品类" prop="categoryId" class="grid-item">
              <el-select
                v-model="formData.categoryId"
                placeholder="请选择产品品类"
                class="beautiful-select"
                filterable
                :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRODUCT_CATEGORY)"
                prefix-icon="ep:menu"
              >
                <el-option
                  v-for="dict in filteredCategoryOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="Number(dict.value)"
                />
              </el-select>
            </el-form-item>

            <!-- 产品状态 -->
            <el-form-item label="产品状态" prop="status" class="grid-item">
              <el-select
                v-model="formData.status"
                placeholder="请选择产品状态"
                class="beautiful-select"
                filterable
                :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRODUCT_STATUS)"
                prefix-icon="ep:connection"
              >
                <el-option
                  v-for="dict in filteredStatusOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="Number(dict.value)"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>

        <!-- 详细信息 -->
        <div class="form-section">
          <div class="section-title">
            <Icon icon="ep:chat-line-square" class="section-icon" />
            <span>详细信息</span>
          </div>
          <!-- 产品卖点 -->
          <el-form-item label="产品卖点" prop="productSellingPoints">
            <el-input
              v-model="formData.productSellingPoints"
              type="textarea"
              placeholder="请输入产品卖点"
              class="beautiful-textarea"
              :autosize="{ minRows: 3, maxRows: 6 }"
            />
          </el-form-item>

          <!-- 采购人员 -->
          <el-form-item label="采购人员" prop="purchaser">
            <el-input
              v-model="formData.purchaser"
              placeholder="请输入采购人员信息"
              @click="openPurchaserSearch"
              readonly
              class="beautiful-input clickable-input"
              prefix-icon="ep:user"
              suffix-icon="ep:search"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>

    <PurchaserSearchDialog
      v-model:visible="purchaserSearchDialogVisible"
      @purchaser-selected="handlePurchaserSelected"
      ref="purchaserSearchDialog"
    />
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { copyValueToTarget } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import { defaultProps, handleTree } from '@/utils/tree'
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import UploadImgs from '@/components/UploadFile/src/UploadImgs.vue'

import type { ProductVO  } from '@/api/erp/product/product/index'
import * as ProductCategoryApi from '@/api/erp/product/category/index'
import { ProductCategoryVO } from '@/api/erp/product/category/index'
import * as ProductBrandApi from '@/api/erp/product/product/brand'
import { BrandVO } from '@/api/erp/product/product/brand'
import PurchaserSearchDialog from "@/views/erp/product/product/form/PurchaserSearchDialog.vue";

defineOptions({ name: 'ErpProductInfoForm' })
const props = defineProps({
  propFormData: {
    type: Object as PropType<ProductVO>,
    default: () => {}
  },
  isDetail: propTypes.bool.def(false) // 是否作为详情组件
})

const message = useMessage() // 消息弹窗

const formRef = ref() // 表单 Ref
const formData = reactive<ProductVO>({
  id: undefined, // 产品编号
  name: '', // 产品名称
  image: [] as any, // 产品图片（前端使用数组，提交时转为字符串）
  productShortName: '', // 产品简称
  shippingCode: '', // 发货编码
  brand: '', // 品牌名称
  categoryId: null, // 产品品类
  status: 0, // 产品状态
  productSellingPoints: '', // 产品卖点
  standard: '', // 产品规格
  weight: 0, // 产品重量
  productionDate:undefined, // 产品日期
  expiryDay: 0, // 保质日期
  expiryUnit: '', // 保质日期单位，默认值为"天"
  weightUnit: '', // 产品重量单位，默认值为"g",
  purchaser:''
})

const rules = reactive({
  name: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
  image: [{ required: true, message: '产品图片不能为空', trigger: 'blur' }],
  purchaser: [{ required: true, message: '采购人员不能为空', trigger: 'blur' }],
  standard: [{ required: true, message: '产品规格不能为空', trigger: 'blur' }],
  // weight: [{ required: true, message: '产品重量不能为空', trigger: 'blur' }],
  productionDate: [{ required: true, message: '产品日期不能为空', trigger: 'blur' }],
  expiryDay: [{ required: true, message: '保质日期不能为空', trigger: 'blur' }],
  brand: [{ required: true, message: '品牌名称不能为空', trigger: 'blur' }],
  categoryId: [{ required: true, message: '产品品类不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '产品状态不能为空', trigger: 'blur' }],
})
/** 将传进来的值赋值给 formData */
watch(
  () => props.propFormData,
  (data) => {
    if (!data) {
      return
    }
    // 先复制基础数据
    copyValueToTarget(formData, data)
    // 处理图片字符串转数组（用于编辑时回显）
    if (data.image) {
      if (typeof data.image === 'string') {
        formData.image = data.image.split(',').filter(img => img.trim())
      } else if (Array.isArray(data.image)) {
        formData.image = data.image
      }
    } else {
      formData.image = []
    }
    
    // 处理复制数据时的特殊逻辑
    if (data.name && data.name.includes('_副本')) {
      // 如果是复制的数据，确保各字段正确设置
      console.log('检测到复制数据，正在填充表单...')
    }
  },
  {
    immediate: true
  }
)

/** 表单校验 */
const emit = defineEmits(['update:activeName'])
const validate = async () => {
  if (!formRef) return
  try {
    await unref(formRef)?.validate()
    // 处理图片数组转字符串
    const submitData = { ...formData }
    if (Array.isArray(submitData.image)) {
      submitData.image = submitData.image.join(',')
    }
    // 校验通过更新数据
    Object.assign(props.propFormData, submitData)
  } catch (e) {
    message.error('【基础设置】不完善，请填写相关信息')
    emit('update:activeName', 'info')
    throw e // 目的截断之后的校验
  }
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

const purchaserSearchDialogVisible = ref(false); // 采购人员搜索弹窗的显示状态
const openPurchaserSearch = () => {
  purchaserSearchDialogVisible.value = true;
};

const handlePurchaserSelected = (purchaser: any) => {
  formData.purchaser = purchaser.purchaserName; // 填充采购人员名称
};

defineExpose({ validate })

/** 初始化 */
const brandList = ref<BrandVO[]>([]) // 商品品牌列表
const categoryList = ref<ProductCategoryVO[]>([]) // 商品分类树
onMounted(async () => {
  // 获得分类树
  const data = await ProductCategoryApi.ProductCategoryApi.getProductCategoryList({})
  categoryList.value = handleTree(data, 'id')
  // 获取商品品牌列表
  brandList.value = await ProductBrandApi.getSimpleBrandList()
})
</script>

<style scoped lang="scss">
.info-form-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-header {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.header-icon {
  margin-right: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(10px);
}

.header-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.header-subtitle {
  margin: 4px 0 0 0;
  font-size: 14px;
  opacity: 0.9;
}

.form-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.form-section {
  margin-bottom: 32px;
  padding: 20px;
  background: linear-gradient(135deg, #ffeef8 0%, #f0f8ff 100%);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  }
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;

  .section-icon {
    margin-right: 8px;
    color: #667eea;
    font-size: 18px;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.grid-item {
  margin-bottom: 0 !important;
}

.beautiful-form {
  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #2c3e50;
    font-size: 14px;
  }
}

.beautiful-input {
  :deep(.el-input__wrapper) {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e1e8ed;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
      border-color: #667eea;
    }

    &.is-focus {
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      border-color: #667eea;
    }
  }

  :deep(.el-input__inner) {
    font-size: 14px;
  }
}

.clickable-input {
  :deep(.el-input__wrapper) {
    cursor: pointer;
    
    &:hover {
      background: linear-gradient(135deg, #f8f9ff 0%, #e8f0fe 100%);
    }
  }
}

.beautiful-select {
  :deep(.el-select__wrapper) {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e1e8ed;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
      border-color: #667eea;
    }

    &.is-focus {
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      border-color: #667eea;
    }
  }
}

.beautiful-date-picker {
  width: 100%;
  
  :deep(.el-input__wrapper) {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e1e8ed;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
      border-color: #667eea;
    }

    &.is-focus {
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      border-color: #667eea;
    }
  }
}

.beautiful-number-input {
  :deep(.el-input__wrapper) {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e1e8ed;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
      border-color: #667eea;
    }

    &.is-focus {
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      border-color: #667eea;
    }
  }
}

.beautiful-textarea {
  :deep(.el-textarea__inner) {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e1e8ed;
    transition: all 0.3s ease;
    font-family: inherit;
    resize: vertical;

    &:hover {
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
      border-color: #667eea;
    }

    &:focus {
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      border-color: #667eea;
    }
  }
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;

  .unit-label {
    color: #667eea;
    font-weight: 500;
    font-size: 14px;
    padding: 8px 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }
}

.image-form-item {
  :deep(.el-form-item__content) {
    display: block;
  }
}

.image-upload-container {
  .upload-tip {
    display: flex;
    align-items: center;
    margin-top: 12px;
    padding: 8px 12px;
    background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
    border-radius: 6px;
    color: #555;
    font-size: 12px;
    border: 1px solid rgba(102, 126, 234, 0.2);

    .tip-icon {
      margin-right: 6px;
      color: #667eea;
    }
  }
}
</style>
