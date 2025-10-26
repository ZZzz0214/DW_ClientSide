<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
<!--      <el-form-item label="编号" prop="no">-->
<!--        <el-input-->
<!--          v-model="formData.no"-->
<!--          placeholder="请输入编号"-->
<!--          class="w-80"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="品牌名称" prop="brandName">-->
<!--        <el-input-->
<!--          v-model="formData.brandName"-->
<!--          placeholder="请输入品牌名称"-->
<!--          class="w-80"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="产品名称" prop="productName">-->
<!--        <el-input-->
<!--          v-model="formData.productName"-->
<!--          placeholder="请输入产品名称"-->
<!--          class="w-80"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="产品规格" prop="productSpec">-->
<!--        <el-input-->
<!--          v-model="formData.productSpec"-->
<!--          placeholder="请输入产品规格"-->
<!--          class="w-80"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="产品SKU" prop="productSku">-->
<!--        <el-input-->
<!--          v-model="formData.productSku"-->
<!--          placeholder="请输入产品SKU"-->
<!--          class="w-80"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="货盘编号" prop="groupBuyingNo">
      <el-input
        v-model="formData.groupBuyingNo"
        placeholder="请选择团购货盘"
        class="w-80"
        @click="openGroupBuyingSearch"
        readonly
      />
    </el-form-item>



    <!-- 品牌名称 -->
    <el-form-item label="品牌名称" prop="brandName">
      <div class="w-80" style="padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #f5f7fa;">
        <dict-tag v-if="formData.brandName" :type="DICT_TYPE.ERP_PRODUCT_BRAND" :value="formData.brandName" />
        <span v-else style="color: #c0c4cc;">自动填充</span>
      </div>
    </el-form-item>
        <!-- 产品名称 -->
    <el-form-item label="产品名称" prop="productName">
      <el-input
        v-model="formData.productName"
        placeholder="自动填充"
        readonly
        class="w-80"
      />
    </el-form-item>
        <!-- 产品规格 -->
        <el-form-item label="产品规格" prop="productSpec">
      <el-input
        v-model="formData.productSpec"
        placeholder="自动填充"
        readonly
        class="w-80"
      />
    </el-form-item>

    <!-- 产品SKU -->
    <el-form-item label="产品SKU" prop="productSku">
      <el-input
        v-model="formData.productSku"
        placeholder="自动填充"
        readonly
        class="w-80"
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 6}"
      />
    </el-form-item>

      <el-form-item label="备注信息" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          placeholder="请输入备注信息"
          class="w-80"
          :autosize="{ minRows: 2, maxRows: 4 }"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="formData.customerName"
          placeholder="请选择客户"
          class="w-80"
          @click="openCustomerSearch"
          readonly
        />
      </el-form-item>

      <el-form-item label="开团价格" prop="groupPrice">
        <div style="display: flex; align-items: center;">
        <el-input-number
          v-model="formData.groupPrice"
          :min="0"
          :precision="2"
          placeholder="请输入开团价格"
          class="w-80!"
        />
        <span style="margin-left: 25px;">元</span>
        </div>
      </el-form-item>

      <el-form-item label="供货价格" prop="supplyGroupPrice">
        <div style="display: flex; align-items: center;">
        <el-input-number
          v-model="formData.supplyGroupPrice"
          :min="0"
          :precision="2"
          placeholder="请输入供货价格"
          class="w-80!"
        />
        <span style="margin-left: 25px;">元</span>
        </div>
      </el-form-item>

      <el-form-item label="快递费用" prop="expressFee">
        <div style="display: flex; align-items: center;">
          <el-input-number
            v-model="formData.expressFee"
            :min="0"
            :precision="2"
            placeholder="请输入快递费用"
            class="w-80!"
          />
          <span style="margin-left: 25px;">元</span>
        </div>
      </el-form-item>

    <!-- 开团机制 -->
    <el-form-item label="开团机制" prop="groupMechanism">
      <el-input
        v-model="formData.groupMechanism"
        placeholder="自动填充"
        readonly
        class="w-80"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
      />
    </el-form-item>

    <!-- 货盘状态 -->
    <el-form-item label="货盘状态" prop="status">
      <div class="w-80" style="padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #f5f7fa;">
        <dict-tag v-if="formData.status" :type="DICT_TYPE.ERP_STATUS" :value="formData.status" />
        <span v-else style="color: #c0c4cc;">自动填充</span>
      </div>
    </el-form-item>

    <!-- 复盘状态 -->
    <el-form-item label="复盘状态" prop="reviewStatus">
      <el-select
        v-model="formData.reviewStatus"
        placeholder="请选择复盘状态"
        clearable
        class="w-80"
        :disabled="isDetail"
      >
        <el-option
          v-for="dict in getStrDictOptions(DICT_TYPE.ERP_GROUP_BUYING_REVIEW_STATUS)"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>




    </el-form>

    <GroupBuyingSearchDialog
    v-model:visible="groupBuyingSearchDialogVisible"
    @groupbuying-selected="handleGroupBuyingSelected"
    ref="groupBuyingSearchDialog"
  />

  <!-- 客户搜索弹窗 -->
  <CustomerSearchDialog
    v-model:visible="customerSearchDialogVisible"
    @customer-selected="handleCustomerSelected"
    ref="customerSearchDialog"
  />
  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
  import type { GroupBuyingReviewVO } from '@/api/erp/groupbuyingreview'
  import type { CustomerVO } from '@/api/erp/sale/customer'
  import CustomerSearchDialog from "@/views/erp/sale/saleprice/components/CustomerSearchDialog.vue";
  import GroupBuyingSearchDialog from "./GroupBuyingSearchDialog.vue"

  defineOptions({ name: 'ErpGroupBuyingReviewInfoForm' })
  const message = useMessage()
  const props = defineProps({
    propFormData: {
      type: Object as PropType<GroupBuyingReviewVO>,
      default: () => {}
    },
    isDetail: propTypes.bool.def(false)
  })

  const emit = defineEmits(['update:activeName'])
  const formRef = ref()
  const formData = reactive({
    groupBuyingId: '' as string, // 团购货盘编号（传递给后端）
    groupBuyingNo: '', // 货盘编号（用于显示）
    customerId: '' as string, // 客户名称（传递给后端）
    productName: '',
    brandName: '',
    productSpec: '',
    productSku: '',
    groupMechanism: '',
    status: undefined, // 货盘状态
    reviewStatus: undefined, // 复盘状态
    remark: '',
    customerName: '', // 客户名称（用于显示）
    supplyGroupPrice: 0,
    expressFee: 0,
    groupPrice: 0 // 开团价格
  })

  const rules = reactive({
    //no: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
    groupBuyingNo: [{ required: true, message: '请选择团购货盘', trigger: 'blur' }],
    customerName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
    supplyGroupPrice: [{ required: true, message: '供货价格不能为空', trigger: 'blur' }],
    groupMechanism: [{ required: true, message: '开团机制不能为空', trigger: 'blur' }]
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
  const validate = async () => {
    if (!formRef) return
    try {
      await unref(formRef)?.validate()
      Object.assign(props.propFormData, formData)
    } catch (e) {
      message.error('【基础信息】不完善，请填写相关信息')
      emit('update:activeName', 'info')
      throw e
    }
  }


const groupBuyingSearchDialogVisible = ref(false);
const groupBuyingSearchDialog = ref();

const openGroupBuyingSearch = () => {
  groupBuyingSearchDialog.value?.open();
};

const handleGroupBuyingSelected = (groupBuying: any) => {
  // 填充货盘编号（传递给后端）
  formData.groupBuyingId = groupBuying.no || '';
  // 填充货盘编号（用于显示）
  formData.groupBuyingNo = groupBuying.no || '';
  // 自动填充货盘相关信息
  formData.productName = groupBuying.productName || '';
  formData.brandName = groupBuying.brandName || '';
  formData.productSpec = groupBuying.productSpec || '';
  formData.productSku = groupBuying.productSku || '';
  formData.groupMechanism = groupBuying.groupMechanism || '';
  formData.status = groupBuying.status; // 填充货盘状态
          // 如果货盘有供货价格，也可以自动填充
  if (groupBuying.supplyGroupPrice) {
    formData.supplyGroupPrice = groupBuying.supplyGroupPrice;
  }
  // 如果货盘有快递费用，也可以自动填充
  if (groupBuying.expressFee) {
    formData.expressFee = groupBuying.expressFee;
  }
  // 如果货盘有开团价格，也自动填充（可修改）
  if (groupBuying.groupPrice) {
    formData.groupPrice = groupBuying.groupPrice;
  }
};
  // 客户搜索弹窗相关
  const customerSearchDialogVisible = ref(false); // 客户搜索弹窗的显示状态

  const openCustomerSearch = () => {
    console.log("Opening customer search dialog");
    customerSearchDialogVisible.value = true;
  };

  const handleCustomerSelected = (customer: CustomerVO) => {
    formData.customerId = customer.name; // 填充客户名称（传递给后端）
    formData.customerName = customer.name; // 填充客户名称（用于显示）
  };
  defineExpose({ validate })
  </script>
