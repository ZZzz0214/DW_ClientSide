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
      <el-form-item label="客户" prop="customerId">
        <el-select
          v-model="queryParams.customerId"
          clearable
          filterable
          placeholder="请选择供客户"
          class="!w-240px"
        >
          <el-option
            v-for="item in customerList"
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
      <el-form-item label="出库数量" prop="outStatus">
        <el-select
          v-model="queryParams.outStatus"
          placeholder="请选择出库数量"
          clearable
          class="!w-240px"
        >
          <el-option label="未出库" value="0" />
          <el-option label="部分出库" value="1" />
          <el-option label="全部出库" value="2" />
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
          v-hasPermi="['erp:sale-order:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['erp:unsaleorder:export']"
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
        <el-button
          type="danger"
          plain
          @click="handleDelete(selectionList.map((item) => item.id))"
          v-hasPermi="['erp:sale-order:delete']"
          :disabled="selectionList.length === 0"
        >
          <Icon icon="ep:delete" class="mr-5px" /> 删除
        </el-button>
      </el-form-item>
      <el-form-item>
    <!-- 新增四个出货合计字段显示框 -->
    <el-form-item label="出货单价合计" style="margin-left: 20px;" label-width="100px">
      <el-input v-model="totalSalePrice" disabled class="!w-240px" placeholder="无数据" />
    </el-form-item>
    <el-form-item label="出货运费合计" style="margin-left: 20px;" label-width="100px">
      <el-input v-model="totalSaleShippingFee" disabled class="!w-240px" placeholder="无数据" />
    </el-form-item>
    <el-form-item label="出货杂费合计" style="margin-left: 20px;" label-width="100px">
      <el-input v-model="totalSaleOtherFees" disabled class="!w-240px" placeholder="无数据" />
    </el-form-item>
    <el-form-item label="出货总额合计" style="margin-left: 20px;" label-width="100px">
      <el-input v-model="totalSaleAmount" disabled class="!w-240px" placeholder="无数据" />
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
      <el-table-column label="订单编号" prop="no" :show-overflow-tooltip="false"/>
      <el-table-column label="订单号" prop="orderNumber" :show-overflow-tooltip="false"/>
      <el-table-column label="物流公司" prop="logisticsCompany" :show-overflow-tooltip="false"/>
      <el-table-column label="物流单号" prop="trackingNumber" :show-overflow-tooltip="false"/>
      <el-table-column label="收件姓名" prop="receiverName" :show-overflow-tooltip="false"/>
      <el-table-column label="联系电话" prop="receiverPhone" :show-overflow-tooltip="false"/>
      <el-table-column label="详细地址" prop="receiverAddress" :show-overflow-tooltip="false"/>
      <el-table-column label="原表商品" prop="originalProductName" :show-overflow-tooltip="false"/>
      <el-table-column label="原表规格" prop="originalStandard" :show-overflow-tooltip="false"/>
      <el-table-column label="原表数量" prop="originalQuantity" :show-overflow-tooltip="false"/>
      <el-table-column label="备注信息" prop="remark" :show-overflow-tooltip="false"/>
      <el-table-column label="组品编号" prop="comboProductId" :show-overflow-tooltip="false"/>
      <el-table-column label="发货编码" prop="shippingCode" :show-overflow-tooltip="false"/>
      <el-table-column label="产品名称" prop="productName" :show-overflow-tooltip="false"/>
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
      <el-table-column label="出货备注" prop="saleRemark" :show-overflow-tooltip="false"/>
      <el-table-column label="中转人员" prop="transferPerson" :show-overflow-tooltip="false"/>


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
            v-hasPermi="['erp:sale-order:update-status']"
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
import {dateFormatter2} from "@/utils/formatTime";

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
  customerId: undefined,
  productId: undefined,
  orderTime: [],
  status: undefined,
  remark: undefined,
  creator: undefined,
  outStatus: undefined,
  returnStatus: undefined
})
const totalSalePrice = ref<string>('')
const totalSaleShippingFee = ref<string>('')
const totalSaleOtherFees = ref<string>('')
const totalSaleAmount = ref<string>('')
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
