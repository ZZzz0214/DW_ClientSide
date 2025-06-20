<template>
  <el-dialog
    v-model="dialogVisible"
    title="报价设置"
    width="90%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <!-- 搜索区域 -->
    <el-form
      :model="queryParams"
      :inline="true"
      label-width="80px"
      class="mb-4"
    >
      <el-form-item label="组品编号" prop="groupProductId">
        <el-input
          v-model="queryParams.groupProductId"
          placeholder="请输入组品编号"
          clearable
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户名称"
          clearable
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 批量操作区域 -->
    <div class="mb-4">
      <el-button
        type="primary"
        :disabled="selectionList.length === 0"
        @click="openBatchPriceDialog"
      >
        <Icon icon="ep:price-tag" class="mr-5px" />
        批量设置价格
      </el-button>
      <span class="ml-2 text-gray-500">
        已选择 {{ selectionList.length }} 条记录
      </span>
    </div>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      @selection-change="handleSelectionChange"
      max-height="500"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column label="组品编号" prop="comboProductNo" width="120" />
      <el-table-column label="产品名称" prop="productName" width="180" />
      <el-table-column label="客户名称" prop="customerName" width="120" />
      
      <!-- 代发相关信息 -->
      <el-table-column label="代发信息" width="300">
        <template #default="scope">
          <div v-if="scope.row.distributionInfo">
            <div class="text-sm">
              <span class="font-medium">订单数: </span>{{ scope.row.distributionInfo.orderCount }}
              <span class="ml-2 font-medium">产品数: </span>{{ scope.row.distributionInfo.totalProductQuantity }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              时间: {{ formatDateRange(scope.row.distributionInfo.earliestCreateTime, scope.row.distributionInfo.latestCreateTime) }}
            </div>
            <div class="text-xs text-gray-500">
              订单: {{ scope.row.distributionInfo.orderNumbers?.slice(0, 2).join(', ') }}{{ scope.row.distributionInfo.orderNumbers?.length > 2 ? '...' : '' }}
            </div>
          </div>
          <span v-else class="text-gray-400">无代发订单</span>
        </template>
      </el-table-column>
      
      <!-- 批发相关信息 -->
      <el-table-column label="批发信息" width="300">
        <template #default="scope">
          <div v-if="scope.row.wholesaleInfo">
            <div class="text-sm">
              <span class="font-medium">订单数: </span>{{ scope.row.wholesaleInfo.orderCount }}
              <span class="ml-2 font-medium">产品数: </span>{{ scope.row.wholesaleInfo.totalProductQuantity }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              时间: {{ formatDateRange(scope.row.wholesaleInfo.earliestCreateTime, scope.row.wholesaleInfo.latestCreateTime) }}
            </div>
            <div class="text-xs text-gray-500">
              订单: {{ scope.row.wholesaleInfo.orderNumbers?.slice(0, 2).join(', ') }}{{ scope.row.wholesaleInfo.orderNumbers?.length > 2 ? '...' : '' }}
            </div>
          </div>
          <span v-else class="text-gray-400">无批发订单</span>
        </template>
      </el-table-column>
      
      <!-- 当前价格 -->
      <el-table-column label="当前价格" width="150">
        <template #default="scope">
          <div class="text-sm">
            <div>代发: {{ scope.row.currentDistributionPrice || '-' }}</div>
            <div>批发: {{ scope.row.currentWholesalePrice || '-' }}</div>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openSinglePriceDialog(scope.row)"
          >
            设置价格
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="mt-4">
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">关闭</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 批量设置价格弹窗 -->
  <el-dialog
    v-model="batchPriceDialogVisible"
    title="批量设置价格"
    width="600px"
    :close-on-click-modal="false"
  >
    <el-form :model="batchPriceForm" label-width="100px">
      <el-form-item label="组品编号">
        <el-input v-model="batchPriceForm.comboProductNo" disabled />
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input v-model="batchPriceForm.customerName" disabled />
      </el-form-item>
      <el-form-item label="代发单价">
        <el-input-number
          v-model="batchPriceForm.distributionPrice"
          :min="0"
          :precision="2"
          controls-position="right"
          placeholder="请输入代发单价"
          class="!w-full"
        />
      </el-form-item>
      <el-form-item label="批发单价">
        <el-input-number
          v-model="batchPriceForm.wholesalePrice"
          :min="0"
          :precision="2"
          controls-position="right"
          placeholder="请输入批发单价"
          class="!w-full"
        />
      </el-form-item>
      <el-form-item label="影响记录">
        <div class="text-sm text-gray-600">
          将为 {{ selectionList.length }} 个组品客户组合设置价格
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeBatchPriceDialog">取消</el-button>
        <el-button type="primary" @click="handleBatchSetPrice" :loading="batchSetLoading">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 单个设置价格弹窗 -->
  <el-dialog
    v-model="singlePriceDialogVisible"
    title="设置价格"
    width="600px"
    :close-on-click-modal="false"
  >
    <el-form :model="singlePriceForm" label-width="100px">
      <el-form-item label="组品编号">
        <el-input v-model="singlePriceForm.comboProductNo" disabled />
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input v-model="singlePriceForm.customerName" disabled />
      </el-form-item>
      
      <!-- 代发信息 -->
      <el-form-item label="代发信息" v-if="singlePriceForm.distributionInfo">
        <div class="text-sm text-gray-600">
          <div>订单数量: {{ singlePriceForm.distributionInfo.orderCount }}</div>
          <div>产品数量: {{ singlePriceForm.distributionInfo.totalProductQuantity }}</div>
          <div>时间范围: {{ formatDateRange(singlePriceForm.distributionInfo.earliestCreateTime, singlePriceForm.distributionInfo.latestCreateTime) }}</div>
          <el-tooltip effect="dark" placement="top" v-if="singlePriceForm.distributionInfo.orderNumbers?.length > 0">
            <template #content>
              <div>
                <div v-for="orderNo in singlePriceForm.distributionInfo.orderNumbers" :key="orderNo">{{ orderNo }}</div>
              </div>
            </template>
            <span class="cursor-pointer text-blue-500">查看订单详情</span>
          </el-tooltip>
        </div>
      </el-form-item>
      
      <!-- 批发信息 -->
      <el-form-item label="批发信息" v-if="singlePriceForm.wholesaleInfo">
        <div class="text-sm text-gray-600">
          <div>订单数量: {{ singlePriceForm.wholesaleInfo.orderCount }}</div>
          <div>产品数量: {{ singlePriceForm.wholesaleInfo.totalProductQuantity }}</div>
          <div>时间范围: {{ formatDateRange(singlePriceForm.wholesaleInfo.earliestCreateTime, singlePriceForm.wholesaleInfo.latestCreateTime) }}</div>
          <el-tooltip effect="dark" placement="top" v-if="singlePriceForm.wholesaleInfo.orderNumbers?.length > 0">
            <template #content>
              <div>
                <div v-for="orderNo in singlePriceForm.wholesaleInfo.orderNumbers" :key="orderNo">{{ orderNo }}</div>
              </div>
            </template>
            <span class="cursor-pointer text-blue-500">查看订单详情</span>
          </el-tooltip>
        </div>
      </el-form-item>
      
      <el-form-item label="代发单价">
        <el-input-number
          v-model="singlePriceForm.distributionPrice"
          :min="0"
          :precision="2"
          controls-position="right"
          placeholder="请输入代发单价"
          class="!w-full"
        />
      </el-form-item>
      <el-form-item label="批发单价">
        <el-input-number
          v-model="singlePriceForm.wholesalePrice"
          :min="0"
          :precision="2"
          controls-position="right"
          placeholder="请输入批发单价"
          class="!w-full"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeSinglePriceDialog">取消</el-button>
        <el-button type="primary" @click="handleSingleSetPrice" :loading="singleSetLoading">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { SalePriceApi } from '@/api/erp/sale/saleprice'
import { dateFormatter } from '@/utils/formatTime'

const message = useMessage()

// 主弹窗状态
const dialogVisible = ref(false)
const loading = ref(false)
const list = ref<any[]>([])
const total = ref(0)
const selectionList = ref<any[]>([])

// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  groupProductId: '',
  customerName: ''
})

// 批量设置价格弹窗状态
const batchPriceDialogVisible = ref(false)
const batchSetLoading = ref(false)
const batchPriceForm = reactive({
  comboProductNo: '',
  customerName: '',
  distributionPrice: undefined,
  wholesalePrice: undefined
})

// 单个设置价格弹窗状态
const singlePriceDialogVisible = ref(false)
const singleSetLoading = ref(false)
const singlePriceForm = reactive({
  comboProductNo: '',
  customerName: '',
  comboProductId: 0,
  distributionPrice: undefined,
  wholesalePrice: undefined,
  distributionInfo: null,
  wholesaleInfo: null
})

// 格式化日期范围
const formatDateRange = (start: string, end: string) => {
  if (!start) return '-'
  const startStr = dateFormatter(null, null, start)
  if (!end || start === end) return startStr
  const endStr = dateFormatter(null, null, end)
  return `${startStr} 至 ${endStr}`
}

// 打开主弹窗
const open = () => {
  dialogVisible.value = true
  resetQuery()
  getList()
}

// 关闭主弹窗
const close = () => {
  dialogVisible.value = false
  list.value = []
  selectionList.value = []
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const data = await SalePriceApi.getCombinedMissingPrices(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

// 搜索
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

// 重置搜索
const resetQuery = () => {
  queryParams.pageNo = 1
  queryParams.pageSize = 10
  queryParams.groupProductId = ''
  queryParams.customerName = ''
  getList()
}

// 选择变化
const handleSelectionChange = (rows: any[]) => {
  selectionList.value = rows
}

// 打开批量设置价格弹窗
const openBatchPriceDialog = () => {
  if (selectionList.value.length === 0) {
    message.warning('请选择要设置价格的记录')
    return
  }

  // 检查是否为同一组品和客户
  const firstItem = selectionList.value[0]
  const isSameGroup = selectionList.value.every(
    item => item.comboProductId === firstItem.comboProductId && item.customerName === firstItem.customerName
  )

  if (!isSameGroup) {
    message.warning('只能为相同组品和客户的记录批量设置价格')
    return
  }

  batchPriceForm.comboProductNo = firstItem.comboProductNo
  batchPriceForm.customerName = firstItem.customerName
  batchPriceForm.distributionPrice = firstItem.currentDistributionPrice
  batchPriceForm.wholesalePrice = firstItem.currentWholesalePrice
  batchPriceDialogVisible.value = true
}

// 关闭批量设置价格弹窗
const closeBatchPriceDialog = () => {
  batchPriceDialogVisible.value = false
  batchPriceForm.comboProductNo = ''
  batchPriceForm.customerName = ''
  batchPriceForm.distributionPrice = undefined
  batchPriceForm.wholesalePrice = undefined
}

// 批量设置价格
const handleBatchSetPrice = async () => {
  if (!batchPriceForm.distributionPrice && !batchPriceForm.wholesalePrice) {
    message.warning('请至少输入一个价格')
    return
  }

  batchSetLoading.value = true
  try {
    const firstItem = selectionList.value[0]
    
    const reqData = {
      groupProductId: firstItem.comboProductId,
      customerName: firstItem.customerName,
      distributionPrice: batchPriceForm.distributionPrice,
      wholesalePrice: batchPriceForm.wholesalePrice
    }

    await SalePriceApi.batchSetCombinedPrices([reqData])
    message.success('批量设置价格成功')
    closeBatchPriceDialog()
    getList()
    selectionList.value = []
  } catch (error) {
    console.error('批量设置价格失败:', error)
  } finally {
    batchSetLoading.value = false
  }
}

// 打开单个设置价格弹窗
const openSinglePriceDialog = (row: any) => {
  singlePriceForm.comboProductNo = row.comboProductNo
  singlePriceForm.customerName = row.customerName
  singlePriceForm.comboProductId = row.comboProductId
  singlePriceForm.distributionPrice = row.currentDistributionPrice
  singlePriceForm.wholesalePrice = row.currentWholesalePrice
  singlePriceForm.distributionInfo = row.distributionInfo
  singlePriceForm.wholesaleInfo = row.wholesaleInfo
  singlePriceDialogVisible.value = true
}

// 关闭单个设置价格弹窗
const closeSinglePriceDialog = () => {
  singlePriceDialogVisible.value = false
  singlePriceForm.comboProductNo = ''
  singlePriceForm.customerName = ''
  singlePriceForm.comboProductId = 0
  singlePriceForm.distributionPrice = undefined
  singlePriceForm.wholesalePrice = undefined
  singlePriceForm.distributionInfo = null
  singlePriceForm.wholesaleInfo = null
}

// 单个设置价格
const handleSingleSetPrice = async () => {
  if (!singlePriceForm.distributionPrice && !singlePriceForm.wholesalePrice) {
    message.warning('请至少输入一个价格')
    return
  }

  singleSetLoading.value = true
  try {
    const reqData = {
      groupProductId: singlePriceForm.comboProductId,
      customerName: singlePriceForm.customerName,
      distributionPrice: singlePriceForm.distributionPrice,
      wholesalePrice: singlePriceForm.wholesalePrice
    }

    await SalePriceApi.batchSetCombinedPrices([reqData])
    message.success('设置价格成功')
    closeSinglePriceDialog()
    getList()
  } catch (error) {
    console.error('设置价格失败:', error)
  } finally {
    singleSetLoading.value = false
  }
}

// 暴露方法给父组件
defineExpose({
  open
})
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style> 