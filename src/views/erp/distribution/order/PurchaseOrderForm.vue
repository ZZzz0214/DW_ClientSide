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
        <el-col :span="6">
          <el-form-item label="订单编号" prop="no">
            <el-input disabled v-model="formData.no" placeholder="保存时自动生成" type="textarea"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单号" prop="orderNumber">
            <el-input v-model="formData.orderNumber" placeholder="请输入订单号" type="textarea"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="物流公司" prop="logisticsCompany">
            <el-input v-model="formData.logisticsCompany" placeholder="请输入物流公司" type="textarea"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="物流单号" prop="trackingNumber">
            <el-input v-model="formData.trackingNumber" placeholder="请输入物流单号" type="textarea"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="产品名称" prop="productName">
            <el-input disabled v-model="formData.productName" placeholder="添加采购信息后自动生成" type="textarea"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="产品规格" prop="productSpecification">
            <el-input v-model="formData.productSpecification" placeholder="请输入产品规格" type="textarea"/>
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
              :disabled="formData.purchaseAuditStatus === 20 || formData.saleAuditStatus === 20"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="组品编号" prop="comboProductId">
            <el-input disabled v-model="formData.comboProductId" placeholder="获取后自动生成" type="textarea"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="原表商品" prop="originalProductName">
            <el-input v-model="formData.originalProductName" placeholder="请输入原表商品" type="textarea"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="原表规格" prop="originalStandard">
            <el-input v-model="formData.originalStandard" placeholder="请输入原表规格" type="textarea"/>
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
        <el-col :span="6">
          <el-form-item label="发货编码" prop="shippingCode">
            <el-input disabled v-model="formData.shippingCode" placeholder="获取后自动生成" type="textarea"/>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 子表的表单 -->
      <ContentWrap>
        <el-tabs v-model="subTabsName"  @tab-change="switchTab" class="-mt-15px -mb-10px">
          <el-tab-pane label="采购信息" name="purchase">
            <PurchaseOrderItemForm ref="purchaseFormRef" :items="formData.items" :ssb="formData.productQuantity" :disabled="disabled" @productIdChanged="handleProductIdChanged" :purchaseAuditStatus="formData.purchaseAuditStatus"/>
          </el-tab-pane>
          <el-tab-pane label="出货信息" name="sale">
            <SalePriceItemForm ref="saleFormRef" :items="formData.saleItems" :ssb="formData.productQuantity" :disabled="disabled" :comboProductId="formData.comboProductId" :saleAuditStatus="formData.saleAuditStatus"/>
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
                    v-model="formData.afterSalesStatus"
                    :rows="2"
                    placeholder="请输入售后状况"
                    @input="handleAfterSalesStatusChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="售后时间" prop="afterSalesTime">
                  <el-input
                    v-model="formData.afterSalesTime"
                    placeholder="售后时间"
                    disabled
                    :value="formatTime(formData.afterSalesTime)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
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

<!--      &lt;!&ndash; 第三行：结算账户 &ndash;&gt;-->
<!--            <el-row :gutter="20">-->
<!--              <el-col :span="24">-->
<!--                <el-form-item label="结算账户" prop="accountId">-->
<!--                  <el-select-->
<!--                    v-model="formData.accountId"-->
<!--                    clearable-->
<!--                    filterable-->
<!--                    placeholder="请选择结算账户"-->
<!--                    class="!w-1/1"-->
<!--                  >-->
<!--                    <el-option-->
<!--                      v-for="item in accountList"-->
<!--                      :key="item.id"-->
<!--                      :label="item.name"-->
<!--                      :value="item.id"-->
<!--                    />-->
<!--                  </el-select>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
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
import { ErpDistributionApi, ErpDistributionVO } from '@/api/erp/distribution'
import PurchaseOrderItemForm from './components/PurchaseOrderItemForm.vue'
import SalePriceItemForm from './components/SalePriceItemForm.vue'
import { SupplierApi, SupplierVO } from '@/api/erp/purchase/supplier'
import * as UserApi from '@/api/system/user'
import { AccountApi, AccountVO } from '@/api/erp/finance/account'
import * as ProductComboApi from "@/api/erp/product/combo";
import {ref} from "vue";
import {SalePriceApi} from "@/api/erp/sale/saleprice";
import { dateFormatter,formatTime } from '@/utils/formatTime'
import dayjs from "dayjs";

/** ERP 销售订单表单 */
defineOptions({ name: 'ErpPurchaseOrder' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const handleProductIdChanged = (productId: number) => {
  formData.value.comboProductId = productId;
};
const switchTab = (newTabName) => {
  if (newTabName === 'sale') {
    // 假设 comboProductId 是从采购信息中获取的
    const comboProductId = formData.value.comboProductId;
    saleFormRef.value.setComboProductId(comboProductId);
  }
};

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

  items: [], // 采购列表
  saleItems: [], // 出货列表

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
  afterSalesStatus: '', // 售后状况
  afterSalesTime: '', // 售后时间，初始为空

  productSpecification:'', //产品规格

  no: undefined, // 订单单号，后端返回
  purchaser: '', // 采购人员
  supplier: '', // 供应商名
  purchasePrice: 0, // 采购单价
  shippingFee: 0, // 采购运费
  otherFees: 0, // 采购其他费用
  totalPurchaseAmount: 0, // 采购总额
  salesperson: '', // 销售人员
  customerName: '', // 客户名称
  salePrice: 0, // 出货单价
  saleShippingFee: 0, // 出货运费
  saleOtherFees: 0, // 销售其他费用
  totalSaleAmount: 0, // 出货总额
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
const productList = ref<any[]>([]);

/** 售后时间 */
const handleAfterSalesStatusChange = () => {
  if (formData.value.afterSalesStatus) {
    // 当售后状况发生变化时，设置售后时间为当前时间
    // formData.value.afterSalesTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    formData.value.afterSalesTime = dayjs().format('YYYY-MM-DD HH:mm:ss') // 默认当前时间
    // formData.auditTime = dayjs().format('YYYY-MM-DD HH:mm:ss') // 默认当前时间
  } else {
    // 如果售后状况为空，则清空售后时间
    formData.value.afterSalesTime = '';
  }
};

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
      console.log('000000000000lllllllloooooooo')
      console.log(data)
      const searchParams = {
        groupProductId: data.comboProductId,
        customerName: data.customerName,
      };
      const purchaseshippingFeeType = await ProductComboApi.ComboApi.searchCombos(data.comboProductId);
      const saleshippingFeeType = await SalePriceApi.searchSalePrice(searchParams);

      formData.value = data;
      // 如果是详情模式，将数据重新组装到 items 和 saleItems
      if (type === 'detail') {
        formData.value.items = [
          {
            productId : data.comboProductId,
            purchaser : data.purchaser,
            supplier : data.supplier,
            purchasePrice: data.purchasePrice,
            shippingFee: data.shippingFee,
            otherFees: data.otherFees,
            totalPurchaseAmount: data.totalPurchaseAmount,
            count: data.count,
            purchaseRemark: data.purchaseRemark,

            productName : data.productName,
            shippingCode : data.shippingCode,
          },
        ]
        formData.value.saleItems = [
          {
            salesperson: data.salesperson,
            customerName: data.customerName,
            salePrice: data.salePrice,
            saleShippingFee: data.saleShippingFee,
            saleOtherFees: data.saleOtherFees,
            totalSaleAmount: data.totalSaleAmount,
            count: data.count,
            transferPerson: data.transferPerson,
            saleRemark: data.saleRemark,
          },
        ]
      }
      // 如果是编辑模式，将数据重新组装到 items 和 saleItems
      if (type === 'update') {
        formData.value.items = [
          {
            productId : data.comboProductId,
            purchaser : data.purchaser,
            supplier : data.supplier,
            purchasePrice: data.purchasePrice,
            shippingFee: data.shippingFee,
            otherFees: data.otherFees,
            totalPurchaseAmount: data.totalPurchaseAmount,
            count: data.count,
            purchaseRemark: data.purchaseRemark,
            productName : data.productName,
            shippingCode : data.shippingCode,
            purchaseAuditStatus : data.purchaseAuditStatus,


            // 假设这些运费相关的字段已经存在于 data 对象中
            shippingFeeType: purchaseshippingFeeType[0].shippingFeeType,
            fixedShippingFee: purchaseshippingFeeType[0].fixedShippingFee,
            additionalItemQuantity: purchaseshippingFeeType[0].additionalItemQuantity, //按件数量
            additionalItemPrice: purchaseshippingFeeType[0].additionalItemPrice, //按件费用
            weight: purchaseshippingFeeType[0].weight,
            firstWeight: purchaseshippingFeeType[0].firstWeight,
            firstWeightPrice: purchaseshippingFeeType[0].firstWeightPrice,
            additionalWeight: purchaseshippingFeeType[0].additionalWeight,
            additionalWeightPrice: purchaseshippingFeeType[0].additionalWeightPrice
          },
        ]
        console.log('????????????????????????')
        console.log(formData.value.items)
        formData.value.saleItems = [
          {
            salesperson: data.salesperson,
            customerName: data.customerName,
            salePrice: data.salePrice,
            saleShippingFee: data.saleShippingFee,
            saleOtherFees: data.saleOtherFees,
            totalSaleAmount: data.totalSaleAmount,
            count: data.count,
            saleAuditStatus : data.saleAuditStatus,
            transferPerson : data.transferPerson,
            saleRemark: data.saleRemark,

            // 假设这些运费相关的字段已经存在于 data 对象中
            shippingFeeType: saleshippingFeeType[0].shippingFeeType,
            fixedShippingFee: saleshippingFeeType[0].fixedShippingFee,
            additionalItemQuantity: saleshippingFeeType[0].additionalItemQuantity, //按件数量
            additionalItemPrice: saleshippingFeeType[0].additionalItemPrice, //按件费用
            weight: saleshippingFeeType[0].weight,
            firstWeight: saleshippingFeeType[0].firstWeight,
            firstWeightPrice: saleshippingFeeType[0].firstWeightPrice,
            additionalWeight: saleshippingFeeType[0].additionalWeight,
            additionalWeightPrice: saleshippingFeeType[0].additionalWeightPrice
          },
        ]
        console.log('????????????????????????')
        console.log(formData.value.saleItems)
        console.log('????????????????????????')
      }
    } finally {
      formLoading.value = false
    }
  }
  // 加载供应商列表
  supplierList.value = await SupplierApi.getSupplierSimpleList()
  // 加载用户列表
  userList.value = await UserApi.getSimpleUserList()
  // // 加载账户列表
  // accountList.value = await AccountApi.getAccountSimpleList()
  // const defaultAccount = accountList.value.find((item) => item.defaultStatus)
  // if (defaultAccount) {
  //   formData.value.accountId = defaultAccount.id
  // }
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

    // 从 items 和 saleItems 提取数据并赋值
    if (data.items && data.items.length > 0) {
      // 假设采购信息只有一条，取第一条数据
      const purchaseItem = data.items[0]
      data.comboProductId = purchaseItem.productId || 0
      data.purchaser = purchaseItem.purchaser || 0
      data.supplier = purchaseItem.supplier || 0
      data.purchasePrice = purchaseItem.purchasePrice || 0
      data.shippingFee = purchaseItem.shippingFee || 0
      data.otherFees = purchaseItem.otherFees || 0
      data.totalPurchaseAmount = purchaseItem.totalPurchaseAmount || 0
      data.productName = purchaseItem.productName || 0
      data.shippingCode = purchaseItem.shippingCode || 0

      data.purchaseRemark = purchaseItem.purchaseRemark || 0

    }

    if (data.saleItems && data.saleItems.length > 0) {
      // 假设出货信息只有一条，取第一条数据
      const saleItem = data.saleItems[0]
      data.salesperson = saleItem.salesperson || 0
      data.customerName = saleItem.customerName || 0
      data.salePrice = saleItem.salePrice || 0
      data.saleShippingFee = saleItem.saleShippingFee || 0
      data.saleOtherFees = saleItem.saleOtherFees || 0
      data.totalSaleAmount = saleItem.totalSaleAmount || 0
      data.saleRemark = saleItem.saleRemark || 0
      data.transferPerson = saleItem.transferPerson || 0
    }

    if (formType.value === 'create') {
      console.log('!!!!!!!!!!!!!!!!!!!!!!')
      console.log(data)
      await ErpDistributionApi.createErpDistribution(data)
      message.success(t('common.createSuccess'))
    } else {
      console.log('!!!!!!!!!!!!!!!!!!!!!!')
      console.log(data)
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

    items: [], // 采购列表
    saleItems: [], // 出货列表

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
    afterSalesStatus: '', // 售后状况
    afterSalesTime: '', // 售后时间，初始为空

    productSpecification:'', //产品规格

    no: undefined, // 订单单号，后端返回
    purchaser: '', // 采购人员
    supplier: '', // 供应商名
    purchasePrice: 0, // 采购单价
    shippingFee: 0, // 采购运费
    otherFees: 0, // 采购其他费用
    totalPurchaseAmount: 0, // 采购总额
    salesperson: '', // 销售人员
    customerName: '', // 客户名称
    salePrice: 0, // 出货单价
    saleShippingFee: 0, // 出货运费
    saleOtherFees: 0, // 销售其他费用
    totalSaleAmount: 0, // 出货总额
  }
  formRef.value?.resetFields()
}
</script>
