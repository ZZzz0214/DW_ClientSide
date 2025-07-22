<!-- ERP 库存列表 -->
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
        <el-form-item label="库存编号" prop="no">
          <el-input
            v-model="queryParams.no"
            placeholder="请输入库存编号"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="产品编号" prop="productNo">
          <el-input
            v-model="queryParams.productNo"
            placeholder="请输入产品编号"
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
        <el-form-item label="产品简称" prop="productShortName">
          <el-input
            v-model="queryParams.productShortName"
            placeholder="请输入产品简称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="品牌名称" prop="brand">
          <el-select
            v-model="queryParams.brand"
            placeholder="请选择品牌名称"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.ERP_PRODUCT_BRAND)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品品类" prop="category">
          <el-select
            v-model="queryParams.category"
            placeholder="请选择产品品类"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.ERP_PRODUCT_CATEGORY)"
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
            v-hasPermi="['erp:inventory:create']"
          >
            <Icon icon="ep:plus" class="mr-5px" /> 新增
          </el-button>
          <el-button
            type="warning"
            plain
            @click="handleImport"
            v-hasPermi="['erp:inventory:import']"
          >
            <Icon icon="ep:upload" /> 导入
          </el-button>
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['erp:inventory:export']"
          >
            <Icon icon="ep:download" class="mr-5px" /> 导出
          </el-button>
          <el-button
            type="danger"
            plain
            @click="handleDelete(selectionList.map((item) => item.id))"
            v-hasPermi="['erp:inventory:delete']"
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
        <el-table-column label="编号" align="center" prop="no" :show-overflow-tooltip="false" min-width="140"/>
        <el-table-column label="产品编号" align="center" prop="productNo" :show-overflow-tooltip="false" min-width="140"/>
        <el-table-column label="产品名称" align="center" prop="productName" :show-overflow-tooltip="false" min-width="350"/>
        <el-table-column label="产品简称" align="center" prop="productShortName" :show-overflow-tooltip="false"/>
        <el-table-column
          label="品牌名称"
          align="center"
          prop="brand"
          :show-overflow-tooltip="false"
          min-width="120"
        >
          <template #default="scope">
            <div style="white-space: pre-wrap; word-break: break-word; line-height: 1.4;">
              <dict-tag :type="DICT_TYPE.ERP_PRODUCT_BRAND" :value="scope.row.brand" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="产品品类"
          align="center"
          prop="category"
        >
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ERP_PRODUCT_CATEGORY" :value="scope.row.category" />
          </template>
        </el-table-column>
        <el-table-column label="现货库存" align="center" prop="spotInventory" />
        <el-table-column label="剩余库存" align="center" prop="remainingInventory">
          <template #header>
            <span>剩余库存</span>
            <el-tooltip content="剩余库存 = 现货库存 - (该库存创建时间之后的代发订单中该产品的总数量 + 该库存创建时间之后的批发订单中该产品的总数量)，可以为负值" placement="top">
              <Icon icon="ep:question-filled" class="ml-1 text-gray-400" />
            </el-tooltip>
          </template>
          <template #default="scope">
            <span :class="scope.row.remainingInventory < 0 ? 'text-red-500 font-bold' : ''">
              {{ scope.row.remainingInventory }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="remark" :show-overflow-tooltip="false"/>
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
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <el-button link type="primary" @click="openDetail(scope.row.id)"> 详情 </el-button>
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['erp:inventory:update']"
            >
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete([scope.row.id])"
              v-hasPermi="['erp:inventory:delete']"
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
    <InventoryImportForm ref="importFormRef" @success="getList" />
  </template>

  <script setup lang="ts">
  import { dateFormatter } from '@/utils/formatTime'
  import download from '@/utils/download'
  import { InventoryApi, InventoryVO } from '@/api/erp/inventory'
  import InventoryImportForm from './form/InventoryImportForm.vue'
  import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'

  /** ERP 库存列表 */
  defineOptions({ name: 'ErpInventory' })

  const message = useMessage() // 消息弹窗
  const { t } = useI18n() // 国际化
  const { push } = useRouter() // 路由跳转

  const loading = ref(true) // 列表的加载中
  const list = ref<InventoryVO[]>([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    no: undefined,
    productNo: undefined,
    productName: undefined,
    productShortName: undefined,
    brand: undefined,
    category: undefined,
    spotInventory: undefined,
    remainingInventory: undefined,
    creator: undefined,
    createTime: undefined
  })
  const queryFormRef = ref() // 搜索的表单
  const exportLoading = ref(false) // 导出的加载中

  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      const data = await InventoryApi.getInventoryPage(queryParams)
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
      push({ name: 'ErpInventoryAdd' })
    } else if (type === 'update' && typeof id === 'number') {
      push({ name: 'ErpInventoryEdit', params: { id } })
    } else {
      console.error('Invalid type or missing id for edit operation')
    }
  }

  /** 查看库存详情 */
  const openDetail = (id: number) => {
    push({ name: 'ErpInventoryDetail', params: { id } })
  }
  /** 选中操作 */
  const selectionList = ref<InventoryVO[]>([])
  const handleSelectionChange = (rows: InventoryVO[]) => {
    selectionList.value = rows
  }
  /** 删除按钮操作 */
  const handleDelete = async (ids: number[]) => {
    try {
      await message.delConfirm()
      await InventoryApi.deleteInventory(ids)
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
      const data = await InventoryApi.exportInventory(queryParams)
      download.excel(data, '库存表.xlsx')
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
