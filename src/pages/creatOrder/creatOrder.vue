<template>
  <tm-app>
    <!--    出发地到目的地地图-->
    <map
      v-show="!showDriversPickUpPassengersRoutePlan"
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
      v-show="showDriversPickUpPassengersRoutePlan"
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
    <view v-if="!isHaveReceiveOrders" class="location-panel">
      <tm-sheet :round="3" :shadow="2">
        <view class="route-info">
          <view class="label">预估距离:</view>
          <view class="price">{{ takeCarInfo?.RouteInfo.distance }}公里</view>
        </view>
        <view class="route-info">
          <view class="label">预估时间:</view>
          <view class="price">{{ takeCarInfo?.RouteInfo.duration }}分钟</view>
        </view>
        <view class="route-info">
          <view class="label">预估价格:</view>
          <view class="price">{{ takeCarInfo?.RouteInfo.cost }}元</view>
        </view>
        <loading-button :block="true" :click-fun="callTaxiHandle" :margin="[10]" :shadow="0" size="large" label="呼叫代驾"></loading-button>
      </tm-sheet>
    </view>
    <view v-if="isHaveReceiveOrders" class="location-panel">
      <tm-sheet :round="3" :shadow="2">
        <view class="flex flex-row flex-row-center-start relative pl-10">
          <tm-avatar
            :size="150"
            :round="26"
            img="https://p26-passport.byteacctimg.com/img/user-avatar/39dc370feeaaddfc5dfda471b23de255~50x50.awebp"
          ></tm-avatar>
          <view class="flex flex-col ml-25">
            <view class="text-size-lg text-weight-b">张师傅</view>
            <view class="text-size-g text-gray">驾龄9年</view>
          </view>
          <view class="absolute r-20" @click="callDriverPhoneHandle">
            <uni-icons custom-prefix="iconfont" type="iconfontdianhua" size="30"></uni-icons>
          </view>
        </view>
        <loading-button :block="true" :click-fun="cancelOrderHandle" :margin="[10]" :shadow="0" size="large" label="取消订单"></loading-button>
      </tm-sheet>
    </view>
    <tm-drawer :width="300" :height="700" :hideHeader="true" :overlayClick="false" ref="popRef" placement="bottom">
      <view class="pop-content">
        <view class="text-weight-b text-size-g">请耐心等待司机接单</view>
        <view class="text-grey text-weight-b text-size-n my-5">5分钟内暂无司机接单将自动取消订单</view>
        <view class="my-10 text-size-g">
          {{
            `${timeIncrease.timeDateTypeInfo.value.hours}:${timeIncrease.timeDateTypeInfo.value.minutes}:${timeIncrease.timeDateTypeInfo.value.seconds}`
          }}
        </view>
        <loading-button :width="500" :click-fun="cancelGetOrderHandle" :margin="[10]" :shadow="0" size="large" label="取消接单"></loading-button>
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
// 展示司机接乘客路线，呼叫订单中
const showDriversPickUpPassengersRoutePlan = ref(false)
// 已经有司机接单
const isHaveReceiveOrders = ref(true)
const takeCarInfo = routeInfoObj
const driversPickUpPassengersRoutePlan = driversPickUpPassengersRoutePlanObj

// 回到当前位置
function moveCurrentHandle() {
  map.moveToLocation(takeCarInfo.from)
  driveMap.moveToLocation(driversPickUpPassengersRoutePlan.from)
}

//#region <等待订单>
// 时间增长
const timeIncrease = useTimeIncrease()
// 呼叫代驾
function callTaxiHandle() {
  console.log('呼叫代驾callTaxiHandle')
  showDriversPickUpPassengersRoutePlan.value = true
  openPopupHandle()
  timeIncrease.start()
}
// 取消订单
function cancelGetOrderHandle() {
  console.log('取消订单cancelOrderHandle')
  closePopupHandle()
  timeIncrease.stopAndReset()
  showDriversPickUpPassengersRoutePlan.value = false
}
//#endregion

//#region <弹出层>
// 打开弹出层
const popRef = ref<InstanceType<typeof tmDrawer>>()
function openPopupHandle() {
  popRef.value?.open()
  console.log('打开弹出层openPopupHandle')
}
// 关闭弹出层
function closePopupHandle() {
  popRef.value?.close()
  console.log('关闭弹出层closePopupHandle')
}
//#endregion

//#region <司机订单后逻辑>
// 取消订单
function cancelOrderHandle() {
  isHaveReceiveOrders.value = false
  console.log('取消订单cancelOrderHandle')
}
// 打电话
function callDriverPhoneHandle() {
  uni.makePhoneCall({
    phoneNumber: '114' //仅为示例
  })
  console.log('打电话callDriverPhoneHandle')
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
  bottom: 450rpx;
  width: 60rpx;
  height: 60rpx;
}
.location-panel {
  position: absolute;
  //background: pink;
  width: 100%;
  bottom: 100rpx;
  .route-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24rpx;
    .label {
      font-size: 28rpx;
      color: #999;
    }
    .price {
      font-size: 32rpx;
      color: #333;
    }
  }
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
