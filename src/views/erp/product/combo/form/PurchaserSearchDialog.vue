<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1080">
    <el-form :model="searchForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="采购人员编号">
            <el-input v-model="searchForm.id" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="采购人员名称">
            <el-input v-model="searchForm.name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button @click="handleSearch">查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="purchaserList" @selection-change="handleSelectionChange" ref="table">
      <el-table-column type="selection" width="55" />
      <el-table-column label="采购人员编号" prop="id" />
      <el-table-column label="采购人员名称" prop="name" />
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
import { PurchaserApi } from '@/api/erp/person/purchaser'; // 假设你有采购人员的API

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

const dialogTitle = ref('选择采购人员');
const searchForm = reactive({
  id: '',
  name: '',
});
const purchaserList = ref<any[]>([]);
const selectedPurchaser = ref<any>(null);

const handleSearch = async () => {
  try {
    const params = {
      id: searchForm.id,
      name: searchForm.name,
    };
    const response = await PurchaserApi.searchPurchaser(params);
    if (Array.isArray(response)) {
      purchaserList.value = response;
    } else {
      purchaserList.value = [];
    }
  } catch (error) {
    ElMessage.error('查询失败');
  }
};

const handleSelectionChange = (selection: any[]) => {
  if (selection.length > 0) {
    selectedPurchaser.value = selection[0];
  } else {
    selectedPurchaser.value = null;
  }
};

const confirmSelection = () => {
  if (!selectedPurchaser.value) {
    ElMessage.warning('请选择一个采购人员');
    return;
  }
  emit('purchaser-selected', selectedPurchaser.value);
  dialogVisible.value = false;
};

const emit = defineEmits(['purchaser-selected', 'update:visible']);

defineExpose({
  open: () => {
    dialogVisible.value = true;
  },
});
</script>