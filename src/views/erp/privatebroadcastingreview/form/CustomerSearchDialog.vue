<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1080"
          top="5vh"
          style="max-height: 90vh;">
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
          <el-col :span="8">
            <el-form-item label="联系人">
              <el-input v-model="searchForm.contact" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户状态">
              <el-select v-model="searchForm.status" placeholder="请选择客户状态" clearable>
                <el-option label="启用" :value="0" />
                <el-option label="禁用" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button @click="handleSearch" type="primary">
              <Icon icon="ep:search" class="mr-5px" /> 查询
            </el-button>
            <el-button @click="resetQuery">
              <Icon icon="ep:refresh" class="mr-5px" /> 重置
            </el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table :data="customerList" @selection-change="handleSelectionChange" ref="table"
                v-loading="loading"
                :stripe="true" :show-overflow-tooltip="false" :row-style="{height: 'auto'}"
                :cell-style="{padding: '8px 4px', whiteSpace: 'normal', wordBreak: 'break-all'}">
        <el-table-column type="selection" width="55" />
        <el-table-column label="客户编号" prop="id" width="100" />
        <el-table-column label="客户名称" prop="name" min-width="150">
          <template #default="scope">
            <el-input
              v-model="scope.row.name"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 3 }"
              readonly
              style="border: none; background: transparent; resize: none;"
            />
          </template>
        </el-table-column>
        <el-table-column label="联系人" prop="contact" min-width="120">
          <template #default="scope">
            <el-input
              v-model="scope.row.contact"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 2 }"
              readonly
              style="border: none; background: transparent; resize: none;"
            />
          </template>
        </el-table-column>
        <el-table-column label="联系电话" prop="mobile" width="130" />
        <el-table-column label="电子邮箱" prop="email" min-width="150">
          <template #default="scope">
            <el-input
              v-model="scope.row.email"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 2 }"
              readonly
              style="border: none; background: transparent; resize: none;"
            />
          </template>
        </el-table-column>
        <el-table-column label="客户状态" prop="status" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
              {{ scope.row.status === 0 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" min-width="150">
          <template #default="scope">
            <el-input
              v-model="scope.row.remark"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 3 }"
              readonly
              style="border: none; background: transparent; resize: none;"
            />
          </template>
        </el-table-column>
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

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { CustomerApi } from '@/api/erp/sale/customer'

defineOptions({ name: 'CustomerSearchDialog' })

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'customerSelected'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const dialogTitle = ref('选择客户')
const loading = ref(false)
const customerList = ref([])
const total = ref(0)
const table = ref()
const selectedCustomer = ref<any>(null)

const searchForm = reactive({
  id: '',
  name: '',
  mobile: '',
  contact: '',
  status: '',
  pageNo: 1,
  pageSize: 10
})

/** 查询列表 */
const handleSearch = async () => {
  loading.value = true
  try {
    const response = await CustomerApi.searchCustomer(searchForm)
    
    if (response && response.list && Array.isArray(response.list)) {
      customerList.value = response.list
      total.value = response.total || 0
    } else if (Array.isArray(response)) {
      customerList.value = response
      total.value = response.length
    } else {
      customerList.value = []
      total.value = 0
    }
  } catch (error) {
    ElMessage.error('查询失败')
    customerList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

/** 重置查询 */
const resetQuery = () => {
  Object.assign(searchForm, {
    id: '',
    name: '',
    mobile: '',
    contact: '',
    status: '',
    pageNo: 1,
    pageSize: 10
  })
  handleSearch()
}

/** 选择变化事件 */
const handleSelectionChange = (selection: any[]) => {
  selectedCustomer.value = selection.length > 0 ? selection[0] : null
}

/** 确认选择 */
const confirmSelection = () => {
  if (!selectedCustomer.value) {
    ElMessage.warning('请选择一个客户')
    return
  }
  emit('customerSelected', selectedCustomer.value)
  dialogVisible.value = false
}

/** 监听弹窗打开 */
watch(
  () => props.visible,
  (val) => {
    if (val) {
      handleSearch()
      selectedCustomer.value = null
      if (table.value) {
        table.value.clearSelection()
      }
    }
  }
)
</script> 