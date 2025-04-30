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
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="订单号" prop="no">
            <el-input disabled v-model="formData.no" placeholder="保存时自动生成" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="物流公司" prop="logisticsCompany">
            <el-input v-model="formData.logisticsCompany" placeholder="请输入物流公司" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="物流单号" prop="trackingNumber">
            <el-input v-model="formData.trackingNumber" placeholder="请输入物流单号" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品名称" prop="productName">
            <el-input disabled v-model="formData.productName" placeholder="添加采购信息后自动生成" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="发货编码" prop="shippingCode">
            <el-input disabled v-model="formData.shippingCode" placeholder="获取后自动生成" />
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

        <el-col :span="8">
          <el-form-item label="原表商品" prop="originalProductName">
            <el-input v-model="formData.originalProductName" placeholder="请输入原表商品" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="原表规格" prop="originalStandard">
            <el-input v-model="formData.originalStandard" placeholder="请输入原表规格" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="原表数量" prop="originalQuantity">
            <el-input-number
              v-model="formData.originalQuantity"
              controls-position="right"
              :min="1"
              :precision="2"
              class="!w-100%"
              placeholder="请输入原表数量"
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="附件" prop="fileUrl">
            <UploadFile :is-show-tip="false" v-model="formData.fileUrl" :limit="1" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 子表的表单 -->
      <ContentWrap>
        <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px">
          <el-tab-pane label="采购信息" name="purchase">
            <PurchaseOrderItemForm ref="purchaseFormRef" :items="formData.items" :ssb="formData.productQuantity" :disabled="disabled" />
          </el-tab-pane>
          <el-tab-pane label="出货信息" name="sale">
            <SalePriceItemForm ref="saleFormRef" :items="formData.saleItems" :ssb="formData.productQuantity" :disabled="disabled" />
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>

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
        <el-col :span="12">
          <el-form-item label="收件地址" prop="receiverAddress">
            <el-input v-model="formData.receiverAddress" placeholder="请输入详细地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="售后状况" prop="afterSalesStatus">
            <el-input
              type="textarea"
              v-model="formData.afterSalesStatus"
              :rows="1"
              placeholder="请输入备注信息"
            />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="备注信息" prop="remark">
            <el-input
              type="textarea"
              v-model="formData.remark"
              :rows="1"
              placeholder="请输入备注信息"
            />
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
import { PurchaseOrderApi, PurchaseOrderVO } from '@/api/erp/purchase/order'
import { ErpDistributionApi, ErpDistributionVO } from '@/api/erp/distribution'
import PurchaseOrderItemForm from './components/PurchaseOrderItemForm.vue'
import SalePriceItemForm from './components/SalePriceItemForm.vue'
import { SupplierApi, SupplierVO } from '@/api/erp/purchase/supplier'
import { erpPriceInputFormatter, erpPriceMultiply } from '@/utils'
import * as UserApi from '@/api/system/user'
import { AccountApi, AccountVO } from '@/api/erp/finance/account'

/** ERP 销售订单表单 */
defineOptions({ name: 'ErpPurchaseOrder' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改；detail - 详情
const formData = ref({
  id: undefined,
  supplierId: undefined, // 供应商
  accountId: undefined, // 结算账户
  orderTime: undefined, // 订单时间
  remark: undefined, // 备注
  fileUrl: '', // 附件
  totalPrice: 0, // 总金额
  depositPrice: 0, // 支付订金
  shippingFee: 0, // 运费
  items: [], // 采购列表
  saleItems: [], // 出货列表
  no: undefined, // 订单单号，后端返回
  purchaser: '', // 采购人员
  supplier: '', // 供应商名
  purchasePrice: 0, // 采购单价
  otherFees: 0, // 采购其他费用
  totalPurchaseAmount: 0, // 采购总额
  comboProductId: 0, // 组合产品ID
  logisticsCompany: '', // 物流公司
  trackingNumber: '', // 物流单号
  productName: '', // 产品名称
  productQuantity: 0, // 产品数量
  shippingCode: '', // 发货编码
  originalProductName: '', // 原表商品
  originalStandard: '', // 原表规格
  originalQuantity: 0, // 原表数量
  receiverName: '', // 收件姓名
  receiverPhone: '', // 收件电话
  receiverAddress: '', // 收件地址
  afterSalesStatus: '' // 售后状况
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
const subTabsName = ref('purchase') // 默认激活“采购信息”标签
const purchaseFormRef = ref() // 采购信息表单引用
const saleFormRef = ref() // 出货信息表单引用

/** 计算总金额和运费 */
watch(
  () => formData.value.items,
  (val) => {
    if (!val || val.length === 0) {
      return;
    }
    const totalPrice = val.reduce((prev, curr) => prev + curr.totalPrice, 0);
    const totalShippingFee = val.reduce((sum, item) => sum + (item.shippingFee || 0), 0);
    formData.value.totalPrice = totalPrice;
    formData.value.shippingFee = totalShippingFee; // 更新父表单的运费
  },
  { deep: true }
);

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
      const data = await ErpDistributionApi.getErpDistribution(id);
      formData.value = data;
      formData.value.items.forEach(item => {
        item.totalProductPrice = item.purchasePrice + (item.shippingFee || 0);
        item.totalPrice = item.totalProductPrice;
      });
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
  await purchaseFormRef.value.validate()
  await saleFormRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ErpDistributionVO
    if (formType.value === 'create') {
      await ErpDistributionApi.createErpDistribution(data)
      message.success(t('common.createSuccess'))
    } else {
      await ErpDistributionApi.updateErpDistribution(data)
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
    supplierId: undefined, // 供应商
    accountId: undefined, // 结算账户
    orderTime: undefined, // 订单时间
    remark: undefined, // 备注
    fileUrl: '', // 附件
    totalPrice: 0, // 总金额
    depositPrice: 0, // 支付订金
    shippingFee: 0, // 运费
    items: [], // 采购列表
    saleItems: [], // 出货列表
    no: undefined, // 订单单号，后端返回
    purchaser: '', // 采购人员
    supplier: '', // 供应商名
    purchasePrice: 0, // 采购单价
    otherFees: 0, // 采购其他费用
    totalPurchaseAmount: 0, // 采购总额
    comboProductId: 0, // 组合产品ID
    logisticsCompany: '', // 物流公司
    trackingNumber: '', // 物流单号
    productName: '', // 产品名称
    productQuantity: 0, // 产品数量
    shippingCode: '', // 发货编码
    originalProductName: '', // 原表商品
    originalStandard: '', // 原表规格
    originalQuantity: 0, // 原表数量
    receiverName: '', // 收件姓名
    receiverPhone: '', // 收件电话
    receiverAddress: '', // 收件地址
    afterSalesStatus: '' // 售后状况
  }
  formRef.value?.resetFields()
}
</script>