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
    <!-- 产品编号 -->
<!--    <el-form-item label="产品编号" prop="id">-->
<!--      <el-input-->
<!--        v-model="formData.id"-->
<!--        placeholder="请输入产品编号"-->
<!--        class="w-80"-->
<!--        :disabled="isDetail"-->
<!--      />-->
<!--    </el-form-item>-->

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
    <el-form-item label="产品重量" prop="weight">
      <el-input-number
        v-model="formData.weight"
        :min="0"
        placeholder="请输入产品重量"
        class="w-80"
      />
    </el-form-item>

    <!-- 产品日期 -->
    <el-form-item label="产品日期" prop="productionDate">
      <el-date-picker
        v-model="formData.productionDate"
        type="date"
        placeholder="请选择产品日期"
        class="w-80"
      />
    </el-form-item>

    <!-- 保质日期 -->
    <el-form-item label="保质日期" prop="expiryDay">
      <el-input-number
        v-model="formData.expiryDay"
        :min="0"
        placeholder="请输入保质日期（天）"
        class="w-80"
      />
    </el-form-item>

    <!-- 品牌名称 -->
    <el-form-item label="品牌名称" prop="brand">
      <el-input
        v-model="formData.brand"
        placeholder="请输入品牌名称"
        class="w-80"
      />
    </el-form-item>

    <!-- 产品品类 -->
    <el-form-item label="产品品类" prop="categoryId">
      <el-cascader
        v-model="formData.categoryId"
        :options="categoryList"
        :props="defaultProps"
        placeholder="请选择产品品类"
        class="w-80"
        clearable
        filterable
      />
    </el-form-item>

    <!-- 产品状态 -->
    <el-form-item label="产品状态" prop="status">
      <el-select
        v-model="formData.status"
        placeholder="请选择产品状态"
        class="w-80"
      >
        <el-option label="启用" :value="1" />
        <el-option label="禁用" :value="0" />
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
  </el-form>
</template>
<script lang="ts" setup>
import { PropType } from 'vue'
import { copyValueToTarget } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import { defaultProps, handleTree } from '@/utils/tree'

import type { ProductVO  } from '@/api/erp/product/product/index'
import * as ProductCategoryApi from '@/api/erp/product/category/index'
import { ProductCategoryVO } from '@/api/erp/product/category/index'
import * as ProductBrandApi from '@/api/erp/product/product/brand'
import { BrandVO } from '@/api/erp/product/product/brand'

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
  status: null, // 产品状态
  productSellingPoints: '', // 产品卖点
  standard: '', // 产品规格
  weight: 0, // 产品重量
  productionDate: '', // 产品日期
  expiryDay: 0, // 保质日期
})

const rules = reactive({
  id: [{ required: true, message: '产品编号不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
  image: [{ required: true, message: '产品图片不能为空', trigger: 'blur' }],
  productShortName: [{ required: true, message: '产品简称不能为空', trigger: 'blur' }],
  shippingCode: [{ required: true, message: '发货编码不能为空', trigger: 'blur' }],
  standard: [{ required: true, message: '产品规格不能为空', trigger: 'blur' }],
  weight: [{ required: true, message: '产品重量不能为空', trigger: 'blur' }],
  productionDate: [{ required: true, message: '产品日期不能为空', trigger: 'blur' }],
  expiryDay: [{ required: true, message: '保质日期不能为空', trigger: 'blur' }],
  brand: [{ required: true, message: '品牌名称不能为空', trigger: 'blur' }],
  categoryId: [{ required: true, message: '产品品类不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '产品状态不能为空', trigger: 'blur' }],
  productSellingPoints: [{ required: true, message: '产品卖点不能为空', trigger: 'blur' }]
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
