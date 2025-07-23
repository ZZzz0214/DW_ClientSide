<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1080" top="5vh" style="max-height: 90vh;">
    <div style="max-height: calc(90vh - 150px); overflow-y: auto;">
      <el-form :model="searchForm" label-width="100px">
        <!-- 搜索表单 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="组品编号">
              <el-input v-model="searchForm.no" placeholder="请输入组品编号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品名称">
              <el-input v-model="searchForm.name" placeholder="请输入产品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品简称">
              <el-input v-model="searchForm.shortName" placeholder="请输入产品简称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发货编码">
              <el-input v-model="searchForm.shippingCode" placeholder="请输入发货编码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购人员">
              <el-input v-model="searchForm.purchaser" placeholder="请输入采购人员" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-button @click="handleSearch">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form>

      <el-table :data="comboList" @selection-change="handleSelectionChange" style="margin-top: 20px;">
        <el-table-column type="selection" width="55" />
        <el-table-column label="组品编号" prop="no" />
        <el-table-column label="产品名称" prop="name" min-width="350"/>
        <el-table-column label="产品简称" prop="shortName" />
        <el-table-column label="发货编码" prop="shippingCode" />
        <el-table-column label="产品重量" prop="weight" />
        <el-table-column label="采购人员" prop="purchaser" />
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
import * as ComboApi from '@/api/erp/product/combo'

const dialogVisible = ref(false)
const dialogTitle = ref('选择组品')

const searchForm = reactive({
  no: '',
  name: '',
  shortName: '',
  shippingCode: '',
  purchaser: '',
  pageNo: 1,
  pageSize: 10
})

const comboList = ref<any[]>([])
const selectedCombo = ref<any>(null)
const total = ref(0)

const handleSearch = async () => {
  try {
    const data = await ComboApi.ComboApi.getComboPage(searchForm);
    comboList.value = data.list
    total.value = data.total
  } catch (error) {
    ElMessage.error('查询失败')
  }
}

const resetSearch = () => {
  Object.assign(searchForm, {
    no: '',
    name: '',
    shortName: '',
    shippingCode: '',
    purchaser: '',
    pageNo: 1,
    pageSize: 10
  })
  handleSearch()
}

const handleSelectionChange = (selection: any[]) => {
  selectedCombo.value = selection.length > 0 ? selection[0] : null
}

const confirmSelection = () => {
  if (!selectedCombo.value) {
    ElMessage.warning('请选择一个组品')
    return
  }
  emit('combo-selected', selectedCombo.value)
  dialogVisible.value = false
}

const emit = defineEmits(['combo-selected'])

defineExpose({
  open: () => {
    console.log('ComboSelectDialog open方法被调用')
    dialogVisible.value = true
    console.log('dialogVisible设置为:', dialogVisible.value)
    handleSearch() // 打开时自动加载数据
  }
})
</script>
