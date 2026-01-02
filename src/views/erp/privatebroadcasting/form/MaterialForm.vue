<template>
  <el-form
    ref="formRef"
    :disabled="isDetail"
    :model="formData"
    label-width="120px"
  >
    <!-- 主图 -->
    <el-form-item label="主图" prop="mainImage">
      <RichTextWithUpload
        v-model="formData.mainImage"
        :disabled="isDetail"
        editor-height="500px"
      />
    </el-form-item>

    <!-- 详情 -->
    <el-form-item label="详情" prop="detailInfo">
      <RichTextWithUpload
        v-model="formData.detailInfo"
        :disabled="isDetail"
        editor-height="500px"
      />
    </el-form-item>

    <!-- SKU图 -->
    <el-form-item label="SKU图" prop="skuImage">
      <RichTextWithUpload
        v-model="formData.skuImage"
        :disabled="isDetail"
        editor-height="500px"
      />
    </el-form-item>

    <!-- 基础笔记 -->
    <el-form-item label="基础笔记" prop="basicNotes">
      <RichTextWithUpload
        v-model="formData.basicNotes"
        :disabled="isDetail"
        editor-height="500px"
      />
    </el-form-item>

    <!-- 升级笔记 -->
    <el-form-item label="升级笔记" prop="upgradeNotes">
      <RichTextWithUpload
        v-model="formData.upgradeNotes"
        :disabled="isDetail"
        editor-height="500px"
      />
    </el-form-item>

    <!-- 社群推广 -->
    <el-form-item label="社群推广" prop="communityPromotion">
      <RichTextWithUpload
        v-model="formData.communityPromotion"
        :disabled="isDetail"
        editor-height="500px"
      />
    </el-form-item>

    <!-- 详细信息 -->
    <el-form-item label="详细信息" prop="detailedInfo">
      <RichTextWithUpload
        v-model="formData.detailedInfo"
        :disabled="isDetail"
        editor-height="500px"
      />
    </el-form-item>

    <!-- 资质 -->
    <el-form-item label="资质" prop="qualification">
      <RichTextWithUpload
        v-model="formData.qualification"
        :disabled="isDetail"
        editor-height="500px"
      />
    </el-form-item>

    <!-- 卖点成分 -->
    <el-form-item label="卖点成分" prop="sellingPointsIngredients">
      <RichTextWithUpload
        v-model="formData.sellingPointsIngredients"
        :disabled="isDetail"
        editor-height="500px"
      />
    </el-form-item>

    <!-- 背书 -->
    <el-form-item label="背书" prop="endorsement">
      <RichTextWithUpload
        v-model="formData.endorsement"
        :disabled="isDetail"
        editor-height="500px"
      />
    </el-form-item>

    <!-- 实拍 -->
    <el-form-item label="实拍" prop="actualPhotos">
      <RichTextWithUpload
        v-model="formData.actualPhotos"
        :disabled="isDetail"
        editor-height="500px"
      />
    </el-form-item>

    <!-- 六面图 -->
    <el-form-item label="六面图" prop="sixSideImages">
      <RichTextWithUpload
        v-model="formData.sixSideImages"
        :disabled="isDetail"
        editor-height="500px"
      />
    </el-form-item>

    <!-- 打包图 -->
    <el-form-item label="打包图" prop="packagingImages">
      <RichTextWithUpload
        v-model="formData.packagingImages"
        :disabled="isDetail"
        editor-height="500px"
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { copyValueToTarget } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import type { ErpPrivateBroadcastingRespVO } from '@/api/erp/privateBroadcasting'
import { RichTextWithUpload } from '@/components/RichTextWithUpload'

defineOptions({ name: 'ErpPrivateBroadcastingMaterialForm' })

const props = defineProps({
  propFormData: {
    type: Object as PropType<ErpPrivateBroadcastingRespVO>,
    default: () => {}
  },
  isDetail: propTypes.bool.def(false)
})

const formRef = ref()
const emit = defineEmits(['update:activeName', 'update:formData'])

// 创建本地表单数据对象
const formData = reactive({
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

// 监听props变化，同步到本地formData
watch(
  () => props.propFormData,
  (data) => {
    if (!data) return
    // 使用copyValueToTarget复制数据，避免直接修改props
    copyValueToTarget(formData, {
      mainImage: data.mainImage || '',
      detailInfo: data.detailInfo || '',
      skuImage: data.skuImage || '',
      basicNotes: data.basicNotes || '',
      upgradeNotes: data.upgradeNotes || '',
      communityPromotion: data.communityPromotion || '',
      detailedInfo: data.detailedInfo || '',
      qualification: data.qualification || '',
      sellingPointsIngredients: data.sellingPointsIngredients || '',
      endorsement: data.endorsement || '',
      actualPhotos: data.actualPhotos || '',
      sixSideImages: data.sixSideImages || '',
      packagingImages: data.packagingImages || ''
    })
  },
  { immediate: true }
)

// 表单校验方法
const validate = async () => {
  const valid = await formRef.value?.validate()
  if (valid) {
    // 通过emit事件将数据传递给父组件，而不是直接修改props
    emit('update:formData', {
      mainImage: formData.mainImage,
      detailInfo: formData.detailInfo,
      skuImage: formData.skuImage,
      basicNotes: formData.basicNotes,
      upgradeNotes: formData.upgradeNotes,
      communityPromotion: formData.communityPromotion,
      detailedInfo: formData.detailedInfo,
      qualification: formData.qualification,
      sellingPointsIngredients: formData.sellingPointsIngredients,
      endorsement: formData.endorsement,
      actualPhotos: formData.actualPhotos,
      sixSideImages: formData.sixSideImages,
      packagingImages: formData.packagingImages
    })
  }
  return valid
}

defineExpose({ validate })
</script>

<style lang="scss" scoped>
:deep(.el-form-item) {
  margin-bottom: 24px;
}
</style>

