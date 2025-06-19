<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <div class="text-center mb-6">
        <div class="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
             :class="channelConfig.bgClass">
          <Icon :icon="channelConfig.icon" class="text-4xl text-white" />
        </div>
        <h3 class="text-xl font-semibold" :class="channelConfig.textClass">
          {{ channelConfig.title }}充值
        </h3>
      </div>

      <el-form-item label="充值渠道" prop="channelType">
        <el-input v-model="formData.channelType" disabled />
      </el-form-item>

      <el-form-item label="充值金额" prop="amount">
        <el-input-number
          v-model="formData.amount"
          :min="0.01"
          :max="999999.99"
          :precision="2"
          controls-position="right"
          placeholder="请输入充值金额"
          class="!w-100%"
        />
        <div class="mt-2 text-gray-500 text-sm">
          单次充值金额范围：¥0.01 - ¥999,999.99
        </div>
      </el-form-item>

      <el-form-item label="订单日期" prop="orderDate">
        <el-date-picker
          v-model="formData.orderDate"
          type="date"
          placeholder="请选择订单日期"
          value-format="YYYY-MM-DD"
          class="!w-100%"
        />
        <div class="mt-2 text-gray-500 text-sm">
          选择此次充值的订单日期，默认为今天
        </div>
      </el-form-item>

      <!-- 快捷金额选择 -->
      <el-form-item label="快捷选择">
        <div class="grid grid-cols-3 gap-2">
          <el-button
            v-for="amount in quickAmounts"
            :key="amount"
            plain
            @click="formData.amount = amount"
            class="!w-100%"
          >
            ¥{{ amount }}
          </el-button>
        </div>
      </el-form-item>

      <!-- 充值凭证图片 -->
      <el-form-item label="凭证图片" prop="carouselImages">
        <UploadImgs
          v-model="formData.carouselImages"
          :limit="5"
          :is-show-tip="true"
        />
        <div class="mt-2 text-gray-500 text-sm">
          请上传凭证图片截图，最多可上传5张图片
        </div>
      </el-form-item>

      <el-form-item label="充值说明" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入充值说明（可选）"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading" :loading="formLoading">
        确认充值
      </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import * as ErpFinanceApi from '@/api/erp/finance'

/** 充值弹窗 */
defineOptions({ name: 'RechargeDialog' })

const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中
const formData = ref({
  channelType: '',
  amount: undefined,
  orderDate: undefined,
  carouselImages: [],
  remark: ''
})

// 快捷金额选择
const quickAmounts = [10, 50, 100, 200, 500, 1000]

// 渠道配置
const channelConfigs = {
  '微信': {
    title: '微信',
    icon: 'ep:chat-dot-round',
    bgClass: 'bg-green-500',
    textClass: 'text-green-600'
  },
  '支付宝': {
    title: '支付宝',
    icon: 'ep:money',
    bgClass: 'bg-blue-500',
    textClass: 'text-blue-600'
  },
  '银行卡': {
    title: '银行卡',
    icon: 'ep:credit-card',
    bgClass: 'bg-orange-500',
    textClass: 'text-orange-600'
  }
}

const channelConfig = computed(() => {
  return channelConfigs[formData.value.channelType] || channelConfigs['微信']
})

const formRules = reactive({
  amount: [
    { required: true, message: '充值金额不能为空', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '充值金额必须大于0.01', trigger: 'blur' },
    { type: 'number', max: 999999.99, message: '充值金额不能超过999,999.99', trigger: 'blur' }
  ]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (channelType: string) => {
  dialogVisible.value = true
  dialogTitle.value = `${channelType}充值`
  resetForm()
  formData.value.channelType = channelType
  // 设置默认订单日期为今天
  formData.value.orderDate = new Date().toISOString().split('T')[0]
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()

  // 二次确认
  try {
    await message.confirm(
      `确认向${formData.value.channelType}账户充值 ¥${formData.value.amount} 元吗？`,
      '充值确认',
      {
        confirmButtonText: '确认充值',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
  } catch {
    return
  }

  // 提交请求
  formLoading.value = true
  try {
    await ErpFinanceApi.rechargeWithImages(
      formData.value.channelType,
      formData.value.amount,
      formData.value.carouselImages.join(','),
      formData.value.remark,
      formData.value.orderDate
    )
    message.success(`${formData.value.channelType}充值成功！`)
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } catch (error) {
    message.error(`充值失败：${error.message || '未知错误'}`)
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    channelType: '',
    amount: undefined,
    orderDate: undefined,
    carouselImages: [],
    remark: ''
  }
  formRef.value?.resetFields()
}
</script>

<style scoped>
:deep(.el-button) {
  transition: all 0.3s ease;
}

:deep(.el-button:hover) {
  transform: translateY(-1px);
}

.grid {
  display: grid;
}

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.gap-2 {
  gap: 0.5rem;
}
</style>
