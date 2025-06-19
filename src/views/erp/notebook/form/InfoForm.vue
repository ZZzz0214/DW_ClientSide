<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <!-- 图片上传 -->
      <el-form-item label="图片上传" prop="images">
        <div class="image-upload-container">
          <UploadImgs
            v-model="formData.images"
            :disabled="isDetail"
            :limit="5"
            :is-show-tip="false"
          />
          <div class="upload-tip">
            <Icon icon="ep:info-filled" class="tip-icon" />
            最多可上传5张图片，限制5M，列表显示第一张
          </div>
        </div>
      </el-form-item>

      <!-- 编号 -->

      <!-- 轮播图片 -->
<!--      <el-form-item label="轮播图片" prop="carouselImage">-->
<!--        <UploadImg-->
<!--          v-model="formData.carouselImage"-->
<!--          :disabled="isDetail"-->
<!--          height="80px"-->
<!--        />-->
<!--      </el-form-item>-->

      <!-- 任务名称 -->
      <el-form-item label="任务名称" prop="taskName">
        <el-input
          v-model="formData.taskName"
          placeholder="请输入任务名称"
          class="w-80"
        />
      </el-form-item>

<!--      &lt;!&ndash; 任务状态 &ndash;&gt;-->
<!--      <el-form-item label="任务状态" prop="taskStatus">-->
<!--        <el-select-->
<!--          v-model="formData.taskStatus"-->
<!--          placeholder="请选择任务状态"-->
<!--          class="w-80"-->
<!--        >-->
<!--          <el-option label="未开始" :value="0" />-->
<!--          <el-option label="进行中" :value="1" />-->
<!--          <el-option label="已完成" :value="2" />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
            <!-- 任务状态 -->
            <el-form-item label="任务状态" prop="taskStatus">
        <el-select
          v-model="formData.taskStatus"
          placeholder="请选择任务状态"
          class="w-80"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.ERP_NOTEBOOK_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
   <!-- 任务人员 -->
   <el-form-item label="任务人员" prop="taskPerson">
        <el-select
          v-model="formData.taskPerson"
          placeholder="请选择任务人员"
          class="w-80"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.SYSTEM_USER_LIST)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
<!--      &lt;!&ndash; 任务人员 &ndash;&gt;-->
<!--      <el-form-item label="任务人员" prop="taskPerson">-->
<!--        <el-input-->
<!--          v-model="formData.taskPerson"-->
<!--          placeholder="请输入任务人员"-->
<!--          class="w-80"-->
<!--        />-->
<!--      </el-form-item>-->

      <!-- 备注 -->
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          placeholder="请输入备注"
          class="w-80"
          :autosize="{ minRows: 2, maxRows: 4 }"
        />
      </el-form-item>
    </el-form>
  </template>

  <script lang="ts" setup>
  import { PropType } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import type { NotebookVO } from '@/api/erp/notebook'
  import { getIntDictOptions,getStrDictOptions, DICT_TYPE } from '@/utils/dict'

  defineOptions({ name: 'ErpNotebookInfoForm' })

  const props = defineProps({
    propFormData: {
      type: Object as PropType<NotebookVO>,
      default: () => {}
    },
    isDetail: propTypes.bool.def(false)
  })

  const message = useMessage()
  const formRef = ref()
  const formData = reactive<NotebookVO>({
    images: [], // 图片列表
    taskName: '',// 任务名称
    taskStatus: 0,// 任务状态
    taskPerson: undefined,// 任务人员
    remark: '',// 备注信息
  })

  const rules = reactive({
    no: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
    taskName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
    taskStatus: [{ required: true, message: '任务状态不能为空', trigger: 'blur' }],
    taskPerson: [{ required: true, message: '任务人员不能为空', trigger: 'blur' }]
  })

  /** 将传进来的值赋值给 formData */
  watch(
    () => props.propFormData,
    (data) => {
      if (!data) return
      copyValueToTarget(formData, data)
      
      // 处理图片数据：如果是字符串，转换为数组
      if (data.images && typeof data.images === 'string') {
        formData.images = data.images.split(',').filter(img => img.trim())
      } else if (Array.isArray(data.images)) {
        formData.images = [...data.images]
      } else {
        formData.images = []
      }
    },
    { immediate: true }
  )

  /** 表单校验 */
  const emit = defineEmits(['update:activeName'])
  const validate = async () => {
    if (!formRef) return
    try {
      await unref(formRef)?.validate()
      Object.assign(props.propFormData, formData)
    } catch (e) {
      message.error('【基础信息】不完善，请填写相关信息')
      emit('update:activeName', 'info')
      throw e
    }
  }

  defineExpose({ validate })
  </script>

  <style lang="scss" scoped>
  .image-upload-container {
    .upload-tip {
      display: flex;
      align-items: center;
      margin-top: 8px;
      padding: 8px 12px;
      background-color: #f0f9ff;
      border: 1px solid #e1f5fe;
      border-radius: 4px;
      font-size: 12px;
      color: #0288d1;
      
      .tip-icon {
        margin-right: 4px;
        font-size: 14px;
      }
    }
  }
  </style>
