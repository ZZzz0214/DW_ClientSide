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

      <el-form-item label="出货备注" prop="saleRemark">
        <el-input
          v-model="queryParams.saleRemark"
          placeholder="请输入销售备注"
          clearable
          @keyup.enter="handleQuery"
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
          type="warning"
          plain
          @click="handleImport"
          v-hasPermi="['erp:distributionSaleAu:import']"
        >
          <Icon icon="ep:upload" class="mr-5px" /> 导入
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['erp:distributionSaleAu:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
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
        <el-button
          type="primary"
          plain
          @click="handleBatchAudit(20)"
          v-hasPermi="['erp:distributionSaleAu:update-sale-audit-status']"
        >
          <Icon icon="ep:check" class="mr-5px" /> 批量审核
        </el-button>
        <el-button
          type="warning"
          plain
          @click="handleBatchAfterSales(40)"
          v-hasPermi="['erp:distributionSaleAu:update-after-sales']"
          :disabled="selectionList.length === 0"
        >
          <Icon icon="ep:service" class="mr-5px" /> 批量售后
        </el-button>
        <el-button
          type="info"
          plain
          @click="handleBatchAfterSales(30)"
          v-hasPermi="['erp:distributionSaleAu:update-after-sales-re']"
          :disabled="selectionList.length === 0"
        >
          <Icon icon="ep:refresh-left" class="mr-5px" /> 批量反售后
        </el-button>
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          @click="handleBatchAudit(10)"-->
<!--          v-hasPermi="['erp:distribution:update-sale-audit-status']"-->
<!--          :disabled="selectionList.length === 0"-->
<!--        >-->
<!--          <Icon icon="ep:close" class="mr-5px" /> 批量反审核-->
<!--        </el-button>-->
      </el-form-item>
      <!-- 合计字段统一行 -->
      <el-form-item class="summary-row">
        <div class="summary-container">
          <div class="summary-item">
            <span class="summary-label">出货单价合计：</span>
            <el-input v-model="totalSalePrice" disabled class="summary-input" :placeholder="summaryLoading ? '' : '无数据'">
              <template #prefix v-if="summaryLoading">
                <Icon icon="ep:loading" class="is-loading" />
              </template>
            </el-input>
          </div>
          <div class="summary-item">
            <span class="summary-label">出货运费合计：</span>
            <el-input v-model="totalSaleShippingFee" disabled class="summary-input" :placeholder="summaryLoading ? '' : '无数据'">
              <template #prefix v-if="summaryLoading">
                <Icon icon="ep:loading" class="is-loading" />
              </template>
            </el-input>
          </div>
          <div class="summary-item">
            <span class="summary-label">出货杂费合计：</span>
            <el-input v-model="totalSaleOtherFees" disabled class="summary-input" :placeholder="summaryLoading ? '' : '无数据'">
              <template #prefix v-if="summaryLoading">
                <Icon icon="ep:loading" class="is-loading" />
              </template>
            </el-input>
          </div>
          <div class="summary-item">
            <span class="summary-label">出货总额合计：</span>
            <el-input v-model="totalSaleAmount" disabled class="summary-input" :placeholder="summaryLoading ? '' : '无数据'">
              <template #prefix v-if="summaryLoading">
                <Icon icon="ep:loading" class="is-loading" />
              </template>
            </el-input>
          </div>
          <div class="summary-item">
            <span class="summary-label">代发销售审核总额合计：</span>
            <el-input v-model="totalSaleAuditTotalAmount" disabled class="summary-input" :placeholder="summaryLoading ? '' : '无数据'">
              <template #prefix v-if="summaryLoading">
                <Icon icon="ep:loading" class="is-loading" />
              </template>
            </el-input>
          </div>
          <div class="summary-item">
            <span class="summary-label">出货售后审核费用合计：</span>
            <el-input v-model="totalSaleAfterSalesAmount" disabled class="summary-input" :placeholder="summaryLoading ? '' : '无数据'">
              <template #prefix v-if="summaryLoading">
                <Icon icon="ep:loading" class="is-loading" />
              </template>
            </el-input>
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
      ref="tableRef"
      :row-key="(row) => row.id"
    >
      <el-table-column width="30" label="选择" type="selection" />
        <el-table-column label="订单编号" prop="no" :show-overflow-tooltip="false" min-width="140"/>
        <el-table-column label="订单号" prop="orderNumber" :show-overflow-tooltip="false" min-width="140"/>
        <el-table-column label="物流公司" prop="logisticsCompany" :show-overflow-tooltip="false"/>
        <el-table-column label="物流单号" prop="trackingNumber" :show-overflow-tooltip="false" min-width="150"/>
        <el-table-column label="收件姓名" prop="receiverName" :show-overflow-tooltip="false"/>
        <el-table-column label="联系电话" prop="receiverPhone" :show-overflow-tooltip="false" min-width="140"/>
        <el-table-column label="详细地址" prop="receiverAddress" :show-overflow-tooltip="false" min-width="200"/>
        <el-table-column label="原表商品" prop="originalProductName" :show-overflow-tooltip="false" min-width="350"/>
        <el-table-column label="原表规格" prop="originalStandard" :show-overflow-tooltip="false"/>
        <el-table-column label="原表数量" prop="originalQuantity" :show-overflow-tooltip="false"/>
        <el-table-column label="备注信息" prop="remark" :show-overflow-tooltip="false"/>
        <el-table-column label="组品编号" prop="comboProductNo" :show-overflow-tooltip="false"  min-width="140"/>
        <el-table-column label="发货编码" prop="shippingCode" :show-overflow-tooltip="false" min-width="100"/>
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
            v-hasPermi="['erp:distributionSaleAu:update-sale-audit-status-one']"
            v-if="scope.row.saleAuditStatus === 10"
          >
            审批
          </el-button>
          <el-button
            link
            type="warning"
            @click="handleAfterSaleWithDetails(scope.row.id, 'afterSale')"
            v-hasPermi="['erp:distributionSaleAu:update-one']"
            v-if="scope.row.saleAfterSalesStatus === 30"
          >
            售后
          </el-button>
          <el-button
            link
            type="warning"
            @click="handleAfterSaleWithDetails(scope.row.id, 'antiAfterSale')"
            v-hasPermi="['erp:distributionSaleAu:update-one-re']"
            v-if="scope.row.saleAfterSalesStatus === 40"
          >
            反售后
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
      @pagination="getPageData"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <PurchaseOrderForm ref="formRef" @success="getList" />
  <AfterSaleForm ref="afterSaleFormRef" @success="getList" />
  <AuditForm ref="auditFormRef" @success="getList" />
  <SaleOrderImportForm ref="importFormRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import download from '@/utils/download'
import { SaleOrderApi, SaleOrderVO } from '@/api/erp/sale/approvalorder'
import PurchaseOrderForm from './PurchaseOrderForm.vue'
import AfterSaleForm from './components/AfterSaleForm.vue'
import AuditForm from './components/AuditForm.vue'
import SaleOrderImportForm from './components/SaleOrderImportForm.vue'
import { ProductApi, ProductVO } from '@/api/erp/product/product'
import { UserVO } from '@/api/system/user'
import * as UserApi from '@/api/system/user'
import { CustomerApi, CustomerVO } from '@/api/erp/sale/customer'
import {dateFormatter, dateFormatter2} from "@/utils/formatTime"
import { nextTick } from 'vue'

/** ERP 销售订单列表 */
defineOptions({ name: 'ErpSaleApproval' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

// 安全地重置表格状态
const safeReset = async () => {
  selectionList.value = []
  if (tableRef.value) {
    tableRef.value.clearSelection()
  }
  await nextTick()
}

const loading = ref(true) // 列表的加载中
const list = ref<SaleOrderVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const tableRef = ref() // el-table的引用
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
  saleAuditStatus: undefined,
  saleRemark: undefined
})
const totalSalePrice = ref<string>('')
const totalSaleShippingFee = ref<string>('')
const totalSaleOtherFees = ref<string>('')
const totalSaleAmount = ref<string>('')
const totalSaleAfterSalesAmount = ref<string>('')
const totalSaleAuditTotalAmount = ref<string>('')
const summaryLoading = ref(true) // 合计数据加载状态，初始为true
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const productList = ref<ProductVO[]>([]) // 产品列表
const customerList = ref<CustomerVO[]>([]) // 客户列表
const userList = ref<UserVO[]>([]) // 用户列表

/** 获取分页数据 */
const getPageData = async () => {
  loading.value = true
  try {
    // 清空当前列表，避免旧数据引用问题
    list.value = []
    // 安全重置表格状态
    await safeReset()

    // 只获取分页数据
    const data = await SaleOrderApi.getSaleOrderUnreviewedPage(queryParams)

    // 使用nextTick确保DOM已更新后再设置数据
    await nextTick(() => {
      list.value = data.pageResult.list || []
      total.value = data.pageResult.total
    })
  } catch (error) {
    console.error('获取分页数据失败:', error)
    message.error('获取数据失败，请刷新重试')
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

/** 获取合计数据 */
const getSummaryData = async () => {
  summaryLoading.value = true
  try {
    // 获取合计数据
    const data = await SaleOrderApi.getSaleOrderUnReviewedSummary(queryParams)
    totalSalePrice.value = data.totalSalePrice?.toFixed(2) || ''
    totalSaleShippingFee.value = data.totalSaleShippingFee?.toFixed(2) || ''
    totalSaleOtherFees.value = data.totalSaleOtherFees?.toFixed(2) || ''
    totalSaleAmount.value = data.totalSaleAmount?.toFixed(2) || ''
    totalSaleAfterSalesAmount.value = data.totalSaleAfterSalesAmount?.toFixed(2) || ''
    totalSaleAuditTotalAmount.value = data.totalSaleAuditTotalAmount?.toFixed(2) || ''
  } catch (error) {
    console.error('获取合计数据失败:', error)
  } finally {
    summaryLoading.value = false
  }
}

/** 查询列表（包含合计数据） */
const getList = async () => {
  await Promise.all([getPageData(), getSummaryData()])
}

/** 获取全部符合搜索条件的数据 */
const getAllOrderData = async () => {
  try {
    // 设置查询参数，只获取未审核的数据
    const allParams = {
      ...queryParams,
      saleAuditStatus: 10 // 10表示未审核状态
    }
    // 使用exportAllDistributions获取全部未审核数据
    const data = await SaleOrderApi.exportAllDistributions(allParams)
    return data.map((item: any) => ({
      id: item.id,
      totalSaleAmount: item.totalSaleAmount || 0
    }))
  } catch (error) {
    console.error('获取全部数据失败:', error)
    return []
  }
}

/** 搜索按钮操作 */
const handleQuery = async () => {
  queryParams.pageNo = 1
  // 安全重置表格状态
  await safeReset()
  getList() // 搜索时需要获取合计数据
}

/** 重置按钮操作 */
const resetQuery = async () => {
  queryFormRef.value.resetFields()
  // 安全重置表格状态
  await safeReset()
  handleQuery() // 重置时需要重新获取合计数据
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

const handleAfterSaleWithDetails = (id: number, operationType: 'afterSale' | 'antiAfterSale') => {
  afterSaleFormRef.value.open(id, operationType)  // 传递操作类型给弹窗
}

/** 导入按钮操作 */
const importFormRef = ref()
const handleImport = () => {
  importFormRef.value.open()
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await SaleOrderApi.exportSaleOrder(queryParams)
    download.excel(data, '代发订单.xlsx')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 批量审核操作 */
const handleBatchAudit = async (saleAuditStatus: number) => {
  try {
    const statusText = saleAuditStatus === 20 ? '审核' : '反审核'

    let batchData: any
    let confirmMessage: string

    if (selectionList.value.length > 0) {
      // 有选择数据时，传递选中的订单数据
      const orderData = selectionList.value.map(item => ({
        id: item.id,
        totalSaleAmount: item.totalSaleAmount || 0
      }))

      batchData = {
        orderData,
        saleAuditStatus,
        isSelectAll: false
      }

      confirmMessage = `确定${statusText}选中的 ${selectionList.value.length} 条记录吗？`
    } else {
      // 没有选择数据时，获取全部符合搜索条件的数据
      const orderData = await getAllOrderData()

      batchData = {
        orderData,
        saleAuditStatus,
        isSelectAll: true
      }

      confirmMessage = `当前没有选择数据，确定${statusText}当前搜索结果的所有 ${total.value} 条记录吗？`
    }

    if (batchData.orderData.length === 0) {
      message.warning('没有可操作的数据')
      return
    }

    await message.confirm(confirmMessage)

    // 安全重置表格状态
    await safeReset()

    loading.value = true
    await SaleOrderApi.batchUpdateSaleAuditStatus(batchData)
    message.success(`${statusText}成功`)

    // 刷新列表数据（批量审核后需要更新合计数据）
    await getList()
  } catch (error) {
    console.error('批量审核操作失败:', error)
    message.error('操作失败，请稍后重试')
  } finally {
    loading.value = false
    selectionList.value = []
  }
}

/** 批量售后操作 */
const handleBatchAfterSales = async (saleAfterSalesStatus: number) => {
  try {
    const ids = selectionList.value.map(item => item.id!)
    if (ids.length === 0) {
      message.warning('请至少选择一条记录')
      return
    }

    const statusText = saleAfterSalesStatus === 40 ? '售后' : '反售后'
    await message.confirm(`确定${statusText}选中的 ${ids.length} 条记录吗？`)

    // 安全重置表格状态
    await safeReset()

    loading.value = true
    await SaleOrderApi.batchUpdateSaleAfterSales(ids, saleAfterSalesStatus)
    message.success(`${statusText}成功`)

    // 刷新列表数据（批量售后后需要更新合计数据）
    await getList()
  } catch (error) {
    console.error('批量售后操作失败:', error)
    message.error('操作失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

/** 选中操作 */
const selectionList = ref<SaleOrderVO[]>([])
const handleSelectionChange = (rows: SaleOrderVO[]) => {
  selectionList.value = rows
}

/** 初始化 **/
onMounted(async () => {
  await getList() // 初始化时需要获取完整数据（包含合计）
  // 加载产品、仓库列表、客户
  productList.value = await ProductApi.getProductSimpleList()
 // customerList.value = await CustomerApi.getCustomerSimpleList()
  userList.value = await UserApi.getSimpleUserList()
})
// TODO 芋艿：可优化功能：列表界面，支持导入
// TODO 芋艿：可优化功能：详情界面，支持打印
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

.is-loading {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
