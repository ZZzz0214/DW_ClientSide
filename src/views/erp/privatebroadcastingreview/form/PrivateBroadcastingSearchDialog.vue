<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1080"
          top="5vh"
          style="max-height: 90vh;">
    <div style="max-height: calc(90vh - 150px); overflow-y: auto;">
      <el-form :model="queryParams" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="编号">
              <el-input v-model="queryParams.no" placeholder="请输入编号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品名称">
              <el-input v-model="queryParams.productName" placeholder="请输入产品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌名称">
              <el-select v-model="queryParams.brandName" placeholder="请选择品牌" clearable>
                <el-option
                  v-for="dict in brandOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品规格">
              <el-input v-model="queryParams.productSpec" placeholder="请输入产品规格" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货盘状态">
              <el-select v-model="queryParams.privateStatus" placeholder="请选择货盘状态" clearable>
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="Number(dict.value)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button @click="handleQuery" type="primary">
              <Icon icon="ep:search" class="mr-5px" /> 查询
            </el-button>
            <el-button @click="resetQuery">
              <Icon icon="ep:refresh" class="mr-5px" /> 重置
            </el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table :data="list" @selection-change="handleSelectionChange" ref="table"
                v-loading="loading"
                :stripe="true" :show-overflow-tooltip="false" :row-style="{height: 'auto'}"
                :cell-style="{padding: '8px 4px', whiteSpace: 'normal', wordBreak: 'break-all'}">
        <el-table-column type="selection" width="55" />
        <el-table-column label="编号" prop="no" width="120">
          <template #default="scope">
            <el-input
              v-model="scope.row.no"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 4 }"
              readonly
              style="border: none; background: transparent; resize: none;"
            />
          </template>
        </el-table-column>

        <el-table-column label="品牌名称" prop="brandName" width="120">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ERP_PRODUCT_BRAND" :value="scope.row.brandName" />
          </template>
        </el-table-column>
        <el-table-column label="产品名称" prop="productName" min-width="200">
          <template #default="scope">
            <el-input
              v-model="scope.row.productName"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 4 }"
              readonly
              style="border: none; background: transparent; resize: none;"
            />
          </template>
        </el-table-column>
        <el-table-column label="产品规格" prop="productSpec" min-width="150">
          <template #default="scope">
            <el-input
              v-model="scope.row.productSpec"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 4 }"
              readonly
              style="border: none; background: transparent; resize: none;"
            />
          </template>
        </el-table-column>
        <el-table-column label="产品SKU" prop="productSku" min-width="150">
          <template #default="scope">
            <el-input
              v-model="scope.row.productSku"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 3 }"
              readonly
              style="border: none; background: transparent; resize: none;"
            />
          </template>
        </el-table-column>
        <el-table-column label="直播价格" prop="livePrice" width="100">
          <template #default="scope">
            <span v-if="scope.row.livePrice">{{ scope.row.livePrice }}元</span>
          </template>
        </el-table-column>
        <el-table-column label="货盘状态" prop="privateStatus" width="100">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ERP_PRIVATE_STATUS" :value="scope.row.privateStatus" />
          </template>
        </el-table-column>
      </el-table>

      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
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
import { ErpPrivateBroadcastingApi } from '@/api/erp/privateBroadcasting'
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'

defineOptions({ name: 'PrivateBroadcastingSearchDialog' })

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'privateBroadcastingSelected'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const dialogTitle = ref('选择私播货盘表')
const loading = ref(false)
const list = ref([])
const total = ref(0)
const table = ref()
const selectedPrivateBroadcasting = ref<any>(null)

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  no: '',
  productName: '',
  productSpec: '',
  brandName: undefined,
  privateStatus: undefined
})

// 字典选项
const brandOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRODUCT_BRAND))
const statusOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRIVATE_STATUS))

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ErpPrivateBroadcastingApi.getPrivateBroadcastingPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 查询按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置查询 */
const resetQuery = () => {
  Object.assign(queryParams, {
    no: '',
    productName: '',
    productSpec: '',
    brandName: undefined,
    privateStatus: undefined,
    pageNo: 1,
    pageSize: 10
  })
  getList()
}

/** 选择变化事件 */
const handleSelectionChange = (selection: any[]) => {
  selectedPrivateBroadcasting.value = selection.length > 0 ? selection[0] : null
}

/** 确认选择 */
const confirmSelection = () => {
  if (!selectedPrivateBroadcasting.value) {
    ElMessage.warning('请选择一个私播货盘表')
    return
  }
  emit('privateBroadcastingSelected', selectedPrivateBroadcasting.value)
  dialogVisible.value = false
}

/** 监听弹窗打开 */
watch(
  () => props.visible,
  (val) => {
    if (val) {
      getList()
      selectedPrivateBroadcasting.value = null
      if (table.value) {
        table.value.clearSelection()
      }
    }
  }
)
</script>
