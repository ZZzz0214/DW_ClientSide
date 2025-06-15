<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1080" top="5vh" style="max-height: 90vh;">
    <div style="max-height: calc(90vh - 150px); overflow-y: auto;">
      <el-form :model="searchForm" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="客户编号">
              <el-input v-model="searchForm.id" placeholder="请输入客户编号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户名称">
              <el-input v-model="searchForm.name" placeholder="请输入客户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话">
              <el-input v-model="searchForm.mobile" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-button @click="handleSearch" type="primary">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form>

      <el-table :data="customerList" @selection-change="handleSelectionChange" style="margin-top: 20px;">
        <el-table-column type="selection" width="55" />
        <el-table-column label="客户编号" prop="id" />
        <el-table-column label="客户名称" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column label="联系电话" prop="mobile" />
        <el-table-column label="客户地址" prop="address" />
      </el-table>

      <Pagination
        :total="total"
        v-model:page="searchForm.pageNo"
        v-model:limit="searchForm.pageSize"
        @pagination="handleSearch"
      />
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button @click="confirmSelection" type="primary">确 定</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { CustomerApi } from '@/api/erp/sale/customer'

const dialogVisible = ref(false)
const dialogTitle = ref('选择客户')

const searchForm = reactive({
  id: '',
  name: '',
  mobile: '',
  pageNo: 1,
  pageSize: 10
})

const customerList = ref<any[]>([])
const selectedCustomer = ref<any>(null)
const total = ref(0)

const handleSearch = async () => {
  try {
    console.log('搜索客户参数:', searchForm)
    const params = {
      id: searchForm.id,
      name: searchForm.name,
      mobile: searchForm.mobile,
      pageNo: searchForm.pageNo,
      pageSize: searchForm.pageSize
    }
    const response = await CustomerApi.searchCustomer(params)
    console.log('客户搜索结果:', response)
    
    if (Array.isArray(response)) {
      customerList.value = response
      total.value = response.length
    } else if (response && response.list) {
      customerList.value = response.list
      total.value = response.total || 0
    } else {
      customerList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('客户搜索失败:', error)
    ElMessage.error('查询客户失败')
    customerList.value = []
    total.value = 0
  }
}

const resetSearch = () => {
  Object.assign(searchForm, {
    id: '',
    name: '',
    mobile: '',
    pageNo: 1,
    pageSize: 10
  })
  handleSearch()
}

const handleSelectionChange = (selection: any[]) => {
  selectedCustomer.value = selection.length > 0 ? selection[0] : null
}

const confirmSelection = () => {
  if (!selectedCustomer.value) {
    ElMessage.warning('请选择一个客户')
    return
  }
  
  console.log('选择的客户:', selectedCustomer.value)
  emit('customer-selected', selectedCustomer.value)
  dialogVisible.value = false
}

const emit = defineEmits(['customer-selected'])

defineExpose({
  open: () => {
    console.log('CustomerSearchDialog open方法被调用')
    dialogVisible.value = true
    console.log('dialogVisible设置为:', dialogVisible.value)
    handleSearch() // 打开时自动加载数据
  }
})
</script> 