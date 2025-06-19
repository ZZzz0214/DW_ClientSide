<template>
  <div class="description-form-container">
    <!-- 标题区域 -->
    <div class="form-header">
      <div class="header-icon">
        <Icon icon="ep:box" class="text-2xl" />
      </div>
      <div class="header-text">
        <h3 class="header-title">库存箱规</h3>
        <p class="header-subtitle">设置产品的库存和包装规格信息</p>
      </div>
    </div>

    <!-- 表单内容区域 -->
    <div class="form-content">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" :disabled="isDetail" class="beautiful-form">
        <!-- 库存信息 -->
        <div class="form-section">
          <div class="section-title">
            <Icon icon="ep:goods" class="section-icon" />
            <span>库存信息</span>
          </div>
          <div class="form-grid">
            <!-- 现货数量 -->
            <el-form-item label="现货数量" prop="totalQuantity" class="grid-item">
              <div class="input-with-unit">
                <el-input-number
                  v-model="formData.totalQuantity"
                  :min="0"
                  placeholder="请输入现货数量"
                  class="beautiful-number-input"
                />
                <span class="unit-label">件</span>
              </div>
            </el-form-item>

            <!-- 包材数量 -->
            <el-form-item label="包材数量" prop="packagingMaterialQuantity" class="grid-item">
              <div class="input-with-unit">
                <el-input-number
                  v-model="formData.packagingMaterialQuantity"
                  :min="0"
                  placeholder="请输入包材数量"
                  class="beautiful-number-input"
                />
                <span class="unit-label">件</span>
              </div>
            </el-form-item>

            <!-- 返单时效 -->
            <el-form-item label="返单时效" prop="orderReplenishmentLeadTime" class="grid-item">
              <div class="input-with-unit">
                <el-input
                  v-model="formData.orderReplenishmentLeadTime"
                  placeholder="请输入返单时效数值"
                  class="beautiful-input"
                />
                <span class="unit-label">天</span>
              </div>
            </el-form-item>
          </div>
        </div>

        <!-- 产品规格 -->
        <div class="form-section">
          <div class="section-title">
            <Icon icon="ep:scale-to-original" class="section-icon" />
            <span>产品规格</span>
          </div>
          <div class="form-grid">
            <!-- 品长宽高 -->
            <el-form-item label="品长宽高" prop="productLength" class="grid-item">
              <div class="input-with-unit">
                <el-input
                  v-model="formData.productLength"
                  placeholder="品长宽高"
                  class="beautiful-input"
                />
                <span class="unit-label">cm</span>
              </div>
            </el-form-item>

            <!-- 产品重量 -->
            <el-form-item label="产品重量" prop="weight" class="grid-item">
              <div class="input-with-unit">
                <el-input-number
                  v-model="formData.weight"
                  placeholder="请输入产品重量数值"
                  :min="0"
                  class="beautiful-number-input"
                />
                <span class="unit-label">g</span>
              </div>
            </el-form-item>
          </div>
        </div>

        <!-- 包装规格 -->
        <div class="form-section">
          <div class="section-title">
            <Icon icon="ep:present" class="section-icon" />
            <span>包装规格</span>
          </div>
          <div class="form-grid">
            <!-- 箱规数量 -->
            <el-form-item label="箱规数量" prop="productCartonSpec" class="grid-item">
              <div class="input-with-unit">
                <el-input
                  v-model="formData.productCartonSpec"
                  placeholder="箱规数量"
                  class="beautiful-input"
                />
                <span class="unit-label">个</span>
              </div>
            </el-form-item>

            <!-- 箱长宽高 -->
            <el-form-item label="箱长宽高" prop="cartonLength" class="grid-item">
              <div class="input-with-unit">
                <el-input
                  v-model="formData.cartonLength"
                  placeholder="箱长宽高"
                  class="beautiful-input"
                />
                <span class="unit-label">cm</span>
              </div>
            </el-form-item>

            <!-- 箱规重量 -->
            <el-form-item label="箱规重量" prop="cartonWeight" class="grid-item">
              <div class="input-with-unit">
                <el-input-number
                  v-model="formData.cartonWeight"
                  :min="0"
                  placeholder="请输入箱规重量数值"
                  class="beautiful-number-input"
                />
                <span class="unit-label">g</span>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ProductVO } from '@/api/erp/product/product/index';
import { Editor } from '@/components/Editor';
import { PropType } from 'vue';
import { propTypes } from '@/utils/propTypes';
import { copyValueToTarget } from '@/utils';

defineOptions({ name: 'ProductDescriptionForm' });

const message = useMessage(); // 消息弹窗

const props = defineProps({
  propFormData: {
    type: Object as PropType<ProductVO>,
    default: () => {},
  },
  activeName: propTypes.string.def(''),
  isDetail: propTypes.bool.def(false), // 是否作为详情组件
});
const formRef = ref(); // 表单Ref
const formData = reactive<ProductVO>({
  totalQuantity: 0, // 现货数量
  packagingMaterialQuantity: 0, // 包材数量
  orderReplenishmentLeadTime: '', // 返单时效
  orderReplenishmentLeadTimeUnit: '天', // 返单时效单位
  productLength: '', // 品长
  productWidth: '', // 品宽
  productHeight: '', // 品高
  productDimensionsUnit: 'mm', // 品长宽高单位
  cartonLength: '', // 箱长
  cartonWidth: '', // 箱宽
  cartonHeight: '', // 箱高
  cartonDimensionsUnit: 'mm', // 箱长宽高单位
  cartonWeight: 0, // 箱规重量
  cartonWeightUnit: 'g', // 箱规重量单位
  weight: 0, // 产品重量
  productCartonSpec:'',
});

const rules = reactive({
  // totalQuantity: [{ required: true, message: '现货数量不能为空', trigger: 'blur' }],
  // packagingMaterialQuantity: [
  //   { required: true, message: '包材数量不能为空', trigger: 'blur' },
  // ],
  // orderReplenishmentLeadTime: [
  //   { required: true, message: '返单时效不能为空', trigger: 'blur' },
  // ],
  productDimensions: [{ required: true, message: '品长宽高不能为空', trigger: 'blur' }],
  weight: [{ required: true, message: '产品重量不能为空', trigger: 'blur' }],
  productWidth: [{ required: true, message: '箱规数量不能为空', trigger: 'blur' }],
  cartonDimensions: [{ required: true, message: '箱长宽高不能为空', trigger: 'blur' }],
  cartonWeight: [{ required: true, message: '箱规重量不能为空', trigger: 'blur' }],
  // cartonHeight: [{ required: true, message: '箱高不能为空', trigger: 'blur' }],
  // cartonWeight: [{ required: true, message: '箱规重量不能为空', trigger: 'blur' }],
});

watch(
  () => props.propFormData,
  (data) => {
    if (!data) return;
    copyValueToTarget(formData, data);
  },
  {
    immediate: true,
  }
);

const emit = defineEmits(['update:activeName']);
const validate = async () => {
  if (!formRef) return;
  try {
    await unref(formRef)?.validate();
    Object.assign(props.propFormData, formData);
  } catch (e) {
    message.error('【库存箱规信息】不完善，请填写相关信息');
    emit('update:activeName', 'description');
    throw e;
  }
};
defineExpose({ validate });
</script>

<style scoped lang="scss">
.description-form-container {
  background: linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%);
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
  background: linear-gradient(135deg, #c3f0ca 0%, #faf3e0 100%);
  border-radius: 12px;
  color: #2c3e50;
  box-shadow: 0 4px 20px rgba(168, 230, 207, 0.3);
}

.header-icon {
  margin-right: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  backdrop-filter: blur(10px);
  color: #52c41a;
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
  background: linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%);
  border-radius: 12px;
  border: 1px solid rgba(82, 196, 26, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #a8e6cf 0%, #dcedc1 100%);
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
    color: #52c41a;
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
      box-shadow: 0 4px 12px rgba(82, 196, 26, 0.2);
      border-color: #52c41a;
    }

    &.is-focus {
      box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
      border-color: #52c41a;
    }
  }

  :deep(.el-input__inner) {
    font-size: 14px;
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
      box-shadow: 0 4px 12px rgba(82, 196, 26, 0.2);
      border-color: #52c41a;
    }

    &.is-focus {
      box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
      border-color: #52c41a;
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
    background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(82, 196, 26, 0.3);
    min-width: 40px;
    text-align: center;
  }
}
</style>
