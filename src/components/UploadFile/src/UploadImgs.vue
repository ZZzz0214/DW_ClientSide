<template>
  <div class="upload-box">
    <!-- 上传区域 -->
    <el-upload
      v-model:file-list="uploadFileList"
      :accept="fileType.join(',')"
      :action="uploadUrl"
      :before-upload="beforeUpload"
      :class="['upload', drag ? 'no-border' : '']"
      :disabled="disabled"
      :drag="drag"
      :http-request="httpRequest"
      :limit="limit"
      :multiple="true"
      :on-error="uploadError"
      :on-exceed="handleExceed"
      :on-success="uploadSuccess"
      :show-file-list="false"
      list-type="picture-card"
    >
      <div class="upload-empty">
        <slot name="empty">
          <Icon icon="ep:plus" />
          <!-- <span>请上传图片</span> -->
        </slot>
      </div>
    </el-upload>
    
    <!-- 可拖拽的图片展示区域 -->
    <div v-if="fileList.length > 0" class="draggable-gallery">
      <VueDraggable
        v-model="fileList"
        :disabled="disabled"
        class="gallery-container"
        item-key="url"
        @end="onDragEnd"
      >
        <template #item="{ element, index }">
          <div class="gallery-item" :class="{ 'is-disabled': disabled }">
            <img :src="element.url" class="gallery-image" />
            <div class="gallery-handle" @click.stop>
              <div class="handle-icon" @click="imagePreview(element.url!)">
                <Icon icon="ep:zoom-in" />
                <span>查看</span>
              </div>
              <div v-if="!disabled" class="handle-icon" @click="handleRemoveByIndex(index)">
                <Icon icon="ep:delete" />
                <span>删除</span>
              </div>
              <div v-if="!disabled" class="handle-icon drag-handle">
                <Icon icon="ep:rank" />
                <span>拖拽</span>
              </div>
            </div>
          </div>
        </template>
      </VueDraggable>
    </div>
    
    <div class="el-upload__tip">
      <slot name="tip"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { UploadFile, UploadProps, UploadUserFile } from 'element-plus'
import { ElNotification } from 'element-plus'
import { createImageViewer } from '@/components/ImageViewer'
import { nextTick } from 'vue'
import VueDraggable from 'vuedraggable'

import { propTypes } from '@/utils/propTypes'
import { useUpload } from '@/components/UploadFile/src/useUpload'

defineOptions({ name: 'UploadImgs' })

const message = useMessage() // 消息弹窗
// 查看图片
const imagePreview = (imgUrl: string) => {
  createImageViewer({
    zIndex: 9999999,
    urlList: [imgUrl]
  })
}

type FileTypes =
  | 'image/apng'
  | 'image/bmp'
  | 'image/gif'
  | 'image/jpeg'
  | 'image/pjpeg'
  | 'image/png'
  | 'image/svg+xml'
  | 'image/tiff'
  | 'image/webp'
  | 'image/x-icon'

const props = defineProps({
  modelValue: propTypes.oneOfType<string | string[]>([String, Array<String>]).isRequired,
  drag: propTypes.bool.def(true), // 是否支持拖拽上传 ==> 非必传（默认为 true）
  disabled: propTypes.bool.def(false), // 是否禁用上传组件 ==> 非必传（默认为 false）
  limit: propTypes.number.def(5), // 最大图片上传数 ==> 非必传（默认为 5张）
  fileSize: propTypes.number.def(20), // 图片大小限制 ==> 非必传（默认为 5M）
  fileType: propTypes.array.def(['image/jpeg', 'image/png', 'image/gif']), // 图片类型限制 ==> 非必传（默认为 ["image/jpeg", "image/png", "image/gif"]）
  height: propTypes.string.def('150px'), // 组件高度 ==> 非必传（默认为 150px）
  width: propTypes.string.def('150px'), // 组件宽度 ==> 非必传（默认为 150px）
  borderradius: propTypes.string.def('8px') // 组件边框圆角 ==> 非必传（默认为 8px）
})

const { uploadUrl, httpRequest } = useUpload()

const fileList = ref<UploadUserFile[]>([])
const uploadFileList = ref<UploadUserFile[]>([])
const uploadNumber = ref<number>(0)
const uploadList = ref<{ name: string; url: string; order: number }[]>([])
const uploadOrder = ref<number>(0)
const currentBatchOrder = ref<number>(0)
/**
 * @description 文件上传之前判断
 * @param rawFile 上传的文件
 * */
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 检查是否超出限制
  if (checkLimit()) {
    ElNotification({
      title: '温馨提示',
      message: `当前最多只能上传 ${props.limit} 张图片，请移除后上传！`,
      type: 'warning'
    })
    return false
  }
  
  const imgSize = rawFile.size / 1024 / 1024 < props.fileSize
  const imgType = props.fileType
  if (!imgType.includes(rawFile.type as FileTypes))
    ElNotification({
      title: '温馨提示',
      message: '上传图片不符合所需的格式！',
      type: 'warning'
    })
  if (!imgSize)
    ElNotification({
      title: '温馨提示',
      message: `上传图片大小不能超过 ${props.fileSize}M！`,
      type: 'warning'
    })
  
  // 如果是新的上传批次，重置批次顺序
  if (uploadNumber.value === 0) {
    currentBatchOrder.value = 0
  }
  
  uploadNumber.value++
  // 为每个文件分配一个上传顺序号（基于用户选择的顺序）
  ;(rawFile as any).__uploadOrder = currentBatchOrder.value++
  return imgType.includes(rawFile.type as FileTypes) && imgSize
}

// 图片上传成功
interface UploadEmits {
  (e: 'update:modelValue', value: string[]): void
}

const emit = defineEmits<UploadEmits>()
const uploadSuccess: UploadProps['onSuccess'] = (res: any, uploadFile: UploadFile): void => {
  message.success('上传成功')
  // 从上传文件列表中删除自身
  const index = uploadFileList.value.findIndex((item) => item.response?.data === res.data)
  if (index !== -1) {
    uploadFileList.value.splice(index, 1)
  }
  
  // 保存上传顺序
  const order = (uploadFile.raw as any)?.__uploadOrder || 0
  console.log('上传成功，文件顺序:', order, '文件名:', uploadFile.name)
  uploadList.value.push({ name: res.data, url: res.data, order })
  
  if (uploadList.value.length == uploadNumber.value) {
    // 按照上传顺序排序
    uploadList.value.sort((a, b) => a.order - b.order)
    console.log('排序后的上传列表:', uploadList.value.map(item => ({ order: item.order, name: item.name })))
    
    // 将新上传的图片按照用户选择的顺序添加到文件列表的末尾
    const newFiles = uploadList.value.map(item => ({ name: item.name, url: item.url }))
    
    // 获取上传前的文件数量
    const existingFilesCount = fileList.value.length
    
    if (uploadNumber.value > 1) {
      // 多张图片一次性上传：将新上传的图片倒序后添加到前面
      const reversedNewFiles = [...newFiles].reverse()
      fileList.value = [...reversedNewFiles, ...fileList.value]
      console.log('多张图片上传，倒序插入到前面:', fileList.value.map(item => item.name))
    } else {
      // 单张图片追加上传：添加到后面
      fileList.value.push(...newFiles)
      console.log('单张图片上传，添加到后面:', fileList.value.map(item => item.name))
    }
    
    uploadList.value = []
    uploadNumber.value = 0
    currentBatchOrder.value = 0
    emitUpdateModelValue()
  }
}

// 标记是否正在内部更新，避免循环更新
const isInternalUpdate = ref(false)

// 监听模型绑定值变动
watch(
  () => props.modelValue,
  (val: string | string[]) => {
    // 如果是内部更新触发的，跳过
    if (isInternalUpdate.value) {
      console.log('内部更新触发，跳过modelValue监听')
      return
    }
    
    // 如果正在上传中，不要重置文件列表，避免覆盖正在上传的图片
    if (uploadNumber.value > 0) {
      console.log('正在上传中，跳过modelValue更新')
      return
    }
    
    if (!val) {
      fileList.value = [] // fix：处理掉缓存，表单重置后上传组件的内容并没有重置
      return
    }

    // 按照数组顺序显示图片，保持原始顺序
    const imageList = Array.isArray(val) ? val : (typeof val === 'string' ? val.split(',').filter(url => url.trim()) : [])
    const newFileList = imageList.map((url) => ({ 
      name: url.substring(url.lastIndexOf('/') + 1), 
      url: url.trim()
    }))
    
    console.log('外部更新文件列表:', newFileList.map(item => item.name))
    fileList.value = newFileList
  },
  { immediate: true, deep: true }
)
// 发送图片链接列表更新
const emitUpdateModelValue = () => {
  let result: string[] = fileList.value
    .filter(file => file.url) // 只包含有效的URL
    .map((file) => file.url!)
  console.log('发送更新事件:', result)
  
  // 标记为内部更新，避免触发watch监听器
  isInternalUpdate.value = true
  emit('update:modelValue', result)
  
  // 下一个tick后重置标记
  nextTick(() => {
    isInternalUpdate.value = false
  })
}
// 删除图片
const handleRemove = (uploadFile: UploadFile) => {
  fileList.value = fileList.value.filter(
    (item) => item.url !== uploadFile.url || item.name !== uploadFile.name
  )
  
  // 标记为内部更新，避免触发watch监听器
  isInternalUpdate.value = true
  emit(
    'update:modelValue',
    fileList.value.map((file) => file.url!)
  )
  
  // 下一个tick后重置标记
  nextTick(() => {
    isInternalUpdate.value = false
  })
}

// 按索引删除图片
const handleRemoveByIndex = (index: number) => {
  fileList.value.splice(index, 1)
  
  // 标记为内部更新，避免触发watch监听器
  isInternalUpdate.value = true
  emit(
    'update:modelValue',
    fileList.value.map((file) => file.url!)
  )
  
  // 下一个tick后重置标记
  nextTick(() => {
    isInternalUpdate.value = false
  })
}

// 拖拽结束处理
const onDragEnd = () => {
  console.log('拖拽结束，新的文件顺序:', fileList.value.map(item => item.name))
  emitUpdateModelValue()
}

// 图片上传错误提示
const uploadError = () => {
  ElNotification({
    title: '温馨提示',
    message: '图片上传失败，请您重新上传！',
    type: 'error'
  })
}

// 文件数超出提示
const handleExceed = () => {
  ElNotification({
    title: '温馨提示',
    message: `当前最多只能上传 ${props.limit} 张图片，请移除后上传！`,
    type: 'warning'
  })
}

// 检查是否超出限制
const checkLimit = () => {
  return fileList.value.length >= props.limit
}
</script>

<style lang="scss" scoped>
.is-error {
  .upload {
    :deep(.el-upload--picture-card),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;

      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}

:deep(.disabled) {
  .el-upload--picture-card,
  .el-upload-dragger {
    cursor: not-allowed;
    background: var(--el-disabled-bg-color) !important;
    border: 1px dashed var(--el-border-color-darker);

    &:hover {
      border-color: var(--el-border-color-darker) !important;
    }
  }
}

.upload-box {
  .no-border {
    :deep(.el-upload--picture-card) {
      border: none !important;
    }
  }

  :deep(.upload) {
    .el-upload-dragger {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 0;
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      border-radius: v-bind(borderradius);

      &:hover {
        border: 1px dashed var(--el-color-primary);
      }
    }

    .el-upload-dragger.is-dragover {
      background-color: var(--el-color-primary-light-9);
      border: 2px dashed var(--el-color-primary) !important;
    }

    .el-upload-list__item,
    .el-upload--picture-card {
      width: v-bind(width);
      height: v-bind(height);
      background-color: transparent;
      border-radius: v-bind(borderradius);
    }

    .upload-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .upload-handle {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      width: 100%;
      height: 100%;
      cursor: pointer;
      background: rgb(0 0 0 / 60%);
      opacity: 0;
      box-sizing: border-box;
      transition: var(--el-transition-duration-fast);
      align-items: center;
      justify-content: center;

      .handle-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 6%;
        color: aliceblue;

        .el-icon {
          margin-bottom: 15%;
          font-size: 140%;
        }

        span {
          font-size: 100%;
        }
      }
    }

    .el-upload-list__item {
      &:hover {
        .upload-handle {
          opacity: 1;
        }
      }
    }

    .upload-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      line-height: 30px;
      color: var(--el-color-info);

      .el-icon {
        font-size: 28px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .el-upload__tip {
    line-height: 15px;
    text-align: center;
  }
  
  .draggable-gallery {
    margin-top: 10px;
    
    .gallery-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .gallery-item {
      position: relative;
      width: v-bind(width);
      height: v-bind(height);
      border-radius: v-bind(borderradius);
      overflow: hidden;
      border: 1px solid var(--el-border-color-light);
      cursor: move;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: var(--el-color-primary);
        
        .gallery-handle {
          opacity: 1;
        }
      }
      
      &.is-disabled {
        cursor: not-allowed;
        
        .gallery-handle {
          .drag-handle {
            display: none;
          }
        }
      }
    }
    
    .gallery-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .gallery-handle {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      width: 100%;
      height: 100%;
      cursor: pointer;
      background: rgb(0 0 0 / 60%);
      opacity: 0;
      box-sizing: border-box;
      transition: var(--el-transition-duration-fast);
      align-items: center;
      justify-content: center;

      .handle-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 4%;
        color: aliceblue;

        .el-icon {
          margin-bottom: 10%;
          font-size: 120%;
        }

        span {
          font-size: 85%;
        }
        
        &.drag-handle {
          cursor: move;
        }
      }
    }
  }
}
</style>
