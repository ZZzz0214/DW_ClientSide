<!-- ERP 组品列表 -->
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
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
<!--      <el-form-item label="分类" prop="categoryId">-->
<!--        <el-tree-select-->
<!--          v-model="queryParams.categoryId"-->
<!--          :data="categoryList"-->
<!--          :props="defaultProps"-->
<!--          check-strictly-->
<!--          default-expand-all-->
<!--          placeholder="请输入分类"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
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
          v-hasPermi="['erp:combo-product:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['erp:combo-product:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- 产品名称 -->
      <el-table-column label="组品编号" align="center" prop="no" />
      <el-table-column label="产品图片" align="center" prop="no" />
      <el-table-column label="产品名称" align="center" prop="name" />

      <!-- 产品简称 -->
      <el-table-column label="产品简称" align="center" prop="shortName" />

      <!-- 产品图片 -->
<!--      <el-table-column label="产品图片" align="center" prop="image">-->
<!--        <template #default="scope">-->
<!--          <el-image-->
<!--            v-if="scope.row.image"-->
<!--            style="width: 40px; height: 40px"-->
<!--            :src="scope.row.image"-->
<!--            :preview-src-list="[scope.row.image]"-->
<!--          />-->
<!--        </template>-->
<!--      </el-table-column>-->

      <!-- 采购单价 -->
      <el-table-column label="发货编码" align="center" prop="shippingCode" />

      <!-- 批发单价 -->
      <el-table-column label="产品重量" align="center" prop="weight" />

      <!-- 发货编码 -->
      <el-table-column label="采购人员" align="center" prop="purchaser" />

      <!-- 产品数量 -->
<!--      <el-table-column label="产品数量" align="center" prop="totalQuantity" />-->

      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <el-button link type="primary" @click="openDetail(scope.row.id)"> 详情 </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['erp:combo-product:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['erp:combo-product:delete']"
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

</template>

<script setup lang="ts">
import download from '@/utils/download'
import { ComboApi , ComboVO } from '@/api/erp/product/combo'
import ComboForm  from './ComboForm.vue'


/** ERP 产品列表 */
defineOptions({ name: 'ErpCombo' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { push } = useRouter() // 路由跳转

const loading = ref(true) // 列表的加载中
const list = ref<ComboVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  // categoryId: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
// const categoryList = ref<ComboCategoryVO[]>([]) // 产品分类列表

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ComboApi.getComboPage(queryParams)
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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  if (type === 'create') {
    // 跳转到添加页面
    push({ name: 'ErpComboAdd' });
  } else if (type === 'update' && typeof id === 'number') {
    // 跳转到编辑页面，并传递 id
    push({ name: 'ErpComboEdit', params: { id } });
  } else {
    console.error('Invalid type or missing id for edit operation');
  }
};

/** 查看商品详情 */
const openDetail = (id: number) => {
  push({ name: 'ErpComboDetail', params: { id } })
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ComboApi.deleteCombo(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ComboApi.exportCombo(queryParams)
    download.excel(data, '组合产品.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
const route = useRoute(); // 获取当前路由信息

onMounted(async () => {
  await getList(); // 获取列表数据
});

onUpdated(async () => {
  // 检测是否需要刷新列表
  const shouldRefresh = localStorage.getItem('refreshList');
  if (shouldRefresh) {
    localStorage.removeItem('refreshList'); // 清除标志
    await getList(); // 刷新数据
  }
});
</script>
