<template>
    <ContentWrap v-loading="formLoading">
      <el-tabs v-model="activeName">
        <el-tab-pane label="样品基础信息" name="info">
          <InfoForm
            ref="infoRef"
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
  import * as SampleApi from '@/api/erp/sample'
  import InfoForm from './InfoForm.vue'
  
  defineOptions({ name: 'ErpSampleAdd' })
  
  const { t } = useI18n() // 国际化
  const message = useMessage() // 消息弹窗
  const { push, currentRoute } = useRouter() // 路由
  const { params, name } = useRoute() // 查询参数
  const { delView } = useTagsViewStore() // 视图操作
  
  const formLoading = ref(false) // 表单的加载中
  const activeName = ref('info') // Tab 激活的窗口
  const isDetail = ref(false) // 是否查看详情
  const infoRef = ref() // 基础信息 Ref
  
  // 表单数据
  const formData = ref<SampleApi.SampleVO>({
    no: '',
    logisticsCompany: '',
    logisticsNo: '',
    receiverName: '',
    contactPhone: '',
    address: '',
    comboProductId: '',
    productSpec: '',
    productQuantity: 0,
    customerName: '',
    sampleStatus: 1,
    reference: '',
    remark: ''
  })
  
  /** 获得详情 */
  const getDetail = async () => {
    if ('ErpSampleDetail' === name) {
      isDetail.value = true
    }
    const id = params.id as unknown as number
    if (id) {
      formLoading.value = true
      try {
        const res = await SampleApi.SampleApi.getSample(id)
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
  
      // 提交数据
      const data = cloneDeep(unref(formData.value))
      const id = params.id as unknown as number
  
      if (!id) {
        await SampleApi.SampleApi.createSample(data)
        message.success(t('common.createSuccess'))
      } else {
        await SampleApi.SampleApi.updateSample(data)
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
    push({ name: 'ErpSample' })
  }
  
  /** 初始化 */
  onMounted(async () => {
    await getDetail()
  })
  </script>