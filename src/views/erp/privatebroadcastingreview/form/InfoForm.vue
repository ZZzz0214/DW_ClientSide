<template>
  <el-form
    ref="formRef"
    :model="formData"
    label-width="120px"
    :rules="rules"
    :disabled="isDetail"
  >
    <el-form-item label="私播货盘表ID" prop="privateBroadcastingId">
      <el-input
        v-model="formData.privateBroadcastingId"
        placeholder="请输入私播货盘表ID"
        class="w-80"
        @input="fetchDataFromDatabase"
      />
    </el-form-item>
<!--    <el-form-item label="品牌名称" prop="brandName">-->
<!--      <el-input-->
<!--        v-model="formData.brandName"-->
<!--        placeholder="请输入品牌名称"-->
<!--        class="w-80"-->
<!--        :disabled="isDetail"-->
<!--      />-->
<!--    </el-form-item>-->
<!--    <el-form-item label="产品名称" prop="productName">-->
<!--      <el-input-->
<!--        v-model="formData.productName"-->
<!--        placeholder="请输入产品名称"-->
<!--        class="w-80"-->
<!--        :disabled="isDetail"-->
<!--      />-->
<!--    </el-form-item>-->
<!--    <el-form-item label="产品规格" prop="productSpec">-->
<!--      <el-input-->
<!--        v-model="formData.productSpec"-->
<!--        placeholder="请输入产品规格"-->
<!--        class="w-80"-->
<!--        :disabled="isDetail"-->
<!--      />-->
<!--    </el-form-item>-->
<!--    <el-form-item label="产品SKU" prop="productSku">-->
<!--      <el-input-->
<!--        v-model="formData.productSku"-->
<!--        placeholder="请输入产品SKU"-->
<!--        class="w-80"-->
<!--        :disabled="isDetail"-->
<!--      />-->
<!--    </el-form-item>-->
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
</template>

<script lang="ts" setup>
import { ElForm } from 'element-plus'
import { ref, watch, defineExpose, defineProps, reactive } from 'vue'
import { useMessage } from '@/hooks/web/useMessage'
import { ErpPrivateBroadcastingReviewApi } from '@/api/erp/privateBroadcastingReview'
import { copyValueToTarget } from '@/utils'

const message = useMessage()
const props = defineProps({
  isDetail: Boolean,
  propFormData: Object
})

const formData = reactive({
  privateBroadcastingId: undefined,
  no: '',
  brandName: '',
  productName: '',
  productSpec: '',
  productSku: '',
  livePrice: '',
  remark: ''
})

const rules = reactive({
  no: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
  productName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }]
})

const formRef = ref<InstanceType<typeof ElForm>>()

watch(
  () => props.propFormData,
  (data) => {
    if (!data) return
    copyValueToTarget(formData, data)
  },
  { deep: true }
)

// 根据私播货盘表ID获取数据
const fetchDataFromDatabase = async () => {
  if (!formData.privateBroadcastingId) return
  try {
    const res = await ErpPrivateBroadcastingReviewApi.getPrivateBroadcastingReviewListByIds(formData.privateBroadcastingId)
    formData.brandName = res.brandName
    formData.productName = res.productName
    formData.productSpec = res.productSpec
    formData.productSku = res.productSku
    formData.livePrice = res.livePrice
  } catch (error) {
    message.error('获取数据失败，请检查私播货盘表ID是否正确')
  }
}

defineExpose({
  validate: () => formRef.value?.validate()
})
</script>