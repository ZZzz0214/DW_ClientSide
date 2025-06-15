<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1080" top="5vh" style="max-height: 90vh;">
    <div style="max-height: calc(90vh - 150px); overflow-y: auto;">
      <el-form :model="searchForm" label-width="100px">
        <!-- 搜索表单 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="产品编号">
              <el-input v-model="searchForm.no" placeholder="请输入产品编号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品名称">
              <el-input v-model="searchForm.name" placeholder="请输入产品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品简称">
              <el-input v-model="searchForm.productShortName" placeholder="请输入产品简称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌名称">
              <el-input v-model="searchForm.brand" placeholder="请输入品牌名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品品类">
              <el-input v-model="searchForm.categoryId" placeholder="请输入产品品类" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-button @click="handleQuery" type="primary">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form>

      <el-table :data="productList" @row-click="handleRowClick" highlight-current-row>
        <el-table-column width="55" label="选择">
          <template #default="{ row }">
            <el-radio :value="row.id" v-model="selectedProductId" @change="handleRadioChange(row)">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="产品编号" prop="no" />
        <el-table-column label="产品名称" prop="name" />
        <el-table-column label="产品简称" prop="productShortName" />
        <el-table-column label="品牌名称" prop="brand">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ERP_PRODUCT_BRAND" :value="scope.row.brand" />
          </template>
        </el-table-column>
        <el-table-column label="产品品类" prop="categoryId">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ERP_PRODUCT_CATEGORY" :value="scope.row.categoryId" />
          </template>
        </el-table-column>
        <el-table-column label="发货编码" prop="shippingCode" />
        <el-table-column label="产品重量" prop="weight" />
      </el-table>
      
      <!-- 分页组件 -->
      <Pagination
        :total="total"
        v-model:page="searchForm.pageNo"
        v-model:limit="searchForm.pageSize"
        @pagination="handleSearch"
      />
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button @click="confirmSelection" type="primary" :disabled="!selectedProduct">确 定</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import * as ProductApi from '@/api/erp/product/product/index'
import { DICT_TYPE } from '@/utils/dict'

const dialogVisible = ref(false)
const dialogTitle = ref('选择产品')

const searchForm = reactive({
  no: '',
  name: '',
  productShortName: '',
  brand: '',
  categoryId: '',
  pageNo: 1,
  pageSize: 10
})

const productList = ref<any[]>([])
const selectedProduct = ref<any>(null)
const selectedProductId = ref<number | null>(null)
const total = ref(0)

const handleSearch = async () => {
  try {
    const data = await ProductApi.ProductApi.getProductPage(searchForm)
    productList.value = data.list
    total.value = data.total
  } catch (error) {
    ElMessage.error('查询失败')
  }
}

const handleQuery = () => {
  searchForm.pageNo = 1
  handleSearch()
}

const resetQuery = () => {
  Object.assign(searchForm, {
    no: '',
    name: '',
    productShortName: '',
    brand: '',
    categoryId: '',
    pageNo: 1,
    pageSize: 10
  })
  handleSearch()
}

const handleRowClick = (row: any) => {
  selectedProduct.value = row
  selectedProductId.value = row.id
}

const handleRadioChange = (row: any) => {
  selectedProduct.value = row
}

const confirmSelection = () => {
  if (!selectedProduct.value) {
    ElMessage.warning('请选择一个产品')
    return
  }
  emit('selected', selectedProduct.value)
  dialogVisible.value = false
  // 重置选择
  selectedProduct.value = null
  selectedProductId.value = null
}

const open = () => {
  dialogVisible.value = true
  selectedProduct.value = null
  selectedProductId.value = null
  handleSearch()
}

defineExpose({ open })

const emit = defineEmits(['selected'])
</script> 