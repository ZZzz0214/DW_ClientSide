<!-- ERP 团购复盘列表 -->
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
        <el-form-item label="产品SKU" prop="productSku">
          <el-input
            v-model="queryParams.productSku"
            placeholder="请输入产品SKU"
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
        <el-form-item label="供团价格" prop="supplyGroupPrice">
          <el-input
            v-model="queryParams.supplyGroupPrice"
            placeholder="请输入供团价格"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="快递费用" prop="expressFee">
          <el-input
            v-model="queryParams.expressFee"
            placeholder="请输入快递费用"
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
        <el-form-item label="开团日期" prop="groupStartDate">
          <el-date-picker
            v-model="queryParams.groupStartDate"
            type="daterange"
            value-format="YYYY-MM-DD"
            class="!w-240px"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="货盘状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择货盘状态"
            clearable
            class="!w-240px"
            filterable
            :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRODUCT_STATUS)"
          >
            <el-option
              v-for="dict in filteredStatusOptions"
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
            v-hasPermi="['erp:groupbuyingreview:create']"
          >
            <Icon icon="ep:plus" class="mr-5px" /> 新增
          </el-button>
          <el-button
            type="primary"
            plain
            @click="handleCopyCreate"
            v-hasPermi="['erp:groupbuyingreview:CopyCreate']"
            :disabled="selectionList.length !== 1"
          >
            <Icon icon="ep:document-copy" class="mr-5px" /> 复制新增
          </el-button>
          <el-button
            type="warning"
            plain
            @click="handleImport"
            v-hasPermi="['erp:groupbuyingreview:import']"
          >
            <Icon icon="ep:upload" /> 导入
          </el-button>
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['erp:groupbuyingreview:export']"
          >
            <Icon icon="ep:download" class="mr-5px" /> 导出
          </el-button>
          <el-button
            type="danger"
            plain
            @click="handleDelete(selectionList.map((item) => item.id))"
            v-hasPermi="['erp:groupbuyingreview:delete']"
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
        :row-style="{height: '80px'}"
        :cell-style="{padding: '10px 0', whiteSpace: 'normal', wordBreak: 'break-all'}"
      >
        <el-table-column width="30" label="选择" type="selection" />
        <el-table-column label="编号" align="center" prop="no" :show-overflow-tooltip="false" min-width="140"/>
        <el-table-column label="团购货盘编号" align="center" prop="groupBuyingNo" :show-overflow-tooltip="false" min-width="140"/>
        <el-table-column label="品牌名称" align="center" prop="brandName" :show-overflow-tooltip="false" min-width="100">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ERP_PRODUCT_BRAND" :value="scope.row.brandName" />
          </template>
        </el-table-column>
        <el-table-column label="产品名称" align="center" prop="productName" :show-overflow-tooltip="false" min-width="350"/>
        <el-table-column label="产品规格" align="center" prop="productSpec" :show-overflow-tooltip="false"/>

        <el-table-column label="客户名称" align="center" prop="customerName" :show-overflow-tooltip="false"/>
        <el-table-column label="供团价格" align="center" prop="supplyGroupPrice" :show-overflow-tooltip="false"/>
        <el-table-column label="快递费用" align="center" prop="expressFee" :show-overflow-tooltip="false"/>
        <el-table-column label="寄样日期" align="center" prop="sampleSendDate" :formatter="dateFormatter2" width="150px"/>
        <el-table-column label="开团日期" align="center" prop="groupStartDate" :formatter="dateFormatter2" width="150px"/>
        <el-table-column label="复团日期" align="center" prop="repeatGroupDate" :formatter="dateFormatter2" min-width="100"/>
        <el-table-column label="货盘状态" align="center" prop="status" :show-overflow-tooltip="false">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ERP_PRODUCT_STATUS" :value="scope.row.status" />
          </template>
        </el-table-column>
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
        <el-table-column label="操作" align="center" width="240">
          <template #default="scope">
            <el-button link type="primary" @click="openDetail(scope.row.id)"> 详情 </el-button>
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['erp:groupbuyingreview:update']"
            >
              编辑
            </el-button>
            <el-button
              link
              type="success"
              @click="handleCopyCreateSingle(scope.row)"
              v-hasPermi="['erp:groupbuyingreview:CopyCreate']"
            >
              复制
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete([scope.row.id])"
              v-hasPermi="['erp:groupbuyingreview:delete']"
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
    <!-- 在模板底部添加导入组件 -->
    <GroupBuyingReviewImportForm ref="importFormRef" @success="getList" />
  </template>

  <script setup lang="ts">
  import {dateFormatter, dateFormatter2} from '@/utils/formatTime'
  import download from '@/utils/download'
  import { GroupBuyingReviewApi, GroupBuyingReviewVO } from '@/api/erp/groupbuyingreview'
  import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
  import GroupBuyingReviewImportForm from './form/GroupBuyingReviewImportForm.vue'

  /** ERP 团购复盘列表 */
  defineOptions({ name: 'ErpGroupBuyingReview' })

  const message = useMessage() // 消息弹窗
  const { t } = useI18n() // 国际化
  const { push } = useRouter() // 路由跳转

  const loading = ref(true) // 列表的加载中
  const list = ref<GroupBuyingReviewVO[]>([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    no: undefined,
    brandName: undefined,
    productName: undefined,
    productSpec: undefined,
    productSku: undefined,
    customerName: undefined,
    supplyGroupPrice: undefined,
    expressFee: undefined,
    sampleSendDate: undefined,
    groupStartDate: undefined,
    status: undefined,
    creator: undefined,
    createTime: undefined
  })
  const queryFormRef = ref() // 搜索的表单
  const exportLoading = ref(false) // 导出的加载中

  // 字典选项
  const filteredBrandOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRODUCT_BRAND))
  const filteredStatusOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRODUCT_STATUS))

  // 字典过滤方法
  const filterDictOptions = (value, dictType) => {
    const allOptions = getStrDictOptions(dictType)
    if (!value) {
      if (dictType === DICT_TYPE.ERP_PRODUCT_BRAND) {
        filteredBrandOptions.value = allOptions
      } else if (dictType === DICT_TYPE.ERP_PRODUCT_STATUS) {
        filteredStatusOptions.value = allOptions
      }
      return
    }
    const filtered = allOptions.filter(item =>
      item.label.toLowerCase().includes(value.toLowerCase())
    )
    if (dictType === DICT_TYPE.ERP_PRODUCT_BRAND) {
      filteredBrandOptions.value = filtered
    } else if (dictType === DICT_TYPE.ERP_PRODUCT_STATUS) {
      filteredStatusOptions.value = filtered
    }
  }

  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      const data = await GroupBuyingReviewApi.getGroupBuyingReviewPage(queryParams)
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
    filteredBrandOptions.value = getStrDictOptions(DICT_TYPE.ERP_PRODUCT_BRAND)
    filteredStatusOptions.value = getStrDictOptions(DICT_TYPE.ERP_PRODUCT_STATUS)
    handleQuery()
  }

  const openForm = (type: string, id?: number) => {
    if (type === 'create') {
      push({ name: 'ErpGroupBuyingReviewAdd' })
    } else if (type === 'update' && typeof id === 'number') {
      push({ name: 'ErpGroupBuyingReviewEdit', params: { id } })
    } else {
      console.error('Invalid type or missing id for edit operation')
    }
  }

  /** 查看详情 */
  const openDetail = (id: number) => {
    push({ name: 'ErpGroupBuyingReviewDetail', params: { id } })
  }

  /** 选中操作 */
  const selectionList = ref<GroupBuyingReviewVO[]>([])
  const handleSelectionChange = (rows: GroupBuyingReviewVO[]) => {
    selectionList.value = rows
  }

  /** 删除按钮操作 */
  const handleDelete = async (ids: number[]) => {
    try {
      await message.delConfirm()
      await GroupBuyingReviewApi.deleteGroupBuyingReview(ids)
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
      const data = await GroupBuyingReviewApi.exportGroupBuyingReview(queryParams)
      download.excel(data, '团购复盘.xlsx')
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

  /** 复制新增操作 - 批量选择 */
  const handleCopyCreate = () => {
    if (selectionList.value.length !== 1) {
      message.warning('请选择一条记录进行复制')
      return
    }
    const selectedRow = selectionList.value[0]

    // 处理日期字段：将时间戳转换为YYYY-MM-DD格式
    const formatDate = (timestamp: any) => {
      if (!timestamp) return undefined
      if (typeof timestamp === 'string' && timestamp.includes('-')) {
        return timestamp // 已经是YYYY-MM-DD格式
      }
      if (typeof timestamp === 'number') {
        const date = new Date(timestamp)
        return date.toISOString().split('T')[0] // 转换为YYYY-MM-DD格式
      }
      return undefined
    }

    // 创建复制数据，格式化日期字段
    const copyData = {
      ...selectedRow,
      sampleSendDate: formatDate(selectedRow.sampleSendDate),
      groupStartDate: formatDate(selectedRow.groupStartDate),
      repeatGroupDate: formatDate(selectedRow.repeatGroupDate)
    }

    // 存储复制的数据到localStorage，供表单页面使用
    localStorage.setItem('copyGroupBuyingReviewData', JSON.stringify(copyData))
    push({ name: 'ErpGroupBuyingReviewAdd', query: { copy: 'true' } })
  }

  /** 复制新增操作 - 单条记录 */
  const handleCopyCreateSingle = (row: GroupBuyingReviewVO) => {
    // 处理日期字段：将时间戳转换为YYYY-MM-DD格式
    const formatDate = (timestamp: any) => {
      if (!timestamp) return undefined
      if (typeof timestamp === 'string' && timestamp.includes('-')) {
        return timestamp // 已经是YYYY-MM-DD格式
      }
      if (typeof timestamp === 'number') {
        const date = new Date(timestamp)
        return date.toISOString().split('T')[0] // 转换为YYYY-MM-DD格式
      }
      return undefined
    }

    // 创建复制数据，格式化日期字段
    const copyData = {
      ...row,
      sampleSendDate: formatDate(row.sampleSendDate),
      groupStartDate: formatDate(row.groupStartDate),
      repeatGroupDate: formatDate(row.repeatGroupDate)
    }

    // 存储复制的数据到localStorage，供表单页面使用
    localStorage.setItem('copyGroupBuyingReviewData', JSON.stringify(copyData))
    push({ name: 'ErpGroupBuyingReviewAdd', query: { copy: 'true' } })
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
