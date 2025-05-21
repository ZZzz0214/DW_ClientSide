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
import * as ErpPrivateBroadcastingReviewApi from '@/api/erp/privateBroadcastingReview'
import InfoForm from './InfoForm.vue'
import PriceForm from './PriceForm.vue'
import ProgressForm from './ProgressForm.vue'

defineOptions({ name: 'ErpPrivateBroadcastingAdd' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const { push, currentRoute } = useRouter() // 路由
const { params, name } = useRoute() // 查询参数
const { delView } = useTagsViewStore() // 视图操作

const formLoading = ref(false) // 表单的加载中
const activeName = ref('info') // Tab 激活的窗口
const isDetail = ref(false) // 是否查看详情
const infoRef = ref() // 基础信息 Ref
const priceRef = ref() // 价格机制 Ref
const progressRef = ref() // 进展跟踪 Ref

// 表单数据
const formData = ref({
  privateBroadcastingId: undefined,
  no: '',
  brandName: '',
  productName: '',
  productSpec: '',
  productSku: '',
  remark: '',
  customerName: '',
  livePrice: 0,
  productNakedPrice: 0,
  expressFee: 0,
  dropshipPrice: 0,
  sampleSendDate: '',
  groupStartDate: '',
  groupSales: 0,
  repeatGroupDate: '',
  repeatGroupSales: 0
})

/** 获得详情 */
const getDetail = async () => {
  if ('ErpPrivateBroadcastingDetail' === name) {
    isDetail.value = true
  }
  const id = params.id as unknown as number
  if (id) {
    formLoading.value = true
    try {
      const res = await ErpPrivateBroadcastingReviewApi.ErpPrivateBroadcastingReviewApi.getPrivateBroadcastingReview(id)
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
    const infoValid = await unref(infoRef)?.validate()
    const priceValid = await unref(priceRef)?.validate()
    const progressValid = await unref(progressRef)?.validate()

    if (!infoValid || !priceValid || !progressValid) {
      message.error(t('common.validationFailed')) // 提示校验失败
      return
    }

    // 提交数据
    const data = cloneDeep(unref(formData.value))
    const id = params.id as unknown as number

    if (!id) {
      await ErpPrivateBroadcastingReviewApi.ErpPrivateBroadcastingReviewApi.createPrivateBroadcastingReview(data)
      message.success(t('common.createSuccess'))
    } else {
      await ErpPrivateBroadcastingReviewApi.ErpPrivateBroadcastingReviewApi.updatePrivateBroadcastingReview(data)
      message.success(t('common.updateSuccess'))
    }

    // 设置刷新标志
    localStorage.setItem('refreshList', 'true')
    close()
  } catch (error) {
    message.error(t('common.submitFailed')) // 提示提交失败
  } finally {
    formLoading.value = false
  }
}

/** 关闭按钮 */
const close = () => {
  delView(unref(currentRoute))
  push({ name: 'ErpPrivateBroadcasting' })
}

/** 初始化 */
onMounted(async () => {
  await getDetail()
})
</script>