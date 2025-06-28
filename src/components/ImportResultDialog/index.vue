<template>
  <Dialog v-model="dialogVisible" title="导入结果" width="800px" :close-on-click-modal="false">
    <div class="import-result-container">
      <!-- 导入成功 -->
      <div v-if="resultData.createNames && resultData.createNames.length > 0" class="result-section success">
        <div class="section-header">
          <Icon icon="ep:success-filled" color="#67c23a" />
          <span class="section-title">导入成功 ({{ resultData.createNames.length }}条)</span>
        </div>
        <div class="section-content">
          <el-tag
            v-for="(name, index) in resultData.createNames"
            :key="'create-' + index"
            type="success"
            class="result-tag"
          >
            {{ name }}
          </el-tag>
        </div>
      </div>

      <!-- 更新成功 -->
      <div v-if="resultData.updateNames && resultData.updateNames.length > 0" class="result-section warning">
        <div class="section-header">
          <Icon icon="ep:warning-filled" color="#e6a23c" />
          <span class="section-title">更新成功 ({{ resultData.updateNames.length }}条)</span>
        </div>
        <div class="section-content">
          <el-tag
            v-for="(name, index) in resultData.updateNames"
            :key="'update-' + index"
            type="warning"
            class="result-tag"
          >
            {{ name }}
          </el-tag>
        </div>
      </div>

      <!-- 导入失败 -->
      <div v-if="resultData.failureNames && Object.keys(resultData.failureNames).length > 0" class="result-section error">
        <div class="section-header">
          <Icon icon="ep:circle-close-filled" color="#f56c6c" />
          <span class="section-title">导入失败 ({{ Object.keys(resultData.failureNames).length }}条)</span>
        </div>
        <div class="section-content">
          <div
            v-for="(errorMsg, name) in resultData.failureNames"
            :key="'failure-' + name"
            class="failure-item"
          >
            <div class="failure-name">{{ name }}</div>
            <div class="failure-message">{{ errorMsg }}</div>
          </div>
        </div>
      </div>

      <!-- 无数据提示 -->
      <div v-if="!hasAnyData" class="no-data">
        <Icon icon="ep:info-filled" color="#909399" />
        <span>暂无导入数据</span>
      </div>
    </div>

    <template #footer>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
      <el-button @click="handleClose">关 闭</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

defineOptions({ name: 'ImportResultDialog' })

interface ImportResultData {
  createNames?: string[]
  updateNames?: string[]
  failureNames?: Record<string, string>
}

interface Props {
  modelValue: boolean
  resultData: ImportResultData
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  resultData: () => ({
    createNames: [],
    updateNames: [],
    failureNames: {}
  })
})

const emit = defineEmits<Emits>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 计算是否有任何数据
const hasAnyData = computed(() => {
  const { createNames, updateNames, failureNames } = props.resultData
  return (createNames && createNames.length > 0) ||
         (updateNames && updateNames.length > 0) ||
         (failureNames && Object.keys(failureNames).length > 0)
})

// 确认按钮
const handleConfirm = () => {
  emit('confirm')
  dialogVisible.value = false
}

// 关闭按钮
const handleClose = () => {
  emit('close')
  dialogVisible.value = false
}
</script>

<style lang="scss" scoped>
.import-result-container {
  max-height: 500px;
  overflow-y: auto;
  padding: 0 10px;

  .result-section {
    margin-bottom: 20px;
    border-radius: 8px;
    padding: 16px;
    border-left: 4px solid;

    &.success {
      background-color: #f0f9ff;
      border-left-color: #67c23a;
    }

    &.warning {
      background-color: #fdf6ec;
      border-left-color: #e6a23c;
    }

    &.error {
      background-color: #fef0f0;
      border-left-color: #f56c6c;
    }

    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      font-weight: 600;
      font-size: 14px;

      .section-title {
        margin-left: 8px;
      }
    }

    .section-content {
      .result-tag {
        margin: 4px 8px 4px 0;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .failure-item {
        margin-bottom: 12px;
        padding: 8px 12px;
        background-color: rgba(255, 255, 255, 0.7);
        border-radius: 4px;
        border-left: 3px solid #f56c6c;

        .failure-name {
          font-weight: 600;
          color: #f56c6c;
          margin-bottom: 4px;
          word-break: break-all;
        }

        .failure-message {
          color: #666;
          font-size: 13px;
          line-height: 1.4;
          word-break: break-all;
        }
      }
    }
  }

  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    color: #909399;
    font-size: 14px;

    span {
      margin-left: 8px;
    }
  }
}

// 滚动条样式
.import-result-container::-webkit-scrollbar {
  width: 6px;
}

.import-result-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.import-result-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.import-result-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 