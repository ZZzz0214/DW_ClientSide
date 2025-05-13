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
      <el-form-item label="产品规格">
        <el-input v-model="formData.productSpecification" :disabled="true" />
      </el-form-item>
      <el-form-item label="产品数量">
        <el-input v-model="formData.productQuantity" :disabled="true" />
      </el-form-item>
      <el-form-item label="采购单价">
        <el-input v-model="formData.purchasePrice" :disabled="true" />
      </el-form-item>
      <el-form-item label="采购运费">
        <el-input v-model="formData.shippingFee" :disabled="true" />
      </el-form-item>
      <el-form-item label="采购杂费">
        <el-input v-model="formData.otherFees" :disabled="true" />
      </el-form-item>
      <el-form-item label="采购总额">
        <el-input v-model="formData.totalPurchaseAmount" :disabled="true" />
      </el-form-item>
      <!-- 原有字段 -->
      <el-form-item label="售后时间">
        <el-input v-model="formData.purchaseAfterSalesTime" :disabled="true" />
      </el-form-item>
      <el-form-item label="售后情况" prop="purchaseAfterSalesSituation">
        <el-input
          type="textarea"
          v-model="formData.purchaseAfterSalesSituation"
          placeholder="请输入售后情况"
          :rows="4"
        />
      </el-form-item>
      <el-form-item label="售后审核费用" prop="purchaseAfterSalesAmount" >
        <el-input-number
          v-model="formData.purchaseAfterSalesAmount"
          controls-position="right"
          :min="0"
          :precision="2"
          placeholder="请输入售后费用"
          class="!w-1/1"
        />
      </el-form-item>
      <el-form-item label="售后审核时间" prop="purchaseAfterSalesTime" >
        <!-- 添加 value-format 指定输出格式为 yyyy-MM-dd HH:mm:ss -->
        <el-date-picker
          v-model="formData.purchaseAfterSalesTime"
          type="datetime"
          :formatter="dateFormatter"
          placeholder="选择采购售后时间"
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
import {dateFormatter} from "@/utils/formatTime";

const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('售后信息')
const formLoading = ref(false)
const formRef = ref()

// 修改字段名匹配后端VO
const formData = reactive({
  id: 0,
  productName: '', // 产品名称
  productSpecification: '', // 产品规格
  productQuantity: 0, // 产品数量
  purchasePrice: 0, // 采购单价
  shippingFee: 0, // 采购运费
  otherFees: 0, // 采购杂费
  totalPurchaseAmount: 0, // 采购总额
  purchaseAfterSalesAmount: 0, // 售后金额
  purchaseAfterSalesTime: null as string | null, // 审核售后时间
  purchaseAfterSalesStatus: 30,
  purchaseAfterSalesSituation: '',
})

// 调整验证规则字段名
const formRules = reactive({
  purchaseAfterSalesSituation: [{ required: true, message: '售后情况不能为空', trigger: 'blur' }],
  purchaseAfterSalesAmount: [{ required: true, message: '售后费用不能为空', trigger: 'blur' }],
  purchaseAfterSalesTime: [{ required: true, message: '采购售后时间不能为空', trigger: 'change' }],
})

const open = async (id: number, operationType: 'afterSale' | 'antiAfterSale') => {
  try {
    dialogVisible.value = true
    dialogTitle.value = operationType === 'afterSale' ? '售后信息' : '反售后信息'
    formLoading.value = true
    resetForm()

    // 根据操作类型设置目标状态（售后→40，反售后→30）
    formData.purchaseAfterSalesStatus = operationType === 'afterSale' ? 40 : 30

    // 获取订单详情并填充表单
    const orderDetail = await PurchaseOrderApi.getPurchaseOrder(id)
    formData.id = id
    formData.productName = orderDetail.productName || '' // 产品名称
    formData.productSpecification = orderDetail.productSpecification || '' // 产品规格
    formData.productQuantity = orderDetail.productQuantity || 0 // 产品数量
    formData.purchasePrice = orderDetail.purchasePrice || 0 // 采购单价
    formData.shippingFee = orderDetail.shippingFee || 0 // 采购运费
    formData.otherFees = orderDetail.otherFees || 0 // 采购杂费
    formData.totalPurchaseAmount = orderDetail.totalPurchaseAmount || 0 // 采购总额
    formData.purchaseAfterSalesAmount = orderDetail.purchaseAfterSalesAmount || 0 // 售后金额
    formData.purchaseAfterSalesTime = orderDetail.purchaseAfterSalesTime || null // 审核售后时间
    formData.purchaseAfterSalesSituation = orderDetail.purchaseAfterSalesSituation || ''
    formData.purchaseAfterSalesAmount = orderDetail.purchaseAfterSalesAmount || ''
    if (!orderDetail.purchaseAfterSalesTime) {
      // 生成符合 yyyy-MM-dd HH:mm:ss 格式的字符串（与 value-format 一致）
      // const now = new Date()
      // const year = now.getFullYear()
      // const month = String(now.getMonth() + 1).padStart(2, '0')
      // const day = String(now.getDate()).padStart(2, '0')
      // const hours = String(now.getHours()).padStart(2, '0')
      // const minutes = String(now.getMinutes()).padStart(2, '0')
      // const seconds = String(now.getSeconds()).padStart(2, '0')
      // formData.purchaseAfterSalesTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}` // 关键修改：手动拼接格式
      formData.purchaseAfterSalesTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      console.log('生成的时间：', formData.purchaseAfterSalesTime)
    } else {
      // 直接使用后端返回的字符串（假设后端返回的格式已符合 yyyy-MM-dd HH:mm:ss）
      formData.purchaseAfterSalesTime = orderDetail.purchaseAfterSalesTime
      console.log('有时间',formData.purchaseAfterSalesTime)
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
  formData.productName = '' // 产品名称
  formData.productSpecification = '' // 产品规格
  formData.productQuantity = 0 // 产品数量
  formData.purchasePrice = 0 // 采购单价
  formData.shippingFee = 0 // 采购运费
  formData.otherFees = 0 // 采购杂费
  formData.totalPurchaseAmount = 0 // 采购总额
  formData.purchaseAfterSalesAmount = 0 // 售后金额
  formData.purchaseAfterSalesTime = null // 审核售后时间
  formData.purchaseAfterSalesStatus = 30
  formData.purchaseAfterSalesSituation = ''
}

const emit = defineEmits(['success'])

const submitForm = async () => {
  try {
    formLoading.value = true
    // 调用新增的updatePurchaseAfterSales接口
    console.log('提交的表单数据：', formData)
    await PurchaseOrderApi.updatePurchaseAfterSales(formData)
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
</script>
