<template>
    <ContentWrap v-loading="formLoading">
      <el-tabs v-model="activeName">
        <el-tab-pane label="团购基础信息" name="info">
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
  import * as GroupBuyingInfoApi from '@/api/erp/groupbuyinginfo/index'
  import InfoForm from './InfoForm.vue'
  
  defineOptions({ name: 'ErpGroupBuyingInfoAdd' })
  
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
  const formData = ref<GroupBuyingInfoApi.GroupBuyingInfoVO>({
    no: '',
    customerName: '',
    customerPosition: '',
    customerWechat: '',
    platformName: '',
    customerAttribute: '',
    customerCity: '',
    customerDistrict: '',
    userPortrait: '',
    recruitmentCategory: '',
    selectionCriteria: '',
    remark: ''
  })
  
  /** 获得详情 */
  const getDetail = async () => {
    if ('ErpGroupBuyingInfoDetail' === name) {
      isDetail.value = true
    }
    const id = params.id as unknown as number
    
    // 检查是否是复制模式
    const { query } = useRoute()
    const isCopyMode = query.copy === 'true'
    
    if (id && !isCopyMode) {
      formLoading.value = true
      try {
        const res = await GroupBuyingInfoApi.GroupBuyingInfoApi.getGroupBuyingInfo(id)
        formData.value = res
      } finally {
        formLoading.value = false
      }
    } else if (isCopyMode) {
      // 复制模式：从localStorage获取复制的数据
      const copyData = localStorage.getItem('copyGroupBuyingInfoData')
      if (copyData) {
        try {
          const parsedData = JSON.parse(copyData)
          
          // 复制数据并重置某些字段
          formData.value = {
            ...parsedData,
            id: undefined, // 清空ID
            no: '', // 清空编号，系统自动生成
            createTime: undefined,
            updateTime: undefined,
            creator: undefined,
            updater: undefined
          }
          
          // 清除localStorage中的复制数据
          localStorage.removeItem('copyGroupBuyingInfoData')
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
  
      // 提交数据
      const data = cloneDeep(unref(formData.value))
      const id = params.id as unknown as number
  
      if (!id) {
        await GroupBuyingInfoApi.GroupBuyingInfoApi.createGroupBuyingInfo(data)
        message.success(t('common.createSuccess'))
      } else {
        await GroupBuyingInfoApi.GroupBuyingInfoApi.updateGroupBuyingInfo(data)
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
    push({ name: 'ErpGroupBuyingInfo' })
  }
  
  /** 初始化 */
  onMounted(async () => {
    await getDetail()
  })
  </script>