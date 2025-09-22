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
  import { LiveBroadcastingReviewApi } from '@/api/erp/livebroadcastingreview'
  import InfoForm from './InfoForm.vue'
  import ProgressForm from './ProgressForm.vue'

  defineOptions({ name: 'ErpLiveBroadcastingReviewAdd' })

  const { t } = useI18n() // 国际化
  const message = useMessage() // 消息弹窗
  const { push, currentRoute } = useRouter() // 路由
  const { params, name, query } = useRoute() // 查询参数
  const { delView } = useTagsViewStore() // 视图操作

  const formLoading = ref(false) // 表单的加载中
  const activeName = ref('info') // Tab 激活的窗口
  const isDetail = ref(false) // 是否查看详情
  const infoRef = ref() // 基础信息 Ref
  const progressRef = ref() // 进展跟踪 Ref

  // 表单数据
  const formData = ref<LiveBroadcastingReviewApi.LiveBroadcastingReviewVO>({
    no: '',
    liveBroadcastingId: undefined,
    liveBroadcastingNo: '', // 货盘编号（用于显示）
    customerId: undefined, // 客户ID（传递给后端）
    brandName: '', // 品牌名称
    productName: '',
    productSpec: '',
    productSku: '',
    remark: '',
    customerName: '', // 客户名称（用于显示）
    livePrice: 0,
    liveStatus: undefined, // 货盘状态
    livePlatform: '', // 直播平台
    liveCommission: '', // 直播佣金
    publicCommission: '', // 公开佣金
    rebateCommission: '', // 返点佣金
    sampleSendDate: undefined,
    liveStartDate: undefined,
    liveSales: 0,
    repeatLiveDate: undefined,
    repeatLiveSales: 0
  })

  /** 获得详情 */
  const getDetail = async () => {
    if ('ErpLiveBroadcastingReviewDetail' === name) {
      isDetail.value = true
    }
    
    // 检查是否是复制操作
    if (query.copy === 'true') {
      const copyDataStr = localStorage.getItem('copyLiveBroadcastingReviewData')
      if (copyDataStr) {
        try {
          const copyData = JSON.parse(copyDataStr)
          
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
          
          // 格式化日期字段
          const formattedCopyData = {
            ...copyData,
            sampleSendDate: formatDate(copyData.sampleSendDate),
            liveStartDate: formatDate(copyData.liveStartDate),
            repeatLiveDate: formatDate(copyData.repeatLiveDate)
          }
          
          formData.value = { ...formData.value, ...formattedCopyData }
          localStorage.removeItem('copyLiveBroadcastingReviewData') // 使用后清除
          message.success('已自动填充复制的数据')
          return
        } catch (error) {
          console.error('解析复制数据失败:', error)
        }
      }
    }
    
    const id = params.id as unknown as number
    if (id) {
      formLoading.value = true
      try {
        const res = await LiveBroadcastingReviewApi.getLiveBroadcastingReview(id)
        console.log("获取到的数据:", res)
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
      await unref(progressRef)?.validate()

      // 提交数据
      const data = cloneDeep(unref(formData.value))
      const id = params.id as unknown as number

      if (!id) {
        await LiveBroadcastingReviewApi.createLiveBroadcastingReview(data)
        message.success(t('common.createSuccess'))
      } else {
        await LiveBroadcastingReviewApi.updateLiveBroadcastingReview(data)
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
    push({ name: 'ErpLiveBroadcastingReview' })
  }

  /** 初始化 */
  onMounted(async () => {
    await getDetail()
  })
  </script>
