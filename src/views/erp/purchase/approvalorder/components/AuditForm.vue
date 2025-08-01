<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="140px"
      v-loading="formLoading"
    >
      <!-- 复用 AfterSaleForm 的不可编辑字段 -->

      <el-form-item label="订单编号">
        <el-input v-model="formData.no" :disabled="true" />
      </el-form-item>
      <el-form-item label="订单号">
        <el-input v-model="formData.orderNumber" :disabled="true" />
      </el-form-item>
      <el-form-item label="物流公司">
        <el-input v-model="formData.logisticsCompany" :disabled="true" />
      </el-form-item>
      <el-form-item label="物流单号">
        <el-input v-model="formData.trackingNumber" :disabled="true" />
      </el-form-item>
      <el-form-item label="产品名称">
        <el-input v-model="formData.productName" type="textarea" :autosize="{ minRows: 1, maxRows: 4 }" :disabled="true" />
      </el-form-item>
      <el-form-item label="产品规格">
        <el-input v-model="formData.productSpecification" :disabled="true" type="textarea" :autosize="{ minRows: 1, maxRows: 4 }"/>
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
      <el-form-item label="采购杂费" prop="otherFees">
        <el-input-number
          v-model="formData.otherFees"
          controls-position="right"
          :precision="2"
          placeholder="请输入采购杂费"
          class="!w-1/1"
        />
      </el-form-item>
      <el-form-item label="采购总额">
        <el-input v-model="formData.totalPurchaseAmount" :disabled="true" />
      </el-form-item>
      <el-form-item label="代发采购审核总额">
        <el-input v-model="formData.purchaseAuditTotalAmount" :disabled="true"  />
      </el-form-item>

<!--      <el-form-item label="审核时间" prop="purchaseApprovalTime">-->
<!--        <el-date-picker-->
<!--          v-model="formData.purchaseApprovalTime"-->
<!--          type="datetime"-->
<!--          value-format="x"-->
<!--          placeholder="选择审核时间"-->
<!--          :disabled="true"-->
<!--          class="!w-1/1"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="采购反审核时间" prop="purchaseUnapproveTime">
        <el-date-picker
          v-model="formData.purchaseUnapproveTime"
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
import { PurchaseOrderApi } from '@/api/erp/purchase/approvalorder'
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
  logisticsCompany: '',
  trackingNumber: '',
  productQuantity: 0,
  purchasePrice: 0,
  shippingFee: 0,
  otherFees: 0,
  totalPurchaseAmount: 0,
  auditSituation: '', // 审核情况（对应原售后情况）
  auditAmount: 0, // 审核费用（对应原售后费用）
  auditTime: null as string | null, // 审核时间（对应原售后时间）
  purchaseApprovalTime: null as string | null,
  purchaseUnapproveTime: null as string | null,
  no:0,
  orderNumber:0,
  purchaseAuditTotalAmount: 0
})

// 审核验证规则（与 AfterSaleForm 类似）
const formRules = reactive({
  auditSituation: [{ required: true, message: '审核情况不能为空', trigger: 'blur' }],
  auditAmount: [{ required: true, message: '审核费用不能为空', trigger: 'blur' }],
  auditTime: [{ required: true, message: '审核时间不能为空', trigger: 'change' }],

})

// 打开审核弹窗（逻辑与 AfterSaleForm 的 open 方法类似）
const open = async (id: number, operationType: 'audit' | 'antiAudit' = 'audit') => {
  try {
    dialogVisible.value = true
    formLoading.value = true
    resetForm()

    // 根据操作类型设置标题
    dialogTitle.value = operationType === 'audit' ? '审核信息' : '反审核信息'

    // 获取订单详情填充表单（复用 AfterSaleForm 的接口）
    const orderDetail = await PurchaseOrderApi.getPurchaseOrder(id)
    formData.id = id
    formData.productName = orderDetail.productName || ''
    formData.productSpecification = orderDetail.productSpecification || ''
    formData.logisticsCompany = orderDetail.logisticsCompany || ''
    formData.trackingNumber = orderDetail.trackingNumber || ''
    formData.productQuantity = orderDetail.productQuantity || 0
    formData.purchasePrice = orderDetail.purchasePrice || 0
    formData.shippingFee = orderDetail.shippingFee || 0
    formData.otherFees = orderDetail.otherFees || 0
    formData.totalPurchaseAmount = orderDetail.totalPurchaseAmount || 0
    formData.no = orderDetail.no || 0
    formData.orderNumber = orderDetail.orderNumber || 0
    //审核时间
    formData.purchaseApprovalTime = orderDetail.purchaseApprovalTime || null
    formData.purchaseUnapproveTime = orderDetail.purchaseUnapproveTime || null

    // 根据操作类型设置审核总额
    if (operationType === 'audit') {
      // 审批时设置代发采购审核总额等于采购总额
      formData.purchaseAuditTotalAmount = orderDetail.totalPurchaseAmount || 0
    } else {
      // 反审批时保持原有的审核总额
      formData.purchaseAuditTotalAmount = orderDetail.purchaseAuditTotalAmount || 0
    }

    // 初始化审核字段（可选填充历史数据）
    formData.auditSituation = orderDetail.purchaseAfterSalesSituation || ''
    formData.auditAmount = orderDetail.purchaseAfterSalesAmount || 0
    formData.auditTime = dayjs().format('YYYY-MM-DD HH:mm:ss') // 默认当前时间
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
  formData.purchasePrice = 0
  formData.shippingFee = 0
  formData.otherFees = 0
  formData.totalPurchaseAmount = 0
  formData.auditSituation = ''
  formData.auditAmount = 0
  formData.auditTime = null
  formData.purchaseAuditTotalAmount = 0
}
const emit = defineEmits(['success'])
const submitForm = async () => {
  try {
    formLoading.value = true
    console.log("123",formData.id)

    // 根据标题判断是审批还是反审批
    const isAudit = dialogTitle.value === '审核信息'
    const auditStatus = isAudit ? 20 : 10 // 20表示审核通过，10表示反审核

    // 调用审核接口，传递采购杂费和代发采购审核总额
    await PurchaseOrderApi.updatePurchaseOrderStatus({
      id: formData.id,
      purchaseAuditStatus: auditStatus,
      otherFees: formData.otherFees, // 传递采购杂费
      purchaseAuditTotalAmount: formData.purchaseAuditTotalAmount // 传递代发采购审核总额
    })
    message.success(isAudit ? '审核成功' : '反审核成功')
    dialogVisible.value = false
    emit('success') // 触发父组件刷新
  } catch (err) {
    message.error('操作提交失败，请重试')
  } finally {
    formLoading.value = false
  }
}

defineExpose({ open })
</script>
