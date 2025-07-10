<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row :gutter="20">
<!--        <el-col :span="12">-->
<!--          <el-form-item label="供应商编号" prop="no">-->
<!--            <el-input v-model="formData.no" placeholder="请输入供应商编号" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="12">
          <el-form-item label="供应商名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入供应商名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收件姓名" prop="receiverName">
            <el-input v-model="formData.receiverName" placeholder="请输入收件姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="telephone">
            <el-input v-model="formData.telephone" placeholder="请输入联系电话" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="formData.address" placeholder="请输入详细地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="微信账号" prop="wechatAccount">
            <el-input v-model="formData.wechatAccount" placeholder="请输入微信账号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="支付宝号" prop="alipayAccount">
            <el-input v-model="formData.alipayAccount" placeholder="请输入支付宝号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行账号" prop="bankAccount">
            <el-input v-model="formData.bankAccount" placeholder="请输入银行账号" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注信息" prop="remark">
            <el-input type="textarea" v-model="formData.remark" placeholder="请输入备注信息" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { SupplierApi, SupplierVO } from '@/api/erp/purchase/supplier'

/** ERP  表单 */
defineOptions({ name: 'SupplierForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  no: undefined,
  name: undefined,
  receiverName: undefined,
  telephone: undefined,
  address: undefined,
  wechatAccount: undefined,
  alipayAccount: undefined,
  bankAccount: undefined,
  remark: undefined
})
const formRules = reactive({
  name: [{ required: true, message: '供应商名称不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

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
      formData.value = await SupplierApi.getSupplier(id)
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
    const data = formData.value as unknown as SupplierVO
    if (formType.value === 'create') {
      await SupplierApi.createSupplier(data)
      message.success(t('common.createSuccess'))
    } else {
      await SupplierApi.updateSupplier(data)
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
    name: undefined,
    receiverName: undefined,
    telephone: undefined,
    address: undefined,
    wechatAccount: undefined,
    alipayAccount: undefined,
    bankAccount: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
}
</script>
