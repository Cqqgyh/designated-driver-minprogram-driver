<template>
  <tm-modal title="额外费用" @ok="okHandle">
    <template v-slot:trigger>
      <loading-button :block="true" :click-fun="resetFormDataHandle" :margin="[10]" :shadow="0" size="large" label="到达乘客终点"></loading-button>
    </template>
    <tm-input
      v-model="formData.tollFee"
      prefix="tmicon-renminbi3"
      type="number"
      placeholder="请输入路桥费"
      suffixLabel="元"
      :margin="[0, 0]"
    ></tm-input>
    <tm-input
      v-model="formData.parkingFee"
      prefix="tmicon-renminbi3"
      type="number"
      placeholder="请输入停车费"
      suffixLabel="元"
      :margin="[0, 5]"
    ></tm-input>
    <tm-input
      v-model="formData.otherFee"
      prefix="tmicon-renminbi3"
      type="number"
      placeholder="请输入其他费用"
      suffixLabel="元"
      :margin="[0, 0]"
    ></tm-input>
  </tm-modal>
</template>
<script setup lang="ts">
import { endOrderServiceByDriver } from '@/api/order'

const props = defineProps({
  orderId: {
    type: Number,
    required: true
  },
  callBack: {
    type: Function,
    default: async () => {}
  }
})
const formData = ref({
  tollFee: '',
  parkingFee: '',
  otherFee: ''
})
console.log('props--------', props)
const resetFormDataHandle = () => {
  formData.value = {
    tollFee: '',
    parkingFee: '',
    otherFee: ''
  }
}
const okHandle = async () => {
  console.log('formData', formData.value)
  await endOrderServiceByDriver({
    orderId: props.orderId,
    tollFee: (formData.value.tollFee as unknown as number) || 0,
    parkingFee: (formData.value.parkingFee as unknown as number) || 0,
    otherFee: (formData.value.otherFee as unknown as number) || 0
  })
  props.callBack()
  //   前往订单详情
  await uni.redirectTo({
    url: `/pages/orderDetail/orderDetail?orderId=${props.orderId}`
  })
}
</script>

<style scoped></style>
