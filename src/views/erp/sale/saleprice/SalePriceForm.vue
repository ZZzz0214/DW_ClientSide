<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1080">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row :gutter="20">
        <!-- 组品编号 -->
        <el-col :span="12">
          <el-form-item label="组品编号" prop="groupProductId">
            <el-input disabled v-model="formData.groupProductId" placeholder="自动获取" />
          </el-form-item>
        </el-col>

        <!-- 客户名称 -->
        <el-col :span="12">
          <el-form-item label="客户名称" prop="customerName">
            <el-input v-model="formData.customerName" placeholder="请输入客户名称" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 子表的表单 -->
      <ContentWrap>
        <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px">
          <el-tab-pane label="销售价格清单" name="item">
            <SalePriceItemForm
              ref="itemFormRef"
              :items="formData.items"
              :disabled="disabled"
              @items-updated="handleItemsUpdated"
            />
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>

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
import { ref, watch } from 'vue';
import { SalePriceApi, SalePriceVO, SalePriceFormData } from '@/api/erp/sale/saleprice';
import SalePriceItemForm from './components/SalePriceItemForm.vue';
import { erpPriceInputFormatter, erpPriceMultiply } from '@/utils';
import { ElMessage } from 'element-plus';

/** ERP 销售价格表单 */
defineOptions({ name: 'SalePriceForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改；detail - 详情


const formData = ref<SalePriceFormData>({
  id: undefined,
  groupProductId: undefined, // 组品编号
  customerName: undefined, // 客户名称
  distributionPrice: 0, // 代发单价，初始化为 0
  wholesalePrice: 0, // 批发单价，初始化为 0
  items: [] // 子表项
});

const formRules = reactive({
  groupProductId: [{ required: true, message: '组品编号不能为空', trigger: 'blur' }],
  customerName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
  distributionPrice: [{ required: true, message: '代发单价不能为空', trigger: 'blur' }],
  wholesalePrice: [{ required: true, message: '批发单价不能为空', trigger: 'blur' }]
})
const disabled = computed(() => formType.value === 'detail')
const formRef = ref() // 表单 Ref

/** 子表的表单 */
const subTabsName = ref('item')
const itemFormRef = ref()

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
      const data = await SalePriceApi.getSalePrice(id);
      formData.value = data;
      // 确保 items 是一个数组
      if (!Array.isArray(formData.value.items)) {
        formData.value.items = [];
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 处理子组件传回的 items 数据 */


/** 处理子组件传回的 items 数据 */
const handleItemsUpdated = (items: any[]) => {
  formData.value.items = items; // 更新 items 数据

  if (items.length > 0) {
    formData.value.groupProductId = items[0].groupProductId; // 更新组品编号
    // 赋值
    formData.value.distributionPrice = items[0].distributionPrice;
    formData.value.wholesalePrice = items[0].wholesalePrice;


  }
};
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  await itemFormRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as SalePriceVO
    if (formType.value === 'create') {
      await SalePriceApi.createSalePrice(data)
      message.success(t('common.createSuccess'))
    } else {
      await SalePriceApi.updateSalePrice(data)
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
    groupProductId: undefined, // 组品编号
    customerName: undefined, // 客户名称
    distributionPrice: 0, // 代发单价，初始化为 0
    wholesalePrice: 0, // 批发单价，初始化为 0
    items: [] // 子表项
  }
  formRef.value?.resetFields()
}
</script>