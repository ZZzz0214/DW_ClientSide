<template>
    <ContentWrap v-loading="formLoading">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="info">
          <InfoForm
            ref="infoRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
            @update:formData="handleInfoFormUpdate"
          />
        </el-tab-pane>
        <el-tab-pane label="核心机制" name="core">
          <CoreForm
            ref="coreRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
            @update:formData="handleInfoFormUpdate"
          />
        </el-tab-pane>
        <el-tab-pane label="基础机制" name="basic">
          <BasicForm
            ref="basicRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
            @update:formData="handleInfoFormUpdate"
          />
        </el-tab-pane>
        <el-tab-pane label="数据信息" name="data">
          <DataForm
            ref="dataRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
            @update:formData="handleInfoFormUpdate"
          />
        </el-tab-pane>
        <el-tab-pane label="发货信息" name="shipping">
          <ShippingForm
            ref="shippingRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
            @update:formData="handleInfoFormUpdate"
          />
        </el-tab-pane>
        <el-tab-pane label="主图" name="mainImage">
          <MainImageForm
            ref="mainImageRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
            @update:formData="handleInfoFormUpdate"
          />
        </el-tab-pane>
        <el-tab-pane label="详情" name="detailInfo">
          <DetailInfoForm
            ref="detailInfoRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
            @update:formData="handleInfoFormUpdate"
          />
        </el-tab-pane>
        <el-tab-pane label="SKU图" name="skuImage">
          <SkuImageForm
            ref="skuImageRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
            @update:formData="handleInfoFormUpdate"
          />
        </el-tab-pane>
        <el-tab-pane label="基础笔记" name="basicNotes">
          <BasicNotesForm
            ref="basicNotesRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
            @update:formData="handleInfoFormUpdate"
          />
        </el-tab-pane>
        <el-tab-pane label="升级笔记" name="upgradeNotes">
          <UpgradeNotesForm
            ref="upgradeNotesRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
            @update:formData="handleInfoFormUpdate"
          />
        </el-tab-pane>
        <el-tab-pane label="社群推广" name="communityPromotion">
          <CommunityPromotionForm
            ref="communityPromotionRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
            @update:formData="handleInfoFormUpdate"
          />
        </el-tab-pane>
        <el-tab-pane label="详细信息" name="detailedInfo">
          <DetailedInfoForm
            ref="detailedInfoRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
            @update:formData="handleInfoFormUpdate"
          />
        </el-tab-pane>
        <el-tab-pane label="资质" name="qualification">
          <QualificationForm
            ref="qualificationRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
            @update:formData="handleInfoFormUpdate"
          />
        </el-tab-pane>
        <el-tab-pane label="卖点成分" name="sellingPointsIngredients">
          <SellingPointsIngredientsForm
            ref="sellingPointsIngredientsRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
            @update:formData="handleInfoFormUpdate"
          />
        </el-tab-pane>
        <el-tab-pane label="背书" name="endorsement">
          <EndorsementForm
            ref="endorsementRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
            @update:formData="handleInfoFormUpdate"
          />
        </el-tab-pane>
        <el-tab-pane label="实拍" name="actualPhotos">
          <ActualPhotosForm
            ref="actualPhotosRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
            @update:formData="handleInfoFormUpdate"
          />
        </el-tab-pane>
        <el-tab-pane label="六面图" name="sixSideImages">
          <SixSideImagesForm
            ref="sixSideImagesRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
            @update:formData="handleInfoFormUpdate"
          />
        </el-tab-pane>
        <el-tab-pane label="打包图" name="packagingImages">
          <PackagingImagesForm
            ref="packagingImagesRef"
            v-model:activeName="activeName"
            :is-detail="isDetail"
            :propFormData="formData"
            @update:formData="handleInfoFormUpdate"
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
  import * as GroupBuyingApi from '@/api/erp/groupbuying'
  import InfoForm from './InfoForm.vue'
  import CoreForm from './CoreForm.vue'
  import BasicForm from './BasicForm.vue'
  import DataForm from './DataForm.vue'
  import ShippingForm from './ShippingForm.vue'
  import CopyDataForm from './components/CopyDataForm.vue'
  // 资料信息独立组件
  import MainImageForm from './material/MainImageForm.vue'
  import DetailInfoForm from './material/DetailInfoForm.vue'
  import SkuImageForm from './material/SkuImageForm.vue'
  import BasicNotesForm from './material/BasicNotesForm.vue'
  import UpgradeNotesForm from './material/UpgradeNotesForm.vue'
  import CommunityPromotionForm from './material/CommunityPromotionForm.vue'
  import DetailedInfoForm from './material/DetailedInfoForm.vue'
  import QualificationForm from './material/QualificationForm.vue'
  import SellingPointsIngredientsForm from './material/SellingPointsIngredientsForm.vue'
  import EndorsementForm from './material/EndorsementForm.vue'
  import ActualPhotosForm from './material/ActualPhotosForm.vue'
  import SixSideImagesForm from './material/SixSideImagesForm.vue'
  import PackagingImagesForm from './material/PackagingImagesForm.vue'
  
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
  // 资料信息独立Ref
  const mainImageRef = ref() // 主图 Ref
  const detailInfoRef = ref() // 详情 Ref
  const skuImageRef = ref() // SKU图 Ref
  const basicNotesRef = ref() // 基础笔记 Ref
  const upgradeNotesRef = ref() // 升级笔记 Ref
  const communityPromotionRef = ref() // 社群推广 Ref
  const detailedInfoRef = ref() // 详细信息 Ref
  const qualificationRef = ref() // 资质 Ref
  const sellingPointsIngredientsRef = ref() // 卖点成分 Ref
  const endorsementRef = ref() // 背书 Ref
  const actualPhotosRef = ref() // 实拍 Ref
  const sixSideImagesRef = ref() // 六面图 Ref
  const packagingImagesRef = ref() // 打包图 Ref
  
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
    shippingArea: '',
    // 新增字段：资料信息
    mainImage: '',
    detailInfo: '',
    skuImage: '',
    basicNotes: '',
    upgradeNotes: '',
    communityPromotion: '',
    detailedInfo: '',
    qualification: '',
    sellingPointsIngredients: '',
    endorsement: '',
    actualPhotos: '',
    sixSideImages: '',
    packagingImages: ''
  })
  
  /** 获得详情 */
  const getDetail = async () => {
    if ('ErpGroupBuyingDetail' === name) {
      isDetail.value = true
    }
    const id = params.id as unknown as number
    
    // 检查是否是复制模式
    const { query } = useRoute()
    const isCopyMode = query.copy === 'true'
    
    if (id && !isCopyMode) {
      formLoading.value = true
      try {
        const res = await GroupBuyingApi.GroupBuyingApi.getGroupBuying(id)
        
        // 处理产品图片：将逗号分隔的字符串转换为数组
        if (res.productImage && typeof res.productImage === 'string') {
          res.productImage = res.productImage.split(',').filter(img => img.trim())
        }
        
        formData.value = res
      } finally {
        formLoading.value = false
      }
    } else if (isCopyMode) {
      // 复制模式：从localStorage获取复制的数据
      const copyData = localStorage.getItem('copyGroupBuyingData')
      if (copyData) {
        try {
          const parsedData = JSON.parse(copyData)
          
          // 处理产品图片
          if (parsedData.productImage && typeof parsedData.productImage === 'string') {
            parsedData.productImage = parsedData.productImage.split(',').filter(img => img.trim())
          }
          
          // 复制数据并重置某些字段
          formData.value = {
            ...parsedData,
            id: undefined, // 清空ID
            no: '', // 清空编号，系统自动生成
            productName: parsedData.productName ? `${parsedData.productName} - 复制` : '', // 产品名称加复制标识
            status: 1, // 重置状态为默认值
            // shelfLife: undefined, // 保留原保质日期，不重置
            createTime: undefined,
            updateTime: undefined,
            creator: undefined,
            updater: undefined
          }
          
          // 清除localStorage中的复制数据
          localStorage.removeItem('copyGroupBuyingData')
        } catch (e) {
          console.error('解析复制数据失败:', e)
          message.error('复制数据格式错误')
        }
      }
    }
  }
  
  /** 处理基础信息表单数据更新 */
  const handleInfoFormUpdate = (updatedData) => {
    // 将子组件的数据合并到formData中
    Object.assign(formData.value, updatedData)
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
      // 资料信息独立组件校验
      await unref(mainImageRef)?.validate()
      await unref(detailInfoRef)?.validate()
      await unref(skuImageRef)?.validate()
      await unref(basicNotesRef)?.validate()
      await unref(upgradeNotesRef)?.validate()
      await unref(communityPromotionRef)?.validate()
      await unref(detailedInfoRef)?.validate()
      await unref(qualificationRef)?.validate()
      await unref(sellingPointsIngredientsRef)?.validate()
      await unref(endorsementRef)?.validate()
      await unref(actualPhotosRef)?.validate()
      await unref(sixSideImagesRef)?.validate()
      await unref(packagingImagesRef)?.validate()
  
      // 提交数据
      const data = cloneDeep(unref(formData.value))
      
      // 处理产品图片：如果是数组，转换为逗号分隔的字符串
      if (Array.isArray(data.productImage)) {
        data.productImage = data.productImage.join(',')
      }
      
      // 调试：检查资料信息字段
      console.log('==================== 前端提交数据 - 资料信息字段 ====================')
      console.log('mainImage:', data.mainImage)
      console.log('detailInfo:', data.detailInfo)
      console.log('skuImage:', data.skuImage)
      console.log('basicNotes:', data.basicNotes)
      console.log('upgradeNotes:', data.upgradeNotes)
      console.log('communityPromotion:', data.communityPromotion)
      console.log('detailedInfo:', data.detailedInfo)
      console.log('qualification:', data.qualification)
      console.log('sellingPointsIngredients:', data.sellingPointsIngredients)
      console.log('endorsement:', data.endorsement)
      console.log('actualPhotos:', data.actualPhotos)
      console.log('sixSideImages:', data.sixSideImages)
      console.log('packagingImages:', data.packagingImages)
      console.log('====================================================================')
      
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