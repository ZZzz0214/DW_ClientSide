<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >

      <el-form-item label="订单编号">
        <el-input v-model="formData.no" :disabled="true" />
      </el-form-item>
      <el-form-item label="物流单号">
        <el-input v-model="formData.logisticsNumber" :disabled="true" />
      </el-form-item>
   <!-- 产品名称 -->
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
      <!-- 出货货拉拉费 -->
      <el-form-item label="出货货拉拉费">
        <el-input v-model="formData.saleTruckFee" :disabled="true" />
      </el-form-item>
      <!-- 出货物流费用 -->
      <el-form-item label="出货物流费用">
        <el-input v-model="formData.saleLogisticsFee" :disabled="true" />
      </el-form-item>
      <!-- 出货杂费 -->
      <el-form-item label="出货杂费" prop="saleOtherFees">
        <el-input-number
          v-model="formData.saleOtherFees"
          controls-position="right"
          :precision="2"
          placeholder="请输入出货杂费"
          class="!w-1/1"
        />
      </el-form-item>
      <!-- 出货总额 -->
      <el-form-item label="出货总额">
        <el-input v-model="formData.totalSaleAmount" :disabled="true" />
      </el-form-item>
      <el-form-item label="批发销售审核总额">
        <el-input v-model="formData.saleAuditTotalAmount" :disabled="true" />
      </el-form-item>
      <!-- 新增审核时间和反审核时间字段 -->

      <el-form-item label="反审核时间">
        <el-date-picker
          v-model="formData.saleUnapproveTime"
          type="datetime"
          value-format="x"
          placeholder="选择反审核时间"
          :disabled="true"
          class="!w-1/1"
        />
      </el-form-item>
      <!-- 审核相关可编辑字段 -->
<!--      <el-form-item label="审核情况" prop="auditSituation">-->
<!--        <el-input-->
<!--          type="textarea"-->
<!--          v-model="formData.auditSituation"-->
<!--          placeholder="请输入审核情况"-->
<!--          :rows="4"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="审核费用" prop="auditAmount">-->
<!--        <el-input-number-->
<!--          v-model="formData.auditAmount"-->
<!--          controls-position="right"-->
<!--          :min="0"-->
<!--          :precision="2"-->
<!--          placeholder="请输入审核费用"-->
<!--          class="!w-1/1"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="审核时间" prop="auditTime">-->
<!--        <el-date-picker-->
<!--          v-model="formData.auditTime"-->
<!--          type="datetime"-->
<!--          value-format="yyyy-MM-dd HH:mm:ss"-->
<!--          placeholder="选择审核时间"-->
<!--          :clearable="true"-->
<!--          class="!w-1/1"-->
<!--        />-->
<!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm" :disabled="formLoading">提交审核</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { PurchaseOrderApi } from '@/api/erp/purchase/approvalorders'
import { useMessage } from '@/hooks/web/useMessage'
import dayjs from "dayjs";

const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('审核信息')
const formLoading = ref(false)
const formRef = ref()

// 审核表单数据（字段与 AfterSaleForm 一致）
const formData = reactive({
  id: 0,
  productName: '',
  productSpecification: '',
  productQuantity: 0,
  salePrice: 0,
  saleTruckFee: 0,
  saleLogisticsFee: 0,
  saleOtherFees: 0,
  totalSaleAmount: 0,
  auditTime: null,
  saleApprovalTime: null as string | null,
  saleUnapproveTime: null as string | null,
  no:0,
  logisticsNumber:0,
  saleAuditTotalAmount: 0,
})

// 审核验证规则（与 AfterSaleForm 类似）
const formRules = reactive({
  auditSituation: [{ required: true, message: '审核情况不能为空', trigger: 'blur' }],
  auditAmount: [{ required: true, message: '审核费用不能为空', trigger: 'blur' }],
  auditTime: [{ required: true, message: '审核时间不能为空', trigger: 'change' }],
})

// 打开审核弹窗（逻辑与 AfterSaleForm 的 open 方法类似）
const open = async (id: number) => {
  try {
    dialogVisible.value = true
    formLoading.value = true
    resetForm()

    // 获取订单详情填充表单（复用 AfterSaleForm 的接口）
    const orderDetail = await PurchaseOrderApi.getSaleOrder(id)
    formData.id = id
    formData.productName = orderDetail.productName || ''
    formData.productSpecification = orderDetail.productSpecification || ''
    formData.productQuantity = orderDetail.productQuantity || 0
    formData.salePrice = orderDetail.salePrice || 0
    formData.saleTruckFee = orderDetail.saleTruckFee || 0
    formData.saleLogisticsFee = orderDetail.saleLogisticsFee || 0
    formData.saleOtherFees = orderDetail.saleOtherFees || 0
    formData.totalSaleAmount = orderDetail.totalSaleAmount || 0
    formData.no = orderDetail.no || 0
    formData.logisticsNumber = orderDetail.logisticsNumber || 0
    formData.auditTime = dayjs().format('YYYY-MM-DD HH:mm:ss') // 默认当前时间
        // 填充时间数据
    formData.saleApprovalTime = orderDetail.saleApprovalTime || null
    formData.saleUnapproveTime = orderDetail.saleUnapproveTime || null
    formData.saleAuditTotalAmount = orderDetail.totalSaleAmount || 0
  } catch (err) {
    message.error('获取订单信息失败，请重试')
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
  formData.saleTruckFee = 0
  formData.saleLogisticsFee = 0
  formData.saleOtherFees = 0
  formData.totalSaleAmount = 0
  formData.auditTime = null
  formData.saleAuditTotalAmount = 0
}
const emit = defineEmits(['success'])
const submitForm = async () => {
  try {
    formLoading.value = true
    console.log("123",formData.id)
    // 调用审核接口，传递出货杂费和批发销售审核总额
    await PurchaseOrderApi.updateSaleOrderStatus({
      id: formData.id,
      saleAuditStatus: 20, // 20 表示审核通过
      otherFees: formData.saleOtherFees, // 传递出货杂费
      saleAuditTotalAmount: formData.saleAuditTotalAmount // 传递批发销售审核总额
    })
    message.success('审核成功')
    dialogVisible.value = false
    emit('success') // 触发父组件刷新
  } catch (err) {
    message.error('审核提交失败，请重试')
  } finally {
    formLoading.value = false
  }
}

defineExpose({ open })
</script>
