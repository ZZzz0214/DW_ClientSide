<template>

  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
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
      <el-form-item label="物流单号" prop="logisticsNumber">
        <el-input
          v-model="queryParams.logisticsNumber"
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
      <el-form-item label="采购人员" prop="purchaser" v-hasPermi="['erp:wholesale:importPurchase']">
        <el-input
          v-model="queryParams.purchaser"
          placeholder="请输入采购人员"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="供应商名" prop="supplier" v-hasPermi="['erp:wholesale:importPurchase']">
        <el-input
          v-model="queryParams.supplier"
          placeholder="请输入供应商名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <!-- 销售权限相关字段 -->
      <el-form-item label="销售人员" prop="salesperson" v-hasPermi="['erp:wholesale:importSale']">
        <el-input
          v-model="queryParams.salesperson"
          placeholder="请输入销售人员"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName" v-hasPermi="['erp:wholesale:importSale']">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="中转人员" prop="transferPerson" v-hasPermi="['erp:wholesale:importSale']">
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

      <!-- 审核状态字段放到最后 -->
      <el-form-item label="采购审核" prop="purchaseAuditStatus" v-hasPermi="['erp:wholesale:importPurchase']">
        <el-select v-model="queryParams.purchaseAuditStatus" placeholder="请选择采购审核状态" clearable class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.ERP_AUDIT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="销售审核" prop="saleAuditStatus" v-hasPermi="['erp:wholesale:importSale']">
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
<!--          v-hasPermi="['erp:purchase-order:create']"-->
<!--        >-->
<!--          <Icon icon="ep:plus" class="mr-5px" /> 新增-->
<!--        </el-button>-->
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['erp:wholesale:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button
          type="warning"
          plain
          @click="handleBatchAudit(10)"
          v-hasPermi="['erp:wholesale:update-status']"
          :disabled="selectionList.length === 0"
        >
          <Icon icon="ep:close" class="mr-5px" /> 批量反审核
        </el-button>
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          @click="handleDelete(selectionList.map((item) => item.id))"-->
<!--          v-hasPermi="['erp:purchase-order:delete']"-->
<!--          :disabled="selectionList.length === 0"-->
<!--        >-->
<!--          <Icon icon="ep:delete" class="mr-5px" /> 删除-->
<!--        </el-button>-->
      </el-form-item>
      <!-- 合计字段统一行 -->
      <el-form-item class="summary-row">
        <div class="summary-container" v-loading="summaryLoading" element-loading-text="正在计算合计...">
          <div class="summary-item">
            <span class="summary-label">采购单价合计：</span>
            <el-input v-model="totalPurchasePrice" disabled class="summary-input" placeholder="无数据" />
          </div>
          <div class="summary-item">
            <span class="summary-label">采购货拉拉费合计：</span>
            <el-input v-model="totalTruckFee" disabled class="summary-input" placeholder="无数据" />
          </div>
          <div class="summary-item">
            <span class="summary-label">采购物流费用合计：</span>
            <el-input v-model="totalLogisticsFee" disabled class="summary-input" placeholder="无数据" />
          </div>
          <div class="summary-item">
            <span class="summary-label">采购杂费合计：</span>
            <el-input v-model="totalOtherFees" disabled class="summary-input" placeholder="无数据" />
          </div>
          <div class="summary-item">
            <span class="summary-label">采购总额合计：</span>
            <el-input v-model="totalPurchaseAmount" disabled class="summary-input" placeholder="无数据" />
          </div>
          <div class="summary-item">
            <span class="summary-label">采购审核总额合计：</span>
            <el-input v-model="totalPurchaseAuditTotalAmount" disabled class="summary-input" placeholder="无数据" />
          </div>
        </div>
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
      <el-table-column min-width="140" label="订单编号" align="center" prop="no" :show-overflow-tooltip="false"/>
      <el-table-column label="物流单号" align="center" prop="logisticsNumber" width="140" :show-overflow-tooltip="false"/>
      <el-table-column label="收件姓名" align="center" prop="receiverName" width="120" :show-overflow-tooltip="false"/>
      <el-table-column label="联系电话" align="center" prop="receiverPhone" width="120" :show-overflow-tooltip="false"/>
      <el-table-column label="详细地址" align="center" prop="receiverAddress" min-width="200" :show-overflow-tooltip="false"/>
      <el-table-column label="备注信息" align="center" prop="remark" width="120" :show-overflow-tooltip="false"/>
      <el-table-column label="组品编号" align="center" prop="comboProductId" min-width="140" :show-overflow-tooltip="false"/>
      <el-table-column label="发货编码" align="center" prop="shippingCode" min-width="150" :show-overflow-tooltip="false"/>
      <el-table-column label="产品名称" align="center" prop="productName" min-width="350" :show-overflow-tooltip="false"/>
      <el-table-column label="产品规格" align="center" prop="productSpecification" width="120" :show-overflow-tooltip="false"/>
      <el-table-column label="产品数量" align="center" prop="productQuantity" width="100" :show-overflow-tooltip="false"/>
      <el-table-column label="售后状况" align="center" prop="afterSalesStatus" width="100" :show-overflow-tooltip="false"/>
      <el-table-column label="售后时间" align="center" prop="afterSalesTime" width="100" :formatter="dateFormatter2" :show-overflow-tooltip="false"/>
      <el-table-column label="采购人员" align="center" prop="purchaser" width="120" :show-overflow-tooltip="false"/>
      <el-table-column label="供应商名" align="center" prop="supplier" width="120" :show-overflow-tooltip="false"/>
      <el-table-column label="采购单价" align="center" prop="purchasePrice" width="100" :show-overflow-tooltip="false"/>
      <el-table-column label="采购货拉拉费" align="center" prop="truckFee" width="140" :show-overflow-tooltip="false"/>
      <el-table-column label="采购物流费用" align="center" prop="logisticsFee" width="140" :show-overflow-tooltip="false"/>
      <el-table-column label="采购杂费" align="center" prop="otherFees" width="100" :show-overflow-tooltip="false"/>
      <el-table-column label="采购总额" align="center" prop="totalPurchaseAmount" width="120" :show-overflow-tooltip="false"/>
      <el-table-column label="采购备注" align="center" prop="purchaseRemark" width="120" :show-overflow-tooltip="false"/>

      <el-table-column label="采购审核金额" align="center" prop="purchaseAuditTotalAmount" width="150" :show-overflow-tooltip="false"/>
      <el-table-column label="采购审核时间" align="center" prop="purchaseApprovalTime" width="130" :show-overflow-tooltip="false" :formatter="dateFormatter"/>
      <el-table-column label="采购反审核时间" align="center" prop="purchaseUnapproveTime" width="130" :show-overflow-tooltip="false" :formatter="dateFormatter"/>
      <el-table-column label="采购售后金额" align="center" prop="purchaseAfterSalesAmount" width="120" :show-overflow-tooltip="false"/>
      <el-table-column label="采购售后时间" align="center" prop="purchaseAfterSalesTime" width="120" :show-overflow-tooltip="false" :formatter="dateFormatter"/>
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
          <dict-tag :type="DICT_TYPE.ERP_AUDIT_STATUS" :value="scope.row.purchaseAuditStatus" />
        </template>
      </el-table-column>
      <el-table-column label="售后状态" align="center" width="120" fixed="right">
      <template #default="scope">
        <dict-tag
          :type="DICT_TYPE.ERP_SHOUHOU_STATUS"
          :value="scope.row.purchaseAfterSalesStatus"
        />
      </template>
    </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="220">
        <template #default="scope">
          <el-button
            link
            @click="openForm('detail', scope.row.id)"
            v-hasPermi="['erp:purchase-order:query']"
          >
            详情
          </el-button>
<!--          <el-button-->
<!--            link-->
<!--            type="primary"-->
<!--            @click="openForm('update', scope.row.id)"-->
<!--            v-hasPermi="['erp:purchase-order:update']"-->
<!--            :disabled="scope.row.status === 20"-->
<!--          >-->
<!--            编辑-->
<!--          </el-button>-->
          <el-button
            link
            type="primary"
            @click="handleAudit(scope.row.id)"
            v-hasPermi="['erp:wholesale:update-status-one']"
            v-if="scope.row.purchaseAuditStatus === 20"
          >
            反审批
          </el-button>
<!--          <el-button-->
<!--          link-->
<!--          type="warning"-->
<!--          @click="handleAfterSaleWithDetails(scope.row.id, 'afterSale')"-->
<!--          v-hasPermi="['erp:purchase-order:update-status']"-->
<!--          v-if="scope.row.purchaseAfterSalesStatus === 30"-->
<!--          >-->
<!--          售后-->
<!--         </el-button>-->
<!--         <el-button-->
<!--          link-->
<!--          type="warning"-->
<!--          @click="handleAfterSaleWithDetails(scope.row.id, 'antiAfterSale')"-->
<!--          v-hasPermi="['erp:purchase-order:update-status']"-->
<!--          v-if="scope.row.purchaseAfterSalesStatus === 40"-->
<!--          >-->
<!--          反售后-->
<!--          </el-button>-->
<!--          <el-button-->
<!--            link-->
<!--            type="danger"-->
<!--            @click="handleUpdateStatus(scope.row.id, 10)"-->
<!--            v-hasPermi="['erp:purchase-order:update-status']"-->
<!--            v-else-->
<!--          >-->
<!--            反审批-->
<!--          </el-button>-->
<!--          <el-button-->
<!--            link-->
<!--            type="danger"-->
<!--            @click="handleDelete([scope.row.id])"-->
<!--            v-hasPermi="['erp:purchase-order:delete']"-->
<!--          >-->
<!--            删除-->
<!--          </el-button>-->
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
import { PurchaseOrderApi, PurchaseOrderVO } from '@/api/erp/purchase/approvalorders'
import PurchaseOrderForm from './PurchaseOrderForm.vue'
import AfterSaleForm from './components/AfterSaleForm.vue'
import AuditForm from './components/AuditForm.vue'
import { ProductApi, ProductVO } from '@/api/erp/product/product'
import { UserVO } from '@/api/system/user'
import * as UserApi from '@/api/system/user'
import { SupplierApi, SupplierVO } from '@/api/erp/purchase/supplier'
import {dateFormatter, dateFormatter2} from "@/utils/formatTime";

/** ERP 销售订单列表 */
defineOptions({ name: 'ErpPurchaseApproval' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
// 新增四个合计字段的响应式声明（关键修改）
const totalPurchasePrice = ref<string>('')
const totalTruckFee = ref<string>('')
const totalLogisticsFee = ref<string>('')
const totalOtherFees = ref<string>('')
const totalPurchaseAmount = ref<string>('')
const totalPurchaseAuditTotalAmount = ref<string>('')
const loading = ref(true) // 列表的加载中
const list = ref<PurchaseOrderVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

// 新增合计数据加载状态
const summaryLoading = ref(false)

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  no: undefined,
  logisticsNumber: undefined,
  receiverName: undefined,
  receiverPhone: undefined,
  receiverAddress: undefined,
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
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const productList = ref<ProductVO[]>([]) // 产品列表
const supplierList = ref<SupplierVO[]>([]) // 供应商列表
const userList = ref<UserVO[]>([]) // 用户列表

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PurchaseOrderApi.getPurchaseReviewedOrderPage(queryParams)
    list.value = data.pageResult.list
    total.value = data.pageResult.total
  } finally {
    loading.value = false
  }
}

/** 获取合计数据 */
const getSummaryData = async () => {
  summaryLoading.value = true
  try {
    const data = await PurchaseOrderApi.getPurchaseReviewedOrderSummary(queryParams)
    totalPurchasePrice.value = data.totalPurchasePrice?.toFixed(2) || ''
    totalTruckFee.value = data.totalTruckFee?.toFixed(2) || ''
    totalLogisticsFee.value = data.totalLogisticsFee?.toFixed(2) || ''
    totalOtherFees.value = data.totalOtherFees?.toFixed(2) || ''
    totalPurchaseAmount.value = data.totalPurchaseAmount?.toFixed(2) || ''
    totalPurchaseAuditTotalAmount.value = data.totalPurchaseAuditTotalAmount?.toFixed(2) || ''
  } finally {
    summaryLoading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
  getSummaryData()
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
//     await PurchaseOrderApi.deletePurchaseOrder(ids)
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
//     await PurchaseOrderApi.updatePurchaseOrderStatus(id, status)
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
// const handleAfterSaleWithDetails = (id: number) => {
//   afterSaleFormRef.value.open(id)
// }
const handleAfterSaleWithDetails = (id: number, operationType: 'afterSale' | 'antiAfterSale') => {
  afterSaleFormRef.value.open(id, operationType)  // 传递操作类型给弹窗
}

/** 批量审核操作 */
const handleBatchAudit = async (purchaseAuditStatus: number) => {
  try {
    const ids = selectionList.value.map(item => item.id)
    const statusText = purchaseAuditStatus === 20 ? '审核' : '反审核'
    await message.confirm(`确定${statusText}选中的 ${ids.length} 条记录吗？`)

    await PurchaseOrderApi.batchUpdatePurchaseAuditStatus(ids, purchaseAuditStatus)
    message.success(`${statusText}成功`)

    // 刷新列表并清空选择
    await Promise.all([
      getList(),
      getSummaryData()
    ])
    selectionList.value = []
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await PurchaseOrderApi.exportPurchaseOrder3(queryParams)
    download.excel(data, '批发订单.xlsx')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 选中操作 */
const selectionList = ref<PurchaseOrderVO[]>([])
const handleSelectionChange = (rows: PurchaseOrderVO[]) => {
  selectionList.value = rows
}

/** 初始化 **/
onMounted(async () => {
  await Promise.all([
    getList(),
    getSummaryData()
  ])
  // 加载产品、仓库列表、供应商
  productList.value = await ProductApi.getProductSimpleList()
  supplierList.value = await SupplierApi.getSupplierSimpleList()
  userList.value = await UserApi.getSimpleUserList()
})
</script>

<style scoped>
.summary-row {
  margin-top: 10px;
  margin-bottom: 15px;
}

.summary-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.summary-item {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.summary-label {
  font-weight: 500;
  color: #606266;
  margin-right: 8px;
  font-size: 14px;
  white-space: nowrap;
}

.summary-input {
  width: 120px;
}

.summary-input :deep(.el-input__inner) {
  font-weight: 500;
  color: #409eff;
  text-align: right;
}
</style>
