<!-- ERP 记事本列表 -->
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
        <el-form-item label="任务名称" prop="taskName">
          <el-input
            v-model="queryParams.taskName"
            placeholder="请输入任务名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="任务状态" prop="taskStatus">
          <el-select
            v-model="queryParams.taskStatus"
            placeholder="请选择任务状态"
            clearable
            class="!w-240px"
          >
            <el-option label="未开始" :value="0" />
            <el-option label="进行中" :value="1" />
            <el-option label="已完成" :value="2" />
          </el-select>
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
            v-hasPermi="['erp:notebook:create']"
          >
            <Icon icon="ep:plus" class="mr-5px" /> 新增
          </el-button>
          <el-button
            type="warning"
            plain
            @click="handleImport"
            v-hasPermi="['erp:notebook:import']"
          >
            <Icon icon="ep:upload" /> 导入
          </el-button>
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['erp:notebook:export']"
          >
            <Icon icon="ep:download" class="mr-5px" /> 导出
          </el-button>
          <el-button
            type="danger"
            plain
            @click="handleDelete(selectionList.map((item) => item.id))"
            v-hasPermi="['erp:notebook:delete']"
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
        <el-table-column label="任务名称" align="center" prop="taskName" />
<!--        <el-table-column label="任务状态" align="center" prop="taskStatus"/>-->
        <el-table-column label="任务状态" align="center"  prop="taskStatus">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ERP_NOTEBOOK_STATUS" :value="scope.row.taskStatus" />
          </template>
        </el-table-column>
        <el-table-column label="任务人员" align="center" prop="taskPerson">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.SYSTEM_USER_LIST" :value="scope.row.taskPerson" />
          </template>
        </el-table-column>
<!--        <el-table-column label="任务人员" align="center" prop="taskPerson" />-->
        <el-table-column label="备注信息" align="center" prop="remark" />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <el-button link type="primary" @click="openDetail(scope.row.id)"> 详情 </el-button>
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['erp:notebook:update']"
            >
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete([scope.row.id])"
              v-hasPermi="['erp:notebook:delete']"
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
    <NotebookImportForm ref="importFormRef" @success="getList" />
  </template>

  <script setup lang="ts">
  import { dateFormatter } from '@/utils/formatTime'
  import download from '@/utils/download'
  import { NotebookApi, NotebookVO } from '@/api/erp/notebook'
  import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
  import NotebookImportForm from './form/NotebookImportForm.vue'

  /** ERP 记事本列表 */
  defineOptions({ name: 'ErpNotebook' })

  const message = useMessage() // 消息弹窗
  const { t } = useI18n() // 国际化
  const { push } = useRouter() // 路由跳转

  const loading = ref(true) // 列表的加载中
  const list = ref<NotebookVO[]>([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    no: undefined,
    taskName: undefined,
    taskStatus: undefined,
    taskPerson: undefined,
    createTime: undefined
  })
  const queryFormRef = ref() // 搜索的表单
  const exportLoading = ref(false) // 导出的加载中
  const selectionList = ref<NotebookVO[]>([]) // 选中列表

  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      const data = await NotebookApi.getNotebookPage(queryParams)
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

  /** 选中操作 */
  const handleSelectionChange = (rows: NotebookVO[]) => {
    selectionList.value = rows
  }

  /** 删除按钮操作 */
  const handleDelete = async (ids: number[]) => {
    try {
      await message.delConfirm()
      await NotebookApi.deleteNotebook(ids)
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
      const data = await NotebookApi.exportNotebook(queryParams)
      download.excel(data, '记事本.xlsx')
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

  /** 打开表单页面 */
  const openForm = (type: string, id?: number) => {
    if (type === 'create') {
      push({ name: 'ErpNotebookAdd' })
    } else if (type === 'update' && typeof id === 'number') {
      push({ name: 'ErpNotebookEdit', params: { id } })
    } else {
      console.error('Invalid type or missing id for edit operation')
    }
  }

  /** 查看详情 */
  const openDetail = (id: number) => {
    push({ name: 'ErpNotebookDetail', params: { id } })
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
