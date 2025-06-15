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
        <el-col :span="12">
          <el-form-item label="订单编号" prop="no">
            <el-input disabled v-model="formData.no" placeholder="保存时自动生成" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物流单号" prop="logisticsNumber">
            <el-input  v-model="formData.logisticsNumber" placeholder="请输入物流单号" />
          </el-form-item>
        </el-col>
      </el-row>

<!--      &lt;!&ndash; 第二行：产品名称、产品规格、产品数量、发货编码 &ndash;&gt;-->
<!--      <el-row :gutter="20">-->
<!--        <el-col :span="6">-->
<!--          <el-form-item label="产品名称" prop="productName">-->
<!--            <el-input disabled v-model="formData.productName" placeholder="添加采购信息后自动生成" type="textarea"/>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="6">-->
<!--          <el-form-item label="产品规格" prop="productSpecification">-->
<!--            <el-input v-model="formData.productSpecification" placeholder="请输入产品规格" type="textarea"/>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="6">-->
<!--          <el-form-item label="产品数量" prop="productQuantity">-->
<!--            <el-input-number-->
<!--              v-model="formData.productQuantity"-->
<!--              controls-position="right"-->
<!--              :min="0"-->
<!--              class="!w-100%"-->
<!--              placeholder="请输入产品数量"-->
<!--              :disabled="formData.purchaseAuditStatus === 20 || formData.saleAuditStatus === 20"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="6">-->
<!--          <el-form-item label="发货编码" prop="shippingCode">-->
<!--            <el-input disabled v-model="formData.shippingCode" placeholder="获取后自动生成" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->

<!--      </el-row>-->

      <!-- 第二行：产品名称、产品规格、产品数量、发货编码和组品编号 -->

    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="产品名称" prop="productName">
          <el-input disabled v-model="formData.productName" placeholder="自动生成" type="textarea"
                    :autosize="{ minRows: 1, maxRows: 4 }"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="产品规格" prop="productSpecification">
          <el-input v-model="formData.productSpecification" placeholder="请输入产品规格" type="textarea"
                    :autosize="{ minRows: 1, maxRows: 4 }"/>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="产品数量" prop="productQuantity">
          <el-input-number
            v-model="formData.productQuantity"
            controls-position="right"
            :min="0"
            class="!w-100%"
            placeholder="请输入产品数量"
            :disabled="formData.purchaseAuditStatus === 20 || formData.saleAuditStatus === 20"
          />
        </el-form-item>
      </el-col>
<!--      <el-col :span="6">-->
<!--        <el-form-item label="组品编码" prop="comboProductId">-->
<!--          <el-input disabled v-model="formData.comboProductId" placeholder="获取后自动生成" type="textarea" :rows="1"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="发货编码" prop="shippingCode">-->
<!--          <el-input disabled v-model="formData.shippingCode" placeholder="获取后自动生成" type="textarea" :rows="1"/>-->
<!--        </el-form-item>-->

<!--      </el-col>-->

      <el-col :span="6">
        <el-form-item label="组品编码" prop="comboProductNo">
          <el-input
            disabled
            v-model="formData.comboProductNo"
            placeholder="获取后自动生成"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 4 }"
          />
        </el-form-item>
        <el-form-item label="发货编码" prop="shippingCode">
          <el-input
            disabled
            v-model="formData.shippingCode"
            placeholder="获取后自动生成"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 4 }"
          />
        </el-form-item>
      </el-col>
    </el-row>


<!--      <el-row :gutter="20">-->
<!--      <el-col :span="8">-->
<!--          <el-form-item label="附件" prop="fileUrl">-->
<!--            <UploadFile :is-show-tip="false" v-model="formData.fileUrl" :limit="1" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->

      <!-- 子表的表单 -->
      <ContentWrap>
        <el-tabs v-model="subTabsName" @tab-change="switchTab" class="-mt-15px -mb-10px">
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
          <el-form-item label="详细地址" prop="receiverAddress">
            <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4 }" v-model="formData.receiverAddress" placeholder="请输入详细地址" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行：售后状况和备注信息 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="售后状况" prop="afterSalesStatus">
            <el-input
              v-model="formData.afterSalesStatus"
              :rows="2"
              placeholder="请输入售后状况"
              @input="handleAfterSalesStatusChange"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 4 }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="售后时间" prop="afterSalesTime">
            <el-input
              v-model="formData.afterSalesTime"
              placeholder="售后时间"
              disabled
              :value="formatTime8(formData.afterSalesTime)"
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
<!--      <el-row :gutter="20">-->
<!--        <el-col :span="24">-->
<!--          <el-form-item label="结算账户" prop="accountId">-->
<!--            <el-select-->
<!--              v-model="formData.accountId"-->
<!--              clearable-->
<!--              filterable-->
<!--              placeholder="请选择结算账户"-->
<!--              class="!w-1/1"-->
<!--            >-->
<!--              <el-option-->
<!--                v-for="item in accountList"-->
<!--                :key="item.id"-->
<!--                :label="item.name"-->
<!--                :value="item.id"-->
<!--              />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->
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
import { ErpWholesaleApi, ErpWholesaleVO } from '@/api/erp/wholesale'
import PurchaseOrderItemForm from './components/PurchaseOrderItemForm.vue'
import SalePriceItemForm from './components/SalePriceItemForm.vue'
import { SupplierApi, SupplierVO } from '@/api/erp/purchase/supplier'
import { erpPriceInputFormatter, erpPriceMultiply } from '@/utils'
import * as UserApi from '@/api/system/user'
import { AccountApi, AccountVO } from '@/api/erp/finance/account'
import * as ProductComboApi from "@/api/erp/product/combo";
import {SalePriceApi} from "@/api/erp/sale/saleprice";
import {formatTime, formatTime8} from "@/utils/formatTime";

/** ERP 销售订单表单 */
defineOptions({ name: 'ErpPurchaseOrder' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

// const handleProductIdChanged = (productId: number) => {
//   formData.value.comboProductId = productId;
// };

// const handleProductIdChanged = (productNo: string) => {
//   // 从采购信息中获取对应的发货编码
//   const purchaseItem = formData.value.items?.[0];
//   if (purchaseItem) {
//     formData.value.comboProductId = productNo;
//     formData.value.shippingCode = purchaseItem.shippingCode;
//   }
// };
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

  comboProductId: undefined, // 组合产品ID
  logisticsNumber: '', // 物流单号
  productName: '', // 产品名称
  productQuantity: 0, // 产品数量
  shippingCode: '', // 发货编码
  receiverName: '', // 收件姓名
  receiverPhone: '', // 收件电话
  receiverAddress: '', // 收件地址
  afterSalesStatus: '', // 售后状况
  afterSalesTime: '', // 售后时间，初始为空

  no: undefined, // 订单单号，后端返回
  purchaser: '', // 采购人员
  supplier: '', // 供应商名
  purchasePrice: 0, // 采购单价
  truckFee: 0, // 货拉拉费
  logisticsFee: 0, // 物流费用
  otherFees: 0, // 采购其他费用
  totalPurchaseAmount: 0, // 采购总额
  salesperson: '', // 销售人员
  customerName: '', // 客户名称
  salePrice: 0, // 出货单价
  saleTruckFee: 0, // 销售货拉拉费
  saleLogisticsFee: 0, // 销售物流费用
  saleOtherFees: 0, // 销售其他费用
  totalSaleAmount: 0, // 出货总额
})

const handleProductIdChanged = (product: {id: number, no: string}) => {
  const purchaseItem = formData.value.items?.[0];
  if (purchaseItem) {
    formData.value.comboProductId = product.id; // 存储产品ID
    formData.value.comboProductNo = product.no; // 显示产品编号
    formData.value.shippingCode = purchaseItem.shippingCode;
    formData.value.productName = purchaseItem.productName;
  }
};
const switchTab = (newTabName) => {
  if (newTabName === 'sale') {
    // 假设 comboProductId 是从采购信息中获取的
    const comboProductId = formData.value.comboProductId;
    saleFormRef.value.setComboProductId(comboProductId);
  }
};


const formRules = reactive({
  supplierId: [{ required: true, message: '供应商不能为空', trigger: 'blur' }],
  orderTime: [{ required: true, message: '订单时间不能为空', trigger: 'blur' }],
  productQuantity: [
    {
      required: true,
      message: '产品数量不能为空',
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (value === null || value === undefined || value === '') {
          callback(new Error('产品数量不能为空'));
        } else if (value <= 0) {
          callback(new Error('产品数量必须大于0'));
        } else {
          callback();
        }
      }
    }
  ],
  receiverName: [
    { required: true, message: '收件姓名不能为空', trigger: 'blur' }
  ],
  receiverPhone: [
    { required: true, message: '联系电话不能为空', trigger: 'blur' }
  ],
  receiverAddress: [
    { required: true, message: '收件地址不能为空', trigger: 'blur' }
  ]
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

/** 售后时间 */
const handleAfterSalesStatusChange = () => {
  if (formData.value.afterSalesStatus) {
    // 当售后状况发生变化时，设置售后时间为当前时间
    formData.value.afterSalesTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  } else {
    // 如果售后状况为空，则清空售后时间
    formData.value.afterSalesTime = '';
  }
};

/** 打开弹窗 */
const open = async (type: string, id?: number, copyData?: any) => {
  console.log('打开弹窗', type, id, copyData)
  dialogVisible.value = true
  
  // 复制新增时，修改标题为"复制新增"
  if (type === 'create' && copyData) {
    dialogTitle.value = '复制新增'
  } else {
  dialogTitle.value = t('action.' + type)
  }
  
  formType.value = type
  resetForm()
  
  // 复制新增时，设置数据
  if (type === 'create' && copyData) {
    console.log('复制新增，设置数据', copyData)
    formLoading.value = true
    try {
      // 复制数据但排除一些字段
      const { id: _, no: __, createTime: ___, updateTime: ____, ...dataToCopy } = copyData
      formData.value = {
        ...formData.value,
        ...dataToCopy,
        id: undefined, // 确保ID为空
        no: undefined, // 确保订单编号为空，让后端自动生成
        purchaseAuditStatus: 10, // 重置审核状态为未审核
        saleAuditStatus: 10, // 重置审核状态为未审核
      }
      
      console.log('复制后的表单数据:', formData.value)
      
      // 重新组装采购信息和销售信息
      formData.value.items = [
        {
          productId: copyData.comboProductId,
          purchaser: copyData.purchaser,
          supplier: copyData.supplier,
          purchasePrice: copyData.purchasePrice,
          logisticsFee: copyData.logisticsFee,
          truckFee: copyData.truckFee,
          otherFees: copyData.otherFees,
          totalPurchaseAmount: copyData.totalPurchaseAmount,
          count: copyData.productQuantity,
          purchaseRemark: copyData.purchaseRemark,
          productName: copyData.productName,
          shippingCode: copyData.shippingCode,
          purchaseAuditStatus: 10, // 重置审核状态为未审核
        },
      ]
      
      formData.value.saleItems = [
        {
          salesperson: copyData.salesperson,
          customerName: copyData.customerName,
          salePrice: copyData.salePrice,
          saleLogisticsFee: copyData.saleLogisticsFee,
          saleTruckFee: copyData.saleTruckFee,
          saleOtherFees: copyData.saleOtherFees,
          totalSaleAmount: copyData.totalSaleAmount,
          count: copyData.productQuantity,
          saleAuditStatus: 10, // 重置审核状态为未审核
          transferPerson: copyData.transferPerson,
          saleRemark: copyData.saleRemark,
        },
      ]
      
      // 切换到采购信息标签，方便用户操作
      subTabsName.value = 'purchase'
    } finally {
      formLoading.value = false
    }
  }
  // 修改时，设置数据
  else if (id) {
    formLoading.value = true
    try {
      const data = await ErpWholesaleApi.getErpWholesale(id);
      const searchParams = {
        groupProductId: data.comboProductId,
        customerName: data.customerName,
      };
      const purchaseshippingFeeType = await ProductComboApi.ComboApi.searchCombos(data.comboProductId);
      const saleshippingFeeType = await SalePriceApi.searchSalePrice(searchParams);
      console.log('000000000000lllllllloooooooo')
      console.log(saleshippingFeeType)
      console.log('000000000000lllllllloooooooo')
      console.log(data)
      formData.value = data;
      // 如果是详情模式，将数据重新组装到 items 和 saleItems
      if (type === 'detail') {
        formData.value.items = [
          {
            productId : data.comboProductId,
            purchaser : data.purchaser,
            supplier : data.supplier,
            purchasePrice: data.purchasePrice,
            logisticsFee : data.logisticsFee,
            truckFee : data.truckFee,
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
            saleLogisticsFee: data.saleLogisticsFee,
            saleTruckFee: data.saleTruckFee,
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
            logisticsFee : data.logisticsFee,
            truckFee : data.truckFee,
            otherFees: data.otherFees,
            totalPurchaseAmount: data.totalPurchaseAmount,
            count: data.count,
            purchaseRemark: data.purchaseRemark,

            productName : data.productName,
            shippingCode : data.shippingCode,


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
            saleLogisticsFee: data.saleLogisticsFee,
            saleTruckFee: data.saleTruckFee,
            saleOtherFees: data.saleOtherFees,
            totalSaleAmount: data.totalSaleAmount,
            count: data.count,
            transferPerson: data.transferPerson,
            saleRemark: data.saleRemark,

            // // 假设这些运费相关的字段已经存在于 data 对象中
            // shippingFeeType: saleshippingFeeType[0].shippingFeeType,
            // fixedShippingFee: saleshippingFeeType[0].fixedShippingFee,
            // additionalItemQuantity: saleshippingFeeType[0].additionalItemQuantity, //按件数量
            // additionalItemPrice: saleshippingFeeType[0].additionalItemPrice, //按件费用
            // weight: saleshippingFeeType[0].weight,
            // firstWeight: saleshippingFeeType[0].firstWeight,
            // firstWeightPrice: saleshippingFeeType[0].firstWeightPrice,
            // additionalWeight: saleshippingFeeType[0].additionalWeight,
            // additionalWeightPrice: saleshippingFeeType[0].additionalWeightPrice
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
  // 校验采购信息
  if (!formData.value.items || formData.value.items.length === 0) {
    message.error('请添加采购信息');
    subTabsName.value = 'purchase';
    return;
  }

  // 校验出货信息
  if (!formData.value.saleItems || formData.value.saleItems.length === 0) {
    message.error('请添加出货信息');
    subTabsName.value = 'sale';
    return;
  }
  // 校验出货信息中的销售人员不能为空
  if (formData.value.saleItems.some(item => !item.salesperson)) {
    message.error('出货信息中的销售人员不能为空');
    subTabsName.value = 'sale';
    return;
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ErpWholesaleVO

    // 从 items 和 saleItems 提取数据并赋值
    if (data.items && data.items.length > 0) {
      // 假设采购信息只有一条，取第一条数据
      const purchaseItem = data.items[0]
      data.comboProductId = purchaseItem.productId || 0
      data.purchaser = purchaseItem.purchaser || 0
      data.supplier = purchaseItem.supplier || 0
      data.purchasePrice = purchaseItem.purchasePrice || 0
      data.logisticsFee = purchaseItem.logisticsFee || 0
      data.truckFee = purchaseItem.truckFee || 0
      data.otherFees = purchaseItem.otherFees || 0
      data.totalPurchaseAmount = purchaseItem.totalPurchaseAmount || 0

      data.productName = purchaseItem.productName || 0
      data.purchaseRemark = purchaseItem.purchaseRemark || 0
    }

    if (data.saleItems && data.saleItems.length > 0) {
      // 假设出货信息只有一条，取第一条数据
      const saleItem = data.saleItems[0]
      data.salesperson = saleItem.salesperson || 0
      data.customerName = saleItem.customerName || 0
      data.salePrice = saleItem.salePrice || 0
      data.saleLogisticsFee = saleItem.saleLogisticsFee || 0
      data.saleTruckFee = saleItem.saleTruckFee || 0
      data.saleOtherFees = saleItem.saleOtherFees || 0
      data.totalSaleAmount = saleItem.totalSaleAmount || 0
      data.saleRemark = saleItem.saleRemark || 0
      data.transferPerson = saleItem.transferPerson || 0
    }

    if (formType.value === 'create') {
      console.log('!!!!!!!!!!!!!!!!!!!!!!')
      console.log(data)
      await ErpWholesaleApi.createErpWholesale(data)
      message.success(t('common.createSuccess'))
    } else {
      console.log('!!!!!!!!!!!!!!!!!!!!!!')
      console.log(data)
      await ErpWholesaleApi.updateErpWholesale(data)
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
// const resetForm = () => {
//   formData.value = {
//     id: undefined,
//     supplierId: undefined, // 供应商
//     accountId: undefined, // 结算账户
//     orderTime: undefined, // 订单时间
//     remark: undefined, // 备注
//     fileUrl: '', // 附件
//
//     items: [], // 采购列表
//     saleItems: [], // 出货列表
//
//     comboProductId: 0, // 组合产品ID
//     productName: '', // 产品名称
//     productQuantity: 0, // 产品数量
//     shippingCode: '', // 发货编码
//     receiverName: '', // 收件姓名
//     receiverPhone: '', // 收件电话
//     receiverAddress: '', // 收件地址
//     afterSalesStatus: '', // 售后状况
//     afterSalesTime: '', // 售后时间，初始为空
//
//     no: undefined, // 订单单号，后端返回
//     purchaser: '', // 采购人员
//     supplier: '', // 供应商名
//     purchasePrice: 0, // 采购单价
//     truckFee: 0, // 货拉拉费
//     logisticsFee: 0, // 物流费用
//     otherFees: 0, // 采购其他费用
//     totalPurchaseAmount: 0, // 采购总额
//     salesperson: '', // 销售人员
//     customerName: '', // 客户名称
//     salePrice: 0, // 出货单价
//     saleTruckFee: 0, // 销售货拉拉费
//     saleLogisticsFee: 0, // 销售物流费用
//     saleOtherFees: 0, // 销售其他费用
//     totalSaleAmount: 0, // 出货总额
//   }
//   formRef.value?.resetFields()
// }

// ... existing code ...
const resetForm = () => {
  formData.value = {
    id: undefined,
    supplierId: undefined,
    accountId: undefined,
    orderTime: undefined,
    remark: undefined,
    fileUrl: '',
    items: [],
    saleItems: [],
    comboProductId: undefined,
    logisticsNumber: '', // 物流单号
    productName: '',
    productQuantity: 0,
    shippingCode: '',
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    afterSalesStatus: '',
    afterSalesTime: '',
    no: undefined,
    purchaser: '',
    supplier: '',
    purchasePrice: 0,
    truckFee: 0,
    logisticsFee: 0,
    otherFees: 0,
    totalPurchaseAmount: 0,
    salesperson: '',
    customerName: '',
    salePrice: 0,
    saleTruckFee: 0,
    saleLogisticsFee: 0,
    saleOtherFees: 0,
    totalSaleAmount: 0
  }
  formRef.value?.resetFields()
  // 重置子表单引用
  purchaseFormRef.value?.resetFields?.()
  saleFormRef.value?.resetFields?.()
  // 重置标签页状态
  subTabsName.value = 'purchase'
}
// ... existing code ...
</script>
