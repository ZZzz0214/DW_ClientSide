<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1080">
    <el-form :model="searchForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="销售人员编号">
            <el-input v-model="searchForm.id" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="销售人员名称">
            <el-input v-model="searchForm.salespersonName" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button @click="handleSearch">查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="salespersonList" @selection-change="handleSelectionChange" ref="table">
      <el-table-column type="selection" width="55" />
      <el-table-column label="销售人员编号" prop="id" />
      <el-table-column label="销售人员名称" prop="salespersonName" />
      <el-table-column label="联系方式" prop="contactPhone" />
    </el-table>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button @click="confirmSelection" type="primary">确 定</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, defineProps, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
import { ErpSalespersonApi } from '@/api/erp/person/salesperson'; // 假设你有销售人员的API

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const dialogVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit('update:visible', value);
  }
});
watch(() => props.visible, (newValue) => {
  dialogVisible.value = newValue;
});

const dialogTitle = ref('选择销售人员');
const searchForm = reactive({
  id: '',
  salespersonName: '',
});
const salespersonList = ref<any[]>([]);
const selectedSalesperson = ref<any>(null);

const handleSearch = async () => {
  try {
    const params = {
      id: searchForm.id,
      salespersonName: searchForm.salespersonName,
    };
    const response = await ErpSalespersonApi.searchSalesperson(params);
    if (Array.isArray(response)) {
      salespersonList.value = response;
    } else {
      salespersonList.value = [];
    }
  } catch (error) {
    ElMessage.error('查询失败');
  }
};

const handleSelectionChange = (selection: any[]) => {
  if (selection.length > 0) {
    selectedSalesperson.value = selection[0];
  } else {
    selectedSalesperson.value = null;
  }
};

const confirmSelection = () => {
  if (!selectedSalesperson.value) {
    ElMessage.warning('请选择一个销售人员');
    return;
  }
  emit('salesperson-selected', selectedSalesperson.value);
  console.log('-=-=--=-=')
  console.log(selectedSalesperson.value)
  dialogVisible.value = false;
};

const emit = defineEmits(['salesperson-selected', 'update:visible']);

defineExpose({
  open: () => {
    dialogVisible.value = true;
  },
});
</script>
