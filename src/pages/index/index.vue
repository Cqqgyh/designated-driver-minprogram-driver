<template>
  <tm-app>
    <map
      id="map"
      :longitude="mapProps.longitude"
      :latitude="mapProps.latitude"
      scale="15"
      :enable-traffic="false"
      :show-location="true"
      :enable-poi="true"
      class="map"
    >
      <cover-view @click="moveToLocationHandle()" class="location">
        <theme-icon custom-prefix="iconfont" type="iconfontditudingwei" size="30"></theme-icon>
      </cover-view>
    </map>
    <view class="location-panel">
      <tm-sheet :round="3" :shadow="2">
        <view v-if="isTakingOrders" class="flex flex-col flex-center">
          <view class="text-weight-b text-size-g">正在接单中...</view>
          <view class="my-10 text-size-g">
            {{
              `${timeIncrease.timeDateTypeInfo.value.hours}:${timeIncrease.timeDateTypeInfo.value.minutes}:${timeIncrease.timeDateTypeInfo.value.seconds}`
            }}
          </view>
        </view>
        <loading-button
          v-if="isTakingOrders"
          :block="true"
          :click-fun="cancelTakingOrdersHandle"
          :margin="[10]"
          :shadow="0"
          size="large"
          label="取消接单"
        ></loading-button>
        <loading-button
          v-if="!isTakingOrders"
          :block="true"
          :click-fun="startTakingOrdersHandle"
          :margin="[10]"
          :shadow="0"
          size="large"
          label="开始接单"
        ></loading-button>
      </tm-sheet>
    </view>
    <tm-drawer :width="300" :height="500" :hideHeader="true" :overlayClick="false" ref="popRef" placement="bottom">
      <view class="pop-content">
        <view class="text-weight-b text-size-g">距离客人约4.6KM</view>
        <view class="my-10 text-size-g">
          {{
            `${timeCountdown.timeDateTypeInfo.value.hours}:${timeCountdown.timeDateTypeInfo.value.minutes}:${timeCountdown.timeDateTypeInfo.value.seconds}`
          }}
        </view>
        <view class="flex flex-row">
          <loading-button
            :width="200"
            :click-fun="cancelTakingOrdersForCustomerHandle"
            :margin="[30]"
            :shadow="0"
            size="large"
            label="取消"
            type="info"
          ></loading-button>
          <loading-button :width="200" :click-fun="confirmTakingOrdersHandle" :margin="[30]" :shadow="0" size="large" label="接单"></loading-button>
        </view>
      </view>
    </tm-drawer>
    <tabbar-nav></tabbar-nav>
  </tm-app>
</template>
<script setup lang="ts">
import { IMapProps } from '@/api/index/types'
import { useTakeCarInfoStore } from '@/store/modules/takeCarInfo'
import { useTimeIncrease } from '@/hooks/useTimeIncrease'
import tmDrawer from '@/tmui/components/tm-drawer/tm-drawer.vue'
import { useCountdown } from '@/hooks/useCountdown'
//#region <map相关>
const map = uni.createMapContext('map')
// 打车相关信息仓库
const takeCarInfo = useTakeCarInfoStore()
const mapProps = ref<Pick<IMapProps, 'longitude' | 'latitude'>>({
  // 中心经度
  longitude: 116.397505,
  // 中心纬度
  latitude: 39.908675
})

//  回到初始位置
function moveToLocationHandle() {
  map.moveToLocation(mapProps.value)
}

// 样式
//#endregion

//#region <弹出层>
// 打开弹出层
const popRef = ref<InstanceType<typeof tmDrawer>>()
// 接单倒计时
const timeCountdown = useCountdown({
  // 倒计时长
  seconds: 10,
  // 回调函数,到达持续时长后执行
  callback: () => {
    console.log('倒计时结束')
    closePopupHandle()
  }
})
function openPopupHandle() {
  popRef.value?.open()
  console.log('打开弹出层openPopupHandle')
}
// 关闭弹出层
function closePopupHandle() {
  popRef.value?.close()
  console.log('关闭弹出层closePopupHandle')
}
// 确认接单
function confirmTakingOrdersHandle() {
  console.log('确认接单confirmTakingOrdersHandle')
}
// 取消接单
function cancelTakingOrdersForCustomerHandle() {
  closePopupHandle()
  console.log('取消接单cancelTakingOrdersForCustomerHandle')
}
// 接收到推送订单
function receivePushOrderHandle() {
  openPopupHandle()
  timeCountdown.start()
}
//#endregion

//#region <等待订单>
// 时间增长
const timeIncrease = useTimeIncrease()
// 接单标识,是否接单
const isTakingOrders = ref(false)
// 开始接单
function startTakingOrdersHandle() {
  console.log('开始接单startTakingOrdersHandle')
  isTakingOrders.value = true
  timeIncrease.start()
}
// 取消接单
function cancelTakingOrdersHandle() {
  console.log('取消订单cancelOrderHandle')
  isTakingOrders.value = false
  timeIncrease.stopAndReset()
}
//#endregion

onShow(() => {
  setTimeout(() => {
    receivePushOrderHandle()
  }, 1000)
})
onLoad(() => {
  //   获取当前位置信息
  uni.getLocation({
    type: 'gcj02',
    success: function (res) {
      mapProps.value.longitude = res.longitude
      mapProps.value.latitude = res.latitude
    }
  })
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
}
.pop-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30rpx 20rpx 10rpx;
  height: 400rpx;
}
</style>
