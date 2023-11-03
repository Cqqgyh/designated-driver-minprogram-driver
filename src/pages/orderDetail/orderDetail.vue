<template>
  <tm-app v-if="orderDetail.orderBillVo">
    <!--    司机信息-->
    <tm-sheet>
      <view class="flex flex-col ml-25">
        <view class="text-size-lg text-weight-b">订单状态：{{ getLabelByValue(OrderStatusMap, orderDetail.status) }}</view>
      </view>
      <tm-divider></tm-divider>
      <view>
        <tm-cell :margin="[0, 0]" :titleFontSize="30">
          <template #title>
            <view class="flex flex-row flex-row-center-start">
              <view style="height: 20rpx; width: 20rpx; background-color: #93da5f; border-radius: 50%"></view>
              <text style="width: 400rpx" class="ml-20" _class="text-overflow-1">{{ orderDetail.startLocation }}</text>
            </view>
          </template>
          <template #right>
            <text class="ml-10 text-gray-1">{{ '出发地' }}</text>
          </template>
        </tm-cell>
        <tm-cell :margin="[0, 0]" :titleFontSize="30">
          <template #title>
            <view class="flex flex-row flex-row-center-start">
              <view style="height: 20rpx; width: 20rpx; background-color: #48b6fc; border-radius: 50%"></view>
              <text style="width: 400rpx" class="ml-20" _class="text-overflow-1">{{ orderDetail.endLocation }}</text>
            </view>
          </template>
          <template #right>
            <text class="ml-10 text-gray-1">{{ '目的地' }}</text>
          </template>
        </tm-cell>
      </view>
      <!--      订单创建时间-->
      <tm-cell :margin="[0, 0]" :titleFontSize="30">
        <template #title>
          <tm-text color="grey" :label="orderDetail.createTime"></tm-text>
        </template>
        <template #right></template>
      </tm-cell>
    </tm-sheet>
    <!--    费用信息-->
    <tm-sheet>
      <view v-for="item in descriptionsList.slice(0, descriptionsList.length - 1)" :key="item.label" class="flex flex-row" style="height: 80rpx">
        <view class="flex-1 flex flex-col-center-center border-l-2 border-t-2">{{ item.label }}</view>
        <view class="flex-1 flex-col-center-center border-l-2 border-r-2 border-t-2 text-gray-1">{{ item.value }}元</view>
      </view>
      <view v-for="item in descriptionsList.slice(descriptionsList.length - 1)" :key="item.label" class="flex flex-row" style="height: 80rpx">
        <view class="flex-1 flex flex-col-center-center border-l-2 border-t-2 border-b-2">{{ item.label }}</view>
        <view class="flex-1 flex-col-center-center border-l-2 border-r-2 border-t-2 border-b-2">{{ item.value }}元</view>
      </view>
    </tm-sheet>
    <!--    支付 fixed b-0 -->
    <view class="flex flex-row flex-row-bottom-end pay-container mb-10">
      <loading-button color="red" :click-fun="handleReturn" :margin="[10]" :fontSize="35" :shadow="0" size="middle" label="返回"></loading-button>
      <loading-button
        v-if="orderDetail.status === OrderStatus.END_SERVICE"
        color="red"
        :click-fun="pushOrderHandle"
        :margin="[10]"
        :fontSize="35"
        :shadow="0"
        size="middle"
        label="推送账单"
      ></loading-button>
    </view>
  </tm-app>
</template>
<script setup lang="ts">
import { IOrderDetail } from '@/api/order/types'
import { getOrderDetail, getOrderStatus, sendOrderBillInfo } from '@/api/order'
import { getLabelByValue, OrderStatus, OrderStatusMap } from '@/config/constEnums'

const props = defineProps({
  orderId: {
    type: String,
    required: true
  }
})
const descriptionsList = ref<{ label: string; value: number | string }[]>([])
const orderDetail = ref({} as IOrderDetail)
// 获取订单详情
const getOrderDetailHandle = async (id: number | string) => {
  const res = await getOrderDetail(id)
  orderDetail.value = res.data
  descriptionsList.value = [
    { label: '里程费', value: res.data.orderBillVo?.distanceFee || 0 },
    { label: '等时费用', value: res.data.orderBillVo?.waitFee || 0 },
    { label: '路桥费', value: res.data.orderBillVo?.tollFee || 0 },
    { label: '停车费', value: res.data.orderBillVo?.parkingFee || 0 },
    { label: '其他费用', value: res.data.orderBillVo?.otherFee || 0 },
    { label: '远程费', value: res.data.orderBillVo?.longDistanceFee || 0 },
    { label: '顾客好处费', value: res.data.orderBillVo?.favourFee || 0 },
    { label: '系统奖励费', value: res.data.orderBillVo?.rewardFee || 0 },
    { label: '优惠券金额', value: -res.data.orderBillVo?.couponAmount || 0 },
    { label: '总费用', value: res.data.orderBillVo?.totalAmount || 0 },
    { label: '应付费用', value: res.data.orderBillVo?.payAmount || 0 }
  ]
}
// 返回
const handleReturn = async () => {
  await uni.navigateBack()
}
// 推送账单
const pushOrderHandle = async () => {
  console.log('pushOrderHandle--')
  await sendOrderBillInfo(props.orderId)
  await uni.showToast({
    title: '推送账单成功',
    icon: 'success',
    duration: 2000
  })
}

function collectMoney() {
  setTimeout(() => {
    uni.showToast({
      title: '收款成功',
      icon: 'success',
      duration: 2000
    })
  }, 200)
  // 去往支付成功页面
  console.log('收款成功')
}
const queryOrderPayStatusFlag = ref(true)
// 查询订单支付状态
async function queryOrderPayStatusHandle(orderId: string | number, times: number = 100, interval: number = 2000, callback = () => collectMoney()) {
  // 轮询查询订单支付状态
  if (!queryOrderPayStatusFlag.value) return
  // 轮询查询订单支付状态
  try {
    console.log('轮询查询订单支付状态---start')
    const res = await getOrderStatus(orderId)
    // 更新当前订单状态
    orderDetail.value.status = res.data
    if (res.data === OrderStatus.PAID) {
      // 查询支付成功
      callback()
    } else {
      // 查询支付失败
      if (times > 1) {
        console.log('查询收款信息失败，继续查询-----------', times)
        setTimeout(() => {
          queryOrderPayStatusHandle(orderId, times - 1, interval)
        }, interval)
      } else {
        await uni.showToast({
          title: '查询收款信息失败',
          icon: 'error',
          duration: 2000
        })
      }
    }
  } catch (error) {
    console.log(error)
  }
}
// 停止查询
async function stopQueryOrderStatus() {
  queryOrderPayStatusFlag.value = false
}
onLoad(async () => {
  console.log('props.orderId----', props?.orderId)
  props?.orderId && (await getOrderDetailHandle(props?.orderId as unknown as string))
  //   轮询查询订单支付状态
  // 轮询查询订单支付状态
  queryOrderPayStatusFlag.value = true
  orderDetail.value.status < OrderStatus.PAID && (await queryOrderPayStatusHandle(props?.orderId))
})
onUnload(() => {
  //   停止轮询
  stopQueryOrderStatus()
})
</script>

<style scoped>
.pay-container {
  width: 100vw;
}
</style>
