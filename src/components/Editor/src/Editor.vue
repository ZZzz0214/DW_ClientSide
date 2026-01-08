<script lang="ts" setup>
import { PropType } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { i18nChangeLanguage, IDomEditor, IEditorConfig } from '@wangeditor/editor'
import { propTypes } from '@/utils/propTypes'
import { isNumber } from '@/utils/is'
import { ElMessage } from 'element-plus'
import { useLocaleStore } from '@/store/modules/locale'
import { getRefreshToken, getTenantId } from '@/utils/auth'
import { getUploadUrl } from '@/components/UploadFile/src/useUpload'

defineOptions({ name: 'Editor' })

type InsertFnType = (url: string, alt: string, href: string) => void

const localeStore = useLocaleStore()

const currentLocale = computed(() => localeStore.getCurrentLocale)

i18nChangeLanguage(unref(currentLocale).lang)

const props = defineProps({
  editorId: propTypes.string.def('wangeEditor-1'),
  height: propTypes.oneOfType([Number, String]).def('500px'),
  editorConfig: {
    type: Object as PropType<Partial<IEditorConfig>>,
    default: () => undefined
  },
  readonly: propTypes.bool.def(false),
  modelValue: propTypes.string.def('')
})

const emit = defineEmits(['change', 'update:modelValue'])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>()

const valueHtml = ref('')

// 保存滚动位置
const savedScrollTop = ref(0)
const isInsertingImage = ref(false)

watch(
  () => props.modelValue,
  (val: string) => {
    if (val === unref(valueHtml)) return
    valueHtml.value = val
  },
  {
    immediate: true
  }
)

// 监听
watch(
  () => valueHtml.value,
  (val: string) => {
    emit('update:modelValue', val)
  }
)

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
  
  // 保存滚动位置（用于图片/视频上传）
  let lastScrollTop = 0
  const container = editor.getEditableContainer()
  
  if (container) {
    // 监听滚动事件，保存滚动位置
    container.addEventListener('scroll', () => {
      lastScrollTop = container.scrollTop
    }, { passive: true })
    
    // 恢复滚动位置（仅在插入图片/视频时）
    const restoreScrollPosition = () => {
      if (isInsertingImage.value && lastScrollTop > 0) {
        container.scrollTop = lastScrollTop
      }
    }
    
    // 监听内容变化（处理图片/视频上传）
    const observer = new MutationObserver(() => {
      if (isInsertingImage.value) {
        restoreScrollPosition()
      }
    })
    
    observer.observe(container, {
      childList: true,
      subtree: true
    })
  }
}

// 编辑器配置
const editorConfig = computed((): IEditorConfig => {
  return Object.assign(
    {
      placeholder: '请输入内容...',
      readOnly: props.readonly,
      customAlert: (s: string, t: string) => {
        switch (t) {
          case 'success':
            ElMessage.success(s)
            break
          case 'info':
            ElMessage.info(s)
            break
          case 'warning':
            ElMessage.warning(s)
            break
          case 'error':
            ElMessage.error(s)
            break
          default:
            ElMessage.info(s)
            break
        }
      },
      autoFocus: false,
      // 移除 scroll: false，改为通过事件监听控制滚动行为
      MENU_CONF: {
        ['uploadImage']: {
          server: getUploadUrl(),
          // 单个文件的最大体积限制，修改为 50M
          maxFileSize: 50 * 1024 * 1024,
          // 最多可上传几个文件，默认为 100
          maxNumberOfFiles: 50,
          // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
          allowedFileTypes: ['image/*'],

          // 自定义增加 http  header
          headers: {
            Accept: '*',
            Authorization: 'Bearer ' + getRefreshToken(), // 使用 getRefreshToken() 方法，而不使用 getAccessToken() 方法的原因：Editor 无法方便的刷新访问令牌
            'tenant-id': getTenantId()
          },

          // 超时时间，默认为 10 秒
          timeout: 15 * 1000, // 15 秒

          // form-data fieldName，后端接口参数名称，默认值wangeditor-uploaded-image
          fieldName: 'file',

          // 上传之前触发
          onBeforeUpload(file: File) {
            // console.log(file)
            return file
          },
          // 上传进度的回调函数
          onProgress(progress: number) {
            // progress 是 0-100 的数字
            console.log('progress', progress)
          },
          onSuccess(file: File, res: any) {
            console.log('onSuccess', file, res)
          },
          onFailed(file: File, res: any) {
            alert(res.message)
            console.log('onFailed', file, res)
          },
          onError(file: File, err: any, res: any) {
            alert(err.message)
            console.error('onError', file, err, res)
          },
          // 自定义插入图片
          customInsert(res: any, insertFn: InsertFnType) {
            // 标记正在插入图片
            isInsertingImage.value = true
            
            // 获取编辑器容器
            const editor = unref(editorRef)
            const container = editor?.getEditableContainer()
            
            // 保存当前滚动位置
            if (container) {
              savedScrollTop.value = container.scrollTop
            }
            
            // 插入图片
            insertFn(res.data, 'image', res.data)
            
            // 在下一帧恢复滚动位置
            nextTick(() => {
              setTimeout(() => {
                if (container && isInsertingImage.value) {
                  // 恢复滚动位置到图片插入位置附近
                  container.scrollTop = savedScrollTop.value
                  
                  // 聚焦编辑器，确保光标在正确位置
                  editor?.focus()
                }
                isInsertingImage.value = false
              }, 100)
            })
          }
        },
        ['uploadVideo']: {
          server: getUploadUrl(),
          // 单个文件的最大体积限制，修改为 500M
          maxFileSize: 500 * 1024 * 1024,
          // 最多可上传几个文件，默认为 100
          maxNumberOfFiles: 20,
          // 选择文件时的类型限制，默认为 ['video/*'] 。如不想限制，则设置为 []
          allowedFileTypes: ['video/*'],

          // 自定义增加 http  header
          headers: {
            Accept: '*',
            Authorization: 'Bearer ' + getRefreshToken(), // 使用 getRefreshToken() 方法，而不使用 getAccessToken() 方法的原因：Editor 无法方便的刷新访问令牌
            'tenant-id': getTenantId()
          },

          // 超时时间，视频较大需要更长时间
          timeout: 300 * 1000, // 300 秒（5分钟）

          // form-data fieldName，后端接口参数名称，默认值wangeditor-uploaded-image
          fieldName: 'file',

          // 上传之前触发
          onBeforeUpload(file: File) {
            // console.log(file)
            return file
          },
          // 上传进度的回调函数
          onProgress(progress: number) {
            // progress 是 0-100 的数字
            console.log('progress', progress)
          },
          onSuccess(file: File, res: any) {
            console.log('onSuccess', file, res)
          },
          onFailed(file: File, res: any) {
            alert(res.message)
            console.log('onFailed', file, res)
          },
          onError(file: File, err: any, res: any) {
            alert(err.message)
            console.error('onError', file, err, res)
          },
          // 自定义插入视频
          customInsert(res: any, insertFn: InsertFnType) {
            // 标记正在插入视频
            isInsertingImage.value = true
            
            // 获取编辑器容器
            const editor = unref(editorRef)
            const container = editor?.getEditableContainer()
            
            // 保存当前滚动位置
            if (container) {
              savedScrollTop.value = container.scrollTop
            }
            
            // 插入视频
            insertFn(res.data, 'mp4', res.data)
            
            // 在下一帧恢复滚动位置
            nextTick(() => {
              setTimeout(() => {
                if (container && isInsertingImage.value) {
                  // 恢复滚动位置到视频插入位置附近
                  container.scrollTop = savedScrollTop.value
                  
                  // 聚焦编辑器，确保光标在正确位置
                  editor?.focus()
                }
                isInsertingImage.value = false
              }, 100)
            })
          }
        }
      },
      uploadImgShowBase64: true
    },
    props.editorConfig || {}
  )
})

const editorStyle = computed(() => {
  return {
    height: isNumber(props.height) ? `${props.height}px` : props.height
  }
})

// 回调函数
const handleChange = (editor: IDomEditor) => {
  emit('change', editor)
}

// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
  const editor = unref(editorRef.value)

  // 销毁，并移除 editor
  editor?.destroy()
})

const getEditorRef = async (): Promise<IDomEditor> => {
  await nextTick()
  return unref(editorRef.value) as IDomEditor
}

defineExpose({
  getEditorRef
})
</script>

<template>
  <div class="border-1 border-solid border-[var(--tags-view-border-color)] z-10">
    <!-- 工具栏 -->
    <Toolbar
      :editor="editorRef"
      :editorId="editorId"
      class="border-0 b-b-1 border-solid border-[var(--tags-view-border-color)]"
    />
    <!-- 编辑器 -->
    <Editor
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :editorId="editorId"
      :style="editorStyle"
      @on-change="handleChange"
      @on-created="handleCreated"
    />
  </div>
</template>

<style src="@wangeditor/editor/dist/css/style.css"></style>

<style scoped>
/* 富文本编辑器中的图片换行显示样式 */
:deep(.w-e-text-container) {
  /* 图片自动换行 */
  img {
    display: block !important;
    max-width: 100% !important;
    height: auto !important;
    margin: 10px 0 !important;
  }
  
  /* 图片容器换行 */
  p img,
  div img {
    display: block !important;
    margin: 10px auto !important;
  }
  
  /* 多个图片自动换行 */
  p,
  div {
    img + img {
      margin-top: 10px !important;
    }
  }
}

/* 只读模式下的图片样式 */
:deep(.w-e-scroll) {
  img {
    display: block !important;
    max-width: 100% !important;
    height: auto !important;
    margin: 10px 0 !important;
  }
}
</style>
