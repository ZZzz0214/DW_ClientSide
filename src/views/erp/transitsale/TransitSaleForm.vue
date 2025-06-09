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

          <!-- 中转人员 -->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="中转人员" prop="transitPerson">-->
<!--              <el-input-->
<!--                :disabled="formType === 'detail'"-->
<!--                v-model="formData.transitPerson"-->
<!--                placeholder="请输入中转人员"-->
<!--              />-->
<!--            </el-form-item>-->
<!--          </el-col>-->

          <el-col :span="12">
          <el-form-item label="中转人员" prop="transitPerson">
            <el-select
              v-model="formData.transitPerson"
              placeholder="请选择中转人员"
              class="w-80"
              filterable
              :filter-method="(value) => filterDictOptions(value, DICT_TYPE.ERP_TRANSIT_PERSON)"
            >
              <el-option
                v-for="dict in filteredTransitPersonOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        </el-row>


        <!-- 子表的表单 -->
        <ContentWrap>
          <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px">
            <el-tab-pane label="基础信息" name="item">
              <TransitSaleItemForm
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
  </template>

  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import { TransitSaleApi, TransitSaleVO } from '@/api/erp/transitsale';
  import TransitSaleItemForm from './form/TransitSaleItemForm.vue'
  import ShippingCostForm from './form/ShippingCostForm.vue';
  import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'

  /** ERP 中转销售表单 */
  defineOptions({ name: 'TransitSaleForm' })

  const { t } = useI18n(); // 国际化
  const message = useMessage(); // 消息弹窗
  const dialogVisible = ref(false); // 弹窗的是否展示
  const dialogTitle = ref(''); // 弹窗的标题
  const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formType = ref(''); // 表单的类型：create - 新增；update - 修改；detail - 详情

  const formData = ref({
    id: undefined,
    groupProductId: undefined, // 组品编号
    no: undefined,
    transitPerson: undefined, // 中转人员
    distributionPrice: undefined, // 代发单价
    wholesalePrice: undefined, // 批发单价
    comboList: [], // 子表项
    cost: [], // 子表项
    shippingFeeType: undefined, // 运费类型（0：固定运费，1：按件计费，2：按重计费）
    fixedShippingFee: undefined, // 固定运费，单位：元
    additionalItemQuantity: undefined, // 续件数量
    additionalItemPrice: undefined, // 续件价格，单位：元
    firstWeight: undefined, // 首重重量，单位：kg
    firstWeightPrice: undefined, // 首重价格，单位：元
    additionalWeight: undefined, // 续重重量，单位：kg
    remark: undefined, // 备注信息
  });

  const formRules = reactive({
    groupProductId: [{ required: true, message: '组品编号不能为空', trigger: 'blur' }],
    transitPerson: [{ required: true, message: '中转人员不能为空', trigger: 'blur' }],
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
        const data = await TransitSaleApi.getTransitSale(id);
        formData.value = data;
        formData.value.groupProductId = data.groupProductId;
        console.log("888888888888888888888888");
        console.log(data);
        // 如果是详情模式，将数据重新组装到 items 和 saleItems
        if (type === 'detail' || type === 'update') {
          formData.value.cost = [
            {
              shippingFeeType: data.shippingFeeType,
              fixedShippingFee: data.fixedShippingFee,
              additionalItemQuantity: data.additionalItemQuantity,
              additionalItemPrice: data.additionalItemPrice,
              firstWeight: data.firstWeight,
              firstWeightPrice: data.firstWeightPrice,
              additionalWeight: data.additionalWeight,
              additionalWeightPrice: data.additionalWeightPrice,
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
    formData.value.comboList = comboList;
    if (comboList.length > 0) {
      formData.value.groupProductId = comboList[0].groupProductId;
      formData.value.no = comboList[0].no;
    }
  };

  const handleItemsUpdated = (cost: any[]) => {
    formData.value.cost = cost;
    if (cost.length > 0) {
      const costItem = cost[0];
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
  const emit = defineEmits(['success']);
  const submitForm = async () => {
    await formRef.value.validate();
    await itemFormRef.value.validate();
    formLoading.value = true;
    try {
      const data = formData.value as unknown as TransitSaleVO;
      if (formType.value === 'create') {
        await TransitSaleApi.createTransitSale(data);
        message.success(t('common.createSuccess'));
      } else {
        await TransitSaleApi.updateTransitSale(data);
        message.success(t('common.updateSuccess'));
      }
      dialogVisible.value = false;
      emit('success');
    } finally {
      formLoading.value = false;
    }
  };

  /** 重置表单 */
  const resetForm = () => {
    formData.value = {
      id: undefined,
      groupProductId: undefined,
      no: undefined,
      transitPerson: undefined,
      distributionPrice: 0,
      wholesalePrice: 0,
      comboList: [],
      cost: [],
      shippingFeeType: undefined,
      fixedShippingFee: undefined,
      additionalItemQuantity: undefined,
      additionalItemPrice: undefined,
      firstWeight: undefined,
      firstWeightPrice: undefined,
      additionalWeight: undefined,
      additionalWeightPrice: undefined,
      remark: undefined,
    };
    formRef.value?.resetFields();
  };

//中转人员的操作
const filteredTransitPersonOptions = ref(getStrDictOptions(DICT_TYPE.ERP_TRANSIT_PERSON))

const filterDictOptions = (value, dictType) => {
  const allOptions = getStrDictOptions(dictType)
  if (!value) {
    if (dictType === DICT_TYPE.ERP_TRANSIT_PERSON) {
      filteredTransitPersonOptions.value = allOptions
    }
    return
  }
  const filtered = allOptions.filter(item =>
    item.label.toLowerCase().includes(value.toLowerCase())
  )
  if (dictType === DICT_TYPE.ERP_TRANSIT_PERSON) {
    filteredTransitPersonOptions.value = filtered
  }
}
  </script>
