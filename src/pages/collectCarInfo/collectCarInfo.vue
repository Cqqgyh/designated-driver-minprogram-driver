<template>
  <tm-app>
    <tm-form @submit="confirm" ref="formRef" v-model="formData" :label-width="190">
      <!--      车前照-->
      <tm-form-item required label="车前照" field="carFrontUrl" :rules="{ required: true, message: '请上传车前照' }">
        <upload-images :maxFile="1" :rows="3" :width="420" :default-value="formData.carFrontUrl" v-model="formData.carFrontUrl"></upload-images>
      </tm-form-item>
      <!--      车前照-->
      <tm-form-item required label="车后照" field="carBackUrl" :rules="{ required: true, message: '请上传车后照' }">
        <upload-images :maxFile="1" :rows="3" :width="420" :default-value="formData.carBackUrl" v-model="formData.carBackUrl"></upload-images>
      </tm-form-item>

      <!--      车牌-->
      <tm-form-item
        required
        label="车牌号"
        showError
        field="carLicense"
        :rules="[
          { required: true, message: '不能为空', validator: (val) => val.length > 0 },
          { required: true, message: '请输入正确的车牌号', validator: (val) => carNo(val) }
        ]"
      >
        <!-- 不要问我为什么用v-model.lazy，我很受伤。 -->
        <tm-input
          :inputPadding="[0, 0]"
          placeholder="请输入车牌号"
          v-model.lazy="formData.carLicense"
          :transprent="true"
          :showBottomBotder="false"
        ></tm-input>
      </tm-form-item>

      <tm-form-item :border="false">
        <view class="flex flex-row">
          <view class="flex-1 mr-32">
            <!--   form-type="submit"         :click-fun="confirm"-->
            <tm-button form-type="submit" label="提交表单" block></tm-button>
          </view>
          <view class="flex-1">
            <tm-button :shadow="0" text @click="back" label="返回" block></tm-button>
          </view>
        </view>
      </tm-form-item>
    </tm-form>
  </tm-app>
</template>
<script setup lang="ts">
import tmForm from '@/tmui/components/tm-form/tm-form.vue'
import { carNo } from '@/utils/validate'
import { updateCarInfo } from '@/api/order'
const props = defineProps({
  orderId: {
    type: Number,
    required: true
  }
})
const formRef = ref<InstanceType<typeof tmForm>>()
const formData = ref({
  carFrontUrl: [] as { url: string; name: string }[], // 司机到达拍照：车前照
  carBackUrl: [] as { url: string; name: string }[], // 司机到达拍照：车后照
  carType: '', // 车型
  carLicense: '' // 车牌
})

// 提交
async function confirm(validateInfo: {
  data: Partial<typeof formData.value> // 表单数据
  // 所有与form-item绑定的filed字段校验的结果数组。
  result: {
    message: string //校验后的提示文本
    validator: boolean //是否校验通过
  }[]
  isPass: boolean //是否校验通过
}) {
  console.log('validateInfo', validateInfo)
  console.log('formData', formData.value)
  // 如果验证不通过，不提交
  if (!validateInfo.isPass) return
  // 同步验证通过，提交表单
  let params: Parameters<typeof updateCarInfo>[0] = {
    orderId: props.orderId, // 订单id
    carFrontUrl: formData.value.carFrontUrl[0]?.url, // 司机到达拍照：车前照
    carBackUrl: formData.value.carBackUrl[0]?.url, // 司机到达拍照：车后照
    carType: formData.value.carType, // 车型
    carLicense: formData.value.carLicense // 车牌
  }
  await updateCarInfo(params)
  back()
}
// 返回
function back() {
  uni.navigateBack()
}
onLoad(() => {
  console.log('onLoad-props', props)
})
</script>

<style scoped lang="scss"></style>
