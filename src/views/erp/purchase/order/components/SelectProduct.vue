<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1080">
    <el-form :model="searchForm" label-width="100px">
      <!-- 搜索结果表单 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="产品编号">
            <el-input v-model="searchForm.id" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品名称">
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
          <el-form-item label="产品类型">
            <el-select v-model="searchForm.productType" placeholder="请选择产品类型" class="!w-1/1">
              <el-option label="单品" value="0" />
              <el-option label="组合产品" value="1" />
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>
      <el-button @click="handleSearch">查询</el-button>
    </el-form>

    <el-table :data="productList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="产品编号" prop="id" />
      <el-table-column label="产品名称" prop="name" />
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
import * as ProductApi from '@/api/erp/product/product/index';
import * as ProductComboApi from '@/api/erp/product/combo';

const dialogVisible = ref(false);
const dialogTitle = ref('选择产品');

const searchForm = reactive({
  id: '',
  name: '',
  createTime: '',
  productType: undefined // 0 - 单品，1 - 组合产品
});

const productList = ref<any[]>([]);
const selectedProducts = ref<any[]>([]);

// const handleSearch = async () => {
//   try {
//     productList.value = await ProductApi.ProductApi.searchProducts(searchForm);
//   } catch (error) {
//     ElMessage.error('查询失败');
//   }
// };

const handleSearch = async () => {
  try {
    if (searchForm.productType === '0') {
      productList.value = await ProductApi.ProductApi.searchProducts(searchForm);
    } else if (searchForm.productType === '1') {
      productList.value = await ProductComboApi.ComboApi.searchCombos(searchForm);
    }
    // else {
    //   // 默认搜索所有单品
    //   productList.value = await ProductApi.ProductApi.searchProducts(searchForm);
    // }
    // 为每项添加 type 字段
    productList.value.forEach(item => {
      item.type = searchForm.productType === '0' ? 0 : 1; // 根据 productType 设置 type
    });

    console.log(productList.value)
  } catch (error) {
    ElMessage.error('查询失败');
  }
};
const handleSelectionChange = (selection: any[]) => {
  selectedProducts.value = selection;
};

const confirmSelection = () => {
  emit('selected', selectedProducts.value);
  dialogVisible.value = false;
};

// const formatProductType = (row: any) => {
//   return row.type === 0 ? '单品' : '组合产品';
// };

defineExpose({
  open: () => {
    dialogVisible.value = true;
  }
});

const emit = defineEmits(['selected']);
</script>