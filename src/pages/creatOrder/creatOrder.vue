<template>
  <tm-app>
    <!--    出发地到目的地地图-->
    <map
      v-show="isArrivePassengerPickUpPoint"
      :key="1"
      id="map"
      class="map"
      :longitude="takeCarInfo.from.longitude"
      :latitude="takeCarInfo.from.latitude"
      :polyline="takeCarInfo.RouteInfo.polyline"
      :markers="takeCarInfo.RouteInfo.markers"
      scale="12"
      :enable-traffic="false"
      :show-location="true"
      :enable-poi="true"
      :enable-3D="true"
    >
      <cover-view @click="moveCurrentHandle()" class="location">
        <theme-icon custom-prefix="iconfont" type="iconfontditudingwei" size="30"></theme-icon>
      </cover-view>
    </map>
    <!--    司机到乘客路线地图-->
    <map
      v-show="!isArrivePassengerPickUpPoint"
      :key="2"
      id="driveMap"
      class="map"
      :longitude="takeCarInfo.carInfo.from.longitude"
      :latitude="takeCarInfo.carInfo.from.latitude"
      :polyline="takeCarInfo.carInfo.RouteInfo.polyline"
      :markers="takeCarInfo.carInfo.RouteInfo.markers"
      scale="12"
      :enable-traffic="false"
      :show-location="true"
      :enable-poi="true"
      :enable-3D="true"
    >
      <cover-view @click="moveCurrentHandle()" class="location">
        <theme-icon custom-prefix="iconfont" type="iconfontditudingwei" size="30"></theme-icon>
      </cover-view>
    </map>
    <!--    起点-->
    <view v-if="!isArrivePassengerPickUpPoint" class="location-panel">
      <tm-sheet :round="3" :shadow="2">
        <!--        起点-->
        <view>
          <tm-cell :margin="[0, 0]" :titleFontSize="30">
            <template #title>
              <view class="flex flex-row flex-row-center-start">
                <view style="height: 20rpx; width: 20rpx; background-color: #93da5f; border-radius: 50%"></view>
                <text class="ml-20">{{ '北京天安门' }}</text>
              </view>
            </template>
            <template #right>
              <uni-icons
                @click="openExternalMapHandle(takeCarInfo.from)"
                custom-prefix="iconfont"
                class="mr-10"
                type="iconfontditu"
                size="30"
              ></uni-icons>
              <uni-icons @click="callPhoneHandle" custom-prefix="iconfont" type="iconfontdianhua" size="30"></uni-icons>
            </template>
          </tm-cell>
          <tm-cell :margin="[0, 0]" :titleFontSize="30">
            <template #title>
              <tm-text color="grey" label="东大街10号"></tm-text>
            </template>
            <template #right></template>
          </tm-cell>
        </view>
        <loading-button
          :block="true"
          :click-fun="reachTheStartingPointHandle"
          :margin="[10]"
          :shadow="0"
          size="large"
          label="到达乘客起点"
        ></loading-button>
      </tm-sheet>
    </view>
    <!--    终点-->
    <view v-if="isArrivePassengerPickUpPoint" class="location-panel">
      <tm-sheet :round="3" :shadow="2">
        <!--        终点-->
        <view>
          <tm-cell :margin="[0, 0]" :titleFontSize="30">
            <template #title>
              <view class="flex flex-row flex-row-center-start">
                <view style="height: 20rpx; width: 20rpx; background-color: #48b6fc; border-radius: 50%"></view>
                <text class="ml-20">{{ '北京天安门' }}</text>
              </view>
            </template>
            <template #right>
              <uni-icons
                @click="openExternalMapHandle(takeCarInfo.to)"
                custom-prefix="iconfont"
                class="mr-10"
                type="iconfontditu"
                size="30"
              ></uni-icons>
              <uni-icons @click="callPhoneHandle" custom-prefix="iconfont" type="iconfontdianhua" size="30"></uni-icons>
            </template>
          </tm-cell>
          <tm-cell :margin="[0, 0]" :titleFontSize="30">
            <template #title>
              <tm-text color="grey" label="东大街10号"></tm-text>
            </template>
            <template #right></template>
          </tm-cell>
        </view>
        <loading-button
          :block="true"
          :click-fun="reachTheEndingPointHandle"
          :margin="[10]"
          :shadow="0"
          size="large"
          label="到达乘客终点"
        ></loading-button>
      </tm-sheet>
    </view>
  </tm-app>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useTakeCarInfoStore } from '@/store/modules/takeCarInfo'
import tmDrawer from '@/tmui/components/tm-drawer/tm-drawer.vue'
import { useTimeIncrease } from '@/hooks/useTimeIncrease'
import { IRecordCallback, RecorderManagerClass } from '@/class/RecorderManagerClass'
import { getOrderDetail } from '@/api/order'
import { OrderStatus } from '@/config/constEnums'
const map = uni.createMapContext('map')
const driveMap = uni.createMapContext('driveMap')
const props = defineProps({
  // 订单id
  orderId: {
    type: Number || String,
    default: true
  }
})
// 打车相关信息仓库
const takeCarInfo = useTakeCarInfoStore()

// 回到当前位置
function moveCurrentHandle() {
  map.moveToLocation(takeCarInfo.from)
  driveMap.moveToLocation(takeCarInfo.from)
}
// 打电话
function callPhoneHandle() {
  uni.makePhoneCall({
    phoneNumber: '114' //仅为示例
  })
  console.log('打电话callDriverPhoneHandle')
}

//#region <起点、终点相关>
// 到达乘客起点
// 是否到达起点
const isArrivePassengerPickUpPoint = ref(false)
function reachTheStartingPointHandle() {
  isArrivePassengerPickUpPoint.value = true
  console.log('到达乘客起点-reachTheStartingPointHandle')
}
// 到达乘客终点
function reachTheEndingPointHandle() {
  console.log('到达乘客终点-reachTheEndingPointHandle')
}
//  打开外部地图
function openExternalMapHandle(params: typeof takeCarInfo.from) {
  console.log('打开外部地图-openExternalMapHandle')
  wx.openLocation({
    ...params,
    // latitude, //经度
    // longitude, //维度
    // name: '自提位置', // 位置名
    // address: '第十六届可能安防监控', // 要去的地址详情说明
    scale: 15, // 地图缩放级别,整形值,范围从1~28。默认为最大
    success: function (data) {
      console.log(data)
    },
    fail(res) {
      console.log(res) // getLocation:fail the api need to be declared in the requiredPrivateInfos field in app.json
    },
    complete() {
      wx.hideLoading()
    }
  })
}
//#endregion

//#region <获取订单信息>
// 根据订单id获取订单信息
async function getOrderInfoHandleByOrderId(orderId: number | string) {
  const res = await getOrderDetail(orderId)
  //   更新司机信息
  res.data.driverInfoVo && takeCarInfo.setCarDriverInfo(res.data.driverInfoVo)
  //   更新订单信息
  res.data.orderId && takeCarInfo.setOrderId(res.data.orderId)
  //   更新出发地信息
  takeCarInfo.setFrom({
    address: res.data.startLocation,
    longitude: res.data.startPointLongitude,
    latitude: res.data.startPointLatitude
  })
  //   更新目的地信息
  takeCarInfo.setTo({
    address: res.data.endLocation,
    longitude: res.data.endPointLongitude,
    latitude: res.data.endPointLatitude
  })
  takeCarInfo.setOrderStatus(res.data.status)
  // 设置司机位置信息
  // todo 地址位置写死：昌平区政府
  takeCarInfo.setCarFrom({
    address: '',
    longitude: 116.23128,
    latitude: 40.22077
  })
  // 如果状态为等于已接单的状态，则显示司机位置->开始位置的地图
  if (res.data.status === OrderStatus.ACCEPTED) {
    console.log('司机位置->开始位置的地图')
    isArrivePassengerPickUpPoint.value = false
    //   设置司机目的地
    takeCarInfo.setCarTo({
      address: res.data.startLocation,
      longitude: res.data.startPointLongitude,
      latitude: res.data.startPointLatitude
    })
    //   执行路径规划
    await takeCarInfo.driversPickUpPassengersRoutePlan()
  }
  // 否则显示出发位置->结束位置的地图
  else {
    console.log('出发位置->结束位置的地图')
    isArrivePassengerPickUpPoint.value = true
    //  执行路径规划
    await takeCarInfo.routePlan(2)
  }
}
// 根据订单id 重载页面
async function reloadPageHandleByOrderId(orderId: number | string) {
  //  清空订单信息
  takeCarInfo.$reset()
  //   重新获取订单信息
  await getOrderInfoHandleByOrderId(orderId)
}
//#endregion

onLoad(() => {
  console.log('orderId', props.orderId)
  props.orderId && reloadPageHandleByOrderId(props.orderId)
  //   获取当前位置信息
  // takeCarInfo.routePlan()
  // let recorderManager = new RecorderManagerClass({
  //   maxDuration: 6,
  //   recordCallback: (res: IRecordCallback) => {
  //     console.log('recordCallback', res)
  //   }
  // })
  // recorderManager.startRecord()
  // console.log('RecorderManagerClass', recorderManager)
})
</script>

<style scoped lang="scss">
.map {
  width: 100%;
  height: 100vh;
}
.location {
  position: absolute;
  right: 45rpx;
  bottom: 500rpx;
  width: 60rpx;
  height: 60rpx;
}
.location-panel {
  position: absolute;
  //background: pink;
  width: 100%;
  bottom: 100rpx;
}
.pop-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30rpx 20rpx 10rpx;
  height: 500rpx;
}
</style>
