<!-- ERP 直播复盘列表 -->
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
        <el-form-item label="编号" prop="no">
          <el-input
            v-model="queryParams.no"
            placeholder="请输入编号"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="品牌名称" prop="brandName">
          <el-select
            v-model="queryParams.brandName"
            placeholder="请选择品牌名称"
            clearable
            class="!w-240px"
            filterable
            :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRODUCT_BRAND)"
          >
            <el-option
              v-for="dict in filteredBrandOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
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
        <el-form-item label="产品规格" prop="productSpec">
          <el-input
            v-model="queryParams.productSpec"
            placeholder="请输入产品规格"
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
        <el-form-item label="直播价格" prop="livePrice">
          <el-input
            v-model="queryParams.livePrice"
            placeholder="请输入直播价格"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="直播佣金" prop="liveCommission">
          <el-input
            v-model="queryParams.liveCommission"
            placeholder="请输入直播佣金"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="公开佣金" prop="publicCommission">
          <el-input
            v-model="queryParams.publicCommission"
            placeholder="请输入公开佣金"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="寄样日期" prop="sampleSendDate">
          <el-date-picker
            v-model="queryParams.sampleSendDate"
            type="daterange"
            value-format="YYYY-MM-DD"
            class="!w-240px"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="开播日期" prop="liveStartDate">
          <el-date-picker
            v-model="queryParams.liveStartDate"
            type="daterange"
            value-format="YYYY-MM-DD"
            class="!w-240px"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="货盘状态" prop="liveStatus">
          <el-select
            v-model="queryParams.liveStatus"
            placeholder="请选择货盘状态"
            clearable
            class="!w-240px"
            filterable
            :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_LIVE_STATUS)"
          >
            <el-option
              v-for="dict in filteredLiveStatusOptions"
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
            v-hasPermi="['erp:livebroadcastingreview:create']"
          >
            <Icon icon="ep:plus" class="mr-5px" /> 新增
          </el-button>
          <el-button
            type="info"
            plain
            @click="handleImport"
            v-hasPermi="['erp:livebroadcastingreview:import']"
          >
            <Icon icon="ep:upload" class="mr-5px" /> 导入
          </el-button>
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['erp:livebroadcastingreview:export']"
          >
            <Icon icon="ep:download" class="mr-5px" /> 导出
          </el-button>
          <el-button
            type="danger"
            plain
            @click="handleDelete(selectionList.map((item) => item.id))"
            v-hasPermi="['erp:livebroadcastingreview:delete']"
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
        <el-table-column label="编号" align="center" prop="no" />
        <el-table-column
          label="品牌名称"
          align="center"
          prop="brandName"
          :show-overflow-tooltip="false"
        >
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ERP_PRODUCT_BRAND" :value="scope.row.brandName" />
          </template>
        </el-table-column>
        <el-table-column label="产品名称" align="center" prop="productName" />
        <el-table-column label="产品规格" align="center" prop="productSpec" />
        <el-table-column label="货盘状态" align="center" prop="liveStatus">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ERP_LIVE_STATUS" :value="scope.row.liveStatus" />
          </template>
        </el-table-column>
        <el-table-column label="客户名称" align="center" prop="customerName" />
        <el-table-column label="寄样日期" align="center" prop="sampleSendDate" :formatter="dateFormatter2" />
        <el-table-column label="开播日期" align="center" prop="liveStartDate" :formatter="dateFormatter2" />
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <el-button link type="primary" @click="openDetail(scope.row.id)"> 详情 </el-button>
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['erp:livebroadcastingreview:update']"
            >
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete([scope.row.id])"
              v-hasPermi="['erp:livebroadcastingreview:delete']"
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
    <!-- 导入组件 -->
    <LiveBroadcastingReviewImportForm ref="importFormRef" @success="getList" />
  </template>

  <script setup lang="ts">
  import {dateFormatter, dateFormatter2} from '@/utils/formatTime'
  import download from '@/utils/download'
  import { LiveBroadcastingReviewApi, LiveBroadcastingReviewVO } from '@/api/erp/livebroadcastingreview'
  import LiveBroadcastingReviewImportForm from './form/LiveBroadcastingReviewImportForm.vue'
  import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'

  /** ERP 直播复盘列表 */
  defineOptions({ name: 'ErpLiveBroadcastingReview' })

  const message = useMessage() // 消息弹窗
  const { t } = useI18n() // 国际化
  const { push } = useRouter() // 路由跳转

  const loading = ref(true) // 列表的加载中
  const list = ref<LiveBroadcastingReviewVO[]>([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    no: undefined,
    brandName: undefined,
    productName: undefined,
    productSpec: undefined,
    customerName: undefined,
    livePrice: undefined,
    liveCommission: undefined,
    publicCommission: undefined,
    sampleSendDate: undefined,
    liveStartDate: undefined,
    liveStatus: undefined,
    creator: undefined,
    createTime: undefined
  })
  const queryFormRef = ref() // 搜索的表单
  const exportLoading = ref(false) // 导出的加载中

  // 字典选项
  const brandOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRODUCT_BRAND))
  const liveStatusOptions = ref(getStrDictOptions(DICT_TYPE.ERP_LIVE_STATUS))
  const filteredBrandOptions = ref(brandOptions.value)
  const filteredLiveStatusOptions = ref(liveStatusOptions.value)

  // 字典过滤方法
  const filterDictOptions = (value: string, dictType: string) => {
    if (!value) {
      if (dictType === DICT_TYPE.ERP_PRODUCT_BRAND) {
        filteredBrandOptions.value = brandOptions.value
      } else if (dictType === DICT_TYPE.ERP_LIVE_STATUS) {
        filteredLiveStatusOptions.value = liveStatusOptions.value
      }
      return
    }

    const filterOptions = (options: any[]) => {
      return options.filter(option =>
        option.label.toLowerCase().includes(value.toLowerCase())
      )
    }

    if (dictType === DICT_TYPE.ERP_PRODUCT_BRAND) {
      filteredBrandOptions.value = filterOptions(brandOptions.value)
    } else if (dictType === DICT_TYPE.ERP_LIVE_STATUS) {
      filteredLiveStatusOptions.value = filterOptions(liveStatusOptions.value)
    }
  }

  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      const data = await LiveBroadcastingReviewApi.getLiveBroadcastingReviewPage(queryParams)
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

  const openForm = (type: string, id?: number) => {
    if (type === 'create') {
      push({ name: 'ErpLiveBroadcastingReviewAdd' })
    } else if (type === 'update' && typeof id === 'number') {
      push({ name: 'ErpLiveBroadcastingReviewEdit', params: { id } })
    } else {
      console.error('Invalid type or missing id for edit operation')
    }
  }

  /** 查看详情 */
  const openDetail = (id: number) => {
    push({ name: 'ErpLiveBroadcastingReviewDetail', params: { id } })
  }

  /** 选中操作 */
  const selectionList = ref<LiveBroadcastingReviewVO[]>([])
  const handleSelectionChange = (rows: LiveBroadcastingReviewVO[]) => {
    selectionList.value = rows
  }

  /** 删除按钮操作 */
  const handleDelete = async (ids: number[]) => {
    try {
      await message.delConfirm()
      await LiveBroadcastingReviewApi.deleteLiveBroadcastingReview(ids)
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
      const data = await LiveBroadcastingReviewApi.exportLiveBroadcastingReview(queryParams)
      download.excel(data, '直播复盘.xlsx')
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

  /** 初始化 **/
  onMounted(() => {
    getList()
  })

  onUpdated(async () => {
    const shouldRefresh = localStorage.getItem('refreshList')
    if (shouldRefresh) {
      localStorage.removeItem('refreshList')
      await getList()
    }
  })
  </script>
