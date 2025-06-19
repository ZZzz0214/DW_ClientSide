<template>
  <ContentWrap v-loading="formLoading">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基础信息" name="info">
        <InfoForm
          ref="infoRef"
          v-model:activeName="activeName"
          :is-detail="isDetail"
          :propFormData="formData"
        />
      </el-tab-pane>
<!--      <el-tab-pane label="价格信息" name="price">-->
<!--        <PriceForm-->
<!--          ref="priceRef"-->
<!--          v-model:activeName="activeName"-->
<!--          :is-detail="isDetail"-->
<!--          :propFormData="formData"-->
<!--        />-->
<!--      </el-tab-pane>-->
      <el-tab-pane label="运费信息" name="shippingcost">
        <CostForm
          ref="shippingcostRef"
          v-model:activeName="activeName"
          :is-detail="isDetail"
          :propFormData="formData"
        />
      </el-tab-pane>
    </el-tabs>
    <el-form>
      <el-form-item style="float: right">
        <el-button v-if="!isDetail" :loading="formLoading" type="primary" @click="submitForm">
          保存
        </el-button>
        <el-button @click="close">返回</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash-es'
import { useTagsViewStore } from '@/store/modules/tagsView'
import * as ErpComboApi from '@/api/erp/product/combo/index'
import InfoForm from './InfoForm.vue'
import CostForm from './Shippingcost.vue'
import * as ProductComboApi from '@/api/erp/product/combo'

defineOptions({ name: 'ErpProductAdd' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const { push, currentRoute } = useRouter() // 路由
const { params, name } = useRoute() // 查询参数
const { delView } = useTagsViewStore() // 视图操作

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const activeName = ref('info') // Tag 激活的窗口
const isDetail = ref(false) // 是否查看详情
const infoRef = ref() // 产品基础信息 Ref
const shippingcostRef = ref() // 价格信息 Ref

// 组合产品表单数据
const formData = ref<ProductComboApi.ComboVO>({
  id: 0, // 组品编号（可选）
  name: '', // 组合产品名称（必填）
  image: '', // 产品图片
  shortName:'', //组品简称
  shippingCode:'', //发货编码
  weight: 0, // 产品重量
  purchaser:'', //采购人员
  supplier:'', //供应商名
  purchasePrice:0, //采购单价
  wholesalePrice:0, //批发单价
  totalQuantity: 0, // 产品数量（必填）
  status: 0, // 产品状态（必填）
  items: [], // 关联的单品列表（必填）
  shippingFeeType: undefined, // 运费类型（0：固定运费，1：按件计费，2：按重计费）
  fixedShippingFee: undefined, // 固定运费，单位：元
  additionalItemQuantity: undefined, // 续件数量
  additionalItemPrice: undefined, // 续件价格，单位：元
  firstWeight: undefined, // 首重重量，单位：kg
  firstWeightPrice: undefined, // 首重价格，单位：元
  additionalWeight: undefined, // 续重重量，单位：kg
});

/** 获得详情 */
const getDetail = async () => {
  if ('ErpComboDetail' === name) {
    isDetail.value = true;
  }
  
  // 检查是否是复制操作
  const route = useRoute();
  if (route.query.copyData) {
    try {
      const copyData = JSON.parse(route.query.copyData as string);
      formData.value = {
        ...copyData,
        id: undefined, // 确保ID为空，作为新增
        no: undefined, // 确保编号为空，让后端重新生成
        name: copyData.name || copyData.name + '_副本', // 确保名称有副本标识
        createTime: undefined,
        updateTime: undefined
      };
      message.success('已复制组品数据，请修改相关信息后保存');
      return;
    } catch (error) {
      message.error('复制数据解析失败');
    }
  }
  
  // 正常的编辑/详情逻辑
  const id = params.id as unknown as number;
  if (id) {
    formLoading.value = true;
    try {
      const res = await ErpComboApi.ComboApi.getCombo(id)
      formData.value = res;

    } finally {
      formLoading.value = false;
    }
  }
};

/** 提交按钮 */
const submitForm = async () => {
  // 提交请求
  formLoading.value = true;
  try {
    // 校验各表单
    await unref(infoRef)?.validate();
   await unref(shippingcostRef).validate();


    const data = cloneDeep(unref(formData.value))
    // 确保 name 字段的值被正确设置
    if (!data.name) {
      message.error('组合产品名称不能为空');
      return;
    }
    const id = params.id as unknown as number
    if (!id) {
      await ErpComboApi.ComboApi.createCombo(data);
      message.success(t('common.createSuccess'));
    } else {
      await ErpComboApi.ComboApi.updateCombo(data);
      message.success(t('common.updateSuccess'));
    }
    // 设置一个标志，表示数据已更新
    localStorage.setItem('refreshList', 'true');

    close();
  } catch (error) {
    console.error('提交失败:', error);
    message.error(t('common.submitFailed'));
  } finally {
    formLoading.value = false;
  }
};
/** 关闭按钮 */
const close = () => {
  delView(unref(currentRoute))
  push({ name: 'ErpCombo' })
}

/** 初始化 */
onMounted(async () => {
  await getDetail()
})
</script>
