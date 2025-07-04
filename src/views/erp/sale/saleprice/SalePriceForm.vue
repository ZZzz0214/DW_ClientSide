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
          <el-form-item label="组品编号" prop="no">
            <el-input disabled v-model="formData.no" placeholder="自动获取" />
          </el-form-item>
        </el-col>

        <!-- 客户名称 -->
        <el-col :span="12">
          <el-form-item label="客户名称" prop="customerName">
            <el-input
              :disabled="formType === 'detail'"
              v-model="formData.customerName"
              placeholder="请选择客户"
              @click="openCustomerSearch"
              readonly
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 子表的表单 -->
      <ContentWrap>
        <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px">
          <el-tab-pane label="基础信息" name="item">
            <SalePriceItemForm
              ref="itemFormRef"
              :item="formData.comboList"
              :disabled="disabled"
              @items-updated="handleItemUpdated"
            />
          </el-tab-pane>
          <el-tab-pane label="运费信息" name="items">
            <ShippingCostForm
              ref="itemFormRef"
              v-model:activeName="activeName"
              :items="formData.cost"
              :disabled="disabled"
              @items-updated="handleItemsUpdated"
            />
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>

      <!-- 代发单价 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="代发单价" prop="distributionPrice">
            <div style="display: flex; align-items: center;">
            <el-input-number
              v-model="formData.distributionPrice"
              controls-position="right"
              :min="0"
              :precision="2"
              placeholder="请输入代发单价"
              :disabled="formType === 'detail'"
            />
            <span style="margin-left: 25px;">元</span>
            </div>
          </el-form-item>
        </el-col>

        <!-- 批发单价 -->
        <el-col :span="16">
          <el-form-item label="批发单价" prop="wholesalePrice">
            <div style="display: flex; align-items: center;">
            <el-input-number
              v-model="formData.wholesalePrice"
              controls-position="right"
              :min="0"
              :precision="2"
              placeholder="请输入批发单价"
              :disabled="formType === 'detail'"
            />
              <span style="margin-left: 25px;">元</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
            <!-- 备注信息 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注信息" prop="remark">
            <el-input
              v-model="formData.remark"
              type="textarea"
              :rows="2"
              placeholder="请输入备注信息"
              :disabled="formType === 'detail'"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading" v-if="!disabled">
        确 定
      </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <!-- 客户搜索弹窗 -->
  <CustomerSearchDialog
    v-model:visible="customerSearchDialogVisible"
    @customer-selected="handleCustomerSelected"
    ref="customerSearchDialog"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { SalePriceApi, SalePriceVO, SalePriceFormData } from '@/api/erp/sale/saleprice';
import SalePriceItemForm from './components/SalePriceItemForm.vue';
import ShippingCostForm from './components/ShippingCostForm.vue';
import { erpPriceInputFormatter, erpPriceMultiply } from '@/utils';
import { ElMessage } from 'element-plus';
import CustomerSearchDialog from './components/CustomerSearchDialog.vue'; // 引入客户搜索弹窗组件

/** ERP 销售价格表单 */
defineOptions({ name: 'SalePriceForm' })

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗
const customerSearchDialog = ref(null); // 用于引用 CustomerSearchDialog 组件
const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改；detail - 详情

const formData = ref({
  id: undefined,
  groupProductId: undefined, // 组品编号
  no:undefined,
  customerName: undefined, // 客户名称
  distributionPrice: undefined, // 代发单价，不初始化为0
  wholesalePrice: undefined, // 批发单价，不初始化为0
  comboList: [], // 子表项
  cost: [], // 子表项
  shippingFeeType: undefined, // 运费类型（0：固定运费，1：按件计费，2：按重计费）
  fixedShippingFee: undefined, // 固定运费，单位：元
  additionalItemQuantity: undefined, // 续件数量
  additionalItemPrice: undefined, // 续件价格，单位：元
  firstWeight: undefined, // 首重重量，单位：kg
  firstWeightPrice: undefined, // 首重价格，单位：元
  additionalWeight: undefined, // 续重重量，单位：kg
  remark: undefined, // 新增备注字段
});

const formRules = reactive({
  groupProductId: [{ required: true, message: '组品编号不能为空', trigger: 'blur' }],
  customerName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
  //distributionPrice: [{ required: true, message: '代发单价不能为空', trigger: 'blur' }],
  //wholesalePrice: [{ required: true, message: '批发单价不能为空', trigger: 'blur' }],
  distributionPrice: [
    {
      required: true,
      message: '代发单价不能为空',
      trigger: 'blur',
      validator: (rule: any, value: any, callback: any) => {
        if (value === undefined || value === null || value === '') {
          callback(new Error('代发单价不能为空'));
        } else if (value === 0) {
          callback(new Error('代发单价不能为0'));
        } else {
          callback();
        }
      }
    }
  ],
  wholesalePrice: [
    {
      required: true,
      message: '批发单价不能为空',
      trigger: 'blur',
      validator: (rule: any, value: any, callback: any) => {
        if (value === undefined || value === null || value === '') {
          callback(new Error('批发单价不能为空'));
        } else if (value === 0) {
          callback(new Error('批发单价不能为0'));
        } else {
          callback();
        }
      }
    }
  ],
});

const disabled = computed(() => formType.value === 'detail');
const formRef = ref(); // 表单 Ref

/** 子表的表单 */
const subTabsName = ref('item');
const itemFormRef = ref();

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = t('action.' + type);
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      const data = await SalePriceApi.getSalePrice(id);
      
      // 如果是复制模式，清除id并设置为新增模式
      if (type === 'copy') {
        formData.value = { ...data, id: undefined };
        formType.value = 'create';
        dialogTitle.value = t('action.create');
        // 确保子表数据也被复制
        if (data.comboList && data.comboList.length > 0) {
          formData.value.comboList = [...data.comboList];
        }
      } else {
        formData.value = data;
      }
      
      formData.value.groupProductId = data.groupProductId;
      console.log("888888888888888888888888");
      console.log(data);

      // 如果是详情模式，将数据重新组装到 items 和 saleItems
      if (type === 'detail') {
        formData.value.cost = [
          {
            shippingFeeType: data.shippingFeeType, // 运费类型
            fixedShippingFee: data.fixedShippingFee, // 固定运费（单位：元）
            additionalItemQuantity: data.additionalItemQuantity, // 按件数量
            additionalItemPrice: data.additionalItemPrice, // 按件价格（单位：元）
            firstWeight: data.firstWeight, // 首重重量（单位：kg）
            firstWeightPrice: data.firstWeightPrice, // 首重价格（单位：元）
            additionalWeight: data.additionalWeight, // 续重重量（单位：kg）
            additionalWeightPrice: data.additionalWeightPrice, // 续重价格（单位：元）
          },
        ];
      }
      if (type === 'update' || type === 'copy') {
        formData.value.cost = [
          {
            shippingFeeType: data.shippingFeeType, // 运费类型
            fixedShippingFee: data.fixedShippingFee, // 固定运费（单位：元）
            additionalItemQuantity: data.additionalItemQuantity, // 按件数量
            additionalItemPrice: data.additionalItemPrice, // 按件价格（单位：元）
            firstWeight: data.firstWeight, // 首重重量（单位：kg）
            firstWeightPrice: data.firstWeightPrice, // 首重价格（单位：元）
            additionalWeight: data.additionalWeight, // 续重重量（单位：kg）
            additionalWeightPrice: data.additionalWeightPrice, // 续重价格（单位：元）
          },
        ];
      }

    } finally {
      formLoading.value = false;
    }
  }
};
defineExpose({ open }); // 提供 open 方法，用于打开弹窗

/** 处理子组件传回的 items 数据 */
const handleItemUpdated = (comboList: any[]) => {
  formData.value.comboList = comboList; // 更新 items 数据
  if (comboList.length > 0) {
    formData.value.groupProductId = comboList[0].groupProductId; // 更新组品编号
    formData.value.no = comboList[0].no; // 更新组品编号
  }
};

const handleItemsUpdated = (cost: any[]) => {
  formData.value.cost = cost; // 更新 cost 数组
  // console.log("cost",cost)
  // 如果 cost 数组有数据，则自动绑定到对应字段
  if (cost.length > 0) {
    const costItem = cost[0];
    // console.log("costItem",cost[0])
    // console.log(costItem.shippingFeeType)
    formData.value.shippingFeeType = costItem.shippingFeeType;
    formData.value.fixedShippingFee = costItem.fixedShippingFee;
    formData.value.additionalItemQuantity = costItem.additionalItemQuantity;
    formData.value.additionalItemPrice = costItem.additionalItemPrice;
    formData.value.firstWeight = costItem.firstWeight;
    formData.value.firstWeightPrice = costItem.firstWeightPrice;
    formData.value.additionalWeight = costItem.additionalWeight;
    formData.value.additionalWeightPrice = costItem.additionalWeightPrice;
  }
};

/** 提交表单 */
const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate();
  await itemFormRef.value.validate();
  // 提交请求
  formLoading.value = true;
  try {
    const data = formData.value as unknown as SalePriceVO;
    if (formType.value === 'create') {
      // console.log("++++++++++++")
      // console.log(data)
      await SalePriceApi.createSalePrice(data);
      message.success(t('common.createSuccess'));
    } else {
      await SalePriceApi.updateSalePrice(data);
      message.success(t('common.updateSuccess'));
    }
    dialogVisible.value = false;
    // 发送操作成功的事件
    emit('success');
  } finally {
    formLoading.value = false;
  }
};

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    groupProductId: undefined, // 组品编号
    no: undefined,
    customerName: undefined, // 客户名称
    distributionPrice: undefined, // 代发单价，不初始化为0
    wholesalePrice: undefined, // 批发单价，不初始化为0
    comboList: [], // 子表项
    cost: [], // 运费子表项
    shippingFeeType: undefined, // 运费类型（0：固定运费，1：按件计费，2：按重计费）
    fixedShippingFee: undefined, // 固定运费，单位：元
    additionalItemQuantity: undefined, // 续件数量
    additionalItemPrice: undefined, // 续件价格，单位：元
    firstWeight: undefined, // 首重重量，单位：kg
    firstWeightPrice: undefined, // 首重价格，单位：元
    additionalWeight: undefined, // 续重重量，单位：kg
    remark: undefined, // 备注信息
  };
  formRef.value?.resetFields();
};

// 客户搜索弹窗相关
const customerSearchDialogVisible = ref(false); // 客户搜索弹窗的显示状态

const openCustomerSearch = () => {
  console.log("Opening customer search dialog");
  customerSearchDialogVisible.value = true;
};

const handleCustomerSelected = (customer: CustomerVO) => {
  formData.value.customerName = customer.name; // 填充客户名称
};
</script>
