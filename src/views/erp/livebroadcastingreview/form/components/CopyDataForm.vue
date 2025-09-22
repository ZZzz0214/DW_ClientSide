<template>
  <div class="copy-data-container">
    <div class="copy-data-header">
      <h3>直播复盘信息复制框</h3>
      <el-button type="primary" @click="copyAllData" :icon="CopyDocument" :loading="copyLoading">
        复制全部数据
      </el-button>
    </div>

    <div class="copy-data-content" ref="copyDataRef">
      <div v-if="!formData || Object.keys(formData).length === 0" class="empty-state">
        <el-empty description="暂无复盘数据" />
      </div>
      <template v-else>
        <div class="data-item">
          <span class="field-name">产品名称：</span>
          <span class="field-value">{{ formData.productName || '-' }}</span>
        </div>
        <div class="data-item">
          <span class="field-name">产品规格：</span>
          <span class="field-value">{{ formData.productSpec || '-' }}</span>
        </div>
        <div class="data-item">
          <span class="field-name">产品SKU：</span>
          <span class="field-value">{{ formData.productSku || '-' }}</span>
        </div>
        <div class="data-item">
          <span class="field-name">客户名称：</span>
          <span class="field-value">{{ formData.customerName || '-' }}</span>
        </div>
        <div class="data-item">
          <span class="field-name">直播价格：</span>
          <span class="field-value">{{ formData.livePrice || '-' }}</span>
        </div>
        <div class="data-item">
          <span class="field-name">直播平台：</span>
          <span class="field-value">{{ getPlatformText(formData.livePlatform) || '-' }}</span>
        </div>
        <div class="data-item">
          <span class="field-name">直播佣金：</span>
          <span class="field-value">{{ formData.liveCommission || '-' }}</span>
        </div>
        <div class="data-item">
          <span class="field-name">公开佣金：</span>
          <span class="field-value">{{ formData.publicCommission || '-' }}</span>
        </div>
        <div class="data-item">
          <span class="field-name">货盘状态：</span>
          <span class="field-value">{{ getStatusText(formData.liveStatus) || '-' }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'

interface Props {
  formData: any
}

const props = defineProps<Props>()
const copyDataRef = ref()
const copyLoading = ref(false)

// 获取状态文本
const getStatusText = (status: string) => {
  const statusOptions = getStrDictOptions(DICT_TYPE.ERP_LIVE_STATUS)
  const statusOption = statusOptions.find(option => option.value === status)
  return statusOption ? statusOption.label : status
}

// 获取平台文本
const getPlatformText = (platform: string) => {
  const platformOptions = getStrDictOptions(DICT_TYPE.ERP_PLATFORM)
  const platformOption = platformOptions.find(option => option.value === platform)
  return platformOption ? platformOption.label : platform
}

// 复制全部数据
const copyAllData = async () => {
  copyLoading.value = true
  const dataText = generateCopyText()
  try {
    await navigator.clipboard.writeText(dataText)
    ElMessage.success('数据已复制到剪贴板')
  } catch (err) {
    // 降级方案：使用传统方法复制
    try {
      const textArea = document.createElement('textarea')
      textArea.value = dataText
      textArea.style.position = 'fixed'
      textArea.style.left = '-9999px'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      ElMessage.success('数据已复制到剪贴板')
    } catch (fallbackErr) {
      ElMessage.error('复制失败，请手动复制')
      console.error('Copy failed:', fallbackErr)
    }
  } finally {
    copyLoading.value = false
  }
}

// 生成复制文本
const generateCopyText = () => {
  if (!props.formData) {
    return '暂无数据'
  }

  const lines = [
    `产品名称：${props.formData.productName || '-'}`,
    `产品规格：${props.formData.productSpec || '-'}`,
    `产品SKU：${props.formData.productSku || '-'}`,
    `客户名称：${props.formData.customerName || '-'}`,
    `直播价格：${props.formData.livePrice || '-'}`,
    `直播平台：${getPlatformText(props.formData.livePlatform) || '-'}`,
    `直播佣金：${props.formData.liveCommission || '-'}`,
    `公开佣金：${props.formData.publicCommission || '-'}`,
    `货盘状态：${getStatusText(props.formData.liveStatus) || '-'}`
  ]
  return lines.join('\n')
}
</script>

<style scoped>
.copy-data-container {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.copy-data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #dee2e6;
}

.copy-data-header h3 {
  margin: 0;
  color: #495057;
  font-size: 18px;
  font-weight: 600;
}

.copy-data-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.data-item {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.data-item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.1);
}

.field-name {
  font-weight: 600;
  color: #495057;
  min-width: 100px;
  margin-right: 10px;
  white-space: nowrap;
}

.field-value {
  color: #212529;
  word-break: break-all;
  line-height: 1.5;
  flex: 1;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

@media (max-width: 768px) {
  .copy-data-content {
    grid-template-columns: 1fr;
  }

  .copy-data-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .data-item {
    flex-direction: column;
    gap: 5px;
  }

  .field-name {
    min-width: auto;
  }
}
</style>
