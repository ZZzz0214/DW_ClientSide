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
      <el-form-item label="订单单号" prop="no">
        <el-input
          v-model="queryParams.no"
          placeholder="请输入订单单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="产品" prop="productId">
        <el-select
          v-model="queryParams.productId"
          clearable
          filterable
          placeholder="请选择产品"
          class="!w-240px"
        >
          <el-option
            v-for="item in productList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单时间" prop="orderTime">
        <el-date-picker
          v-model="queryParams.orderTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <el-select
          v-model="queryParams.supplierId"
          clearable
          filterable
          placeholder="请选择供供应商"
          class="!w-240px"
        >
          <el-option
            v-for="item in supplierList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建人" prop="creator">
        <el-select
          v-model="queryParams.creator"
          clearable
          filterable
          placeholder="请选择创建人"
          class="!w-240px"
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.nickname"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.ERP_AUDIT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="queryParams.remark"
          placeholder="请输入备注"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="入库数量" prop="inStatus">
        <el-select
          v-model="queryParams.inStatus"
          placeholder="请选择入库数量"
          clearable
          class="!w-240px"
        >
          <el-option label="未入库" value="0" />
          <el-option label="部分入库" value="1" />
          <el-option label="全部入库" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="退货数量" prop="returnStatus">
        <el-select
          v-model="queryParams.returnStatus"
          placeholder="请选择退货数量"
          clearable
          class="!w-240px"
        >
          <el-option label="未退货" value="0" />
          <el-option label="部分退货" value="1" />
          <el-option label="全部退货" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['erp:purchase-order:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['erp:unpurchaseorders:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button
          type="danger"
          plain
          @click="handleDelete(selectionList.map((item) => item.id))"
          v-hasPermi="['erp:purchase-order:delete']"
          :disabled="selectionList.length === 0"
        >
          <Icon icon="ep:delete" class="mr-5px" /> 删除
        </el-button>
      </el-form-item>
        <el-form-item>
                <!-- 新增四个合计字段显示框 -->
          <el-form-item label="批发采购单价合计" style="margin-left: 20px;" label-width="140px">
            <el-input v-model="totalPurchasePrice" disabled class="!w-120px" placeholder="无数据" />
          </el-form-item>
          <el-form-item label="批发采购货拉拉费合计" style="margin-left: 20px;" label-width="160px">
            <el-input v-model="totalTruckFee" disabled class="!w-120px" placeholder="无数据" />
          </el-form-item>
          <el-form-item label="批发采购物流费用合计" style="margin-left: 20px;" label-width="140px">
            <el-input v-model="totalLogisticsFee" disabled class="!w-120px" placeholder="无数据" />
          </el-form-item>
          <el-form-item label="批发采购杂费合计" style="margin-left: 20px;" label-width="140px">
            <el-input v-model="totalOtherFees" disabled class="!w-120px" placeholder="无数据" />
          </el-form-item>
          <el-form-item label="批发采购总额合计" style="margin-left: 20px;" label-width="140px">
            <el-input v-model="totalPurchaseAmount" disabled class="!w-120px" placeholder="无数据" />
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
      <el-table-column min-width="180" label="订单编号" align="center" prop="no" :show-overflow-tooltip="false"/>
      <el-table-column label="物流单号" align="center" prop="logisticsNumber" width="160" :show-overflow-tooltip="false"/>
      <el-table-column label="收件姓名" align="center" prop="receiverName" width="120" :show-overflow-tooltip="false"/>
      <el-table-column label="联系电话" align="center" prop="receiverPhone" width="120" :show-overflow-tooltip="false"/>
      <el-table-column label="详细地址" align="center" prop="receiverAddress" min-width="200" :show-overflow-tooltip="false"/>
      <el-table-column label="备注信息" align="center" prop="remark" width="120" :show-overflow-tooltip="false"/>
      <el-table-column label="组品编号" align="center" prop="comboProductId" width="100" :show-overflow-tooltip="false"/>
      <el-table-column label="发货编码" align="center" prop="shippingCode" width="120" :show-overflow-tooltip="false"/>
      <el-table-column label="产品名称" align="center" prop="productName" width="120" :show-overflow-tooltip="false"/>
      <el-table-column label="产品规格" align="center" prop="productSpecification" width="120" :show-overflow-tooltip="false"/>
      <el-table-column label="产品数量" align="center" prop="productQuantity" width="100" :show-overflow-tooltip="false"/>
      <el-table-column label="售后状况" align="center" prop="afterSalesStatus" width="100" :show-overflow-tooltip="false"/>
      <el-table-column label="售后时间" align="center" prop="afterSalesTime" width="100" :formatter="dateFormatter2" :show-overflow-tooltip="false"/>
      <el-table-column label="采购人员" align="center" prop="purchaser" width="120" :show-overflow-tooltip="false"/>
      <el-table-column label="供应商名" align="center" prop="supplier" width="120" :show-overflow-tooltip="false"/>
      <el-table-column label="采购单价" align="center" prop="purchasePrice" width="100" :show-overflow-tooltip="false"/>
      <el-table-column label="采购货拉拉费" align="center" prop="truckFee" width="100" :show-overflow-tooltip="false"/>
      <el-table-column label="采购物流费用" align="center" prop="logisticsFee" width="100" :show-overflow-tooltip="false"/>
      <el-table-column label="采购杂费" align="center" prop="otherFees" width="100" :show-overflow-tooltip="false"/>
      <el-table-column label="采购总额" align="center" prop="totalPurchaseAmount" width="120" :show-overflow-tooltip="false"/>
      <el-table-column label="采购备注" align="center" prop="purchaseRemark" width="120" :show-overflow-tooltip="false"/>
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
            v-hasPermi="['erp:purchase-order:update-status']"
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
import {dateFormatter2} from "@/utils/formatTime";

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
const loading = ref(true) // 列表的加载中
const list = ref<PurchaseOrderVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  no: undefined,
  supplierId: undefined,
  productId: undefined,
  orderTime: [],
  status: undefined,
  remark: undefined,
  creator: undefined,
  inStatus: undefined,
  returnStatus: undefined
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
    totalPurchasePrice.value = data.totalPurchasePrice?.toFixed(2) || ''
    totalTruckFee.value = data.totalTruckFee?.toFixed(2) || ''
    totalLogisticsFee.value = data.totalLogisticsFee?.toFixed(2) || ''
    totalOtherFees.value = data.totalOtherFees?.toFixed(2) || ''
    totalPurchaseAmount.value = data.totalPurchaseAmount?.toFixed(2) || ''
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
  await getList()
  // 加载产品、仓库列表、供应商
  productList.value = await ProductApi.getProductSimpleList()
  supplierList.value = await SupplierApi.getSupplierSimpleList()
  userList.value = await UserApi.getSimpleUserList()
})
</script>
