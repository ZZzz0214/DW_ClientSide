<!-- ERP 产品列表 -->
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
      <el-form-item label="产品名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
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
      <el-form-item label="发货编码" prop="shippingCode">
        <el-input
          v-model="queryParams.shippingCode"
          placeholder="请输入发货编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="品牌名称" prop="brand">
        <el-input
          v-model="queryParams.brand"
          placeholder="请输入品牌名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="产品品类" prop="categoryId">
        <el-input
          v-model="queryParams.categoryId"
          placeholder="请输入产品品类"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="产品状态" prop="status">
        <el-input
          v-model="queryParams.status"
          placeholder="请输入产品状态"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="采购人员" prop="purchaser">
        <el-input
          v-model="queryParams.purchaser"
          placeholder="请输入采购人员"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="供应商名" prop="supplier">
        <el-input
          v-model="queryParams.supplier"
          placeholder="请输入供应商名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
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
          v-hasPermi="['erp:product:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>

        <el-button
          type="warning"
          plain
          @click="handleImport"
          v-hasPermi="['erp:product:create']"
        >
          <Icon icon="ep:upload" /> 导入
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['erp:product:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 基础导出
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport2"
          :loading="exportLoading"
          v-hasPermi="['erp:purchaseproduct:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 采购导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true"
    :row-style="{height: '80px'}"
    :cell-style="{padding: '10px 0', whiteSpace: 'normal', wordBreak: 'break-all'}">
      <el-table-column label="产品编号" align="center" prop="no" :show-overflow-tooltip="false"/>
      <el-table-column label="产品图片" align="center" prop="name" :show-overflow-tooltip="false"/>
      <el-table-column label="产品名称" align="center" prop="name" :show-overflow-tooltip="false"/>
      <el-table-column label="产品简称" align="center" prop="productShortName"  :show-overflow-tooltip="false"/>
      <el-table-column label="产品规格" align="center" prop="standard" :show-overflow-tooltip="false"/>
      <el-table-column label="产品日期" align="center" prop="productionDate" :show-overflow-tooltip="false" :formatter="dateFormatter2"/>
      <el-table-column
        label="品牌名称"
        align="center"
        prop="brand"
        :show-overflow-tooltip="false"
      >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ERP_PRODUCT_BRAND" :value="scope.row.brand" />
        </template>
      </el-table-column>
      <el-table-column
        label="产品品类"
        align="center"
        prop="categoryId"
        :show-overflow-tooltip="false"
      >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ERP_PRODUCT_CATEGORY" :value="scope.row.categoryId" />
        </template>
      </el-table-column>
      <el-table-column
        label="产品状态"
        align="center"
        prop="status"
        :show-overflow-tooltip="false"
      >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ERP_PRODUCT_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--        label="阿里巴巴活动最低价"-->
<!--        align="center"-->
<!--        prop="alibabaEventMinimunPrice"-->
<!--      />-->
<!--      <el-table-column-->
<!--        label="团购活动最低价"-->
<!--        align="center"-->
<!--        prop="groupBuyEventMinimunPrice"-->
<!--      />-->
<!--      <el-table-column label="采购人员" align="center" prop="purchaser" />-->
<!--      <el-table-column-->
<!--        label="采购单价"-->
<!--        align="center"-->
<!--        prop="purchasePrice"-->
<!--        :formatter="erpPriceTableColumnFormatter"-->
<!--      />-->
<!--      <el-table-column-->
<!--        label="批发单价"-->
<!--        align="center"-->
<!--        prop="wholesalePrice"-->
<!--        :formatter="erpPriceTableColumnFormatter"-->
<!--      />-->
<!--      <el-table-column-->
<!--        label="对外最低采购单价"-->
<!--        align="center"-->
<!--        prop="minPurchasePrice"-->
<!--        :formatter="erpPriceTableColumnFormatter"-->
<!--      />-->
<!--      <el-table-column-->
<!--        label="对外最低批发单价"-->
<!--        align="center"-->
<!--        prop="minWholesalePrice"-->
<!--        :formatter="erpPriceTableColumnFormatter"-->
<!--      />-->
<!--      <el-table-column label="状态" align="center" prop="status">-->
<!--        <template #default="scope">-->
<!--          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />-->
<!--        </template>-->
<!--      </el-table-column>-->

      <el-table-column
        label="采购人员"
        align="center"
        prop="purchaser"
        :show-overflow-tooltip="false"
      />
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
            v-hasPermi="['erp:product:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['erp:product:delete']"
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
  <ProductImportForm ref="importFormRef" @success="getList" />

</template>

<script setup lang="ts">
import {dateFormatter, dateFormatter2} from '@/utils/formatTime'
import download from '@/utils/download'
import { ProductApi, ProductVO } from '@/api/erp/product/product'
import { ProductCategoryApi, ProductCategoryVO } from '@/api/erp/product/category'
import { DICT_TYPE } from '@/utils/dict'
import { defaultProps, handleTree } from '@/utils/tree'
import ProductImportForm from './form/ProductImportForm.vue'


/** ERP 产品列表 */
defineOptions({ name: 'ErpProduct' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { push } = useRouter() // 路由跳转

const loading = ref(true) // 列表的加载中
const list = ref<ProductVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  categoryId: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const categoryList = ref<ProductCategoryVO[]>([]) // 产品分类列表

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProductApi.getProductPage(queryParams)
    console.log(data.total)
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

const formRef = ref()
const openForm = (type: string, id?: number) => {
  if (type === 'create') {
    // 跳转到添加页面
    push({ name: 'ErpProductAdd' });
  } else if (type === 'update' && typeof id === 'number') {
    // 跳转到编辑页面，并传递 id
    push({ name: 'ErpProductEdit', params: { id } });
  } else {
    console.error('Invalid type or missing id for edit operation');
  }

};

/** 查看商品详情 */
const openDetail = (id: number) => {
  push({ name: 'ErpProductDetail', params: { id } })
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ProductApi.deleteProduct(id)
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
    const data = await ProductApi.exportProduct(queryParams)
    download.excel(data, '产品信息.xlsx')
  } catch {
  } finally {
    exportLoading.value = false
  }
}
const handleExport2 = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ProductApi.exportProduct2(queryParams)
    download.excel(data, '产品信息.xlsx')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/**导入操作**/
const importFormRef = ref()
const handleImport = () => {
  importFormRef.value.open()
}

/** 初始化 **/
const route = useRoute(); // 获取当前路由信息

onMounted(async () => {
  // 解析路由的 categoryId
  if (route.query.categoryId) {
    queryParams.categoryId = Number(route.query.categoryId); // 将 categoryId 赋值给查询参数
  }
  await getList(); // 获取列表数据

  // 获取产品分类数据
 const categoryData = await ProductCategoryApi.getProductCategorySimpleList();
  categoryList.value = handleTree(categoryData, 'id', 'parentId'); // 处理成树形结构
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
