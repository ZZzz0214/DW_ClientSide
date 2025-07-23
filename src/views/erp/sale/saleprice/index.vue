<!-- 销售价格表 -->
<template>
  <ContentWrap>
    <!-- 搜索结果栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="编号" prop="no">
        <el-input
          v-model="queryParams.no"
          placeholder="请输入编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="组品编号" prop="groupProductNo">
        <el-input
          v-model="queryParams.groupProductNo"
          placeholder="请输入组品编号"
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
      <el-form-item label="产品简称" prop="productShortName">
        <el-input
          v-model="queryParams.productShortName"
          placeholder="请输入产品简称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="代发单价" prop="distributionPrice">
        <el-input-number
          v-model="queryParams.distributionPrice"
          :min="0"
          :precision="2"
          controls-position="right"
          placeholder="请输入代发单价"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="批发单价" prop="wholesalePrice">
        <el-input-number
          v-model="queryParams.wholesalePrice"
          :min="0"
          :precision="2"
          controls-position="right"
          placeholder="请输入批发单价"
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
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['erp:sale-price:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="primary"
          plain
          @click="openOrganize"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 整理
        </el-button>
        <el-button
          type="info"
          plain
          @click="openForm('copy')"
          :disabled="selectionList.length !== 1"
        >
          <Icon icon="ep:copy-document" class="mr-5px" /> 复制新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="openPriceQuoteDialog"
          v-hasPermi="['erp:sale-price:price']"
        >
          <Icon icon="ep:price-tag" class="mr-5px" /> 报价
        </el-button>
        <el-button
        type="warning"
        plain
        @click="handleImport"
        v-hasPermi="['erp:sale-price:import']"
      >
        <Icon icon="ep:upload" class="mr-5px" /> 导入
      </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['erp:sale-price:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button
          type="danger"
          plain
          @click="handleDelete(selectionList.map((item) => item.id))"
          v-hasPermi="['erp:sale-price:delete']"
          :disabled="selectionList.length === 0"
        >
          <Icon icon="ep:delete" class="mr-5px" /> 删除
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      @selection-change="handleSelectionChange"
    >
      <el-table-column width="30" label="选择" type="selection" />
      <!-- 编号 -->
      <el-table-column label="编号" align="center" prop="no" :show-overflow-tooltip="false" min-width="140"/>

      <!-- 组品编号 -->
      <el-table-column label="组品编号" align="center" prop="groupProductNo" :show-overflow-tooltip="false" min-width="140"/>

      <!-- 组品简称 -->
      <el-table-column label="产品名称" align="center" prop="productName" :show-overflow-tooltip="false" min-width="350"/>
      <el-table-column label="产品简称" align="center" prop="productShortName" :show-overflow-tooltip="false"/>
      <el-table-column label="客户名称" align="center" prop="customerName" :show-overflow-tooltip="false"/>

      <!-- 代发单价 -->
      <el-table-column label="代发单价" align="center" prop="distributionPrice" />

      <!-- 批发单价 -->
      <el-table-column label="批发单价" align="center" prop="wholesalePrice" />
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

      <!-- 备注信息 -->
<!--      <el-table-column label="备注信息" align="center" prop="remark" />-->

<!--      &lt;!&ndash; 运费类型 &ndash;&gt;-->
<!--      <el-table-column label="运费类型" align="center" prop="shippingFeeType">-->
<!--        <template #default="scope">-->
<!--          {{ getShippingFeeTypeLabel(scope.row.shippingFeeType) }}-->
<!--        </template>-->
<!--      </el-table-column>-->

      <!-- 运费信息 -->
<!--      <el-table-column label="运费类型" align="center" prop="shippingFeeType" />-->

      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <el-button
            link
            @click="openForm('detail',scope.row.id)"
            v-hasPermi="['erp:sale-price:query']"
          >
            详情
          </el-button>
          <el-button
            link
            type="info"
            @click="openForm('copy', scope.row.id)"
            v-hasPermi="['erp:sale-price:create']"
          >
            复制
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['erp:sale-price:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete([scope.row.id])"
            v-hasPermi="['erp:sale-price:delete']"
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
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 整理组件 -->
  <SalePriceOrganize ref="organizeRef" />

  <!-- 报价弹窗 -->
  <PriceQuoteDialog ref="priceQuoteDialogRef" />

  <!-- 表单弹窗：添加/修改 -->
  <SalePriceForm ref="formRef" @success="getList" />
  <SalePriceImportForm ref="importFormRef" @success="getList" />
</template>

<script setup lang="ts">
import download from '@/utils/download'
import { SalePriceApi, SalePriceVO } from '@/api/erp/sale/saleprice'
import { ref } from 'vue';
import SalePriceOrganize from './components/SalePriceOrganize.vue';
import PriceQuoteDialog from './components/PriceQuoteDialog.vue';
import SalePriceForm from './SalePriceForm.vue'
import {SaleOrderApi} from "@/api/erp/sale/orders";
import {dateFormatter} from "@/utils/formatTime";
import SalePriceImportForm from './components/SalePriceImportForm.vue'
/** ERP 销售价格表 */
defineOptions({ name: 'ErpSalePrice' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { push } = useRouter() // 路由跳转

const loading = ref(true) // 列表的加载中
const list = ref<SalePriceVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  no: undefined,
  groupProductNo: undefined,
  productName: undefined,
  productShortName: undefined,
  customerName: undefined,
  distributionPrice: undefined,
  wholesalePrice: undefined,
  creator: undefined,
  createTime: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

const organizeRef = ref(null); // 引用子组件
const priceQuoteDialogRef = ref(null); // 报价弹窗引用

// 打开整理弹窗
const openOrganize = () => {
  organizeRef.value.open();
};

// 打开报价弹窗
const openPriceQuoteDialog = () => {
  priceQuoteDialogRef.value.open();
};

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await SalePriceApi.getSalePricePage(queryParams)
    list.value = data.list
    total.value = data.total
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
  // 如果是复制模式且没有传入id，则使用选中列表的第一条数据
  if (type === 'copy' && !id && selectionList.value.length === 1) {
    id = selectionList.value[0].id;
  }
  formRef.value.open(type, id)
}


/** 删除按钮操作 */
const handleDelete = async (ids: number[]) => {
  try {
    await message.delConfirm()
    console.log("删除的id",ids)
    await SalePriceApi.deleteSalePrice(ids)
    message.success(t('common.delSuccess'))
    await getList()
    selectionList.value = selectionList.value.filter((item) => !ids.includes(item.id))
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    const data = await SalePriceApi.exportSalePrice(queryParams)
    download.excel(data, '销售价格.xlsx')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 导入操作 */
const importFormRef = ref()

const handleImport = () => {
  importFormRef.value.open()
}

/** 选中操作 */
const selectionList = ref<SalePriceVO[]>([])
const handleSelectionChange = (rows: SalePriceVO[]) => {
  selectionList.value = rows
}

onMounted(async () => {
  await getList(); // 获取列表数据
});
</script>
