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
      <el-table-column label="组品名称" min-width="120">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input v-model="row.productName" placeholder="请输入组品名称" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="组品简称" min-width="110">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input v-model="row.shortName" placeholder="请输入组品简称" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="代发单价" fixed="right" min-width="120">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input-number
              v-model="row.distributionPrice"
              controls-position="right"
              :min="0"
              :precision="2"
              placeholder="请输入代发单价"
              @change="updateItems"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="批发单价" fixed="right" min-width="120">
        <template #default="{ row }">
          <el-form-item class="mb-0px!">
            <el-input-number
              v-model="row.wholesalePrice"
              controls-position="right"
              :min="0"
              :precision="2"
              placeholder="请输入批发单价"
              @change="updateItems"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="备注信息" fixed="right" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.remark`" class="mb-0px!">
            <el-input v-model="row.remark" placeholder="请输入备注信息" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="运费类型" min-width="100">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.shippingFeeType`"  class="mb-0px!">
            <el-select disabled v-model="row.shippingFeeType" >
              <el-option label="固定运费" :value="0" />
              <el-option label="按件计费" :value="1" />
              <el-option label="按重计费" :value="2" />
            </el-select>
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
import { erpPriceInputFormatter, erpPriceMultiply, getSumValue } from '@/utils';
import { ElMessage } from 'element-plus';

const props = defineProps<{
  items: any[]
  disabled: boolean
}>();

const formLoading = ref(false); // 表单的加载中
const formData = ref([]);
const formRules = reactive({
  distributionPrice: [
    { required: true, message: '代发单价不能为空', trigger: 'blur' },
    { validator: (rule, value) => value >= 0, message: '代发单价必须大于等于 0', trigger: 'blur' }
  ],
  wholesalePrice: [
    { required: true, message: '批发单价不能为空', trigger: 'blur' },
    { validator: (rule, value) => value >= 0, message: '批发单价必须大于等于 0', trigger: 'blur' }
  ]
});
const formRef = ref();
const selectProductRef = ref();

/** 初始化设置子表项 */
watch(
  () => props.items,
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
  // 检查是否已经选择了一条组品
  if (formData.value.length > 0) {
    ElMessage.warning('一条销售价格表最多只能选择一个组品哦！');
    return;
  }
  if (selectedProducts.length > 1) {
    ElMessage.warning('一条销售价格表最多只能选择一个组品哦！');
    return;
  }
  selectedProducts.forEach(product => {
    formData.value.push({
      groupProductId:product.id,
      productName: product.name, // 组品名称
      shortName: product.shortName, // 组品简称
      distributionPrice: 0, // 代发单价
      wholesalePrice: 0, // 批发单价
      remark: product.remark, // 备注信息
      shippingFeeType: 0, // 运费类型，默认为固定运费
      fixedShippingFee: product.fixedShippingFee, // 固定运费
    });
  });
  emit('items-updated', formData.value);
};

const updateItems = () => {
  emit('items-updated', formData.value);
};


/** 表单校验 */
const validate = () => {
  return formRef.value.validate();
};
defineExpose({ validate });
const emit = defineEmits(['items-updated']);
</script>