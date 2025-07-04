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
      <el-form-item label="出货批发单价">
      <el-input v-model="formData.salePrice" :disabled="true" />
      </el-form-item>
      <el-form-item label="出货物流运费">
      <el-input v-model="formData.saleLogisticsFee" :disabled="true" />
      </el-form-item>
    <el-form-item label="出货货拉拉费用">
      <el-input v-model="formData.saleTruckFee" :disabled="true" />
    </el-form-item>
    <el-form-item label="出货杂费">
      <el-input v-model="formData.saleOtherFees" :disabled="true" />
    </el-form-item>
    <el-form-item label="出货总额">
   <el-input v-model="formData.totalSaleAmount" :disabled="true" />
    </el-form-item>
      <!-- 原有字段 -->
      <el-form-item label="售后时间">
        <el-input v-model="formData.saleAfterSalesTime" :disabled="true" />
      </el-form-item>
      <el-form-item label="售后情况" prop="saleAfterSalesStatus">
        <el-input
          type="textarea"
          v-model="formData.saleAfterSalesStatus"
          placeholder="请输入售后情况"
          :rows="4"
        />
      </el-form-item>
      <el-form-item label="售后审核费用" prop="saleAfterSalesAmount" >
        <el-input-number
          v-model="formData.saleAfterSalesAmount"
          controls-position="right"
          :min="0"
          :precision="2"
          placeholder="请输入售后费用"
          class="!w-1/1"
        />
      </el-form-item>
      <el-form-item label="售后审核时间" prop="saleAfterSalesTime" >
        <!-- 添加 value-format 指定输出格式为 yyyy-MM-dd HH:mm:ss -->
        <el-date-picker
          v-model="formData.saleAfterSalesTime"
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
import { PurchaseOrderApi } from '@/api/erp/purchase/approvalorders'
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
  productName: '',
  productSpecification: '',
  productQuantity: 0,
  salePrice: 0,
  saleLogisticsFee: 0,
  saleTruckFee: 0,
  saleOtherFees: 0,
  totalSaleAmount: 0,
  saleAfterSalesStatus: 0,
  saleAfterSalesSituation: '',
  saleAfterSalesAmount: 0,
  saleAfterSalesTime: null as string | null,
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
    formData.saleAfterSalesStatus = operationType === 'afterSale' ? 40 : 30

    // 获取订单详情并填充表单
    const orderDetail = await PurchaseOrderApi.getSaleOrder(id)
    console.log('订单详情：', orderDetail)
    formData.id = id
    formData.productName = orderDetail.productName || '' // 产品名称
    formData.productSpecification = orderDetail.productSpecification || '' // 产品规格
    formData.productQuantity = orderDetail.productQuantity || 0 // 产品数量
    formData.salePrice = orderDetail.salePrice || 0 // 采购单价
    formData.saleLogisticsFee = orderDetail.saleLogisticsFee || 0 // 采购运费
    formData.saleTruckFee = orderDetail.saleTruckFee || 0 // 采购杂费
    formData.saleOtherFees = orderDetail.saleOtherFees || 0 // 采购总额
    formData.totalSaleAmount = orderDetail.totalSaleAmount || 0 // 售后金额
    formData.saleAfterSalesAmount = orderDetail.saleAfterSalesAmount || ''
    if (!orderDetail.saleAfterSalesTime) {
      // 生成符合 yyyy-MM-dd HH:mm:ss 格式的字符串（与 value-format 一致）
      // const now = new Date()
      // const year = now.getFullYear()
      // const month = String(now.getMonth() + 1).padStart(2, '0')
      // const day = String(now.getDate()).padStart(2, '0')
      // const hours = String(now.getHours()).padStart(2, '0')
      // const minutes = String(now.getMinutes()).padStart(2, '0')
      // const seconds = String(now.getSeconds()).padStart(2, '0')
      // formData.purchaseAfterSalesTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}` // 关键修改：手动拼接格式
      formData.saleAfterSalesTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    } else {
      // 直接使用后端返回的字符串（假设后端返回的格式已符合 yyyy-MM-dd HH:mm:ss）
      formData.saleAfterSalesTime = orderDetail.saleAfterSalesTime
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
  formData.salePrice = 0 // 采购单价
  formData.saleLogisticsFee = 0 // 采购运费
  formData.saleTruckFee = 0 // 采购杂费
  formData.saleOtherFees = 0 // 采购总额
  formData.totalSaleAmount = 0 // 售后金额
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
</script>
