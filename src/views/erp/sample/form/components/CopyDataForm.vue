<template>
  <div class="copy-data-container">
    <div class="copy-data-header">
      <h3>样品信息复制框</h3>
      <el-button type="primary" @click="copyAllData" :icon="CopyDocument" :loading="copyLoading">
        复制全部数据
      </el-button>
    </div>
    
    <div class="copy-data-content" ref="copyDataRef">
      <div v-if="!formData || Object.keys(formData).length === 0" class="empty-state">
        <el-empty description="暂无样品数据" />
      </div>
      <template v-else>
        <div class="data-item">
          <span class="field-name">编号：</span>
          <span class="field-value">{{ formData.no || '-' }}</span>
        </div>
        <div class="data-item">
          <span class="field-name">物流公司：</span>
          <span class="field-value">{{ formData.logisticsCompany || '-' }}</span>
        </div>
        <div class="data-item">
          <span class="field-name">物流单号：</span>
          <span class="field-value">{{ formData.logisticsNo || '-' }}</span>
        </div>
        <div class="data-item">
          <span class="field-name">收件姓名：</span>
          <span class="field-value">{{ formData.receiverName || '-' }}</span>
        </div>
        <div class="data-item">
          <span class="field-name">联系电话：</span>
          <span class="field-value">{{ formData.contactPhone || '-' }}</span>
        </div>
        <div class="data-item">
          <span class="field-name">详细地址：</span>
          <span class="field-value">{{ formData.address || '-' }}</span>
        </div>
        <div class="data-item">
          <span class="field-name">组品编号：</span>
          <span class="field-value">{{ formData.comboProductId || '-' }}</span>
        </div>
        <div class="data-item">
          <span class="field-name">发货编码：</span>
          <span class="field-value">{{ formData.shippingCode || '-' }}</span>
        </div>
        <div class="data-item">
          <span class="field-name">产品名称：</span>
          <span class="field-value">{{ formData.comboProductName || '-' }}</span>
        </div>
        <div class="data-item">
          <span class="field-name">产品规格：</span>
          <span class="field-value">{{ formData.productSpec || '-' }}</span>
        </div>
        <div class="data-item">
          <span class="field-name">产品数量：</span>
          <span class="field-value">{{ formData.productQuantity || '-' }}</span>
        </div>
        <div class="data-item">
          <span class="field-name">客户名称：</span>
          <span class="field-value">-</span>
        </div>
        <div class="data-item">
          <span class="field-name">样品状态：</span>
          <span class="field-value">{{ getSampleStatusText(formData.sampleStatus) || '-' }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

interface Props {
  formData: any
}

const props = defineProps<Props>()
const copyDataRef = ref()
const copyLoading = ref(false)

// 获取样品状态文本
const getSampleStatusText = (status: number) => {
  const statusOptions = getIntDictOptions(DICT_TYPE.ERP_SAMPLE_STATUS)
  const statusOption = statusOptions.find(option => option.value === status)
  return statusOption ? statusOption.label : status
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
    `编号：${props.formData.no || '-'}`,
    `物流公司：${props.formData.logisticsCompany || '-'}`,
    `物流单号：${props.formData.logisticsNo || '-'}`,
    `收件姓名：${props.formData.receiverName || '-'}`,
    `联系电话：${props.formData.contactPhone || '-'}`,
    `详细地址：${props.formData.address || '-'}`,
    `组品编号：${props.formData.comboProductId || '-'}`,
    `发货编码：${props.formData.shippingCode || '-'}`,
    `产品名称：${props.formData.comboProductName || '-'}`,
    `产品规格：${props.formData.productSpec || '-'}`,
    `产品数量：${props.formData.productQuantity || '-'}`,
    `客户名称：-`,
    `样品状态：${getSampleStatusText(props.formData.sampleStatus) || '-'}`
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