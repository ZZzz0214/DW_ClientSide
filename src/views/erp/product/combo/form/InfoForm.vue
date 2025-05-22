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


      <el-form-item label="产品图片">
        <el-image
          v-if="formData.image"
          style="width: 100px; height: 100px"
          :src="formData.image"
          :preview-src-list="[formData.image]"
        />
      </el-form-item>
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入组品名称" disabled />
      </el-form-item>
      <el-form-item label="产品简称" prop="shortName">
        <el-input v-model="formData.shortName" placeholder="请输入组品简称" :disabled="isDetail" />
      </el-form-item>

      <el-form-item label="发货编码" prop="shippingCode">
        <el-input v-model="formData.shippingCode" placeholder="请输入发货编码" :disabled="isDetail" />
      </el-form-item>

      <el-form-item label="产品重量" prop="weight">
        <el-input v-model="formData.weight" placeholder="产品重量" disabled />
      </el-form-item>

      <!-- 采购人员 -->
      <el-form-item label="采购人员" prop="purchaser">
        <el-input
          :disabled="isDetail"
          v-model="formData.purchaser"
          placeholder="请输入采购人员信息"
          @focus="openPurchaserSearch"
          class="w-80"
        />
      </el-form-item>

      <!-- 供应商名 -->
      <el-form-item label="供应商名" prop="supplier">
        <el-input
          :disabled="isDetail"
          v-model="formData.supplier"
          placeholder="请输入供应商名"
          @focus="openSupplierSearch"
          class="w-80"
        />
      </el-form-item>

      <el-form-item label="采购单价" prop="purchasePrice">
        <el-input v-model="formData.purchasePrice" placeholder="采购单价" disabled />
      </el-form-item>

      <el-form-item label="批发单价" prop="wholesalePrice">
        <el-input v-model="formData.wholesalePrice" placeholder="批发单价" disabled />
      </el-form-item>

      <el-form-item label="备注信息" prop="totalQuantity">
        <el-input v-model="formData.totalQuantity" placeholder="产品数量" :disabled="isDetail" />
      </el-form-item>

      <el-form-item label="产品状态" prop="status">
        <el-radio-group v-model="formData.status" :disabled="isDetail">
          <el-radio :label="0">启用</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px">
        <el-tab-pane label="订单产品清单" name="item">
          <el-table :data="formData.items" show-summary :summary-method="getSummaries" class="-mt-10px" >
            <el-table-column label="序号" type="index" align="center" width="60" />
            <el-table-column label="产品编号" min-width="120">
              <template #default="{ row }">
                <span>{{ row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column label="产品名称" min-width="180">
              <template #default="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="采购单价" min-width="120">
              <template #default="{ row }">
                <span>{{ row.purchasePrice }}</span>
              </template>
            </el-table-column>
            <el-table-column label="批发单价" min-width="120">
              <template #default="{ row }">
                <span>{{ row.wholesalePrice }}</span>
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
                    :disabled="isDetail"
                    v-model="row.count"
                    controls-position="right"
                    :min="1"
                    :precision="0"
                    @change="updateComboInfo"
                  />
                </el-form-item>
              </template>
            </el-table-column>
<!--            <el-table-column label="备注" min-width="150">-->
<!--              <template #default="{ row, $index }">-->
<!--                <el-form-item :prop="`items.${$index}.remark`">-->
<!--                  <el-input v-model="row.remark" placeholder="请输入备注"  :disabled="isDetail"/>-->
<!--                </el-form-item>-->
<!--              </template>-->
<!--            </el-table-column>-->
            <el-table-column align="center" fixed="right" label="操作" width="60">
              <template #default="{ $index }">
                <el-button @click="handleDelete($index)" link :disabled="isDetail">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button @click="handleAdd" class="mt-3" :disabled="isDetail">+ 添加产品</el-button>
        </el-tab-pane>
      </el-tabs>
    </ContentWrap>

    <!-- 查询组件 -->
    <SelectProduct ref="selectProductRef" @selected="handleProductSelected" />

    <!-- 采购人员搜索弹窗 -->
    <PurchaserSearchDialog
      v-model:visible="purchaserSearchDialogVisible"
      @purchaser-selected="handlePurchaserSelected"
      ref="purchaserSearchDialog"
    />

    <!-- 供应商搜索弹窗 -->
    <SupplierSearchDialog
      v-model:visible="supplierSearchDialogVisible"
      @supplier-selected="handleSupplierSelected"
      ref="supplierSearchDialog"
    />
  </el-form>
</template>

<script setup lang="ts">
import {ref, reactive, watch, PropType} from 'vue';
import PurchaserSearchDialog from './PurchaserSearchDialog.vue'; // 引入采购人员搜索弹窗组件
import SupplierSearchDialog from './SupplierSearchDialog.vue'; // 引入供应商搜索弹窗组件
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
const purchaserSearchDialogVisible = ref(false); // 采购人员搜索弹窗的显示状态
const supplierSearchDialogVisible = ref(false); // 供应商搜索弹窗的显示状态

const openPurchaserSearch = () => {
  purchaserSearchDialogVisible.value = true;
};

const handlePurchaserSelected = (purchaser: any) => {
  formData.value.purchaser = purchaser.purchaserName; // 填充采购人员名称
};

const openSupplierSearch = () => {
  supplierSearchDialogVisible.value = true;
};

const handleSupplierSelected = (supplier: any) => {
  formData.value.supplier = supplier.name; // 填充供应商名称
};

const formData = ref<ProductComboApi.ComboVO>({
  name: '', // 组品名称
  image: '', // 产品图片
  shortName:'', //组品简称
  shippingCode:'', //发货编码
  weight: 0, // 产品重量
  purchaser:'', //采购人员
  supplier:'', //供应商名
  purchasePrice:0, //采购单价
  wholesalePrice:0, //批发单价
  totalQuantity:'', // 产品数量
  status: 0, // 产品状态，默认为启用
  items: [],
});

const formRules = reactive({
  name: [{ required: true, message: '组品名称不能为空', trigger: 'blur' }],
  shortName: [{ required: true, message: '组品简称不能为空', trigger: 'blur' }],
  comboId: [{ required: true, message: '组品编号不能为空', trigger: 'blur' }],
  totalQuantity: [{ required: true, message: '产品数量不能为空', trigger: 'blur' }],
  count: [{ required: true, message: '组_单数量关系不能为空', trigger: 'blur' }],
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
      name: product.name || '', // 确保 productName 有默认值
      purchasePrice: product.purchasePrice || 0, // 确保 productPrice 有默认值
      wholesalePrice:product.wholesalePrice || 0, //确保 wholesalePrice 有默认值
      weight: product.weight || 0, // 确保 weight 有默认值
      id: product.id || '', // 确保 productId 有默认值
      count: 1, // 默认数量为1
      remark: '', // 默认备注为空
      itemQuantity: 1, // 添加 itemQuantity 字段，默认值为1
    });
  });
  updateComboInfo();
};

// 删除产品行
const handleDelete = (index: number) => {
  formData.value.items.splice(index, 1);
  updateComboInfo();
};

// 更新组品信息
const updateComboInfo = () => {
  // 更新组品名称
  const productNames = formData.value.items.map(item => `${item.name || ''}*${item.count || 0}`);
  formData.value.name = productNames.join(' + '); // 更新 namecount 字段
  // 更新产品重量
  const totalWeight = formData.value.items.reduce((sum, item) => sum + (item.weight || 0) * (item.count || 0), 0);
  formData.value.weight = totalWeight;
  // 更新采购人员
  // 更新供应商名
  // 更新采购单价
  const purchasePrices = formData.value.items.reduce((sum, item) => sum + (item.purchasePrice || 0) * (item.count || 0), 0);
  formData.value.purchasePrice = purchasePrices;
  // 更新批发单价
  const wholesalePrices = formData.value.items.reduce((sum, item) => sum + (item.wholesalePrice || 0) * (item.count || 0), 0);
  formData.value.wholesalePrice = wholesalePrices;
};

// 表格合计行
const getSummaries = () => {
  return ['合计', ...new Array(4).fill(''), '总计数量: ' + formData.value.items.reduce((sum, item) => sum + (item.count || 0), 0)];
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
    Object.assign(props.propFormData, formData.value);
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
