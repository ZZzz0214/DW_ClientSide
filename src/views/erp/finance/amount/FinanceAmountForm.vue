<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
      :disabled="disabled"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="编号" prop="no">
            <el-input v-model="formData.no" placeholder="系统自动生成" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收付账号" prop="channelType">
            <el-select v-model="formData.channelType" placeholder="请选择渠道类型" class="!w-100%">
              <el-option label="微信" value="微信">
                <div class="flex items-center">
                  <Icon icon="ep:chat-dot-round" class="mr-2 text-green-600" />
                  微信
                </div>
              </el-option>
              <el-option label="支付宝" value="支付宝">
                <div class="flex items-center">
                  <Icon icon="ep:money" class="mr-2 text-blue-600" />
                  支付宝
                </div>
              </el-option>
              <el-option label="银行卡" value="银行卡">
                <div class="flex items-center">
                  <Icon icon="ep:credit-card" class="mr-2 text-orange-600" />
                  银行卡
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="操作类型" prop="operationType">
            <el-select v-model="formData.operationType" placeholder="请选择操作类型" class="!w-100%">
              <el-option label="充值" :value="1">
                <div class="flex items-center">
                  <Icon icon="ep:top" class="mr-2 text-green-600" />
                  充值
                </div>
              </el-option>
              <el-option label="消费" :value="2">
                <div class="flex items-center">
                  <Icon icon="ep:bottom" class="mr-2 text-red-600" />
                  消费
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收付金额" prop="amount">
            <el-input-number
              v-model="formData.amount"
              :min="0"
              :precision="2"
              controls-position="right"
              placeholder="请输入金额"
              class="!w-100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="操作前余额" prop="beforeBalance">
            <el-input-number
              v-model="formData.beforeBalance"
              :precision="2"
              controls-position="right"
              placeholder="系统自动计算"
              disabled
              class="!w-100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作后余额" prop="afterBalance">
            <el-input-number
              v-model="formData.afterBalance"
              :precision="2"
              controls-position="right"
              placeholder="系统自动计算"
              disabled
              class="!w-100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="备注信息" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入备注信息"
        />
      </el-form-item>

<!--      &lt;!&ndash; 功能说明 &ndash;&gt;-->
<!--      <el-alert-->
<!--        title="说明"-->
<!--        description="此表单用于编辑已有的充值/消费记录。推荐使用上方的充值按钮进行新的充值操作。"-->
<!--        type="info"-->
<!--        :closable="false"-->
<!--        show-icon-->
<!--        class="mt-4"-->
<!--        v-if="formType === 'create'"-->
<!--      />-->

      <el-form-item label="凭证图片" prop="carouselImages" v-if="disabled">
        <div v-if="formData.carouselImages && formData.carouselImages.length > 0" class="image-gallery">
          <el-image
            v-for="(image, index) in getImageList(formData.carouselImages)"
            :key="index"
            :src="image"
            :preview-src-list="getImageList(formData.carouselImages)"
            class="gallery-image"
            fit="cover"
            preview-teleported
          />
        </div>
        <div v-else class="text-gray-400">
          暂无轮播图片
        </div>
      </el-form-item>

      <el-form-item label="凭证图片" prop="carouselImages" v-else>
        <UploadImgs
          v-model="formData.carouselImages"
          :limit="5"
          :is-show-tip="true"
        />
        <div class="text-gray-400 text-xs mt-1">
          请上传凭证图片，最多可上传5张图片
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading" v-if="!disabled">
        确 定
      </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import * as ErpFinanceApi from '@/api/erp/finance'

/** ERP 财务金额表单 */
defineOptions({ name: 'FinanceAmountForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改；detail - 详情
const formData = ref({
  id: undefined,
  no: undefined,
  carouselImages: [],
  channelType: undefined,
  amount: undefined,
  operationType: 1, // 默认为充值
  beforeBalance: 0,
  afterBalance: 0,
  remark: undefined
})
const formRules = reactive({
  channelType: [
    { required: true, message: '请选择渠道类型', trigger: 'change' }
  ],
  operationType: [
    { required: true, message: '请选择操作类型', trigger: 'change' }
  ],
  amount: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '金额必须大于0', trigger: 'blur' }
  ]
})
const formRef = ref() // 表单 Ref
const disabled = computed(() => formType.value === 'detail')

// 处理图片列表
const getImageList = (carouselImages: string | string[]) => {
  if (!carouselImages) return []
  if (Array.isArray(carouselImages)) return carouselImages
  return carouselImages.split(',').filter(img => img.trim())
}

// 监听渠道类型和金额变化，自动获取当前余额并计算操作后余额
watch([() => formData.value.channelType, () => formData.value.amount, () => formData.value.operationType], async () => {
  if (formData.value.channelType && formType.value === 'create') {
    try {
      // 获取当前渠道余额
      const currentBalance = await ErpFinanceApi.getChannelBalance(formData.value.channelType)
      formData.value.beforeBalance = currentBalance

      // 计算操作后余额
      if (formData.value.amount && formData.value.operationType) {
        if (formData.value.operationType === 1) { // 充值
          formData.value.afterBalance = currentBalance + formData.value.amount
        } else { // 消费
          formData.value.afterBalance = currentBalance - formData.value.amount
        }
      }
    } catch (error) {
      console.error('获取余额失败:', error)
    }
  }
})

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await ErpFinanceApi.getFinanceAmount(id)
      formData.value = {
        ...data,
        carouselImages: data.carouselImages ? (Array.isArray(data.carouselImages) ? data.carouselImages : data.carouselImages.split(',').filter(img => img.trim())) : []
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = {
      ...formData.value,
      carouselImages: Array.isArray(formData.value.carouselImages) ? formData.value.carouselImages.join(',') : formData.value.carouselImages
    } as unknown as ErpFinanceApi.ErpFinanceAmountVO
    if (formType.value === 'create') {
      await ErpFinanceApi.createFinanceAmount(data)
      message.success(t('common.createSuccess'))
    } else {
      await ErpFinanceApi.updateFinanceAmount(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    no: undefined,
    carouselImages: [],
    channelType: undefined,
    amount: undefined,
    operationType: 1, // 默认为充值
    beforeBalance: 0,
    afterBalance: 0,
    remark: undefined
  }
  formRef.value?.resetFields()
}
</script>

<style scoped>
:deep(.el-card__header) {
  padding: 12px 20px;
  border-bottom: 1px solid var(--el-border-color-light);
}

:deep(.el-card__body) {
  padding: 20px;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
}

.gallery-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  flex-shrink: 0;
  border: 1px solid var(--el-border-color-light);
  cursor: pointer;
  transition: all 0.3s ease;
}

.gallery-image:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
