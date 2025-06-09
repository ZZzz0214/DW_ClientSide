<template>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      v-loading="formLoading"
      label-width="0px"
      :inline-message="true"
    >
      <el-table :data="formData"  class="-mt-10px">
        <el-table-column label="产品名称" min-width="120">
          <template #default="{ row }">
            <el-form-item class="mb-0px!">
              <el-input disabled v-model="row.name" placeholder="请输入组品名称" />
            </el-form-item>
          </template>
        </el-table-column>
  
        <el-table-column label="产品简称" min-width="110">
          <template #default="{ row }">
            <el-form-item class="mb-0px!">
              <el-input disabled v-model="row.shortName" placeholder="请输入组品简称" />
            </el-form-item>
          </template>
        </el-table-column>
  
        <el-table-column align="center" fixed="right" label="操作" width="60">
          <template #default="{ $index }">
            <el-button @click="handleDelete($index)" link>—</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-row justify="center" class="mt-3" v-if="!disabled">
      <el-button @click="handleAdd" round>+ 添加组品</el-button>
    </el-row>
  
    <!-- 引入子组件 -->
    <SelectProduct ref="selectProductRef" @selected="handleProductSelected" />
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import SelectProduct from './SelectProductDialog.vue';
  import { ElMessage } from 'element-plus';
  
  const props = defineProps<{
    item: any[]
    disabled: boolean
  }>();
  
  const formLoading = ref(false);
  const formData = ref([]);
  const formRules = reactive({
      name: [{ required: true, message: '组品名称不能为空', trigger: 'blur' }],
  });
  const formRef = ref();
  const selectProductRef = ref();
  
  /** 初始化设置子表项 */
  watch(
    () => props.item,
    async (val) => {
      formData.value = val;
    },
    { immediate: true }
  );
  
  const handleAdd = () => {
    selectProductRef.value.open();
  };
  
  const handleDelete = (index: number) => {
    formData.value.splice(index, 1);
  };
  
  const handleProductSelected = (selectedProducts: any[]) => {
    if (formData.value.length > 0) {
      ElMessage.warning('一条中转销售最多只能选择一个组品哦！');
      return;
    }
    if (selectedProducts.length > 1) {
      ElMessage.warning('一条中转销售最多只能选择一个组品哦！');
      return;
    }
    selectedProducts.forEach(product => {
      formData.value.push({
        groupProductId: product.id,
        name: product.name,
        shortName: product.shortName,
        remark: product.remark,
        no: product.no,
      });
    });
    emit('items-updated', formData.value);
  };
  
  const updateItems = () => {
    emit('items-updated', formData.value);
  };
  
  /** 表单校验 */
  const validate = async () => {
    return formRef.value.validate();
  };
  defineExpose({ validate });
  const emit = defineEmits(['items-updated']);
  </script>