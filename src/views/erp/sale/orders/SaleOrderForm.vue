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
          <el-form-item label="订单单号" prop="no">
            <el-input disabled v-model="formData.no" placeholder="保存时自动生成" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单时间" prop="orderTime">
            <el-date-picker
              v-model="formData.orderTime"
              type="date"
              value-format="x"
              placeholder="选择订单时间"
              class="!w-1/1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户" prop="customerId">
            <el-select
              v-model="formData.customerId"
              clearable
              filterable
              placeholder="请选择客户"
              class="!w-1/1"
            >
              <el-option
                v-for="item in customerList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="销售人员" prop="saleUserId">
            <el-select
              v-model="formData.saleUserId"
              clearable
              filterable
              placeholder="请选择销售人员"
              class="!w-1/1"
            >
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.nickname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              v-model="formData.remark"
              :rows="1"
              placeholder="请输入备注"
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
          <el-tab-pane label="订单产品清单" name="item">
            <SaleOrderItemForm ref="itemFormRef" :items="formData.items" :disabled="disabled" />
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="总金额">
            <el-input disabled v-model="formData.totalPrice" :formatter="erpPriceInputFormatter" />
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
        <el-col :span="8">
          <el-form-item label="收取订金" prop="depositPrice">
            <el-input-number
              v-model="formData.depositPrice"
              controls-position="right"
              :min="0"
              :precision="2"
              placeholder="请输入收取订金"
              class="!w-1/1"
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
import { SaleOrderApi, SaleOrderVO } from '@/api/erp/sale/orders'
import SaleOrderItemForm from './components/SaleOrderItemForm.vue'
import { CustomerApi, CustomerVO } from '@/api/erp/sale/customer'
import { AccountApi, AccountVO } from '@/api/erp/finance/account'
import { erpPriceInputFormatter, erpPriceMultiply } from '@/utils'
import * as UserApi from '@/api/system/user'
import {PurchaseOrderApi} from "@/api/erp/purchase/order";

/** ERP 销售订单表单 */
defineOptions({ name: 'SaleOrderForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改；detail - 详情
const formData = ref({
  id: undefined,
  customerId: undefined,  //客户
  accountId: undefined,  //结算账户
  saleUserId: undefined,  //销售人员
  orderTime: undefined,  //订单时间
  remark: undefined,  //备注
  fileUrl: '',  //附件
  // discountPercent: 0,  //优惠率
  // discountPrice: 0,  //付款优惠
  totalPrice: 0,  //总金额
  depositPrice: 0,  //收取订金
  shippingFee:0, //运费
  items: [],  //列表
  no: undefined // 订单单号，后端返回
})
const formRules = reactive({
  customerId: [{ required: true, message: '客户不能为空', trigger: 'blur' }],
  orderTime: [{ required: true, message: '订单时间不能为空', trigger: 'blur' }]
})
const disabled = computed(() => formType.value === 'detail')
const formRef = ref() // 表单 Ref
const customerList = ref<CustomerVO[]>([]) // 客户列表
const accountList = ref<AccountVO[]>([]) // 账户列表
const userList = ref<UserApi.UserVO[]>([]) // 用户列表

/** 子表的表单 */
const subTabsName = ref('item')
const itemFormRef = ref()

/** 计算 discountPrice、totalPrice 价格 */
watch(
  () => formData.value,
  (val) => {
    if (!val) {
      return
    }
    const totalPrice = val.items.reduce((prev, curr) => prev + curr.totalPrice, 0)
    // const discountPrice =
    //   val.discountPercent != null ? erpPriceMultiply(totalPrice, val.discountPercent / 100.0) : 0
    // formData.value.discountPrice = discountPrice
    formData.value.totalPrice = totalPrice   //  - discountPrice
  },
  { deep: true }
)
watch(
  () => formData.value.items,
  (val) => {
    if (!val || val.length === 0) {
      return;
    }
    const totalShippingFee = val.reduce((sum, item) => sum + (item.shippingFee || 0), 0);
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
      const data = await PurchaseOrderApi.getPurchaseOrder(id);
      formData.value = data;
      // 确保子表单的运费和合计运费正确显示
      formData.value.items.forEach(item => {
        item.totalProductPrice = item.purchasePrice + (item.shippingFee || 0);
        item.totalPrice = item.totalProductPrice;
      });
    } finally {
      formLoading.value = false
    }
  }
  // 加载客户列表
  customerList.value = await CustomerApi.getCustomerSimpleList()
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
    const data = formData.value as unknown as SaleOrderVO
    if (formType.value === 'create') {
      await SaleOrderApi.createSaleOrder(data)
      message.success(t('common.createSuccess'))
    } else {
      await SaleOrderApi.updateSaleOrder(data)
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
    customerId: undefined,  //客户
    accountId: undefined,  //结算账户
    saleUserId: undefined,  //销售人员
    orderTime: undefined,  //订单时间
    remark: undefined,  //备注
    fileUrl: '',  //附件
    // discountPercent: 0,  //优惠率
    // discountPrice: 0,  //付款优惠
    totalPrice: 0,  //总金额
    depositPrice: 0,  //收取订金
    shippingFee:0, //运费
    items: [],  //列表
    no: undefined // 订单单号，后端返回
  }
  formRef.value?.resetFields()
}
</script>
