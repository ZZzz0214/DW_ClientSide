<template>
  <el-form ref="formRef" :model="formData" label-width="120px" :rules="rules">
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
        class="!w-240px"
        :disabled="isDetail"
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
    <el-form-item label="产品名称" prop="productName">
      <el-input v-model="formData.productName" placeholder="请输入产品名称" :disabled="isDetail" />
    </el-form-item>
    <el-form-item label="产品规格" prop="productSpec">
      <el-input v-model="formData.productSpec" placeholder="请输入产品规格" :disabled="isDetail" />
    </el-form-item>
    <el-form-item label="产品SKU" prop="productSku">
      <el-input v-model="formData.productSku" placeholder="请输入产品SKU" :disabled="isDetail"  type="textarea" :autosize="{ minRows: 1, maxRows: 6}"/>
    </el-form-item>
    <el-form-item label="市场价格" prop="marketPrice">
      <el-input v-model="formData.marketPrice" placeholder="请输入市场价格" :disabled="isDetail" />
    </el-form-item>
    <el-form-item label="保质日期" prop="shelfLife">
      <el-date-picker
        v-model="formData.shelfLife"
        type="date"
        placeholder="请选择保质日期"
        value-format="x"
        :disabled="isDetail"
      />
    </el-form-item>
    <el-form-item label="产品库存" prop="productStock">
      <el-input v-model.number="formData.productStock" placeholder="请输入产品库存" :disabled="isDetail" />
    </el-form-item>
    <el-form-item label="备注信息" prop="remark">
      <el-input v-model="formData.remark" placeholder="请输入备注信息" :disabled="isDetail" />
    </el-form-item>

    <!-- 货盘状态 -->
    <el-form-item label="货盘状态" prop="privateStatus">
      <el-select
        v-model="formData.privateStatus"
        placeholder="请选择货盘状态"
        class="!w-240px"
        :disabled="isDetail"
        filterable
        :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRIVATE_STATUS)"
      >
        <el-option
          v-for="dict in filteredPrivateStatusOptions"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ElForm } from 'element-plus'
import { reactive, watch, defineExpose, defineEmits } from 'vue'
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { copyValueToTarget } from '@/utils'

const props = defineProps({
  isDetail: Boolean,
  propFormData: Object
})

const emit = defineEmits(['update:formData'])

const formData = reactive({
  no: '',
  productImage: [],
  brandName: '',
  productName: '',
  productSpec: '',
  productSku: '',
  marketPrice: undefined,
  shelfLife: '',
  productStock: undefined,
  remark: '',
  privateStatus: ''
})

const rules = {
  productName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
 // productStock: [{ required: true, message: '产品库存不能为空', trigger: 'blur' }],
  marketPrice: [
    { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效的价格格式（最多两位小数）', trigger: 'blur' }
  ],
  productSku: [{ required: true, message: '产品SKU不能为空', trigger: 'change' }],
  privateStatus: [{ required: true, message: '货盘状态不能为空', trigger: 'change' }]
}

const formRef = ref<InstanceType<typeof ElForm>>()

// 内部更新标记，避免循环更新
const isInternalUpdate = ref(false)

// 将传进来的值赋值给 formData
watch(
  () => props.propFormData,
  (data) => {
    if (!data || isInternalUpdate.value) return

    isInternalUpdate.value = true

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

    // 确保货盘状态正确赋值
    if (data.privateStatus !== undefined) {
      formData.privateStatus = data.privateStatus
    }

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
      emit('update:formData', { ...newData })
    }
  },
  { deep: true }
)

// 字典选项
const filteredBrandOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRODUCT_BRAND))
const filteredPrivateStatusOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRIVATE_STATUS))

// 字典过滤方法
const filterDictOptions = (value, dictType) => {
  const allOptions = getStrDictOptions(dictType)
  if (!value) {
    if (dictType === DICT_TYPE.ERP_PRODUCT_BRAND) {
      filteredBrandOptions.value = allOptions
    } else if (dictType === DICT_TYPE.ERP_PRIVATE_STATUS) {
      filteredPrivateStatusOptions.value = allOptions
    }
    return
  }
  const filtered = allOptions.filter(item =>
    item.label.toLowerCase().includes(value.toLowerCase())
  )
  if (dictType === DICT_TYPE.ERP_PRODUCT_BRAND) {
    filteredBrandOptions.value = filtered
  } else if (dictType === DICT_TYPE.ERP_PRIVATE_STATUS) {
    filteredPrivateStatusOptions.value = filtered
  }
}

defineExpose({
  validate: async () => {
    const valid = await formRef.value?.validate()
    if (valid) {
      // 确保数据正确传递
      emit('update:formData', { ...formData })
    }
    return valid
  }
})
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
