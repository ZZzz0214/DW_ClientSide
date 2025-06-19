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
      <el-tab-pane label="价格机制" name="price">
        <PriceForm
          ref="priceRef"
          v-model:activeName="activeName"
          :is-detail="isDetail"
          :propFormData="formData"
          @update:formData="handlePriceFormUpdate"
        />
      </el-tab-pane>
      <el-tab-pane label="数据信息" name="data">
        <DataForm
          ref="dataRef"
          v-model:activeName="activeName"
          :is-detail="isDetail"
          :propFormData="formData"
          @update:formData="handleDataFormUpdate"
        />
      </el-tab-pane>
      <el-tab-pane label="发货信息" name="shipping">
        <ShippingForm
          ref="shippingRef"
          v-model:activeName="activeName"
          :is-detail="isDetail"
          :propFormData="formData"
          @update:formData="handleShippingFormUpdate"
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
import * as ErpPrivateBroadcastingApi from '@/api/erp/privateBroadcasting'
import InfoForm from './InfoForm.vue'
import PriceForm from './PriceForm.vue'
import DataForm from './DataForm.vue'
import ShippingForm from './ShippingForm.vue'

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
const dataRef = ref() // 数据信息 Ref
const shippingRef = ref() // 发货信息 Ref

// 表单数据
const formData = ref<ErpPrivateBroadcastingApi.ErpPrivateBroadcastingRespVO>({
  no: '',
  productImage: [],
  brandName: '',
  productName: '',
  productSpec: '',
  productSku: '',
  marketPrice: undefined,
  shelfLife: '',
  productStock: undefined,
  remark: '',
  privateStatus: '', // 货盘状态
  livePrice: undefined,
  productNakedPrice: undefined,
  expressFee: undefined,
  dropshipPrice: undefined,
  publicLink: '',
  coreSellingPoint: '',
  expressCompany: '',
  shippingTime: '',
  shippingArea: ''
})

/** 获得详情 */
const getDetail = async () => {
  if ('ErpPrivateBroadcastingDetail' === name) {
    isDetail.value = true
  }
  const id = params.id as unknown as number
  const copyId = params.copyId as unknown as number

  if (id) {
    formLoading.value = true
    try {
      const res = await ErpPrivateBroadcastingApi.ErpPrivateBroadcastingApi.getPrivateBroadcasting(id)

      // 处理产品图片：将逗号分隔的字符串转换为数组
      if (res.productImage && typeof res.productImage === 'string') {
        res.productImage = res.productImage.split(',').filter(img => img.trim())
      }

      // 确保数字类型字段正确转换
      formData.value = {
        ...res,
        marketPrice: res.marketPrice != null ? Number(res.marketPrice) : undefined,
        productStock: res.productStock != null ? Number(res.productStock) : undefined,
        livePrice: res.livePrice != null ? Number(res.livePrice) : undefined,
        productNakedPrice: res.productNakedPrice != null ? Number(res.productNakedPrice) : undefined,
        expressFee: res.expressFee != null ? Number(res.expressFee) : undefined,
        dropshipPrice: res.dropshipPrice != null ? Number(res.dropshipPrice) : undefined
      }
    } finally {
      formLoading.value = false
    }
  } else if (copyId) {
    // 复制模式
    formLoading.value = true
    try {
      const res = await ErpPrivateBroadcastingApi.ErpPrivateBroadcastingApi.getPrivateBroadcasting(copyId)
      
      // 处理产品图片：将逗号分隔的字符串转换为数组
      if (res.productImage && typeof res.productImage === 'string') {
        res.productImage = res.productImage.split(',').filter(img => img.trim())
      }
      
      // 复制数据，但重置关键字段
      formData.value = {
        ...res,
        id: undefined,
        no: '',
        createTime: undefined,
        updateTime: undefined,
        privateStatus: '未设置', // 重置为未设置状态
        marketPrice: res.marketPrice != null ? Number(res.marketPrice) : undefined,
        productStock: res.productStock != null ? Number(res.productStock) : undefined,
        livePrice: res.livePrice != null ? Number(res.livePrice) : undefined,
        productNakedPrice: res.productNakedPrice != null ? Number(res.productNakedPrice) : undefined,
        expressFee: res.expressFee != null ? Number(res.expressFee) : undefined,
        dropshipPrice: res.dropshipPrice != null ? Number(res.dropshipPrice) : undefined
      }
    } finally {
      formLoading.value = false
    }
  }
}

/** 处理基础信息表单数据更新 */
const handleInfoFormUpdate = (updatedData) => {
  Object.assign(formData.value, updatedData)
}

/** 处理价格机制表单数据更新 */
const handlePriceFormUpdate = (updatedData) => {
  Object.assign(formData.value, updatedData)
}

/** 处理数据信息表单数据更新 */
const handleDataFormUpdate = (updatedData) => {
  Object.assign(formData.value, updatedData)
}

/** 处理发货信息表单数据更新 */
const handleShippingFormUpdate = (updatedData) => {
  Object.assign(formData.value, updatedData)
}

/** 提交按钮 */
const submitForm = async () => {
  formLoading.value = true
  try {
    // 校验各表单
    const infoValid = await unref(infoRef)?.validate()
    const priceValid = await unref(priceRef)?.validate()
    const dataValid = await unref(dataRef)?.validate()
    const shippingValid = await unref(shippingRef)?.validate()

    if (!infoValid || !priceValid || !dataValid || !shippingValid) {
      message.error(t('common.validationFailed')) // 提示校验失败
      return
    }

    // 提交数据
    const data = cloneDeep(unref(formData.value))
    
    // 处理产品图片：如果是数组，转换为逗号分隔的字符串
    if (Array.isArray(data.productImage)) {
      data.productImage = data.productImage.join(',')
    }
    
    const id = params.id as unknown as number

    if (!id) {
      await ErpPrivateBroadcastingApi.ErpPrivateBroadcastingApi.createPrivateBroadcasting(data)
      message.success(t('common.createSuccess'))
    } else {
      await ErpPrivateBroadcastingApi.ErpPrivateBroadcastingApi.updatePrivateBroadcasting(data)
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
