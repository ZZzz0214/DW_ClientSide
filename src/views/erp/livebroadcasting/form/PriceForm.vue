<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <!-- 直播价格 -->
      <el-form-item label="直播价格" prop="livePrice">
        <div class="price-input-container">
          <el-input
            v-model="formData.livePrice"
            placeholder="请输入直播价格"
            class="price-input"
            :class="{ 'detail-mode': isDetail }"
          >
            <template #append>
              <span class="unit-text">元</span>
            </template>
          </el-input>
        </div>
      </el-form-item>

      <!-- 直播佣金 -->
      <el-form-item label="直播佣金" prop="liveCommission">
        <el-input-number
          v-model="formData.liveCommission"
          :min="0"
          placeholder="请输入直播佣金"
          class="w-240px"
        />
        <span style="margin-left: 25px;">%</span>
      </el-form-item>

      <!-- 公开佣金 -->
      <el-form-item label="公开佣金" prop="publicCommission">
        <el-input-number
          v-model="formData.publicCommission"
          :min="0"
          placeholder="请输入公开佣金"
          class="w-240px"
        />
        <span style="margin-left: 25px;">%</span>
      </el-form-item>

      <!-- 返点佣金 -->
      <el-form-item label="返点佣金" prop="rebateCommission">
        <el-input-number
          v-model="formData.rebateCommission"
          :min="0"
          placeholder="请输入返点佣金"
          class="w-240px"
        />
        <span style="margin-left: 25px;">%</span>
      </el-form-item>
    </el-form>
  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import type { LiveBroadcastingVO } from '@/api/erp/livebroadcasting'

  defineOptions({ name: 'ErpLiveBroadcastingPriceForm' })

  const props = defineProps({
    propFormData: {
      type: Object as PropType<LiveBroadcastingVO>,
      default: () => {}
    },
    isDetail: propTypes.bool.def(false)
  })

  const message = useMessage()
  const formRef = ref()
  const formData = reactive<LiveBroadcastingVO>({
    livePrice: '',
    liveCommission: 0,
    publicCommission: 0,
    rebateCommission: 0
  })

  const rules = reactive({
    livePrice: [{ required: true, message: '直播价格不能为空', trigger: 'blur' }],
    liveCommission: [
      { required: true, message: '直播佣金不能为空', trigger: 'blur' },
      { type: 'number', min: 0.01, message: '直播佣金必须大于0', trigger: 'blur' }
    ],
    publicCommission: [
      { required: true, message: '公开佣金不能为空', trigger: 'blur' },
      { type: 'number', min: 0.01, message: '公开佣金必须大于0', trigger: 'blur' }
    ]
  })

  /** 将传进来的值赋值给 formData */
  watch(
    () => props.propFormData,
    (data) => {
      if (!data) return
      copyValueToTarget(formData, data)
    },
    { immediate: true }
  )

  /** 表单校验 */
  const emit = defineEmits(['update:activeName'])
  const validate = async () => {
    if (!formRef) return
    try {
      await unref(formRef)?.validate()
      Object.assign(props.propFormData, formData)
    } catch (e) {
      message.error('【价格机制】不完善，请填写相关信息')
      emit('update:activeName', 'price')
      throw e
    }
  }

  defineExpose({ validate })
  </script>

<style lang="scss" scoped>
.price-input-container {
  display: flex;
  align-items: center;
  
  .price-input {
    width: 180px;
    
    &.detail-mode {
      :deep(.el-input__wrapper) {
        background-color: #f5f7fa;
        border-color: #e4e7ed;
        box-shadow: 0 0 0 1px #e4e7ed inset;
      }
    }
    
    :deep(.el-input-group__append) {
      background-color: #fafafa;
      border-left: 0;
      color: #606266;
      font-weight: 500;
      padding: 0 15px;
      
      .unit-text {
        font-size: 14px;
      }
    }
  }
}</style>
