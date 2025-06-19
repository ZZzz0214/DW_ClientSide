<template>
  <div>
    <!-- 功能说明提示 -->
    <!-- 余额概览卡片 -->
    <ContentWrap>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <!-- 微信余额 -->
        <el-card class="balance-card">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Icon icon="ep:chat-dot-round" class="text-2xl text-green-600" />
              </div>
              <div>
                <div class="text-gray-500 text-sm">微信余额</div>
                <div class="text-2xl font-bold text-green-600">
                  ¥{{ formatFinanceAmount(balanceSummary.wechatBalance || 0) }}
                </div>
              </div>
            </div>
            <el-button type="success" plain @click="openRechargeDialog('微信')">
              充值
            </el-button>
          </div>
          <div class="mt-2 text-xs text-gray-400">
            累计充值：¥{{ formatFinanceAmount(balanceSummary.wechatRecharge || 0) }}
          </div>
        </el-card>

        <!-- 支付宝余额 -->
        <el-card class="balance-card">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Icon icon="ep:money" class="text-2xl text-blue-600" />
              </div>
              <div>
                <div class="text-gray-500 text-sm">支付宝余额</div>
                <div class="text-2xl font-bold text-blue-600">
                  ¥{{ formatFinanceAmount(balanceSummary.alipayBalance || 0) }}
                </div>
              </div>
            </div>
            <el-button type="primary" plain @click="openRechargeDialog('支付宝')">
              充值
            </el-button>
          </div>
          <div class="mt-2 text-xs text-gray-400">
            累计充值：¥{{ formatFinanceAmount(balanceSummary.alipayRecharge || 0) }}
          </div>
        </el-card>

        <!-- 银行卡余额 -->
        <el-card class="balance-card">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <Icon icon="ep:credit-card" class="text-2xl text-orange-600" />
              </div>
              <div>
                <div class="text-gray-500 text-sm">银行卡余额</div>
                <div class="text-2xl font-bold text-orange-600">
                  ¥{{ formatFinanceAmount(balanceSummary.bankCardBalance || 0) }}
                </div>
              </div>
            </div>
            <el-button type="warning" plain @click="openRechargeDialog('银行卡')">
              充值
            </el-button>
          </div>
          <div class="mt-2 text-xs text-gray-400">
            累计充值：¥{{ formatFinanceAmount(balanceSummary.bankCardRecharge || 0) }}
          </div>
        </el-card>
      </div>

      <!-- 总余额统计 -->
      <el-card>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
              <Icon icon="ep:wallet" class="text-3xl text-white" />
            </div>
            <div>
              <div class="text-gray-500 text-sm">总余额</div>
              <div class="text-3xl font-bold text-purple-600">
                ¥{{ formatFinanceAmount(totalBalance) }}
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-gray-500 text-sm">累计充值</div>
            <div class="text-xl font-semibold text-gray-700">
              ¥{{ formatFinanceAmount(totalRecharge) }}
            </div>
          </div>
        </div>
      </el-card>
    </ContentWrap>

    <!-- 搜索和操作栏 -->
    <ContentWrap>


      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="90px"
      >
        <el-form-item label="编号" prop="no" >
          <el-input
            v-model="queryParams.no"
            placeholder="请输入编号"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"

          />
        </el-form-item>
        <el-form-item label="渠道类型" prop="channelType">
          <el-select
            v-model="queryParams.channelType"
            placeholder="请选择渠道类型"
            clearable
            class="!w-240px"
          >
            <el-option label="微信" value="微信" />
            <el-option label="支付宝" value="支付宝" />
            <el-option label="银行卡" value="银行卡" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作类型" prop="operationType">
          <el-select
            v-model="queryParams.operationType"
            placeholder="请选择操作类型"
            clearable
            class="!w-240px"
          >
            <el-option label="充值" :value="1" />
            <el-option label="消费" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="微信充值" prop="wechatRecharge">
          <el-input-number
            v-model="queryParams.wechatRecharge"
            :min="0"
            :precision="2"
            controls-position="right"
            placeholder="查找微信充值指定金额的记录"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="支付宝充值" prop="alipayRecharge">
          <el-input-number
            v-model="queryParams.alipayRecharge"
            :min="0"
            :precision="2"
            controls-position="right"
            placeholder="查找支付宝充值指定金额的记录"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="银行卡充值" prop="bankCardRecharge">
          <el-input-number
            v-model="queryParams.bankCardRecharge"
            :min="0"
            :precision="2"
            controls-position="right"
            placeholder="查找银行卡充值指定金额的记录"
            class="!w-240px"
          />
        </el-form-item>
<!--        <el-form-item label="微信余额" prop="wechatBalance">-->
<!--          <el-input-number-->
<!--            v-model="queryParams.wechatBalance"-->
<!--            :min="0"-->
<!--            :precision="2"-->
<!--            controls-position="right"-->
<!--            placeholder="查找微信余额为指定金额的记录"-->
<!--            class="!w-240px"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="支付宝余额" prop="alipayBalance">-->
<!--          <el-input-number-->
<!--            v-model="queryParams.alipayBalance"-->
<!--            :min="0"-->
<!--            :precision="2"-->
<!--            controls-position="right"-->
<!--            placeholder="查找支付宝余额为指定金额的记录"-->
<!--            class="!w-240px"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="银行卡余额" prop="bankCardBalance">-->
<!--          <el-input-number-->
<!--            v-model="queryParams.bankCardBalance"-->
<!--            :min="0"-->
<!--            :precision="2"-->
<!--            controls-position="right"-->
<!--            placeholder="查找银行卡余额为指定金额的记录"-->
<!--            class="!w-240px"-->
<!--          />-->
<!--        </el-form-item>-->
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
            placeholder="创建人员"
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
            class="!w-240px"
          />
        </el-form-item>

        <el-form-item label="审核人员" prop="auditor">
          <el-input
            v-model="queryParams.auditor"
            placeholder="审核人员"
            clearable
            @keyup.enter="handleQuery"
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
            v-hasPermi="['erp:finance-amount:create']"
          >
            <Icon icon="ep:plus" class="mr-5px" /> 新增
          </el-button>
          <el-button
            type="success"
            plain
            @click="handleBatchAudit(20)"
            v-hasPermi="['erp:finance-amount:audit']"
            :disabled="selectionList.length === 0"
          >
            <Icon icon="ep:check" class="mr-5px" /> 批量审核
          </el-button>
          <el-button
            type="warning"
            plain
            @click="handleBatchUnaudit()"
            v-hasPermi="['erp:finance-amount:unaudit']"
            :disabled="selectionList.length === 0"
          >
            <Icon icon="ep:close" class="mr-5px" /> 批量反审核
          </el-button>
          <el-button
            type="success"
            plain
            @click="refreshBalance"
            :loading="balanceLoading"
          >
            <Icon icon="ep:refresh" class="mr-5px" /> 刷新余额
          </el-button>
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['erp:finance-amount:export']"
          >
            <Icon icon="ep:download" />
            导出
          </el-button>
          <el-button
            type="info"
            plain
            @click="importFormRef?.open()"
            v-hasPermi="['erp:finance-amount:import']"
          >
            <Icon icon="ep:upload" />
            导入
          </el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 记录列表 -->
    <ContentWrap>
      <el-table
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        @selection-change="handleSelectionChange"
      >
        <el-table-column width="30" label="选择" type="selection" />
        <el-table-column label="编号" align="center" prop="no" min-width="140" :show-overflow-tooltip="false"/>
        <el-table-column label="凭证图片" align="center" prop="carouselImages" width="100">
          <template #default="scope">
            <div v-if="getImageList(scope.row.carouselImages).length > 0" class="relative">
              <el-image
                :src="getImageList(scope.row.carouselImages)[0]"
                :preview-src-list="getImageList(scope.row.carouselImages)"
                class="w-10 h-10 rounded"
                fit="cover"
                preview-teleported
              />
              <el-badge
                v-if="getImageList(scope.row.carouselImages).length > 1"
                :value="getImageList(scope.row.carouselImages).length"
                class="absolute -top-2 -right-2"
                type="primary"
              />
            </div>
            <div v-else class="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
              <Icon icon="ep:picture" class="text-gray-400" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="微信充值" align="center" width="100">
          <template #default="scope">
            <span v-if="scope.row.channelType === '微信' && scope.row.operationType === 1" class="text-green-600 font-medium">
              +{{ formatFinanceAmount(scope.row.amount || 0) }}
            </span>
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column label="支付宝充值" align="center" width="100">
          <template #default="scope">
            <span v-if="scope.row.channelType === '支付宝' && scope.row.operationType === 1" class="text-blue-600 font-medium">
              +{{ formatFinanceAmount(scope.row.amount || 0) }}
            </span>
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column label="银行卡充值" align="center" width="100">
          <template #default="scope">
            <span v-if="scope.row.channelType === '银行卡' && scope.row.operationType === 1" class="text-orange-600 font-medium">
              +{{ formatFinanceAmount(scope.row.amount || 0) }}
            </span>
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
<!--        <el-table-column label="微信余额" align="center" width="110">-->
<!--          <template #default="scope">-->
<!--            <span v-if="scope.row.channelType === '微信'" class="text-green-600 font-medium">-->
<!--              {{ formatFinanceAmount(scope.row.afterBalance || 0) }}-->
<!--            </span>-->
<!--            <span v-else class="text-gray-400">-</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="支付宝余额" align="center" width="120">-->
<!--          <template #default="scope">-->
<!--            <span v-if="scope.row.channelType === '支付宝'" class="text-blue-600 font-medium">-->
<!--              {{ formatFinanceAmount(scope.row.afterBalance || 0) }}-->
<!--            </span>-->
<!--            <span v-else class="text-gray-400">-</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="银行卡余额" align="center" width="120">-->
<!--          <template #default="scope">-->
<!--            <span v-if="scope.row.channelType === '银行卡'" class="text-orange-600 font-medium">-->
<!--              {{ formatFinanceAmount(scope.row.afterBalance || 0) }}-->
<!--            </span>-->
<!--            <span v-else class="text-gray-400">-</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="下单日期" align="center" prop="orderDate" :formatter="dateFormatter" width="120px" />
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
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['erp:finance-amount:update']"
              :disabled="scope.row.auditStatus === 20"
            >
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-hasPermi="['erp:finance-amount:delete']"
              :disabled="scope.row.auditStatus === 20"
            >
              删除
            </el-button>
            <el-button
              v-if="scope.row.auditStatus === 10"
              link
              type="success"
              @click="handleAudit([scope.row.id], 20)"
              v-hasPermi="['erp:finance-amount:audit']"
            >
              审核
            </el-button>
            <el-button
              v-if="scope.row.auditStatus === 20"
              link
              type="warning"
              @click="handleUnaudit([scope.row.id])"
              v-hasPermi="['erp:finance-amount:unaudit']"
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
    <FinanceAmountForm ref="formRef" @success="getList" />

    <!-- 充值弹窗 -->
    <RechargeDialog ref="rechargeDialogRef" @success="handleRechargeSuccess" />

    <!-- 导入对话框 -->
    <FinanceAmountImportForm ref="importFormRef" @success="getList" />
  </div>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import * as ErpFinanceApi from '@/api/erp/finance'
import FinanceAmountForm from './FinanceAmountForm.vue'
import RechargeDialog from './RechargeDialog.vue'
import FinanceAmountImportForm from './FinanceAmountImportForm.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import download from '@/utils/download'

// 财务金额格式化函数 - 直接显示数值，保留2位小数
const formatFinanceAmount = (amount: number | string | undefined): string => {
  if (typeof amount === 'undefined' || amount === null) return '0.00'
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

// 处理图片列表，确保按正确顺序显示
const getImageList = (carouselImages: string | string[]) => {
  if (!carouselImages) return []
  if (Array.isArray(carouselImages)) return carouselImages
  return carouselImages.split(',').filter(img => img.trim())
}

/** ERP 财务金额管理 */
defineOptions({ name: 'ErpFinanceAmount' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const balanceLoading = ref(false) // 余额刷新加载中
const list = ref<ErpFinanceApi.ErpFinanceAmountVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const balanceSummary = ref<ErpFinanceApi.ErpFinanceAmountVO>({} as ErpFinanceApi.ErpFinanceAmountVO) // 余额汇总

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  no: undefined,
  channelType: undefined,
  operationType: undefined,
  wechatRecharge: undefined,
  alipayRecharge: undefined,
  bankCardRecharge: undefined,
  wechatBalance: undefined,
  alipayBalance: undefined,
  bankCardBalance: undefined,
  orderDate: [],
  auditStatus: undefined,
  creator: undefined,
  auditor: undefined,
  createTime: [],
  auditTime: []
})
const queryFormRef = ref() // 搜索的表单

// 计算总余额和总充值
const totalBalance = computed(() => {
  return (balanceSummary.value.wechatBalance || 0) +
         (balanceSummary.value.alipayBalance || 0) +
         (balanceSummary.value.bankCardBalance || 0)
})

const totalRecharge = computed(() => {
  return (balanceSummary.value.wechatRecharge || 0) +
         (balanceSummary.value.alipayRecharge || 0) +
         (balanceSummary.value.bankCardRecharge || 0)
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ErpFinanceApi.getFinanceAmountPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 获取余额汇总 */
const getBalanceSummary = async () => {
  try {
    const data = await ErpFinanceApi.getUserBalanceSummary()
    balanceSummary.value = data
  } catch (error) {
    console.error('获取余额汇总失败:', error)
  }
}

/** 刷新余额 */
const refreshBalance = async () => {
  balanceLoading.value = true
  try {
    await getBalanceSummary()
    message.success('余额刷新成功')
  } finally {
    balanceLoading.value = false
  }
}

/** 处理充值成功 - 同时刷新余额和列表 */
const handleRechargeSuccess = async () => {
  balanceLoading.value = true
  try {
    // 同时刷新余额汇总和列表数据
    await Promise.all([getBalanceSummary(), getList()])
    message.success('充值成功，余额已更新')
  } catch (error) {
    console.error('刷新数据失败:', error)
  } finally {
    balanceLoading.value = false
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

/** 打开充值弹窗 */
const rechargeDialogRef = ref()
const openRechargeDialog = (channelType: string) => {
  rechargeDialogRef.value.open(channelType)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ErpFinanceApi.deleteFinanceAmount([id])
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 审核操作 */
const handleAudit = async (ids: number[], auditStatus: number) => {
  try {
    await message.confirm('确认审核选中的记录吗？')
    await ErpFinanceApi.auditFinanceAmount(ids, auditStatus)
    message.success('审核成功')
    await getList()
  } catch {}
}

/** 反审核操作 */
const handleUnaudit = async (ids: number[]) => {
  try {
    await message.confirm('确认反审核选中的记录吗？')
    await ErpFinanceApi.unauditFinanceAmount(ids)
    message.success('反审核成功')
    await getList()
  } catch {}
}

/** 批量审核操作 */
const handleBatchAudit = async (auditStatus: number) => {
  try {
    await message.confirm('确认审核选中的记录吗？')
    await ErpFinanceApi.auditFinanceAmount(selectionList.value.map(row => row.id), auditStatus)
    message.success('批量审核成功')
    await getList()
  } catch {}
}

/** 批量反审核操作 */
const handleBatchUnaudit = async () => {
  try {
    await message.confirm('确认反审核选中的记录吗？')
    await ErpFinanceApi.unauditFinanceAmount(selectionList.value.map(row => row.id))
    message.success('批量反审核成功')
    await getList()
  } catch {}
}

/** 选中操作 */
const selectionList = ref<ErpFinanceApi.ErpFinanceAmountVO[]>([])
const handleSelectionChange = (rows: ErpFinanceApi.ErpFinanceAmountVO[]) => {
  selectionList.value = rows
}

/** 初始化 **/
onMounted(async () => {
  await Promise.all([getList(), getBalanceSummary()])

  // 监听财务记录操作事件，自动刷新余额
  window.addEventListener('finance-balance-refresh', handleBalanceRefresh)
})

/** 组件卸载时移除事件监听 */
onUnmounted(() => {
  window.removeEventListener('finance-balance-refresh', handleBalanceRefresh)
})

/** 处理余额刷新事件 */
const handleBalanceRefresh = async () => {
  try {
    await getBalanceSummary()
    console.log('财务金额表余额已自动刷新')
  } catch (error) {
    console.error('自动刷新余额失败:', error)
  }
}

/** 导出操作 */
const exportLoading = ref(false)
const handleExport = async () => {
  exportLoading.value = true
  try {
    const data = await ErpFinanceApi.exportFinanceAmountExcel(queryParams)
    download.excel(data, '财务金额导出.xlsx')
    message.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    message.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

/** 导入操作 */
const importFormRef = ref()
</script>

<style scoped>
.balance-card {
  transition: all 0.3s ease;
}

.balance-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

:deep(.el-card__body) {
  padding: 20px;
}

/* 优化搜索表单标签显示 */
:deep(.el-form--inline .el-form-item__label) {
  white-space: nowrap;
  min-width: 90px;
  text-align: right;
  padding-right: 12px;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 24px;
  margin-bottom: 15px;
}
</style>
