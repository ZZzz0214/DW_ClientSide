<!-- 商品发布 - 产品基础信息 -->
<template>
  <el-form
    ref="formRef"
    v-loading="formLoading"
    :disabled="isDetail"
    :model="formData"
    :rules="rules"
    label-width="120px"
  >

    <!-- 产品图片 -->
    <el-form-item label="产品图片" prop="image">
      <UploadImg
        v-model="formData.image"
        :disabled="isDetail"
        height="80px"
      />
    </el-form-item>

    <!-- 产品名称 -->
    <el-form-item label="产品名称" prop="name">
      <el-input
        v-model="formData.name"
        placeholder="请输入产品名称"
        class="w-80"
      />
    </el-form-item>

    <!-- 产品简称 -->
    <el-form-item label="产品简称" prop="productShortName">
      <el-input
        v-model="formData.productShortName"
        placeholder="请输入产品简称"
        class="w-80"
      />
    </el-form-item>

    <!-- 发货编码 -->
    <el-form-item label="发货编码" prop="shippingCode">
      <el-input
        v-model="formData.shippingCode"
        placeholder="请输入发货编码"
        class="w-80"
      />
    </el-form-item>

    <!-- 产品规格 -->
    <el-form-item label="产品规格" prop="standard">
      <el-input
        v-model="formData.standard"
        placeholder="请输入产品规格"
        class="w-80"
      />
    </el-form-item>

    <!-- 产品重量 -->
<!--    <el-form-item label="产品重量" prop="weight">-->
<!--      <el-col :span="4">-->
<!--        <div style="display: flex; align-items: center;">-->
<!--          <el-input-number-->
<!--            v-model="formData.weight"-->
<!--            placeholder="请输入产品重量数值"-->
<!--            :min="0"-->
<!--            class="w-80"-->
<!--          />-->
<!--          <span style="margin-left: 25px;">g</span>-->
<!--        </div>-->

<!--      </el-col>-->

<!--&lt;!&ndash;      <el-col :span="2">&ndash;&gt;-->
<!--&lt;!&ndash;        <el-select&ndash;&gt;-->
<!--&lt;!&ndash;          v-model="formData.weightUnit"&ndash;&gt;-->
<!--&lt;!&ndash;          placeholder="请选择单位"&ndash;&gt;-->
<!--&lt;!&ndash;          class="w-80"&ndash;&gt;-->
<!--&lt;!&ndash;        >&ndash;&gt;-->
<!--&lt;!&ndash;          <el-option label="g" value="g" />&ndash;&gt;-->
<!--&lt;!&ndash;          <el-option label="kg" value="kg" />&ndash;&gt;-->
<!--&lt;!&ndash;        </el-select>&ndash;&gt;-->
<!--&lt;!&ndash;      </el-col>&ndash;&gt;-->
<!--    </el-form-item>-->

    <!-- 产品日期 -->
    <el-form-item label="产品日期" prop="productionDate">
      <el-date-picker
        v-model="formData.productionDate"
        type="date"
        value-format="x"
        placeholder="请选择产品日期"
        class="w-80"
      />
    </el-form-item>

    <!-- 保质日期 -->
    <el-form-item label="保质日期" prop="expiryDay">
        <div style="display: flex; align-items: center;">
        <el-input-number
          v-model="formData.expiryDay"
          :min="0"
          placeholder="请输入保质日期数值"
          class="w-55!"
        />
          <span style="margin-left: 25px;">年</span>
        </div>
<!--      <el-col :span="2">-->
<!--        <el-select-->
<!--          v-model="formData.expiryUnit"-->
<!--          placeholder="请选择单位"-->
<!--          class="w-80"-->
<!--        >-->
<!--          <el-option label="天" value="天" />-->
<!--          <el-option label="月" value="月" />-->
<!--          <el-option label="年" value="年" />-->
<!--        </el-select>-->
<!--      </el-col>-->
    </el-form-item>

    <!-- 品牌名称 -->
<!--    <el-form-item label="品牌名称" prop="brand">-->
<!--      <el-input-->
<!--        v-model="formData.brand"-->
<!--        placeholder="请输入品牌名称"-->
<!--        class="w-80"-->
<!--      />-->
<!--    </el-form-item>-->

<!--    &lt;!&ndash; 产品品类 &ndash;&gt;-->
<!--    <el-form-item label="产品品类" prop="categoryId">-->
<!--      <el-cascader-->
<!--        v-model="formData.categoryId"-->
<!--        :options="categoryList"-->
<!--        :props="defaultProps"-->
<!--        placeholder="请选择产品品类"-->
<!--        class="w-80"-->
<!--        clearable-->
<!--        filterable-->
<!--      />-->
<!--    </el-form-item>-->

<!--    &lt;!&ndash; 产品状态 &ndash;&gt;-->
<!--    <el-form-item label="产品状态" prop="status">-->
<!--      <el-select-->
<!--        v-model="formData.status"-->
<!--        placeholder="请选择产品状态"-->
<!--        class="w-80"-->
<!--      >-->
<!--        <el-option label="启用" :value="0" />-->
<!--        <el-option label="禁用" :value="1" />-->
<!--      </el-select>-->
<!--    </el-form-item>-->

        <!-- 品牌名称 -->
        <el-form-item label="品牌名称" prop="brand">
      <el-select
        v-model="formData.brand"
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

    <!-- 产品品类 -->
    <el-form-item label="产品品类" prop="categoryId">
      <el-select
        v-model="formData.categoryId"
        placeholder="请选择产品品类"
        class="w-80"
        filterable
        :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRODUCT_CATEGORY)"
      >
        <el-option
          v-for="dict in filteredCategoryOptions"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>

    <!-- 产品状态 -->
    <el-form-item label="产品状态" prop="status">
      <el-select
        v-model="formData.status"
        placeholder="请选择产品状态"
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

    <!-- 产品卖点 -->
    <el-form-item label="产品卖点" prop="productSellingPoints">
      <el-input
        v-model="formData.productSellingPoints"
        type="textarea"
        placeholder="请输入产品卖点"
        class="w-80"
        :autosize="{ minRows: 2, maxRows: 4 }"
      />
    </el-form-item>

    <el-form-item label="采购人员" prop="purchaser">
      <el-input
        v-model="formData.purchaser"
        placeholder="请输入采购人员信息"
        @click="openPurchaserSearch"
        readonly
        class="w-80"
      />
    </el-form-item>
  </el-form>

  <PurchaserSearchDialog
    v-model:visible="purchaserSearchDialogVisible"
    @purchaser-selected="handlePurchaserSelected"
    ref="purchaserSearchDialog"
  />
</template>
<script lang="ts" setup>
import { PropType } from 'vue'
import { copyValueToTarget } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import { defaultProps, handleTree } from '@/utils/tree'
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'

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
  image: '', // 产品图片
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
  expiryUnit: '', // 保质日期单位，默认值为“天”
  weightUnit: '', // 产品重量单位，默认值为“g”
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
    copyValueToTarget(formData, data)
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
    // 校验通过更新数据
    Object.assign(props.propFormData, formData)
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
