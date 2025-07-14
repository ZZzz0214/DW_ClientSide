<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="800px">
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
          <el-form-item label="账单名称" prop="billName">
            <el-input v-model="formData.billName" placeholder="请输入账单名称"  type="textarea" :autosize="{ minRows: 1, maxRows: 6}"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="收支金额" prop="amount">
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
        <el-col :span="12">
          <el-form-item label="收入支出" prop="incomeExpense">
            <el-radio-group v-model="formData.incomeExpense">
              <el-radio
                v-for="dict in getIntDictOptions(DICT_TYPE.ERP_FINANCE_INCOME_EXPENSE)"
                :key="dict.value"
                :label="dict.value"
                border
                :class="dict.value === 1 ? 'income-radio' : 'expense-radio'"
              >
                <div class="flex items-center">
                  <Icon
                    :icon="dict.value === 1 ? 'ep:top' : 'ep:bottom'"
                    :class="dict.value === 1 ? 'mr-2 text-green-600' : 'mr-2 text-red-600'"
                  />
                  <span :class="dict.value === 1 ? 'text-green-700 font-medium' : 'text-red-700 font-medium'">
                    {{ dict.label }}
                  </span>
                </div>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="收付类目" prop="category">
            <el-select
              v-model="formData.category"
              placeholder="请选择收付类目"
              class="!w-100%"
              filterable
              allow-create
              clearable
            >
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.ERP_FINANCE_CATEGORY)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收付账号" prop="account">
            <el-select v-model="formData.account" placeholder="请选择收付账号" class="!w-100%">
              <el-option label="微信" value="微信">
                <Icon icon="ep:chat-dot-round" class="mr-2 text-green-600" />
                微信
              </el-option>
              <el-option label="支付宝" value="支付宝">
                <Icon icon="ep:money" class="mr-2 text-blue-600" />
                支付宝
              </el-option>
              <el-option label="银行卡" value="银行卡">
                <Icon icon="ep:credit-card" class="mr-2 text-orange-600" />
                银行卡
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="账单状态" prop="status">
            <el-select v-model="formData.status" placeholder="请选择账单状态" class="!w-100%">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.ERP_FINANCE_BILL_STATUS)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下单日期" prop="orderDate">
            <el-date-picker
              v-if="!disabled"
              v-model="formData.orderDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择下单日期"
              class="!w-100%"
            />
            <el-input
              v-else
              :value="formatDate(formData.orderDate)"
              placeholder="下单日期"
              readonly
              class="!w-100%"
            >
              <template #prefix>
                <Icon icon="ep:calendar" class="text-gray-400" />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="凭证图片" prop="carouselImages" v-if="disabled">
        <div v-if="formData.carouselImages && getImageList(formData.carouselImages).length > 0" class="image-gallery">
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
          暂无图片
        </div>
      </el-form-item>

      <el-form-item label="凭证图片" prop="carouselImages" v-else>
        <UploadImgs
          v-model="formData.carouselImages"
          :limit="5"
          :is-show-tip="true"
        />
        <div class="text-gray-400 text-xs mt-1">
          支持上传多张图片，建议尺寸：750*750像素，支持jpg、png格式，单张不超过2M，支持拖拽调整顺序
        </div>
      </el-form-item>

      <el-form-item label="备注信息" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入备注信息"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <!-- 功能说明 -->
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
import { DICT_TYPE, getStrDictOptions, getIntDictOptions } from '@/utils/dict'

/** ERP 财务记录表单 */
defineOptions({ name: 'FinanceForm' })

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
  billName: undefined,
  amount: undefined,
  incomeExpense: 1, // 默认收入
  category: undefined,
  account: undefined,
  status: 1, // 默认待处理
  remark: undefined,
  orderDate: undefined
})
const formRules = reactive({
  billName: [{ required: true, message: '账单名称不能为空', trigger: 'blur' }],
  amount: [
    { required: true, message: '收支金额不能为空', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '金额必须大于0', trigger: 'blur' }
  ],
  incomeExpense: [{ required: true, message: '收支类型不能为空', trigger: 'change' }],
  category: [{ required: true, message: '收付类目不能为空', trigger: 'blur' }],
  account: [{ required: true, message: '收付账号不能为空', trigger: 'change' }],
  status: [{ required: true, message: '账单状态不能为空', trigger: 'change' }],
  orderDate: [{ required: true, message: '下单日期不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref
const disabled = computed(() => formType.value === 'detail')

// 处理图片列表
const getImageList = (carouselImages: string | string[]) => {
  if (!carouselImages) return []
  if (Array.isArray(carouselImages)) return carouselImages
  return carouselImages.split(',').filter(img => img.trim())
}

// 格式化日期显示
const formatDate = (date: any): string => {
  if (!date) return '暂无日期'

  // 如果是字符串格式的日期（YYYY-MM-DD）
  if (typeof date === 'string' && date.includes('-')) {
    return date
  }

  // 如果是数组格式 [year, month, day]
  if (Array.isArray(date) && date.length === 3) {
    const [year, month, day] = date
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  // 如果是Date对象
  if (date instanceof Date) {
    return date.toISOString().split('T')[0]
  }

  // 其他情况，尝试转换为Date对象
  try {
    const dateObj = new Date(date)
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toISOString().split('T')[0]
    }
  } catch (e) {
    console.warn('无法格式化日期:', date)
  }

  return '暂无日期'
}

/** 打开弹窗 */
const open = async (type: string, id?: number, copyData?: any) => {
  dialogVisible.value = true
  formType.value = type === 'copy' ? 'create' : type // 复制模式实际上是创建模式

  // 设置弹窗标题
  if (type === 'copy') {
    dialogTitle.value = '复制新增'
  } else {
    dialogTitle.value = t('action.' + type)
  }

  // 新增模式直接重置表单并设置默认值
  if (type === 'create') {
    resetForm()
  } else if (type === 'copy' && copyData) {
    // 复制模式，使用传入的数据填充表单
    resetForm()

    // 获取当前日期作为默认下单日期
    const today = new Date().toISOString().split('T')[0]

    // 处理复制数据的日期字段
    let orderDate = copyData.orderDate
    if (orderDate) {
      // 如果是数组格式，转换为字符串格式
      if (Array.isArray(orderDate) && orderDate.length === 3) {
        const [year, month, day] = orderDate
        orderDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      }
      // 如果是其他格式，尝试转换
      else if (typeof orderDate !== 'string' || !orderDate.includes('-')) {
        try {
          const dateObj = new Date(orderDate)
          if (!isNaN(dateObj.getTime())) {
            orderDate = dateObj.toISOString().split('T')[0]
          }
        } catch (e) {
          orderDate = today // 转换失败则使用当前日期
        }
      }
    } else {
      orderDate = today // 没有日期则使用当前日期
    }

    // 填充复制的数据，但排除一些不需要复制的字段
    formData.value = {
      id: undefined, // 不复制ID
      no: undefined, // 不复制编号，系统自动生成
      carouselImages: copyData.carouselImages ? (Array.isArray(copyData.carouselImages) ? copyData.carouselImages : copyData.carouselImages.split(',').filter(img => img.trim())) : [],
      billName: copyData.billName ? `${copyData.billName} - 复制` : undefined, // 账单名称加上复制标识
      amount: copyData.amount,
      incomeExpense: copyData.incomeExpense,
      category: copyData.category,
      account: copyData.account,
      status: 1, // 状态重置为待处理
      remark: copyData.remark,
      orderDate: today // 使用当前日期作为下单日期
    }
  } else if (id) {
    // 编辑或详情模式，先重置表单再加载数据
    resetForm()
    formLoading.value = true
    try {
      const data = await ErpFinanceApi.getFinance(id)

      // 处理日期字段，确保格式正确
      let orderDate = data.orderDate
      if (orderDate) {
        console.log('原始日期数据:', orderDate, '类型:', typeof orderDate)

        // 如果是数组格式，转换为字符串格式
        if (Array.isArray(orderDate) && orderDate.length === 3) {
          const [year, month, day] = orderDate
          orderDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          console.log('数组格式转换后:', orderDate)
        }
        // 如果是其他格式，尝试转换
        else if (typeof orderDate !== 'string' || !orderDate.includes('-')) {
          try {
            const dateObj = new Date(orderDate)
            if (!isNaN(dateObj.getTime())) {
              orderDate = dateObj.toISOString().split('T')[0]
              console.log('其他格式转换后:', orderDate)
            }
          } catch (e) {
            console.warn('日期转换失败:', orderDate, e)
            orderDate = undefined
          }
        }

        console.log('最终日期:', orderDate)
      }

      formData.value = {
        ...data,
        orderDate: orderDate,
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
    } as unknown as ErpFinanceApi.ErpFinanceVO
    if (formType.value === 'create') {
      await ErpFinanceApi.createFinance(data)
      message.success(t('common.createSuccess'))
    } else {
      await ErpFinanceApi.updateFinance(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')

    // 通知财务金额表刷新余额
    window.dispatchEvent(new CustomEvent('finance-balance-refresh'))
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  // 获取当前日期，格式为 YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0]

  formData.value = {
    id: undefined,
    no: undefined,
    carouselImages: [],
    billName: undefined,
    amount: undefined,
    incomeExpense: 1, // 默认收入
    category: undefined,
    account: undefined,
    status: 1, // 默认待处理
    remark: undefined,
    orderDate: formType.value === 'create' ? today : undefined // 新增时默认当前日期
  }
  formRef.value?.resetFields()
}
</script>

<style scoped>
:deep(.el-radio) {
  margin-right: 15px;
}

/* 收入类型样式 */
:deep(.income-radio.is-bordered) {
  border: 2px solid #d9ecff !important;
  background-color: #fafbfc !important;
  transition: all 0.3s ease !important;
}

:deep(.income-radio.is-bordered:hover) {
  border-color: #a3d977 !important;
  background-color: #f0f9f0 !important;
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.15) !important;
}

:deep(.income-radio.is-bordered.is-checked) {
  border-color: #67C23A !important;
  background-color: #f0f9f0 !important;
  box-shadow: 0 2px 12px rgba(103, 194, 58, 0.25) !important;
}

:deep(.income-radio .el-radio__inner) {
  border-color: #67C23A !important;
  border-width: 2px !important;
}

:deep(.income-radio.is-checked .el-radio__inner) {
  background-color: #67C23A !important;
  border-color: #67C23A !important;
}

:deep(.income-radio.is-checked .el-radio__inner::after) {
  background-color: #fff !important;
}

/* 支出类型样式 */
:deep(.expense-radio.is-bordered) {
  border: 2px solid #d9ecff !important;
  background-color: #fafbfc !important;
  transition: all 0.3s ease !important;
}

:deep(.expense-radio.is-bordered:hover) {
  border-color: #f5a9a9 !important;
  background-color: #fef5f5 !important;
  box-shadow: 0 2px 8px rgba(245, 108, 108, 0.15) !important;
}

:deep(.expense-radio.is-bordered.is-checked) {
  border-color: #F56C6C !important;
  background-color: #fef5f5 !important;
  box-shadow: 0 2px 12px rgba(245, 108, 108, 0.25) !important;
}

:deep(.expense-radio .el-radio__inner) {
  border-color: #F56C6C !important;
  border-width: 2px !important;
}

:deep(.expense-radio.is-checked .el-radio__inner) {
  background-color: #F56C6C !important;
  border-color: #F56C6C !important;
}

:deep(.expense-radio.is-checked .el-radio__inner::after) {
  background-color: #fff !important;
}

/* 通用单选按钮样式增强 */
:deep(.el-radio.is-bordered) {
  padding: 14px 20px !important;
  border-radius: 12px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  min-width: 130px !important;
  text-align: center !important;
  margin-right: 16px !important;
  position: relative !important;
  overflow: hidden !important;
}

:deep(.el-radio.is-bordered:hover) {
  transform: translateY(-2px) !important;
}

:deep(.el-radio.is-bordered:active) {
  transform: translateY(0) !important;
}

/* 单选按钮内容区域 */
:deep(.el-radio__label) {
  padding-left: 8px !important;
  font-weight: 500 !important;
  font-size: 14px !important;
}

/* 移除默认的蓝色主题和边框重叠 */
:deep(.el-radio.is-checked .el-radio__inner) {
  background-color: inherit !important;
  border-color: inherit !important;
}

:deep(.el-radio.is-bordered.is-checked) {
  position: relative !important;
  z-index: 1 !important;
}

/* 确保焦点状态不显示蓝色 */
:deep(.el-radio__input:focus .el-radio__inner) {
  border-color: inherit !important;
  box-shadow: none !important;
}

:deep(.el-radio:focus .el-radio__inner) {
  border-color: inherit !important;
  box-shadow: none !important;
}

/* 修复边框层级问题 */
:deep(.el-radio-group) {
  display: flex !important;
  gap: 8px !important;
}

/* 确保图标和文字对齐 */
:deep(.el-radio__label .flex) {
  align-items: center !important;
  justify-content: center !important;
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
