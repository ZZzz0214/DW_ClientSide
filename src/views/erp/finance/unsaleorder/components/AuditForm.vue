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
      <el-form-item label="订单号">
        <el-input v-model="formData.orderNumber" :disabled="true" />
      </el-form-item>
      <el-form-item label="物流公司">
        <el-input v-model="formData.logisticsCompany" :disabled="true" />
      </el-form-item>
      <el-form-item label="物流单号">
        <el-input v-model="formData.trackingNumber" :disabled="true" />
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
      <!-- 出货运费 -->
      <el-form-item label="出货运费">
        <el-input v-model="formData.saleShippingFee" :disabled="true" />
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
      <el-form-item label="出货总额">
        <el-input v-model="formData.totalSaleAmount" :disabled="true" />
      </el-form-item>
      <el-form-item label="代发销售审核总额">
        <el-input v-model="formData.saleAuditTotalAmount" :disabled="true" />
      </el-form-item>

      <el-form-item label="审核时间" prop="saleApprovalTime">
        <el-date-picker
          v-model="formData.saleApprovalTime"
          type="datetime"
          value-format="x"
          placeholder="选择审核时间"
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
  no:0,
  orderNumber:0,
  logisticsCompany: '',
  trackingNumber: '',
  productName: '',
  productSpecification: '',
  productQuantity: 0,
  salePrice: 0,
  saleShippingFee: 0,
  saleOtherFees: 0,
  totalSaleAmount: 0,
  saleApprovalTime: null as string | null,
  saleUnapproveTime: null as string | null,
  saleAuditTotalAmount: 0
})

// 审核验证规则
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
    console.log(orderDetail)
    formData.id = id
    formData.productName = orderDetail.productName || ''
    formData.productSpecification = orderDetail.productSpecification || ''
    formData.productQuantity = orderDetail.productQuantity || 0
    formData.salePrice = orderDetail.salePrice || 0
    formData.saleShippingFee = orderDetail.saleShippingFee || 0
    formData.saleOtherFees = orderDetail.saleOtherFees || 0
    formData.totalSaleAmount = orderDetail.totalSaleAmount || 0
    formData.no = orderDetail.no || 0
    formData.orderNumber = orderDetail.orderNumber || 0
    formData.logisticsCompany = orderDetail.logisticsCompany || ''
    formData.trackingNumber = orderDetail.trackingNumber || ''
    // 填充销售时间数据
    formData.saleApprovalTime = orderDetail.saleApprovalTime || null
    formData.saleUnapproveTime = orderDetail.saleUnapproveTime || null
    formData.saleAuditTotalAmount = orderDetail.saleAuditTotalAmount || 0
    // 初始化审核字段（可选填充历史数据）
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
  formData.saleShippingFee = 0
  formData.saleOtherFees = 0
  formData.totalSaleAmount = 0
  formData.saleAuditTotalAmount = 0
}
const emit = defineEmits(['success'])
const submitForm = async () => {
  try {
    formLoading.value = true
    console.log("123",formData.id)
    // 调用审核接口，反审批时不传递审核总额字段
    await PurchaseOrderApi.updateSaleOrderStatus({
      id: formData.id,
      saleAuditStatus: 10, // 10 表示反审核
      otherFees: formData.saleOtherFees // 传递出货杂费
    })
    message.success('反审核成功')
    dialogVisible.value = false
    emit('success') // 触发父组件刷新
  } catch (err) {
    message.error('反审核提交失败，请重试')
  } finally {
    formLoading.value = false
  }
}

defineExpose({ open })
</script>
