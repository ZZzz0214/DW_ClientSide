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
      <el-form-item label="团购货盘表ID" prop="groupBuyingId">
      <el-input
        v-model="formData.groupBuyingId"
        placeholder="请输入团购货盘表ID"
        class="w-80"
        @click="openGroupBuyingSearch"
        readonly
      />
    </el-form-item>



    <!-- 品牌名称 -->
    <el-form-item label="品牌名称" prop="brandName">
      <el-input
        v-model="formData.brandName"
        placeholder="自动填充"
        readonly
        class="w-80"
      />
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
          placeholder="请输入客户名称"
          class="w-80"
          @click="openCustomerSearch"
          readonly
        />
      </el-form-item>

      <el-form-item label="供团价格" prop="supplyGroupPrice">
        <div style="display: flex; align-items: center;">
        <el-input-number
          v-model="formData.supplyGroupPrice"
          :min="0"
          :precision="2"
          placeholder="请输入供团价格"
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
  import type { GroupBuyingReviewVO } from '@/api/erp/groupbuyingreview'
  import CustomerSearchDialog from "@/views/erp/sale/saleprice/components/CustomerSearchDialog.vue";

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
    groupBuyingId: undefined as number | undefined,
  productName: '',
  brandName: '',
  productSpec: '',
  productSku: '',
  groupMechanism: ''
  })

  const rules = reactive({
    //no: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
    groupBuyingId: [{ required: true, message: '货盘表ID不能为空', trigger: 'blur' }],
    customerName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
    supplyGroupPrice: [{ required: true, message: '供团价格不能为空', trigger: 'blur' }],
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
  formData.groupBuyingId = groupBuying.no;
  formData.productName = groupBuying.productName;
  formData.brandName = groupBuying.brandName;
  formData.productSpec = groupBuying.productSpec;
  formData.productSku = groupBuying.productSku;
  formData.groupMechanism = groupBuying.groupMechanism;
};
  // 客户搜索弹窗相关
  const customerSearchDialogVisible = ref(false); // 客户搜索弹窗的显示状态

  const openCustomerSearch = () => {
    console.log("Opening customer search dialog");
    customerSearchDialogVisible.value = true;
  };

  const handleCustomerSelected = (customer: CustomerVO) => {
    formData.customerName = customer.name; // 填充客户名称
  };
  defineExpose({ validate })
  </script>
