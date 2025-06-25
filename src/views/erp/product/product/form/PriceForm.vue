<!-- 商品发布 - 价格信息 -->
<!--<template>-->
<!--  <el-form-->
<!--    ref="formRef"-->
<!--    v-loading="formLoading"-->
<!--    :disabled="isDetail"-->
<!--    :model="formData"-->
<!--    :rules="rules"-->
<!--    label-width="120px"-->
<!--  >-->
<!--    <el-form-item label="分销类型" prop="subCommissionType">-->
<!--      <el-radio-group-->
<!--        v-model="formData.subCommissionType"-->
<!--        class="w-80"-->
<!--        @change="changeSubCommissionType"-->
<!--      >-->
<!--        <el-radio :value="false">默认设置</el-radio>-->
<!--        <el-radio :value="true" class="radio">单独设置</el-radio>-->
<!--      </el-radio-group>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="商品规格" prop="specType">-->
<!--      <el-radio-group v-model="formData.specType" class="w-80" @change="onChangeSpec">-->
<!--        <el-radio :value="false" class="radio">单规格</el-radio>-->
<!--        <el-radio :value="true">多规格</el-radio>-->
<!--      </el-radio-group>-->
<!--    </el-form-item>-->
<!--    &lt;!&ndash; 多规格添加&ndash;&gt;-->
<!--    <el-form-item v-if="!formData.specType">-->
<!--      <SkuList-->
<!--        ref="skuListRef"-->
<!--        :prop-form-data="formData"-->
<!--        :property-list="propertyList"-->
<!--        :rule-config="ruleConfig"-->
<!--      />-->
<!--    </el-form-item>-->
<!--    <el-form-item v-if="formData.specType" label="商品属性">-->
<!--      <el-button class="mb-10px mr-15px" @click="attributesAddFormRef.open">添加属性</el-button>-->
<!--      <ProductAttributes-->
<!--        :is-detail="isDetail"-->
<!--        :property-list="propertyList"-->
<!--        @success="generateSkus"-->
<!--      />-->
<!--    </el-form-item>-->
<!--    <template v-if="formData.specType && propertyList.length > 0">-->
<!--      <el-form-item v-if="!isDetail" label="批量设置">-->
<!--        <SkuList :is-batch="true" :prop-form-data="formData" :property-list="propertyList" />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="规格列表">-->
<!--        <SkuList-->
<!--          ref="skuListRef"-->
<!--          :is-detail="isDetail"-->
<!--          :prop-form-data="formData"-->
<!--          :property-list="propertyList"-->
<!--          :rule-config="ruleConfig"-->
<!--        />-->
<!--      </el-form-item>-->
<!--    </template>-->
<!--  </el-form>-->

<!--  &lt;!&ndash; 商品属性添加 Form 表单 &ndash;&gt;-->
<!--  <ProductPropertyAddForm ref="attributesAddFormRef" :propertyList="propertyList" />-->
<!--</template>-->
<template>
  <div class="price-form-container">
    <!-- 标题区域 -->
    <div class="form-header">
      <div class="header-icon">
        <Icon icon="ep:money" class="text-2xl" />
      </div>
      <div class="header-text">
        <h3 class="header-title">价格信息</h3>
        <p class="header-subtitle">设置产品的价格和供应商信息</p>
      </div>
    </div>

    <!-- 表单内容区域 -->
    <div class="form-content">
      <el-form
        ref="formRef"
        v-loading="formLoading"
        :disabled="isDetail"
        :model="formData"
        :rules="rules"
        label-width="160px"
        class="beautiful-form"
      >
        <!-- 供应商信息 -->
        <div class="form-section">
          <div class="section-title">
            <Icon icon="ep:office-building" class="section-icon" />
            <span>供应商信息</span>
          </div>
          <!-- 供应商名 -->
          <el-form-item label="供应商名" prop="supplier">
            <el-input
              v-model="formData.supplier"
              placeholder="请输入供应商名"
              class="beautiful-input clickable-input"
              @click="openSupplierSearch"
              readonly
              prefix-icon="ep:office-building"
              suffix-icon="ep:search"
            />
          </el-form-item>
        </div>

        <!-- 价格设置 -->
        <div class="form-section">
          <div class="section-title">
            <Icon icon="ep:coin" class="section-icon" />
            <span>价格设置</span>
          </div>
          <div class="form-grid">
            <!-- 采购单价 -->
            <el-form-item label="采购单价" prop="purchasePrice" class="grid-item">
              <div class="input-with-unit">
                <el-input-number
                  v-model="formData.purchasePrice"
                  :min="0"
                  placeholder="请输入采购单价"
                  class="beautiful-number-input"
                />
                <span class="unit-label">元</span>
              </div>
            </el-form-item>

            <!-- 批发单价 -->
            <el-form-item label="批发单价" prop="wholesalePrice" class="grid-item">
              <div class="input-with-unit">
                <el-input-number
                  v-model="formData.wholesalePrice"
                  :min="0"
                  placeholder="请输入批发单价"
                  class="beautiful-number-input"
                />
                <span class="unit-label">元</span>
              </div>
            </el-form-item>

            <!-- 对外最低出货单价 -->
            <el-form-item label="对外最低出货单价" prop="minPurchasePrice" class="grid-item">
              <div class="input-with-unit">
                <el-input-number
                  v-model="formData.minPurchasePrice"
                  :min="0"
                  placeholder="对外最低出货单价"
                  class="beautiful-number-input"
                />
                <span class="unit-label">元</span>
              </div>
            </el-form-item>
          </div>
        </div>

        <!-- 备注信息 -->
        <div class="form-section">
          <div class="section-title">
            <Icon icon="ep:document" class="section-icon" />
            <span>备注信息</span>
          </div>
          <!-- 备注信息 -->
          <el-form-item label="备注信息" prop="remark">
            <el-input
              v-model="formData.remark"
              placeholder="请输入备注信息"
              class="beautiful-input"
              prefix-icon="ep:edit-pen"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 供应商搜索弹窗 -->
    <SupplierSearchDialog
      v-model:visible="supplierSearchDialogVisible"
      @supplier-selected="handleSupplierSelected"
      ref="supplierSearchDialog"
    />
  </div>
</template>
<script lang="ts" setup>
import { PropType } from 'vue'
import { copyValueToTarget } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import {
  getPropertyList,
  PropertyAndValues,
  RuleConfig,
  SkuList
} from '@/views/mall/product/spu/components/index'
import SupplierSearchDialog from './SupplierSearchDialog.vue'; // 引入供应商搜索弹窗组件
// import ProductAttributes from './ProductAttributes.vue'
// import ProductPropertyAddForm from './ProductPropertyAddForm.vue'
import type { ProductVO } from '@/api/erp/product/product/index';

defineOptions({ name: 'ProductSpuSkuForm' })

const message = useMessage() // 消息弹窗
const formLoading = ref(false)
const props = defineProps({
  propFormData: {
    type: Object as PropType<ProductVO>,
    default: () => {}
  },
  isDetail: propTypes.bool.def(false) // 是否作为详情组件
})
const formRef = ref() // 表单 Ref
const supplierSearchDialogVisible = ref(false); // 供应商搜索弹窗的显示状态

const formData = reactive<ProductVO>({
  supplier: '', // 供应商名
  purchasePrice: 0, // 采购单价
  wholesalePrice: 0, // 批发单价
  remark: '', // 备注信息
  minPurchasePrice: 0, // 对外最低采购单价
  minWholesalePrice: 0, // 对外最低批发单价
})
const rules = reactive({
  supplier: [{ required: true, message: '供应商名不能为空', trigger: 'blur' }],
  purchasePrice: [{ required: true, message: '采购单价不能为空', trigger: 'blur' }],
  wholesalePrice: [{ required: true, message: '批发单价不能为空', trigger: 'blur' }],
});

const openSupplierSearch = () => {
  supplierSearchDialogVisible.value = true;
};

const handleSupplierSelected = (supplier: any) => {
  formData.supplier = supplier.name; // 填充供应商名称
};

/** 将传进来的值赋值给 formData */
watch(
  () => props.propFormData,
  (data) => {
    if (!data) {
      return
    }
    copyValueToTarget(formData, data)
    // 将 SKU 的属性，整理成 PropertyAndValues 数组
    // propertyList.value = getPropertyList(data)
  },
  {
    immediate: true
  }
)

/** 表单校验 */
const emit = defineEmits(['update:activeName']);
const validate = async () => {
  if (!formRef.value) return;
  try {
    await unref(formRef)?.validate()
    // 只更新价格表单相关的字段，避免覆盖其他表单的数据
    const priceData = {
      supplier: formData.supplier,
      purchasePrice: formData.purchasePrice,
      wholesalePrice: formData.wholesalePrice,
      remark: formData.remark,
      minPurchasePrice: formData.minPurchasePrice,
      minWholesalePrice: formData.minWholesalePrice
    };
    Object.assign(props.propFormData, priceData);
  } catch (e) {
    message.error('【库存价格】不完善，请填写相关信息');
    emit('update:activeName', 'price');
    throw e; // 目的截断之后的校验
  }
};
defineExpose({ validate })

// /** 分销类型 */
// const changeSubCommissionType = () => {
//   // 默认为零，类型切换后也要重置为零
//   for (const item of formData.skus!) {
//     item.firstBrokeragePrice = 0
//     item.secondBrokeragePrice = 0
//   }
// }
//
// /** 选择规格 */
// const onChangeSpec = () => {
//   // 重置商品属性列表
//   propertyList.value = []
//   // 重置sku列表
//   formData.skus = [
//     {
//       price: 0,
//       marketPrice: 0,
//       costPrice: 0,
//       barCode: '',
//       picUrl: '',
//       stock: 0,
//       weight: 0,
//       volume: 0,
//       firstBrokeragePrice: 0,
//       secondBrokeragePrice: 0
//     }
//   ]
// }

// /** 调用 SkuList generateTableData 方法*/
// const generateSkus = (propertyList: any[]) => {
//   skuListRef.value.generateTableData(propertyList)
// };
</script>

<style scoped lang="scss">
.price-form-container {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-header {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  padding: 20px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  border-radius: 12px;
  color: #2c3e50;
  box-shadow: 0 4px 20px rgba(255, 154, 158, 0.3);
}

.header-icon {
  margin-right: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  backdrop-filter: blur(10px);
  color: #f5576c;
}

.header-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-subtitle {
  margin: 4px 0 0 0;
  font-size: 14px;
  opacity: 0.8;
}

.form-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.form-section {
  margin-bottom: 32px;
  padding: 20px;
  background: linear-gradient(135deg, #fff5f5 0%, #fef7ff 100%);
  border-radius: 12px;
  border: 1px solid rgba(245, 87, 108, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
  }
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;

  .section-icon {
    margin-right: 8px;
    color: #f5576c;
    font-size: 18px;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.grid-item {
  margin-bottom: 0 !important;
}

.beautiful-form {
  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #2c3e50;
    font-size: 14px;
  }
}

.beautiful-input {
  :deep(.el-input__wrapper) {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e1e8ed;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(245, 87, 108, 0.2);
      border-color: #f5576c;
    }

    &.is-focus {
      box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
      border-color: #f5576c;
    }
  }

  :deep(.el-input__inner) {
    font-size: 14px;
  }
}

.clickable-input {
  :deep(.el-input__wrapper) {
    cursor: pointer;

    &:hover {
      background: linear-gradient(135deg, #fff8f8 0%, #fef5ff 100%);
    }
  }
}

.beautiful-number-input {
  width: 100%;

  :deep(.el-input__wrapper) {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e1e8ed;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(245, 87, 108, 0.2);
      border-color: #f5576c;
    }

    &.is-focus {
      box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
      border-color: #f5576c;
    }
  }
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;

  .unit-label {
    color: white;
    font-weight: 500;
    font-size: 14px;
    padding: 8px 12px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
    min-width: 40px;
    text-align: center;
  }
}
</style>
