<template>
    <el-form
      ref="formRef"
      :disabled="isDetail"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <!-- 基本信息 -->
<!--      <el-form-item label="样品编号" prop="no">-->
<!--        <el-input-->
<!--          v-model="formData.no"-->
<!--          placeholder="请输入样品编号"-->
<!--          class="w-80"-->
<!--          :disabled="isDetail"-->
<!--        />-->
<!--      </el-form-item>-->

      <!-- 物流信息 -->
      <el-form-item label="物流公司" prop="logisticsCompany">
        <el-input
          v-model="formData.logisticsCompany"
          placeholder="请输入物流公司"
          class="w-80"
        />
      </el-form-item>

      <el-form-item label="物流单号" prop="logisticsNo">
        <el-input
          v-model="formData.logisticsNo"
          placeholder="请输入物流单号"
          class="w-80"
        />
      </el-form-item>

      <!-- 智能解析文本功能 -->
      <div class="smart-parser-section">
        <h4 class="parser-title">
          <Icon icon="ep:magic-stick" />
          智能地址解析
        </h4>
        <p class="parser-desc">
          粘贴包含收件人姓名、手机号、地址的文本信息，系统将自动解析并填入对应字段
        </p>
        <el-form-item>
          <el-input
            v-model="inputText"
            type="textarea"
            placeholder="请输入包含收件姓名、联系电话、详细地址的文字信息，例如：&#10;寄样地址：徐州市泉山区矿大软件园C-2-C三楼&#10;宋双双19951839883 牙膏6支"
            :autosize="{ minRows: 3, maxRows: 6 }"
            class="w-full"
          />
          <div style="margin-top: 8px;">
            <el-button type="primary" @click="parseText" :loading="parsing">
              <Icon icon="ep:magic-stick" />
              智能解析
            </el-button>
            <el-button @click="clearText">
              <Icon icon="ep:refresh" />
              清空
            </el-button>
          </div>
        </el-form-item>

        <!-- 解析结果预览 -->
        <div v-if="parseResult.hasResult" class="parse-result">
          <div class="result-header">解析结果预览：</div>
          <div class="result-grid">
            <div v-if="parseResult.receiverName" class="result-item">
              <label>收件姓名</label>
              <div class="result-value">{{ parseResult.receiverName }}</div>
            </div>
            <div v-if="parseResult.contactPhone" class="result-item">
              <label>联系电话</label>
              <div class="result-value">{{ parseResult.contactPhone }}</div>
            </div>
            <div v-if="parseResult.address" class="result-item">
              <label>详细地址</label>
              <div class="result-value">{{ parseResult.address }}</div>
            </div>
          </div>
          
          <div style="margin-top: 12px;">
            <el-button type="success" size="small" @click="fillForm">
              <Icon icon="ep:check" />
              填入表单
            </el-button>
          </div>
        </div>
      </div>

      <!-- 收件人信息 -->
      <el-form-item label="收件姓名" prop="receiverName">
        <el-input
          v-model="formData.receiverName"
          placeholder="请输入收件人姓名"
          class="w-80"
        />
      </el-form-item>

      <el-form-item label="联系电话" prop="contactPhone">
        <el-input
          v-model="formData.contactPhone"
          placeholder="请输入联系电话"
          class="w-80"
        />
      </el-form-item>

      <el-form-item label="详细地址" prop="address">
        <el-input
          v-model="formData.address"
          type="textarea"
          placeholder="请输入详细地址"
          class="w-80"
          :autosize="{ minRows: 2, maxRows: 4 }"
        />
      </el-form-item>

      <!-- 产品信息 -->
      <el-form-item label="组品编号" prop="comboProductId">
        <el-input
          v-model="formData.comboProductId"
          placeholder="请点击选择组品编号"
          class="w-80"
          readonly
          @click="openComboSelectDialog"
          :disabled="isDetail"
          style="cursor: pointer;"
        />
      </el-form-item>

      <el-form-item label="发货编码" prop="shippingCode">
        <el-input
          v-model="formData.shippingCode"
          placeholder="发货编码"
          class="w-80"
          readonly
        />
      </el-form-item>

      <el-form-item label="产品名称" prop="comboProductName">
        <el-input
          v-model="formData.comboProductName"
          placeholder="产品名称"
          class="w-80"
          readonly
        />
      </el-form-item>

      <el-form-item label="产品规格" prop="productSpec">
        <el-input
          v-model="formData.productSpec"
          placeholder="请输入产品规格"
          class="w-80"
        />
      </el-form-item>

      <el-form-item label="产品数量" prop="productQuantity">
        <el-input-number
          v-model="formData.productQuantity"
          :min="0"
          class="w-80"
        />
      </el-form-item>

      <!-- 客户信息 -->
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="formData.customerName"
          placeholder="请点击选择客户"
          class="w-80"
          readonly
          @click="openCustomerSearchDialog"
          :disabled="isDetail"
          style="cursor: pointer;"
        />
      </el-form-item>

      <!-- 样品状态 -->
<!--      <el-form-item label="样品状态" prop="sampleStatus">-->
<!--        <el-select-->
<!--          v-model="formData.sampleStatus"-->
<!--          placeholder="请选择样品状态"-->
<!--          class="w-80"-->
<!--        >-->
<!--          <el-option label="待发货" :value="1" />-->
<!--          <el-option label="已发货" :value="2" />-->
<!--          <el-option label="已签收" :value="3" />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
            <!-- 样品状态 -->
            <el-form-item label="样品状态" prop="sampleStatus">
        <el-select
          v-model="formData.sampleStatus"
          placeholder="请选择样品状态"
          class="w-80"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.ERP_SAMPLE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <!-- 参考信息 -->
<!--      <el-form-item label="参考" prop="reference">-->
<!--        <el-input-->
<!--          v-model="formData.reference"-->
<!--          type="textarea"-->
<!--          placeholder="请输入参考信息"-->
<!--          class="w-80"-->
<!--          :autosize="{ minRows: 2, maxRows: 4 }"-->
<!--        />-->
<!--      </el-form-item>-->

      <!-- 备注信息 -->
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

    <!-- 组品选择弹窗 -->
    <ComboSelectDialog ref="comboSelectDialogRef" @combo-selected="handleComboSelected" />

    <!-- 客户搜索弹窗 -->
    <CustomerSearchDialog ref="customerSearchDialogRef" @customer-selected="handleCustomerSelected" />
  </template>

  <script lang="ts" setup>
  import { PropType, nextTick, reactive } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import type { SampleVO } from '@/api/erp/sample'
  import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
  import ComboSelectDialog from './ComboSelectDialog.vue'
  import CustomerSearchDialog from './CustomerSearchDialog.vue'

  defineOptions({ name: 'ErpSampleInfoForm' })

  const props = defineProps({
    propFormData: {
      type: Object as PropType<SampleVO>,
      default: () => {}
    },
    isDetail: propTypes.bool.def(false),
    activeName: propTypes.string.def('info')
  })

  const message = useMessage()
  const formRef = ref()
  const comboSelectDialogRef = ref()
  const customerSearchDialogRef = ref()
  const formData = reactive<SampleVO>({
    no: '',
    logisticsCompany: '',
    logisticsNo: '',
    receiverName: '',
    contactPhone: '',
    address: '',
    comboProductId: '',
    shippingCode: '',
    comboProductName: '',
    productSpec: '',
    productQuantity: 1,
    customerName: '',
    sampleStatus: '',
    reference: '',
    remark: ''
  })

  const rules = reactive({
    no: [{ required: true, message: '样品编号不能为空', trigger: 'blur' }],
    //logisticsCompany: [{ required: true, message: '物流公司不能为空', trigger: 'blur' }],
    //logisticsNo: [{ required: true, message: '物流单号不能为空', trigger: 'blur' }],
    receiverName: [{ required: true, message: '收件姓名不能为空', trigger: 'blur' }],
    contactPhone: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
    address: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }],
    comboProductId: [{ required: true, message: '请选择组品编号', trigger: 'change' }],
    //productSpec: [{ required: true, message: '产品规格不能为空', trigger: 'blur' }],
    productQuantity: [{ required: true, message: '产品数量不能为空', trigger: 'blur' }],
    customerName: [{ required: true, message: '请选择客户名称', trigger: 'change' }],
    sampleStatus: [{ required: true, message: '请选择样品状态', trigger: 'change' }]
  })

  /** 将传进来的值赋值给 formData */
  watch(
    () => props.propFormData,
    (data) => {
      if (!data) return
      copyValueToTarget(formData, data)
    },
    { immediate: true }
  )

  /** 打开组品选择弹窗 */
  const openComboSelectDialog = () => {
    if (comboSelectDialogRef.value) {
      comboSelectDialogRef.value.open()
    } else {
      console.error('组品选择弹窗引用为空')
    }
  }

  /** 处理组品选择 */
  const handleComboSelected = (combo: any) => {
    formData.comboProductId = combo.no || combo.id?.toString() || ''
    formData.shippingCode = combo.shippingCode || ''
    formData.comboProductName = combo.name || ''

    // 同步数据到父组件
    Object.assign(props.propFormData, formData)

    // 触发组品编号字段的验证
    nextTick(() => {
      formRef.value?.validateField('comboProductId')
    })
  }

  /** 打开客户搜索弹窗 */
  const openCustomerSearchDialog = () => {
    if (customerSearchDialogRef.value) {
      customerSearchDialogRef.value.open()
    } else {
      console.error('客户搜索弹窗引用为空')
    }
  }

  /** 处理客户选择 */
  const handleCustomerSelected = (customer: any) => {
    formData.customerName = customer.name || ''

    // 同步数据到父组件
    Object.assign(props.propFormData, formData)

    // 触发客户名称字段的验证
    nextTick(() => {
      formRef.value?.validateField('customerName')
    })
  }

  /** 智能解析文本 */
  const inputText = ref('')
  const parsing = ref(false)
  const parseResult = reactive({
    hasResult: false,
    receiverName: '',
    contactPhone: '',
    address: ''
  })

  // 解析文本主函数
  const parseText = async () => {
    if (!inputText.value.trim()) {
      message.warning('请输入要解析的文本')
      return
    }

    parsing.value = true
    try {
      const result = parseWithRegex(inputText.value)
      Object.assign(parseResult, result)

      if (result.hasResult) {
        message.success('解析成功！')
      } else {
        message.warning('未能解析出有效信息，请检查文本格式')
      }
    } catch (error) {
      console.error('文本解析错误:', error)
      message.error('解析失败，请重试')
    } finally {
      parsing.value = false
    }
  }

  // 智能正则解析引擎
  const parseWithRegex = (text: string) => {
    const result = {
      hasResult: false,
      receiverName: '',
      contactPhone: '',
      address: ''
    }

    // 预处理文本
    const cleanText = text
      .replace(/，/g, ',')
      .replace(/。/g, '.')
      .replace(/！/g, '!')
      .replace(/？/g, '?')
      .replace(/；/g, ';')
      .replace(/：/g, ':')
      .replace(/"/g, '"')
      .replace(/"/g, '"')
      .replace(/'/g, "'")
      .replace(/'/g, "'")
      .replace(/（/g, '(')
      .replace(/）/g, ')')
      .replace(/【/g, '[')
      .replace(/】/g, ']')
      .replace(/〈/g, '<')
      .replace(/〉/g, '>')
      .replace(/《/g, '<')
      .replace(/》/g, '>')
      .replace(/\s+/g, ' ')
      .trim()

    const lines = cleanText.split(/[\n\r]+/).map(line => line.trim()).filter(line => line)
    const fullText = cleanText.replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim()

    // 提取电话号码
    result.contactPhone = extractPhone(fullText)
    
    // 提取姓名
    result.receiverName = extractName(fullText, result.contactPhone)
    
    // 提取地址
    result.address = extractAddress(fullText, lines, result.receiverName, result.contactPhone)

    result.hasResult = !!(result.receiverName || result.contactPhone || result.address)
    
    return result
  }

  // 提取电话号码
  const extractPhone = (fullText: string): string => {
    // 明确标识的电话
    const phonePatterns = [
      /(?:电话|手机|联系方式?|tel|phone|联系电话|手机号)[:：\s]*(\+?86[-\s]?)?(1[3-9]\d{9})/gi,
      /(1[3-9]\d{9})/g
    ]
    
    for (const pattern of phonePatterns) {
      const match = fullText.match(pattern)
      if (match) {
        const phoneMatch = match[0].match(/(1[3-9]\d{9})/)
        if (phoneMatch) {
          return phoneMatch[0]
        }
      }
    }
    
    return ''
  }

  // 提取姓名
  const extractName = (fullText: string, phone: string): string => {
    // 从姓名+电话连写中提取
    if (phone) {
      const namePhonePattern = new RegExp(`([\\u4e00-\\u9fa5]{2,4})${phone}`)
      const match = fullText.match(namePhonePattern)
      if (match) {
        return match[1]
      }
    }
    
    // 通用姓名搜索
    const namePattern = /([\u4e00-\u9fa5]{2,4})/g
    const candidates = []
    let match
    
    while ((match = namePattern.exec(fullText)) !== null) {
      candidates.push(match[1])
    }
    
    const validNames = candidates.filter(name => isValidNameCandidate(name))
    if (validNames.length > 0) {
      return validNames[0]
    }
    
    return ''
  }

  // 验证姓名候选
  const isValidNameCandidate = (name: string): boolean => {
    const excludeWords = [
      '省', '市', '区', '县', '镇', '街道', '路', '号', '楼', '层', '室', '单元', '栋', '院',
      '小区', '村', '大厦', '广场', '中心', '花园', '公园', '学校', '医院', '银行',
      '寄样', '地址', '样品', '快递', '物流', '谢谢', '联系', '方便', '软件', '三楼',
      '发货', '牙膏', '洗发', '化妆', '护肤', '商品', '产品', '货物', '到付',
      '拒收', '签收', '请发', '感谢', '备注'
    ]
    
    if (name.length < 2 || name.length > 4) return false
    if (excludeWords.some(word => name.includes(word))) return false
    if (/\d/.test(name)) return false
    
    return true
  }

  // 提取地址
  const extractAddress = (fullText: string, lines: string[], name: string, phone: string): string => {
    // 明确标识的地址行
    const addressPatterns = [
      /^(寄样地址|地址|详细地址|收货地址)[:：\s]*(.+)$/,
      /(?:寄样地址|地址|详细地址|收货地址)[:：\s]*(.+)$/
    ]
    
    for (const line of lines) {
      for (const pattern of addressPatterns) {
        const match = line.match(pattern)
        if (match) {
          return cleanAddress(match[match.length - 1], name, phone)
        }
      }
    }
    
    // 基于地址关键词的智能匹配
    const addressKeywords = ['省', '市', '区', '县', '镇', '街道', '路', '号', '楼', '层', '室', '单元', '栋', '院', '小区', '村', '大厦', '广场', '中心', '花园', '公园', '软件园', '工业园', '开发区']
    
    let bestLine = ''
    let maxScore = 0
    
    for (const line of lines) {
      const score = addressKeywords.filter(keyword => line.includes(keyword)).length
      if (score > maxScore && score >= 2) {
        maxScore = score
        bestLine = line
      }
    }
    
    if (bestLine) {
      return cleanAddress(bestLine, name, phone)
    }
    
    return ''
  }

  // 清理地址
  const cleanAddress = (address: string, name?: string, phone?: string): string => {
    let cleaned = address
    
    // 移除姓名和电话
    if (name) {
      cleaned = cleaned.replace(new RegExp(name, 'g'), '')
    }
    if (phone) {
      cleaned = cleaned.replace(new RegExp(phone, 'g'), '')
    }
    
    // 移除地址前缀和产品描述
    cleaned = cleaned
      .replace(/^(寄样地址|地址|详细地址|收货地址)[:：\s]*/gi, '')
      .replace(/[（(].*?[）)]/g, '')
      .replace(/\s+\d+支\s*$/gi, '')
      .replace(/\s+(牙膏|洗发水|化妆品|护肤品|面膜|精华|乳液|面霜|口红|香水)\s*\d*支?\s*$/gi, '')
      .replace(/\s+(样品|产品|商品|货物|东西|物品).*$/gi, '')
      .replace(/\s+(快递|物流|顺丰|韵达|圆通|中通|申通|邮政|EMS).*$/gi, '')
      .replace(/\s+(发货|请发|谢谢|感谢|备注|到付|拒收|签收).*$/gi, '')
    
    return cleaned.replace(/\s+/g, '').trim()
  }

  // 填入表单
  const fillForm = () => {
    if (parseResult.receiverName) {
      formData.receiverName = parseResult.receiverName
    }
    if (parseResult.contactPhone) {
      formData.contactPhone = parseResult.contactPhone
    }
    if (parseResult.address) {
      formData.address = parseResult.address
    }
    
    // 同步数据到父组件
    Object.assign(props.propFormData, formData)
    
    // 触发字段验证
    nextTick(() => {
      if (parseResult.receiverName) formRef.value?.validateField('receiverName')
      if (parseResult.contactPhone) formRef.value?.validateField('contactPhone')
      if (parseResult.address) formRef.value?.validateField('address')
    })
    
    message.success('已填入表单')
    clearText()
  }

  // 清空文本
  const clearText = () => {
    inputText.value = ''
    Object.assign(parseResult, {
      hasResult: false,
      receiverName: '',
      contactPhone: '',
      address: ''
    })
  }

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

  <style scoped>
  .smart-parser-section {
    border: 1px solid #dbeafe;
    background-color: #eff6ff;
    margin-bottom: 1.5rem;
    padding: 1rem;
    border-radius: 0.375rem;
  }

  .parser-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1e40af;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .parser-desc {
    font-size: 0.75rem;
    color: #2563eb;
    margin-bottom: 0.75rem;
    line-height: 1.25rem;
  }

  .parse-result {
    margin-top: 1rem;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    background-color: #f9fafb;
  }

  .result-header {
    font-size: 0.875rem;
    color: #4b5563;
    margin-bottom: 0.5rem;
  }

  .result-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .result-item label {
    font-size: 0.75rem;
    color: #6b7280;
    display: block;
  }

  .result-value {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
    margin-top: 0.25rem;
  }
  </style>
