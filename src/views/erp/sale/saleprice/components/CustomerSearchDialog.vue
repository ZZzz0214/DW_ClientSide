<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1080">
    <el-form :model="searchForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="客户编号">
            <el-input v-model="searchForm.id" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户名称">
            <el-input v-model="searchForm.name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button @click="handleSearch">查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="customerList" @selection-change="handleSelectionChange" ref="table">
      <el-table-column type="selection" width="55" />
      <el-table-column label="客户编号" prop="id" />
      <el-table-column label="客户名称" prop="name" />
      <el-table-column label="联系人" prop="contact" />
      <el-table-column label="联系电话" prop="mobile" />
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
import { CustomerApi } from '@/api/erp/sale/customer';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const dialogVisible = ref(props.visible);
watch(() => props.visible, (newValue) => {
  dialogVisible.value = newValue;
});

const dialogTitle = ref('选择客户');
const searchForm = reactive({
  id: '',
  name: '',
});
const customerList = ref<any[]>([]);
const selectedCustomer = ref<any>(null);

const handleSearch = async () => {
  try {
    const params = {
      id: searchForm.id,
      name: searchForm.name,
    };
    const response = await CustomerApi.searchCustomer(params);
    console.log("123333333");
    console.log(response);
    if (Array.isArray(response)) {
      customerList.value = response;
    } else {
      customerList.value = []; // 如果不是数组，清空列表
    }
  } catch (error) {
    ElMessage.error('查询失败');
  }
};

const handleSelectionChange = (selection: any[]) => {
  if (selection.length > 0) {
    selectedCustomer.value = selection[0];
  } else {
    selectedCustomer.value = null;
  }
};

const confirmSelection = () => {
  if (!selectedCustomer.value) {
    ElMessage.warning('请选择一个客户');
    return;
  }
  emit('customer-selected', selectedCustomer.value);
  dialogVisible.value = false;
};

const emit = defineEmits(['customer-selected', 'update:visible']);

defineExpose({
  open: () => {
    dialogVisible.value = true;
  },
});
</script>