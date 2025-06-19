<!-- 商品发布 - 运费信息 -->
<template>
  <div class="shipping-form-container">
    <!-- 标题区域 -->
    <div class="form-header">
      <div class="header-icon">
        <Icon icon="ep:van" class="text-2xl" />
      </div>
      <div class="header-text">
        <h3 class="header-title">运费信息</h3>
        <p class="header-subtitle">配置产品的运费计算方式</p>
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
        label-width="120px"
        class="beautiful-form"
      >
        <!-- 运费类型选择 -->
        <div class="form-section">
          <div class="section-title">
            <Icon icon="ep:setting" class="section-icon" />
            <span>运费类型</span>
          </div>
          <!-- 运费类型 -->
          <el-form-item label="运费类型" prop="shippingFeeType">
            <el-radio-group v-model="formData.shippingFeeType" @change="changeShippingFeeType" class="beautiful-radio-group">
              <el-radio :label="0" class="radio-card">
                <div class="radio-content">
                  <Icon icon="ep:money" class="radio-icon" />
                  <span>固定运费</span>
                </div>
              </el-radio>
              <el-radio :label="1" class="radio-card">
                <div class="radio-content">
                  <Icon icon="ep:box" class="radio-icon" />
                  <span>按件</span>
                </div>
              </el-radio>
              <el-radio :label="2" class="radio-card">
                <div class="radio-content">
                  <Icon icon="ep:scale" class="radio-icon" />
                  <span>按重量</span>
                </div>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <!-- 固定运费设置 -->
        <div class="form-section" v-if="formData.shippingFeeType === 0">
          <div class="section-title">
            <Icon icon="ep:money" class="section-icon" />
            <span>固定运费设置</span>
          </div>
          <!-- 固定运费 -->
          <el-form-item label="固定运费" prop="fixedShippingFee">
            <div class="input-with-unit">
              <el-input
                v-model="formData.fixedShippingFee"
                placeholder="请输入固定运费"
                :disabled="isDetail"
                class="beautiful-input"
              />
              <span class="unit-label">元</span>
            </div>
          </el-form-item>
        </div>

        <!-- 按件计费设置 -->
        <div class="form-section" v-if="formData.shippingFeeType === 1">
          <div class="section-title">
            <Icon icon="ep:box" class="section-icon" />
            <span>按件计费设置</span>
          </div>
          <div class="form-grid">
            <!-- 按件数量 -->
            <el-form-item label="按件数量" prop="additionalItemQuantity" class="grid-item">
              <div class="input-with-unit">
                <el-input
                  v-model="formData.additionalItemQuantity"
                  placeholder="请输入按件数量"
                  :disabled="isDetail"
                  class="beautiful-input"
                />
                <span class="unit-label">个</span>
              </div>
            </el-form-item>

            <!-- 按件价格 -->
            <el-form-item label="按件价格" prop="additionalItemPrice" class="grid-item">
              <div class="input-with-unit">
                <el-input
                  v-model="formData.additionalItemPrice"
                  placeholder="请输入按件价格"
                  :disabled="isDetail"
                  class="beautiful-input"
                />
                <span class="unit-label">元</span>
              </div>
            </el-form-item>
          </div>
        </div>

        <!-- 按重量计费设置 -->
        <div class="form-section" v-if="formData.shippingFeeType === 2">
          <div class="section-title">
            <Icon icon="ep:scale" class="section-icon" />
            <span>按重量计费设置</span>
          </div>
          <div class="form-grid">
            <!-- 首重重量 -->
            <el-form-item label="首重重量" prop="firstWeight" class="grid-item">
              <div class="input-with-unit">
                <el-input
                  v-model="formData.firstWeight"
                  placeholder="请输入首重重量"
                  :disabled="isDetail"
                  class="beautiful-input"
                />
                <span class="unit-label">g</span>
              </div>
            </el-form-item>

            <!-- 首重价格 -->
            <el-form-item label="首重价格" prop="firstWeightPrice" class="grid-item">
              <div class="input-with-unit">
                <el-input
                  v-model="formData.firstWeightPrice"
                  placeholder="请输入首重价格"
                  :disabled="isDetail"
                  class="beautiful-input"
                />
                <span class="unit-label">元</span>
              </div>
            </el-form-item>

            <!-- 续重重量 -->
            <el-form-item label="续重重量" prop="additionalWeight" class="grid-item">
              <div class="input-with-unit">
                <el-input
                  v-model="formData.additionalWeight"
                  placeholder="请输入续重重量"
                  :disabled="isDetail"
                  class="beautiful-input"
                />
                <span class="unit-label">g</span>
              </div>
            </el-form-item>

            <!-- 续重价格 -->
            <el-form-item label="续重价格" prop="additionalWeightPrice" class="grid-item">
              <div class="input-with-unit">
                <el-input
                  v-model="formData.additionalWeightPrice"
                  placeholder="请输入续重价格"
                  :disabled="isDetail"
                  class="beautiful-input"
                />
                <span class="unit-label">元</span>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { copyValueToTarget } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import type { ProductVO } from '@/api/erp/product/product/index'

defineOptions({ name: 'ProductshippingcostForm' })

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
const formData = reactive<ProductVO>({
  shippingFeeType: 0, // 运费类型
  fixedShippingFee: null, // 固定运费
  firstItemQuantity: null, // 首件数量
  firstItemPrice: null, // 首件价格
  additionalItemQuantity: null, // 续件数量
  additionalItemPrice: null, // 续件价格
  firstWeight: null, // 首重重量
  firstWeightPrice: null, // 首重价格
  additionalWeight: null, // 续重重量
  additionalWeightPrice: null // 续重价格
})
const rules = reactive({
  shippingFeeType: [{ required: true, message: '运费类型不能为空', trigger: 'blur' }]
})

/** 将传进来的值赋值给 formData */
watch(
  () => props.propFormData,
  (data) => {
    if (!data) {
      return
    }
    copyValueToTarget(formData, data)
  },
  {
    immediate: true
  }
)

/** 表单校验 */
const emit = defineEmits(['update:activeName'])
const validate = async () => {
  const form = unref(formRef)
  if (!form) {
    message.error('表单未初始化')
    return
  }
  try {
    await form.validate()
    // 校验通过更新数据
    Object.assign(props.propFormData, formData)
  } catch (e) {
    message.error('请完善运费信息')
    emit('update:activeName', 'shippingcost')
    throw e // 目的截断之后的校验
  }
}
defineExpose({ validate })

/** 运费类型切换 */
const changeShippingFeeType = () => {
  // 根据运费类型重置相关字段
  if (formData.shippingFeeType === 0) {
    formData.fixedShippingFee = null
  } else if (formData.shippingFeeType === 1) {
    formData.firstItemQuantity = null
    formData.firstItemPrice = null
    formData.additionalItemQuantity = null
    formData.additionalItemPrice = null
  } else if (formData.shippingFeeType === 2) {
    formData.firstWeight = null
    formData.firstWeightPrice = null
    formData.additionalWeight = null
    formData.additionalWeightPrice = null
  }
  // 更新校验规则
  updateRules()
}

/** 动态更新校验规则 */
const updateRules = () => {
  const newRules = {
    shippingFeeType: [{ required: true, message: '运费类型不能为空', trigger: 'blur' }]
  }

  if (formData.shippingFeeType === 0) {
    newRules.fixedShippingFee = [{ required: true, message: '固定运费不能为空', trigger: 'blur' }]
  } else if (formData.shippingFeeType === 1) {
    newRules.firstItemQuantity = [{ required: true, message: '首件数量不能为空', trigger: 'blur' }]
    newRules.firstItemPrice = [{ required: true, message: '首件价格不能为空', trigger: 'blur' }]
    newRules.additionalItemQuantity = [{ required: true, message: '续件数量不能为空', trigger: 'blur' }]
    newRules.additionalItemPrice = [{ required: true, message: '续件价格不能为空', trigger: 'blur' }]
  } else if (formData.shippingFeeType === 2) {
    newRules.firstWeight = [{ required: true, message: '首重重量不能为空', trigger: 'blur' }]
    newRules.firstWeightPrice = [{ required: true, message: '首重价格不能为空', trigger: 'blur' }]
    newRules.additionalWeight = [{ required: true, message: '续重重量不能为空', trigger: 'blur' }]
    newRules.additionalWeightPrice = [{ required: true, message: '续重价格不能为空', trigger: 'blur' }]
  }

  Object.assign(rules, newRules)
}
</script>

<style scoped lang="scss">
.shipping-form-container {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
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
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  border-radius: 12px;
  color: #2c3e50;
  box-shadow: 0 4px 20px rgba(79, 172, 254, 0.3);
}

.header-icon {
  margin-right: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  backdrop-filter: blur(10px);
  color: #4facfe;
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
  background: linear-gradient(135deg, #f0f9ff 0%, #f0fdfa 100%);
  border-radius: 12px;
  border: 1px solid rgba(79, 172, 254, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
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
    color: #4facfe;
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
      box-shadow: 0 4px 12px rgba(79, 172, 254, 0.2);
      border-color: #4facfe;
    }

    &.is-focus {
      box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
      border-color: #4facfe;
    }
  }

  :deep(.el-input__inner) {
    font-size: 14px;
  }
}

.beautiful-radio-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

  .radio-card {
    flex: 1;
    min-width: 120px;
    margin-right: 0 !important;

    :deep(.el-radio__input) {
      display: none;
    }

    :deep(.el-radio__label) {
      padding: 0;
      width: 100%;
    }

    .radio-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px 12px;
      border: 2px solid #e1e8ed;
      border-radius: 12px;
      background: white;
      transition: all 0.3s ease;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .radio-icon {
        font-size: 24px;
        color: #9ca3af;
        margin-bottom: 8px;
        transition: all 0.3s ease;
      }

      span {
        font-size: 14px;
        font-weight: 500;
        color: #6b7280;
        transition: all 0.3s ease;
      }

      &:hover {
        border-color: #4facfe;
        box-shadow: 0 4px 12px rgba(79, 172, 254, 0.2);
        
        .radio-icon {
          color: #4facfe;
        }
        
        span {
          color: #4facfe;
        }
      }
    }

    &.is-checked {
      .radio-content {
        border-color: #4facfe;
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);

        .radio-icon {
          color: #4facfe;
        }
        
        span {
          color: #4facfe;
          font-weight: 600;
        }
      }
    }
  }

  :deep(.el-radio.is-checked) {
    .radio-content {
      border-color: #4facfe;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);

      .radio-icon {
        color: #4facfe;
      }
      
      span {
        color: #4facfe;
        font-weight: 600;
      }
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
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3);
    min-width: 40px;
    text-align: center;
  }
}
</style>
