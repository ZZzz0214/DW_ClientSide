<template>
  <ContentWrap v-loading="formLoading">
    <el-tabs v-model="activeName">
      <el-tab-pane label="组合产品基础信息" name="info">
        <InfoForm
          ref="infoRef"
          v-model:activeName="activeName"
          :is-detail="isDetail"
          :propFormData="formData"
        />
      </el-tab-pane>
      <el-tab-pane label="运费信息" name="shippingcost">
        <CostForm
          ref="shippingcostRef"
          v-model:activeName="activeName"
          :is-detail="isDetail"
          :propFormData="formData"
        />
      </el-tab-pane>
    </el-tabs>
    <el-form>
      <el-form-item style="float: right">
        <el-button v-if="!isDetail" :loading="formLoading" type="primary" @click="submitForm">
          保存
        </el-button>
        <el-button @click="close">返回</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash-es'
import { useTagsViewStore } from '@/store/modules/tagsView'
import * as ErpComboApi from '@/api/erp/product/combo/index'
import InfoForm from './InfoForm.vue'
import CostForm from './Shippingcost.vue'


defineOptions({ name: 'ErpProductAdd' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const { push, currentRoute } = useRouter() // 路由
const { params, name } = useRoute() // 查询参数
const { delView } = useTagsViewStore() // 视图操作

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const activeName = ref('info') // Tag 激活的窗口
const isDetail = ref(false) // 是否查看详情
const infoRef = ref() // 产品基础信息 Ref
const shippingcostRef = ref() // 价格信息 Ref

// 组合产品表单数据
const formData = ref<ErpComboApi.ComboVO>({
  id: undefined, // 组品编号
  name: '', // 组合产品名称
  items: [] // 订单产品清单
});

/** 获得详情 */
const getDetail = async () => {
  if ('ErpComboDetail' === name) {
    isDetail.value = true;
  }
  const id = params.id as unknown as number;
  if (id) {
    formLoading.value = true;
    try {
      const res = await ErpComboApi.ComboApi.getCombo(id)
      console.log(res);
      formData.value = res;

    } finally {
      formLoading.value = false;
    }
  }
};

/** 提交按钮 */
const submitForm = async () => {
  // 提交请求
  formLoading.value = true;
  try {
    // 校验各表单
    await unref(infoRef)?.validate();
    await unref(shippingcostRef)?.validate();
    const data = cloneDeep(unref(formData.value))
    // 确保 name 字段的值被正确设置
    if (!data.name) {
      message.error('组合产品名称不能为空');
      return;
    }
    const id = params.id as unknown as number
    if (!id) {
      await ErpComboApi.ComboApi.createCombo(data);
      message.success(t('common.createSuccess'));
    } else {
      await ErpComboApi.ComboApi.updateCombo(data);
      message.success(t('common.updateSuccess'));
    }
    close();
  } catch (error) {
    console.error('提交失败:', error);
    message.error(t('common.submitFailed'));
  } finally {
    formLoading.value = false;
  }
};
/** 关闭按钮 */
const close = () => {
  delView(unref(currentRoute))
  push({ name: 'ErpCombo' })
}

/** 初始化 */
onMounted(async () => {
  await getDetail()
})
</script>
