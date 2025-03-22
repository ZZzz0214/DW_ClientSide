<template>
  <ContentWrap v-loading="formLoading">
    <el-tabs v-model="activeName">
      <el-tab-pane label="产品基础信息" name="info">
        <InfoForm
          ref="infoRef"
          v-model:activeName="activeName"
          :is-detail="isDetail"
          :propFormData="formData"
        />
      </el-tab-pane>
      <el-tab-pane label="合格证信息" name="sku">
        <SkuForm
          ref="skuRef"
          v-model:activeName="activeName"
          :is-detail="isDetail"
          :propFormData="formData"
        />
      </el-tab-pane>
      <el-tab-pane label="库存箱规信息" name="description">
        <DescriptionForm
          ref="descriptionRef"
          v-model:activeName="activeName"
          :is-detail="isDetail"
          :propFormData="formData"
        />
      </el-tab-pane>
      <el-tab-pane label="快递售后信息" name="delivery">
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
      <el-tab-pane label="价格信息" name="price">
        <PriceForm
          ref="priceRef"
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
import * as ErpProductApi from '@/api/erp/product/product/index'
import InfoForm from './InfoForm.vue'
import DescriptionForm from './DescriptionForm.vue'
import OtherForm from './OtherForm.vue'
import SkuForm from './SkuForm.vue'
import DeliveryForm from './DeliveryForm.vue'
import { convertToInteger, floatToFixed2, formatToFraction } from '@/utils'
import PriceForm from "@/views/erp/product/product/form/PriceForm.vue";


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
const skuRef = ref() // 合格证信息 Ref
const deliveryRef = ref() // 快递售后信息 Ref
const descriptionRef = ref() // 库存箱规信息 Ref
const otherRef = ref() // 机制信息 Ref
const priceRef = ref() // 价格信息 Ref
//  SPU 表单数据
// const formData = ref<ErpProductApi.Spu>({
//   name: '', // 商品名称
//   categoryId: undefined, // 商品分类
//   keyword: '', // 关键字
//   picUrl: '', // 商品封面图
//   sliderPicUrls: [], // 商品轮播图
//   introduction: '', // 商品简介
//   deliveryTypes: [], // 配送方式数组
//   deliveryTemplateId: undefined, // 运费模版
//   brandId: undefined, // 商品品牌
//   specType: false, // 商品规格
//   subCommissionType: false, // 分销类型
//   skus: [
//     {
//       price: 0, // 商品价格
//       marketPrice: 0, // 市场价
//       costPrice: 0, // 成本价
//       barCode: '', // 商品条码
//       picUrl: '', // 图片地址
//       stock: 0, // 库存
//       weight: 0, // 商品重量
//       volume: 0, // 商品体积
//       firstBrokeragePrice: 0, // 一级分销的佣金
//       secondBrokeragePrice: 0 // 二级分销的佣金
//     }
//   ],
//   description: '', // 商品详情
//   sort: 0, // 商品排序
//   giveIntegral: 0, // 赠送积分
//   virtualSalesCount: 0 // 虚拟销量
// })

// Product 表单数据
const formData = ref<ErpProductApi.ProductVO>({
  id: 0, // 产品编号，假设初始值为0或undefined
  name: '', // 产品名称
  barCode: '', // 产品条码
  categoryId: 0, // 产品分类编号，假设初始值为0或undefined
  image: '', // 产品图片
  productShortName: '', // 产品简称
  shippingCode: '', // 发货编码
  productRecord: '', // 商品备案
  executionCode: '', // 执行编号
  trademarkCode: '', // 商标编号
  brand: '', // 品牌
  status: 0, // 产品状态，假设初始值为0或undefined
  remark: '', // 产品备注
  productSellingPoints: '', // 产品卖点
  standard: '', // 产品规格
  weight: 0, // 产品重量（单位：kg）
  productDimensions: '', // 产品长宽高
  cartonSpecifications: '', // 箱规
  cartonDimensions: '', // 箱规长宽高
  cartonWeight: 0, // 箱规重量
  availableStockQuantity: 0, // 现货数量
  packagingMaterialQuantity: 0, // 包材数量
  orderReplenishmentLeadTime: '', // 返单时效
  shippingAddress: '', // 发货地址
  returnAddress: '', // 退货地址
  logisticsCompany: '', // 物流公司
  nonshippingArea: '', // 不发货地
  addonShippingArea: '', // 加邮区域
  afterSalesStandard: '', // 售后标准
  afterSalesScript: '', // 售后话术
  publicDomainEventMinimumPrice: 0, // 公域活动最低价
  liveStreamingEventMinimumPrice: 0, // 直播活动最低价
  pinduoduoEventMinimumPrice: 0, // 拼多多活动最低价
  alibabaEventMinimumPrice: 0, // 阿里巴巴活动最低价
  groupBuyEventMinimumPrice: 0, // 团购活动最低价
  purchaser: '', // 采购人员
  supplier: '', // 供应商
  purchasePrice: 0, // 采购价格，单位：元
  wholesalePrice: 0, // 批发单价，单位：元
  minPurchasePrice: 0, // 对外最低采购单价，单位：元
  minWholesalePrice: 0, // 对外最低批发单价，单位：元
  shippingFeeType: 0, // 运费类型（0：固定运费，1：按件计费，2：按重计费）
  fixedShippingFee: 0, // 固定运费，单位：元
  firstItemQuantity: 0, // 首件数量
  firstItemPrice: 0, // 首件价格，单位：元
  additionalItemQuantity: 0, // 续件数量
  additionalItemPrice: 0, // 续件价格，单位：元
  firstWeight: 0, // 首重重量，单位：kg
  firstWeightPrice: 0, // 首重价格，单位：元
  additionalWeight: 0, // 续重重量，单位：kg
  additionalWeightPrice: 0, // 续重价格，单位：元
  productionDate: '', // 首批生产日期
  expiryDay: 0, // 保质期天数
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
  const id = params.id as unknown as number;
  if (id) {
    formLoading.value = true;
    try {
      const res = (await ErpProductApi.ProductApi.getProduct(id)) as ErpProductApi.ProductVO;
      formData.value = res;
    } finally {
      formLoading.value = false;
    }
  }
};
// /** 提交按钮 */
// const submitForm = async () => {
//   // 提交请求
//   formLoading.value = true
//   try {
//     // 校验各表单
//     await unref(infoRef)?.validate()
//     await unref(skuRef)?.validate()
//     await unref(deliveryRef)?.validate()
//     await unref(descriptionRef)?.validate()
//     await unref(otherRef)?.validate()
//     // 深拷贝一份, 这样最终 server 端不满足，不需要影响原始数据
//     const deepCopyFormData = cloneDeep(unref(formData.value)) as ErpProductApi.Spu
//     deepCopyFormData.skus!.forEach((item) => {
//       // 给sku name赋值
//       item.name = deepCopyFormData.name
//       // sku相关价格元转分
//       item.price = convertToInteger(item.price)
//       item.marketPrice = convertToInteger(item.marketPrice)
//       item.costPrice = convertToInteger(item.costPrice)
//       item.firstBrokeragePrice = convertToInteger(item.firstBrokeragePrice)
//       item.secondBrokeragePrice = convertToInteger(item.secondBrokeragePrice)
//     })
//     // 处理轮播图列表
//     const newSliderPicUrls: any[] = []
//     deepCopyFormData.sliderPicUrls!.forEach((item: any) => {
//       // 如果是前端选的图
//       typeof item === 'object' ? newSliderPicUrls.push(item.url) : newSliderPicUrls.push(item)
//     })
//     deepCopyFormData.sliderPicUrls = newSliderPicUrls
//     // 校验都通过后提交表单
//     const data = deepCopyFormData as ErpProductApi.Spu
//     const id = params.id as unknown as number
//     if (!id) {
//       await ErpProductApi.createSpu(data)
//       message.success(t('common.createSuccess'))
//     } else {
//       await ErpProductApi.updateSpu(data)
//       message.success(t('common.updateSuccess'))
//     }
//     close()
//   } finally {
//     formLoading.value = false
//   }
// }
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
    // 深拷贝一份, 这样最终 server 端不满足，不需要影响原始数据
    const deepCopyFormData = cloneDeep(unref(formData.value)) as ErpProductApi.ProductVO;
    // 校验都通过后提交表单
    const data = deepCopyFormData as ErpProductApi.ProductVO;
    const id = params.id as unknown as number;
    if (!id) {
      await ErpProductApi.ProductApi.createProduct(data);
      message.success(t('common.createSuccess'));
    } else {
      await ErpProductApi.ProductApi.updateProduct(data);
      message.success(t('common.updateSuccess'));
    }
    close();
  } finally {
    formLoading.value = false;
  }
};
/** 关闭按钮 */
const close = () => {
  delView(unref(currentRoute))
  push({ name: 'ErpProduct' })
}

/** 初始化 */
onMounted(async () => {
  await getDetail()
})
</script>
