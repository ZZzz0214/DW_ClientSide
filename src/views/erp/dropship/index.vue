<!-- ERP 代发辅助列表 -->
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
        <el-form-item label="原表商品" prop="originalProduct">
          <el-input
            v-model="queryParams.originalProduct"
            placeholder="请输入原表商品"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="原表规格" prop="originalSpec">
          <el-input
            v-model="queryParams.originalSpec"
            placeholder="请输入原表规格"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="组品编号" prop="comboProductId">
          <el-input
            v-model="queryParams.comboProductId"
            placeholder="请输入组品编号"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="发货编码" prop="shippingCode">
          <el-input
            v-model="queryParams.shippingCode"
            placeholder="请输入发货编码"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
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
        <el-form-item label="状态信息" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态信息"
            clearable
            filterable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.ERP_DROPSHIP_STATUS)"
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
            v-hasPermi="['erp:dropship:create']"
          >
            <Icon icon="ep:plus" class="mr-5px" /> 新增
          </el-button>
          <el-button
            type="info"
            plain
            @click="handleCopyCreate"
            v-hasPermi="['erp:dropship:CopyCreate']"
            :disabled="selectionList.length !== 1"
          >
            <Icon icon="ep:copy-document" class="mr-5px" /> 复制新增
          </el-button>

          <el-button
          type="warning"
          plain
          @click="handleImport"
          v-hasPermi="['erp:dropship:import']"
        >
          <Icon icon="ep:upload" /> 导入
        </el-button>

          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['erp:dropship:export']"
          >
            <Icon icon="ep:download" class="mr-5px" /> 导出
          </el-button>
          <el-button
            type="danger"
            plain
            @click="handleDelete(selectionList.map((item) => item.id))"
            v-hasPermi="['erp:dropship:delete']"
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
        <el-table-column label="编号" align="center" prop="no" min-width="140" :show-overflow-tooltip="false"/>
        <el-table-column label="原表商品" align="center" prop="originalProduct" min-width="350" :show-overflow-tooltip="false"/>
        <el-table-column label="原表规格" align="center" prop="originalSpec" min-width="150" :show-overflow-tooltip="false"/>
        <el-table-column label="原表数量" align="center" prop="originalQuantity" :show-overflow-tooltip="false"/>
        <el-table-column label="组品编号" align="center" prop="comboProductNo" min-width="140" :show-overflow-tooltip="false"/>
        <el-table-column label="发货编码" align="center" prop="shippingCode" min-width="150" :show-overflow-tooltip="false"/>
        <el-table-column label="产品名称" align="center" prop="productName" min-width="350" :show-overflow-tooltip="false"/>
        <el-table-column label="产品规格" align="center" prop="productSpec" :show-overflow-tooltip="false"/>
        <el-table-column label="产品数量" align="center" prop="productQuantity" :show-overflow-tooltip="false"/>
        <el-table-column label="备注信息" align="center" prop="remark" :show-overflow-tooltip="false"/>
        <el-table-column
          label="状态信息"
          align="center"
          prop="status"
          :show-overflow-tooltip="false"
        >
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ERP_DROPSHIP_STATUS" :value="scope.row.status" />
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
              v-hasPermi="['erp:dropship:update']"
            >
              编辑
            </el-button>
            <el-button
              link
              type="info"
              @click="openForm('copy', scope.row.id)"
              v-hasPermi="['erp:dropship:create']"
            >
              复制
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete([scope.row.id])"
              v-hasPermi="['erp:dropship:delete']"
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
  <DropshipImportForm ref="importFormRef" @success="getList" />
  </template>

  <script setup lang="ts">
  import { dateFormatter } from '@/utils/formatTime'
  import download from '@/utils/download'
  import { DropshipAssistApi, DropshipAssistVO } from '@/api/erp/dropship'
  import DropshipImportForm from './form/DropshipImportForm.vue'
  import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'

  /** ERP 代发辅助列表 */
  defineOptions({ name: 'ErpDropshipAssist' })

  const message = useMessage() // 消息弹窗
  const { t } = useI18n() // 国际化
  const { push } = useRouter() // 路由跳转

  const loading = ref(true) // 列表的加载中
  const list = ref<DropshipAssistVO[]>([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    no: undefined,
    originalProduct: undefined,
    originalSpec: undefined,
    comboProductId: undefined,
    shippingCode: undefined,
    productName: undefined,
    productSpec: undefined,
    status: undefined,
    creator: undefined,
    createTime: undefined
  })
  const queryFormRef = ref() // 搜索的表单
  const exportLoading = ref(false) // 导出的加载中

  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      const data = await DropshipAssistApi.getDropshipAssistPage(queryParams)
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
      push({ name: 'ErpDropshipAssistAdd' })
    } else if (type === 'copy' && typeof id === 'number') {
      push({ name: 'ErpDropshipAssistAdd', query: { copyId: id } })
    } else if (type === 'update' && typeof id === 'number') {
      push({ name: 'ErpDropshipAssistEdit', params: { id } })
    } else {
      console.error('Invalid type or missing id for edit operation')
    }
  }

  /** 查看详情 */
  const openDetail = (id: number) => {
    push({ name: 'ErpDropshipAssistDetail', params: { id } })
  }

  /** 复制新增操作 */
  const handleCopyCreate = () => {
    if (selectionList.value.length !== 1) {
      message.warning('请选择一条数据进行复制')
      return
    }
    const selectedItem = selectionList.value[0]
    openForm('copy', selectedItem.id)
  }

  /** 选中操作 */
  const selectionList = ref<DropshipAssistVO[]>([])
  const handleSelectionChange = (rows: DropshipAssistVO[]) => {
    selectionList.value = rows
  }

  /** 删除按钮操作 */
  const handleDelete = async (ids: number[]) => {
    try {
      await message.delConfirm()
      await DropshipAssistApi.deleteDropshipAssist(ids)
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
      const data = await DropshipAssistApi.exportDropshipAssist(queryParams)
      download.excel(data, '代发辅助.xlsx')
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
    // 检测是否需要刷新列表
    const shouldRefresh = localStorage.getItem('refreshList');
    if (shouldRefresh) {
      localStorage.removeItem('refreshList'); // 清除标志
      await getList(); // 刷新数据
    }
  });
  </script>
