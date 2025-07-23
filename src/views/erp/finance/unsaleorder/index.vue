<template>

  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="订单编号" prop="no">
        <el-input
          v-model="queryParams.no"
          placeholder="请输入订单编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="订单号" prop="orderNumber">
        <el-input
          v-model="queryParams.orderNumber"
          placeholder="请输入订单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="物流公司" prop="logisticsCompany">
        <el-input
          v-model="queryParams.logisticsCompany"
          placeholder="请输入物流公司"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="物流单号" prop="trackingNumber">
        <el-input
          v-model="queryParams.trackingNumber"
          placeholder="请输入物流单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="收件姓名" prop="receiverName">
        <el-input
          v-model="queryParams.receiverName"
          placeholder="请输入收件姓名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="联系电话" prop="receiverPhone">
        <el-input
          v-model="queryParams.receiverPhone"
          placeholder="请输入联系电话"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="详细地址" prop="receiverAddress">
        <el-input
          v-model="queryParams.receiverAddress"
          placeholder="请输入详细地址"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="原表商品" prop="originalProduct">
        <el-input
          v-model="queryParams.originalProduct"
          placeholder="请输入原表商品"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="原表规格" prop="originalSpecification">
        <el-input
          v-model="queryParams.originalSpecification"
          placeholder="请输入原表规格"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="组品编号" prop="comboProductNo">
        <el-input
          v-model="queryParams.comboProductNo"
          placeholder="请输入组品编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="发货编码" prop="shippingCode">
        <el-input
          v-model="queryParams.shippingCode"
          placeholder="请输入发货编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="产品规格" prop="productSpecification">
        <el-input
          v-model="queryParams.productSpecification"
          placeholder="请输入产品规格"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="售后状况" prop="afterSalesStatus">
        <el-input
          v-model="queryParams.afterSalesStatus"
          placeholder="请输入售后状况"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="售后时间" prop="afterSalesTime">
        <el-date-picker
          v-model="queryParams.afterSalesTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>

      <!-- 采购权限相关字段 -->
      <el-form-item
        label="采购人员"
        prop="purchaser"
        v-hasPermi="['erp:distribution:importPurchase']"
      >
        <el-input
          v-model="queryParams.purchaser"
          placeholder="请输入采购人员"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item
        label="供应商名"
        prop="supplier"
        v-hasPermi="['erp:distribution:importPurchase']"
      >
        <el-input
          v-model="queryParams.supplier"
          placeholder="请输入供应商名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <!-- 销售权限相关字段 -->
      <el-form-item
        label="销售人员"
        prop="salesperson"
        v-hasPermi="['erp:distribution:importSale']"
      >
        <el-input
          v-model="queryParams.salesperson"
          placeholder="请输入销售人员"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item
        label="客户名称"
        prop="customerName"
        v-hasPermi="['erp:distribution:importSale']"
      >
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item
        label="中转人员"
        prop="transferPerson"
        v-hasPermi="['erp:distribution:importSale']"
      >
        <el-input
          v-model="queryParams.transferPerson"
          placeholder="请输入中转人员"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="创建人员" prop="creator">
        <el-input
          v-model="queryParams.creator"
          placeholder="请输入创建人员"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="采购审核状态" prop="purchaseAuditStatus"  v-hasPermi="['erp:distribution:importPurchase']">
        <el-select v-model="queryParams.purchaseAuditStatus" placeholder="请选择采购审核状态" clearable class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.ERP_AUDIT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="销售审核状态" prop="saleAuditStatus" v-hasPermi="['erp:distribution:importSale']">
        <el-select v-model="queryParams.saleAuditStatus" placeholder="请选择销售审核状态" clearable class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.ERP_AUDIT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          @click="openForm('create')"-->
<!--          v-hasPermi="['erp:sale-order:create']"-->
<!--        >-->
<!--          <Icon icon="ep:plus" class="mr-5px" /> 新增-->
<!--        </el-button>-->
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['erp:distribution:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button
          type="warning"
          plain
          @click="handleBatchAudit(10)"
          v-hasPermi="['erp:distribution:update-sale-audit-status']"
          :disabled="selectionList.length === 0"
        >
          <Icon icon="ep:close" class="mr-5px" /> 批量反审核
        </el-button>
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          @click="handleDelete(selectionList.map((item) => item.id))"-->
<!--          v-hasPermi="['erp:sale-order:delete']"-->
<!--          :disabled="selectionList.length === 0"-->
<!--        >-->
<!--          <Icon icon="ep:delete" class="mr-5px" /> 删除-->
<!--        </el-button>-->
      </el-form-item>
      <el-form-item>
    <!-- 新增四个出货合计字段显示框 -->
    <el-form-item label="出货单价合计" style="margin-left: 20px;" label-width="140px">
      <el-input v-model="totalSalePrice" disabled class="!w-120px" placeholder="无数据" />
    </el-form-item>
    <el-form-item label="出货运费合计" style="margin-left: 20px;" label-width="160px">
      <el-input v-model="totalSaleShippingFee" disabled class="!w-120px" placeholder="无数据" />
    </el-form-item>
    <el-form-item label="出货杂费合计" style="margin-left: 20px;" label-width="140px">
      <el-input v-model="totalSaleOtherFees" disabled class="!w-120px" placeholder="无数据" />
    </el-form-item>
    <el-form-item label="出货总额合计" style="margin-left: 20px;" label-width="140px">
      <el-input v-model="totalSaleAmount" disabled class="!w-120px" placeholder="无数据" />
    </el-form-item>
        <el-form-item label="出货审核总额合计" style="margin-left: 20px;" label-width="140px">
          <el-input v-model="totalSaleAuditTotalAmount" disabled class="!w-120px" placeholder="无数据" />
        </el-form-item>
  </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      @selection-change="handleSelectionChange"
      :row-style="{height: '80px'}"
      :cell-style="{padding: '10px 0', whiteSpace: 'normal', wordBreak: 'break-all'}"
    >
      <el-table-column width="30" label="选择" type="selection" />
      <el-table-column label="订单编号" prop="no" :show-overflow-tooltip="false" min-width="140"/>
      <el-table-column label="订单号" prop="orderNumber" :show-overflow-tooltip="false" min-width="140"/>
      <el-table-column label="物流公司" prop="logisticsCompany" :show-overflow-tooltip="false"/>
      <el-table-column label="物流单号" prop="trackingNumber" :show-overflow-tooltip="false" min-width="150"/>
      <el-table-column label="收件姓名" prop="receiverName" :show-overflow-tooltip="false"/>
      <el-table-column label="联系电话" prop="receiverPhone" :show-overflow-tooltip="false" min-width="100"/>
      <el-table-column label="详细地址" prop="receiverAddress" :show-overflow-tooltip="false" min-width="200"/>
      <el-table-column label="原表商品" prop="originalProductName" :show-overflow-tooltip="false" min-width="350"/>
      <el-table-column label="原表规格" prop="originalStandard" :show-overflow-tooltip="false"/>
      <el-table-column label="原表数量" prop="originalQuantity" :show-overflow-tooltip="false"/>
      <el-table-column label="备注信息" prop="remark" :show-overflow-tooltip="false"/>
      <el-table-column label="组品编号" prop="comboProductId" :show-overflow-tooltip="false" min-width="140"/>
      <el-table-column label="发货编码" prop="shippingCode" :show-overflow-tooltip="false" min-width="150"/>
      <el-table-column label="产品名称" prop="productName" :show-overflow-tooltip="false" min-width="350"/>
      <el-table-column label="产品规格" prop="productSpecification" :show-overflow-tooltip="false"/>
      <el-table-column label="产品数量" prop="productQuantity" :show-overflow-tooltip="false"/>
      <el-table-column label="售后状况" align="center" prop="afterSalesStatus" width="100" :show-overflow-tooltip="false"/>
      <el-table-column label="售后时间" align="center" prop="afterSalesTime" width="100" :formatter="dateFormatter2" :show-overflow-tooltip="false"/>
      <el-table-column label="销售人员" prop="salesperson" :show-overflow-tooltip="false"/>
      <el-table-column label="客户名称" prop="customerName" :show-overflow-tooltip="false"/>
      <el-table-column label="出货单价" prop="salePrice" :show-overflow-tooltip="false"/>
      <el-table-column label="出货运费" prop="saleShippingFee" :show-overflow-tooltip="false"/>
      <el-table-column label="出货杂费" prop="saleOtherFees" :show-overflow-tooltip="false"/>
      <el-table-column label="出货总额" prop="totalSaleAmount" :show-overflow-tooltip="false"/>
      <el-table-column label="中转人员" prop="transferPerson" :show-overflow-tooltip="false"/>
      <el-table-column label="出货备注" prop="saleRemark" :show-overflow-tooltip="false"/>

      <el-table-column label="出货审核金额" prop="saleAuditTotalAmount" :show-overflow-tooltip="false" width="130"/>
      <el-table-column label="出货审核时间" align="center" prop="saleApprovalTime" width="130" :show-overflow-tooltip="false" :formatter="dateFormatter"/>
      <el-table-column label="出货反审核时间" align="center" prop="saleUnapproveTime" width="130" :show-overflow-tooltip="false" :formatter="dateFormatter"/>
      <el-table-column label="出货售后金额" prop="saleAfterSalesAmount" :show-overflow-tooltip="false" width="130"/>
      <el-table-column label="出货售后时间" align="center" prop="saleAfterSalesTime" width="130" :show-overflow-tooltip="false" :formatter="dateFormatter"/>

      <el-table-column
        label="创建人员"
        align="center"
        prop="creator"
        :show-overflow-tooltip="false"

      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="审核状态" align="center" fixed="right" width="90" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ERP_AUDIT_STATUS" :value="scope.row.saleAuditStatus" />
        </template>
      </el-table-column>
      <el-table-column label="售后状态" align="center" width="120" fixed="right">
        <template #default="scope">
          <dict-tag
            :type="DICT_TYPE.ERP_SHOUHOU_STATUS"
            :value="scope.row.saleAfterSalesStatus"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="220">
        <template #default="scope">
          <el-button
            link
            @click="openForm('detail', scope.row.id)"
            v-hasPermi="['erp:sale-order:query']"
          >
            详情
          </el-button>
          <el-button
            link
            type="primary"
            @click="handleAudit(scope.row.id)"
            v-hasPermi="['erp:distribution:update-sale-audit-status-one']"
            v-if="scope.row.saleAuditStatus === 20"
          >
            反审批
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      :page-sizes="[10, 20, 30, 50, 100, 200, 500, 1000]"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <PurchaseOrderForm ref="formRef" @success="getList" />
  <AfterSaleForm ref="afterSaleFormRef" @success="getList" />
  <AuditForm ref="auditFormRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import download from '@/utils/download'
import { SaleOrderApi, SaleOrderVO } from '@/api/erp/sale/approvalorder'
import PurchaseOrderForm from './PurchaseOrderForm.vue'
import AfterSaleForm from './components/AfterSaleForm.vue'
import AuditForm from './components/AuditForm.vue'
import { ProductApi, ProductVO } from '@/api/erp/product/product'
import { UserVO } from '@/api/system/user'
import * as UserApi from '@/api/system/user'
import { CustomerApi, CustomerVO } from '@/api/erp/sale/customer'
import {dateFormatter, dateFormatter2} from "@/utils/formatTime";

/** ERP 销售订单列表 */
defineOptions({ name: 'ErpSaleApproval' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<SaleOrderVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  no: undefined,
  orderNumber: undefined,
  logisticsCompany: undefined,
  trackingNumber: undefined,
  receiverName: undefined,
  receiverPhone: undefined,
  receiverAddress: undefined,
  originalProduct: undefined,
  originalSpecification: undefined,
  comboProductNo: undefined,
  shippingCode: undefined,
  productName: undefined,
  productSpecification: undefined,
  afterSalesStatus: undefined,
  afterSalesTime: undefined,
  purchaser: undefined,
  supplier: undefined,
  salesperson: undefined,
  customerName: undefined,
  transferPerson: undefined,
  creator: undefined,
  createTime: undefined,
  purchaseAuditStatus: undefined,
  saleAuditStatus: undefined
})
const totalSalePrice = ref<string>('')
const totalSaleShippingFee = ref<string>('')
const totalSaleOtherFees = ref<string>('')
const totalSaleAmount = ref<string>('')
const totalSaleAuditTotalAmount = ref<string>('')
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const productList = ref<ProductVO[]>([]) // 产品列表
const customerList = ref<CustomerVO[]>([]) // 客户列表
const userList = ref<UserVO[]>([]) // 用户列表

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await SaleOrderApi.getSaleOrderReviewedPage(queryParams)
    console.log(data.pageResult.list)
    totalSalePrice.value = data.totalSalePrice?.toFixed(2) || ''
    totalSaleShippingFee.value = data.totalSaleShippingFee?.toFixed(2) || ''
    totalSaleOtherFees.value = data.totalSaleOtherFees?.toFixed(2) || ''
    totalSaleAmount.value = data.totalSaleAmount?.toFixed(2) || ''
    totalSaleAuditTotalAmount.value = data.totalSaleAuditTotalAmount?.toFixed(2) || ''
    list.value = data.pageResult.list
    total.value = data.pageResult.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
// const handleDelete = async (ids: number[]) => {
//   try {
//     // 删除的二次确认
//     await message.delConfirm()
//     // 发起删除
//     await SaleOrderApi.deleteSaleOrder(ids)
//     message.success(t('common.delSuccess'))
//     // 刷新列表
//     await getList()
//     selectionList.value = selectionList.value.filter((item) => !ids.includes(item.id))
//   } catch {}
// }

/** 审批/反审批操作 */
// const handleUpdateStatus = async (id: number, status: number) => {
//   try {
//     // 审批的二次确认
//     await message.confirm(`确定${status === 20 ? '审批' : '反审批'}该订单吗？`)
//     // 发起审批
//     await SaleOrderApi.updateSaleOrderStatus(id, status)
//     message.success(`${status === 20 ? '审批' : '反审批'}成功`)
//     // 刷新列表
//     await getList()
//   } catch {}
// }
const auditFormRef = ref()
// 点击审核按钮触发
const handleAudit = (id: number) => {
  auditFormRef.value.open(id) // 调用 AuditForm 的 open 方法
}

// 在 handleUpdateStatus 方法后添加以下代码
const afterSaleFormRef = ref()

// const handleAfterSaleWithDetails = (id: number, operationType: 'afterSale' | 'antiAfterSale') => {
//   afterSaleFormRef.value.open(id, operationType)  // 传递操作类型给弹窗
// }

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await SaleOrderApi.exportSaleOrder2(queryParams)
    download.excel(data, '代发订单.xlsx')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 选中操作 */
const selectionList = ref<SaleOrderVO[]>([])
const handleSelectionChange = (rows: SaleOrderVO[]) => {
  selectionList.value = rows
}

/** 批量审核操作 */
const handleBatchAudit = async (saleAuditStatus: number) => {
  try {
    const ids = selectionList.value.map(item => item.id!)
    const statusText = saleAuditStatus === 20 ? '审核' : '反审核'
    await message.confirm(`确定${statusText}选中的 ${ids.length} 条记录吗？`)

    await SaleOrderApi.batchUpdateSaleAuditStatus(ids, saleAuditStatus)
    message.success(`${statusText}成功`)

    // 刷新列表并清空选择
    await getList()
    selectionList.value = []
  } catch {}
}


/** 初始化 **/
onMounted(async () => {
  await getList()
  // 加载产品、仓库列表、客户
  productList.value = await ProductApi.getProductSimpleList()
  customerList.value = await CustomerApi.getCustomerSimpleList()
  userList.value = await UserApi.getSimpleUserList()
})
// TODO 芋艿：可优化功能：列表界面，支持导入
// TODO 芋艿：可优化功能：详情界面，支持打印
</script>
