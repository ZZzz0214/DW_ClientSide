<!-- ERP 直播信息列表 -->
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
        <el-form-item label="客户名称" prop="customerName">
          <el-select
            v-model="queryParams.customerName"
            placeholder="请选择客户名称"
            clearable
            class="!w-240px"
            filterable
            :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_LIVE_CUSTOMER_NAME)"
          >
            <el-option
              v-for="dict in filteredCustomerNameOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="客户职位" prop="customerPosition">
          <el-select
            v-model="queryParams.customerPosition"
            placeholder="请选择客户职位"
            clearable
            class="!w-240px"
            filterable
            :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_LIVE_CUSTOMER_POSITION)"
          >
            <el-option
              v-for="dict in filteredCustomerPositionOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="平台名称" prop="platformName">
          <el-select
            v-model="queryParams.platformName"
            placeholder="请选择平台名称"
            clearable
            class="!w-240px"
            filterable
            :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_LIVE_PLATFORM_NAME)"
          >
            <el-option
              v-for="dict in filteredPlatformNameOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="客户属性" prop="customerAttribute">
          <el-select
            v-model="queryParams.customerAttribute"
            placeholder="请选择客户属性"
            clearable
            class="!w-240px"
            filterable
            :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_LIVE_CUSTOMER_ATTRIBUTE)"
          >
            <el-option
              v-for="dict in filteredCustomerAttributeOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="客户城市" prop="customerCity">
          <el-select
            v-model="queryParams.customerCity"
            placeholder="请选择客户城市"
            clearable
            class="!w-240px"
            filterable
            :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_LIVE_CUSTOMER_CITY)"
          >
            <el-option
              v-for="dict in filteredCustomerCityOptions"
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
            v-hasPermi="['erp:livebroadcastinginfo:create']"
          >
            <Icon icon="ep:plus" class="mr-5px" /> 新增
          </el-button>
          <el-button
            type="warning"
            plain
            @click="handleImport"
            v-hasPermi="['erp:livebroadcastinginfo:import']"
          >
            <Icon icon="ep:upload" /> 导入
          </el-button>
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['erp:livebroadcastinginfo:export']"
          >
            <Icon icon="ep:download" class="mr-5px" /> 导出
          </el-button>
          <el-button
            type="danger"
            plain
            @click="handleDelete(selectionList.map((item) => item.id))"
            v-hasPermi="['erp:livebroadcastinginfo:delete']"
            :disabled="selectionList.length === 0"
          >
            <Icon icon="ep:delete" class="mr-5px" /> 删除
          </el-button>
          <el-button
            type="info"
            plain
            @click="handleCopy"
            :disabled="selectionList.length !== 1"
            v-hasPermi="['erp:livebroadcastinginfo:CopyCreate']"
                    >
            <Icon icon="ep:document-copy" class="mr-5px" /> 复制新增
          </el-button>
          </el-form-item>
        </el-form>
      </ContentWrap>
      <ContentWrap>
        <el-table
          v-loading="loading"
          :data="list"
          :stripe="true"
          :show-overflow-tooltip="false"
          @selection-change="handleSelectionChange"
        >
          <el-table-column width="30" label="选择" type="selection" />
          <el-table-column label="编号" align="center" prop="no" />
          <el-table-column label="客户姓名" align="center" prop="customerName">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.ERP_LIVE_CUSTOMER_NAME" :value="scope.row.customerName" />
            </template>
          </el-table-column>
<!--          <el-table-column label="客户职位" align="center" prop="customerPosition" />-->
                <el-table-column label="客户职位" align="center" prop="customerPosition">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ERP_LIVE_CUSTOMER_POSITION" :value="scope.row.customerPosition" />
        </template>
      </el-table-column>
          <el-table-column label="客户微信" align="center" prop="customerWechat" />
<!--          <el-table-column label="平台名称" align="center" prop="platformName" />-->
                <el-table-column label="平台名称" align="center" prop="platformName">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ERP_LIVE_PLATFORM_NAME" :value="scope.row.platformName" />
        </template>
      </el-table-column>
<!--          <el-table-column label="客户属性" align="center" prop="customerAttribute" />-->
                <el-table-column label="客户属性" align="center" prop="customerAttribute">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ERP_LIVE_CUSTOMER_ATTRIBUTE" :value="scope.row.customerAttribute" />
        </template>
      </el-table-column>
<!--          <el-table-column label="客户城市" align="center" prop="customerCity" />-->
                <el-table-column label="客户城市" align="center" prop="customerCity">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ERP_LIVE_CUSTOMER_CITY" :value="scope.row.customerCity" />
        </template>
      </el-table-column>
<!--          <el-table-column label="客户区县" align="center" prop="customerDistrict" />-->
<!--                <el-table-column label="客户区县" align="center" prop="customerDistrict">-->
<!--        <template #default="scope">-->
<!--          <dict-tag :type="DICT_TYPE.ERP_LIVE_CUSTOMER_DISTRICT" :value="scope.row.customerDistrict" />-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--          <el-table-column label="用户画像" align="center" prop="userPortrait" />-->
<!--          <el-table-column label="招商类目" align="center" prop="recruitmentCategory" />-->
<!--          <el-table-column label="选品标准" align="center" prop="selectionCriteria" />-->
<!--          <el-table-column label="备注信息" align="center" prop="remark" />-->

          <el-table-column label="创建人员" align="center" prop="creator"  :show-overflow-tooltip="false"/>
          <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatter" width="180px" />
          <el-table-column label="操作" align="center" width="240">
            <template #default="scope">
              <el-button link type="primary" @click="openDetail(scope.row.id)"> 详情 </el-button>
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['erp:livebroadcastinginfo:update']"
              >
                编辑
              </el-button>
              <el-button
                link
                type="info"
                @click="handleCopyRow(scope.row)"
                v-hasPermi="['erp:livebroadcastinginfo:CopyCreate']"
              >
                复制
              </el-button>
              <el-button
                link
                type="danger"
                @click="handleDelete([scope.row.id])"
                v-hasPermi="['erp:livebroadcastinginfo:delete']"
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
    <LiveBroadcastingInfoImportForm ref="importFormRef" @success="getList" />
  </template>

  <script setup lang="ts">
  import download from '@/utils/download'
  import { LiveBroadcastingInfoApi, LiveBroadcastingInfoVO } from '@/api/erp/livebroadcastinginfo'
  import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
  import LiveBroadcastingInfoImportForm from './form/LiveBroadcastingInfoImportForm.vue'
  import {dateFormatter} from "@/utils/formatTime";

  /** ERP 直播信息列表 */
  defineOptions({ name: 'ErpLiveBroadcastingInfo' })

  const message = useMessage() // 消息弹窗
  const { t } = useI18n() // 国际化
  const { push } = useRouter() // 路由跳转

  const loading = ref(true) // 列表的加载中
  const list = ref<LiveBroadcastingInfoVO[]>([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    no: undefined,
    customerName: undefined,
    customerPosition: undefined,
    platformName: undefined,
    customerAttribute: undefined,
    customerCity: undefined,
    creator: undefined,
    createTime: undefined
  })
  const queryFormRef = ref() // 搜索的表单
  const exportLoading = ref(false) // 导出的加载中

  // 字典选项
  const customerNameOptions = ref(getStrDictOptions(DICT_TYPE.ERP_LIVE_CUSTOMER_NAME))
  const customerPositionOptions = ref(getStrDictOptions(DICT_TYPE.ERP_LIVE_CUSTOMER_POSITION))
  const platformNameOptions = ref(getStrDictOptions(DICT_TYPE.ERP_LIVE_PLATFORM_NAME))
  const customerAttributeOptions = ref(getStrDictOptions(DICT_TYPE.ERP_LIVE_CUSTOMER_ATTRIBUTE))
  const customerCityOptions = ref(getStrDictOptions(DICT_TYPE.ERP_LIVE_CUSTOMER_CITY))

  const filteredCustomerNameOptions = ref(customerNameOptions.value)
  const filteredCustomerPositionOptions = ref(customerPositionOptions.value)
  const filteredPlatformNameOptions = ref(platformNameOptions.value)
  const filteredCustomerAttributeOptions = ref(customerAttributeOptions.value)
  const filteredCustomerCityOptions = ref(customerCityOptions.value)

  // 字典过滤方法
  const filterDictOptions = (value: string, dictType: string) => {
    if (!value) {
      if (dictType === DICT_TYPE.ERP_LIVE_CUSTOMER_NAME) {
        filteredCustomerNameOptions.value = customerNameOptions.value
      } else if (dictType === DICT_TYPE.ERP_LIVE_CUSTOMER_POSITION) {
        filteredCustomerPositionOptions.value = customerPositionOptions.value
      } else if (dictType === DICT_TYPE.ERP_LIVE_PLATFORM_NAME) {
        filteredPlatformNameOptions.value = platformNameOptions.value
      } else if (dictType === DICT_TYPE.ERP_LIVE_CUSTOMER_ATTRIBUTE) {
        filteredCustomerAttributeOptions.value = customerAttributeOptions.value
      } else if (dictType === DICT_TYPE.ERP_LIVE_CUSTOMER_CITY) {
        filteredCustomerCityOptions.value = customerCityOptions.value
      }
      return
    }

    const filterOptions = (options: any[]) => {
      return options.filter(option =>
        option.label.toLowerCase().includes(value.toLowerCase())
      )
    }

    if (dictType === DICT_TYPE.ERP_LIVE_CUSTOMER_NAME) {
      filteredCustomerNameOptions.value = filterOptions(customerNameOptions.value)
    } else if (dictType === DICT_TYPE.ERP_LIVE_CUSTOMER_POSITION) {
      filteredCustomerPositionOptions.value = filterOptions(customerPositionOptions.value)
    } else if (dictType === DICT_TYPE.ERP_LIVE_PLATFORM_NAME) {
      filteredPlatformNameOptions.value = filterOptions(platformNameOptions.value)
    } else if (dictType === DICT_TYPE.ERP_LIVE_CUSTOMER_ATTRIBUTE) {
      filteredCustomerAttributeOptions.value = filterOptions(customerAttributeOptions.value)
    } else if (dictType === DICT_TYPE.ERP_LIVE_CUSTOMER_CITY) {
      filteredCustomerCityOptions.value = filterOptions(customerCityOptions.value)
    }
  }

  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      const data = await LiveBroadcastingInfoApi.getLiveBroadcastingInfoPage(queryParams)
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
      // 清除可能存在的复制数据
      sessionStorage.removeItem('copyLiveBroadcastingInfoData')
      push({ name: 'ErpLiveBroadcastingInfoAdd' })
    } else if (type === 'update' && typeof id === 'number') {
      push({ name: 'ErpLiveBroadcastingInfoEdit', params: { id } })
    } else {
      console.error('Invalid type or missing id for edit operation')
    }
  }

  /** 查看详情 */
  const openDetail = (id: number) => {
    push({ name: 'ErpLiveBroadcastingInfoDetail', params: { id } })
  }

  /** 选中操作 */
  const selectionList = ref<LiveBroadcastingInfoVO[]>([])
  const handleSelectionChange = (rows: LiveBroadcastingInfoVO[]) => {
    selectionList.value = rows
  }

  /** 删除按钮操作 */
  const handleDelete = async (ids: number[]) => {
    try {
      await message.delConfirm()
      await LiveBroadcastingInfoApi.deleteLiveBroadcastingInfo(ids)
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
      const data = await LiveBroadcastingInfoApi.exportLiveBroadcastingInfo(queryParams)
      download.excel(data, '直播信息.xlsx')
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

  /** 复制新增按钮操作 */
  const handleCopy = () => {
    if (selectionList.value.length !== 1) {
      message.warning('请选择一条数据进行复制')
      return
    }
    const copyData = selectionList.value[0]
    openFormWithCopyData(copyData)
  }

  /** 操作列复制按钮操作 */
  const handleCopyRow = (row: LiveBroadcastingInfoVO) => {
    openFormWithCopyData(row)
  }

  /** 打开表单页面并传递复制数据 */
  const openFormWithCopyData = (copyData: LiveBroadcastingInfoVO) => {
    // 清除不需要复制的字段
    const cleanCopyData = {
      ...copyData,
      id: undefined,
      no: '', // 编号需要重新生成
      createTime: undefined,
      updateTime: undefined,
      creator: undefined,
      updater: undefined
    }

    // 将复制数据存储到 sessionStorage
    sessionStorage.setItem('copyLiveBroadcastingInfoData', JSON.stringify(cleanCopyData))

    push({ name: 'ErpLiveBroadcastingInfoAdd', query: { copy: 'true' } })
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
