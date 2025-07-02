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
<!--        <el-tab-pane label="价格机制" name="price">-->
<!--          <PriceForm-->
<!--            ref="priceRef"-->
<!--            v-model:activeName="activeName"-->
<!--            :is-detail="isDetail"-->
<!--            :propFormData="formData"-->
<!--          />-->
<!--        </el-tab-pane>-->
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
  import * as GroupBuyingReviewApi from '@/api/erp/groupbuyingreview'
  import InfoForm from './InfoForm.vue'
  import PriceForm from './PriceForm.vue'
  import ProgressForm from './ProgressForm.vue'

  defineOptions({ name: 'ErpGroupBuyingReviewAdd' })

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
  const formData = ref<GroupBuyingReviewApi.GroupBuyingReviewVO>({
    no: '',
    groupBuyingId: undefined,
    groupBuyingNo: '', // 货盘编号（用于显示）
    customerId: undefined, // 客户ID（传递给后端）
    brandName: '',
    productName: '',
    productSpec: '',
    productSku: '',
    remark: '',
    customerName: '', // 客户名称（用于显示）
    supplyGroupPrice: 0,
    expressFee: 0,
    groupMechanism: '',
    status: undefined, // 货盘状态
    sampleSendDate: undefined,
    groupStartDate: undefined,
    groupSales: 0,
    repeatGroupDate: undefined,
    repeatGroupSales: 0
  })

  /** 获得详情 */
  const getDetail = async () => {
    if ('ErpGroupBuyingReviewDetail' === name) {
      isDetail.value = true
    }
    const id = params.id as unknown as number
    
    // 检查是否是复制模式
    const { query } = useRoute()
    const isCopyMode = query.copy === 'true'
    
    if (id && !isCopyMode) {
      formLoading.value = true
      try {
        const res = await GroupBuyingReviewApi.GroupBuyingReviewApi.getGroupBuyingReview(id)
        formData.value = res
      } finally {
        formLoading.value = false
      }
    } else if (isCopyMode) {
      // 复制模式：从localStorage获取复制的数据
      const copyData = localStorage.getItem('copyGroupBuyingReviewData')
      if (copyData) {
        try {
          const parsedData = JSON.parse(copyData)
          
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
          
          // 复制数据并重置某些字段
          formData.value = {
            ...parsedData,
            id: undefined, // 清空ID
            no: '', // 清空编号，系统自动生成
            groupBuyingId: parsedData.groupBuyingId, // 保留团购货盘ID
            groupBuyingNo: parsedData.groupBuyingNo, // 保留团购货盘编号
            customerId: parsedData.customerId, // 保留客户ID
            customerName: parsedData.customerName, // 保留客户名称
            // 保留进展相关字段，并格式化日期
            sampleSendDate: formatDate(parsedData.sampleSendDate), // 格式化寄样日期
            groupStartDate: formatDate(parsedData.groupStartDate), // 格式化开团日期
            groupSales: parsedData.groupSales, // 保留开团销量
            repeatGroupDate: formatDate(parsedData.repeatGroupDate), // 格式化复团日期
            repeatGroupSales: parsedData.repeatGroupSales, // 保留复团销量
            createTime: undefined,
            updateTime: undefined,
            creator: undefined,
            updater: undefined
          }
          
          // 清除localStorage中的复制数据
          localStorage.removeItem('copyGroupBuyingReviewData')
        } catch (e) {
          console.error('解析复制数据失败:', e)
          message.error('复制数据格式错误')
        }
      }
    }
  }

  /** 提交按钮 */
  const submitForm = async () => {
    formLoading.value = true
    try {
      // 校验各表单
      await unref(infoRef)?.validate()
      // await unref(priceRef)?.validate() // PriceForm已被注释，移除校验
      await unref(progressRef)?.validate()

      // 提交数据
      const data = cloneDeep(unref(formData.value))
      const id = params.id as unknown as number

      if (!id) {
        await GroupBuyingReviewApi.GroupBuyingReviewApi.createGroupBuyingReview(data)
        message.success(t('common.createSuccess'))
      } else {
        await GroupBuyingReviewApi.GroupBuyingReviewApi.updateGroupBuyingReview(data)
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
    push({ name: 'ErpGroupBuyingReview' })
  }

  /** 初始化 */
  onMounted(async () => {
    await getDetail()
  })
  </script>
