<template>
  <ContentWrap>
    <!-- 功能说明提示 -->


    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="80px"
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
      <el-form-item label="账单名称" prop="billName">
        <el-input
          v-model="queryParams.billName"
          placeholder="请输入账单名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="收入支出" prop="incomeExpense">
        <el-select
          v-model="queryParams.incomeExpense"
          placeholder="请选择收入支出"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.ERP_FINANCE_INCOME_EXPENSE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          >
            <div class="flex items-center">
              <Icon
                :icon="dict.value === 1 ? 'ep:top' : 'ep:bottom'"
                :class="dict.value === 1 ? 'mr-2 text-green-600' : 'mr-2 text-red-600'"
              />
              <span :class="dict.value === 1 ? 'text-green-700' : 'text-red-700'">
                {{ dict.label }}
              </span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="收付类目" prop="category">
        <el-select
          v-model="queryParams.category"
          placeholder="请选择收付类目"
          clearable
          class="!w-240px"
          filterable
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.ERP_FINANCE_CATEGORY)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收付账号" prop="account">
        <el-select
          v-model="queryParams.account"
          placeholder="请选择收付账号"
          clearable
          class="!w-240px"
        >
          <el-option label="微信" value="微信" />
          <el-option label="支付宝" value="支付宝" />
          <el-option label="银行卡" value="银行卡" />
        </el-select>
      </el-form-item>
      <el-form-item label="账单状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择账单状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.ERP_FINANCE_BILL_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          >
            <div class="flex items-center">
              <Icon
                :icon="dict.value === 1 ? 'ep:clock' : 'ep:check'"
                :class="dict.value === 1 ? 'mr-2 text-orange-500' : 'mr-2 text-green-600'"
              />
              <span :class="dict.value === 1 ? 'text-orange-600' : 'text-green-700'">
                {{ dict.label }}
              </span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus">
        <el-select
          v-model="queryParams.auditStatus"
          placeholder="请选择审核状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.ERP_AUDIT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
      <el-form-item label="审核人员" prop="auditor">
        <el-input
          v-model="queryParams.auditor"
          placeholder="请输入审核人员"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="下单日期" prop="orderDate">
        <el-date-picker
          v-model="queryParams.orderDate"
          value-format="YYYY-MM-DD"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
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
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="审核时间" prop="auditTime">
        <el-date-picker
          v-model="queryParams.auditTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['erp:finance:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="primary"
          plain
          @click="handleCopyCreate"
          v-hasPermi="['erp:finance:create']"
          :disabled="selectionList.length !== 1"
        >
          <Icon icon="ep:document-copy" class="mr-5px" /> 复制新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleBatchAudit(20)"
          v-hasPermi="['erp:finance:audit']"
          :disabled="selectionList.length === 0"
        >
          <Icon icon="ep:check" class="mr-5px" /> 批量审核
        </el-button>
        <el-button
          type="warning"
          plain
          @click="handleBatchUnaudit()"
          v-hasPermi="['erp:finance:unaudit']"
          :disabled="selectionList.length === 0"
        >
          <Icon icon="ep:close" class="mr-5px" /> 批量反审核
        </el-button>
        <el-button
          type="danger"
          plain
          @click="handleDelete(selectionList.map((row) => row.id))"
          v-hasPermi="['erp:finance:delete']"
          :disabled="selectionList.length === 0"
        >
          <Icon icon="ep:delete" class="mr-5px" /> 删除
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['erp:finance:export']"
        >
          <Icon icon="ep:download" />
          导出
        </el-button>
        <el-button
          type="info"
          plain
          @click="importFormRef?.open()"
          v-hasPermi="['erp:finance:import']"
        >
          <Icon icon="ep:upload" />
          导入
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
      :row-style="{height: '70px'}"
      :cell-style="{padding: '8px 0'}"
    >
      <el-table-column width="30" label="选择" type="selection" />
      <el-table-column label="编号" align="center" prop="no" min-width="140"  :show-overflow-tooltip="false"/>
      <el-table-column label="凭证图片" align="center" prop="carouselImages" width="100">
        <template #default="scope">
          <div v-if="getImageUrls(scope.row.carouselImages).length > 0" class="relative">
            <el-image
              :src="getImageUrls(scope.row.carouselImages)[0]"
              :preview-src-list="getImageUrls(scope.row.carouselImages)"
              class="w-10 h-10 rounded"
              fit="cover"
              preview-teleported
            />
            <el-badge
              v-if="getImageUrls(scope.row.carouselImages).length > 1"
              :value="getImageUrls(scope.row.carouselImages).length"
              class="absolute -top-2 -right-2"
              type="primary"
            />
          </div>
          <div v-else class="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
            <Icon icon="ep:picture" class="text-gray-400" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="账单名称" align="center" prop="billName" min-width="120" />
      <el-table-column label="收付金额" align="center" prop="amount" width="120">
        <template #default="scope">
          <span class="font-semibold">
            {{ formatFinanceAmount(scope.row.amount) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="收入支出" align="center" prop="incomeExpense" width="100">
        <template #default="scope">
          <div class="flex items-center justify-center">
            <Icon
              :icon="scope.row.incomeExpense === 1 ? 'ep:top' : 'ep:bottom'"
              :class="scope.row.incomeExpense === 1 ? 'mr-1 text-green-600' : 'mr-1 text-red-600'"
            />
            <span
              :class="scope.row.incomeExpense === 1 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'"
            >
              <dict-tag :type="DICT_TYPE.ERP_FINANCE_INCOME_EXPENSE" :value="scope.row.incomeExpense" />
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="收付类目" align="center" prop="category" width="120">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ERP_FINANCE_CATEGORY" :value="scope.row.category" />
        </template>
      </el-table-column>
      <el-table-column label="收付账号" align="center" prop="account" width="100" />
      <el-table-column label="账单状态" align="center" prop="status" width="100">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ERP_FINANCE_BILL_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="下单日期"
        align="center"
        prop="orderDate"
        :formatter="dateFormatter"
        width="120px"
      />
      <el-table-column label="审核状态" align="center" prop="auditStatus" width="100">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ERP_AUDIT_STATUS" :value="scope.row.auditStatus" />
        </template>
      </el-table-column>
      <el-table-column label="创建人员" align="center" prop="creator" width="100" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="审核人员" align="center" prop="auditor" width="100" />
      <el-table-column
        label="审核时间"
        align="center"
        prop="auditTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" fixed="right" width="240">
        <template #default="scope">
          <el-button
            link
            @click="openForm('detail', scope.row.id)"
            v-hasPermi="['erp:finance:query']"
          >
            详情
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['erp:finance:update']"
            :disabled="scope.row.auditStatus === 20"
          >
            编辑
          </el-button>
          <el-button
            link
            type="success"
            @click="handleCopyCreateSingle(scope.row)"
            v-hasPermi="['erp:finance:create']"
          >
            复制
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['erp:finance:delete']"
            :disabled="scope.row.auditStatus === 20"
          >
            删除
          </el-button>
          <el-button
            v-if="scope.row.auditStatus === 10"
            link
            type="success"
            @click="handleAudit([scope.row.id], 20)"
            v-hasPermi="['erp:finance:audit']"
          >
            审核
          </el-button>
          <el-button
            v-if="scope.row.auditStatus === 20"
            link
            type="warning"
            @click="handleUnaudit([scope.row.id])"
            v-hasPermi="['erp:finance:unaudit']"
          >
            反审核
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

  <!-- 表单弹窗：添加/修改 -->
  <FinanceForm ref="formRef" @success="getList" />
  <!-- 导入对话框 -->
  <FinanceImportForm ref="importFormRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as ErpFinanceApi from '@/api/erp/finance'
import FinanceForm from './FinanceForm.vue'
import { DICT_TYPE, getIntDictOptions, getStrDictOptions } from '@/utils/dict'
import UploadImgs from '@/components/UploadFile/src/UploadImgs.vue'
import FinanceImportForm from './FinanceImportForm.vue'

// 财务金额格式化函数 - 直接显示数值，保留2位小数
const formatFinanceAmount = (amount: number | string | undefined): string => {
  if (typeof amount === 'undefined' || amount === null) return '0.00'
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

/** ERP 财务记录列表 */
defineOptions({ name: 'ErpFinanceRecord' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ErpFinanceApi.ErpFinanceVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  no: undefined,
  billName: undefined,
  incomeExpense: undefined,
  category: undefined,
  account: undefined,
  status: undefined,
  auditStatus: undefined,
  creator: undefined,
  auditor: undefined,
  orderDate: [],
  createTime: [],
  auditTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ErpFinanceApi.getFinancePage(queryParams)
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
const importFormRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ErpFinanceApi.deleteFinance([id])
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 审核操作 */
const handleAudit = async (ids: number[], auditStatus: number) => {
  try {
    await message.confirm('确认审核选中的记录吗？')
    await ErpFinanceApi.auditFinance(ids, auditStatus)
    message.success('审核成功')
    await getList()
  } catch {}
}

/** 反审核操作 */
const handleUnaudit = async (ids: number[]) => {
  try {
    await message.confirm('确认反审核选中的记录吗？')
    await ErpFinanceApi.unauditFinance(ids)
    message.success('反审核成功')
    await getList()
  } catch {}
}

/** 选中操作 */
const selectionList = ref<ErpFinanceApi.ErpFinanceVO[]>([])
const handleSelectionChange = (rows: ErpFinanceApi.ErpFinanceVO[]) => {
  selectionList.value = rows
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ErpFinanceApi.exportFinanceExcel(queryParams)
    download.excel(data, '财务记录.xlsx')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 批量审核操作 */
const handleBatchAudit = async (auditStatus: number) => {
  try {
    await message.confirm('确认审核选中的记录吗？')
    await ErpFinanceApi.auditFinance(selectionList.value.map(row => row.id), auditStatus)
    message.success('批量审核成功')
    await getList()
  } catch {}
}

/** 批量反审核操作 */
const handleBatchUnaudit = async () => {
  try {
    await message.confirm('确认反审核选中的记录吗？')
    await ErpFinanceApi.unauditFinance(selectionList.value.map(row => row.id))
    message.success('批量反审核成功')
    await getList()
  } catch {}
}

/** 复制新增操作 - 批量选择 */
const handleCopyCreate = () => {
  if (selectionList.value.length !== 1) {
    message.warning('请选择一条记录进行复制')
    return
  }
  const selectedRow = selectionList.value[0]
  formRef.value.open('copy', undefined, selectedRow)
}

/** 复制新增操作 - 单条记录 */
const handleCopyCreateSingle = (row: ErpFinanceApi.ErpFinanceVO) => {
  formRef.value.open('copy', undefined, row)
}

/** 初始化 **/
onMounted(() => {
  getList()
})

/** 获取图片URLs */
const getImageUrls = (carouselImages: string | undefined): string[] => {
  if (!carouselImages) return []
  return carouselImages.split(',').map(img => img.trim()).filter(img => img)
}
</script>
