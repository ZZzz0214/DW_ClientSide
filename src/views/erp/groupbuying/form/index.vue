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
        <el-tab-pane label="核心机制" name="core">
          <CoreForm
            ref="coreRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
          />
        </el-tab-pane>
        <el-tab-pane label="基础机制" name="basic">
          <BasicForm
            ref="basicRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
          />
        </el-tab-pane>
        <el-tab-pane label="数据信息" name="data">
          <DataForm
            ref="dataRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
          />
        </el-tab-pane>
        <el-tab-pane label="发货信息" name="shipping">
          <ShippingForm
            ref="shippingRef"
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
  import * as GroupBuyingApi from '@/api/erp/groupbuying'
  import InfoForm from './InfoForm.vue'
  import CoreForm from './CoreForm.vue'
  import BasicForm from './BasicForm.vue'
  import DataForm from './DataForm.vue'
  import ShippingForm from './ShippingForm.vue'
  
  defineOptions({ name: 'ErpGroupBuyingAdd' })
  
  const { t } = useI18n() // 国际化
  const message = useMessage() // 消息弹窗
  const { push, currentRoute } = useRouter() // 路由
  const { params, name } = useRoute() // 查询参数
  const { delView } = useTagsViewStore() // 视图操作
  
  const formLoading = ref(false) // 表单的加载中
  const activeName = ref('info') // Tab 激活的窗口
  const isDetail = ref(false) // 是否查看详情
  const infoRef = ref() // 基础信息 Ref
  const coreRef = ref() // 核心机制 Ref
  const basicRef = ref() // 基础机制 Ref
  const dataRef = ref() // 数据信息 Ref
  const shippingRef = ref() // 发货信息 Ref
  
  // 表单数据
  const formData = ref<GroupBuyingApi.GroupBuyingVO>({
    no: '',
    productImage: '',
    brandName: '',
    productName: '',
    productSpec: '',
    productSku: '',
    marketPrice: 0,
    shelfLife: undefined,
    productStock: 0,
    remark: '',
    status: undefined,
    corePrice: 0,
    distributionPrice: 0,
    supplyGroupPrice: 0,
    sellingCommission: 0,
    groupPrice: 0,
    channelProfit: 0,
    groupMechanism: '',
    expressFee: 0,
    tmallJd: '',
    publicData: '',
    privateData: '',
    brandEndorsement: '',
    competitiveAnalysis: '',
    expressCompany: '',
    shippingTime: '',
    shippingArea: ''
  })
  
  /** 获得详情 */
  const getDetail = async () => {
    if ('ErpGroupBuyingDetail' === name) {
      isDetail.value = true
    }
    const id = params.id as unknown as number
    if (id) {
      formLoading.value = true
      try {
        const res = await GroupBuyingApi.GroupBuyingApi.getGroupBuying(id)
        formData.value = res
      } finally {
        formLoading.value = false
      }
    }
  }
  
  /** 提交按钮 */
  const submitForm = async () => {
    formLoading.value = true
    try {
      // 校验各表单
      await unref(infoRef)?.validate()
      await unref(coreRef)?.validate()
      await unref(basicRef)?.validate()
      await unref(dataRef)?.validate()
      await unref(shippingRef)?.validate()
  
      // 提交数据
      const data = cloneDeep(unref(formData.value))
      const id = params.id as unknown as number
  
      if (!id) {
        await GroupBuyingApi.GroupBuyingApi.createGroupBuying(data)
        message.success(t('common.createSuccess'))
      } else {
        await GroupBuyingApi.GroupBuyingApi.updateGroupBuying(data)
        message.success(t('common.updateSuccess'))
      }
  
      // 设置刷新标志
      localStorage.setItem('refreshList', 'true')
      close()
    } finally {
      formLoading.value = false
    }
  }
  
  /** 关闭按钮 */
  const close = () => {
    delView(unref(currentRoute))
    push({ name: 'ErpGroupBuying' })
  }
  
  /** 初始化 */
  onMounted(async () => {
    await getDetail()
  })
  </script>