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
      <el-form-item label="产品编号" prop="no">
        <el-input
          v-model="queryParams.no"
          placeholder="请输入产品编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
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
        <el-select
          v-model="queryParams.brand"
          placeholder="请选择品牌名称"
          clearable
          filterable
          :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRODUCT_BRAND)"
          class="!w-240px"
        >
          <el-option
            v-for="dict in filteredBrandOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产品品类" prop="categoryId">
        <el-select
          v-model="queryParams.categoryId"
          placeholder="请选择产品品类"
          clearable
          filterable
          :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRODUCT_CATEGORY)"
          class="!w-240px"
        >
          <el-option
            v-for="dict in filteredCategoryOptions"
            :key="dict.value"
            :label="dict.label"
            :value="Number(dict.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产品状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择产品状态"
          clearable
          filterable
          :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_PRODUCT_STATUS)"
          class="!w-240px"
        >
          <el-option
            v-for="dict in filteredStatusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="Number(dict.value)"
          />
        </el-select>
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
          type="success"
          plain
          @click="handleCopyAdd"
          :disabled="!selectedRows.length"
          v-hasPermi="['erp:product:CopyCreate']"
        >
          <Icon icon="ep:copy-document" class="mr-5px" /> 复制新增
        </el-button>
        <el-button
          type="danger"
          plain
          @click="handleBatchDelete"
          :disabled="!selectedRows.length"
          v-hasPermi="['erp:product:Batchdelete']"
        >
          <Icon icon="ep:delete" class="mr-5px" /> 批量删除
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
    :cell-style="{padding: '10px 0', whiteSpace: 'normal', wordBreak: 'break-all'}"
    @selection-change="handleSelectionChange"
    ref="tableRef">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="产品编号" align="center" prop="no" min-width="140" :show-overflow-tooltip="false"/>
      <el-table-column label="产品图片" align="center" prop="image" width="100" :show-overflow-tooltip="false">
        <template #default="scope">
          <div v-if="getImageUrls(scope.row.image).length > 0" class="relative">
            <el-image
              :src="getImageUrls(scope.row.image)[0]"
              :preview-src-list="getImageUrls(scope.row.image)"
              class="w-12 h-12 rounded"
              fit="cover"
              :preview-teleported="true"
            />
            <div
              v-if="getImageUrls(scope.row.image).length > 1"
              class="absolute top-1/2 -right-2 transform -translate-y-1/2 bg-green-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg border-2 border-white z-10"
              style="font-size: 10px; font-weight: bold;"
            >
              {{ getImageUrls(scope.row.image).length }}
            </div>
          </div>
          <div v-else class="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
            <Icon icon="ep:picture" class="text-gray-400" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" align="center" prop="name" :show-overflow-tooltip="false" min-width="350"/>
      <el-table-column label="产品简称" align="center" prop="productShortName"  :show-overflow-tooltip="false"/>
      <el-table-column label="产品规格" align="center" prop="standard" :show-overflow-tooltip="false"/>
      <el-table-column label="产品日期" align="center" prop="productionDate" :show-overflow-tooltip="false" :formatter="dateFormatter2" min-width="140"/>
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
      <el-table-column label="操作" align="center" width="240">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openDetail(scope.row.id)"
          > 详情 </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['erp:product:update', 'erp:product:forget']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="success"
            @click="handleQuickCopy(scope.row)"
            v-hasPermi="['erp:product:CopyCreate']"
          >
            复制
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
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
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
const selectedRows = ref<ProductVO[]>([]) // 选中的行数据
const tableRef = ref() // 表格引用
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  no: undefined,
  name: undefined,
  productShortName: undefined,
  shippingCode: undefined,
  brand: undefined,
  categoryId: undefined,
  status: undefined,
  purchaser: undefined,
  supplier: undefined,
  creator: undefined,
  createTime: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const categoryList = ref<ProductCategoryVO[]>([]) // 产品分类列表

// 字典选项
const filteredBrandOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRODUCT_BRAND))
const filteredCategoryOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRODUCT_CATEGORY))
const filteredStatusOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRODUCT_STATUS))

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProductApi.getProductPage(queryParams)
    console.log(data.list)
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

/** 选择变化处理 */
const handleSelectionChange = (selection: ProductVO[]) => {
  selectedRows.value = selection
}

/** 复制新增按钮操作 */
const handleCopyAdd = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要复制的产品')
    return
  }

  if (selectedRows.value.length > 1) {
    message.warning('只能选择一个产品进行复制')
    return
  }

  const selectedProduct = selectedRows.value[0]
  // 跳转到新增页面，并传递复制的数据
  push({
    name: 'ErpProductAdd',
    query: {
      copyFrom: selectedProduct.id,
      copyData: JSON.stringify({
        ...selectedProduct,
        id: undefined, // 清除ID，作为新增
        no: undefined, // 清除编号，让后端重新生成
        createTime: undefined, // 清除创建时间
        updateTime: undefined // 清除更新时间
      })
    }
  })

  message.success(`已复制产品"${selectedProduct.name}"的数据，请修改后保存`)
}

/** 快速复制单个产品 */
const handleQuickCopy = (product: ProductVO) => {
  // 跳转到新增页面，并传递复制的数据
  push({
    name: 'ErpProductAdd',
    query: {
      copyFrom: product.id,
      copyData: JSON.stringify({
        ...product,
        id: undefined, // 清除ID，作为新增
        no: undefined, // 清除编号，让后端重新生成
        createTime: undefined, // 清除创建时间
        updateTime: undefined // 清除更新时间
      })
    }
  })

  message.success(`已复制产品"${product.name}"的数据，请修改后保存`)
}

/** 批量删除按钮操作 */
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要删除的产品')
    return
  }

  try {
    // 删除的二次确认
    await message.delConfirm(`确定要删除选中的 ${selectedRows.value.length} 个产品吗？`)

    // 提取选中的产品ID
    const ids = selectedRows.value.map(row => row.id)

    // 发起批量删除
    await ProductApi.deleteProducts(ids)
    message.success(`成功删除 ${selectedRows.value.length} 个产品`)

    // 清空选中状态
    selectedRows.value = []
    tableRef.value?.clearSelection()

    // 刷新列表
    await getList()
  } catch (error) {
    console.error('批量删除失败:', error)
  }
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

/** 获取图片URLs */
const getImageUrls = (images: string | undefined): string[] => {
  if (!images) return []
  return images.split(',').map(img => img.trim()).filter(img => img)
}

/** 字典选项过滤方法 */
const filterDictOptions = (value, dictType) => {
  const allOptions = getStrDictOptions(dictType)
  if (!value) {
    if (dictType === DICT_TYPE.ERP_PRODUCT_BRAND) {
      filteredBrandOptions.value = allOptions
    } else if (dictType === DICT_TYPE.ERP_PRODUCT_CATEGORY) {
      filteredCategoryOptions.value = allOptions
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
  } else if (dictType === DICT_TYPE.ERP_PRODUCT_CATEGORY) {
    filteredCategoryOptions.value = filtered
  } else if (dictType === DICT_TYPE.ERP_PRODUCT_STATUS) {
    filteredStatusOptions.value = filtered
  }
}
</script>
