<template>
  <el-dialog
    v-model="dialogVisible"
    title="报价设置"
    width="98%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="price-quote-dialog"
  >
    <!-- 搜索区域 -->
    <div class="search-section">
      <el-card shadow="never" class="search-card">
        <el-form
          :model="queryParams"
          :inline="true"
          label-width="80px"
          class="search-form"
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
      </el-card>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <el-card shadow="never" class="table-card">
        <el-table
          v-loading="loading"
          :data="list"
          :stripe="true"
          :show-overflow-tooltip="true"
          max-height="600"
          class="price-table"
          :header-cell-style="{ backgroundColor: '#f8f9fa', color: '#495057', fontWeight: '600' }"
          style="width: 100%"
          table-layout="auto"
        >
          <el-table-column label="组品编号" prop="comboProductNo" width="130" fixed="left" align="center" :show-overflow-tooltip="false">
            <template #default="scope">
              <div class="product-code-cell">
                <el-tag type="info" size="small" class="product-tag">{{ scope.row.comboProductNo }}</el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="产品名称" prop="productName" min-width="200" fixed="left" :show-overflow-tooltip="false">
            <template #default="scope">
              <div class="product-name-cell">
                <div class="product-name">{{ scope.row.productName }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="客户名称" prop="customerName" width="110" fixed="left" align="center">
            <template #default="scope">
              <el-tag type="success" size="small" class="customer-tag">{{ scope.row.customerName }}</el-tag>
            </template>
          </el-table-column>

          <!-- 代发相关信息 -->
          <el-table-column label="代发订单信息" min-width="300" align="left">
            <template #default="scope">
              <div v-if="scope.row.distributionInfo" class="order-info distribution-info">
                <div class="info-header">
                  <el-icon class="mr-1"><Box /></el-icon>
                  <span class="info-title">代发订单</span>
                </div>
                <div class="info-content">
                  <div class="info-stats">
                    <div class="stat-item">
                      <span class="stat-label">订单:</span>
                      <el-tag size="small" type="primary" class="stat-value">{{ scope.row.distributionInfo.orderCount }}</el-tag>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">产品:</span>
                      <el-tag size="small" type="primary" class="stat-value">{{ scope.row.distributionInfo.totalProductQuantity }}</el-tag>
                    </div>
                  </div>
                  <div class="info-time">
                    <span class="time-label">时间:</span>
                    <span class="time-range">{{ formatDateRange(scope.row.distributionInfo.earliestCreateTime, scope.row.distributionInfo.latestCreateTime) }}</span>
                  </div>
                  <div class="info-orders" v-if="scope.row.distributionInfo.orderNumbers?.length > 0">
                    <el-tooltip effect="dark" placement="top">
                      <template #content>
                        <div class="order-tooltip">
                          <div v-for="orderNo in scope.row.distributionInfo.orderNumbers" :key="orderNo" class="order-item">
                            {{ orderNo }}
                          </div>
                        </div>
                      </template>
                      <el-link type="primary" :underline="false" class="order-link" size="small">
                        查看订单详情 ({{ scope.row.distributionInfo.orderNumbers.length }})
                      </el-link>
                    </el-tooltip>
                  </div>
                </div>
              </div>
              <div v-else class="no-data">
                <el-icon class="mr-1"><WarningFilled /></el-icon>
                <span>无代发订单</span>
              </div>
            </template>
          </el-table-column>

          <!-- 批发相关信息 -->
          <el-table-column label="批发订单信息" min-width="300" align="left">
            <template #default="scope">
              <div v-if="scope.row.wholesaleInfo" class="order-info wholesale-info">
                <div class="info-header">
                  <el-icon class="mr-1"><Goods /></el-icon>
                  <span class="info-title">批发订单</span>
                </div>
                <div class="info-content">
                  <div class="info-stats">
                    <div class="stat-item">
                      <span class="stat-label">订单:</span>
                      <el-tag size="small" type="warning" class="stat-value">{{ scope.row.wholesaleInfo.orderCount }}</el-tag>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">产品:</span>
                      <el-tag size="small" type="warning" class="stat-value">{{ scope.row.wholesaleInfo.totalProductQuantity }}</el-tag>
                    </div>
                  </div>
                  <div class="info-time">
                    <span class="time-label">时间:</span>
                    <span class="time-range">{{ formatDateRange(scope.row.wholesaleInfo.earliestCreateTime, scope.row.wholesaleInfo.latestCreateTime) }}</span>
                  </div>
                  <div class="info-orders" v-if="scope.row.wholesaleInfo.orderNumbers?.length > 0">
                    <el-tooltip effect="dark" placement="top">
                      <template #content>
                        <div class="order-tooltip">
                          <div v-for="orderNo in scope.row.wholesaleInfo.orderNumbers" :key="orderNo" class="order-item">
                            {{ orderNo }}
                          </div>
                        </div>
                      </template>
                      <el-link type="primary" :underline="false" class="order-link" size="small">
                        查看订单详情 ({{ scope.row.wholesaleInfo.orderNumbers.length }})
                      </el-link>
                    </el-tooltip>
                  </div>
                </div>
              </div>
              <div v-else class="no-data">
                <el-icon class="mr-1"><WarningFilled /></el-icon>
                <span>无批发订单</span>
              </div>
            </template>
          </el-table-column>

          <!-- 当前价格 -->
          <el-table-column label="当前价格" width="160" align="center">
            <template #default="scope">
              <div class="price-info">
                <div class="price-item">
                  <div class="price-label">代发价</div>
                  <div class="price-value">
                    <el-tag v-if="scope.row.currentDistributionPrice" type="success" size="small" class="price-tag">
                      ¥{{ scope.row.currentDistributionPrice }}
                    </el-tag>
                    <span v-else class="no-price">未设置</span>
                  </div>
                </div>
                <div class="price-item">
                  <div class="price-label">批发价</div>
                  <div class="price-value">
                    <el-tag v-if="scope.row.currentWholesalePrice" type="warning" size="small" class="price-tag">
                      ¥{{ scope.row.currentWholesalePrice }}
                    </el-tag>
                    <span v-else class="no-price">未设置</span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="120" fixed="right" align="center">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="openSinglePriceDialog(scope.row)"
                class="action-btn"
              >
                <Icon icon="ep:price-tag" class="mr-1" />
                设置价格
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 分页 -->
    <div class="pagination-section">
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
        <el-button size="large" @click="close">
          <Icon icon="ep:close" class="mr-1" />
          关闭
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 设置价格弹窗 -->
  <el-dialog
    v-model="singlePriceDialogVisible"
    title="设置价格"
    width="800px"
    :close-on-click-modal="false"
    class="price-setting-dialog"
  >
    <div class="price-form-container">
      <!-- 基础信息 -->
      <el-card shadow="never" class="mb-4">
        <template #header>
          <div class="card-header">
            <el-icon class="mr-2"><InfoFilled /></el-icon>
            <span class="card-title">基础信息</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="组品编号">
              <el-input v-model="singlePriceForm.comboProductNo" disabled class="info-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="singlePriceForm.customerName" disabled class="info-input" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 订单信息 -->
      <el-row :gutter="20" class="mb-4">
        <!-- 代发信息 -->
        <el-col :span="12" v-if="singlePriceForm.distributionInfo">
          <el-card shadow="never" class="order-card">
            <template #header>
              <div class="card-header">
                <el-icon class="mr-2 text-blue-500"><Box /></el-icon>
                <span class="card-title">代发订单信息</span>
              </div>
            </template>
            <div class="order-details">
              <div class="detail-item">
                <span class="detail-label">订单数量:</span>
                <el-tag type="primary" size="small">{{ singlePriceForm.distributionInfo.orderCount }}</el-tag>
              </div>
              <div class="detail-item">
                <span class="detail-label">产品数量:</span>
                <el-tag type="primary" size="small">{{ singlePriceForm.distributionInfo.totalProductQuantity }}</el-tag>
              </div>
              <div class="detail-item">
                <span class="detail-label">时间范围:</span>
                <span class="detail-value">{{ formatDateRange(singlePriceForm.distributionInfo.earliestCreateTime, singlePriceForm.distributionInfo.latestCreateTime) }}</span>
              </div>
              <div class="detail-item" v-if="singlePriceForm.distributionInfo.orderNumbers?.length > 0">
                <span class="detail-label">订单详情:</span>
                <el-tooltip effect="dark" placement="top">
                  <template #content>
                    <div class="order-tooltip">
                      <div v-for="orderNo in singlePriceForm.distributionInfo.orderNumbers" :key="orderNo" class="order-item">
                        {{ orderNo }}
                      </div>
                    </div>
                  </template>
                  <el-link type="primary" :underline="false">查看全部订单</el-link>
                </el-tooltip>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 批发信息 -->
        <el-col :span="12" v-if="singlePriceForm.wholesaleInfo">
          <el-card shadow="never" class="order-card">
            <template #header>
              <div class="card-header">
                <el-icon class="mr-2 text-orange-500"><Goods /></el-icon>
                <span class="card-title">批发订单信息</span>
              </div>
            </template>
            <div class="order-details">
              <div class="detail-item">
                <span class="detail-label">订单数量:</span>
                <el-tag type="warning" size="small">{{ singlePriceForm.wholesaleInfo.orderCount }}</el-tag>
              </div>
              <div class="detail-item">
                <span class="detail-label">产品数量:</span>
                <el-tag type="warning" size="small">{{ singlePriceForm.wholesaleInfo.totalProductQuantity }}</el-tag>
              </div>
              <div class="detail-item">
                <span class="detail-label">时间范围:</span>
                <span class="detail-value">{{ formatDateRange(singlePriceForm.wholesaleInfo.earliestCreateTime, singlePriceForm.wholesaleInfo.latestCreateTime) }}</span>
              </div>
              <div class="detail-item" v-if="singlePriceForm.wholesaleInfo.orderNumbers?.length > 0">
                <span class="detail-label">订单详情:</span>
                <el-tooltip effect="dark" placement="top">
                  <template #content>
                    <div class="order-tooltip">
                      <div v-for="orderNo in singlePriceForm.wholesaleInfo.orderNumbers" :key="orderNo" class="order-item">
                        {{ orderNo }}
                      </div>
                    </div>
                  </template>
                  <el-link type="primary" :underline="false">查看全部订单</el-link>
                </el-tooltip>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 价格设置 -->
      <el-card shadow="never" class="mb-4">
        <template #header>
          <div class="card-header">
            <el-icon class="mr-2 text-green-500"><Money /></el-icon>
            <span class="card-title">价格设置</span>
            <el-tag type="danger" size="small" class="ml-2">必填</el-tag>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="代发单价" label-width="100px" required>
              <el-input-number
                v-model="singlePriceForm.distributionPrice"
                :min="0"
                :precision="2"
                controls-position="right"
                placeholder="请输入代发单价"
                class="!w-full price-input"
              >
                <template #prefix>¥</template>
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批发单价" label-width="100px" required>
              <el-input-number
                v-model="singlePriceForm.wholesalePrice"
                :min="0"
                :precision="2"
                controls-position="right"
                placeholder="请输入批发单价"
                class="!w-full price-input"
              >
                <template #prefix>¥</template>
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 运费设置 -->
      <el-card shadow="never" class="shipping-card">
        <template #header>
          <div class="card-header">
                          <el-icon class="mr-2 text-purple-500"><Setting /></el-icon>
            <span class="card-title">运费设置</span>
            <el-tag type="danger" size="small" class="ml-2">必填</el-tag>
          </div>
        </template>

        <el-form-item label="运费类型" label-width="100px" required>
          <el-radio-group v-model="singlePriceForm.shippingFeeType" class="shipping-type-group">
            <el-radio-button :label="0">
              <el-icon class="mr-1"><Money /></el-icon>
              固定运费
            </el-radio-button>
            <el-radio-button :label="1">
              <el-icon class="mr-1"><Box /></el-icon>
              按件计费
            </el-radio-button>
                          <el-radio-button :label="2">
                <el-icon class="mr-1"><Setting /></el-icon>
                按重计费
              </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <!-- 固定运费 -->
        <div v-if="singlePriceForm.shippingFeeType === 0" class="shipping-content">
          <el-form-item label="固定运费" label-width="100px" required>
            <el-input-number
              v-model="singlePriceForm.fixedShippingFee"
              :min="0"
              :precision="2"
              controls-position="right"
              placeholder="请输入固定运费"
              class="!w-full"
            >
              <template #prefix>¥</template>
            </el-input-number>
          </el-form-item>
        </div>

        <!-- 按件计费 -->
        <div v-if="singlePriceForm.shippingFeeType === 1" class="shipping-content">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="续件数量" label-width="100px" required>
                <el-input-number
                  v-model="singlePriceForm.additionalItemQuantity"
                  :min="0"
                  controls-position="right"
                  placeholder="请输入续件数量"
                  class="!w-full"
                >
                  <template #suffix>件</template>
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="续件价格" label-width="100px" required>
                <el-input-number
                  v-model="singlePriceForm.additionalItemPrice"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                  placeholder="请输入续件价格"
                  class="!w-full"
                >
                  <template #prefix>¥</template>
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 按重计费 -->
        <div v-if="singlePriceForm.shippingFeeType === 2" class="shipping-content">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="首重重量" label-width="100px" required>
                <el-input-number
                  v-model="singlePriceForm.firstWeight"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                  placeholder="请输入首重重量"
                  class="!w-full"
                >
                  <template #suffix>kg</template>
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="首重价格" label-width="100px" required>
                <el-input-number
                  v-model="singlePriceForm.firstWeightPrice"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                  placeholder="请输入首重价格"
                  class="!w-full"
                >
                  <template #prefix>¥</template>
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="续重重量" label-width="100px" required>
                <el-input-number
                  v-model="singlePriceForm.additionalWeight"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                  placeholder="请输入续重重量"
                  class="!w-full"
                >
                  <template #suffix>kg</template>
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="续重价格" label-width="100px" required>
                <el-input-number
                  v-model="singlePriceForm.additionalWeightPrice"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                  placeholder="请输入续重价格"
                  class="!w-full"
                >
                  <template #prefix>¥</template>
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button size="large" @click="closeSinglePriceDialog">
          <Icon icon="ep:close" class="mr-1" />
          取消
        </el-button>
        <el-button type="primary" size="large" @click="handleSingleSetPrice" :loading="singleSetLoading">
          <Icon icon="ep:check" class="mr-1" />
          确定设置
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { SalePriceApi } from '@/api/erp/sale/saleprice'
import { dateFormatter } from '@/utils/formatTime'
import {
  Box,
  Goods,
  WarningFilled,
  InfoFilled,
  Money,
  Setting
} from '@element-plus/icons-vue'

const message = useMessage()

// 主弹窗状态
const dialogVisible = ref(false)
const loading = ref(false)
const list = ref<any[]>([])
const total = ref(0)

// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  groupProductId: '',
  customerName: ''
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
  wholesaleInfo: null,
  shippingFeeType: 0,
  fixedShippingFee: undefined,
  additionalItemQuantity: undefined,
  additionalItemPrice: undefined,
  firstWeight: undefined,
  firstWeightPrice: undefined,
  additionalWeight: undefined,
  additionalWeightPrice: undefined
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
}

// 获取列表数据
const getList = async (paginationParams?: any) => {
  loading.value = true
  try {
    // 如果传入了分页参数，更新查询参数
    if (paginationParams) {
      queryParams.pageNo = paginationParams.page
      queryParams.pageSize = paginationParams.limit
    }

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
  singlePriceForm.shippingFeeType = 0
  singlePriceForm.fixedShippingFee = undefined
  singlePriceForm.additionalItemQuantity = undefined
  singlePriceForm.additionalItemPrice = undefined
  singlePriceForm.firstWeight = undefined
  singlePriceForm.firstWeightPrice = undefined
  singlePriceForm.additionalWeight = undefined
  singlePriceForm.additionalWeightPrice = undefined
}

// 单个设置价格
const handleSingleSetPrice = async () => {
  // 验证代发价格和批发价格都必须填写
  if (!singlePriceForm.distributionPrice || singlePriceForm.distributionPrice <= 0) {
    message.warning('请输入代发单价，且价格必须大于0')
    return
  }
  if (!singlePriceForm.wholesalePrice || singlePriceForm.wholesalePrice <= 0) {
    message.warning('请输入批发单价，且价格必须大于0')
    return
  }

  // 验证运费设置
  // if (singlePriceForm.shippingFeeType === 0 && !singlePriceForm.fixedShippingFee) {
  //   message.warning('固定运费类型需要设置固定运费金额')
  //   return
  // }

  if (singlePriceForm.shippingFeeType === 0 && (singlePriceForm.fixedShippingFee === null || singlePriceForm.fixedShippingFee === undefined)) {
    message.warning('固定运费类型需要设置固定运费金额')
    return
  }
  // if (singlePriceForm.shippingFeeType === 1) {
  //   if (!singlePriceForm.additionalItemQuantity || !singlePriceForm.additionalItemPrice) {
  //     message.warning('按件计费需要设置续件数量和续件价格')
  //     return
  //   }
  // }
  if (singlePriceForm.shippingFeeType === 1) {
    if (
      singlePriceForm.additionalItemQuantity === null || singlePriceForm.additionalItemQuantity === undefined ||
      singlePriceForm.additionalItemPrice === null || singlePriceForm.additionalItemPrice === undefined
    ) {
      message.warning('按件计费需要设置续件数量和续件价格')
      return
    }
  }
  // if (singlePriceForm.shippingFeeType === 2) {
  //   if (!singlePriceForm.firstWeight || !singlePriceForm.firstWeightPrice ||
  //       !singlePriceForm.additionalWeight || !singlePriceForm.additionalWeightPrice) {
  //     message.warning('按重计费需要设置首重重量、首重价格、续重重量和续重价格')
  //     return
  //   }
  // }

  if (singlePriceForm.shippingFeeType === 2) {
    const fieldMap: Record<string, string> = {
      firstWeight: '首重重量',
      firstWeightPrice: '首重价格',
      additionalWeight: '续重重量',
      additionalWeightPrice: '续重价格'
    }

    const missing = Object.keys(fieldMap).filter(
      key => singlePriceForm[key as keyof typeof fieldMap] === null ||
        singlePriceForm[key as keyof typeof fieldMap] === undefined
    )

    if (missing.length > 0) {
      const missingNames = missing.map(k => fieldMap[k]).join('、')
      message.warning(`按重计费需要设置：${missingNames}`)
      return
    }
  }

  singleSetLoading.value = true
  try {
    const reqData = {
      groupProductId: singlePriceForm.comboProductId,
      customerName: singlePriceForm.customerName,
      distributionPrice: singlePriceForm.distributionPrice,
      wholesalePrice: singlePriceForm.wholesalePrice,
      shippingFeeType: singlePriceForm.shippingFeeType,
      fixedShippingFee: singlePriceForm.fixedShippingFee,
      additionalItemQuantity: singlePriceForm.additionalItemQuantity,
      additionalItemPrice: singlePriceForm.additionalItemPrice,
      firstWeight: singlePriceForm.firstWeight,
      firstWeightPrice: singlePriceForm.firstWeightPrice,
      additionalWeight: singlePriceForm.additionalWeight,
      additionalWeightPrice: singlePriceForm.additionalWeightPrice
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
/* 主弹窗样式 */
.price-quote-dialog {
  --el-dialog-padding-primary: 20px;
}

.search-section {
  margin-bottom: 16px;
}

.search-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.search-form {
  margin: 0;
}

.table-section {
  margin-bottom: 16px;
}

.table-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.price-table {
  --el-table-border-radius: 8px;
  width: 100% !important;
}

.price-table .el-table__inner-wrapper {
  width: 100% !important;
}

.price-table .el-table__body-wrapper {
  overflow-x: auto;
}

.price-table .el-table__row {
  height: auto !important;
}

.price-table .el-table__cell {
  padding: 8px 0 !important;
  height: auto !important;
  vertical-align: top !important;
}

.price-table .el-table__cell .cell {
  line-height: 1.3 !important;
  white-space: normal !important;
  word-break: break-word !important;
  padding: 0 8px !important;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

/* 表格内容样式 */
.product-code-cell {
  padding: 4px 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.product-tag {
  font-weight: 500;
  border-radius: 4px;
  white-space: normal !important;
  word-break: break-all;
  line-height: 1.2;
  text-align: center;
  min-height: auto;
  height: auto;
  padding: 4px 6px;
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
}

.customer-tag {
  font-weight: 500;
  border-radius: 4px;
}

.product-name-cell {
  padding: 8px 4px;
  line-height: 1.3;
}

.product-name {
  font-weight: 500;
  color: #303133;
  line-height: 1.3;
  word-break: break-word;
  white-space: normal;
  overflow-wrap: break-word;
  hyphens: auto;
}

.order-info {
  padding: 8px 10px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 6px;
  border: 1px solid #e9ecef;
  position: relative;
  overflow: hidden;
  min-height: 80px;
  display: flex;
  flex-direction: column;
}

.order-info::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}

.distribution-info::before {
  background: linear-gradient(to bottom, #409eff, #66b3ff);
}

.wholesale-info::before {
  background: linear-gradient(to bottom, #e6a23c, #f0c674);
}

.info-header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.distribution-info .info-header {
  color: #409eff;
}

.wholesale-info .info-header {
  color: #e6a23c;
}

.info-title {
  font-weight: 600;
}

.info-content {
  font-size: 11px;
  line-height: 1.4;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 3px;
  white-space: nowrap;
}

.stat-label {
  color: #606266;
  font-size: 10px;
  font-weight: 500;
}

.stat-value {
  font-weight: 600;
  font-size: 10px;
}

.info-time {
  display: flex;
  align-items: flex-start;
  gap: 3px;
  flex-wrap: wrap;
}

.time-label {
  color: #606266;
  font-size: 10px;
  font-weight: 500;
  flex-shrink: 0;
}

.time-range {
  color: #909399;
  font-size: 10px;
  line-height: 1.2;
  word-break: break-all;
}

.info-orders {
  margin-top: auto;
}

.order-link {
  font-size: 11px;
  font-weight: 500;
}

.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  font-size: 11px;
  padding: 16px 8px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px dashed #e0e0e0;
  min-height: 60px;
}

.price-info {
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.price-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.price-label {
  color: #606266;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
}

.price-value {
  display: flex;
  justify-content: center;
}

.price-tag {
  font-weight: 600;
  border-radius: 4px;
  padding: 2px 8px;
}

.no-price {
  color: #c0c4cc;
  font-size: 11px;
  font-style: italic;
}

.action-btn {
  border-radius: 6px;
  font-weight: 500;
  padding: 6px 12px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

/* 设置价格弹窗样式 */
.price-setting-dialog {
  --el-dialog-padding-primary: 24px;
}

.price-form-container {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.card-title {
  font-size: 14px;
  color: #303133;
}

.info-input {
  --el-input-bg-color: #f5f7fa;
}

.order-card {
  height: 100%;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.order-details {
  padding: 4px 0;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  color: #606266;
  margin-right: 12px;
  min-width: 70px;
  font-size: 13px;
}

.detail-value {
  color: #909399;
  font-size: 12px;
}

.price-input {
  --el-input-border-color: #dcdfe6;
  --el-input-hover-border-color: #c0c4cc;
  --el-input-focus-border-color: #409eff;
}

.shipping-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.shipping-type-group {
  display: flex;
  gap: 8px;
}

.shipping-content {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

/* Tooltip样式 */
.order-tooltip {
  max-height: 200px;
  overflow-y: auto;
}

.order-item {
  padding: 4px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 12px;
}

.order-item:last-child {
  border-bottom: none;
}

/* 底部按钮 */
.dialog-footer {
  text-align: right;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .price-quote-dialog {
    width: 98% !important;
  }

  .price-setting-dialog {
    width: 90% !important;
  }
}

/* 滚动条样式 */
.price-form-container::-webkit-scrollbar {
  width: 6px;
}

.price-form-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.price-form-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.price-form-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
