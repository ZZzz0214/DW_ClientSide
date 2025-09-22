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
        <el-tab-pane label="进展跟踪" name="progress">
          <ProgressForm
            ref="progressRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
          />
        </el-tab-pane>
        <el-tab-pane label="复制数据" name="copy" v-if="isDetail">
          <CopyDataForm :formData="formData" />
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
  import ProgressForm from './ProgressForm.vue'
  import CopyDataForm from './components/CopyDataForm.vue'

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
  const progressRef = ref()

  // 表单数据
  const formData = ref({
    id: undefined,
    no: '',
    privateBroadcastingId: undefined,
    privateBroadcastingNo: '',
    brandName: undefined,
    productName: '',
    productSpec: '',
    productSku: '',
    livePrice: undefined,
    privateStatus: undefined,
    remark: '',
    customerId: undefined,
    customerName: '',
    productNakedPrice: '',
    expressFee: '',
    dropshipPrice: '',
    sampleSendDate: '',
    groupStartDate: '',
    groupSales: 0,
    repeatGroupDate: '',
    repeatGroupSales: 0
  })

  /** 获得详情 */
  const getDetail = async () => {
    if ('ErpPrivateBroadcastingReviewDetail' === name) {
      isDetail.value = true
    }
    const id = params.id as unknown as number
    const copyId = params.copyId as unknown as number

    if (id) {
      formLoading.value = true
      try {
        const res = await PrivateBroadcastingReviewApi.getPrivateBroadcastingReview(id)
        formData.value = res
      } catch (error) {
        console.error('获取详情失败:', error)
        message.error('获取详情失败')
      } finally {
        formLoading.value = false
      }
    } else if (copyId) {
      // 复制模式
      formLoading.value = true
      try {
        const res = await PrivateBroadcastingReviewApi.getPrivateBroadcastingReview(copyId)
        
        // 处理日期字段：将时间戳转换为YYYY-MM-DD格式
        const formatDate = (timestamp: any) => {
          if (!timestamp) return undefined
          if (typeof timestamp === 'string' && timestamp.includes('-')) {
            return timestamp // 已经是YYYY-MM-DD格式
          }
          if (typeof timestamp === 'number') {
            const date = new Date(timestamp)
            return date.toISOString().split('T')[0] // 转换为YYYY-MM-DD格式
          }
          return undefined
        }
        
        // 复制数据，但重置关键字段，并格式化日期
        formData.value = {
          ...res,
          id: undefined,
          no: '',
          createTime: undefined,
          updateTime: undefined,
          // 格式化日期字段
          sampleSendDate: formatDate(res.sampleSendDate),
          groupStartDate: formatDate(res.groupStartDate),
          repeatGroupDate: formatDate(res.repeatGroupDate)
        }
      } catch (error) {
        console.error('获取复制数据失败:', error)
        message.error('获取复制数据失败')
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
      await unref(progressRef)?.validate()

      // 提交数据
      const data = cloneDeep(unref(formData.value))
      const id = params.id as unknown as number

      if (!id) {
        await PrivateBroadcastingReviewApi.createPrivateBroadcastingReview(data)
        message.success(t('common.createSuccess'))
      } else {
        await PrivateBroadcastingReviewApi.updatePrivateBroadcastingReview(data)
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
