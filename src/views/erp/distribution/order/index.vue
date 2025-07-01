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
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['erp:distribution:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="primary"
          plain
          @click="handleCopyCreate"
          v-hasPermi="['erp:distribution:copycreate']"
          :disabled="selectionList.length !== 1"
        >
          <Icon icon="ep:copy-document" class="mr-5px" /> 复制新增
        </el-button>
        <el-button
          type="warning"
          plain
          @click="handleImport"
          v-hasPermi="['erp:distribution:import']"
        >
          <Icon icon="ep:upload" class="mr-5px" /> 导入
        </el-button>
        <el-button
          type="info"
          plain
          @click="handleLogisticsImport"
          v-hasPermi="['erp:distribution:importLogistics']"
        >
          <Icon icon="ep:truck" class="mr-5px" /> 物流信息导入
        </el-button>
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          @click="handleBasicExport"-->
<!--          :loading="basicExportLoading"-->
<!--          v-hasPermi="['erp:distribution:importBasic']"-->
<!--        >-->
<!--          <Icon icon="ep:download" class="mr-5px" /> 基础导出-->
<!--        </el-button>-->
        <el-button
          type="success"
          plain
          @click="handlePurchaseExport"
          :loading="purchaseExportLoading"
          v-hasPermi="['erp:distribution:importPurchase']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 采购导出
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleSaleExport"
          :loading="saleExportLoading"
          v-hasPermi="['erp:distribution:importSale']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 出货导出
        </el-button>
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          @click="handleShipExport"-->
<!--          :loading="shipExportLoading"-->
<!--          v-hasPermi="['erp:distribution:importShip']"-->
<!--        >-->
<!--          <Icon icon="ep:download" class="mr-5px" /> 发货导出-->
<!--        </el-button>-->

        <el-button
          type="danger"
          plain
          @click="handleDelete(selectionList.map((item) => item.id))"
          v-hasPermi="['erp:distribution:delete']"
          :disabled="selectionList.length === 0"
        >
          <Icon icon="ep:delete" class="mr-5px" /> 删除
        </el-button>
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
      <el-table-column label="订单编号" align="center" prop="no"  min-width="140" :show-overflow-tooltip="false"/>
      <el-table-column label="订单号" align="center" prop="orderNumber"  min-width="140" :show-overflow-tooltip="false"/>
      <el-table-column label="物流公司" align="center" prop="logisticsCompany" :show-overflow-tooltip="false"/>
      <el-table-column label="物流单号" align="center" prop="trackingNumber" :show-overflow-tooltip="false"/>
      <el-table-column label="收件姓名" align="center" prop="receiverName" :show-overflow-tooltip="false"/>
      <el-table-column label="联系电话" align="center" prop="receiverPhone" :show-overflow-tooltip="false"/>
      <el-table-column label="详细地址" align="center" prop="receiverAddress" :show-overflow-tooltip="false"/>
      <el-table-column label="产品名称" align="center" prop="productName" min-width="140" :show-overflow-tooltip="false"/>

      <el-table-column label="产品规格" align="center" prop="productSpecification" :show-overflow-tooltip="false"/>
      <el-table-column label="产品数量" align="center" prop="productQuantity" :show-overflow-tooltip="false"/>
<!--      <el-table-column label="出货单价" align="center" prop="salePrice" />-->
<!--      <el-table-column label="出货总额" align="center" prop="totalSaleAmount" />-->

<!--      <el-table-column label="状态" align="center" fixed="right" width="70" prop="status">-->
<!--        <template #default="scope">-->
<!--          <dict-tag :type="DICT_TYPE.ERP_AUDIT_STATUS" :value="scope.row.purchaseAuditStatus === 20 && scope.row.saleAuditStatus === 20 ? 20 : 10"  />-->
<!--        </template>-->
<!--      </el-table-column>-->
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

      <el-table-column label="审核状态" align="center" fixed="right" width="120" prop="status">
        <template #default="scope">
          <div class="flex flex-col gap-1">
            <div class="flex items-center">
              <span class="w-16 text-right">采购:</span>
              <dict-tag
                :type="DICT_TYPE.ERP_AUDIT_STATUS"
                :value="scope.row.purchaseAuditStatus"
                size="small"
              />
            </div>
            <div class="flex items-center">
              <span class="w-16 text-right">销售:</span>
              <dict-tag
                :type="DICT_TYPE.ERP_AUDIT_STATUS"
                :value="scope.row.saleAuditStatus"
                size="small"
              />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="220">
        <template #default="scope">
          <el-button
            link
            @click="openForm('detail', scope.row.id)"
            v-hasPermi="['erp:distribution:query']"
          >
            详情
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['erp:distribution:update']"
            :disabled="scope.row.status === 20"
          >
            编辑
          </el-button>
<!--          <el-button-->
<!--            link-->
<!--            type="primary"-->
<!--            @click="handleUpdateStatus(scope.row.id, 20)"-->
<!--            v-hasPermi="['erp:purchase-order:update-status']"-->
<!--            v-if="scope.row.status === 10"-->
<!--          >-->
<!--            审批-->
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
          <el-button
            link
            type="danger"
            @click="handleDelete([scope.row.id])"
            v-hasPermi="['erp:distribution:delete']"
          >
            删除
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
  <DistributionImportForm ref="importFormRef" @success="getList" />
  <DistributionLogisticsImportForm ref="logisticsImportFormRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import {dateFormatter, dateFormatter2} from '@/utils/formatTime'
import download from '@/utils/download'
import { ErpDistributionApi, ErpDistributionVO } from '@/api/erp/distribution'
import PurchaseOrderForm from './PurchaseOrderForm.vue'

import DistributionImportForm from './components/DistributionImportForm.vue'
import DistributionLogisticsImportForm from './components/DistributionLogisticsImportForm.vue'

/** ERP 销售订单列表 */
defineOptions({ name: 'ErpdistributionOrder' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ErpDistributionVO[]>([]) // 列表的数据
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
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const basicExportLoading = ref(false) // 基础导出的加载中
const purchaseExportLoading = ref(false) // 采购导出的加载中
const saleExportLoading = ref(false) // 出货导出的加载中
const shipExportLoading = ref(false) // 发货导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ErpDistributionApi.getErpDistributionPage(queryParams)

    list.value = data.list
    total.value = data.total
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

/** 复制新增操作 */
const handleCopyCreate = () => {
  if (selectionList.value.length !== 1) {
    message.warning('请选择一条数据进行复制')
    return
  }
  // 获取完整数据，确保所有字段都有
  ErpDistributionApi.getErpDistribution(selectionList.value[0].id).then(data => {
    formRef.value.open('create', undefined, data)
  }).catch(error => {
    message.error('获取数据失败，请重试')
  })
}

/** 删除按钮操作 */
const handleDelete = async (ids: number[]) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ErpDistributionApi.deleteErpDistribution(ids)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
    selectionList.value = selectionList.value.filter((item) => !ids.includes(item.id))
  } catch {}
}

// /** 审批/反审批操作 */
// const handleUpdateStatus = async (id: number, status: number) => {
//   try {
//     // 审批的二次确认
//     await message.confirm(`确定${status === 20 ? '审批' : '反审批'}该订单吗？`)
//     // 发起审批
//     await ErpDistributionApi.updatePurchaseOrderStatus(id, status)
//     message.success(`${status === 20 ? '审批' : '反审批'}成功`)
//     // 刷新列表
//     await getList()
//   } catch {}
// }

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
     const data = await ErpDistributionApi.exportErpDistribution(queryParams)
     download.excel(data, '代发订单.xlsx')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 基础导出按钮操作 */
const handleBasicExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    basicExportLoading.value = true
    const data = await ErpDistributionApi.exportBasicExcel(queryParams)
    download.excel(data, '代发基础信息.xlsx')
  } catch {
  } finally {
    basicExportLoading.value = false
  }
}

/** 采购导出按钮操作 */
const handlePurchaseExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    purchaseExportLoading.value = true
    const data = await ErpDistributionApi.exportPurchaseExcel(queryParams)
    download.excel(data, '代发采购信息.xlsx')
  } catch {
  } finally {
    purchaseExportLoading.value = false
  }
}

/** 出货导出按钮操作 */
const handleSaleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    saleExportLoading.value = true
    const data = await ErpDistributionApi.exportSaleExcel(queryParams)
    download.excel(data, '代发出货信息.xlsx')
  } catch {
  } finally {
    saleExportLoading.value = false
  }
}

/** 发货导出按钮操作 */
const handleShipExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    shipExportLoading.value = true
    const data = await ErpDistributionApi.exportShipExcel(queryParams)
    download.excel(data, '代发发货信息.xlsx')
  } catch {
  } finally {
    shipExportLoading.value = false
  }
}

// 添加导入处理方法
const importFormRef = ref()

const handleImport = () => {
  importFormRef.value.open()
}

// 添加物流信息导入处理方法
const logisticsImportFormRef = ref()

const handleLogisticsImport = () => {
  logisticsImportFormRef.value.open()
}

/** 选中操作 */
const selectionList = ref<ErpDistributionVO[]>([])
const handleSelectionChange = (rows: ErpDistributionVO[]) => {
  selectionList.value = rows
}

/** 初始化 **/
onMounted(async () => {
  await getList()
})
</script>
