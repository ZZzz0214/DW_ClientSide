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
      <el-form-item label="组品编码" prop="no">
        <el-input
          v-model="queryParams.no"
          placeholder="请输入组品编码"
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
      <el-form-item label="产品简称" prop="shortName">
        <el-input
          v-model="queryParams.shortName"
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
          v-hasPermi="['erp:combo-product:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleCopyAdd"
          :disabled="!selectedRows.length"
          v-hasPermi="['erp:combo-product:create']"
        >
          <Icon icon="ep:copy-document" class="mr-5px" /> 复制新增
        </el-button>
        <el-button
          type="warning"
          plain
          @click="handleImport"
          v-hasPermi="['erp:combo-product:import']"
        >
          <Icon icon="ep:upload" class="mr-5px" /> 导入
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
      <!-- 产品名称 -->
      <el-table-column label="组品编号" align="center" prop="no" :show-overflow-tooltip="false"/>
      <el-table-column label="产品图片" align="center" prop="image" width="100" :show-overflow-tooltip="false">
        <template #default="scope">
          <div class="image-container">
            <el-image
              v-if="getImageUrls(scope.row.image)[0]"
              style="width: 60px; height: 60px; border-radius: 4px;"
              :src="getImageUrls(scope.row.image)[0]"
              :preview-src-list="getImageUrls(scope.row.image)"
              :initial-index="0"
              fit="cover"
              preview-teleported
              append-to-body
              :z-index="9999"
              @error="handleImageError"
            >
              <template #error>
                <div class="image-error">
                  <Icon icon="ep:picture" style="font-size: 20px; color: #ccc;" />
                </div>
              </template>
            </el-image>
            <div v-else class="no-image">
              <Icon icon="ep:picture" style="font-size: 20px; color: #999;" />
              <span style="color: #999; font-size: 12px; margin-top: 4px;">暂无图片</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" align="center" prop="name" :show-overflow-tooltip="false"/>

      <!-- 产品简称 -->
      <el-table-column label="产品简称" align="center" prop="shortName" :show-overflow-tooltip="false"/>

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
      <el-table-column label="发货编码" align="center" prop="shippingCode" :show-overflow-tooltip="false"/>

      <!-- 批发单价 -->
      <el-table-column label="产品重量" align="center" prop="weight" :show-overflow-tooltip="false"/>

      <!-- 发货编码 -->
      <el-table-column label="采购人员" align="center" prop="purchaser" :show-overflow-tooltip="false"/>
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
            type="success"
            @click="handleQuickCopy(scope.row)"
            v-hasPermi="['erp:combo-product:create']"
          >
            复制
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
  <ComboImportForm ref="importFormRef" @success="getList" />
</template>

<script setup lang="ts">
import download from '@/utils/download'
import { ComboApi , ComboVO } from '@/api/erp/product/combo'
import ComboForm  from './ComboForm.vue'
import {dateFormatter} from "@/utils/formatTime";
import ComboImportForm from './form/ComboImportForm.vue'

/** ERP 产品列表 */
defineOptions({ name: 'ErpCombo' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { push } = useRouter() // 路由跳转

const loading = ref(true) // 列表的加载中
const list = ref<ComboVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const selectedRows = ref<ComboVO[]>([]) // 选中的行数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  no: undefined,
  name: undefined,
  shortName: undefined,
  shippingCode: undefined,
  purchaser: undefined,
  supplier: undefined,
  creator: undefined,
  createTime: undefined,
  keyword: undefined
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
    download.excel(data, '组合产品.xlsx')
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
    const data = await ComboApi.exportCombo2(queryParams)
    download.excel(data, '组合产品.xlsx')
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

/** 选择变化处理 */
const handleSelectionChange = (selection: ComboVO[]) => {
  selectedRows.value = selection
}

/** 复制新增按钮操作 */
const handleCopyAdd = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要复制的组品')
    return
  }
  
  if (selectedRows.value.length > 1) {
    message.warning('只能选择一个组品进行复制')
    return
  }
  
  const selectedCombo = selectedRows.value[0]
  // 跳转到新增页面，并传递复制的数据
  push({ 
    name: 'ErpComboAdd', 
    query: { 
      copyFrom: selectedCombo.id,
      copyData: JSON.stringify({
        ...selectedCombo,
        id: undefined, // 清除ID，作为新增
        no: undefined, // 清除编号，让后端重新生成
        name: selectedCombo.name + '_副本', // 在名称后添加副本标识
        createTime: undefined, // 清除创建时间
        updateTime: undefined // 清除更新时间
      })
    }
  })
  
  message.success(`已复制组品"${selectedCombo.name}"的数据，请修改后保存`)
}

/** 快速复制单个组品 */
const handleQuickCopy = (combo: ComboVO) => {
  // 跳转到新增页面，并传递复制的数据
  push({ 
    name: 'ErpComboAdd', 
    query: { 
      copyFrom: combo.id,
      copyData: JSON.stringify({
        ...combo,
        id: undefined, // 清除ID，作为新增
        no: undefined, // 清除编号，让后端重新生成
        name: combo.name + '_副本', // 在名称后添加副本标识
        createTime: undefined, // 清除创建时间
        updateTime: undefined // 清除更新时间
      })
    }
  })
  
  message.success(`已复制组品"${combo.name}"的数据，请修改后保存`)
}

/** 获取图片URLs */
const getImageUrls = (images: string | undefined): string[] => {
  if (!images) return []
  return images.split(',').map(img => img.trim()).filter(img => img)
}

/** 图片加载错误处理 */
const handleImageError = (error: any) => {
  console.warn('图片加载失败:', error)
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

<style scoped lang="scss">
// 确保图片预览弹窗不被遮挡 - 全局样式覆盖
:global(.el-image-viewer__wrapper) {
  z-index: 10000 !important;
}

:global(.el-image-viewer__mask) {
  z-index: 9999 !important;
}

:global(.el-image-viewer) {
  z-index: 10000 !important;
}

:global(.el-image-viewer__canvas) {
  z-index: 10001 !important;
}

:global(.el-image-viewer__actions) {
  z-index: 10002 !important;
}

:global(.el-image-viewer__close) {
  z-index: 10003 !important;
}

// 确保图片预览弹窗不被遮挡
:deep(.el-image-viewer__wrapper) {
  z-index: 10000 !important;
}

:deep(.el-image-viewer__mask) {
  z-index: 9999 !important;
}

// 图片容器样式
.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.no-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: #f5f7fa;
  border-radius: 4px;
  border: 1px dashed #dcdfe6;
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: #f5f7fa;
  border-radius: 4px;
}

// 图片预览样式优化
:deep(.el-image) {
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

// 表格行样式优化
:deep(.el-table__row) {
  &:hover {
    background-color: #f5f7fa;
  }
}

// 选择框样式
:deep(.el-table__header .el-checkbox) {
  .el-checkbox__inner {
    border-color: #667eea;
    
    &:hover {
      border-color: #667eea;
    }
  }
  
  &.is-checked .el-checkbox__inner {
    background-color: #667eea;
    border-color: #667eea;
  }
}

:deep(.el-table__body .el-checkbox) {
  .el-checkbox__inner {
    &:hover {
      border-color: #667eea;
    }
  }
  
  &.is-checked .el-checkbox__inner {
    background-color: #667eea;
    border-color: #667eea;
  }
}
</style>
