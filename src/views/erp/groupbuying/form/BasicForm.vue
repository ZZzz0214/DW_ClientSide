<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <!-- 开团价格 -->
      <el-form-item label="开团价格" prop="groupPrice">
        <div style="display: flex; align-items: center;">
        <el-input-number
          v-model="formData.groupPrice"
          :min="0"
          :precision="2"
          placeholder="请输入开团价格"
          class="w-80"
          @change="calculateProfit"
        />
          <span style="margin-left: 25px;">元</span>
        </div>
      </el-form-item>

      <!-- 帮卖佣金 -->
      <el-form-item label="帮卖佣金" prop="sellingCommission">
        <div style="display: flex; align-items: center;">
        <el-input-number
          v-model="formData.sellingCommission"
          :min="0"
          :precision="2"
          placeholder="请输入帮卖佣金"
          class="w-80"
        />
          <span style="margin-left: 25px;">元</span>
        </div>
      </el-form-item>

      <!-- 供货价格 -->
      <el-form-item label="供货价格" prop="supplyGroupPrice">
        <div style="display: flex; align-items: center;">
        <el-input-number
          v-model="formData.supplyGroupPrice"
          :min="0"
          :precision="2"
          placeholder="请输入供货价格"
          class="w-80"
          @change="calculateProfit"
        />
          <span style="margin-left: 25px;">元</span>
        </div>
      </el-form-item>

      <!-- 渠道毛利 -->
      <el-form-item label="渠道毛利" prop="channelProfit">
        <div style="display: flex; align-items: center;">
        <el-input-number
          v-model="formData.channelProfit"
          :precision="2"
          placeholder="请输入渠道毛利"
          class="w-80"
          :disabled="true"
        />
        <span style="margin-left: 25px;">%</span>
        </div>
      </el-form-item>

      <!-- 开团机制 -->
      <el-form-item label="开团机制" prop="groupMechanism">
        <el-input
          v-model="formData.groupMechanism"
          type="textarea"
          placeholder="请输入开团机制"
          class="w-80"
          :autosize="{ minRows: 2, maxRows: 4 }"
        />
      </el-form-item>

      <!-- 快递费用 -->
      <el-form-item label="快递费用" prop="expressFee">
        <div style="display: flex; align-items: center;">
        <el-input-number
          v-model="formData.expressFee"
          :min="0"
          :precision="2"
          placeholder="请输入快递费用"
          class="w-80"
        />
          <span style="margin-left: 25px;">元</span>
        </div>
      </el-form-item>
    </el-form>
  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import type { GroupBuyingVO } from '@/api/erp/groupbuying'

  defineOptions({ name: 'ErpGroupBuyingBasicForm' })

  const props = defineProps({
    propFormData: {
      type: Object as PropType<GroupBuyingVO>,
      default: () => {}
    },
    isDetail: propTypes.bool.def(false)
  })

  const message = useMessage()
  const formRef = ref()
  const formData = reactive({
    groupPrice: 0,
    sellingCommission: 0,
    supplyGroupPrice: 0,
    channelProfit: 0,
    groupMechanism: '',
    expressFee: 0
  })

  const rules = reactive({
    groupPrice: [{ required: true, message: '开团价格不能为空', trigger: 'blur' }],
    sellingCommission: [{ required: true, message: '帮卖佣金不能为空', trigger: 'blur' }],
    supplyGroupPrice: [{ required: true, message: '供货价格不能为空', trigger: 'blur' }],
    groupMechanism: [{ required: true, message: '开团机制不能为空', trigger: 'blur' }],
    expressFee: [{ required: true, message: '快递费用不能为空', trigger: 'blur' }]
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
  const emit = defineEmits(['update:activeName', 'update:formData'])
  const validate = async () => {
    if (!formRef) return
    try {
      await unref(formRef)?.validate()
      
      // 通过emit事件将数据传递给父组件，而不是直接修改props
      const updatedData = { ...formData }
      emit('update:formData', updatedData)
    } catch (e) {
      message.error('【基础机制】不完善，请填写相关信息')
      emit('update:activeName', 'basic')
      throw e
    }
  }

const calculateProfit = () => {
  if (formData.groupPrice > 0 && formData.supplyGroupPrice > 0) {
    formData.channelProfit = parseFloat((100 * ((formData.groupPrice - formData.supplyGroupPrice) / formData.groupPrice)).toFixed(2))
  } else {
    formData.channelProfit = 0
  }
}

  defineExpose({ validate })
  </script>
