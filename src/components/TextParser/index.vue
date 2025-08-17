<template>
  <div class="text-parser">
    <el-form-item label="智能解析">
      <el-input
        v-model="inputText"
        type="textarea"
        placeholder="请输入包含收件姓名、联系电话、详细地址的文字信息，例如：&#10;‼‼一定要在样品里帮我留个你自己的联系方式，样品太多，方便我联系你，【到付拒收】&#10;&#10;寄样地址：徐州市泉山区矿大软件园C-2-C三楼&#10;宋双双19951839883 牙膏6支&#10;&#10;或：芳芳（样品请发顺丰谢谢）&#10;电话:15988423456&#10;地址:浙江省杭州市萧山区民和路525号明华国际24楼群心"
        :autosize="{ minRows: 3, maxRows: 6 }"
        class="w-full"
        @input="handleTextChange"
      />
      <div class="mt-2">
        <el-button type="primary" @click="parseText" :loading="parsing">
          <Icon icon="ep:magic-stick" class="mr-1" />
          智能解析
        </el-button>
        <el-button @click="clearText">
          <Icon icon="ep:refresh" class="mr-1" />
          清空
        </el-button>
      </div>
    </el-form-item>

    <!-- 解析结果预览 -->
    <div v-if="parseResult.hasResult" class="parse-result mt-4 p-4 bg-gray-50 rounded">
      <div class="text-sm text-gray-600 mb-2">
        <span>解析结果预览：</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-if="parseResult.receiverName">
          <label class="text-xs text-gray-500">收件姓名</label>
          <div class="text-sm font-medium">{{ parseResult.receiverName }}</div>
        </div>
        <div v-if="parseResult.contactPhone">
          <label class="text-xs text-gray-500">联系电话</label>
          <div class="text-sm font-medium">{{ parseResult.contactPhone }}</div>
        </div>
        <div v-if="parseResult.address">
          <label class="text-xs text-gray-500">详细地址</label>
          <div class="text-sm font-medium">{{ parseResult.address }}</div>
        </div>
      </div>
      
      <div class="mt-3">
        <el-button type="success" size="small" @click="fillForm">
          <Icon icon="ep:check" class="mr-1" />
          填入表单
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'

interface ParseResult {
  hasResult: boolean
  receiverName: string
  contactPhone: string
  address: string
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
const parseResult = reactive<ParseResult>({
  hasResult: false,
  receiverName: '',
  contactPhone: '',
  address: ''
})

/**
 * 智能正则解析引擎
 */
const parseWithRegex = (text: string): ParseResult => {
  console.log('开始智能正则解析...')
  
  const result: ParseResult = {
    hasResult: false,
    receiverName: '',
    contactPhone: '',
    address: ''
  }

  // 预处理文本
  const cleanText = text
    .replace(/[，。！？；：""''（）【】〈〉《》]/g, match => {
      const map: Record<string, string> = {
        '，': ',', '。': '.', '！': '!', '？': '?', '；': ';', '：': ':',
        '"': '"', '"': '"', ''': "'", ''': "'", 
        '（': '(', '）': ')', '【': '[', '】': ']',
        '〈': '<', '〉': '>', '《': '<', '》': '>'
      }
      return map[match] || match
    })
    .replace(/\s+/g, ' ')
    .trim()

  const lines = cleanText.split(/[\n\r]+/).map(line => line.trim()).filter(line => line)
  const fullText = cleanText.replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim()

  console.log('预处理结果:', { lines, fullText })

  // 1. 提取电话号码
  result.contactPhone = extractPhone(fullText, lines)
  
  // 2. 提取姓名
  result.receiverName = extractName(fullText, lines, result.contactPhone)
  
  // 3. 提取地址
  result.address = extractAddress(fullText, lines, result.receiverName, result.contactPhone)

  result.hasResult = !!(result.receiverName || result.contactPhone || result.address)
  console.log('解析结果:', result)
  
  return result
}

/**
 * 提取电话号码
 */
const extractPhone = (fullText: string, lines: string[]): string => {
  // 策略1：明确标识的电话
  const explicitPatterns = [
    /(?:电话|手机|联系方式?|tel|phone|联系电话|手机号)[:：\s]*(\+?86[-\s]?)?(1[3-9]\d{9})/gi,
    /(?:寄样地址|地址)[:：\s]*.*?(1[3-9]\d{9})/gi
  ]
  
  for (const pattern of explicitPatterns) {
    const matches = fullText.match(pattern)
    if (matches) {
      for (const match of matches) {
        const phone = match.match(/(1[3-9]\d{9})/)
        if (phone) {
          console.log('通过明确标识找到电话:', phone[0])
          return phone[0]
        }
      }
    }
  }
  
  // 策略2：姓名+电话连写模式
  const namePhonePattern = /([\u4e00-\u9fa5]{2,4})(1[3-9]\d{9})/g
  const namePhoneMatches = fullText.match(namePhonePattern)
  if (namePhoneMatches) {
    for (const match of namePhoneMatches) {
      const parts = match.match(/([\u4e00-\u9fa5]{2,4})(1[3-9]\d{9})/)
      if (parts) {
        console.log('通过姓名连写找到电话:', parts[2])
        return parts[2]
      }
    }
  }
  
  // 策略3：通用电话搜索
  const phonePattern = /(1[3-9]\d{9})/g
  const phoneMatches = fullText.match(phonePattern)
  if (phoneMatches) {
    console.log('通过通用模式找到电话:', phoneMatches[0])
    return phoneMatches[0]
  }
  
  return ''
}

/**
 * 提取姓名
 */
const extractName = (fullText: string, lines: string[], phone: string): string => {
  // 策略1：从姓名+电话连写中提取
  if (phone) {
    const namePhonePattern = new RegExp(`([\\u4e00-\\u9fa5]{2,4})${phone}`)
    const match = fullText.match(namePhonePattern)
    if (match) {
      console.log('从连写中提取姓名:', match[1])
      return match[1]
    }
  }
  
  // 策略2：从有效行首提取
  for (const line of lines) {
    // 跳过干扰行
    if (/[‼！【】]/.test(line) || 
        /样品.*联系|方便.*联系|到付.*拒收|留个.*联系方式/i.test(line) ||
        line.length > 60) continue
    
    // 移除括号内容后提取
    const cleanLine = line.replace(/[（(].*?[）)]/g, '').trim()
    const nameMatch = cleanLine.match(/^([\u4e00-\u9fa5]{2,4})(?=\s|$|[^\u4e00-\u9fa5])/)
    
    if (nameMatch && isValidNameCandidate(nameMatch[1])) {
      console.log('从行首提取姓名:', nameMatch[1])
      return nameMatch[1]
    }
  }
  
  // 策略3：从全文中智能搜索
  const namePattern = /(?:^|[^[\u4e00-\u9fa5]])([\u4e00-\u9fa5]{2,4})(?=[^[\u4e00-\u9fa5]]|$)/g
  const candidates = []
  let match
  
  while ((match = namePattern.exec(fullText)) !== null) {
    candidates.push(match[1])
  }
  
  const validNames = candidates.filter(isValidNameCandidate)
  if (validNames.length > 0) {
    console.log('从全文提取姓名:', validNames[0])
    return validNames[0]
  }
  
  return ''
}

/**
 * 验证姓名候选
 */
const isValidNameCandidate = (name: string): boolean => {
  const excludeWords = [
    '省', '市', '区', '县', '镇', '街道', '路', '号', '楼', '层', '室', '单元', '栋', '院',
    '小区', '村', '大厦', '广场', '中心', '花园', '公园', '学校', '医院', '银行',
    '东西', '南北', '左右', '上下', '前后', '里面', '外面', '附近', '旁边',
    '寄样', '地址', '样品', '快递', '物流', '谢谢', '联系', '方便', '软件', '三楼',
    '发货', '牙膏', '洗发', '化妆', '护肤', '商品', '产品', '货物', '到付',
    '拒收', '签收', '请发', '感谢', '备注'
  ]
  
  if (name.length < 2 || name.length > 4) return false
  if (excludeWords.some(word => name.includes(word))) return false
  if (name.length === 2 && name[0] === name[1]) return false
  if (/\d/.test(name)) return false
  
  return true
}

/**
 * 提取地址
 */
const extractAddress = (fullText: string, lines: string[], name: string, phone: string): string => {
  // 策略1：明确标识的地址行
  const addressPatterns = [
    /^(寄样地址|地址|详细地址|收货地址)[:：\s]*(.+)$/,
    /(?:寄样地址|地址|详细地址|收货地址)[:：\s]*(.+)$/
  ]
  
  for (const line of lines) {
    for (const pattern of addressPatterns) {
      const match = line.match(pattern)
      if (match) {
        const rawAddress = match[match.length - 1]
        console.log('通过标识找到地址:', rawAddress)
        return cleanAddress(rawAddress, name, phone)
      }
    }
  }
  
  // 策略2：基于地址关键词的智能匹配
  const addressKeywords = [
    '省', '市', '区', '县', '镇', '街道', '路', '号', '楼', '层', '室', '单元', '栋', '院',
    '小区', '村', '大厦', '广场', '中心', '花园', '公园', '软件园', '工业园', '开发区',
    '科技园', '商务楼', '写字楼', '国际', '大厦'
  ]
  
  let bestLine = ''
  let maxScore = 0
  
  for (const line of lines) {
    if (/[‼！【】]/.test(line) || 
        /样品.*联系|方便.*联系|到付.*拒收|留个.*联系方式/i.test(line) ||
        line.length > 60) continue
    
    const score = calculateAddressScore(line, addressKeywords)
    if (score > maxScore && score >= 3) {
      maxScore = score
      bestLine = line
    }
  }
  
  if (bestLine) {
    console.log('通过关键词匹配找到地址:', bestLine)
    return cleanAddress(bestLine, name, phone)
  }
  
  // 策略3：地址段落提取
  const addressSegmentPattern = /([^。！？\n]*(?:省|市|区|县)[^。！？\n]*)/g
  const segments = fullText.match(addressSegmentPattern)
  
  if (segments && segments.length > 0) {
    const bestSegment = segments.reduce((longest, current) => 
      current.length > longest.length ? current : longest, ''
    )
    console.log('通过段落提取找到地址:', bestSegment)
    return cleanAddress(bestSegment, name, phone)
  }
  
  return ''
}

/**
 * 计算地址评分
 */
const calculateAddressScore = (line: string, keywords: string[]): number => {
  const baseScore = keywords.filter(keyword => line.includes(keyword)).length
  const hasProvince = /[省]/g.test(line) ? 2 : 0
  const hasCity = /[市]/g.test(line) ? 2 : 0
  const hasDistrict = /[区县]/g.test(line) ? 1 : 0
  
  return baseScore + hasProvince + hasCity + hasDistrict
}

/**
 * 清理地址
 */
const cleanAddress = (address: string, name?: string, phone?: string): string => {
  let cleaned = address
  
  // 移除姓名和电话
  if (name) {
    cleaned = cleaned.replace(new RegExp(name, 'g'), '')
  }
  if (phone) {
    cleaned = cleaned.replace(new RegExp(phone, 'g'), '')
  }
  
  // 移除地址前缀
  cleaned = cleaned
    .replace(/^(寄样地址|地址|详细地址|收货地址)[:：\s]*/gi, '')
    .replace(/(寄样地址|地址|详细地址|收货地址)[:：\s]*/gi, '')
  
  // 移除括号内容
  cleaned = cleaned.replace(/[（(].*?[）)]/g, '')
  
  // 移除产品描述
  const productPatterns = [
    /\s+\d+支\s*$/gi,
    /\s+(牙膏|洗发水|化妆品|护肤品|面膜|精华|乳液|面霜|口红|香水)\s*\d*支?\s*$/gi,
    /\s+(样品|产品|商品|货物|东西|物品).*$/gi,
    /\s+(发样品|寄样品|样品请).*$/gi
  ]
  
  for (const pattern of productPatterns) {
    cleaned = cleaned.replace(pattern, '')
  }
  
  // 移除快递和备注信息
  const shippingPatterns = [
    /\s+(快递|物流|顺丰|韵达|圆通|中通|申通|邮政|EMS).*$/gi,
    /\s+(发货|请发|谢谢|感谢|备注|到付|拒收|签收).*$/gi
  ]
  
  for (const pattern of shippingPatterns) {
    cleaned = cleaned.replace(pattern, '')
  }
  
  return cleaned
    .replace(/\s+/g, '')
    .trim()
}

/**
 * 解析文本主函数
 */
const parseText = async () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入要解析的文本')
    return
  }

  parsing.value = true
  try {
    const result = parseWithRegex(inputText.value)
    Object.assign(parseResult, result)

    if (result.hasResult) {
      ElMessage.success('解析成功！')
      console.log('解析结果:', result)
      emit('parsed', result)
    } else {
      ElMessage.warning('未能解析出有效信息，请检查文本格式')
      console.log('解析失败，输入文本:', inputText.value)
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
    address: ''
  })
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
      address: ''
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
      address: newValue.address || ''
    })
  }
}, { immediate: true, deep: true })
</script>

<style scoped>
.text-parser {
  width: 100%;
}

.parse-result {
  border: 1px solid #e5e7eb;
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
.p-4 { padding: 1rem; }
.rounded { border-radius: 0.25rem; }
.w-full { width: 100%; }
</style> 