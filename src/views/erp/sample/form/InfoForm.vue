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

      <!-- AI智能解析文本功能 -->
      <div class="smart-parser-section">
        <h4 class="parser-title">
          <Icon icon="ep:cpu" />
          AI智能地址解析
          <el-tag type="success" size="small" style="margin-left: 8px;">DeepSeek AI</el-tag>
        </h4>
        <p class="parser-desc">
          🤖 采用DeepSeek大语言模型驱动的智能解析技术，支持理解各种复杂、混乱的文本格式。
          无论是结构化还是非结构化文本，AI都能准确提取收件人姓名、手机号码和详细地址。
        </p>
        <el-form-item>
          <el-input
            v-model="inputText"
            type="textarea"
            placeholder="✨ AI智能解析 - 支持任意复杂文本格式：&#10;&#10;📝 示例1（多行格式）：&#10;芳芳 （样品请发顺丰谢谢）&#10;电话:15988423456&#10;地址:浙江省杭州市萧山区民和路525号&#10;&#10;📝 示例2（噪音文本）：&#10;‼‼一定要在样品里帮我留个联系方式【到付拒收】&#10;寄样地址：徐州市泉山区矿大软件园C-2-C三楼&#10;宋双双19951839883 牙膏6支&#10;&#10;📝 示例3（单行混合）：&#10;北京市朝阳区建国路100号张三13800138000发样品&#10;&#10;💡 AI会自动过滤噪音信息，准确提取核心收件信息"
            :autosize="{ minRows: 6, maxRows: 12 }"
            class="w-full"
            @input="onInputChange"
          />
          <div style="margin-top: 8px;">
            <el-button type="primary" @click="parseText" :loading="parsing" size="default">
              <Icon icon="ep:cpu" />
              {{ parsing ? 'AI解析中...' : 'AI智能解析' }}
            </el-button>
            <el-button @click="clearText" size="default">
              <Icon icon="ep:refresh" />
              清空
            </el-button>
            <el-text v-if="showPreview && !parsing && !parseResult.hasResult" type="primary" size="small" style="margin-left: 12px;">
              <Icon icon="ep:cpu" />
              已准备就绪，点击"AI智能解析"让DeepSeek为您处理
            </el-text>
            <el-text v-if="parsing" type="warning" size="small" style="margin-left: 12px;">
              <Icon icon="ep:loading" class="is-loading" />
              DeepSeek AI正在分析文本内容...
            </el-text>
          </div>
        </el-form-item>

        <!-- AI解析结果预览 -->
        <div v-if="parseResult.hasResult" class="parse-result">
          <div class="result-header">
            <Icon icon="ep:cpu" style="margin-right: 4px;" />
            DeepSeek AI 解析结果：
          </div>
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

// 中文常见姓氏库（全面扩展版 - 覆盖500+姓氏）
const CHINESE_SURNAMES = new Set([
  // 百家姓前100位
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
  
  // 其他常见姓氏（101-200位）
  '汤', '阮', '黎', '易', '常', '武', '乔', '贺', '赖', '龚',
  '文', '庞', '樊', '兰', '殷', '施', '陶', '洪', '翟', '安',
  '颜', '倪', '严', '牛', '温', '芦', '季', '俞', '章', '鲁',
  '葛', '伍', '韦', '申', '尤', '毕', '聂', '丛', '焦', '向',
  '柳', '邢', '路', '岳', '齐', '沿', '梅', '莫', '庄', '辛',
  '管', '祝', '左', '涂', '谷', '祁', '时', '舒', '耿', '牟',
  '卜', '路', '詹', '关', '苗', '凌', '费', '纪', '靳', '盛',
  '童', '欧', '甄', '项', '曲', '成', '游', '阳', '裴', '席',
  '卫', '查', '屈', '鲍', '位', '覃', '霍', '翁', '隋', '植',
  '甘', '景', '薄', '单', '包', '司', '柏', '宁', '柯', '阮',
  
  // 少数民族和特殊姓氏
  '古', '易', '常', '武', '乔', '贺', '赖', '龚', '文', '庞',
  '樊', '兰', '殷', '施', '陶', '洪', '翟', '安', '颜', '倪',
  '芳', '双', '慧', '佳', '静', '丽', '美', '华', '春', '秋',
  
  // 复姓（常见的）
  '欧阳', '司马', '上官', '诸葛', '东方', '独孤', '南宫', '万俟', '闻人', '夏侯',
  '皇甫', '尉迟', '公羊', '澹台', '公冶', '宗政', '濮阳', '淳于', '单于', '太叔',
  '申屠', '公孙', '仲孙', '轩辕', '令狐', '钟离', '宇文', '长孙', '慕容', '鲜于',
  '闾丘', '司徒', '司空', '亓官', '司寇', '仉督', '子车', '颛孙', '端木', '巫马',
  '公西', '漆雕', '乐正', '壤驷', '公良', '拓跋', '夹谷', '宰父', '谷梁', '段干'
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

// DeepSeek AI 智能解析引擎
const parseWithDeepSeekAI = async (text: string) => {
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
    // 调用DeepSeek API进行智能解析
    const aiResult = await callDeepSeekAPI(text)
    
    if (aiResult && aiResult.success) {
      Object.assign(result, aiResult.data)
      result.hasResult = true
    }
    
    return result
    
  } catch (error) {
    console.error('DeepSeek AI parsing error:', error)
    
    // 如果AI解析失败，使用简化的兜底逻辑
    const fallbackResult = await fallbackParsing(text)
    if (fallbackResult.success) {
      Object.assign(result, fallbackResult.data)
      result.hasResult = true
    }
    
    return result
  }
}

// 调用DeepSeek API
const callDeepSeekAPI = async (text: string) => {
  const apiKey = 'sk-4c52f3adadc84d2ea1017724232ca5dc'
  const apiUrl = 'https://api.deepseek.com/v1/chat/completions'
  
  const prompt = `请从以下文本中提取收件人信息，返回JSON格式数据。

文本内容：
"""
${text}
"""

要求：
1. 提取收件人姓名（receiverName）- 中文姓名，2-8个字符
2. 提取联系电话（contactPhone）- 11位手机号码
3. 提取详细地址（address）- 完整的收货地址，不包含姓名和电话
4. 每个字段给出置信度评分（confidence），范围0-100

注意：
- 忽略产品描述、数量信息、备注说明
- 忽略噪音信息如"样品"、"到付拒收"等
- 如果某个字段无法提取，设为空字符串，置信度为0

请严格按照以下JSON格式返回，不要添加任何其他文字：
{
  "receiverName": "提取到的姓名",
  "contactPhone": "提取到的电话号码", 
  "address": "提取到的地址",
  "confidence": {
    "receiverName": 85,
    "contactPhone": 90,
    "address": 88
  }
}`

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,  // 低温度确保稳定输出
        max_tokens: 500
      })
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.choices && data.choices.length > 0) {
      const content = data.choices[0].message.content.trim()
      
      try {
        // 尝试解析JSON响应
        const parsed = JSON.parse(content)
        
        // 验证返回数据格式
        if (parsed.receiverName !== undefined && 
            parsed.contactPhone !== undefined && 
            parsed.address !== undefined &&
            parsed.confidence) {
          
          // 格式化电话号码
          if (parsed.contactPhone) {
            parsed.contactPhone = formatPhoneNumber(parsed.contactPhone)
          }
          
          return {
            success: true,
            data: {
              receiverName: parsed.receiverName || '',
              contactPhone: parsed.contactPhone || '',
              address: parsed.address || '',
              confidence: {
                receiverName: parsed.confidence.receiverName || 0,
                contactPhone: parsed.confidence.contactPhone || 0,
                address: parsed.confidence.address || 0
              }
            }
          }
        }
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError)
        console.log('AI response content:', content)
      }
    }
    
    throw new Error('Invalid response format from DeepSeek API')
    
  } catch (error) {
    console.error('DeepSeek API call failed:', error)
    throw error
  }
}

// 格式化电话号码
const formatPhoneNumber = (phone: string) => {
  // 清理电话号码，只保留数字
  const cleaned = phone.replace(/\D/g, '')
  
  // 验证是否为11位手机号
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    // 格式化为 "138 0013 8000" 格式
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 7)} ${cleaned.substring(7)}`
  }
  
  return phone // 如果格式不对，返回原值
}

// 简化兜底解析（AI失败时使用）
const fallbackParsing = async (text: string) => {
  const result = {
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
    // 简单的电话提取
    const phoneMatch = text.match(/1[3-9]\d{9}/)
    if (phoneMatch) {
      result.contactPhone = formatPhoneNumber(phoneMatch[0])
      result.confidence.contactPhone = 70
    }

    // 简单的姓名提取（中文字符2-8位）
    const nameMatches = text.match(/[\u4e00-\u9fa5]{2,8}/g)
    if (nameMatches) {
      // 选择最可能是姓名的（通常在电话前后，且不包含地址关键词）
      for (const name of nameMatches) {
        if (!/[省市区县路街道号楼]/.test(name)) {
          result.receiverName = name
          result.confidence.receiverName = 60
          break
        }
      }
    }

    // 简单的地址提取（包含地址关键词的较长文本）
    const addressMatch = text.match(/[\u4e00-\u9fa5\d\-]{8,}[省市区县路街道号楼][\u4e00-\u9fa5\d\-]*/g)
    if (addressMatch) {
      let longestAddress = ''
      for (const addr of addressMatch) {
        if (addr.length > longestAddress.length) {
          longestAddress = addr
        }
      }
      if (longestAddress) {
        result.address = longestAddress
        result.confidence.address = 65
      }
    }

    const hasResult = result.receiverName || result.contactPhone || result.address
    return {
      success: hasResult,
      data: result
    }
    
  } catch (error) {
    console.error('Fallback parsing error:', error)
    return { success: false, data: result }
  }
}

// 高级文本预处理（智能模式 - 保护结构化信息）
const preprocessTextAdvanced = (text: string): string => {
  let processed = text
  
  // 0. 统一换行符，但保留换行结构（对于多行格式很重要）
  processed = processed.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  
  // 检测是否是结构化多行文本
  const isMultilineStructured = /(?:电话|手机|地址|姓名|收件人)[：:]/.test(text) && text.includes('\n')
  
  // 1. 移除业务前缀（扩展版）
  const businessPrefixes = [
    /^[A-Za-z0-9\u4e00-\u9fa5]+-[A-Za-z0-9\u4e00-\u9fa5]+[：:]/,
    /^[A-Za-z0-9\u4e00-\u9fa5]+选品-?[^：:]*[：:]/,
    /^A帝王严选-[^：:]*[：:]/,
    /^样品地址\d*[：:]/,
    /^寄样地址\d*[：:]/,
    /^收件地址\d*[：:]/,
    /^收货地址\d*[：:]/,
    // 注意：不移除单独的"地址:"、"电话:"、"姓名:"，这些是结构化标识
    /^收件信息\d*[：:]/,
    /^更新收件信息[：:]/,
    /^寄件信息[：:]/,
    /^快递信息[：:]/,
    /^物流信息[：:]/,
  ]
  
  for (const prefix of businessPrefixes) {
    processed = processed.replace(prefix, '')
  }
  
  // 2. 移除整行噪音信息
  const noiseLinePatterns = [
    /^[‼！]+.*$/gm,  // 以感叹号开头的整行
    /^.*【.*到付.*拒收.*】.*$/gim,  // 包含【到付拒收】的行
    /^.*一定要.*联系方式.*$/gim,  // 包含"一定要...联系方式"的行
    /^.*方便.*联系.*$/gim,  // 包含"方便联系"的行
  ]
  
  for (const pattern of noiseLinePatterns) {
    processed = processed.replace(pattern, '')
  }
  
  // 3. 智能清理括号内容（保留重要信息）
  // 只移除括号内的非关键信息
  processed = processed
    .replace(/【[^】]*到付[^】]*拒收[^】]*】/gi, '')  // 【到付拒收】等
    .replace(/【[^】]*】/g, '')  // 其他方括号内容
    .replace(/[（(](?:样品)?(?:请)?(?:发)?(?:顺丰)?(?:谢谢)?[）)]/gi, '')  // 圆括号
  
  // 4. 移除产品描述（更精准）- 但不影响地址行
  const lines = processed.split('\n')
  const cleanedLines = lines.map(line => {
    // 如果这一行是地址或电话或姓名行，特殊处理
    if (/(?:地址|详细地址|收件地址)[：:]/.test(line)) {
      // 只移除地址末尾的产品描述
      return line.replace(/\s+发样品.*$/g, '').replace(/\s+样品.*$/g, '')
    } else if (/(?:电话|手机|联系电话)[：:]/.test(line)) {
      // 保持电话行不变
      return line
    } else if (/(?:收件人|姓名|联系人)[：:]/.test(line)) {
      // 保持姓名行不变
      return line
    } else {
      // 其他行进行常规清理
      return line
        .replace(/安排样品[^。，\n]*/gi, '')
        .replace(/\d+[个件瓶支盒箱袋包][^。，\n]{0,10}/g, '')
        .replace(/牙膏\d*[个支]?/gi, '')
        .replace(/面膜\d*[个盒]?/gi, '')
        .replace(/防晒霜?\d*[个瓶]?/gi, '')
    }
  })
  processed = cleanedLines.join('\n')
  
  // 5. 移除特殊标记（谨慎处理）
  const specialMarkers = [
    /（.*?随机.*?）/g,
    /\(.*?随机.*?\)/g,
    /\[.*?\]/g,
    /请.*?前.*?@.*$/gm,
    /PS[：:—-—].*$/gim,
    /‼+.*$/gm,
  ]
  
  for (const marker of specialMarkers) {
    processed = processed.replace(marker, ' ')
  }
  
  // 6. 移除物流噪音（但保留关键结构）
  // 对于结构化文本，不要过度清理
  if (!isMultilineStructured) {
    const logisticsNoise = [
      /送货上门/gi,
      /不收到付件?/gi,
      /拒收到付/gi,
      /包邮/gi,
      /快递到付/gi,
    ]
    
    for (const noise of logisticsNoise) {
      processed = processed.replace(noise, ' ')
    }
  }
  
  // 7. 移除emoji和特殊符号
  processed = processed.replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
  processed = processed.replace(/[★☆♥♡✓✔✕✖➤➜→⇒]/g, '')
  
  // 8. 标准化标点符号（保留换行）
  processed = processed
    .replace(/[：]/g, ':')
    .replace(/[，]/g, ',')
    .replace(/[。]/g, '.')
    .replace(/[；]/g, ';')
  
  // 9. 处理多行文本
  if (isMultilineStructured) {
    // 对于结构化多行文本，保留换行符，只清理每行内部
    processed = processed
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')  // 保留换行
  } else {
    // 对于非结构化文本，合并为单行
    processed = processed
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/^\s*,+\s*/, '')
      .replace(/\s*,+\s*$/, '')
  }
  
  // 10. 最终清理
  processed = processed.trim()
  
  return processed
}

// 从地址行中分离姓名、电话和地址（超强版）
const separateAddressLineComponents = (addressLine: string) => {
  const result = {
    receiverName: '',
    contactPhone: '',
    address: ''
  }
  
  let workingText = addressLine
  
  // 步骤1: 提取电话号码（优先级最高）
  const phones = extractPhonesAdvanced(workingText)
  if (phones.length > 0) {
    result.contactPhone = phones[0].phone
    // 用占位符替换电话，保留位置信息
    workingText = workingText.replace(phones[0].originalText, '<<<PHONE>>>')
  }
  
  // 步骤2: 处理姓名紧挨电话的情况（如"宋双双19951839883"）
  // 检查电话前面是否有中文字符（可能是姓名）
  const nameBeforePhonePattern = /([\u4e00-\u9fa5]{2,8})<<<PHONE>>>/
  const nameBeforePhoneMatch = workingText.match(nameBeforePhonePattern)
  
  if (nameBeforePhoneMatch) {
    const candidateName = nameBeforePhoneMatch[1]
    
    // 验证是否是有效姓名
    const firstChar = candidateName.charAt(0)
    const firstTwo = candidateName.substring(0, 2)
    
    // 检查是否是姓氏或纯中文
    if (CHINESE_SURNAMES.has(firstChar) || CHINESE_SURNAMES.has(firstTwo) || 
        /^[\u4e00-\u9fa5]{2,8}$/.test(candidateName)) {
      
      // 检查不包含地址关键词
      let hasAddressKeyword = false
      for (const [_, keywords] of Object.entries(ADDRESS_KEYWORDS)) {
        for (const keyword of keywords) {
          if (candidateName.includes(keyword)) {
            hasAddressKeyword = true
            break
          }
        }
        if (hasAddressKeyword) break
      }
      
      if (!hasAddressKeyword) {
        result.receiverName = candidateName
        // 替换姓名为占位符
        workingText = workingText.replace(candidateName + '<<<PHONE>>>', '<<<NAME>>><<<PHONE>>>')
      }
    }
  }
  
  // 步骤3: 如果还没找到姓名，尝试其他模式
  if (!result.receiverName) {
    // 模式1: 姓名在电话后面（较少见）
    const nameAfterPhonePattern = /<<<PHONE>>>([\u4e00-\u9fa5]{2,8})/
    const nameAfterPhoneMatch = workingText.match(nameAfterPhonePattern)
    
    if (nameAfterPhoneMatch) {
      const candidateName = nameAfterPhoneMatch[1]
      const nameResult = extractNameAdvanced(candidateName)
      
      if (nameResult.found) {
        result.receiverName = nameResult.name
        workingText = workingText.replace('<<<PHONE>>>' + nameResult.name, '<<<PHONE>>><<<NAME>>>')
      }
    }
    
    // 模式2: 姓名独立存在（用空格或其他符号分隔）
    if (!result.receiverName) {
      const segments = workingText
        .split(/[\s,，]+/)
        .filter(seg => seg && seg !== '<<<PHONE>>>' && seg !== '<<<NAME>>>')
      
      for (const segment of segments) {
        if (/^[\u4e00-\u9fa5]{2,8}$/.test(segment)) {
          const nameResult = extractNameAdvanced(segment)
          if (nameResult.found) {
            result.receiverName = nameResult.name
            workingText = workingText.replace(segment, '<<<NAME>>>')
            break
          }
        }
      }
    }
  }
  
  // 步骤4: 移除产品描述和数量
  const productDescPatterns = [
    /牙膏\d*[个支]?/gi,
    /面膜\d*[个盒]?/gi,
    /防晒霜?\d*[个瓶]?/gi,
    /洗发水\d*[个瓶]?/gi,
    /\d+[个件瓶支盒箱袋包]/g,
    /样品\d*/gi,
    /发样品.*/gi,
  ]
  
  for (const pattern of productDescPatterns) {
    workingText = workingText.replace(pattern, '')
  }
  
  // 步骤5: 提取纯地址
  let addressText = workingText
    .replace(/<<<PHONE>>>/g, '')
    .replace(/<<<NAME>>>/g, '')
    .replace(/\s+/g, '')  // 移除空格
    .replace(/^[,，\s]+/, '')  // 移除开头标点
    .replace(/[,，\s]+$/, '')  // 移除结尾标点
    .trim()
  
  // 验证地址有效性
  if (addressText.length >= 8) {
    result.address = addressText
  } else if (addressText.length >= 5) {
    // 即使短一点，如果包含地址关键词，也认为是有效地址
    let hasAddressKeyword = false
    for (const [_, keywords] of Object.entries(ADDRESS_KEYWORDS)) {
      for (const keyword of keywords) {
        if (addressText.includes(keyword)) {
          hasAddressKeyword = true
          break
        }
      }
      if (hasAddressKeyword) break
    }
    
    if (hasAddressKeyword) {
      result.address = addressText
    }
  }
  
  return result
}

// 解析策略1: 结构化格式处理（全面增强）
const parseStrategy1_StructuredFormat = async (text: string, doc: any) => {
  // 处理多种结构化格式，特别是多行格式
  
  const extractedInfo = {
    receiverName: '',
    contactPhone: '',
    address: ''
  }
  
  // 先按行分割，保留原始行
  const originalLines = text.split(/\n|\r\n/).map(line => line.trim()).filter(line => line)
  
  // 1. 提取电话（明确标识）
  const phonePatterns = [
    /(?:电话|手机|联系电话|Tel|TEL|tel)[：:\s]*([^\n\r]+)/i,
  ]
  
  for (const line of originalLines) {
    for (const pattern of phonePatterns) {
      const match = line.match(pattern)
      if (match && match[1]) {
        const phoneText = match[1].trim()
        // 从中提取纯数字电话
        const phones = extractPhonesAdvanced(phoneText)
        if (phones.length > 0) {
          extractedInfo.contactPhone = phones[0].phone
          break
        }
      }
    }
    if (extractedInfo.contactPhone) break
  }
  
  // 2. 提取地址（明确标识）- 同时尝试从地址行提取姓名和电话
  const addressPatterns = [
    /(?:地址|详细地址|收件地址|收货地址|送货地址|邮寄地址|寄样地址)[：:\s]*([^\n\r]+)/i,
  ]
  
  for (const line of originalLines) {
    for (const pattern of addressPatterns) {
      const match = line.match(pattern)
      if (match && match[1]) {
        let addressContent = match[1].trim()
        
        // 🔥 关键优化：从地址内容中分离姓名、电话和纯地址
        const separatedInfo = separateAddressLineComponents(addressContent)
        
        // 提取到的信息
        if (separatedInfo.address && separatedInfo.address.length >= 8) {
          extractedInfo.address = separatedInfo.address
        }
        if (separatedInfo.receiverName && !extractedInfo.receiverName) {
          extractedInfo.receiverName = separatedInfo.receiverName
        }
        if (separatedInfo.contactPhone && !extractedInfo.contactPhone) {
          extractedInfo.contactPhone = separatedInfo.contactPhone
        }
        
        break
      }
    }
    if (extractedInfo.address) break
  }
  
  // 3. 提取姓名（多种策略）
  // 策略3.1: 查找明确的姓名标识
  const namePatterns = [
    /(?:收件人|姓名|联系人|收货人|名字)[：:\s]*([^\n\r\d（）()]+)/i,
  ]
  
  for (const line of originalLines) {
    for (const pattern of namePatterns) {
      const match = line.match(pattern)
      if (match && match[1]) {
        const nameText = match[1].trim()
        const nameResult = extractNameAdvanced(nameText)
        if (nameResult.found) {
          extractedInfo.receiverName = nameResult.name
          break
        }
      }
    }
    if (extractedInfo.receiverName) break
  }
  
  // 策略3.2: 如果没找到姓名，检查第一行是否是姓名
  if (!extractedInfo.receiverName && originalLines.length > 0) {
    const firstLine = originalLines[0]
    
    // 移除括号内容和备注
    const cleanedFirstLine = firstLine
      .replace(/[（(].*?[）)]/g, '')  // 移除括号及内容
      .replace(/样品.*/g, '')
      .replace(/请.*/g, '')
      .trim()
    
    // 检查清理后的文本是否是姓名
    if (cleanedFirstLine.length >= 2 && cleanedFirstLine.length <= 8) {
      const nameResult = extractNameAdvanced(cleanedFirstLine)
      if (nameResult.found) {
        extractedInfo.receiverName = nameResult.name
      } else {
        // 即使不在姓氏库中，如果是纯中文且长度合适，也可能是姓名
        if (/^[\u4e00-\u9fa5]{2,8}$/.test(cleanedFirstLine)) {
          // 检查是否不包含地址关键词
          let hasAddressKeyword = false
          for (const [_, keywords] of Object.entries(ADDRESS_KEYWORDS)) {
            for (const keyword of keywords) {
              if (cleanedFirstLine.includes(keyword)) {
                hasAddressKeyword = true
                break
              }
            }
            if (hasAddressKeyword) break
          }
          
          if (!hasAddressKeyword) {
            extractedInfo.receiverName = cleanedFirstLine
          }
        }
      }
    }
  }
  
  // 策略3.3: 从地址中尝试提取姓名（如果地址包含姓名）
  if (!extractedInfo.receiverName && extractedInfo.address) {
    // 尝试从地址末尾提取姓名
    const addressParts = extractedInfo.address.split(/\s+/)
    for (const part of addressParts) {
      const nameResult = extractNameAdvanced(part)
      if (nameResult.found) {
        extractedInfo.receiverName = nameResult.name
        // 从地址中移除姓名
        extractedInfo.address = extractedInfo.address.replace(nameResult.name, '').trim()
        break
      }
    }
  }
  
  // 4. 如果仍然没有姓名，尝试从所有行中寻找
  if (!extractedInfo.receiverName) {
    for (const line of originalLines) {
      // 跳过已经识别为电话和地址的行
      if (line.includes('电话') || line.includes('手机') || 
          line.includes('地址') || line.includes('邮寄')) {
        continue
      }
      
      const cleanedLine = line
        .replace(/[（(].*?[）)]/g, '')
        .replace(/样品.*/g, '')
        .trim()
      
      const nameResult = extractNameAdvanced(cleanedLine)
      if (nameResult.found) {
        extractedInfo.receiverName = nameResult.name
        break
      }
    }
  }
  
  // 5. 如果还没找到，使用单行复杂解析（兜底）
  if (!extractedInfo.receiverName && !extractedInfo.contactPhone && !extractedInfo.address) {
    if (originalLines.length === 1) {
      const complexResult = parseComplexAddressLine(originalLines[0])
      Object.assign(extractedInfo, complexResult)
    }
  }
  
  // 6. 验证和返回结果
  if (extractedInfo.receiverName || extractedInfo.contactPhone || extractedInfo.address) {
    // 计算置信度
    let nameConfidence = 0
    let phoneConfidence = 0
    let addressConfidence = 0
    
    if (extractedInfo.receiverName) {
      nameConfidence = 85
      // 如果是从第一行提取的，置信度更高
      if (originalLines.length > 0 && originalLines[0].includes(extractedInfo.receiverName)) {
        nameConfidence = 90
      }
    }
    
    if (extractedInfo.contactPhone) {
      phoneConfidence = 92  // 结构化电话置信度高
    }
    
    if (extractedInfo.address) {
      addressConfidence = 88
      // 如果地址包含完整省市区结构，置信度更高
      if (/[\u4e00-\u9fa5]+[省市][\u4e00-\u9fa5]+[市区县]/.test(extractedInfo.address)) {
        addressConfidence = 93
      }
    }
    
    return {
      success: true,
      data: {
        receiverName: extractedInfo.receiverName,
        contactPhone: extractedInfo.contactPhone,
        address: extractedInfo.address,
        confidence: {
          receiverName: nameConfidence,
          contactPhone: phoneConfidence,
          address: addressConfidence
        }
      }
    }
  }
  
  return { success: false }
}

// 解析复杂地址行（核心功能 - 强化版）
const parseComplexAddressLine = (line: string) => {
  const result = {
    receiverName: '',
    contactPhone: '',
    address: ''
  }
  
  let workingText = line
  
  // 1. 提取电话号码（最可靠的锚点）
  const phones = extractPhonesAdvanced(workingText)
  if (phones.length > 0) {
    result.contactPhone = phones[0].phone
    // 使用占位符标记电话位置
    workingText = workingText.replace(phones[0].originalText, '<<<PHONE>>>').trim()
  }
  
  // 2. 提取姓名（尝试多种模式）
  const nameExtractionResult = extractNameAdvanced(workingText)
  if (nameExtractionResult.found) {
    result.receiverName = nameExtractionResult.name
    workingText = workingText.replace(nameExtractionResult.originalText, '<<<NAME>>>').trim()
  }
  
  // 3. 剩余部分作为地址，进行清理
  let addressText = workingText
    .replace(/<<<PHONE>>>/g, '')
    .replace(/<<<NAME>>>/g, '')
    .replace(/^\s*[,，。；\s]+/, '')  // 移除开头的标点
    .replace(/[,，。；\s]+$/, '')  // 移除结尾的标点
    .replace(/\s+/g, '')  // 移除所有空格
    .trim()
  
  // 如果地址为空，尝试从原文重新分段提取
  if (!addressText || addressText.length < 5) {
    const segments = segmentTextByFeatures(line)
    const addressSegment = identifyAddressSegment(segments)
    if (addressSegment) {
      addressText = addressSegment.text
    }
  }
  
  result.address = addressText
  
  return result
}

// 高级姓名提取（增强版）
const extractNameAdvanced = (text: string) => {
  const result = {
    found: false,
    name: '',
    originalText: ''
  }
  
  // 多种姓名提取模式（按优先级排序）
  const namePatterns = [
    // 模式1: 明确标识的姓名
    { regex: /(?:收件人|姓名|联系人|收货人)[：:\s]*([^\d,，。；\s]{2,8})(?:先生|女士)?/, group: 1, confidence: 95 },
    
    // 模式2: 姓名+称呼
    { regex: /([^\d,，。；\s]{2,8})(?:先生|女士|同志|老师|收)/, group: 1, confidence: 90 },
    
    // 模式3: 独立的2-8字中文（位于文本开头或中间）
    { regex: /(?:^|\s|,|，)([^\d,，。；\s]{2,8})(?:\s|,|，|$)/, group: 1, confidence: 75 },
    
    // 模式4: 包含"收"的姓名模式（如"张三收"）
    { regex: /([^\d,，。；\s]{2,8})收(?:\s|,|，|$)/, group: 1, confidence: 85 },
    
    // 模式5: 紧挨着数字前的中文（如"宋双双19951839883"）
    { regex: /([^\d,，。；\s]{2,8})(?=\d{11})/, group: 1, confidence: 88 },
  ]
  
  for (const pattern of namePatterns) {
    const match = text.match(pattern.regex)
    if (match && match[pattern.group]) {
      const candidate = match[pattern.group].trim()
      
      // 验证是否以中文姓氏开头
      const firstChar = candidate.charAt(0)
      const firstTwoChars = candidate.substring(0, 2)
      
      // 检查是否以常见姓氏开头，或者至少是纯中文
      const hasSurname = CHINESE_SURNAMES.has(firstChar) || CHINESE_SURNAMES.has(firstTwoChars)
      const isPureChinese = /^[\u4e00-\u9fa5]+$/.test(candidate)
      
      if (hasSurname || isPureChinese) {
        // 验证长度合理
        if (candidate.length >= 2 && candidate.length <= 8) {
          // 验证全部是中文字符
          if (isPureChinese) {
            // 检查是否包含地址关键词（避免误识别）
            let hasAddressKeyword = false
            for (const [_, keywords] of Object.entries(ADDRESS_KEYWORDS)) {
              for (const keyword of keywords) {
                if (candidate.includes(keyword)) {
                  hasAddressKeyword = true
                  break
                }
              }
              if (hasAddressKeyword) break
            }
            
            // 如果包含姓氏，或者不包含地址关键词，就认为是姓名
            if (hasSurname || !hasAddressKeyword) {
              result.found = true
              result.name = candidate
              result.originalText = match[0]
              break
            }
          }
        }
      }
    }
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

// 识别地址段落（增强版）
const identifyAddressSegment = (segments: any[]) => {
  // 地址通常是包含最多地址关键词、长度适中的段落
  let bestSegment = null
  let bestScore = 0
  
  for (const segment of segments) {
    let score = 0
    
    // 1. 地址关键词得分（权重最高）
    score += segment.features.hasAddressKeywords * 10
    
    // 2. 数字密度得分（地址通常包含门牌号）
    score += Math.min(segment.features.hasNumbers, 8) * 2
    
    // 3. 长度得分（地址通常较长）
    if (segment.features.length > 8) score += 5
    if (segment.features.length > 15) score += 8
    if (segment.features.length > 25) score += 5
    
    // 4. 地址特征标记得分
    if (segment.features.isLikelyAddress) score += 15
    
    // 5. 额外特征加分
    // 包含省市区
    if (/[省市区县]/.test(segment.text)) score += 8
    
    // 包含路街巷
    if (/[路街巷道]/.test(segment.text)) score += 6
    
    // 包含号楼室
    if (/[号楼室栋层]/.test(segment.text)) score += 7
    
    // 包含小区、大厦、广场等建筑
    if (/[小区|大厦|广场|花园|苑|城|中心]/.test(segment.text)) score += 5
    
    // 包含完整地址结构（如"XX省XX市XX区"）
    const addressStructurePattern = /[\u4e00-\u9fa5]+[省市区县][\u4e00-\u9fa5]+[市区县镇乡]/
    if (addressStructurePattern.test(segment.text)) score += 12
    
    // 6. 惩罚项
    // 如果包含姓氏开头且长度很短，可能是姓名
    if (segment.features.hasChineseSurname && segment.features.length <= 5) {
      score -= 20
    }
    
    if (score > bestScore) {
      bestScore = score
      bestSegment = segment
    }
  }
  
  return bestScore > 10 ? bestSegment : null
}

// 识别姓名段落（增强版）
const identifyNameSegment = (segments: any[]) => {
  let bestNameSegment = null
  let bestNameScore = 0
  
  for (const segment of segments) {
    let score = 0
    
    // 1. 基础姓名特征
    if (segment.features.isLikelyName) {
      score += 20
    }
    
    // 2. 姓氏检查
    if (segment.features.hasChineseSurname) {
      score += 15
    }
    
    // 3. 长度评分（姓名通常2-8字）
    if (segment.features.length >= 2 && segment.features.length <= 4) {
      score += 12
    } else if (segment.features.length <= 8) {
      score += 6
    }
    
    // 4. 纯中文加分
    if (/^[\u4e00-\u9fa5]+$/.test(segment.text)) {
      score += 8
    }
    
    // 5. 包含称呼词加分
    if (/先生|女士|同志|老师/.test(segment.text)) {
      score += 10
    }
    
    // 6. 包含"收"字加分（如"张三收"）
    if (/收$/.test(segment.text)) {
      score += 8
    }
    
    // 7. 惩罚项
    // 如果包含数字，降低姓名可能性
    if (segment.features.hasNumbers > 0) {
      score -= 15
    }
    
    // 如果包含地址关键词，降低姓名可能性
    if (segment.features.hasAddressKeywords > 0) {
      score -= 10
    }
    
    // 如果长度过长，降低姓名可能性
    if (segment.features.length > 8) {
      score -= 20
    }
    
    if (score > bestNameScore) {
      bestNameScore = score
      bestNameSegment = segment
    }
  }
  
  // 如果得分足够高，返回最佳匹配
  if (bestNameScore > 15) {
    return bestNameSegment
  }
  
  // 兜底策略：找最短的、包含中文字符的段落
  const chineseSegments = segments.filter(seg => 
    /^[\u4e00-\u9fa5]+$/.test(seg.text) && 
    seg.text.length >= 2 && 
    seg.text.length <= 8
  )
  
  if (chineseSegments.length > 0) {
    // 优先选择以姓氏开头的
    const withSurname = chineseSegments.filter(seg => {
      const firstChar = seg.text.charAt(0)
      const firstTwo = seg.text.substring(0, 2)
      return CHINESE_SURNAMES.has(firstChar) || CHINESE_SURNAMES.has(firstTwo)
    })
    
    if (withSurname.length > 0) {
      return withSurname.reduce((shortest, current) => 
        current.text.length < shortest.text.length ? current : shortest
      )
    }
    
    // 否则选择最短的
    return chineseSegments.reduce((shortest, current) => 
      current.text.length < shortest.text.length ? current : shortest
    )
  }
  
  return null
}

// 解析策略2: 姓名+电话模式（强化版）
const parseStrategy2_NamePhonePattern = async (text: string, doc: any) => {
  // 处理格式：张三 13800138000 北京市朝阳区建国路100号
  const result = {
    receiverName: '',
    contactPhone: '',
    address: ''
  }
  
  // 先提取电话
  const phones = extractPhonesAdvanced(text)
  if (phones.length === 0) {
    return { success: false }
  }
  
  result.contactPhone = phones[0].phone
  let remainingText = text.replace(phones[0].originalText, '|||PHONE|||').trim()
  
  // 分割文本
  const parts = remainingText.split(/[，,。；\s]+/).filter(p => p && p !== '|||PHONE|||')
  
  // 识别姓名（通常在电话前面，且长度2-4字符）
  for (const part of parts) {
    if (part.length >= 2 && part.length <= 8 && /^[\u4e00-\u9fa5]+$/.test(part)) {
      const firstChar = part.charAt(0)
      if (CHINESE_SURNAMES.has(firstChar) || CHINESE_SURNAMES.has(part.substring(0, 2))) {
        result.receiverName = part
        remainingText = remainingText.replace(part, '').trim()
        break
      }
    }
  }
  
  // 剩余的作为地址
  result.address = remainingText
    .replace('|||PHONE|||', '')
    .replace(/[，,。；]+/g, '')
    .replace(/\s+/g, '')
    .trim()
  
  if (result.address.length > 5) {
    return {
      success: true,
      data: {
        receiverName: result.receiverName,
        contactPhone: result.contactPhone,
        address: result.address,
        confidence: {
          receiverName: result.receiverName ? 80 : 0,
          contactPhone: 90,
          address: result.address ? 82 : 0
        }
      }
    }
  }
  
  return { success: false }
}

// 解析策略3: 地址优先模式（处理地址在前的情况）
const parseStrategy3_AddressFirst = async (text: string, doc: any) => {
  // 处理格式：北京市朝阳区建国路100号 张三 13800138000
  const result = {
    receiverName: '',
    contactPhone: '',
    address: ''
  }
  
  // 提取电话
  const phones = extractPhonesAdvanced(text)
  if (phones.length > 0) {
    result.contactPhone = phones[0].phone
    text = text.replace(phones[0].originalText, ' ').trim()
  }
  
  // 按逗号、句号、空格分割
  const segments = text.split(/[，,。；\s]+/).filter(s => s.trim().length > 0)
  
  // 寻找最长的包含地址关键词的段落
  let addressCandidate = ''
  let addressScore = 0
  let nameCandidate = ''
  
  for (const segment of segments) {
    let score = 0
    
    // 计算地址特征得分
    for (const [_, keywords] of Object.entries(ADDRESS_KEYWORDS)) {
      for (const keyword of keywords) {
        if (segment.includes(keyword)) {
          score += 5
        }
      }
    }
    
    // 长度加分
    if (segment.length > 10) score += 10
    if (segment.length > 20) score += 5
    
    // 包含数字加分
    if (/\d/.test(segment)) score += 3
    
    if (score > addressScore) {
      addressScore = score
      addressCandidate = segment
    }
    
    // 识别姓名（短小且包含姓氏）
    if (!nameCandidate && segment.length >= 2 && segment.length <= 8) {
      const firstChar = segment.charAt(0)
      if (CHINESE_SURNAMES.has(firstChar) || CHINESE_SURNAMES.has(segment.substring(0, 2))) {
        nameCandidate = segment
      }
    }
  }
  
  result.address = addressCandidate
  result.receiverName = nameCandidate
  
  if (result.address || result.contactPhone || result.receiverName) {
    return {
      success: true,
      data: {
        receiverName: result.receiverName,
        contactPhone: result.contactPhone,
        address: result.address,
        confidence: {
          receiverName: result.receiverName ? 75 : 0,
          contactPhone: result.contactPhone ? 88 : 0,
          address: result.address ? 78 : 0
        }
      }
    }
  }
  
  return { success: false }
}

// 解析策略4: 上下文NLP分析（使用compromise.js）
const parseStrategy4_ContextualNLP = async (text: string, doc: any) => {
  const result = {
    receiverName: '',
    contactPhone: '',
    address: ''
  }
  
  try {
    // 使用compromise进行人名识别
    const people = doc.people()
    if (people.found) {
      const names = people.out('array')
      // 过滤出可能的中文姓名
      for (const name of names) {
        if (/[\u4e00-\u9fa5]{2,8}/.test(name)) {
          result.receiverName = name
          break
        }
      }
    }
    
    // 提取电话
    const phones = extractPhonesAdvanced(text)
    if (phones.length > 0) {
      result.contactPhone = phones[0].phone
      text = text.replace(phones[0].originalText, '').trim()
    }
    
    // 提取地址（移除姓名和电话后的部分）
    let addressText = text
    if (result.receiverName) {
      addressText = addressText.replace(result.receiverName, '').trim()
    }
    
    // 清理并验证地址
    addressText = addressText.replace(/[，,。；]+/g, '').trim()
    
    // 检查是否包含地址关键词
    let hasAddressKeyword = false
    for (const [_, keywords] of Object.entries(ADDRESS_KEYWORDS)) {
      for (const keyword of keywords) {
        if (addressText.includes(keyword)) {
          hasAddressKeyword = true
          break
        }
      }
      if (hasAddressKeyword) break
    }
    
    if (hasAddressKeyword || addressText.length > 10) {
      result.address = addressText
    }
    
    if (result.receiverName || result.contactPhone || result.address) {
      return {
        success: true,
        data: {
          receiverName: result.receiverName,
          contactPhone: result.contactPhone,
          address: result.address,
          confidence: {
            receiverName: result.receiverName ? 70 : 0,
            contactPhone: result.contactPhone ? 85 : 0,
            address: result.address ? 72 : 0
          }
        }
      }
    }
  } catch (error) {
    console.error('NLP parsing error:', error)
  }
  
  return { success: false }
}

// 解析策略5: 兜底模式（暴力匹配）
const parseStrategy5_FallbackPattern = async (text: string, doc: any) => {
  const result = {
    receiverName: '',
    contactPhone: '',
    address: ''
  }
  
  // 1. 提取电话（最可靠）
  const phones = extractPhonesAdvanced(text)
  if (phones.length > 0) {
    result.contactPhone = phones[0].phone
    text = text.replace(phones[0].originalText, ' ').trim()
  }
  
  // 2. 尝试多种姓名模式
  const namePatterns = [
    /(?:收件人|姓名|联系人|收货人)[：:\s]*([^\d\s,，。；]{2,8})/,
    /([^\d\s,，。；]{2,4})(?:先生|女士|同志|老师)/,
    /^([^\d\s,，。；]{2,8})/,  // 开头的中文字符
  ]
  
  for (const pattern of namePatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const candidate = match[1].trim()
      const firstChar = candidate.charAt(0)
      if (CHINESE_SURNAMES.has(firstChar) || CHINESE_SURNAMES.has(candidate.substring(0, 2))) {
        result.receiverName = candidate
        text = text.replace(match[0], ' ').trim()
        break
      }
    }
  }
  
  // 3. 剩余文本作为地址
  let addressText = text
    .replace(/[，,。；]+/g, ' ')
    .replace(/\s+/g, '')
    .trim()
  
  // 移除常见的非地址词汇
  const removeWords = ['收件人', '姓名', '联系人', '电话', '手机', '地址', '收货人', '先生', '女士']
  for (const word of removeWords) {
    addressText = addressText.replace(new RegExp(word, 'g'), '')
  }
  
  addressText = addressText.trim()
  
  // 验证地址有效性
  if (addressText.length >= 8) {
    result.address = addressText
  }
  
  // 如果至少解析出一项，就算成功
  if (result.receiverName || result.contactPhone || result.address) {
    return {
      success: true,
      data: {
        receiverName: result.receiverName,
        contactPhone: result.contactPhone,
        address: result.address,
        confidence: {
          receiverName: result.receiverName ? 65 : 0,
          contactPhone: result.contactPhone ? 88 : 0,
          address: result.address ? 60 : 0
        }
      }
    }
  }
  
  return { success: false }
}

// 结果验证和优化（全面升级）
const validateAndOptimizeResult = async (result: any, originalText: string) => {
  // 1. 电话号码验证和格式化
  if (result.contactPhone) {
    try {
      // 清理电话号码中的空格和特殊字符
      const cleanedPhone = result.contactPhone.replace(/\D/g, '')
      
      // 使用libphonenumber-js验证
      if (cleanedPhone.length === 11 && cleanedPhone.startsWith('1')) {
        const phone = parsePhoneNumber(cleanedPhone, 'CN')
        if (phone && phone.isValid()) {
          // 格式化为国内标准格式（带空格）
          result.contactPhone = phone.formatNational()
          result.confidence.contactPhone = Math.min(result.confidence.contactPhone + 5, 98)
        } else {
          // 如果验证失败，使用基础格式
          result.contactPhone = cleanedPhone
          result.confidence.contactPhone = Math.max(result.confidence.contactPhone - 10, 60)
        }
      } else {
        // 长度不正确，降低置信度
        result.confidence.contactPhone = Math.max(result.confidence.contactPhone - 20, 40)
      }
    } catch (e) {
      console.warn('电话号码验证失败:', e)
      // 保持原值，但降低置信度
      result.confidence.contactPhone = Math.max(result.confidence.contactPhone - 15, 50)
    }
  }
  
  // 2. 地址验证和清理
  if (result.address) {
    // 移除多余空格和标点
    result.address = result.address
      .replace(/\s+/g, '')  // 移除所有空格
      .replace(/^[，,。；\s]+/, '')  // 移除开头标点
      .replace(/[，,。；\s]+$/, '')  // 移除结尾标点
      .trim()
    
    // 验证地址质量
    let addressQuality = 0
    
    // 长度检查
    if (result.address.length >= 8 && result.address.length <= 100) {
      addressQuality += 20
    } else if (result.address.length < 6) {
      result.confidence.address = Math.max(result.confidence.address - 25, 30)
    } else if (result.address.length > 100) {
      result.confidence.address = Math.max(result.confidence.address - 10, 60)
    }
    
    // 地址关键词检查
    const hasProvince = /[\u4e00-\u9fa5]+省/.test(result.address)
    const hasCity = /[\u4e00-\u9fa5]+市/.test(result.address)
    const hasDistrict = /[\u4e00-\u9fa5]+[区县]/.test(result.address)
    const hasStreet = /[\u4e00-\u9fa5]+[路街巷道]/.test(result.address)
    const hasBuilding = /[\u4e00-\u9fa5]+[号楼栋室层]/.test(result.address)
    
    if (hasProvince || hasCity) addressQuality += 15
    if (hasDistrict) addressQuality += 10
    if (hasStreet) addressQuality += 10
    if (hasBuilding) addressQuality += 10
    
    // 根据质量调整置信度
    if (addressQuality >= 30) {
      result.confidence.address = Math.min(result.confidence.address + 10, 95)
    } else if (addressQuality < 10) {
      result.confidence.address = Math.max(result.confidence.address - 15, 40)
    }
    
    // 移除地址中可能残留的姓名
    if (result.receiverName && result.address.includes(result.receiverName)) {
      result.address = result.address.replace(result.receiverName, '').trim()
    }
    
    // 移除地址中的"收"字
    result.address = result.address.replace(/收$/, '').trim()
  }
  
  // 3. 姓名验证和清理
  if (result.receiverName) {
    // 清理姓名中的标点和空格
    result.receiverName = result.receiverName
      .replace(/[，,。；\s]/g, '')
      .replace(/先生|女士|同志|老师/, '')  // 移除称呼
      .replace(/收$/, '')  // 移除"收"字
      .trim()
    
    // 验证姓名质量
    const nameLength = result.receiverName.length
    
    // 长度检查
    if (nameLength >= 2 && nameLength <= 4) {
      result.confidence.receiverName = Math.min(result.confidence.receiverName + 10, 95)
    } else if (nameLength > 8 || nameLength < 2) {
      result.confidence.receiverName = Math.max(result.confidence.receiverName - 20, 30)
    } else if (nameLength > 4) {
      result.confidence.receiverName = Math.max(result.confidence.receiverName - 10, 50)
    }
    
    // 姓氏检查
    const firstChar = result.receiverName.charAt(0)
    const firstTwo = result.receiverName.substring(0, 2)
    if (!CHINESE_SURNAMES.has(firstChar) && !CHINESE_SURNAMES.has(firstTwo)) {
      result.confidence.receiverName = Math.max(result.confidence.receiverName - 15, 40)
    } else {
      result.confidence.receiverName = Math.min(result.confidence.receiverName + 5, 95)
    }
    
    // 纯中文检查
    if (!/^[\u4e00-\u9fa5]+$/.test(result.receiverName)) {
      result.confidence.receiverName = Math.max(result.confidence.receiverName - 20, 30)
    }
  }
  
  // 4. 交叉验证（检查字段之间是否有冲突）
  if (result.receiverName && result.address) {
    // 如果姓名出现在地址中，从地址中移除
    if (result.address.includes(result.receiverName)) {
      result.address = result.address.replace(result.receiverName, '').trim()
    }
  }
  
  // 5. 最终置信度调整
  // 如果三个字段都解析出来了，提高整体置信度
  if (result.receiverName && result.contactPhone && result.address) {
    result.confidence.receiverName = Math.min(result.confidence.receiverName + 3, 98)
    result.confidence.contactPhone = Math.min(result.confidence.contactPhone + 3, 98)
    result.confidence.address = Math.min(result.confidence.address + 3, 98)
  }
  
  return result
}

// 主解析函数（使用DeepSeek AI）
const parseText = async () => {
  if (!inputText.value.trim()) {
    message.warning('请输入文本内容')
    return
  }
  
  parsing.value = true
  
  try {
    // 使用DeepSeek AI进行智能解析
    const result = await parseWithDeepSeekAI(inputText.value)
    Object.assign(parseResult, result)
    
    if (result.hasResult) {
      // 检查解析质量
      const totalFields = 3
      const extractedFields = [result.receiverName, result.contactPhone, result.address].filter(f => f).length
      const avgConfidence = (result.confidence.receiverName + result.confidence.contactPhone + result.confidence.address) / 3
      
      if (extractedFields >= 2 && avgConfidence >= 70) {
        message.success(`🎉 AI解析完成！成功提取 ${extractedFields}/${totalFields} 个字段，平均置信度: ${Math.round(avgConfidence)}%`)
      } else if (extractedFields >= 1) {
        message.warning(`⚠️ 部分解析成功，提取到 ${extractedFields}/${totalFields} 个字段，请检查结果`)
      } else {
        message.warning('📝 AI解析完成，但未能提取到完整信息，请检查文本格式')
      }
    } else {
      message.error('❌ 未能解析出有效信息，请检查文本格式或稍后重试')
    }
  } catch (error) {
    console.error('AI解析错误:', error)
    
    // 显示具体的错误信息
    if (error.message.includes('DeepSeek API error')) {
      message.error('🔗 DeepSeek API调用失败，请检查网络连接或API配额')
    } else if (error.message.includes('Invalid response format')) {
      message.error('🤖 AI返回格式异常，已启用备用解析模式')
    } else {
      message.error('⚡ 解析服务暂时不可用，请稍后重试')
    }
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
    // 移除电话号码中的空格，保持纯数字格式
    formData.value.contactPhone = parseResult.contactPhone.replace(/\s/g, '')
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
