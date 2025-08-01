<template>
  <Dialog v-model="dialogVisible" title="直播信息导入" width="400">
    <el-upload
      ref="uploadRef"
      v-model:file-list="fileList"
      :action="importUrl + '?updateSupport=' + updateSupport"
      :auto-upload="false"
      :disabled="formLoading"
      :headers="uploadHeaders"
      :limit="1"
      :on-error="submitFormError"
      :on-exceed="handleExceed"
      :on-success="submitFormSuccess"
      accept=".xlsx, .xls"
      drag
    >
      <Icon icon="ep:upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip text-center">
          <div class="el-upload__tip">
            <el-checkbox v-model="updateSupport" />
            是否更新已经存在的直播信息数据
          </div>
          <span>仅允许导入 xls、xlsx 格式文件。</span>
          <el-link
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            type="primary"
            @click="importTemplate"
          >
            下载模板
          </el-link>
        </div>
      </template>
    </el-upload>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <!-- 导入结果弹窗 -->
  <ImportResultDialog
    v-model="resultDialogVisible"
    :result-data="importResult"
    @confirm="handleResultConfirm"
    @close="handleResultClose"
  />
</template>

<script lang="ts" setup>
import { LiveBroadcastingInfoApi } from '@/api/erp/livebroadcastinginfo'
import { getAccessToken, getTenantId } from '@/utils/auth'
import download from '@/utils/download'

defineOptions({ name: 'ErpLiveBroadcastingInfoImportForm' })

const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中
const uploadRef = ref()
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/erp/live-broadcasting-info/import'
const uploadHeaders = ref() // 上传 Header 头
const fileList = ref([]) // 文件列表
const updateSupport = ref(0) // 是否更新已经存在的直播信息数据

// 导入结果相关
const resultDialogVisible = ref(false)
const importResult = ref({
  createNames: [],
  updateNames: [],
  failureNames: {}
})

/** 打开弹窗 */
const open = () => {
  dialogVisible.value = true
  updateSupport.value = 0
  fileList.value = []
  resetForm()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
/** 文件上传成功 */
const emits = defineEmits(['success'])
const submitFormSuccess = (response: any) => {
  if (response.code !== 0) {
    message.error(response.msg)
    formLoading.value = false
    return
  }

  // 设置导入结果数据
  importResult.value = response.data

  // 显示导入结果弹窗
  resultDialogVisible.value = true

  formLoading.value = false
  dialogVisible.value = false
}

/** 处理导入结果确认 */
const handleResultConfirm = () => {
  // 发送操作成功的事件
  emits('success')
}

/** 处理导入结果关闭 */
const handleResultClose = () => {
  // 发送操作成功的事件
  emits('success')
}

/** 提交表单 */
const submitForm = async () => {
  if (fileList.value.length == 0) {
    message.error('请上传文件')
    return
  }
  // 提交请求
  uploadHeaders.value = {
    Authorization: 'Bearer ' + getAccessToken(),
    'tenant-id': getTenantId()
  }
  formLoading.value = true
  uploadRef.value!.submit()
}

// /** 文件上传成功 */
// const emits = defineEmits(['success'])
// const submitFormSuccess = (response: any) => {
//   if (response.code !== 0) {
//     message.error(response.msg)
//     formLoading.value = false
//     return
//   }
//   const data = response.data
//   let text = '导入成功数量：' + data.createNames.length + ';'
//   for (let name of data.createNames) {
//     text += '< ' + name + ' >'
//   }
//   text += '更新成功数量：' + data.updateNames.length + ';'
//   for (const name of data.updateNames) {
//     text += '< ' + name + ' >'
//   }
//   text += '更新失败数量：' + Object.keys(data.failureNames).length + ';'
//   for (const name in data.failureNames) {
//     text += '< ' + name + ': ' + data.failureNames[name] + ' >'
//   }
//   message.alert(text)
//   formLoading.value = false
//   dialogVisible.value = false
//   // 发送操作成功的事件
//   emits('success')
// }

/** 上传错误提示 */
const submitFormError = (): void => {
  message.error('上传失败，请您重新上传！')
  formLoading.value = false
}

/** 重置表单 */
const resetForm = async (): Promise<void> => {
  // 重置上传状态和文件
  formLoading.value = false
  await nextTick()
  uploadRef.value?.clearFiles()
}

/** 文件数超出提示 */
const handleExceed = (): void => {
  message.error('最多只能上传一个文件！')
}

/** 下载模板操作 */
const importTemplate = async () => {
  const res = await LiveBroadcastingInfoApi.importLiveBroadcastingInfoTemplate()
  download.excel(res, '直播信息导入模版.xlsx')
}
</script>
