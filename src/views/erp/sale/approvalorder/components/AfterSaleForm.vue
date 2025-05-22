<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <!-- 新增不可编辑字段 -->
      <el-form-item label="产品名称">
        <el-input v-model="formData.productName" :disabled="true" />
      </el-form-item>
      <!-- 产品规格 -->
      <el-form-item label="产品规格">
        <el-input v-model="formData.productSpecification" :disabled="true" />
      </el-form-item>
      <!-- 产品数量 -->
      <el-form-item label="产品数量">
        <el-input v-model="formData.productQuantity" :disabled="true" />
      </el-form-item>
      <!-- 出货单价 -->
      <el-form-item label="出货单价">
        <el-input v-model="formData.salePrice" :disabled="true" />
      </el-form-item>
      <!-- 出货运费 -->
      <el-form-item label="出货运费">
        <el-input v-model="formData.saleShippingFee" :disabled="true" />
      </el-form-item>
      <!-- 出货杂费 -->
      <el-form-item label="出货杂费" prop="saleOtherFees">
        <el-input v-model="formData.saleOtherFees" :disabled="true" />
      </el-form-item>
      <el-form-item label="出货总额">
        <el-input v-model="formData.totalSaleAmount" :disabled="true" />
      </el-form-item>
      <!-- 原有字段 -->
      <el-form-item label="售后时间">
        <el-input v-model="formData.afterSalesTime" :disabled="true" :value="formatTime(formData.afterSalesTime)"/>
      </el-form-item>
      <el-form-item label="售后情况" prop="afterSalesStatus">
        <el-input
          type="textarea"
          v-model="formData.afterSalesStatus"
          placeholder="请输入售后情况"
          :rows="4"
          @input="handleAfterSalesStatusChange"
        />
      </el-form-item>
      <el-form-item label="售后审核费用" prop="saleAfterSalesAmount">
        <el-input-number
          v-model="formData.saleAfterSalesAmount"
          controls-position="right"
          :min="0"
          :precision="2"
          placeholder="请输入售后费用"
          class="!w-1/1"
        />
      </el-form-item>
      <el-form-item label="售后审核时间" prop="saleAfterSalesTime">
        <el-date-picker
          v-model="formData.saleAfterSalesTime"
          type="datetime"
          :formatter="dateFormatter"
          placeholder="选择销售售后时间"
          :clearable="true"
          class="!w-1/1"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm" :disabled="formLoading">确定</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { PurchaseOrderApi } from '@/api/erp/purchase/approvalorder'
import { useMessage } from '@/hooks/web/useMessage'
import dayjs from "dayjs";
import {dateFormatter, formatTime} from "@/utils/formatTime";

const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('售后信息')
const formLoading = ref(false)
const formRef = ref()

// 修改字段名匹配后端VO
const formData = reactive({
  id: 0,
  productName: '',
  productSpecification: '',
  productQuantity: 0,
  salePrice: 0,
  saleShippingFee: 0,
  saleOtherFees: 0,
  totalSaleAmount: 0,
  saleAfterSalesStatus: 0, // 销售售后状态
  saleAfterSalesSituation: '', // 销售售后情况
  saleAfterSalesAmount: 0, // 销售售后金额
  saleAfterSalesTime: null as string | null, // 销售售后时间
  afterSalesTime: '',
  afterSalesStatus: '',
})

// 调整验证规则字段名
const formRules = reactive({
  saleAfterSalesSituation: [{ required: true, message: '售后情况不能为空', trigger: 'blur' }],
  saleAfterSalesAmount: [{ required: true, message: '售后费用不能为空', trigger: 'blur' }],
  saleAfterSalesTime: [{ required: true, message: '销售售后时间不能为空', trigger: 'change' }],
})

const open = async (id: number, operationType: 'afterSale' | 'antiAfterSale') => {
  try {
    dialogVisible.value = true
    dialogTitle.value = operationType === 'afterSale' ? '售后信息' : '反售后信息'
    formLoading.value = true
    resetForm()

    // 根据操作类型设置目标状态（售后→40，反售后→30）
    formData.saleAfterSalesStatus = operationType === 'afterSale' ? 40 : 30

    // 获取订单详情并填充表单
    const orderDetail = await PurchaseOrderApi.getSaleOrder(id)
    formData.id = id
    formData.productName = orderDetail.productName || ''
    formData.productSpecification = orderDetail.productSpecification || ''
    formData.productQuantity = orderDetail.productQuantity || 0
    formData.salePrice = orderDetail.salePrice || 0
    formData.saleShippingFee = orderDetail.saleShippingFee || 0
    formData.saleOtherFees = orderDetail.saleOtherFees || 0
    formData.totalSaleAmount = orderDetail.totalSaleAmount || 0
    formData.saleAfterSalesAmount = orderDetail.saleAfterSalesAmount || 0
    formData.afterSalesTime = orderDetail.afterSalesTime || ''
    formData.afterSalesStatus = orderDetail.afterSalesStatus || ''
    if (!orderDetail.saleAfterSalesTime) {
      formData.saleAfterSalesTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    } else {
      formData.saleAfterSalesTime = orderDetail.saleAfterSalesTime
      console.log('有时间',formData.saleAfterSalesTime)
    }
  } catch (err) {
    message.error('获取订单售后信息失败，请重试')
    dialogVisible.value = false
  } finally {
    formLoading.value = false
  }
}

const resetForm = () => {
  formData.id = 0
  formData.productName = ''
  formData.productSpecification = ''
  formData.productQuantity = 0
  formData.salePrice = 0
  formData.saleShippingFee = 0
  formData.saleOtherFees = 0
  formData.totalSaleAmount = 0
  formData.saleAfterSalesAmount = 0
  formData.saleAfterSalesTime = null
  formData.saleAfterSalesStatus = 30
  formData.saleAfterSalesSituation = ''
}

const emit = defineEmits(['success'])

const submitForm = async () => {
  try {
    formLoading.value = true
    // 调用新增的updatePurchaseAfterSales接口
    console.log('提交的表单数据：', formData)
    await PurchaseOrderApi.updateSalesAfterSales(formData)
    message.success('售后信息更新成功')
    dialogVisible.value = false
    emit('success') // 触发成功事件通知父组件刷新
  } finally {
    formLoading.value = false
  }
}

defineExpose({
  open
})
/** 售后时间 */
const handleAfterSalesStatusChange = () => {
  if (formData.afterSalesStatus) {
    // 当售后状况发生变化时，设置售后时间为当前时间
    // formData.value.afterSalesTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    formData.afterSalesTime = dayjs().format('YYYY-MM-DD HH:mm:ss') // 默认当前时间
    // formData.auditTime = dayjs().format('YYYY-MM-DD HH:mm:ss') // 默认当前时间
  } else {
    // 如果售后状况为空，则清空售后时间
    formData.afterSalesTime = '';
  }
};
</script>
