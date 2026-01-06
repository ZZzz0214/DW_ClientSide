<template>
  <div class="rich-text-with-upload">
    <!-- 富文本编辑器 -->
    <div class="editor-container">
      <Editor v-model="richTextValue" :height="editorHeight" />
    </div>

    <!-- 文件上传 -->
    <div v-if="!disabled" class="upload-container">
      <el-divider content-position="left">附件上传（图片50M、视频500M、文档&压缩包5G）</el-divider>
      <UploadFile
        v-model="fileUrlsValue"
        :file-type="fileType"
        :file-size="fileSize"
        :limit="limit"
        :disabled="disabled"
        :before-upload="handleBeforeUpload"
        @file-uploaded="handleFileUploaded"
      />
      <div class="upload-tips">
        <div class="tip-item">
          <Icon icon="ep:picture" class="tip-icon" />
          图片格式：jpg/jpeg/png/gif/bmp/webp/svg，单个文件最大50MB
        </div>
        <div class="tip-item">
          <Icon icon="ep:video-camera" class="tip-icon" />
          视频格式：mp4/avi/mov/wmv/flv/mkv/webm，单个文件最大500MB
        </div>
        <div class="tip-item">
          <Icon icon="ep:folder" class="tip-icon" />
          文档&压缩包：doc/xls/pdf/zip/rar/7z等，单个文件最大5GB
        </div>
      </div>
    </div>

    <!-- 已上传文件列表（编辑状态时显示） -->
    <div v-if="!disabled && filesData && filesData.length > 0" class="file-list-display">
      <el-divider content-position="left">已上传附件</el-divider>
      <div v-for="(file, index) in filesData" :key="index" class="file-item">
        <el-link :href="file.url" :underline="false" download target="_blank" type="primary">
          <Icon icon="ep:document" class="mr-5px" />
          {{ getFileDisplayName(file) }}
        </el-link>
      </div>
    </div>

    <!-- 已上传文件列表（禁用状态时显示） -->
    <div v-if="disabled && filesData && filesData.length > 0" class="disabled-file-list">
      <el-divider content-position="left">附件列表</el-divider>
      <div v-for="(file, index) in filesData" :key="index" class="file-item">
        <el-link :href="file.url" :underline="false" download target="_blank" type="primary">
          <Icon icon="ep:document" class="mr-5px" />
          {{ getFileDisplayName(file) }}
        </el-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch, ref } from 'vue'
import { Editor } from '@/components/Editor'
import { UploadFile } from '@/components/UploadFile'
import { propTypes } from '@/utils/propTypes'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'RichTextWithUpload' })

interface FileInfo {
  url: string
  name: string
  uploadTime: string
}

interface RichTextWithUploadData {
  richText: string
  files?: FileInfo[]
  fileUrls?: string[] // 兼容旧格式
}

const props = defineProps({
  modelValue: propTypes.string.def(''), // JSON 字符串
  editorHeight: propTypes.oneOfType([Number, String]).def('800px'), // 默认高度改为800px
  fileType: propTypes.array.def([
    // 图片类型
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'webp',
    'svg',
    // 视频类型
    'mp4',
    'avi',
    'mov',
    'wmv',
    'flv',
    'mkv',
    'webm',
    // Office文档
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'pdf',
    // 压缩包
    'zip',
    'rar',
    '7z',
    'tar',
    'gz'
  ]),
  fileSize: propTypes.number.def(5120), // 默认5GB（5120MB），会根据文件类型动态调整
  limit: propTypes.number.def(50), // 最多上传50个文件
  disabled: propTypes.bool.def(false) // 是否禁用
})

const emit = defineEmits(['update:modelValue'])

// 临时存储文件元数据（文件名映射）
const fileMetadataMap = ref<Map<string, { name: string; uploadTime: string }>>(new Map())

// 解析 JSON 数据
const parseValue = (value: string): RichTextWithUploadData => {
  if (!value) {
    return { richText: '', files: [] }
  }
  try {
    const parsed = JSON.parse(value)
    
    // 新格式：使用 files 数组
    if (parsed.files && Array.isArray(parsed.files)) {
      return {
        richText: parsed.richText || '',
        files: parsed.files
      }
    }
    
    // 兼容旧格式：fileUrls 数组转换为 files 数组
    if (parsed.fileUrls && Array.isArray(parsed.fileUrls)) {
      return {
        richText: parsed.richText || '',
        files: parsed.fileUrls.map((url: string) => ({
          url,
          name: getFileNameFromUrl(url),
          uploadTime: '' // 旧数据没有上传时间
        }))
      }
    }
    
    return { richText: parsed.richText || '', files: [] }
  } catch (e) {
    console.error('解析 RichTextWithUpload 数据失败:', e)
    return { richText: '', files: [] }
  }
}

// 从 URL 提取文件名
const getFileNameFromUrl = (url: string): string => {
  if (!url) return ''
  const parts = url.split('/')
  return parts[parts.length - 1] || url
}

// 获取文件数据
const filesData = computed(() => {
  const data = parseValue(props.modelValue)
  return data.files || []
})

// 富文本内容
const richTextValue = computed({
  get: () => parseValue(props.modelValue).richText,
  set: (val: string) => {
    const data = parseValue(props.modelValue)
    data.richText = val
    // 使用新格式保存
    emit('update:modelValue', JSON.stringify({ richText: data.richText, files: data.files }))
  }
})

// 文件URL列表（用于 UploadFile 组件）
const fileUrlsValue = computed({
  get: () => {
    return filesData.value.map(f => f.url)
  },
  set: (urls: string[]) => {
    const data = parseValue(props.modelValue)
    
    // 构建新的 files 数组
    const newFiles: FileInfo[] = urls.map(url => {
      // 检查是否是已存在的文件
      const existingFile = data.files?.find(f => f.url === url)
      if (existingFile) {
        return existingFile
      }
      
      // 检查是否有临时元数据
      const metadata = fileMetadataMap.value.get(url)
      if (metadata) {
        return {
          url,
          name: metadata.name,
          uploadTime: metadata.uploadTime
        }
      }
      
      // 默认情况：从 URL 提取文件名
      return {
        url,
        name: getFileNameFromUrl(url),
        uploadTime: formatDateTime(new Date())
      }
    })
    
    // 使用新格式保存
    emit('update:modelValue', JSON.stringify({ richText: data.richText, files: newFiles }))
  }
})

// 获取文件扩展名
const getFileExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.')
  if (lastDotIndex === -1) return ''
  return fileName.substring(lastDotIndex + 1).toLowerCase()
}

// 判断文件类型
const getFileCategory = (fileName: string): 'image' | 'video' | 'document' => {
  const ext = getFileExtension(fileName)
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
  const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm']
  
  if (imageExts.includes(ext)) return 'image'
  if (videoExts.includes(ext)) return 'video'
  return 'document'
}

// 获取文件大小限制（MB）
const getFileSizeLimit = (fileName: string): number => {
  const category = getFileCategory(fileName)
  switch (category) {
    case 'image':
      return 50 // 50MB
    case 'video':
      return 500 // 500MB
    case 'document':
      return 5120 // 5GB = 5120MB
    default:
      return 5120 // 默认5GB
  }
}

// 文件上传前的验证
const handleBeforeUpload = (file: File): boolean => {
  const sizeLimit = getFileSizeLimit(file.name)
  const sizeMB = file.size / 1024 / 1024
  
  if (sizeMB > sizeLimit) {
    const category = getFileCategory(file.name)
    const categoryName = category === 'image' ? '图片' : category === 'video' ? '视频' : '文档/压缩包'
    ElMessage.error(`${categoryName}文件大小不能超过 ${sizeLimit >= 1024 ? (sizeLimit / 1024).toFixed(1) + 'GB' : sizeLimit + 'MB'}！当前文件：${sizeMB.toFixed(2)}MB`)
    return false
  }
  
  return true
}

// 处理文件上传成功事件
const handleFileUploaded = (fileInfo: { url: string; originalName: string }) => {
  // 保存文件元数据到临时映射
  fileMetadataMap.value.set(fileInfo.url, {
    name: fileInfo.originalName,
    uploadTime: formatDateTime(new Date())
  })
}

// 获取文件显示名称：原始文件名_上传时间
const getFileDisplayName = (file: FileInfo): string => {
  if (!file) return ''
  
  // 如果有上传时间，显示 "文件名_上传时间"
  if (file.uploadTime) {
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
    const ext = file.name.substring(file.name.lastIndexOf('.')) || ''
    return `${nameWithoutExt}_${file.uploadTime}${ext}`
  }
  
  // 没有上传时间，只显示文件名
  return file.name
}

// 格式化日期时间：YYYY-MM-DD HH:mm:ss
const formatDateTime = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newVal) => {
    // 当外部值变化时，确保内部状态同步
    // 值已经通过 computed 自动更新
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.rich-text-with-upload {
  .editor-container {
    margin-bottom: 16px;
  }

  .upload-container {
    margin-top: 16px;
    
    .upload-tips {
      margin-top: 12px;
      padding: 12px;
      background-color: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 6px;
      
      .tip-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        font-size: 13px;
        color: #0369a1;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .tip-icon {
          margin-right: 8px;
          font-size: 16px;
          color: #0ea5e9;
        }
      }
    }
  }

  .file-list-display {
    margin-top: 16px;
    
    .file-item {
      padding: 8px 0;
      border-bottom: 1px dashed var(--el-border-color-lighter);

      &:last-child {
        border-bottom: none;
      }
    }
  }

  .disabled-file-list {
    margin-top: 16px;

    .file-item {
      padding: 8px 0;
      border-bottom: 1px dashed var(--el-border-color-lighter);

      &:last-child {
        border-bottom: none;
      }
    }
  }

  .el-divider {
    margin: 16px 0 12px 0;
  }
}
</style>


