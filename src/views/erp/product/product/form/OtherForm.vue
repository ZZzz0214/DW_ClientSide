<!-- 商品发布 - 机制信息 -->
<template>
  <div class="other-form-container">
    <!-- 标题区域 -->
    <div class="form-header">
      <div class="header-icon">
        <Icon icon="ep:setting" class="text-2xl" />
      </div>
      <div class="header-text">
        <h3 class="header-title">机制信息</h3>
        <p class="header-subtitle">设置各平台活动的最低价格</p>
      </div>
    </div>

    <!-- 表单内容区域 -->
    <div class="form-content">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="160px"
        :disabled="isDetail"
        class="beautiful-form"
      >
        <!-- 平台活动价格 -->
        <div class="form-section">
          <div class="section-title">
            <Icon icon="ep:money" class="section-icon" />
            <span>平台活动价格</span>
          </div>
          <div class="form-grid">
            <!-- 公域活动最低价 -->
            <el-form-item label="公域活动最低价" prop="publicDomainEventMinimumPrice" class="grid-item">
              <div class="price-input-wrapper">
                <Icon icon="ep:globe" class="platform-icon" />
                <el-input
                  v-model="formData.publicDomainEventMinimumPrice"
                  placeholder="请输入公域活动最低价"
                  class="beautiful-input"
                />
                <span class="unit-label">元</span>
              </div>
            </el-form-item>

            <!-- 直播活动最低价 -->
            <el-form-item label="直播活动最低价" prop="liveStreamingEventMinimunPrice" class="grid-item">
              <div class="price-input-wrapper">
                <Icon icon="ep:video-camera" class="platform-icon" />
                <el-input
                  v-model="formData.liveStreamingEventMinimunPrice"
                  placeholder="请输入直播活动最低价"
                  class="beautiful-input"
                />
                <span class="unit-label">元</span>
              </div>
            </el-form-item>

            <!-- 多多活动最低价 -->
            <el-form-item label="多多活动最低价" prop="pinduoduoEventMinimumPrice" class="grid-item">
              <div class="price-input-wrapper">
                <Icon icon="ep:shopping-cart" class="platform-icon" />
                <el-input
                  v-model="formData.pinduoduoEventMinimumPrice"
                  placeholder="请输入多多活动最低价"
                  class="beautiful-input"
                />
                <span class="unit-label">元</span>
              </div>
            </el-form-item>

            <!-- 阿里活动最低价 -->
            <el-form-item label="阿里活动最低价" prop="alibabaEventMinimunPrice" class="grid-item">
              <div class="price-input-wrapper">
                <Icon icon="ep:shop" class="platform-icon" />
                <el-input
                  v-model="formData.alibabaEventMinimunPrice"
                  placeholder="请输入阿里活动最低价"
                  class="beautiful-input"
                />
                <span class="unit-label">元</span>
              </div>
            </el-form-item>

            <!-- 团购活动最低价 -->
            <el-form-item label="团购活动最低价" prop="groupBuyEventMinimunPrice" class="grid-item">
              <div class="price-input-wrapper">
                <Icon icon="ep:user-filled" class="platform-icon" />
                <el-input
                  v-model="formData.groupBuyEventMinimunPrice"
                  placeholder="请输入团购活动最低价"
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
// import type { Spu } from '@/api/mall/product/spu'
import type { ProductVO } from '@/api/erp/product/product/index';
import { PropType } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { copyValueToTarget } from '@/utils'

defineOptions({ name: 'ProductOtherForm' })

const message = useMessage() // 消息弹窗

const props = defineProps({
  propFormData: {
    type: Object as PropType<ProductVO>,
    default: () => {}
  },
  isDetail: propTypes.bool.def(false) // 是否作为详情组件
})

const formRef = ref() // 表单Ref
// 表单数据
const formData = reactive<ProductVO>({
  publicDomainEventMinimumPrice: '', // 公域活动最低价
  liveStreamingEventMinimunPrice: '', // 直播活动最低价
  pinduoduoEventMinimumPrice: '', // 多多活动最低价
  alibabaEventMinimunPrice: '', // 阿里活动最低价
  groupBuyEventMinimunPrice: '' // 团购活动最低价
});

const rules = reactive({
  // publicDomainEventMinimumPrice: [{ required: true, message: '公域活动最低价不能为空', trigger: 'blur' }],
  // liveStreamingEventMinimunPrice: [{ required: true, message: '直播活动最低价不能为空', trigger: 'blur' }],
  // pinduoduoEventMinimumPrice: [{ required: true, message: '多多活动最低价不能为空', trigger: 'blur' }],
  // alibabaEventMinimunPrice: [{ required: true, message: '阿里活动最低价不能为空', trigger: 'blur' }],
  // groupBuyEventMinimunPrice: [{ required: true, message: '团购活动最低价不能为空', trigger: 'blur' }]
});

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
  if (!formRef) return
  try {
    await unref(formRef)?.validate()
    // 校验通过更新数据
    Object.assign(props.propFormData, formData)
  } catch (e) {
    message.error('【机制信息】不完善，请填写相关信息')
    emit('update:activeName', 'other')
    throw e // 目的截断之后的校验
  }
}
defineExpose({ validate })
</script>

<style scoped lang="scss">
.other-form-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: linear-gradient(135deg, #c471ed 0%, #f64f59 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.header-icon {
  margin-right: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(10px);
}

.header-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.header-subtitle {
  margin: 4px 0 0 0;
  font-size: 14px;
  opacity: 0.9;
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
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
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
    color: #667eea;
    font-size: 18px;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
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

.price-input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 12px;
  background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
  border-radius: 8px;
  border: 1px solid #e1e8ed;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }

  &:focus-within {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .platform-icon {
    color: #667eea;
    font-size: 20px;
    flex-shrink: 0;
  }

  .beautiful-input {
    flex: 1;
    
    :deep(.el-input__wrapper) {
      border: none;
      box-shadow: none;
      background: transparent;
      padding: 0;

      &:hover,
      &.is-focus {
        border: none;
        box-shadow: none;
      }
    }

    :deep(.el-input__inner) {
      font-size: 14px;
      background: transparent;
    }
  }

  .unit-label {
    color: white;
    font-weight: 500;
    font-size: 12px;
    padding: 4px 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    flex-shrink: 0;
  }
}
</style>
