<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" :disabled="isDetail">
    <!-- 现货数量 -->
    <el-form-item label="现货数量" prop="totalQuantity">
      <el-input-number
        v-model="formData.totalQuantity"
        :min="0"
        placeholder="请输入现货数量"
        class="w-80!"
      />
    </el-form-item>

    <!-- 包材数量 -->
    <el-form-item label="包材数量" prop="packagingMaterialQuantity">
      <el-input-number
        v-model="formData.packagingMaterialQuantity"
        :min="0"
        placeholder="请输入包材数量"
        class="w-80!"
      />
    </el-form-item>

    <!-- 返单时效 -->
    <el-form-item label="返单时效" prop="orderReplenishmentLeadTime">
        <div style="display: flex; align-items: center;">
        <el-input
          v-model="formData.orderReplenishmentLeadTime"
          placeholder="请输入返单时效数值"
          class="w-80!"
        />
        <span style="margin-left: 25px;">天</span>
        </div>
<!--      <el-col :span="2">-->
<!--        <el-select-->
<!--          v-model="formData.orderReplenishmentLeadTimeUnit"-->
<!--          placeholder="请选择单位"-->
<!--          class="w-80"-->
<!--        >-->
<!--          <el-option label="天" value="天" />-->
<!--        </el-select>-->
<!--      </el-col>-->
    </el-form-item>

    <!-- 品长宽高 -->
    <el-form-item label="品长宽高" prop="productDimensions">
      <div style="display: flex; align-items: center;">
        <el-input
          v-model="formData.productDimensions"
          placeholder="品长宽高"
          class="w-80!"
        />
        <span style="margin-left: 25px;">cm</span>
      </div>
<!--      <el-col :span="3">-->
<!--        <el-input-->
<!--          v-model="formData.productWidth"-->
<!--          placeholder="宽"-->
<!--          class="w-80"-->
<!--        />-->
<!--      </el-col>-->
<!--      <el-col :span="3">-->
<!--        <el-input-->
<!--          v-model="formData.productHeight"-->
<!--          placeholder="高"-->
<!--          class="w-80"-->
<!--        />-->
<!--      </el-col>-->
<!--      <el-col :span="2">-->
<!--        <el-select-->
<!--          v-model="formData.productDimensionsUnit"-->
<!--          placeholder="请选择单位"-->
<!--          class="w-80"-->
<!--        >-->
<!--          <el-option label="mm" value="mm" />-->
<!--          <el-option label="cm" value="cm" />-->
<!--          <el-option label="m" value="m" />-->
<!--        </el-select>-->
<!--      </el-col>-->
    </el-form-item>
    <el-form-item label="产品重量" prop="weight">
        <div style="display: flex; align-items: center;">
          <el-input-number
            v-model="formData.weight"
            placeholder="请输入产品重量数值"
            :min="0"
            class="w-80!"
          />
          <span style="margin-left: 25px;">g</span>
        </div>

    </el-form-item>
    <el-form-item label="箱规数量" prop="productWidth">
      <div style="display: flex; align-items: center;">
        <el-input
          v-model="formData.productWidth"
          placeholder="箱规数量"
          class="w-80!"
        />
        <span style="margin-left: 25px;">个</span>
      </div>
    </el-form-item>
    <!-- 箱长宽高 -->
    <el-form-item label="箱长宽高" prop="cartonDimensions">
      <div style="display: flex; align-items: center;">
        <el-input
          v-model="formData.cartonLength"
          placeholder="箱长宽高"
          class="w-80!"
        />
      <span style="margin-left: 25px;">cm</span>
      </div>
<!--      <el-col :span="3">-->
<!--        <el-input-->
<!--          v-model="formData.cartonWidth"-->
<!--          placeholder="宽"-->
<!--          class="w-80"-->
<!--        />-->
<!--      </el-col>-->
<!--      <el-col :span="3">-->
<!--        <el-input-->
<!--          v-model="formData.cartonHeight"-->
<!--          placeholder="高"-->
<!--          class="w-80"-->
<!--        />-->
<!--      </el-col>-->
<!--      <el-col :span="2">-->
<!--        <el-select-->
<!--          v-model="formData.cartonDimensionsUnit"-->
<!--          placeholder="请选择单位"-->
<!--          class="w-80"-->
<!--        >-->
<!--          <el-option label="mm" value="mm" />-->
<!--          <el-option label="cm" value="cm" />-->
<!--          <el-option label="m" value="m" />-->
<!--        </el-select>-->
<!--      </el-col>-->
    </el-form-item>

    <!-- 箱规重量 -->
    <el-form-item label="箱规重量" prop="cartonWeight">

        <div style="display: flex; align-items: center;">
        <el-input-number
          v-model="formData.cartonWeight"
          :min="0"
          placeholder="请输入箱规重量数值"
          class="w-80!"
        />
          <span style="margin-left: 25px;">g</span>
        </div>
<!--      <el-col :span="2">-->
<!--        <el-select-->
<!--          v-model="formData.cartonWeightUnit"-->
<!--          placeholder="请选择单位"-->
<!--          class="w-80"-->
<!--        >-->
<!--          <el-option label="g" value="g" />-->
<!--          <el-option label="kg" value="kg" />-->
<!--        </el-select>-->
<!--      </el-col>-->
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import type { ProductVO } from '@/api/erp/product/product/index';
import { Editor } from '@/components/Editor';
import { PropType } from 'vue';
import { propTypes } from '@/utils/propTypes';
import { copyValueToTarget } from '@/utils';

defineOptions({ name: 'ProductDescriptionForm' });

const message = useMessage(); // 消息弹窗

const props = defineProps({
  propFormData: {
    type: Object as PropType<ProductVO>,
    default: () => {},
  },
  activeName: propTypes.string.def(''),
  isDetail: propTypes.bool.def(false), // 是否作为详情组件
});
const formRef = ref(); // 表单Ref
const formData = reactive<ProductVO>({
  totalQuantity: 0, // 现货数量
  packagingMaterialQuantity: 0, // 包材数量
  orderReplenishmentLeadTime: '', // 返单时效
  orderReplenishmentLeadTimeUnit: '天', // 返单时效单位
  productLength: '', // 品长
  productWidth: '', // 品宽
  productHeight: '', // 品高
  productDimensionsUnit: 'mm', // 品长宽高单位
  cartonLength: '', // 箱长
  cartonWidth: '', // 箱宽
  cartonHeight: '', // 箱高
  cartonDimensionsUnit: 'mm', // 箱长宽高单位
  cartonWeight: 0, // 箱规重量
  cartonWeightUnit: 'g', // 箱规重量单位
  weight: 0, // 产品重量
});

const rules = reactive({
  // totalQuantity: [{ required: true, message: '现货数量不能为空', trigger: 'blur' }],
  // packagingMaterialQuantity: [
  //   { required: true, message: '包材数量不能为空', trigger: 'blur' },
  // ],
  // orderReplenishmentLeadTime: [
  //   { required: true, message: '返单时效不能为空', trigger: 'blur' },
  // ],
  productDimensions: [{ required: true, message: '品长宽高不能为空', trigger: 'blur' }],
  weight: [{ required: true, message: '产品重量不能为空', trigger: 'blur' }],
  productWidth: [{ required: true, message: '箱规数量不能为空', trigger: 'blur' }],
  cartonDimensions: [{ required: true, message: '箱长宽高不能为空', trigger: 'blur' }],
  cartonWeight: [{ required: true, message: '箱规重量不能为空', trigger: 'blur' }],
  // cartonHeight: [{ required: true, message: '箱高不能为空', trigger: 'blur' }],
  // cartonWeight: [{ required: true, message: '箱规重量不能为空', trigger: 'blur' }],
});

watch(
  () => props.propFormData,
  (data) => {
    if (!data) return;
    copyValueToTarget(formData, data);
  },
  {
    immediate: true,
  }
);

const emit = defineEmits(['update:activeName']);
const validate = async () => {
  if (!formRef) return;
  try {
    await unref(formRef)?.validate();
    Object.assign(props.propFormData, formData);
  } catch (e) {
    message.error('【库存箱规信息】不完善，请填写相关信息');
    emit('update:activeName', 'description');
    throw e;
  }
};
defineExpose({ validate });
</script>
