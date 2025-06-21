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
      <el-form-item label="客户姓名" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户姓名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="客户职位" prop="customerPosition">
        <el-select
          v-model="queryParams.customerPosition"
          placeholder="请选择客户职位"
          clearable
          class="!w-240px"
          filterable
          :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRIVATE_CUSTOMER_POSITION)"
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
          :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRIVATE_PLATFORM_NAME)"
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
          :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRIVATE_CUSTOMER_ATTRIBUTE)"
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
          :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRIVATE_CUSTOMER_CITY)"
        >
          <el-option
            v-for="dict in filteredCustomerCityOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="客户区县" prop="customerDistrict">-->
<!--        <el-select-->
<!--          v-model="queryParams.customerDistrict"-->
<!--          placeholder="请选择客户区县"-->
<!--          clearable-->
<!--          class="!w-240px"-->
<!--          filterable-->
<!--          :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRIVATE_CUSTOMER_DISTRICT)"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="dict in filteredCustomerDistrictOptions"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
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
          v-hasPermi="['erp:private-broadcasting-info:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="warning"
          plain
          @click="handleImport"
          v-hasPermi="['erp:private-broadcasting-info:import']"
        >
          <Icon icon="ep:upload" /> 导入
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['erp:private-broadcasting-info:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button
          type="danger"
          plain
          @click="handleDelete(selectionList.map((item) => item.id))"
          v-hasPermi="['erp:private-broadcasting-info:delete']"
          :disabled="selectionList.length === 0"
        >
          <Icon icon="ep:delete" class="mr-5px" /> 删除
        </el-button>
        <el-button
          type="info"
          plain
          @click="handleCopy"
          :disabled="selectionList.length !== 1"
          v-hasPermi="['erp:private-broadcasting-info:create']"
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
      :show-overflow-tooltip="true"
      @selection-change="handleSelectionChange"
    >
      <el-table-column width="30" label="选择" type="selection" />
      <el-table-column label="编号" align="center" prop="no" />
      <el-table-column label="客户姓名" align="center" prop="customerName" />
      <el-table-column label="客户职位" align="center" prop="customerPosition">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ERP_PRIVATE_CUSTOMER_POSITION" :value="scope.row.customerPosition" />
        </template>
      </el-table-column>
      <el-table-column label="客户微信" align="center" prop="customerWechat" />
      <el-table-column label="平台名称" align="center" prop="platformName">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ERP_PRIVATE_PLATFORM_NAME" :value="scope.row.platformName" />
        </template>
      </el-table-column>
      <el-table-column label="客户属性" align="center" prop="customerAttribute">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ERP_PRIVATE_CUSTOMER_ATTRIBUTE" :value="scope.row.customerAttribute" />
        </template>
      </el-table-column>
      <el-table-column label="客户城市" align="center" prop="customerCity">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ERP_PRIVATE_CUSTOMER_CITY" :value="scope.row.customerCity" />
        </template>
      </el-table-column>
<!--      <el-table-column label="客户区县" align="center" prop="customerDistrict">-->
<!--        <template #default="scope">-->
<!--          <dict-tag :type="DICT_TYPE.ERP_PRIVATE_CUSTOMER_DISTRICT" :value="scope.row.customerDistrict" />-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="用户画像" align="center" prop="userPortrait" />-->
<!--      <el-table-column label="招商类目" align="center" prop="recruitmentCategory" />-->
<!--      <el-table-column label="选品标准" align="center" prop="selectionCriteria" />-->
<!--      <el-table-column label="备注信息" align="center" prop="remark" />-->
      <el-table-column label="创建人员" align="center" prop="creator"  :show-overflow-tooltip="false"/>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" width="240">
        <template #default="scope">
          <el-button link type="primary" @click="openDetail(scope.row.id)"> 详情 </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['erp:private-broadcasting-info:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="info"
            @click="handleCopyRow(scope.row)"
            v-hasPermi="['erp:private-broadcasting-info:create']"
          >
            复制
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete([scope.row.id])"
            v-hasPermi="['erp:private-broadcasting-info:delete']"
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
  <PrivateBroadcastingInfoImportForm ref="importFormRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ErpPrivateBroadcastingInfoApi, ErpPrivateBroadcastingInfoRespVO } from '@/api/erp/privateBroadcastingInfo'
import PrivateBroadcastingInfoImportForm from './form/PrivateBroadcastingInfoImportForm.vue'
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'

/** ERP 私播信息列表 */
defineOptions({ name: 'ErpPrivateBroadcastingInfo' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { push } = useRouter() // 路由跳转

const loading = ref(true) // 列表的加载中
const list = ref<ErpPrivateBroadcastingInfoRespVO[]>([]) // 列表的数据
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
  customerDistrict: undefined,
  creator: undefined,
  createTime: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const selectionList = ref<ErpPrivateBroadcastingInfoRespVO[]>([]) // 选中列表

// 字典选项
const filteredCustomerPositionOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRIVATE_CUSTOMER_POSITION))
const filteredPlatformNameOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRIVATE_PLATFORM_NAME))
const filteredCustomerAttributeOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRIVATE_CUSTOMER_ATTRIBUTE))
const filteredCustomerCityOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRIVATE_CUSTOMER_CITY))
const filteredCustomerDistrictOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRIVATE_CUSTOMER_DISTRICT))

// 字典过滤方法
const filterDictOptions = (value, dictType) => {
  const allOptions = getStrDictOptions(dictType)
  if (!value) {
    if (dictType === DICT_TYPE.ERP_PRIVATE_CUSTOMER_POSITION) {
      filteredCustomerPositionOptions.value = allOptions
    } else if (dictType === DICT_TYPE.ERP_PRIVATE_PLATFORM_NAME) {
      filteredPlatformNameOptions.value = allOptions
    } else if (dictType === DICT_TYPE.ERP_PRIVATE_CUSTOMER_ATTRIBUTE) {
      filteredCustomerAttributeOptions.value = allOptions
    } else if (dictType === DICT_TYPE.ERP_PRIVATE_CUSTOMER_CITY) {
      filteredCustomerCityOptions.value = allOptions
    } else if (dictType === DICT_TYPE.ERP_PRIVATE_CUSTOMER_DISTRICT) {
      filteredCustomerDistrictOptions.value = allOptions
    }
    return
  }
  const filtered = allOptions.filter(item =>
    item.label.toLowerCase().includes(value.toLowerCase())
  )
  if (dictType === DICT_TYPE.ERP_PRIVATE_CUSTOMER_POSITION) {
    filteredCustomerPositionOptions.value = filtered
  } else if (dictType === DICT_TYPE.ERP_PRIVATE_PLATFORM_NAME) {
    filteredPlatformNameOptions.value = filtered
  } else if (dictType === DICT_TYPE.ERP_PRIVATE_CUSTOMER_ATTRIBUTE) {
    filteredCustomerAttributeOptions.value = filtered
  } else if (dictType === DICT_TYPE.ERP_PRIVATE_CUSTOMER_CITY) {
    filteredCustomerCityOptions.value = filtered
  } else if (dictType === DICT_TYPE.ERP_PRIVATE_CUSTOMER_DISTRICT) {
    filteredCustomerDistrictOptions.value = filtered
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ErpPrivateBroadcastingInfoApi.getPrivateBroadcastingInfoPage(queryParams)
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
  // 重置字典过滤选项
  filteredCustomerPositionOptions.value = getStrDictOptions(DICT_TYPE.ERP_PRIVATE_CUSTOMER_POSITION)
  filteredPlatformNameOptions.value = getStrDictOptions(DICT_TYPE.ERP_PRIVATE_PLATFORM_NAME)
  filteredCustomerAttributeOptions.value = getStrDictOptions(DICT_TYPE.ERP_PRIVATE_CUSTOMER_ATTRIBUTE)
  filteredCustomerCityOptions.value = getStrDictOptions(DICT_TYPE.ERP_PRIVATE_CUSTOMER_CITY)
  filteredCustomerDistrictOptions.value = getStrDictOptions(DICT_TYPE.ERP_PRIVATE_CUSTOMER_DISTRICT)
  handleQuery()
}

/** 选中操作 */
const handleSelectionChange = (rows: ErpPrivateBroadcastingInfoRespVO[]) => {
  selectionList.value = rows
}

/** 删除按钮操作 */
const handleDelete = async (ids: number[]) => {
  try {
    await message.delConfirm()
    await ErpPrivateBroadcastingInfoApi.deletePrivateBroadcastingInfo(ids)
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
    const data = await ErpPrivateBroadcastingInfoApi.exportPrivateBroadcastingInfo(queryParams)
    download.excel(data, '私播信息.xlsx')
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
const handleCopyRow = (row: ErpPrivateBroadcastingInfoRespVO) => {
  openFormWithCopyData(row)
}

/** 打开表单页面并传递复制数据 */
const openFormWithCopyData = (copyData: ErpPrivateBroadcastingInfoRespVO) => {
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
  sessionStorage.setItem('copyPrivateBroadcastingInfoData', JSON.stringify(cleanCopyData))
  
  push({ name: 'ErpPrivateBroadcastingInfoAdd', query: { copy: 'true' } })
}

/** 打开表单页面 */
const openForm = (type: string, id?: number) => {
  if (type === 'create') {
    // 清除可能存在的复制数据
    sessionStorage.removeItem('copyPrivateBroadcastingInfoData')
    push({ name: 'ErpPrivateBroadcastingInfoAdd' })
  } else if (type === 'update' && typeof id === 'number') {
    push({ name: 'ErpPrivateBroadcastingInfoEdit', params: { id } })
  } else {
    console.error('Invalid type or missing id for edit operation')
  }
}

/** 查看详情 */
const openDetail = (id: number) => {
  push({ name: 'ErpPrivateBroadcastingInfoDetail', params: { id } })
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
