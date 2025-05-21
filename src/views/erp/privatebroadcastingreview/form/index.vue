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
        <el-tab-pane label="价格机制" name="price">
          <PriceForm
            ref="priceRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
          />
        </el-tab-pane>
        <el-tab-pane label="进展跟踪" name="progress">
          <ProgressForm
            ref="progressRef"
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
  import * as PrivateBroadcastingReviewApi from '@/api/erp/privateBroadcastingReview'
  import InfoForm from './InfoForm.vue'
  import PriceForm from './PriceForm.vue'
  import ProgressForm from './ProgressForm.vue'

  defineOptions({ name: 'ErpPrivateBroadcastingReviewAdd' })

  const { t } = useI18n()
  const message = useMessage()
  const { push, currentRoute } = useRouter()
  const { params, name } = useRoute()
  const { delView } = useTagsViewStore()

  const formLoading = ref(false)
  const activeName = ref('info')
  const isDetail = ref(false)
  const infoRef = ref()
  const priceRef = ref()
  const progressRef = ref()

  // 表单数据
  const formData = ref({
    id: undefined,
    no: '',
    remark: '',
    customerName: '',
    productPrice: 0,
    expressFee: 0,
    distributionPrice: 0,
    sampleSendDate: '',
    groupStartDate: '',
    groupSales: 0,
    reGroupDate: '',
    reGroupSales: 0
  })

  /** 获得详情 */
  const getDetail = async () => {
    if ('ErpPrivateBroadcastingReviewDetail' === name) {
      isDetail.value = true
    }
    const id = params.id as unknown as number
    if (id) {
      formLoading.value = true
      try {
        const res = await PrivateBroadcastingReviewApi.ErpPrivateBroadcastingReviewApi.getPrivateBroadcastingReview(id)
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
      await unref(priceRef)?.validate()
      await unref(progressRef)?.validate()

      // 提交数据
      const data = cloneDeep(unref(formData.value))
      const id = params.id as unknown as number

      if (!id) {
        await PrivateBroadcastingReviewApi.ErpPrivateBroadcastingReviewApi.createPrivateBroadcastingReview(data)
        message.success(t('common.createSuccess'))
      } else {
        await PrivateBroadcastingReviewApi.ErpPrivateBroadcastingReviewApi.updatePrivateBroadcastingReview(data)
        message.success(t('common.updateSuccess'))
      }

      localStorage.setItem('refreshList', 'true')
      close()
    } finally {
      formLoading.value = false
    }
  }

  /** 关闭按钮 */
  const close = () => {
    delView(unref(currentRoute))
    push({ name: 'ErpPrivateBroadcastingReview' })
  }

  /** 初始化 */
  onMounted(async () => {
    await getDetail()
  })
  </script>
