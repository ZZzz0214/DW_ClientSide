<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1080">
    <el-form :model="searchForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="组品编号">
            <el-input v-model="searchForm.id" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品名称">
            <el-input v-model="searchForm.name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品简称">
            <el-input v-model="searchForm.shortName" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button @click="handleQuery">查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="comboList" @selection-change="handleSelectionChange" ref="table">
      <el-table-column type="selection" width="55" />
      <el-table-column label="组品编号" prop="id" />
      <el-table-column label="产品名称" prop="name" />
      <el-table-column label="产品简称" prop="shortName" />
      <el-table-column label="发货编码" prop="shippingCode" />
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
import * as ProductComboApi from '@/api/erp/product/combo';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const searchForm = reactive({
  id: '',
  name: '',
  createTime: '',
  pageNo: 1,
  pageSize: 10
})

const emit = defineEmits(['combo-selected', 'update:visible']);

const dialogVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit('update:visible', value);
  }
});

const dialogTitle = ref('选择组品');
const comboList = ref<any[]>([]);
const selectedCombo = ref<any>(null);
const total = ref(0) // 总记录数
const handleSearch = async () => {
  try {
    const data = await ProductComboApi.ComboApi.getComboPage({
      searchForm
    });
    comboList.value = data.list
    total.value = data.total
  } catch (error) {
    ElMessage.error('查询失败');
  }
};

const handleQuery = () => {
  searchForm.pageNo = 1
  handleSearch()
}

const handleSelectionChange = (selection: any[]) => {
  selectedCombo.value = selection.length > 0 ? selection[0] : null;
};

const confirmSelection = () => {
  if (!selectedCombo.value) {
    ElMessage.warning('请选择一个组品');
    return;
  }
  emit('combo-selected', selectedCombo.value);
  dialogVisible.value = false;
};

defineExpose({
  open: () => {
    dialogVisible.value = true;
    handleSearch(); // 打开时自动加载数据
  },
});
</script>
