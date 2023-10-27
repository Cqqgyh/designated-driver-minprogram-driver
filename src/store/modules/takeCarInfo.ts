import { defineStore } from 'pinia'
import { useQqMapSdk } from '@/hooks/useQqMapSdk'
import startImgUrl from '@/static/images/start.png'
import endImgUrl from '@/static/images/end.png'
import carImgUrl from '@/static/images/car.png'
import driver from '@/static/images/driver.png'
import { TimerClass } from '@/class/TimerClass'
import { IDriverInfo, IMarkersItem, IOrderStatusCallback, IPolylineItem } from '@/api/order/types'
import { OrderStatus } from '@/config/constEnums'
import { getExpectOrder, getOrderStatus, updateLocationCacheToEnd, updateLocationCacheToStart } from '@/api/order'
import { RecorderManagerClass } from '@/class/RecorderManagerClass'
import { getToken } from '@/utils/storage'
function formatPolyline(polyline: any[]) {
  const coors = polyline
  const pl = []
  //坐标解压（返回的点串坐标，通过前向差分进行压缩）
  const kr = 1000000
  for (let i = 2; i < coors.length; i++) {
    coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr
  }
  //将解压后的坐标放入点串数组pl中
  for (let i = 0; i < coors.length; i += 2) {
    pl.push({
      longitude: coors[i + 1],
      latitude: coors[i]
    })
  }
  return pl
}
export const useTakeCarInfoStore = defineStore({
  id: 'app-take-car-info',
  state: () => ({
    // 存放查询司机位置的轮询定时器实例:出发位置-> 目的地
    timer: null as unknown as TimerClass | null,
    // 存放定时录音的定时器循环实例
    recordTimer: null as unknown as TimerClass | null,
    recorderManagerInstance: null as unknown as RecorderManagerClass | null,
    // 出发地
    from: {
      address: '',
      longitude: 0,
      latitude: 0
    },
    // 目的地
    to: {
      address: '',
      longitude: 0,
      latitude: 0
    },
    // 路线信息
    RouteInfo: {
      // 路线规划
      polyline: [] as IPolylineItem[],
      // 路线距离 方案整体距离（米）
      distance: 0,
      // 路线时间 方案估算时间（分钟）
      duration: 0,
      // 路线标记点
      markers: [] as IMarkersItem[]
    },
    //   乘坐的车辆信息
    carInfo: {
      driverInfo: {
        wxOpenId: '',
        name: '',
        gender: '',
        avatarUrl: '',
        driverLicenseAge: 0,
        orderCount: 0,
        score: 0
      } as IDriverInfo,
      // 存放查询司机位置的轮询定时器实例:司机位置->出发位置
      timer: null as unknown as TimerClass | null,
      // 出发地
      from: {
        address: '',
        longitude: 0,
        latitude: 0
      },
      // 目的地
      to: {
        address: '',
        longitude: 0,
        latitude: 0
      },
      // 路线信息
      RouteInfo: {
        // 路线规划
        polyline: [] as any[],
        // 路线距离 方案整体距离（米）
        distance: 0,
        // 路线时间 方案估算时间（分钟）
        duration: 0,
        // 路线标记点
        markers: [] as any[]
      }
    },
    //   订单相关信息
    orderInfo: {
      // 存放查询订单状态的轮询定时器实例
      timer: null as unknown as TimerClass | null,
      // 订单id
      orderId: 0,
      // 订单状态
      orderStatus: 0 as OrderStatus
    }
  }),
  actions: {
    // 设置订单id
    setOrderId(orderId: typeof this.orderInfo.orderId) {
      this.orderInfo.orderId = orderId
    },
    // 设置订单状态
    setOrderStatus(orderStatus: typeof this.orderInfo.orderStatus) {
      this.orderInfo.orderStatus = orderStatus
    },
    // 重置订单相关信息
    resetOrderInfo() {
      this.stopQueryOrderStatus()
      this.orderInfo = {
        timer: null,
        orderId: 0,
        orderStatus: 0
      }
    },
    // 设置出发地
    setFrom(from: typeof this.from) {
      this.from = from
    },
    // 设置目的地
    setTo(to: typeof this.to) {
      this.to = to
    },
    // 设置出发地和目的地
    setFromAndTo(position: Pick<typeof this, 'from' | 'to'>) {
      this.from = position.from
      this.to = position.to
    },
    // 重置出发地
    resetFrom() {
      this.from = {
        address: '',
        longitude: 0,
        latitude: 0
      }
    },
    // 重置目的地
    resetTo() {
      this.to = {
        address: '',
        longitude: 0,
        latitude: 0
      }
    },
    // 重置出发地和目的地
    resetFromAndTo() {
      this.resetFrom()
      this.resetTo()
    },
    // 设置路线信息
    setRouteInfo(RouteInfo: typeof this.RouteInfo) {
      this.RouteInfo = RouteInfo
    },
    // 重置路线信息
    resetRouteInfo() {
      this.RouteInfo = {
        // 路线规划
        polyline: [],
        // 路线距离 方案整体距离（KM）
        distance: 0,
        // 路线时间 方案估算时间（分钟）
        duration: 0,
        // 路线标记点
        markers: []
      }
    },
    // 重置出发地和目的地以及路线信息
    resetFromAndToAndRouteInfo() {
      this.resetFromAndTo()
      this.resetRouteInfo()
    },
    // 路径规划 type 1:出发地->目的地 startImgUrl 2:司机位置->目的地 carImgUrl
    async routePlan(type: 1 | 2 = 1) {
      const { from, to } = this
      const params = {
        startPointLongitude: from.longitude,
        startPointLatitude: from.latitude,
        endPointLongitude: to.longitude,
        endPointLatitude: to.latitude
      }
      // 从后台获取路径规划信息
      const res = await getExpectOrder(params)
      const route = res.data
      const duration = route.duration
      const distance = route.distance
      const polyline = [
        {
          points: formatPolyline(route.polyline),
          width: 6,
          color: '#05B473',
          arrowLine: true
        }
      ]
      const markers = [
        {
          id: 1,
          latitude: to.latitude,
          longitude: to.longitude,
          width: 25,
          height: 35,
          anchor: {
            x: 0.5,
            y: 0.5
          },
          iconPath: endImgUrl
        },
        {
          id: 2,
          latitude: from.latitude,
          longitude: from.longitude,
          width: 25,
          height: 35,
          anchor: {
            x: 0.5,
            y: 0.5
          },
          iconPath: type === 1 ? startImgUrl : carImgUrl
        }
      ]
      this.setRouteInfo({
        polyline,
        distance,
        duration,
        markers
      })
      console.log('this.RouteInfo', this.RouteInfo)
    },
    //   设置乘坐的车辆信息
    setCarInfo(carInfo: typeof this.carInfo) {
      this.carInfo = carInfo
    },
    // 重置乘坐的车辆信息
    resetCarInfo() {
      // this.stopQueryCarLocationToStartPosition()
      this.carInfo = {
        timer: null,
        driverInfo: {
          wxOpenId: '',
          name: '',
          gender: '',
          avatarUrl: '',
          driverLicenseAge: 0,
          orderCount: 0,
          score: 0
        },
        // 出发地
        from: {
          address: '',
          longitude: 0,
          latitude: 0
        },
        // 目的地
        to: {
          address: '',
          longitude: 0,
          latitude: 0
        },
        // 路线信息
        RouteInfo: {
          // 路线规划
          polyline: [] as any[],
          // 路线距离 方案整体距离（米）
          distance: 0,
          // 路线时间 方案估算时间（分钟）
          duration: 0,
          // 路线标记点
          markers: [] as any[]
        }
      }
    },
    //   设置乘坐的车辆信息
    setCarRouteInfo(RouteInfo: typeof this.carInfo.RouteInfo) {
      this.carInfo.RouteInfo = RouteInfo
    },
    // 设置司机信息
    setCarDriverInfo(driverInfo: typeof this.carInfo.driverInfo) {
      this.carInfo.driverInfo = driverInfo
    },
    // 设置司机出发地
    setCarFrom(from: typeof this.carInfo.from) {
      this.carInfo.from = from
    },
    // 设置司机目的地
    setCarTo(to: typeof this.carInfo.to) {
      this.carInfo.to = to
    },
    // 上传位置，更新当前位置 type 0:根据订单状态自动判断type为1还是2 1:司机位置->出发地  2:司机位置->目的地 不传递
    async updateLocation(type: 0 | 1 | 2 = 0) {
      if (type === 0) {
        this.orderInfo.orderStatus === OrderStatus.ACCEPTED ? (type = 1) : (type = 2)
      }
      console.log('更新位置--------updateLocation------1:司机位置->出发地  2:司机位置->目的地', type)
      //   更新位置
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          if (type === 1) {
            // 上传位置
            updateLocationCacheToStart({
              // longitude: res.longitude,
              // latitude: res.latitude
              orderId: this.orderInfo.orderId,
              // todo 地址位置写死：昌平区政府
              longitude: 116.23128,
              latitude: 40.22077
            })
            // 设置车辆位置
            this.setCarFrom({
              address: res.address || this.from.address,
              // todo 地址位置写死：昌平区政府
              longitude: 116.23128,
              latitude: 40.22077
            })
            //  路径规划
            this.driversPickUpPassengersRoutePlan()
          } else {
            // 上传位置
            updateLocationCacheToEnd({
              // longitude: res.longitude,
              // latitude: res.latitude
              orderId: this.orderInfo.orderId,
              // todo 地址位置写死：昌平区政府
              longitude: 116.23128,
              latitude: 40.22077
            })
            // 设置车辆位置
            this.setFrom({
              address: res.address || this.to.address,
              // todo 地址位置写死：昌平区政府
              longitude: 116.23128,
              latitude: 40.22077
            })
            //  路径规划
            this.routePlan(2)
          }
        }
      })
    },
    // 查询订单状态
    async getOrderStatusHandle() {
      const res = await getOrderStatus(this.orderInfo.orderId)
      //   设置订单状态
      this.setOrderStatus(res.data)
    },
    // 轮询查询订单状态
    async queryOrderStatus(settingCallback: IOrderStatusCallback = {}) {
      if (this.orderInfo.timer) return
      this.stopQueryOrderStatus()
      this.orderInfo.timer = new TimerClass({
        time: 3000,
        callback: async () => {
          await this.getOrderStatusHandle()
          await this.updateLocation()
          switch (this.orderInfo.orderStatus) {
            case OrderStatus.WAITING_ACCEPT:
              console.log('OrderStatus.WAITING_ACCEPT')
              if (settingCallback.WAITING_ACCEPT) {
                settingCallback.WAITING_ACCEPT()
                delete settingCallback.WAITING_ACCEPT
              }
              break
            case OrderStatus.ACCEPTED:
              // 司乘同显
              console.log('OrderStatus.ACCEPTED')
              if (settingCallback.ACCEPTED) {
                settingCallback.ACCEPTED()
                delete settingCallback.ACCEPTED
              }
              break
            case OrderStatus.DRIVER_ARRIVED:
              console.log('OrderStatus.DRIVER_ARRIVED')
              if (settingCallback.DRIVER_ARRIVED) {
                settingCallback.DRIVER_ARRIVED()
                delete settingCallback.DRIVER_ARRIVED
              }
              break
            case OrderStatus.UPDATE_CART_INFO:
              console.log('OrderStatus.UPDATE_CART_INFO')
              if (settingCallback.UPDATE_CART_INFO) {
                settingCallback.UPDATE_CART_INFO()
                delete settingCallback.UPDATE_CART_INFO
              }
              break
            case OrderStatus.START_SERVICE:
              console.log('OrderStatus.START_SERVICE', settingCallback.START_SERVICE)
              if (settingCallback.START_SERVICE) {
                settingCallback.START_SERVICE()
                delete settingCallback.START_SERVICE
              }
              break
            case OrderStatus.END_SERVICE:
              console.log('OrderStatus.END_SERVICE')
              if (settingCallback.END_SERVICE) {
                settingCallback.END_SERVICE()
                delete settingCallback.END_SERVICE
              }
              break
            case OrderStatus.UNPAID:
              console.log('OrderStatus.UNPAID')
              if (settingCallback.UNPAID) {
                settingCallback.UNPAID()
                delete settingCallback.UNPAID
              }
              break
            case OrderStatus.PAID:
              console.log('OrderStatus.PAID')
              if (settingCallback.PAID) {
                settingCallback.PAID()
                delete settingCallback.PAID
              }
              break
            case OrderStatus.CANCEL_ORDER:
              console.log('OrderStatus.CANCEL_ORDER')
              if (settingCallback.CANCEL_ORDER) {
                settingCallback.CANCEL_ORDER()
                delete settingCallback.CANCEL_ORDER
              }
              break
            default:
              console.log('default')
          }
        }
      })
      //   启动轮询
      this.orderInfo.timer.start()
    },
    stopQueryOrderStatus() {
      console.log('停止轮询订单状态--------stopQueryOrderStatus')
      this.orderInfo.timer?.stop()
      this.orderInfo.timer = null
    },
    // 轮询创建定时器，发送录音
    async querySendRecord() {
      if (this.recordTimer) return
      this.stopQuerySendRecord()
      this.recordTimer = new TimerClass({
        time: 5000,
        callback: async () => {
          this.recorderManagerInstance?.stopRecord()
          this.recorderManagerInstance = new RecorderManagerClass({
            recordCallback: (res) => {
              console.log('res----', res)
              wx.uploadFile({
                url:
                  (import.meta.env.VITE_APP_NODE_ENV === 'development' ? import.meta.env.VITE_APP_BASE_API : import.meta.env.VITE_APP_BASE_URL) +
                  '/monitor/upload', //仅为示例，非真实的接口地址
                filePath: res.tempFilePath,
                header: { token: getToken() },
                name: 'file',
                formData: {
                  orderId: this.orderInfo.orderId,
                  content: res.result
                },
                success(res) {
                  console.log('res---uploadFile', res)
                }
              })
            }
          })
          this.recorderManagerInstance.startRecord()
        }
      })
      //   启动轮询
      this.recordTimer.start()
    },
    stopQuerySendRecord() {
      console.log('停止轮询生成录音--------stopQuerySendRecord')
      this.recordTimer?.stop()
      this.recordTimer = null
    },
    //   规划司机接乘客路径CarInfo
    async driversPickUpPassengersRoutePlan() {
      const from = this.carInfo.from
      const to = this.from
      const params = {
        startPointLongitude: from.longitude,
        startPointLatitude: from.latitude,
        endPointLongitude: to.longitude,
        endPointLatitude: to.latitude
      }
      // 从后台获取路径规划信息
      const res = await getExpectOrder(params)
      const route = res.data
      const duration = route.duration
      const distance = route.distance
      const polyline = [
        {
          points: formatPolyline(route.polyline),
          width: 6,
          color: '#05B473',
          arrowLine: true
        }
      ]
      const markers = [
        {
          id: 1,
          latitude: to.latitude,
          longitude: to.longitude,
          width: 25,
          height: 35,
          anchor: {
            x: 0.5,
            y: 0.5
          },
          iconPath: endImgUrl
        },
        {
          id: 2,
          latitude: from.latitude,
          longitude: from.longitude,
          width: 25,
          height: 35,
          anchor: {
            x: 0.5,
            y: 0.5
          },
          iconPath: driver
        }
      ]
      this.setCarRouteInfo({
        polyline,
        distance,
        duration,
        markers
      })
    }
  }
})
