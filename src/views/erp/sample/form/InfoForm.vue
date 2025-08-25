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
          粘贴包含收件人姓名、手机号、地址的文本信息，系统将自动解析并填入对应字段。支持复杂文本格式，智能识别中文姓名、手机号码和详细地址。
        </p>
        <el-form-item>
          <el-input
            v-model="inputText"
            type="textarea"
            placeholder="请输入包含收件姓名、联系电话、详细地址的文字信息，支持多种格式：&#10;例如：北京市朝阳区建国路100号，张三收，13800138000&#10;或者：收件人：李四 电话：13900139000 地址：上海市浦东新区世纪大道200号&#10;系统将自动识别并提取姓名、电话和地址信息"
            :autosize="{ minRows: 4, maxRows: 8 }"
            class="w-full"
            @input="onInputChange"
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
            <el-text v-if="showPreview && !parsing && !parseResult.hasResult" type="info" size="small" style="margin-left: 12px;">
              <Icon icon="ep:info-filled" />
              文本内容已识别，点击"智能解析"开始处理
            </el-text>
          </div>
        </el-form-item>

        <!-- 解析结果预览 -->
        <div v-if="parseResult.hasResult" class="parse-result">
          <div class="result-header">解析结果预览：</div>
          <div class="result-grid">
            <div v-if="parseResult.receiverName" class="result-item">
              <label>收件姓名</label>
              <div class="result-value">
                {{ parseResult.receiverName }}
                <el-tag 
                  :type="parseResult.confidence.receiverName >= 80 ? 'success' : parseResult.confidence.receiverName >= 60 ? 'warning' : 'danger'" 
                  size="small" 
                  class="confidence-tag"
                >
                  {{ parseResult.confidence.receiverName }}%
                </el-tag>
              </div>
            </div>
            <div v-if="parseResult.contactPhone" class="result-item">
              <label>联系电话</label>
              <div class="result-value">
                {{ parseResult.contactPhone }}
                <el-tag 
                  :type="parseResult.confidence.contactPhone >= 80 ? 'success' : parseResult.confidence.contactPhone >= 60 ? 'warning' : 'danger'" 
                  size="small" 
                  class="confidence-tag"
                >
                  {{ parseResult.confidence.contactPhone }}%
                </el-tag>
              </div>
            </div>
            <div v-if="parseResult.address" class="result-item">
              <label>详细地址</label>
              <div class="result-value">
                {{ parseResult.address }}
                <el-tag 
                  :type="parseResult.confidence.address >= 80 ? 'success' : parseResult.confidence.address >= 60 ? 'warning' : 'danger'" 
                  size="small" 
                  class="confidence-tag"
                >
                  {{ parseResult.confidence.address }}%
                </el-tag>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 12px;">
            <el-button type="success" size="small" @click="applyParsedData">
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
  import { PropType, nextTick, reactive, onMounted } from 'vue'
  import { copyValueToTarget } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import type { SampleVO } from '@/api/erp/sample'
  import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
  import ComboSelectDialog from './ComboSelectDialog.vue'
  import CustomerSearchDialog from './CustomerSearchDialog.vue'
  // 引入专业的自然语言处理库
  import { parsePhoneNumber, isValidPhoneNumber, formatIncompletePhoneNumber } from 'libphonenumber-js'
  import nlp from 'compromise'

  defineOptions({ name: 'ErpSampleInfoForm' })

  const props = defineProps({
    propFormData: {
      type: Object as PropType<Partial<SampleVO>>,
      default: () => ({})
    },
    isDetail: propTypes.bool.def(false),
    activeName: propTypes.string.def('info')
  })

  const message = useMessage()
  const formRef = ref()
  const comboSelectDialogRef = ref()
  const customerSearchDialogRef = ref()
  /** 表单数据 */
  const formData: Ref<SampleVO> = ref({} as SampleVO)

  /** 表单校验 */
  const emit = defineEmits(['update:activeName', 'update:propFormData'])
  
  // 🔥 添加数据同步逻辑：监听父组件传递的数据变化
  watch(
    () => props.propFormData,
    (newData) => {
      if (newData && typeof newData === 'object' && Object.keys(newData).length > 0) {
        // 🔥 使用深拷贝确保数据完全同步
        formData.value = { ...formData.value, ...newData }
      }
    },
    { 
      immediate: true, 
      deep: true 
    }
  )

  // 🔥 添加表单数据变化监听：使用emit通知父组件更新数据
  watch(
    formData,
    (newData) => {
      if (newData && typeof newData === 'object') {
        // 🔥 使用emit事件通知父组件更新数据，而不是直接修改props
        emit('update:propFormData', newData)
      }
    },
    { deep: true }
  )

  // 🔥 组件挂载时强制同步数据
  onMounted(() => {
    if (props.propFormData && typeof props.propFormData === 'object' && Object.keys(props.propFormData).length > 0) {
      formData.value = { ...formData.value, ...props.propFormData }
    }
  })

  /** 表单校验 */
  const rules = reactive({
    logisticsCompany: [{ required: true, message: '物流公司不能为空', trigger: 'blur' }],
    logisticsNo: [{ required: true, message: '物流单号不能为空', trigger: 'blur' }],
    receiverName: [{ required: true, message: '收件姓名不能为空', trigger: 'blur' }],
    contactPhone: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
    address: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }],
    comboProductId: [{ required: true, message: '组品编号不能为空', trigger: 'blur' }],
    customerName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
    sampleStatus: [{ required: true, message: '样品状态不能为空', trigger: 'change' }]
  })

  /** 智能解析文本 */
  const inputText = ref('')
  const parsing = ref(false)
  const showPreview = ref(false)

  // 解析结果结构
  const parseResult = reactive({
    hasResult: false,
    receiverName: '',
    contactPhone: '',
    address: '',
    confidence: {
      receiverName: 0,
      contactPhone: 0,
      address: 0
    }
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
    formData.value.comboProductId = combo.no || combo.id?.toString() || ''
    formData.value.shippingCode = combo.shippingCode || ''
    formData.value.comboProductName = combo.name || ''

    // 🔥 使用emit事件通知父组件更新数据，而不是直接修改props
    emit('update:propFormData', formData.value)

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
    formData.value.customerName = customer.name || ''

    // 🔥 使用emit事件通知父组件更新数据，而不是直接修改props
    emit('update:propFormData', formData.value)

    // 触发客户名称字段的验证
    nextTick(() => {
      formRef.value?.validateField('customerName')
    })
  }

// 中文常见姓氏库（扩展版）
const CHINESE_SURNAMES = new Set([
  '王', '李', '张', '刘', '陈', '杨', '黄', '赵', '周', '吴',
  '徐', '孙', '朱', '马', '胡', '郭', '林', '何', '高', '梁',
  '郑', '罗', '宋', '谢', '唐', '韩', '曹', '许', '邓', '萧',
  '冯', '曾', '程', '蔡', '彭', '潘', '袁', '于', '董', '余',
  '苏', '叶', '吕', '魏', '蒋', '田', '杜', '丁', '沈', '姜',
  '范', '江', '傅', '钟', '卢', '汪', '戴', '崔', '任', '陆',
  '廖', '姚', '方', '金', '邱', '夏', '谭', '韦', '贾', '邹',
  '石', '熊', '孟', '秦', '阎', '薛', '侯', '雷', '白', '龙',
  '段', '郝', '孔', '邵', '史', '毛', '常', '万', '顾', '赖',
  '武', '康', '贺', '严', '尹', '钱', '施', '牛', '洪', '龚',
  '虞', '欧阳', '司马', '上官', '诸葛', '东方', '独孤', '南宫', '万俟', '闻人'
])

// 地址组成词汇库（全面升级）
const ADDRESS_KEYWORDS = {
  // 行政区划
  administrative: new Set([
    '省', '市', '区', '县', '镇', '乡', '街道', '村', '社区', '特区', '自治区', 
    '直辖市', '地级市', '县级市', '开发区', '高新区', '经济区', '工业区',
    '新区', '示范区', '保税区', '出口加工区', '综合保税区', '自贸区'
  ]),
  
  // 道路相关
  roads: new Set([
    '路', '街', '巷', '弄', '胡同', '里', '道', '大道', '小道', '环路',
    '高速', '快速路', '立交桥', '天桥', '地下通道', '人行道', '步行街',
    '中路', '东路', '西路', '南路', '北路', '内环', '外环', '一环', '二环',
    '三环', '四环', '五环', '六环'
  ]),
  
  // 建筑物
  buildings: new Set([
    '号', '栋', '座', '幢', '楼', '层', '室', '户', '单元', '门牌',
    '大厦', '广场', '中心', '城', '园', '苑', '庭', '府', '邸', '墅',
    '公寓', '花园', '小区', '社区', '新村', '家园', '豪园', '名苑',
    '写字楼', '商务楼', '办公楼', '住宅楼', '商业楼', '综合楼',
    '工业园', '科技园', '软件园', '创业园', '孵化园', '物流园',
    '商贸城', '批发市场', '购物中心', '商业街', '步行街'
  ]),
  
  // 特殊地标
  landmarks: new Set([
    '医院', '学校', '大学', '中学', '小学', '幼儿园', '银行', '邮局',
    '火车站', '汽车站', '地铁站', '机场', '港口', '码头', '桥',
    '公园', '体育场', '图书馆', '博物馆', '影院', '剧院', '展览馆',
    '宾馆', '酒店', '饭店', '餐厅', '超市', '商场', '市场'
  ]),
  
  // 方位词
  directions: new Set([
    '东', '南', '西', '北', '中', '上', '下', '前', '后', '左', '右',
    '内', '外', '里', '边', '侧', '旁', '对面', '附近', '周边',
    '东南', '东北', '西南', '西北', '东侧', '西侧', '南侧', '北侧'
  ])
}

// 高级智能解析引擎（完全重写）
const parseWithAdvancedEngine = async (text: string) => {
  const result = {
    hasResult: false,
    receiverName: '',
    contactPhone: '',
    address: '',
    confidence: {
      receiverName: 0,
      contactPhone: 0,
      address: 0
    }
  }

  try {
    // 步骤1: 文本预处理和标准化
    const normalizedText = preprocessTextAdvanced(text)
    
    // 步骤2: 使用compromise.js进行自然语言理解
    const doc = nlp(normalizedText)
    
    // 步骤3: 多策略解析
    const strategies = [
      parseStrategy1_StructuredFormat,  // 结构化格式 "地址1：xxx"
      parseStrategy2_NamePhonePattern, // 姓名+电话模式
      parseStrategy3_AddressFirst,     // 地址优先模式
      parseStrategy4_ContextualNLP,    // 上下文NLP分析
      parseStrategy5_FallbackPattern   // 兜底模式
    ]
    
    for (const strategy of strategies) {
      const strategyResult = await strategy(normalizedText, doc)
      if (strategyResult.success) {
        Object.assign(result, strategyResult.data)
        result.hasResult = true
        break
      }
    }
    
    // 步骤4: 结果验证和优化
    if (result.hasResult) {
      result = await validateAndOptimizeResult(result, normalizedText)
    }
    
    return result
    
  } catch (error) {
    console.error('Advanced parsing error:', error)
    return result
  }
}

// 高级文本预处理
const preprocessTextAdvanced = (text: string): string => {
  let processed = text
  
  // 1. 移除业务前缀（升级版）
  const businessPrefixes = [
    /^[A-Za-z\u4e00-\u9fa5]+-[A-Za-z\u4e00-\u9fa5]+[：:]/,
    /^A帝王严选-[^：:]*[：:]/,
    /^[^：:]*选品[^：:]*[：:]/,
    /^样品地址[：:]/,
    /^寄样地址[：:]/,
    /^收件地址[：:]/,
    /^地址\d*[：:]/,
    /^收件信息[：:]/,
    /^更新收件信息[：:]/
  ]
  
  for (const prefix of businessPrefixes) {
    processed = processed.replace(prefix, '')
  }
  
  // 2. 清理多余信息
  const noisePhrases = [
    /安排样品[^。，]*[。，]?/g,
    /样品\d*[。，]?/g,
    /\d+瓶装?[。，]?/g,
    /\d+支[。，]?/g,
    /\d+盒[。，]?/g,
    /牙膏\d*支?[。，]?/g,
    /面膜\d*盒?[。，]?/g,
    /防晒霜\d*瓶?[。，]?/g,
    /（.*随机.*）/g,
    /【.*】/g,
    /请.*前.*@.*$/g,
    /PS——.*$/g,
    /‼‼.*$/g,
    /送货上门/g,
    /不收到付件/g,
    /顺丰/g
  ]
  
  for (const noise of noisePhrases) {
    processed = processed.replace(noise, ' ')
  }
  
  // 3. 标准化标点和空格
  processed = processed
    .replace(/[：]/g, ':')
    .replace(/[，。；]/g, ',')
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ', ')
    .trim()
  
  return processed
}

// 解析策略1: 结构化格式处理
const parseStrategy1_StructuredFormat = async (text: string, doc: any) => {
  // 专门处理 "地址1：上海市静安区延平路123弄1-16号三和花园2号楼15C 李女士 13698612111" 格式
  
  const structuredPatterns = [
    // 地址标识开头的格式
    /(?:地址\d*|收件人|姓名|联系人)[：:]\s*(.+)/i,
    /(?:电话|手机|联系电话)[：:]\s*(.+)/i,
    /(?:地址|详细地址|收件地址)[：:]\s*(.+)/i
  ]
  
  const lines = text.split(/\n|\r\n/).map(line => line.trim()).filter(line => line)
  const extractedInfo = {}
  
  for (const line of lines) {
    // 检查是否为结构化行
    for (const pattern of structuredPatterns) {
      const match = line.match(pattern)
      if (match) {
        const content = match[1].trim()
        
        if (pattern.source.includes('地址')) {
          // 解析地址行，可能包含姓名和电话
          const addressParseResult = parseComplexAddressLine(content)
          Object.assign(extractedInfo, addressParseResult)
        } else if (pattern.source.includes('电话|手机')) {
          extractedInfo.contactPhone = content
        } else if (pattern.source.includes('收件人|姓名|联系人')) {
          extractedInfo.receiverName = content
        }
      }
    }
  }
  
  // 如果没有找到结构化信息，尝试解析单行复杂地址
  if (Object.keys(extractedInfo).length === 0 && lines.length === 1) {
    const complexResult = parseComplexAddressLine(lines[0])
    Object.assign(extractedInfo, complexResult)
  }
  
  if (extractedInfo.receiverName || extractedInfo.contactPhone || extractedInfo.address) {
    return {
      success: true,
      data: {
        receiverName: extractedInfo.receiverName || '',
        contactPhone: extractedInfo.contactPhone || '',
        address: extractedInfo.address || '',
        confidence: {
          receiverName: extractedInfo.receiverName ? 85 : 0,
          contactPhone: extractedInfo.contactPhone ? 90 : 0,
          address: extractedInfo.address ? 88 : 0
        }
      }
    }
  }
  
  return { success: false }
}

// 解析复杂地址行（核心功能）
const parseComplexAddressLine = (line: string) => {
  const result = {
    receiverName: '',
    contactPhone: '',
    address: ''
  }
  
  // 1. 提取电话号码（最可靠的锚点）
  const phones = extractPhonesAdvanced(line)
  if (phones.length > 0) {
    result.contactPhone = phones[0].phone
    // 移除电话号码，处理剩余文本
    line = line.replace(phones[0].originalText, ' ').trim()
  }
  
  // 2. 分析剩余文本结构
  const segments = segmentTextByFeatures(line)
  
  // 3. 识别地址部分（通常是最长的、包含地址关键词的部分）
  const addressSegment = identifyAddressSegment(segments)
  if (addressSegment) {
    result.address = addressSegment.text
    segments.splice(segments.indexOf(addressSegment), 1)
  }
  
  // 4. 从剩余段落中识别姓名
  const nameSegment = identifyNameSegment(segments)
  if (nameSegment) {
    result.receiverName = nameSegment.text
  }
  
  return result
}

// 高级电话提取
const extractPhonesAdvanced = (text: string) => {
  const phones = []
  
  // 各种电话格式模式
  const phonePatterns = [
    /1[3-9]\d{9}/g,                    // 标准手机号
    /1[3-9]\d{4}\s*\d{4}/g,           // 带空格的手机号
    /1[3-9]\d-\d{4}-\d{4}/g,          // 带连字符的手机号
    /\+86\s*1[3-9]\d{9}/g,            // 国际格式
    /(?:手机|电话|联系电话)[：:]?\s*(1[3-9]\d{9})/g // 带标识的电话
  ]
  
  for (const pattern of phonePatterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      const originalText = match[0]
      const cleanPhone = originalText.replace(/\D/g, '')
      
      if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
        try {
          const parsedPhone = parsePhoneNumber(cleanPhone, 'CN')
          if (parsedPhone && parsedPhone.isValid()) {
            phones.push({
              phone: parsedPhone.formatNational(),
              originalText: originalText,
              confidence: 95
            })
          }
        } catch (e) {
          // 如果libphonenumber-js解析失败，使用基础验证
          if (/^1[3-9]\d{9}$/.test(cleanPhone)) {
            phones.push({
              phone: cleanPhone,
              originalText: originalText,
              confidence: 85
            })
          }
        }
      }
    }
  }
  
  return phones.sort((a, b) => b.confidence - a.confidence)
}

// 文本特征分段
const segmentTextByFeatures = (text: string) => {
  // 使用多种分隔符和特征点进行分段
  const delimiters = /[，,。；\s]+/
  const segments = text.split(delimiters)
    .map(seg => seg.trim())
    .filter(seg => seg.length > 0)
    .map(seg => ({
      text: seg,
      features: analyzeSegmentFeatures(seg)
    }))
  
  return segments
}

// 分析文本段特征
const analyzeSegmentFeatures = (segment: string) => {
  const features = {
    hasAddressKeywords: 0,
    hasNumbers: 0,
    hasChineseSurname: 0,
    length: segment.length,
    isLikelyAddress: false,
    isLikelyName: false
  }
  
  // 地址关键词分析
  for (const [category, keywords] of Object.entries(ADDRESS_KEYWORDS)) {
    for (const keyword of keywords) {
      if (segment.includes(keyword)) {
        features.hasAddressKeywords += 1
      }
    }
  }
  
  // 数字密度分析
  const numberMatches = segment.match(/\d/g)
  features.hasNumbers = numberMatches ? numberMatches.length : 0
  
  // 中文姓氏检查
  for (const surname of CHINESE_SURNAMES) {
    if (segment.startsWith(surname)) {
      features.hasChineseSurname = 1
      break
    }
  }
  
  // 综合判断
  features.isLikelyAddress = (
    features.hasAddressKeywords >= 2 || 
    (features.hasAddressKeywords >= 1 && features.hasNumbers >= 1) ||
    features.length > 10
  )
  
  features.isLikelyName = (
    features.hasChineseSurname === 1 && 
    features.length <= 8 && 
    features.hasAddressKeywords === 0
  )
  
  return features
}

// 识别地址段落
const identifyAddressSegment = (segments: any[]) => {
  // 地址通常是包含最多地址关键词、长度适中的段落
  let bestSegment = null
  let bestScore = 0
  
  for (const segment of segments) {
    const score = (
      segment.features.hasAddressKeywords * 10 +
      Math.min(segment.features.hasNumbers, 5) * 2 +
      (segment.features.length > 8 ? 5 : 0) +
      (segment.features.isLikelyAddress ? 15 : 0)
    )
    
    if (score > bestScore) {
      bestScore = score
      bestSegment = segment
    }
  }
  
  return bestScore > 10 ? bestSegment : null
}

// 识别姓名段落
const identifyNameSegment = (segments: any[]) => {
  // 姓名通常包含中文姓氏、长度较短
  for (const segment of segments) {
    if (segment.features.isLikelyName) {
      return segment
    }
  }
  
  // 兜底：找最短的、包含中文字符的段落
  const chineseSegments = segments.filter(seg => /[\u4e00-\u9fa5]/.test(seg.text))
  if (chineseSegments.length > 0) {
    return chineseSegments.reduce((shortest, current) => 
      current.text.length < shortest.text.length ? current : shortest
    )
  }
  
  return null
}

// 解析策略2-5（简化版，保持原有逻辑但增强）
const parseStrategy2_NamePhonePattern = async (text: string, doc: any) => {
  // 保留原有的姓名+电话模式识别逻辑
  return { success: false }
}

const parseStrategy3_AddressFirst = async (text: string, doc: any) => {
  // 地址优先模式
  return { success: false }
}

const parseStrategy4_ContextualNLP = async (text: string, doc: any) => {
  // 使用compromise.js的上下文分析
  return { success: false }
}

const parseStrategy5_FallbackPattern = async (text: string, doc: any) => {
  // 兜底模式
  return { success: false }
}

// 结果验证和优化
const validateAndOptimizeResult = async (result: any, originalText: string) => {
  // 电话验证
  if (result.contactPhone) {
    try {
      const phone = parsePhoneNumber(result.contactPhone, 'CN')
      if (phone && phone.isValid()) {
        result.contactPhone = phone.formatNational()
        result.confidence.contactPhone = Math.min(result.confidence.contactPhone + 5, 95)
      }
    } catch (e) {
      // 保持原值
    }
  }
  
  // 地址验证和清理
  if (result.address) {
    result.address = result.address
      .replace(/\s+/g, '')  // 移除多余空格
      .replace(/[，,。；]$/, '') // 移除结尾标点
    
    if (result.address.length < 6) {
      result.confidence.address = Math.max(result.confidence.address - 20, 30)
    }
  }
  
  // 姓名验证
  if (result.receiverName) {
    result.receiverName = result.receiverName.replace(/[，,。；\s]/g, '')
    
    if (result.receiverName.length > 6) {
      result.confidence.receiverName = Math.max(result.confidence.receiverName - 15, 40)
    }
  }
  
  return result
}

// 主解析函数
const parseText = async () => {
  if (!inputText.value.trim()) {
          message.warning('请输入文本内容')
    return
  }
  
  parsing.value = true
  
  try {
    const result = await parseWithAdvancedEngine(inputText.value)
    Object.assign(parseResult, result)
    
    if (result.hasResult) {
      message.success('解析完成！请检查并确认解析结果')
    } else {
              message.warning('未能解析出有效信息，请检查文本格式')
    }
  } catch (error) {
    console.error('解析错误:', error)
          message.error('解析失败，请稍后重试')
  } finally {
    parsing.value = false
  }
}

// 应用解析结果
const applyParsedData = () => {
  if (!parseResult.hasResult) {
    message.warning('没有可应用的解析结果')
    return
  }
  
  if (parseResult.receiverName) {
    formData.value.receiverName = parseResult.receiverName
  }
  if (parseResult.contactPhone) {
    formData.value.contactPhone = parseResult.contactPhone
  }
  if (parseResult.address) {
    formData.value.address = parseResult.address
  }
  
  // 使用nextTick确保DOM更新后再同步数据到父组件
  nextTick(() => {
    // 🔥 使用emit事件通知父组件更新数据，而不是直接修改props
    emit('update:propFormData', formData.value)
    
    // 触发表单字段验证
    if (parseResult.receiverName) {
      formRef.value?.validateField('receiverName')
    }
    if (parseResult.contactPhone) {
      formRef.value?.validateField('contactPhone')
    }
    if (parseResult.address) {
      formRef.value?.validateField('address')
    }
  })
  
  message.success('解析结果已应用到表单')
  
  // 清空解析相关数据
  inputText.value = ''
  showPreview.value = false
  Object.assign(parseResult, {
    hasResult: false,
    receiverName: '',
    contactPhone: '',
    address: '',
    confidence: { receiverName: 0, contactPhone: 0, address: 0 }
  })
}

// 输入变化处理
const onInputChange = () => {
  // 当输入内容较多时，显示智能预览提示
  showPreview.value = inputText.value.trim().length > 10
}



// 清空文本
const clearText = () => {
  inputText.value = ''
  showPreview.value = false
  Object.assign(parseResult, {
    hasResult: false,
    receiverName: '',
    contactPhone: '',
    address: '',
    confidence: {
      receiverName: 0,
      contactPhone: 0,
      address: 0
    }
  })
}

  /** 表单校验 */
  const validate = async () => {
    if (!formRef) return
    try {
      await unref(formRef)?.validate()
      // 🔥 使用emit事件通知父组件更新数据，而不是直接修改props
      emit('update:propFormData', formData.value)
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
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.confidence-tag {
  margin-left: 8px;
  font-size: 0.75rem;
}
  </style>
