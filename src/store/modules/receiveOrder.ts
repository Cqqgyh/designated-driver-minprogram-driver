import { defineStore } from 'pinia'
import { IOrder } from '@/api/order/types'
import { TimerClass } from '@/class/timerClass'
import { getNewOrder, grabOrder, startOrderService, stopOrderService, updateDriverLocation } from '@/api/order'
export const useReceiveOrder = defineStore({
  id: 'app-receive-order',
  state: () => ({
    // 存放查询新订单的定时器
    timer: null as unknown as TimerClass | null,
    // 存放切换当前订单的定时器
    switchCurrentOrderTimer: null as unknown as TimerClass | null,
    // 出发地
    currentOrder: {
      // orderId: 1,
      // startLocation: '北京市天安门北京市天安门北京市天安门北京市天安门北京市天安门北京市天安门',
      // endLocation: '北京市天安门',
      // expectAmount: 50,
      // expectDistance: 50,
      // distance: 50,
      // expectTime: 50,
      // favourFee: 0,
      // createTime: ''
    } as IOrder,
    orderList: [] as IOrder[]
  }),
  actions: {
    // 开启接单服务
    async startOrderService() {
      console.log('开启接单服务')
      await startOrderService()
      //   更新位置
      uni.getLocation({
        type: 'gcj02',
        success: function (res) {
          console.log('开启接单服务----更新位置', res)
          updateDriverLocation({
            // longitude: res.longitude,
            // latitude: res.latitude
            // todo 地址位置写死：昌平区政府
            longitude: 116.23128,
            latitude: 40.22077
          })
        }
      })
    },
    // 停止接单服务
    async stopOrderService() {
      console.log('停止接单服务')
      await stopOrderService()
    },
    // 查询新订单
    async getNewOrder() {
      console.log('查询新订单')
      const res = await getNewOrder()
      this.orderList.push(...res.data)
      // this.orderList.push({
      //   orderId: 1,
      //   startLocation: '北京市天安门北京市天安门北京市天安门北京市天安门北京市天安门北京市天安门',
      //   endLocation: '北京市天安门',
      //   expectAmount: 50,
      //   expectDistance: 50,
      //   distance: 50,
      //   expectTime: 50,
      //   favourFee: 0,
      //   createTime: ''
      // })
    },
    //   司机抢单
    async grabOrder(orderId?: number) {
      console.log('司机抢单')
      await grabOrder(orderId || this.currentOrder.orderId)
    },
    // 轮询获取新订单
    async queryGetNewOrder() {
      if (this.timer) return
      this.stopQueryGetNewOrder()
      this.timer = new TimerClass({
        time: 5000,
        callback: async () => {
          await this.getNewOrder()
        }
      })
      //   启动轮询
      this.timer.start()
    },
    // 停止轮询获取新订单
    stopQueryGetNewOrder() {
      this.timer?.stop()
      this.timer = null
    },
    //   切换当前订单
    switchCurrentOrder(callBack: () => void = () => {}) {
      if (!this.orderList.length) return
      console.log('切换当前订单')
      this.currentOrder = this.orderList.shift() || this.currentOrder
      callBack()
    },
    //   轮询切换当前订单
    async querySwitchCurrentOrder(callBack: () => void = () => {}) {
      if (this.switchCurrentOrderTimer) return
      this.stopQuerySwitchCurrentOrder()
      this.switchCurrentOrderTimer = new TimerClass({
        time: 6000,
        callback: async () => {
          this.switchCurrentOrder(callBack)
        }
      })
      //   启动轮询
      this.switchCurrentOrderTimer.start()
    },
    // 停止轮询切换当前订单
    stopQuerySwitchCurrentOrder() {
      this.switchCurrentOrderTimer?.stop()
      this.switchCurrentOrderTimer = null
    }
  }
})
