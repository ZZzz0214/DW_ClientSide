<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1080">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
      :disabled="disabled"
    >
      <!-- 第一行：订单号 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="订单编号" prop="no">
            <el-input disabled v-model="formData.no" placeholder="保存时自动生成" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行：产品名称、产品规格、产品数量、发货编码 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="产品名称" prop="productName">
            <el-input disabled v-model="formData.productName" placeholder="添加采购信息后自动生成" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="产品规格" prop="productSpecification">
            <el-input v-model="formData.productSpecification" placeholder="请输入产品规格" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="产品数量" prop="productQuantity">
            <el-input-number
              v-model="formData.productQuantity"
              controls-position="right"
              :min="1"
              :precision="2"
              class="!w-100%"
              placeholder="请输入产品数量"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发货编码" prop="shippingCode">
            <el-input disabled v-model="formData.shippingCode" placeholder="获取后自动生成" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="附件" prop="fileUrl">
            <UploadFile :is-show-tip="false" v-model="formData.fileUrl" :limit="1" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 子表的表单 -->
      <ContentWrap>
        <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px">
          <el-tab-pane label="采购信息" name="item">
            <PurchaseOrderItemForm
              ref="itemFormRef"
              :orderData="formData"
              :disabled="disabled"
              @update="handleOrderUpdate"
            />
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>
      <!-- 第一行：收件信息 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="收件姓名" prop="receiverName">
            <el-input v-model="formData.receiverName" placeholder="请输入收件姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话" prop="receiverPhone">
            <el-input v-model="formData.receiverPhone" placeholder="请输入联系电话" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收件地址" prop="receiverAddress">
            <el-input type="textarea" :rows="1" v-model="formData.receiverAddress" placeholder="请输入详细地址" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行：售后状况和备注信息 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="售后状况" prop="afterSalesStatus">
            <el-input
              type="textarea"
              v-model="formData.purchaseAfterSalesSituation"
              :rows="2"
              placeholder="请输入售后状况"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注信息" prop="remark">
            <el-input
              type="textarea"
              v-model="formData.remark"
              :rows="2"
              placeholder="请输入备注信息"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行：结算账户 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="结算账户" prop="accountId">
            <el-select
              v-model="formData.accountId"
              clearable
              filterable
              placeholder="请选择结算账户"
              class="!w-1/1"
            >
              <el-option
                v-for="item in accountList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading" v-if="!disabled">
        确 定
      </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { PurchaseOrderApi, PurchaseOrderVO } from '@/api/erp/purchase/approvalorders'
import PurchaseOrderItemForm from './components/PurchaseOrderItemForm.vue'
import { SupplierApi, SupplierVO } from '@/api/erp/purchase/supplier'
import * as UserApi from '@/api/system/user'
import { AccountApi, AccountVO } from '@/api/erp/finance/account'

/** ERP 销售订单表单 */
defineOptions({ name: 'ErpPurchaseApproval' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改；detail - 详情
const formData = ref({
  id: undefined,
  no: undefined,
  orderNumber: undefined,
  logisticsCompany: undefined,
  trackingNumber: undefined,
  receiverName: undefined,
  receiverPhone: undefined,
  receiverAddress: undefined,
  originalProductName: undefined,
  originalStandard: undefined,
  originalQuantity: undefined,
  remark: undefined,
  comboProductId: undefined,
  shippingCode: undefined,
  productName: undefined,
  productSpecification: undefined,
  productQuantity: undefined,
  purchaser: undefined,
  supplier: undefined,
  purchasePrice: undefined,
  shippingFee: undefined,
  otherFees: undefined,
  totalPurchaseAmount: undefined,
  status: undefined
})
const formRules = reactive({
  supplierId: [{ required: true, message: '供应商不能为空', trigger: 'blur' }],
  orderTime: [{ required: true, message: '订单时间不能为空', trigger: 'blur' }]
})
const disabled = computed(() => formType.value === 'detail')
const formRef = ref() // 表单 Ref
const supplierList = ref<SupplierVO[]>([]) // 供应商列表
const accountList = ref<AccountVO[]>([]) // 账户列表
const userList = ref<UserApi.UserVO[]>([]) // 用户列表

/** 子表的表单 */
const subTabsName = ref('item')
const itemFormRef = ref()

/** 计算 discountPrice、totalPrice 价格 */


/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await PurchaseOrderApi.getSaleOrder(id);
      formData.value = data;
      // 确保子表单的运费和合计运费正确显示
    } finally {
      formLoading.value = false
    }
  }
  // 加载供应商列表
  supplierList.value = await SupplierApi.getSupplierSimpleList()
  // 加载用户列表
  userList.value = await UserApi.getSimpleUserList()
  // 加载账户列表
  accountList.value = await AccountApi.getAccountSimpleList()
  const defaultAccount = accountList.value.find((item) => item.defaultStatus)
  if (defaultAccount) {
    formData.value.accountId = defaultAccount.id
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  await itemFormRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as PurchaseOrderVO
    if (formType.value === 'create') {
      await PurchaseOrderApi.createPurchaseOrder(data)
      message.success(t('common.createSuccess'))
    } else {
      await PurchaseOrderApi.updatePurchaseOrder(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    supplierId: undefined,  //供应商
    accountId: undefined,  //结算账户
    orderTime: undefined,  //订单时间
    remark: undefined,  //备注
    fileUrl: '',  //附件
    // discountPercent: 0,  //优惠率
    // discountPrice: 0,  //付款优惠
    totalPrice: 0, //总金额
    depositPrice: 0,  //支付订金
    shippingFee:0, //运费
    items: [],  //列表
    no: undefined // 订单单号，后端返回
  }
  formRef.value?.resetFields()
}

// 添加更新处理方法
const handleOrderUpdate = (updatedData) => {
              formData.value = updatedData
            }
</script>
