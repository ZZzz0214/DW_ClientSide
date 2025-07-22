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
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['erp:wholesale:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="primary"
          plain
          @click="handleCopyCreate"
          v-hasPermi="['erp:wholesale:create']"
          :disabled="selectionList.length !== 1"
        >
          <Icon icon="ep:copy-document" class="mr-5px" /> 复制新增
        </el-button>
        <el-button
          type="warning"
          plain
          @click="handleImport"
          v-hasPermi="['erp:wholesale:import']"
        >
          <Icon icon="ep:upload" class="mr-5px" /> 导入
        </el-button>
<!--        &lt;!&ndash; 基础导出按钮 &ndash;&gt;-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          @click="handleBasicExport"-->
<!--          :loading="basicExportLoading"-->
<!--          v-hasPermi="['erp:wholesale:importBasic']"-->
<!--        >-->
<!--          <Icon icon="ep:download" class="mr-5px" /> 基础导出-->
<!--        </el-button>-->
        <!-- 采购导出按钮 -->
        <el-button
          type="success"
          plain
          @click="handlePurchaseExport"
          :loading="purchaseExportLoading"
          v-hasPermi="['erp:wholesale:importPurchase']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 采购导出
        </el-button>
        <!-- 出货导出按钮 -->
        <el-button
          type="success"
          plain
          @click="handleSaleExport"
          :loading="saleExportLoading"
          v-hasPermi="['erp:wholesale:importSale']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 出货导出
        </el-button>
<!--        &lt;!&ndash; 发货导出按钮 &ndash;&gt;-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          @click="handleShipExport"-->
<!--          :loading="shipExportLoading"-->
<!--          v-hasPermi="['erp:wholesale:importShip']"-->
<!--        >-->
<!--          <Icon icon="ep:download" class="mr-5px" /> 发货导出-->
<!--        </el-button>-->
        <el-button
          type="danger"
          plain
          @click="handleDelete(selectionList.map((item) => item.id))"
          v-hasPermi="['erp:wholesale:delete']"
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
      <el-table-column min-width="180" label="订单编号" align="center" prop="no" :show-overflow-tooltip="false"/>
      <el-table-column label="物流单号" align="center" prop="logisticsNumber"  :show-overflow-tooltip="false" />
      <el-table-column label="收件姓名" align="center" prop="receiverName"  :show-overflow-tooltip="false"/>
      <el-table-column label="联系电话" align="center" prop="receiverPhone" min-width="150" :show-overflow-tooltip="false"/>
      <el-table-column label="详细地址" align="center" prop="receiverAddress" min-width="200" :show-overflow-tooltip="false"/>
      <el-table-column label="产品名称" align="center" prop="productName" min-width="350" :show-overflow-tooltip="false"/>
      <el-table-column label="产品规格" align="center" prop="productSpecification" :show-overflow-tooltip="false"/>
      <el-table-column label="产品数量" align="center" prop="productQuantity" :show-overflow-tooltip="false"/>
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
            v-hasPermi="['erp:wholesale:query']"
          >
            详情
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['erp:wholesale:update']"
            :disabled="scope.row.status === 20"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete([scope.row.id])"
            v-hasPermi="['erp:wholesale:delete']"
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
  <WholesaleImportForm ref="importFormRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import {dateFormatter, dateFormatter2} from '@/utils/formatTime'
import download from '@/utils/download'
import { ErpWholesaleApi, ErpWholesaleVO } from '@/api/erp/wholesale'
import PurchaseOrderForm from './PurchaseOrderForm.vue'
import { ProductApi, ProductVO } from '@/api/erp/product/product'
import { UserVO } from '@/api/system/user'
import * as UserApi from '@/api/system/user'
import { SupplierApi, SupplierVO } from '@/api/erp/purchase/supplier'
import WholesaleImportForm from './components/WholesaleImportForm.vue'

/** ERP 批发订单列表 */
defineOptions({ name: 'ErpWholesaleOrder' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ErpWholesaleVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
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
const basicExportLoading = ref(false) // 基础导出的加载中
const purchaseExportLoading = ref(false) // 采购导出的加载中
const saleExportLoading = ref(false) // 出货导出的加载中
const shipExportLoading = ref(false) // 发货导出的加载中
const productList = ref<ProductVO[]>([]) // 产品列表
const supplierList = ref<SupplierVO[]>([]) // 供应商列表
const userList = ref<UserVO[]>([]) // 用户列表

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ErpWholesaleApi.getErpWholesalePage(queryParams)

    list.value = data.list
    total.value = data.total
    console.log("批发22222222222---")
    console.log(data)
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
  ErpWholesaleApi.getErpWholesale(selectionList.value[0].id).then(data => {
    console.log('获取完整数据：', data)
    formRef.value.open('create', undefined, data)
  }).catch(error => {
    console.error('获取数据失败', error)
    message.error('获取数据失败，请重试')
  })
}

/** 删除按钮操作 */
const handleDelete = async (ids: number[]) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ErpWholesaleApi.deleteErpWholesale(ids)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
    selectionList.value = selectionList.value.filter((item) => !ids.includes(item.id))
  } catch {}
}

/** 基础导出按钮操作 */
const handleBasicExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    basicExportLoading.value = true
    const data = await ErpWholesaleApi.exportBasicWholesale(queryParams)
    download.excel(data, '批发订单.xlsx')
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
    const data = await ErpWholesaleApi.exportPurchaseWholesale(queryParams)
    download.excel(data, '批发订单.xlsx')
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
    const data = await ErpWholesaleApi.exportSaleWholesale(queryParams)
    download.excel(data, '批发订单.xlsx')
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
    const data = await ErpWholesaleApi.exportShipWholesale(queryParams)
    download.excel(data, '批发订单.xlsx')
  } catch {
  } finally {
    shipExportLoading.value = false
  }
}

// 导入
const importFormRef = ref()

const handleImport = () => {
  importFormRef.value.open()
}

/** 选中操作 */
const selectionList = ref<ErpWholesaleVO[]>([])
const handleSelectionChange = (rows: ErpWholesaleVO[]) => {
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
