<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1080"
          top="5vh"
          style="max-height: 90vh;">
    <div style="max-height: calc(90vh - 150px); overflow-y: auto;">
      <el-form :model="searchForm" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="货盘编号">
              <el-input v-model="searchForm.no" placeholder="请输入货盘编号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌名称">
              <el-select v-model="searchForm.brandName" placeholder="请选择品牌名称" clearable>
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
            <el-form-item label="产品名称">
              <el-input v-model="searchForm.productName" placeholder="请输入产品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品规格">
              <el-input v-model="searchForm.productSpec" placeholder="请输入产品规格" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货盘状态">
              <el-select v-model="searchForm.liveStatus" placeholder="请选择货盘状态" clearable>
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
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

      <el-table :data="liveBroadcastingList" @selection-change="handleSelectionChange" ref="table"
          :stripe="true" :show-overflow-tooltip="false" :row-style="{height: 'auto'}"
          :cell-style="{padding: '8px 4px', whiteSpace: 'normal', wordBreak: 'break-all'}">
        <el-table-column type="selection" width="55" />
        <el-table-column label="货盘编号" prop="no" min-width="120">
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
              :autosize="{ minRows: 1, maxRows: 4 }"
              readonly
              style="border: none; background: transparent; resize: none;"
            />
          </template>
        </el-table-column>
        <el-table-column label="货盘状态" prop="liveStatus" width="100">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ERP_LIVE_STATUS" :value="scope.row.liveStatus" />
          </template>
        </el-table-column>
        <el-table-column label="直播价格" prop="livePrice" width="100">
          <template #default="scope">
            <span v-if="scope.row.livePrice">{{ scope.row.livePrice }}元</span>
          </template>
        </el-table-column>
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
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import * as LiveBroadcastingApi from '@/api/erp/livebroadcasting';
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const searchForm = reactive({
  no: '',
  brandName: '',
  productName: '',
  productSpec: '',
  liveStatus: '',
  pageNo: 1,
  pageSize: 10
});

const emit = defineEmits(['livebroadcasting-selected', 'update:visible']);

const dialogVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit('update:visible', value);
  }
});

const dialogTitle = ref('选择直播货盘');
const liveBroadcastingList = ref<any[]>([]);
const selectedLiveBroadcasting = ref<any>(null);
const total = ref(0);

// 字典选项
const statusOptions = ref(getStrDictOptions(DICT_TYPE.ERP_LIVE_STATUS));
const brandOptions = ref(getStrDictOptions(DICT_TYPE.ERP_PRODUCT_BRAND));

const handleSearch = async () => {
  try {
    const data = await LiveBroadcastingApi.LiveBroadcastingApi.getLiveBroadcastingPage(searchForm);
    liveBroadcastingList.value = data.list;
    total.value = data.total;
  } catch (error) {
    ElMessage.error('查询失败');
  }
};

const handleQuery = () => {
  searchForm.pageNo = 1;
  handleSearch();
};

const resetQuery = () => {
  Object.assign(searchForm, {
    no: '',
    brandName: '',
    productName: '',
    productSpec: '',
    liveStatus: '',
    pageNo: 1,
    pageSize: 10
  });
  handleSearch();
};

const handleSelectionChange = (selection: any[]) => {
  selectedLiveBroadcasting.value = selection.length > 0 ? selection[0] : null;
};

const confirmSelection = () => {
  if (!selectedLiveBroadcasting.value) {
    ElMessage.warning('请选择一个直播货盘');
    return;
  }
  emit('livebroadcasting-selected', selectedLiveBroadcasting.value);
  dialogVisible.value = false;
};

defineExpose({
  open: () => {
    dialogVisible.value = true;
    handleSearch();
  },
});
</script> 