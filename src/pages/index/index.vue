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
    <tm-notification :transprent="true" :duration="50000" placement="top" ref="popRef">
      <tm-sheet :round="3" :shadow="2">
        <view class="pop-content">
          <view class="address">
            <view class="address-item">
              <view class="text-weight-b text-size-g">
                出发地:
                <text class="text-weight-s">{{ receiveOrder?.currentOrder.startLocation }}</text>
              </view>
            </view>
            <view class="address-item">
              <view class="text-weight-b text-size-g">
                目的地:
                <text class="text-weight-s">{{ receiveOrder?.currentOrder.endLocation }}</text>
              </view>
            </view>
            <view v-for="item in descriptionsOrder" :key="item.label" class="flex flex-row" style="height: 80rpx">
              <view class="flex-1 flex flex-col-center-center border-l-2 border-t-2 border-b-2">{{ item.label }}</view>
              <view class="flex-1 flex-col-center-center border-l-2 border-r-2 border-t-2 border-b-2">{{ item.value }}</view>
            </view>
          </view>
          <view class="text-weight-b text-size-g"></view>
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
            <loading-button :width="200" :click-fun="confirmTakingOrdersHandle" :margin="[30]" :shadow="0" size="large" label="抢单"></loading-button>
          </view>
        </view>
      </tm-sheet>
    </tm-notification>
    <tabbar-nav></tabbar-nav>
  </tm-app>
</template>
<script setup lang="ts">
import { IMapProps } from '@/api/index/types'
import { useTakeCarInfoStore } from '@/store/modules/takeCarInfo'
import { useTimeIncrease } from '@/hooks/useTimeIncrease'
import { useCountdown } from '@/hooks/useCountdown'
import tmNotification from '@/tmui/components/tm-notification/tm-notification.vue'
import { useReceiveOrder } from '@/store/modules/receiveOrder'
import { stopService } from '@/api/order'
import { getDriverIsFaceRecognition, getDriverLoginInfo } from '@/api/user'
const receiveOrder = useReceiveOrder()
const descriptionsOrder = computed(() => {
  return [
    { label: '预估里程', value: receiveOrder?.currentOrder.expectDistance + 'KM' },
    { label: '距离客人距离', value: receiveOrder?.currentOrder.distance + 'KM' },
    { label: '预估费用', value: receiveOrder?.currentOrder.expectAmount + '元' }
  ]
})
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
const popRef = ref<InstanceType<typeof tmNotification> | null>(null)
// 接单倒计时
const timeCountdown = useCountdown({
  // 倒计时长
  seconds: 5,
  // 回调函数,到达持续时长后执行
  callback: () => {
    console.log('倒计时结束')
    closePopupHandle()
  }
})
function openPopupHandle() {
  popRef.value?.show()
  timeCountdown.start()
  console.log('打开弹出层openPopupHandle')
}
// 关闭弹出层
function closePopupHandle() {
  popRef.value?.hide()
  timeCountdown.stopAndReset()
  console.log('关闭弹出层closePopupHandle')
}
// 抢单
async function confirmTakingOrdersHandle() {
  console.log('确认抢单confirmTakingOrdersHandle')
  await receiveOrder.grabOrder()
  await receiveOrder.stopOrderService()
  await cancelTakingOrdersHandle()
  //   跳转到创建订单页面
  await uni.navigateTo({
    url: '/pages/creatOrder/creatOrder?orderId=' + receiveOrder.currentOrder.orderId
  })
}
// 取消接单
function cancelTakingOrdersForCustomerHandle() {
  closePopupHandle()
  console.log('取消接单cancelTakingOrdersForCustomerHandle')
}
// 接收到推送订单
function receivePushOrderHandle() {
  openPopupHandle()
}
//#endregion

//#region <等待订单>
// 时间增长
const timeIncrease = useTimeIncrease()
// 接单标识,是否接单
const isTakingOrders = ref(false)
// 开始接单
async function startTakingOrdersHandle() {
  console.log('开始接单startTakingOrdersHandle')
  const isAllowTakeOrder = await isTakeOrder()
  console.log('isAllowTakeOrder', isAllowTakeOrder)
  if (!isAllowTakeOrder) return

  // 开启接单服务
  await receiveOrder.startOrderService()
  isTakingOrders.value = true
  timeIncrease.start()
  // 轮询获取新订单
  await receiveOrder.queryGetNewOrder()
  // 轮询切换当前订单
  await receiveOrder.querySwitchCurrentOrder(receivePushOrderHandle)
}
// 取消接单
async function cancelTakingOrdersHandle() {
  console.log('取消订单cancelOrderHandle')

  isTakingOrders.value = false
  timeIncrease.stopAndReset()
  // 停止轮询新订单
  receiveOrder.stopQueryGetNewOrder()
  // 停止轮询切换当前订单
  receiveOrder.stopQuerySwitchCurrentOrder()
  //   隐藏
  closePopupHandle()
  // 停止接单
  await stopService()
}
// 判断司机是否认证+今日是否人脸识别
async function isTakeOrder() {
  const resList = await Promise.all([getDriverLoginInfo(), getDriverIsFaceRecognition()])
  console.log('resList----', resList)
  const driverLoginInfo = resList[0].data
  const isFaceRecognition = resList[1].data
  // authStatus	认证状态 0:未认证 1：审核中 2：认证通过 -1：认证未通过
  if (driverLoginInfo.authStatus === 0) {
    //   未认证，跳转认证页面
    await uni.showToast({ title: '未认证，跳转认证页面', icon: 'none' })
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/verification/verification'
      })
    }, 1000)
  } else if (driverLoginInfo.authStatus === 1) {
    //   审核中
    await uni.showToast({ title: '正在审核中', icon: 'none' })
  } else if (driverLoginInfo.authStatus === -1) {
    //   未认证，跳转认证页面
    await uni.showToast({ title: '认证未通过，跳转认证页面重新认证', icon: 'none' })
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/verification/verification'
      })
    }, 1000)
  } else {
    //   通过认证
    // 	是否建档人脸识别
    if (driverLoginInfo.isArchiveFace) {
      //   建档人脸识别，判断今天是否进行人脸识别
      if (isFaceRecognition) {
        return true
      } else {
        //   今日未曾人脸识别
        await uni.showToast({ title: '今日未曾人脸识，跳转识别', icon: 'none' })
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/facialIdentification/facialIdentification'
          })
        }, 1000)
      }
    } else {
      //   未曾建档人脸识别
      await uni.showToast({ title: '未录入人脸信息，跳转录入', icon: 'none' })
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/facialIdentification/facialIdentification?creatFaceModel=true'
        })
      }, 1000)
    }
  }
}

//#endregion

onShow(() => {
  // 隐藏tabbar
  uni.hideTabBar()
})
onLoad(() => {
  // setTimeout(() => {
  //   receivePushOrderHandle()
  // }, 1000)
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
  padding: 15rpx 10rpx 10rpx 10rpx;
  //height: 200rpx;
  .address {
    width: 100%;
    .address-item {
      margin-bottom: 5rpx;
    }
  }
}
</style>
