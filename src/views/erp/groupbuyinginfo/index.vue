<!-- ERP 团购信息列表 -->
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
          <el-input
            v-model="queryParams.customerName"
            placeholder="请输入客户名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="客户职位" prop="customerPosition">
          <el-input
            v-model="queryParams.customerPosition"
            placeholder="请输入客户职位"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="客户微信" prop="customerWechat">
          <el-input
            v-model="queryParams.customerWechat"
            placeholder="请输入客户微信"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>

        <el-form-item label="平台名称" prop="platformName">
          <el-input
            v-model="queryParams.platformName"
            placeholder="请输入平台名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="客户属性" prop="customerAttribute">
          <el-input
            v-model="queryParams.customerAttribute"
            placeholder="请输入客户属性"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="客户城市" prop="customerCity">
          <el-input
            v-model="queryParams.customerCity"
            placeholder="请输入客户城市"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>

        <el-form-item label="客户区县" prop="customerDistrict">
          <el-input
            v-model="queryParams.customerDistrict"
            placeholder="请输入客户区县"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>

        <el-form-item label="用户画像" prop="userPortrait">
          <el-input
            v-model="queryParams.userPortrait"
            placeholder="请输入用户画像"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="招商类目" prop="recruitmentCategory">
          <el-input
            v-model="queryParams.recruitmentCategory"
            placeholder="请输入招商类目"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="选品标准" prop="selectionCriteria">
          <el-input
            v-model="queryParams.selectionCriteria"
            placeholder="请输入平台名称"
            clearable
            @keyup.enter="handleQuery"
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
            v-hasPermi="['erp:groupbuyinginfo:create']"
          >
            <Icon icon="ep:plus" class="mr-5px" /> 新增
          </el-button>
          <el-button
            type="warning"
            plain
            @click="handleImport"
            v-hasPermi="['erp:groupbuyinginfo:import']"
          >
            <Icon icon="ep:upload" /> 导入
          </el-button>
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['erp:groupbuyinginfo:export']"
          >
            <Icon icon="ep:download" class="mr-5px" /> 导出
          </el-button>
          <el-button
            type="danger"
            plain
            @click="handleDelete(selectionList.map((item) => item.id))"
            v-hasPermi="['erp:groupbuyinginfo:delete']"
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
        <el-table-column label="编号" align="center" prop="no" :show-overflow-tooltip="false"/>
        <el-table-column label="客户名称" align="center" prop="customerName" :show-overflow-tooltip="false"/>
<!--        <el-table-column label="客户职位" align="center" prop="customerPosition" />-->
        <el-table-column label="客户职位" align="center" prop="customerPosition">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ERP_CUSTOMER_POSITION" :value="scope.row.customerPosition" />
          </template>
        </el-table-column>
        <el-table-column label="客户微信" align="center" prop="customerWechat" :show-overflow-tooltip="false"/>
<!--        <el-table-column label="平台名称" align="center" prop="platformName" />-->
        <el-table-column label="平台名称" align="center" prop="platformName">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ERP_PLATFORM_NAME" :value="scope.row.platformName" />
          </template>
        </el-table-column>
<!--        <el-table-column label="客户属性" align="center" prop="customerAttribute" />-->
        <el-table-column label="客户属性" align="center" prop="customerAttribute">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ERP_CUSTOMER_ATTRIBUTE" :value="scope.row.customerAttribute" />
          </template>
        </el-table-column>
<!--        <el-table-column label="客户城市" align="center" prop="customerCity" />-->
        <el-table-column label="客户城市" align="center" prop="customerCity">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ERP_CUSTOMER_CITY" :value="scope.row.customerCity" />
          </template>
        </el-table-column>
<!--        <el-table-column label="客户区县" align="center" prop="customerDistrict" />-->
        <el-table-column label="客户区县" align="center" prop="customerDistrict">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ERP_CUSTOMER_DISTRICT" :value="scope.row.customerDistrict" />
          </template>
        </el-table-column>
        <el-table-column label="选品标准" align="center" prop="selectionCriteria" :show-overflow-tooltip="false"/>
        <el-table-column label="创建人员" align="center" prop="creator"  :show-overflow-tooltip="false"/>
        <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatter" width="180px" />
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <el-button link type="primary" @click="openDetail(scope.row.id)"> 详情 </el-button>
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['erp:groupbuyinginfo:update']"
            >
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete([scope.row.id])"
              v-hasPermi="['erp:groupbuyinginfo:delete']"
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
    <GroupBuyingInfoImportForm ref="importFormRef" @success="getList" />
  </template>

  <script setup lang="ts">
  import { dateFormatter } from '@/utils/formatTime'
  import { DICT_TYPE } from '@/utils/dict'
  import download from '@/utils/download'
  import { GroupBuyingInfoApi, GroupBuyingInfoVO } from '@/api/erp/groupbuyinginfo'
  import GroupBuyingInfoImportForm from './form/GroupBuyingInfoImportForm.vue'

  /** ERP 团购信息列表 */
  defineOptions({ name: 'ErpGroupBuyingInfo' })

  const message = useMessage() // 消息弹窗
  const { t } = useI18n() // 国际化
  const { push } = useRouter() // 路由跳转

  const loading = ref(true) // 列表的加载中
  const list = ref<GroupBuyingInfoVO[]>([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    no: undefined,
    customerName: undefined,
    platformName: undefined,
    customerCity: undefined
  })
  const queryFormRef = ref() // 搜索的表单
  const exportLoading = ref(false) // 导出的加载中

  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      const data = await GroupBuyingInfoApi.getGroupBuyingInfoPage(queryParams)
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
      push({ name: 'ErpGroupBuyingInfoAdd' })
    } else if (type === 'update' && typeof id === 'number') {
      push({ name: 'ErpGroupBuyingInfoEdit', params: { id } })
    } else {
      console.error('Invalid type or missing id for edit operation')
    }
  }

  /** 查看详情 */
  const openDetail = (id: number) => {
    push({ name: 'ErpGroupBuyingInfoDetail', params: { id } })
  }

  /** 选中操作 */
  const selectionList = ref<GroupBuyingInfoVO[]>([])
  const handleSelectionChange = (rows: GroupBuyingInfoVO[]) => {
    selectionList.value = rows
  }

  /** 删除按钮操作 */
  const handleDelete = async (ids: number[]) => {
    try {
      await message.delConfirm()
      await GroupBuyingInfoApi.deleteGroupBuyingInfo(ids)
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
      const data = await GroupBuyingInfoApi.exportGroupBuyingInfo(queryParams)
      download.excel(data, '团购信息.xlsx')
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
