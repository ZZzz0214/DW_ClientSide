<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1080">
    <el-form :model="searchForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="客户编号">
            <el-input v-model="searchForm.id" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户名称">
            <el-input v-model="searchForm.name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话">
            <el-input v-model="searchForm.mobile" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button @click="handleSearch">查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="customerList" @selection-change="handleSelectionChange" ref="table">
      <el-table-column type="selection" width="55" />
      <el-table-column label="客户编号" prop="id" />
      <el-table-column label="客户名称" prop="name" />
      <el-table-column label="联系人" prop="contact" />
      <el-table-column label="联系电话" prop="mobile" />
    </el-table>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button @click="confirmSelection" type="primary">确 定</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, defineProps, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
import { CustomerApi } from '@/api/erp/sale/customer';
import { SalePriceApi } from '@/api/erp/sale/saleprice';
import { ComboApi } from '@/api/erp/product/combo';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  comboProductId: {
    type: [String, Number],
    default: null,
  },
});

const dialogVisible = ref(props.visible);
watch(() => props.visible, (newValue) => {
  dialogVisible.value = newValue;
});

const emit = defineEmits(['customer-selected', 'update:visible']);

const dialogTitle = ref('选择客户');
const searchForm = reactive({
  id: '',
  name: '',
});
const customerList = ref<any[]>([]);
const selectedCustomer = ref<any>(null);

const handleSearch = async () => {
  try {
    const params = {
      id: searchForm.id,
      name: searchForm.name,
    };
    const response = await CustomerApi.searchCustomer(params);
    if (Array.isArray(response)) {
      customerList.value = response;
    } else {
      customerList.value = []; // 如果不是数组，清空列表
    }
  } catch (error) {
    ElMessage.error('查询失败');
  }
};

const handleSelectionChange = (selection: any[]) => {
  if (selection.length > 0) {
    selectedCustomer.value = selection[0];
  } else {
    selectedCustomer.value = null;
  }
};

const confirmSelection = async () => {
  if (!selectedCustomer.value) {
    ElMessage.warning('请选择一个客户');
    return;
  }

  // 确保组品ID是数字类型
  const groupProductId = Number(props.comboProductId);
  if (!groupProductId || isNaN(groupProductId)) {
    ElMessage.error('组品ID无效，请先选择组品');
    return;
  }

  // 根据组品编号和客户名称查询销售价格表
  const searchParams = {
    groupProductId: groupProductId,
    customerName: selectedCustomer.value.name,
  };
  
  try {
    // 方案1：首先尝试标准搜索接口
    let salePriceResult = await SalePriceApi.searchSalePrice(searchParams);
    
    // 方案2：如果标准搜索失败，尝试分页查询
    if (!salePriceResult || salePriceResult.length === 0) {
      try {
        const pageParams = {
          pageNo: 1,
          pageSize: 10,
          groupProductId: searchParams.groupProductId,
          customerName: searchParams.customerName,
        };
        const pageResult = await SalePriceApi.getSalePricePage(pageParams);
        
        if (pageResult && pageResult.list && pageResult.list.length > 0) {
          salePriceResult = pageResult.list;
        }
      } catch (pageError) {
        // 分页查询失败，继续尝试其他方案
      }
    }
    
    // 方案3：如果仍然没有结果，尝试模糊查询
    if (!salePriceResult || salePriceResult.length === 0) {
      try {
        const fuzzyParams = {
          pageNo: 1,
          pageSize: 50,
          groupProductId: searchParams.groupProductId,
          // 去掉客户名称，只按组品查询
        };
        const fuzzyResult = await SalePriceApi.getSalePricePage(fuzzyParams);
        
        if (fuzzyResult && fuzzyResult.list && fuzzyResult.list.length > 0) {
          // 在结果中查找匹配的客户名称
          const matchedRecords = fuzzyResult.list.filter(item => 
            item.customerName === searchParams.customerName ||
            item.customerName?.trim() === searchParams.customerName?.trim()
          );
          
          if (matchedRecords.length > 0) {
            salePriceResult = matchedRecords;
          }
        }
      } catch (fuzzyError) {
        // 模糊查询失败，使用默认值
      }
    }
    
    if (salePriceResult && salePriceResult.length > 0) {
      const priceData = salePriceResult[0];
      
      // 获取组品信息以获取重量
      let comboWeight = 0;
      try {
        const comboInfo = await ComboApi.getCombo(groupProductId);
        
        if (comboInfo) {
          if (comboInfo.weight !== undefined && comboInfo.weight !== null) {
            comboWeight = Number(comboInfo.weight) || 0;
          }
        }
      } catch (error) {
        console.error('获取组品重量失败:', error);
      }
      
      // 返回包含完整运费信息和代发价格的数据
      emit('customer-selected', [
        {
          customerName: selectedCustomer.value.name,
          salePrice: priceData.distributionPrice || 0, // 使用代发价格作为出货单价
          shippingFeeType: priceData.shippingFeeType,
          fixedShippingFee: priceData.fixedShippingFee,
          additionalItemQuantity: priceData.additionalItemQuantity, //按件数量
          additionalItemPrice: priceData.additionalItemPrice, //按件费用
          weight: comboWeight, // 使用从组品信息获取的重量
          firstWeight: priceData.firstWeight,
          firstWeightPrice: priceData.firstWeightPrice,
          additionalWeight: priceData.additionalWeight,
          additionalWeightPrice: priceData.additionalWeightPrice
        },
      ]);
    } else {
      ElMessage.warning(`未找到组品ID: ${groupProductId} 和客户: ${selectedCustomer.value.name} 的销售价格配置。
      
请检查：
1. 销售价格表中是否存在该记录
2. 组品ID是否正确（当前: ${groupProductId}）
3. 客户名称是否完全匹配（当前: "${selectedCustomer.value.name}"）
4. 数据是否被删除或状态异常`);
      
      // 如果没有搜索到销售价格表数据，返回客户名称，价格和运费信息为默认值
      emit('customer-selected', [
        {
          customerName: selectedCustomer.value.name,
          salePrice: 0, // 默认价格为0
          shippingFeeType: 0, // 默认固定运费
          fixedShippingFee: 0, // 默认运费为0
          additionalItemQuantity: 1, //按件数量
          additionalItemPrice: 0, //按件费用
          weight: 0,
          firstWeight: 1,
          firstWeightPrice: 0,
          additionalWeight: 1,
          additionalWeightPrice: 0
        },
      ]);
    }
  } catch (error) {
    console.error('查询销售价格表失败:', error);
    console.error('错误详情:', {
      message: error.message,
      stack: error.stack,
      searchParams: searchParams
    });
    ElMessage.error('查询销售价格表失败: ' + (error.message || '未知错误'));
    
    // 出错时返回默认数据
    emit('customer-selected', [
      {
        customerName: selectedCustomer.value.name,
        salePrice: 0,
        shippingFeeType: 0,
        fixedShippingFee: 0,
        additionalItemQuantity: 1,
        additionalItemPrice: 0,
        weight: 0,
        firstWeight: 1,
        firstWeightPrice: 0,
        additionalWeight: 1,
        additionalWeightPrice: 0
      },
    ]);
  }

  dialogVisible.value = false;
  emit('update:visible', false);
};


defineExpose({
  open: () => {
    dialogVisible.value = true;
  },
});
</script>
