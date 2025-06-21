<!-- ERP 团购货盘列表 -->
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
        <el-form-item label="保质日期" prop="shelfLife">
          <el-date-picker
            v-model="queryParams.shelfLife"
            type="daterange"
            value-format="YYYY-MM-DD"
            class="!w-240px"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
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
        <el-form-item label="帮卖佣金" prop="sellingCommission">
          <el-input
            v-model="queryParams.sellingCommission"
            placeholder="请输入帮卖佣金"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="开团价格" prop="groupPrice">
          <el-input
            v-model="queryParams.groupPrice"
            placeholder="请输入开团价格"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
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
            v-hasPermi="['erp:groupbuying:create']"
          >
            <Icon icon="ep:plus" class="mr-5px" /> 新增
          </el-button>
          <el-button
            type="primary"
            plain
            @click="handleCopyCreate"
            v-hasPermi="['erp:groupbuying:create']"
            :disabled="selectionList.length !== 1"
          >
            <Icon icon="ep:document-copy" class="mr-5px" /> 复制新增
          </el-button>
          <el-button
            type="warning"
            plain
            @click="handleImport"
            v-hasPermi="['erp:groupbuying:import']"
          >
            <Icon icon="ep:upload" /> 导入
          </el-button>
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['erp:groupbuying:export']"
          >
            <Icon icon="ep:download" class="mr-5px" /> 导出
          </el-button>
          <el-button
            type="danger"
            plain
            @click="handleDelete(selectionList.map((item) => item.id))"
            v-hasPermi="['erp:groupbuying:delete']"
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
<!--        <el-table-column label="产品图片" align="center" prop="productImage">-->
<!--          <template #default="scope">-->
<!--            <el-image-->
<!--              v-if="scope.row.productImage"-->
<!--              :src="scope.row.productImage"-->
<!--              :preview-src-list="[scope.row.productImage]"-->
<!--              style="width: 60px; height: 60px"-->
<!--            />-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column
          label="品牌名称"
          align="center"
          prop="brandName"
          :show-overflow-tooltip="false"
        >
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ERP_PRODUCT_BRAND" :value="scope.row.brandName" />
          </template>
        </el-table-column>
        <el-table-column label="产品图片" align="center" prop="productImage" :show-overflow-tooltip="false">
          <template #default="scope">
            <el-image
              v-if="getFirstImage(scope.row.productImage)"
              :src="getFirstImage(scope.row.productImage)"
              :preview-src-list="getAllImages(scope.row.productImage)"
              style="width: 60px; height: 60px; border-radius: 4px;"
              fit="cover"
            />
            <span v-else class="no-image-text">暂无图片</span>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" align="center" prop="productName" :show-overflow-tooltip="false"/>
        <el-table-column label="产品规格" align="center" prop="productSpec" :show-overflow-tooltip="false"/>
        <el-table-column label="货盘状态" align="center" prop="status" :show-overflow-tooltip="false">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ERP_PRODUCT_STATUS" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="保质日期" align="center" prop="shelfLife" :formatter="dateFormatter2" width="180px" :show-overflow-tooltip="false"/>
        <el-table-column label="供团价格" align="center" prop="supplyGroupPrice"  :show-overflow-tooltip="false"/>
        <el-table-column label="帮卖佣金" align="center" prop="sellingCommission"  :show-overflow-tooltip="false"/>
        <el-table-column label="开团价格" align="center" prop="groupPrice"  :show-overflow-tooltip="false"/>
        <el-table-column label="创建人员" align="center" prop="creator"  :show-overflow-tooltip="false"/>
        <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatter" width="180px" />
        <el-table-column label="操作" align="center" width="240">
          <template #default="scope">
            <el-button link type="primary" @click="openDetail(scope.row.id)"> 详情 </el-button>
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['erp:groupbuying:update']"
            >
              编辑
            </el-button>
            <el-button
              link
              type="success"
              @click="handleCopyCreateSingle(scope.row)"
              v-hasPermi="['erp:groupbuying:create']"
            >
              复制
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete([scope.row.id])"
              v-hasPermi="['erp:groupbuying:delete']"
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
    <GroupBuyingImportForm ref="importFormRef" @success="getList" />
  </template>

  <script setup lang="ts">
  import {dateFormatter, dateFormatter2} from '@/utils/formatTime'
  import download from '@/utils/download'
  import { GroupBuyingApi, GroupBuyingVO } from '@/api/erp/groupbuying'
  import GroupBuyingImportForm from './form/GroupBuyingImportForm.vue'
  import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'

  /** ERP 团购货盘列表 */
  defineOptions({ name: 'ErpGroupBuying' })

  const message = useMessage() // 消息弹窗
  const { t } = useI18n() // 国际化
  const { push } = useRouter() // 路由跳转

  const loading = ref(true) // 列表的加载中
  const list = ref<GroupBuyingVO[]>([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    no: undefined,
    productName: undefined,
    brandName: undefined,
    productSpec: undefined,
    shelfLife: undefined,
    supplyGroupPrice: undefined,
    sellingCommission: undefined,
    groupPrice: undefined,
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
      const data = await GroupBuyingApi.getGroupBuyingPage(queryParams)
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
      push({ name: 'ErpGroupBuyingAdd' })
    } else if (type === 'update' && typeof id === 'number') {
      push({ name: 'ErpGroupBuyingEdit', params: { id } })
    } else {
      console.error('Invalid type or missing id for edit operation')
    }
  }

  /** 查看详情 */
  const openDetail = (id: number) => {
    push({ name: 'ErpGroupBuyingDetail', params: { id } })
  }

  /** 选中操作 */
  const selectionList = ref<GroupBuyingVO[]>([])
  const handleSelectionChange = (rows: GroupBuyingVO[]) => {
    selectionList.value = rows
  }

  /** 删除按钮操作 */
  const handleDelete = async (ids: number[]) => {
    try {
      await message.delConfirm()
      await GroupBuyingApi.deleteGroupBuying(ids)
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
      const data = await GroupBuyingApi.exportGroupBuying(queryParams)
      download.excel(data, '团购货盘.xlsx')
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
    // 存储复制的数据到localStorage，供表单页面使用
    localStorage.setItem('copyGroupBuyingData', JSON.stringify(selectedRow))
    push({ name: 'ErpGroupBuyingAdd', query: { copy: 'true' } })
  }

  /** 复制新增操作 - 单条记录 */
  const handleCopyCreateSingle = (row: GroupBuyingVO) => {
    // 存储复制的数据到localStorage，供表单页面使用
    localStorage.setItem('copyGroupBuyingData', JSON.stringify(row))
    push({ name: 'ErpGroupBuyingAdd', query: { copy: 'true' } })
  }

  /** 获取第一张图片 */
  const getFirstImage = (productImage: string) => {
    if (!productImage) return ''
    const images = productImage.split(',').filter(img => img.trim())
    return images.length > 0 ? images[0].trim() : ''
  }

  /** 获取所有图片列表 */
  const getAllImages = (productImage: string) => {
    if (!productImage) return []
    return productImage.split(',').filter(img => img.trim()).map(img => img.trim())
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

<style lang="scss" scoped>
.no-image-text {
  color: #999;
  font-size: 12px;
  display: inline-block;
  padding: 20px 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  width: 60px;
  height: 60px;
  line-height: 20px;
  text-align: center;
  box-sizing: border-box;
}
</style>
