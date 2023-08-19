<template>
  <tm-app>
    <!--    出发地到目的地地图-->
    <map
      v-show="isArrivePassengerPickUpPoint"
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
      id="driveMap"
      class="map"
      :longitude="driversPickUpPassengersRoutePlan.from.longitude"
      :latitude="driversPickUpPassengersRoutePlan.from.latitude"
      :polyline="driversPickUpPassengersRoutePlan.RouteInfo.polyline"
      :markers="driversPickUpPassengersRoutePlan.RouteInfo.markers"
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
        <loading-button :block="true" :click-fun="() => {}" :margin="[10]" :shadow="0" size="large" label="到达乘客终点"></loading-button>
      </tm-sheet>
    </view>
    <tm-drawer :width="300" :height="700" :hideHeader="true" :overlayClick="false" ref="popRef" placement="bottom">
      <view class="pop-content">
        <view class="text-weight-b text-size-g">请耐心等待司机接单</view>
        <view class="text-grey text-weight-b text-size-n my-5">5分钟内暂无司机接单将自动取消订单</view>
        <loading-button :width="500" :click-fun="() => {}" :margin="[10]" :shadow="0" size="large" label="取消接单"></loading-button>
      </view>
    </tm-drawer>
  </tm-app>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useTakeCarInfoStore } from '@/store/modules/takeCarInfo'
import tmDrawer from '@/tmui/components/tm-drawer/tm-drawer.vue'
import { useTimeIncrease } from '@/hooks/useTimeIncrease'
import { driversPickUpPassengersRoutePlanObj, routeInfoObj } from '@/mock/mock'
const map = uni.createMapContext('map')
const driveMap = uni.createMapContext('driveMap')
// 打车相关信息仓库
// const takeCarInfo = useTakeCarInfoStore()
// 是否到达乘客上车点
const takeCarInfo = routeInfoObj
const driversPickUpPassengersRoutePlan = driversPickUpPassengersRoutePlanObj

// 回到当前位置
function moveCurrentHandle() {
  map.moveToLocation(takeCarInfo.from)
  driveMap.moveToLocation(driversPickUpPassengersRoutePlan.from)
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

onLoad(() => {
  //   获取当前位置信息
  // takeCarInfo.routePlan()
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
  bottom: 480rpx;
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
