<!-- 商品发布 - 合格证信息 -->
<template>
  <div class="sku-form-container">
    <!-- 标题区域 -->
    <div class="form-header">
      <div class="header-icon">
        <Icon icon="ep:medal" class="text-2xl" />
      </div>
      <div class="header-text">
        <h3 class="header-title">合格证信息</h3>
        <p class="header-subtitle">填写产品的合格证相关信息</p>
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
        <!-- 编号信息 -->
        <div class="form-section">
          <div class="section-title">
            <Icon icon="ep:collection-tag" class="section-icon" />
            <span>编号信息</span>
          </div>
          <div class="form-grid">
            <!-- 条形编号 -->
            <el-form-item label="条形编号" prop="barCode" class="grid-item">
              <el-input
                v-model="formData.barCode"
                placeholder="请输入条形编号"
                class="beautiful-input"
                :disabled="isDetail"
                prefix-icon="ep:price-tag"
              />
            </el-form-item>

            <!-- 备案编号 -->
            <el-form-item label="备案编号" prop="productRecord" class="grid-item">
              <el-input
                v-model="formData.productRecord"
                placeholder="请输入备案编号"
                class="beautiful-input"
                :disabled="isDetail"
                prefix-icon="ep:document-checked"
              />
            </el-form-item>

            <!-- 执行编号 -->
            <el-form-item label="执行编号" prop="executionCode" class="grid-item">
              <el-input
                v-model="formData.executionCode"
                placeholder="请输入执行编号"
                class="beautiful-input"
                :disabled="isDetail"
                prefix-icon="ep:operation"
              />
            </el-form-item>

            <!-- 商标编号 -->
            <el-form-item label="商标编号" prop="trademarkCode" class="grid-item">
              <el-input
                v-model="formData.trademarkCode"
                placeholder="请输入商标编号"
                class="beautiful-input"
                :disabled="isDetail"
                prefix-icon="ep:stamp"
              />
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
import {
  getPropertyList,
  PropertyAndValues,
  RuleConfig,
  SkuList
} from '@/views/mall/product/spu/components/index'
import ProductAttributes from './ProductAttributes.vue'
import ProductPropertyAddForm from './ProductPropertyAddForm.vue'

import type { ProductVO } from '@/api/erp/product/product/index';
defineOptions({ name: 'ErpProductForm' })


// sku 相关属性校验规则
// const ruleConfig: RuleConfig[] = [
//   {
//     name: 'stock',
//     rule: (arg) => arg >= 0,
//     message: '商品库存必须大于等于 1 ！！！'
//   },
//   {
//     name: 'price',
//     rule: (arg) => arg >= 0.01,
//     message: '商品销售价格必须大于等于 0.01 元！！！'
//   },
//   {
//     name: 'marketPrice',
//     rule: (arg) => arg >= 0.01,
//     message: '商品市场价格必须大于等于 0.01 元！！！'
//   },
//   {
//     name: 'costPrice',
//     rule: (arg) => arg >= 0.01,
//     message: '商品成本价格必须大于等于 0.00 元！！！'
//   }
// ]

const message = useMessage() // 消息弹窗
const formLoading = ref(false)
const props = defineProps({
  propFormData: {
    type: Object as PropType<ProductVO>,
    default: () => {}
  },
  isDetail: propTypes.bool.def(false) // 是否作为详情组件
})
const attributesAddFormRef = ref() // 添加商品属性表单
const formRef = ref() // 表单 Ref
const propertyList = ref<PropertyAndValues[]>([]) // 商品属性列表
const skuListRef = ref() // 商品属性列表 Ref
const formData = reactive<ProductVO>({
  barCode: '', // 条形编号
  productRecord: '', // 备案编号
  executionCode: '', // 执行编号
  trademarkCode: '' // 商标编号
});
const rules = reactive({
  barCode: [{ required: true, message: '条形编号不能为空', trigger: 'blur' }],
});

/** 将传进来的值赋值给 formData */
watch(
  () => props.propFormData,
  (data) => {
    if (!data) {
      return
    }
    copyValueToTarget(formData, data)
    // 将 SKU 的属性，整理成 PropertyAndValues 数组
    //propertyList.value = getPropertyList(data)
  },
  {
    immediate: true
  }
)

/** 表单校验 */
const emit = defineEmits(['update:activeName'])
// const validate = async () => {
//   if (!formRef) return
//   try {
//     // 校验 sku
//     skuListRef.value.validateSku()
//     await unref(formRef).validate()
//     // 校验通过更新数据
//     Object.assign(props.propFormData, formData)
//   } catch (e) {
//     message.error('【合格证信息】不完善，请填写相关信息')
//     emit('update:activeName', 'sku')
//     throw e // 目的截断之后的校验
//   }
// }
const validate = async () => {
  if (!formRef) return
  try {
    await unref(formRef)?.validate()
    // 校验通过更新数据
    Object.assign(props.propFormData, formData)
  } catch (e) {
    message.error('【合格证信息】不完善，请填写相关信息')
    emit('update:activeName', 'info')
    throw e // 目的截断之后的校验
  }
}
defineExpose({ validate })

/** 分销类型 */
// const changeSubCommissionType = () => {
//   // 默认为零，类型切换后也要重置为零
//   for (const item of formData.skus!) {
//     item.firstBrokeragePrice = 0
//     item.secondBrokeragePrice = 0
//   }
// }

/** 选择规格 */
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

/** 调用 SkuList generateTableData 方法*/
// const generateSkus = (propertyList: any[]) => {
//   skuListRef.value.generateTableData(propertyList)
// }
</script>

<style scoped lang="scss">
.sku-form-container {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
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
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  border-radius: 12px;
  color: #2c3e50;
  box-shadow: 0 4px 20px rgba(250, 112, 154, 0.3);
}

.header-icon {
  margin-right: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  backdrop-filter: blur(10px);
  color: #fa709a;
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
  background: linear-gradient(135deg, #fff8f0 0%, #fef3e2 100%);
  border-radius: 12px;
  border: 1px solid rgba(250, 112, 154, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #fa709a 0%, #fee140 100%);
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
    color: #fa709a;
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
      box-shadow: 0 4px 12px rgba(250, 112, 154, 0.2);
      border-color: #fa709a;
    }

    &.is-focus {
      box-shadow: 0 4px 12px rgba(250, 112, 154, 0.3);
      border-color: #fa709a;
    }
  }

  :deep(.el-input__inner) {
    font-size: 14px;
  }
}
</style>
