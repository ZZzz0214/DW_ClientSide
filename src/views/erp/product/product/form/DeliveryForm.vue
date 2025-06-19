<!-- 商品发布 - 快递售后信息 -->
<!--<template>-->
<!--  <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" :disabled="isDetail">-->
<!--    <el-form-item label="配送方式" prop="deliveryTypes">-->
<!--      <el-checkbox-group v-model="formData.deliveryTypes" class="w-80">-->
<!--        <el-checkbox-->
<!--          v-for="dict in getIntDictOptions(DICT_TYPE.TRADE_DELIVERY_TYPE)"-->
<!--          :key="dict.value"-->
<!--          :value="dict.value"-->
<!--        >-->
<!--          {{ dict.label }}-->
<!--        </el-checkbox>-->
<!--      </el-checkbox-group>-->
<!--    </el-form-item>-->
<!--    <el-form-item-->
<!--      label="运费模板"-->
<!--      prop="deliveryTemplateId"-->
<!--      v-if="formData.deliveryTypes?.includes(DeliveryTypeEnum.EXPRESS.type)"-->
<!--    >-->
<!--      <el-select placeholder="请选择运费模板" v-model="formData.deliveryTemplateId" class="w-80">-->
<!--        <el-option-->
<!--          v-for="item in deliveryTemplateList"-->
<!--          :key="item.id"-->
<!--          :label="item.name"-->
<!--          :value="item.id"-->
<!--        />-->
<!--      </el-select>-->
<!--    </el-form-item>-->
<!--  </el-form>-->
<!--</template>-->
<template>
  <div class="delivery-form-container">
    <!-- 标题区域 -->
    <div class="form-header">
      <div class="header-icon">
        <Icon icon="ep:truck" class="text-2xl" />
      </div>
      <div class="header-text">
        <h3 class="header-title">快递售后</h3>
        <p class="header-subtitle">配置产品的物流和售后服务信息</p>
      </div>
    </div>

    <!-- 表单内容区域 -->
    <div class="form-content">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        :disabled="isDetail"
        class="beautiful-form"
      >
        <!-- 物流信息 -->
        <div class="form-section">
          <div class="section-title">
            <Icon icon="ep:position" class="section-icon" />
            <span>物流信息</span>
          </div>
          <div class="form-grid">
            <!-- 发货地址 -->
            <el-form-item label="发货地址" prop="shippingAddress" class="grid-item">
              <el-input
                v-model="formData.shippingAddress"
                placeholder="请输入发货地址"
                class="beautiful-input"
                :disabled="isDetail"
                prefix-icon="ep:location"
              />
            </el-form-item>

            <!-- 退货地址 -->
            <el-form-item label="退货地址" prop="returnAddress" class="grid-item">
              <el-input
                v-model="formData.returnAddress"
                placeholder="请输入退货地址"
                class="beautiful-input"
                :disabled="isDetail"
                prefix-icon="ep:location-information"
              />
            </el-form-item>

            <!-- 快递公司 -->
            <el-form-item label="快递公司" prop="logisticsCompany" class="grid-item">
              <el-input
                v-model="formData.logisticsCompany"
                placeholder="请输入快递公司"
                class="beautiful-input"
                :disabled="isDetail"
                prefix-icon="ep:van"
              />
            </el-form-item>
          </div>
        </div>

        <!-- 配送区域 -->
        <div class="form-section">
          <div class="section-title">
            <Icon icon="ep:map-location" class="section-icon" />
            <span>配送区域</span>
          </div>
          <div class="form-grid">
            <!-- 不发货区 -->
            <el-form-item label="不发货区" prop="nonshippingArea" class="grid-item">
              <el-input
                v-model="formData.nonshippingArea"
                placeholder="请输入不发货区"
                class="beautiful-input"
                :disabled="isDetail"
                prefix-icon="ep:close"
              />
            </el-form-item>

            <!-- 加邮地区 -->
            <el-form-item label="加邮地区" prop="addonShippingArea" class="grid-item">
              <el-input
                v-model="formData.addonShippingArea"
                placeholder="请输入加邮地区"
                class="beautiful-input"
                :disabled="isDetail"
                prefix-icon="ep:plus"
              />
            </el-form-item>
          </div>
        </div>

        <!-- 售后服务 -->
        <div class="form-section">
          <div class="section-title">
            <Icon icon="ep:customer-service" class="section-icon" />
            <span>售后服务</span>
          </div>
          <!-- 售后标准 -->
          <el-form-item label="售后标准" prop="afterSalesStandard">
            <el-input
              type="textarea"
              v-model="formData.afterSalesStandard"
              placeholder="请输入售后标准"
              class="beautiful-textarea"
              :disabled="isDetail"
              :autosize="{ minRows: 3, maxRows: 6 }"
            />
          </el-form-item>

          <!-- 售后话术 -->
          <el-form-item label="售后话术" prop="afterSalesScript">
            <el-input
              type="textarea"
              v-model="formData.afterSalesScript"
              placeholder="请输入售后话术"
              class="beautiful-textarea"
              :disabled="isDetail"
              :autosize="{ minRows: 3, maxRows: 6 }"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PropType } from 'vue'
import { copyValueToTarget } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import type { ProductVO } from '@/api/erp/product/product/index';

import * as ExpressTemplateApi from '@/api/mall/trade/delivery/expressTemplate'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { DeliveryTypeEnum } from '@/utils/constants'

defineOptions({ name: 'ErpProductDeliveryForm' })

const message = useMessage() // 消息弹窗

const props = defineProps({
  propFormData: {
    type: Object as PropType<ProductVO>,
    default: () => {}
  },
  isDetail: propTypes.bool.def(false) // 是否作为详情组件
})
const formRef = ref() // 表单 Ref
const formData = reactive<ProductVO>({
  shippingAddress: '', // 发货地址
  returnAddress: '', // 退货地址
  logisticsCompany: '', // 快递公司
  nonshippingArea: '', // 不发货区
  addonShippingArea: '', // 加邮地区
  afterSalesStandard: '', // 售后标准
  afterSalesScript: '' // 售后话术
});
const rules = reactive({
  // shippingAddress: [{ required: true, message: '发货地址不能为空', trigger: 'blur' }],
  // returnAddress: [{ required: true, message: '退货地址不能为空', trigger: 'blur' }],
  // logisticsCompany: [{ required: true, message: '快递公司不能为空', trigger: 'blur' }],
  // nonshippingArea: [{ required: true, message: '不发货区不能为空', trigger: 'blur' }],
  // addonShippingArea: [{ required: true, message: '加邮地区不能为空', trigger: 'blur' }],
  // afterSalesStandard: [{ required: true, message: '售后标准不能为空', trigger: 'blur' }],
  // afterSalesScript: [{ required: true, message: '售后话术不能为空', trigger: 'blur' }]
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
    message.error('【快递售后信息】不完善，请填写相关信息')
    emit('update:activeName', 'delivery')
    throw e // 目的截断之后的校验
  }
}
defineExpose({ validate })

/** 初始化 */
const deliveryTemplateList = ref([]) // 运费模版
onMounted(async () => {
  deliveryTemplateList.value = await ExpressTemplateApi.getSimpleTemplateList()
})
</script>

<style scoped lang="scss">
.delivery-form-container {
  background: linear-gradient(135deg, #ff9a8b 0%, #a8e6cf 100%);
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
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 20px rgba(255, 154, 139, 0.3);
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
  background: linear-gradient(135deg, #fff5f5 0%, #f0fdf4 100%);
  border-radius: 12px;
  border: 1px solid rgba(255, 154, 139, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff9a8b 0%, #a8e6cf 100%);
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
    color: #ff6b6b;
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
      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.2);
      border-color: #ff6b6b;
    }

    &.is-focus {
      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
      border-color: #ff6b6b;
    }
  }

  :deep(.el-input__inner) {
    font-size: 14px;
  }
}

.beautiful-textarea {
  :deep(.el-textarea__inner) {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e1e8ed;
    transition: all 0.3s ease;
    font-family: inherit;
    resize: vertical;

    &:hover {
      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.2);
      border-color: #ff6b6b;
    }

    &:focus {
      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
      border-color: #ff6b6b;
    }
  }
}
</style>
