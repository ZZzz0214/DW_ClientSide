<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1080">
    <el-form :model="searchForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="货盘表ID">
            <el-input v-model="searchForm.id" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="品牌名称">
            <el-input v-model="searchForm.brandName" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品名称">
            <el-input v-model="searchForm.productName" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button @click="handleQuery">查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="groupBuyingList" @selection-change="handleSelectionChange" ref="table">
      <el-table-column type="selection" width="55" />
      <el-table-column label="货盘表ID" prop="no" />
      <el-table-column label="品牌名称" prop="brandName" />
      <el-table-column label="产品名称" prop="productName" />
      <el-table-column label="产品SKU" prop="productSku" />
      <el-table-column label="开团机制" prop="groupMechanism" />
    </el-table>
    <Pagination
      :total="total"
      v-model:page="searchForm.pageNo"
      v-model:limit="searchForm.pageSize"
      @pagination="handleSearch"
    />
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button @click="confirmSelection" type="primary">确 定</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import * as GroupBuyingApi from '@/api/erp/groupbuying';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const searchForm = reactive({
  id: '',
  productName: '',
  pageNo: 1,
  pageSize: 10
})

const emit = defineEmits(['groupbuying-selected', 'update:visible']);

const dialogVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit('update:visible', value);
  }
});

const dialogTitle = ref('选择团购货盘表');
const groupBuyingList = ref<any[]>([]);
const selectedGroupBuying = ref<any>(null);
const total = ref(0);

const handleSearch = async () => {
  try {
    const data = await GroupBuyingApi.GroupBuyingApi.getGroupBuyingPage(searchForm);
    groupBuyingList.value = data.list;
    total.value = data.total;
  } catch (error) {
    ElMessage.error('查询失败');
  }
};

const handleQuery = () => {
  searchForm.pageNo = 1;
  handleSearch();
}

const handleSelectionChange = (selection: any[]) => {
  selectedGroupBuying.value = selection.length > 0 ? selection[0] : null;
};

const confirmSelection = () => {
  if (!selectedGroupBuying.value) {
    ElMessage.warning('请选择一个团购货盘表');
    return;
  }
  emit('groupbuying-selected', selectedGroupBuying.value);
  dialogVisible.value = false;
};

defineExpose({
  open: () => {
    dialogVisible.value = true;
    handleSearch();
  },
});
</script>
