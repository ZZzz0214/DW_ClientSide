<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1080">
    <el-form :model="searchForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="供应商编号">
            <el-input v-model="searchForm.id" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商名称">
            <el-input v-model="searchForm.name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button @click="handleSearch">查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="supplierList" @selection-change="handleSelectionChange" ref="table">
      <el-table-column type="selection" width="55" />
      <el-table-column label="供应商编号" prop="id" />
      <el-table-column label="供应商名称" prop="name" />
      <el-table-column label="联系方式" prop="contact" />
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
import { SupplierApi } from '@/api/erp/purchase/supplier'; // 假设你有供应商的API

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

const dialogTitle = ref('选择供应商');
const searchForm = reactive({
  id: '',
  name: '',
});
const supplierList = ref<any[]>([]);
const selectedSupplier = ref<any>(null);

const handleSearch = async () => {
  try {
    const params = {
      id: searchForm.id,
      name: searchForm.name,
    };
    const response = await SupplierApi.searchSupplier(params);
    if (Array.isArray(response)) {
      supplierList.value = response;
    } else {
      supplierList.value = [];
    }
  } catch (error) {
    ElMessage.error('查询失败');
  }
};

const handleSelectionChange = (selection: any[]) => {
  if (selection.length > 0) {
    selectedSupplier.value = selection[0];
  } else {
    selectedSupplier.value = null;
  }
};

const confirmSelection = () => {
  if (!selectedSupplier.value) {
    ElMessage.warning('请选择一个供应商');
    return;
  }
  emit('supplier-selected', selectedSupplier.value);
  dialogVisible.value = false;
};

const emit = defineEmits(['supplier-selected', 'update:visible']);

defineExpose({
  open: () => {
    dialogVisible.value = true;
  },
});
</script>
