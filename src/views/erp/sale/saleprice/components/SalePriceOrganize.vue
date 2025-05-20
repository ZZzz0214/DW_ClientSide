<template>
  <el-dialog
    :title="'整理'"
    v-model="dialogVisible"
    width="80%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 搜索栏 -->
    <el-form
      :inline="true"
      class="mb-20px"
      :model="searchParams"
      ref="searchFormRef"
    >
      <el-form-item label="组品ID" prop="groupProductId">
        <el-input
          v-model="searchParams.groupProductId"
          placeholder="请输入组品ID"
          clearable
          @keyup.enter="handleSearch"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="searchParams.customerName"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter="handleSearch"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table
      :data="list"
      stripe
      :show-overflow-tooltip="true"
      v-loading="loading"
    >
      <el-table-column label="组品ID" prop="groupProductId" />
      <el-table-column label="客户名称" prop="customerName" />
      <el-table-column label="代发单价" prop="distributionPrice" />
      <el-table-column label="批发单价" prop="wholesalePrice" />
      <el-table-column label="运费" prop="shippingFee" />
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:currentPage="searchParams.pageNo"
      v-model:page-size="searchParams.pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { SalePriceApi, SalePriceVO } from '@/api/erp/sale/saleprice';

const dialogVisible = ref(false); // 控制弹窗的显示
const loading = ref(false); // 列表加载状态
const list = ref<SalePriceVO[]>([]); // 列表数据
const total = ref(0); // 总条数

const searchParams = reactive({
  pageNo: 1,
  pageSize: 10,
  groupProductId: undefined,
  customerName: undefined
});

const searchFormRef = ref(null); // 搜索表单引用

// 打开弹窗
const open = () => {
  dialogVisible.value = true;
  fetchList();
};

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false;
};

// 获取列表数据
const fetchList = async () => {
  loading.value = true;
  try {
    const data = await SalePriceApi.getSalePricePage(searchParams);
    list.value = data.list;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
};

// 搜索功能
const handleSearch = () => {
  searchParams.pageNo = 1;
  fetchList();
};

// 重置搜索条件
const resetSearch = () => {
  searchFormRef.value.resetFields();
  handleSearch();
};

// 分页事件处理
const handleSizeChange = (newSize: number) => {
  searchParams.pageSize = newSize;
  fetchList();
};

const handleCurrentChange = (newPage: number) => {
  searchParams.pageNo = newPage;
  fetchList();
};

// 暴露 open 方法供父组件调用
defineExpose({ open });
</script>