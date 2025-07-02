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
      <el-tab-pane label="价格信息" name="price" v-hasPermi="['erp:purchaseproduct:export']">
        <PriceForm
          ref="priceRef"
          v-model:activeName="activeName"
          :is-detail="isDetail"
          :propFormData="formData"
        />
      </el-tab-pane>
      <el-tab-pane label="运费信息" name="shippingcost">
        <CostForm
          ref="shippingcostRef"
          v-model:activeName="activeName"
          :is-detail="isDetail"
          :propFormData="formData"
        />
      </el-tab-pane>
      <el-tab-pane label="合格信息" name="sku">
        <SkuForm
          ref="skuRef"
          v-model:activeName="activeName"
          :is-detail="isDetail"
          :propFormData="formData"
        />
      </el-tab-pane>
      <el-tab-pane label="库存箱规" name="description">
        <DescriptionForm
          ref="descriptionRef"
          v-model:activeName="activeName"
          :is-detail="isDetail"
          :propFormData="formData"
        />
      </el-tab-pane>
      <el-tab-pane label="快递售后" name="delivery">
        <DeliveryForm
          ref="deliveryRef"
          v-model:activeName="activeName"
          :is-detail="isDetail"
          :propFormData="formData"
        />
      </el-tab-pane>
      <el-tab-pane label="机制信息" name="other">
        <OtherForm
          ref="otherRef"
          v-model:activeName="activeName"
          :is-detail="isDetail"
          :propFormData="formData"
        />
      </el-tab-pane>
      <el-tab-pane label="复制数据" name="copyData" v-if="isDetail" v-hasPermi="['erp:product:query']">
        <CopyDataForm
          :formData="formData"
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
import * as ErpProductApi from '@/api/erp/product/product/index'
import InfoForm from './InfoForm.vue'
import DescriptionForm from './DescriptionForm.vue'
import OtherForm from './OtherForm.vue'
import SkuForm from './SkuForm.vue'
import DeliveryForm from './DeliveryForm.vue'
import CostForm from './Shippingcost.vue'
import PriceForm from "@/views/erp/product/product/form/PriceForm.vue";
import CopyDataForm from './CopyDataForm.vue'

defineOptions({ name: 'ErpProductAdd' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const { push, currentRoute } = useRouter() // 路由
const { params, name, query } = useRoute() // 查询参数
const { delView } = useTagsViewStore() // 视图操作

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const activeName = ref('info') // Tag 激活的窗口
const isDetail = ref(false) // 是否查看详情
const infoRef = ref() // 产品基础信息 Ref
const skuRef = ref() // 合格证信息 Ref
const deliveryRef = ref() // 快递售后信息 Ref
const descriptionRef = ref() // 库存箱规信息 Ref
const otherRef = ref() // 机制信息 Ref
const priceRef = ref() // 价格信息 Ref
const shippingcostRef = ref() // 价格信息 Ref
//  SPU 表单数据

const formData = ref<ErpProductApi.ProductVO>({
  id: undefined, // 产品编号（主键，后端生成，前端不需要赋值）
  name: '', // 产品名称
  barCode: '', // 产品条码
  categoryId: undefined, // 产品分类编号
  image: '', // 产品图片
  productShortName: '', // 产品简称
  shippingCode: '', // 发货编码
  productRecord: '', // 备案编号
  executionCode: '', // 执行编号
  trademarkCode: '', // 商标编号
  brand: '', // 品牌
  status: undefined, // 产品状态
  remark: '', // 产品备注
  productSellingPoints: '', // 产品卖点
  standard: '', // 产品规格
  weight: undefined, // 产品重量（单位：kg）
  weightUnit: '', // 产品重量单位，由下拉框选择
  productDimensions: '', // 产品长宽高
  cartonSpecifications: '', // 箱规
  cartonDimensions: '', // 箱规长宽高
  cartonWeight: undefined, // 箱规重量
  totalQuantity: undefined, // 现货数量
  packagingMaterialQuantity: undefined, // 包材数量
  orderReplenishmentLeadTime: '', // 返单时效
  shippingAddress: '', // 发货地址
  returnAddress: '', // 退货地址
  logisticsCompany: '', // 物流公司
  nonshippingArea: '', // 不发货地
  addonShippingArea: '', // 加邮区域
  afterSalesStandard: '', // 售后标准
  afterSalesScript: '', // 售后话术
  publicDomainEventMinimumPrice: '', // 公域活动最低价
  liveStreamingEventMinimunPrice: '', // 直播活动最低价
  pinduoduoEventMinimumPrice: '', // 拼多多活动最低价
  alibabaEventMinimunPrice: '', // 阿里巴巴活动最低价
  groupBuyEventMinimunPrice: '', // 团购活动最低价
  purchaser: '', // 采购人员
  supplier: '', // 供应商
  purchasePrice: undefined, // 采购价格，单位：元
  wholesalePrice: undefined, // 批发单价，单位：元
  minPurchasePrice: undefined, // 对外最低采购单价，单位：元
  shippingFeeType: undefined, // 运费类型（0：固定运费，1：按件计费，2：按重计费）
  fixedShippingFee: undefined, // 固定运费，单位：元
  firstItemQuantity: undefined, // 首件数量
  firstItemPrice: undefined, // 首件价格，单位：元
  additionalItemQuantity: undefined, // 续件数量
  additionalItemPrice: undefined, // 续件价格，单位：元
  firstWeight: undefined, // 首重重量，单位：kg
  firstWeightPrice: undefined, // 首重价格，单位：元
  additionalWeight: undefined, // 续重重量，单位：kg
  additionalWeightPrice: undefined, // 续重价格，单位：元
  productionDate: '', // 首批生产日期
  expiryDay: undefined, // 保质期天数
  expiryUnit: '', // 保质日期单位，由下拉框选择
});
// /** 获得详情 */
// const getDetail = async () => {
//   if ('ErpProductDetail' === name) {
//     isDetail.value = true
//   }
//   const id = params.id as unknown as number
//   if (id) {
//     formLoading.value = true
//     try {
//       const res = (await ErpProductApi.getSpu(id)) as ErpProductApi.Spu
//       res.skus?.forEach((item) => {
//         if (isDetail.value) {
//           item.price = floatToFixed2(item.price)
//           item.marketPrice = floatToFixed2(item.marketPrice)
//           item.costPrice = floatToFixed2(item.costPrice)
//           item.firstBrokeragePrice = floatToFixed2(item.firstBrokeragePrice)
//           item.secondBrokeragePrice = floatToFixed2(item.secondBrokeragePrice)
//         } else {
//           // 回显价格分转元
//           item.price = formatToFraction(item.price)
//           item.marketPrice = formatToFraction(item.marketPrice)
//           item.costPrice = formatToFraction(item.costPrice)
//           item.firstBrokeragePrice = formatToFraction(item.firstBrokeragePrice)
//           item.secondBrokeragePrice = formatToFraction(item.secondBrokeragePrice)
//         }
//       })
//       formData.value = res
//     } finally {
//       formLoading.value = false
//     }
//   }
// }
/** 获得详情 */
const getDetail = async () => {
  if ('ErpProductDetail' === name) {
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
        name: copyData.name , // 在名称后添加副本标识
        createTime: undefined,
        updateTime: undefined
      };
      message.success('已复制产品数据，请修改相关信息后保存');
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
      const res = await ErpProductApi.ProductApi.getProduct(id);
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
    await unref(skuRef)?.validate();
    await unref(deliveryRef)?.validate();
    await unref(descriptionRef)?.validate();
    await unref(otherRef)?.validate();
    await unref(priceRef)?.validate();
    await unref(shippingcostRef)?.validate();
    // 深拷贝一份, 这样最终 server 端不满足，不需要影响原始数据
    const deepCopyFormData = cloneDeep(unref(formData.value)) as ErpProductApi.ProductVO;
    // 校验都通过后提交表单
    const data = deepCopyFormData as ErpProductApi.ProductVO;
    const id = params.id as unknown as number;
    console.log(data)
    if (!id) {
      await ErpProductApi.ProductApi.createProduct(data);
      message.success(t('common.createSuccess'));
    } else {
      await ErpProductApi.ProductApi.updateProduct(data);
      message.success(t('common.updateSuccess'));
    }
    // 设置一个标志，表示数据已更新
    localStorage.setItem('refreshList', 'true');

    close();
  } finally {
    formLoading.value = false;
  }
};
/** 关闭按钮 */
const close = () => {
  delView(unref(currentRoute))
  push({ name: 'ErpProduct'})
}

/** 初始化 */
onMounted(async () => {
  await getDetail()
})
</script>
