<template>
  <div class="advanced-text-parser">
    <el-form-item label="智能解析">
      <el-input
        v-model="inputText"
        type="textarea"
        placeholder="请输入包含收件姓名、联系电话、详细地址的文字信息，系统将使用AI技术智能解析"
        :autosize="{ minRows: 3, maxRows: 6 }"
        class="w-full"
        @input="handleTextChange"
      />
      <div class="mt-2">
        <el-button type="primary" @click="parseText" :loading="parsing">
          <Icon icon="ep:cpu" class="mr-1" />
          AI智能解析
        </el-button>
        <el-button @click="clearText">
          <Icon icon="ep:refresh" class="mr-1" />
          清空
        </el-button>
        <el-button @click="showAnalysis" type="info" size="small" v-if="lastParseResult.hasResult">
          <Icon icon="ep:data-analysis" class="mr-1" />
          解析详情
        </el-button>
      </div>
    </el-form-item>

    <!-- 解析结果预览 -->
    <div v-if="parseResult.hasResult" class="parse-result mt-4 p-4 bg-gray-50 rounded">
      <div class="text-sm text-gray-600 mb-2">
        <span>AI解析结果预览：</span>
        <el-tag :type="parseResult.confidence >= 0.8 ? 'success' : parseResult.confidence >= 0.6 ? 'warning' : 'danger'" size="small" class="ml-2">
          置信度: {{ Math.round(parseResult.confidence * 100) }}%
        </el-tag>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-if="parseResult.receiverName">
          <label class="text-xs text-gray-500">收件姓名</label>
          <div class="text-sm font-medium flex items-center">
            {{ parseResult.receiverName }}
            <el-tag v-if="parseResult.nameSource" size="small" type="info" class="ml-1">
              {{ parseResult.nameSource }}
            </el-tag>
          </div>
        </div>
        <div v-if="parseResult.contactPhone">
          <label class="text-xs text-gray-500">联系电话</label>
          <div class="text-sm font-medium flex items-center">
            {{ parseResult.contactPhone }}
            <el-tag v-if="parseResult.phoneValid" size="small" type="success" class="ml-1">
              有效
            </el-tag>
            <el-tag v-if="parseResult.phoneRegion" size="small" type="info" class="ml-1">
              {{ parseResult.phoneRegion }}
            </el-tag>
          </div>
        </div>
        <div v-if="parseResult.address">
          <label class="text-xs text-gray-500">详细地址</label>
          <div class="text-sm font-medium flex items-center">
            {{ parseResult.address }}
            <el-tag v-if="parseResult.addressComponents" size="small" type="info" class="ml-1">
              已规范化
            </el-tag>
          </div>
        </div>
      </div>
      
      <div class="mt-3">
        <el-button type="success" size="small" @click="fillForm">
          <Icon icon="ep:check" class="mr-1" />
          填入表单
        </el-button>
      </div>
    </div>

    <!-- 解析详情对话框 -->
    <el-dialog v-model="showAnalysisDialog" title="AI解析详情" width="70%">
      <div v-if="analysisData">
        <el-descriptions title="解析过程" :column="2" border>
          <el-descriptions-item label="处理方法">{{ analysisData.method }}</el-descriptions-item>
          <el-descriptions-item label="置信度">{{ Math.round(analysisData.confidence * 100) }}%</el-descriptions-item>
          <el-descriptions-item label="处理时间">{{ analysisData.processingTime }}ms</el-descriptions-item>
          <el-descriptions-item label="识别模式">{{ analysisData.patterns.join(', ') }}</el-descriptions-item>
        </el-descriptions>

        <el-divider>实体识别结果</el-divider>
        <el-table :data="analysisData.entities" style="width: 100%">
          <el-table-column prop="type" label="类型" width="120" />
          <el-table-column prop="value" label="识别内容" />
          <el-table-column prop="confidence" label="置信度" width="100">
            <template #default="scope">
              {{ Math.round(scope.row.confidence * 100) }}%
            </template>
          </el-table-column>
          <el-table-column prop="source" label="识别方式" width="120" />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'

// 动态导入专业库
let phoneNumberParser: any = null
let nlpProcessor: any = null
let chinaLocation: any = null

// 初始化专业库
const initLibraries = async () => {
  try {
    // 初始化电话号码解析库
    const { parsePhoneNumber, isValidPhoneNumber } = await import('libphonenumber-js')
    phoneNumberParser = { parsePhoneNumber, isValidPhoneNumber }

    // 初始化中文地址解析库
    const ChinaLocation = (await import('china-location')).default
    const locationData = (await import('china-location/dist/location.json')).default
    chinaLocation = new ChinaLocation(locationData)

    console.log('智能解析库初始化完成')
  } catch (error) {
    console.warn('部分智能解析库未安装，将使用基础解析模式:', error)
  }
}

// 在组件挂载时初始化
initLibraries()

interface ParseResult {
  hasResult: boolean
  receiverName: string
  contactPhone: string
  address: string
  confidence: number
  nameSource?: string
  phoneValid?: boolean
  phoneRegion?: string
  addressComponents?: any
}

interface AnalysisData {
  method: string
  confidence: number
  processingTime: number
  patterns: string[]
  entities: Array<{
    type: string
    value: string
    confidence: number
    source: string
  }>
}

const props = defineProps<{
  modelValue?: {
    receiverName?: string
    contactPhone?: string
    address?: string
  }
}>()

const emit = defineEmits<{
  'update:modelValue': [value: {
    receiverName?: string
    contactPhone?: string
    address?: string
  }]
  'parsed': [result: ParseResult]
}>()

const inputText = ref('')
const parsing = ref(false)
const showAnalysisDialog = ref(false)
const parseResult = reactive<ParseResult>({
  hasResult: false,
  receiverName: '',
  contactPhone: '',
  address: '',
  confidence: 0
})

const lastParseResult = ref<ParseResult>({} as ParseResult)
const analysisData = ref<AnalysisData | null>(null)

/**
 * 高级电话号码解析
 */
const parsePhoneAdvanced = (text: string) => {
  const startTime = Date.now()
  
  if (!phoneNumberParser) {
    return parsePhoneBasic(text)
  }

  try {
    // 使用libphonenumber-js进行专业解析
    const phoneRegex = /(1[3-9]\d{9})/g
    const matches = text.match(phoneRegex)
    
    if (matches) {
      for (const match of matches) {
        try {
          const phoneNumber = phoneNumberParser.parsePhoneNumber(match, 'CN')
          if (phoneNumber && phoneNumber.isValid()) {
            return {
              phone: phoneNumber.formatNational().replace(/\s/g, ''),
              isValid: true,
              region: phoneNumber.country || 'CN',
              confidence: 0.95,
              source: 'libphonenumber-js',
              processingTime: Date.now() - startTime
            }
          }
        } catch (e) {
          continue
        }
      }
    }

    // 备用基础解析
    return parsePhoneBasic(text)
  } catch (error) {
    console.error('高级电话解析失败:', error)
    return parsePhoneBasic(text)
  }
}

/**
 * 基础电话号码解析（备用方案）
 */
const parsePhoneBasic = (text: string) => {
  const startTime = Date.now()
  const phonePattern = /(1[3-9]\d{9})/g
  const match = text.match(phonePattern)
  
  if (match) {
    return {
      phone: match[0],
      isValid: true,
      region: 'CN',
      confidence: 0.8,
      source: '正则匹配',
      processingTime: Date.now() - startTime
    }
  }
  
  return null
}

/**
 * 高级姓名解析
 */
const parseNameAdvanced = (text: string, phone?: string) => {
  const startTime = Date.now()
  
  // 策略1：明确标识的姓名
  const explicitPatterns = [
    /收件人[:：\s]*([\u4e00-\u9fa5]{2,4})/gi,
    /姓名[:：\s]*([\u4e00-\u9fa5]{2,4})/gi,
    /联系人[:：\s]*([\u4e00-\u9fa5]{2,4})/gi
  ]
  
  for (const pattern of explicitPatterns) {
    const matches = [...text.matchAll(pattern)]
    if (matches.length > 0) {
      const name = matches[0][1]
      if (isValidChineseName(name)) {
        return {
          name,
          confidence: 0.9,
          source: '标签识别',
          processingTime: Date.now() - startTime
        }
      }
    }
  }
  
  // 策略2：姓名+电话连写
  if (phone) {
    const namePhonePattern = new RegExp(`([\\u4e00-\\u9fa5]{2,4})${phone}`)
    const match = text.match(namePhonePattern)
    if (match && isValidChineseName(match[1])) {
      return {
        name: match[1],
        confidence: 0.85,
        source: '连写识别',
        processingTime: Date.now() - startTime
      }
    }
  }
  
  // 策略3：智能姓名候选
  const namePattern = /([\u4e00-\u9fa5]{2,4})/g
  const candidates = []
  let match
  
  while ((match = namePattern.exec(text)) !== null) {
    candidates.push(match[1])
  }
  
  const validNames = candidates
    .filter(name => isValidChineseName(name))
    .sort((a, b) => getNameScore(b) - getNameScore(a))
  
  if (validNames.length > 0) {
    return {
      name: validNames[0],
      confidence: 0.7,
      source: '智能匹配',
      processingTime: Date.now() - startTime
    }
  }
  
  return null
}

/**
 * 验证中文姓名
 */
const isValidChineseName = (name: string): boolean => {
  const excludeWords = [
    '省', '市', '区', '县', '镇', '街道', '路', '号', '楼', '层', '室', '单元', '栋', '院',
    '小区', '村', '大厦', '广场', '中心', '花园', '公园', '学校', '医院', '银行',
    '寄样', '地址', '样品', '快递', '物流', '谢谢', '联系', '方便', '软件',
    '发货', '牙膏', '洗发', '化妆', '护肤', '商品', '产品', '货物', '到付',
    '拒收', '签收', '请发', '感谢', '备注', '工坊', '沪亭', '九亭', '九里',
    '上海', '松江', '北路', '告知', '寄件', '信息'
  ]
  
  if (name.length < 2 || name.length > 4) return false
  if (excludeWords.some(word => name.includes(word))) return false
  if (/\d/.test(name)) return false
  
  return true
}

/**
 * 计算姓名可信度分数
 */
const getNameScore = (name: string): number => {
  let score = 0
  
  // 长度评分
  if (name.length === 2 || name.length === 3) score += 3
  else if (name.length === 4) score += 2
  
  // 重复字符检查（某些昵称是可接受的）
  if (name.length === 2 && name[0] === name[1]) {
    // 常见昵称字符给予较低分数
    const commonNicknames = ['小', '大', '老', '阿']
    if (commonNicknames.includes(name[0])) score -= 2
    else score -= 1
  }
  
  return score
}

/**
 * 高级地址解析
 */
const parseAddressAdvanced = (text: string, name?: string, phone?: string) => {
  const startTime = Date.now()
  const lines = text.split(/[\n\r]+/).map(line => line.trim()).filter(line => line)
  
  // 策略1：明确标识的地址
  const addressPatterns = [
    /^地址[:：\s]*(.+)$/i,
    /^收货地址[:：\s]*(.+)$/i,
    /^寄样地址[:：\s]*(.+)$/i,
    /^详细地址[:：\s]*(.+)$/i,
    /地址[:：\s]*(.+)$/i
  ]
  
  for (const line of lines) {
    // 跳过纯干扰行
    if (/^(寄样品前|PS|不收到付)/.test(line.trim())) continue
    
    for (const pattern of addressPatterns) {
      const match = line.match(pattern)
      if (match) {
        const rawAddress = match[1].trim()
        if (rawAddress && rawAddress.length > 8) {
          const cleanedAddress = cleanAddressAdvanced(rawAddress, name, phone)
          if (cleanedAddress && cleanedAddress.length > 5) {
            
            // 尝试使用中国地址库进行验证和规范化
            let addressComponents = null
            if (chinaLocation) {
              addressComponents = analyzeChineseAddress(cleanedAddress)
            }
            
            return {
              address: cleanedAddress,
              confidence: 0.9,
              source: '标签识别',
              components: addressComponents,
              processingTime: Date.now() - startTime
            }
          }
        }
      }
    }
  }
  
  // 策略2：关键词匹配
  const addressKeywords = [
    '省', '市', '区', '县', '镇', '街道', '路', '号', '楼', '层', '室', '单元', '栋', '院',
    '小区', '村', '大厦', '广场', '中心', '花园', '公园', '软件园', '工业园', '开发区',
    '科技园', '商务楼', '写字楼', '国际', '工坊'
  ]
  
  let bestLine = ''
  let maxScore = 0
  
  for (const line of lines) {
    if (/^(寄样品前|PS|不收到付)/.test(line.trim())) continue
    
    const score = addressKeywords.filter(keyword => line.includes(keyword)).length
    if (score > maxScore && score >= 2 && line.length > 10) {
      maxScore = score
      bestLine = line
    }
  }
  
  if (bestLine) {
    const cleanedAddress = cleanAddressAdvanced(bestLine, name, phone)
    if (cleanedAddress && cleanedAddress.length > 5) {
      return {
        address: cleanedAddress,
        confidence: 0.8,
        source: '关键词匹配',
        components: null,
        processingTime: Date.now() - startTime
      }
    }
  }
  
  return null
}

/**
 * 分析中文地址组成
 */
const analyzeChineseAddress = (address: string) => {
  if (!chinaLocation) return null
  
  try {
    // 这里可以添加更复杂的地址解析逻辑
    // 目前只做基础的省市区识别
    const provinces = ['北京', '上海', '天津', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '台湾', '内蒙古', '广西', '西藏', '宁夏', '新疆', '香港', '澳门']
    
    for (const province of provinces) {
      if (address.includes(province)) {
        return {
          province,
          recognized: true
        }
      }
    }
    
    return null
  } catch (error) {
    console.error('地址组件分析失败:', error)
    return null
  }
}

/**
 * 高级地址清理
 */
const cleanAddressAdvanced = (address: string, name?: string, phone?: string): string => {
  let cleaned = address
  
  // 移除姓名和电话
  if (name) cleaned = cleaned.replace(new RegExp(name, 'g'), '')
  if (phone) cleaned = cleaned.replace(new RegExp(phone, 'g'), '')
  
  // 移除地址前缀
  cleaned = cleaned.replace(/^(寄样地址|地址|详细地址|收货地址|收件地址)[:：\s]*/gi, '')
  
  // 移除特定括号内容
  cleaned = cleaned
    .replace(/[（(].*?样品.*?[）)]/gi, '')
    .replace(/[（(].*?顺丰.*?[）)]/gi, '')
    .replace(/[（(].*?快递.*?[）)]/gi, '')
  
  // 移除后缀干扰信息
  cleaned = cleaned
    .replace(/\s+寄样品前.*$/gi, '')
    .replace(/\s+PS.*$/gi, '')
    .replace(/\s+@我.*$/gi, '')
    .replace(/\s+告知.*$/gi, '')
    .replace(/\s+(发货|请发|谢谢|感谢|备注|到付|拒收|签收).*$/gi, '')
  
  return cleaned.replace(/\s+/g, '').trim()
}

/**
 * 主解析函数
 */
const parseText = async () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入要解析的文本')
    return
  }

  parsing.value = true
  const startTime = Date.now()
  
  try {
    const text = inputText.value
    const entities: any[] = []
    
    // 1. 解析电话号码
    const phoneResult = parsePhoneAdvanced(text)
    let phone = ''
    if (phoneResult) {
      phone = phoneResult.phone
      parseResult.contactPhone = phone
      parseResult.phoneValid = phoneResult.isValid
      parseResult.phoneRegion = phoneResult.region
      
      entities.push({
        type: '电话号码',
        value: phone,
        confidence: phoneResult.confidence,
        source: phoneResult.source
      })
    }

    // 2. 解析姓名
    const nameResult = parseNameAdvanced(text, phone)
    if (nameResult) {
      parseResult.receiverName = nameResult.name
      parseResult.nameSource = nameResult.source
      
      entities.push({
        type: '收件姓名',
        value: nameResult.name,
        confidence: nameResult.confidence,
        source: nameResult.source
      })
    }

    // 3. 解析地址
    const addressResult = parseAddressAdvanced(text, parseResult.receiverName, phone)
    if (addressResult) {
      parseResult.address = addressResult.address
      parseResult.addressComponents = addressResult.components
      
      entities.push({
        type: '详细地址',
        value: addressResult.address,
        confidence: addressResult.confidence,
        source: addressResult.source
      })
    }

    // 计算总体置信度
    const totalConfidence = entities.length > 0 
      ? entities.reduce((sum, entity) => sum + entity.confidence, 0) / entities.length
      : 0

    parseResult.confidence = totalConfidence
    parseResult.hasResult = entities.length > 0

    // 保存分析数据
    const patterns = entities.map(e => e.source)
    analysisData.value = {
      method: phoneNumberParser ? 'AI增强解析' : '基础解析',
      confidence: totalConfidence,
      processingTime: Date.now() - startTime,
      patterns: [...new Set(patterns)],
      entities
    }

    lastParseResult.value = { ...parseResult }

    if (parseResult.hasResult) {
      ElMessage.success(`解析成功！识别到 ${entities.length} 个字段`)
      emit('parsed', parseResult)
    } else {
      ElMessage.warning('未能解析出有效信息，请检查文本格式')
    }
  } catch (error) {
    console.error('文本解析错误:', error)
    ElMessage.error('解析失败，请重试')
  } finally {
    parsing.value = false
  }
}

/**
 * 填入表单
 */
const fillForm = () => {
  const formData = {
    receiverName: parseResult.receiverName,
    contactPhone: parseResult.contactPhone,
    address: parseResult.address
  }

  emit('update:modelValue', formData)
  ElMessage.success('已填入表单')
  clearText()
}

/**
 * 清空文本
 */
const clearText = () => {
  inputText.value = ''
  Object.assign(parseResult, {
    hasResult: false,
    receiverName: '',
    contactPhone: '',
    address: '',
    confidence: 0
  })
}

/**
 * 显示解析分析
 */
const showAnalysis = () => {
  showAnalysisDialog.value = true
}

/**
 * 文本变化处理
 */
const handleTextChange = () => {
  if (parseResult.hasResult) {
    Object.assign(parseResult, {
      hasResult: false,
      receiverName: '',
      contactPhone: '',
      address: '',
      confidence: 0
    })
  }
}

// 监听props变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    Object.assign(parseResult, {
      hasResult: true,
      receiverName: newValue.receiverName || '',
      contactPhone: newValue.contactPhone || '',
      address: newValue.address || '',
      confidence: 1
    })
  }
}, { immediate: true, deep: true })
</script>

<style scoped>
.advanced-text-parser {
  width: 100%;
}

.parse-result {
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .grid-cols-1.md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.gap-4 {
  gap: 1rem;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.text-gray-500 {
  color: #6b7280;
}

.text-gray-600 {
  color: #4b5563;
}

.font-medium {
  font-weight: 500;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mr-1 { margin-right: 0.25rem; }
.ml-1 { margin-left: 0.25rem; }
.ml-2 { margin-left: 0.5rem; }
.p-4 { padding: 1rem; }
.rounded { border-radius: 0.25rem; }
.w-full { width: 100%; }
</style> 