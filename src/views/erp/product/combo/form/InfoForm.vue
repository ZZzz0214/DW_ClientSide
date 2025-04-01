<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-width="100px"
    v-loading="formLoading"
  >
    <ContentWrap>
      <!-- 组品基本信息 -->
      <el-form-item label="组品名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入组品名称" :disabled="isDetail" />
      </el-form-item>

      <el-form-item label="组品编号" prop="id">
        <el-input v-model="formData.id" placeholder="请输入组品编号" :disabled="isDetail" />
      </el-form-item>

      <el-form-item label="产品图片">
        <el-image
          v-if="formData.image"
          style="width: 100px; height: 100px"
          :src="formData.image"
          :preview-src-list="[formData.image]"
        />
      </el-form-item>

      <el-form-item label="产品重量" prop="weight">
        <el-input v-model="formData.weight" placeholder="产品重量" :disabled="isDetail" />
      </el-form-item>

      <el-form-item label="产品数量" prop="totalQuantity">
        <el-input v-model="formData.totalQuantity" placeholder="产品数量" :disabled="isDetail" />
      </el-form-item>

      <el-form-item label="产品状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px">
        <el-tab-pane label="订单产品清单" name="item">
          <el-table :data="formData.items" show-summary :summary-method="getSummaries" class="-mt-10px">
            <el-table-column label="序号" type="index" align="center" width="60" />
            <el-table-column label="产品编号" min-width="120">
              <template #default="{ row }">
                <span>{{ row.productId }}</span>
              </template>
            </el-table-column>
            <el-table-column label="产品名称" min-width="180">
              <template #default="{ row }">
                <span>{{ row.productName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="采购单价" min-width="120">
              <template #default="{ row }">
                <span>{{ row.productPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column label="产品重量" min-width="120">
              <template #default="{ row }">
                <span>{{ row.weight }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" min-width="140">
              <template #default="{ row, $index }">
                <el-form-item :prop="`items.${$index}.count`" :rules="formRules.count">
                  <el-input-number
                    v-model="row.count"
                    controls-position="right"
                    :min="1"
                    :precision="0"
                    class="!w-100%"
                    @change="updateComboInfo"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="备注" min-width="150">
              <template #default="{ row, $index }">
                <el-form-item :prop="`items.${$index}.remark`">
                  <el-input v-model="row.remark" placeholder="请输入备注" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="60">
              <template #default="{ $index }">
                <el-button @click="handleDelete($index)" link>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button @click="handleAdd" class="mt-3">+ 添加产品</el-button>
        </el-tab-pane>
      </el-tabs>
    </ContentWrap>

    <!-- 查询组件 -->
    <SelectProduct ref="selectProductRef" @selected="handleProductSelected" />
  </el-form>
</template>

<script setup lang="ts">
import {ref, reactive, watch, PropType} from 'vue';
import SelectProduct from './SelectProduct.vue';
import {copyValueToTarget} from "@/utils";
import * as ProductComboApi from '@/api/erp/product/combo'
const props = defineProps({
  propFormData: {
    type: Object as PropType<ProductComboApi.ComboVO>,
    default: () => ({}),
  },
  isDetail: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:activeName']);

const formRef = ref();
const formLoading = ref(false);
const subTabsName = ref('item');

const formData = ref<ProductComboApi.ComboVO>({
  id: undefined,
  name: '', // 组品名称
  image: '', // 产品图片
  totalWeight: null, // 产品重量
  totalQuantity: 0, // 产品数量
  status: 1, // 产品状态，默认为启用
  items: [],

});

const formRules = reactive({
  name: [{ required: true, message: '组品名称不能为空', trigger: 'blur' }],
  comboId: [{ required: true, message: '组品编号不能为空', trigger: 'blur' }],
  totalQuantity: [{ required: true, message: '产品数量不能为空', trigger: 'blur' }],
  count: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
});

const selectProductRef = ref(); // 初始化 selectProductRef

// 添加产品按钮点击事件
const handleAdd = () => {
  selectProductRef.value.open(); // 调用查询组件的 open 方法
};

// 处理选中的产品
const handleProductSelected = (selectedProducts: any[]) => {
  selectedProducts.forEach(product => {
    formData.value.items.push({
      productName: product.name, // 产品名称
      productPrice: product.purchasePrice, // 采购单价
      weight: product.weight, // 产品重量
      productId: product.id, // 产品编号
      count: 1, // 默认数量为1
      remark: '', // 默认备注为空
      itemQuantity: 1, // 添加 itemQuantity 字段，默认值为1
    });
  });
  updateComboInfo();
};

// 删除产品行
const handleDelete = (index: number) => {
  formData.items.splice(index, 1);
  updateComboInfo();
};

// 更新组品信息
const updateComboInfo = () => {
  // 更新组品名称
  console.log('当前 items 数据：', formData.items); // 检查是否填充
  const productNames = formData.items.map(item => `${item.productName}*${item.count}`);
  console.log('拼接后的 name：', productNames.join(' + ')); // 检查计算结果
  formData.name = productNames.join(' + '); // 更新 namecount 字段
  // 更新产品重量
  const totalWeight = formData.items.reduce((sum, item) => sum + (item.weight * item.count), 0);
  //formData.totalWeight = totalWeight;
  formData.totalWeight = '123';
  // 更新产品图片（取第一个产品的图片）
  if (formData.items.length > 0) {
    formData.productImage = formData.items[0].productImage;
  } else {
    formData.productImage = '';
  }

  // 更新产品数量
  const totalQuantity = formData.items.reduce((sum, item) => sum + item., 0);
  formData.totalQuantity = totalQuantity;

  // 确保每个 item 的 itemQuantity 与 count 一致
  formData.items.forEach(item => {
    item.itemQuantity = item.count;
  });
};

// 表格合计行
const getSummaries = () => {
  return ['合计', ...new Array(4).fill(''), '总计数量: ' + formData.items.reduce((sum, item) => sum + (item.count || 0), 0)];
};

// 表单校验
const validate = async () => {
  const form = unref(formRef);
  if (!form) {
    console.error('表单未初始化');
    return;
  }
  try {
    await form.validate();
    // 校验通过更新数据
    Object.assign(props.propFormData, formData);
  } catch (e) {
    console.error('表单校验失败:', e);
    emit('update:activeName', 'info');
    throw e; // 目的截断之后的校验
  }
};
defineExpose({ validate });

watch(
  () => props.propFormData,
  (data) => {
    if (!data) return
    // fix：三个表单组件监听赋值必须使用 copyValueToTarget 使用 formData.value = data 会监听非常多次
    copyValueToTarget(formData.value, data)
  },
  {
    // fix: 去掉深度监听只有对象引用发生改变的时候才执行,解决改一动多的问题
    immediate: true
  }
)

</script>
