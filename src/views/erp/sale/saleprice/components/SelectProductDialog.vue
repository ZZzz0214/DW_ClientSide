<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1080">
    <el-form :model="searchForm" label-width="100px">
      <!-- 搜索结果表单 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="组品编号">
            <el-input v-model="searchForm.id" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="组品名称">
            <el-input v-model="searchForm.name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="searchForm.createTime"
              type="date"
              value-format="x"
              placeholder="选择创建时间"
              class="!w-1/1"
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-button @click="handleSearch">查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="productList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="组品编号" prop="id" />
      <el-table-column label="组品名称" prop="name" />
      <el-table-column label="采购单价" prop="purchasePrice" />
      <el-table-column label="原表数量" prop="availableStockQuantity" />
      <el-table-column label="产品重量" prop="weight" />
    </el-table>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button @click="confirmSelection" type="primary">确 定</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import * as ProductComboApi from '@/api/erp/product/combo';

const dialogVisible = ref(false);
const dialogTitle = ref('选择组品');

const searchForm = reactive({
  id: '',
  name: '',
  createTime: '',
});

const productList = ref<any[]>([]);
const selectedProducts = ref<any[]>([]);

const handleSearch = async () => {
  try {
    productList.value = await ProductComboApi.ComboApi.searchCombos(searchForm);
    console.log(productList.value);
  } catch (error) {
    ElMessage.error('查询失败');
  }
};

const handleSelectionChange = (selection: any[]) => {
  selectedProducts.value = selection;
};

const confirmSelection = () => {
  if (selectedProducts.value.length > 1) {
    ElMessage.warning('一条销售价格表最多只能选择一个组品哦！');
    return;
  }
  emit('selected', selectedProducts.value);
  dialogVisible.value = false;
};

defineExpose({
  open: () => {
    dialogVisible.value = true;
  },
});

const emit = defineEmits(['selected']);
</script>