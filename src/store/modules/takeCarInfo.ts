import { defineStore } from 'pinia'
import { useQqMapSdk } from '@/hooks/useQqMapSdk'
import startImgUrl from '@/static/images/start.png'
import endImgUrl from '@/static/images/end.png'
import carImgUrl from '@/static/images/car.png'
import driver from '@/static/images/driver.png'
import { TimerClass } from '@/class/TimerClass'
import { IDriverInfo, IMarkersItem, IPolylineItem } from '@/api/order/types'
import { OrderStatus } from '@/config/constEnums'
import { getExpectOrder } from '@/api/order'
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
      // this.stopQueryOrderStatus()
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
      console.log('res', res)
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
          latitude: from.latitude,
          longitude: from.longitude,
          width: 25,
          height: 35,
          anchor: {
            x: 0.5,
            y: 0.5
          },
          iconPath: type === 1 ? startImgUrl : carImgUrl
        },
        {
          id: 2,
          latitude: to.latitude,
          longitude: to.longitude,
          width: 25,
          height: 35,
          anchor: {
            x: 0.5,
            y: 0.5
          },
          iconPath: endImgUrl
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
      console.log('res', res)
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
          latitude: from.latitude,
          longitude: from.longitude,
          width: 25,
          height: 35,
          anchor: {
            x: 0.5,
            y: 0.5
          },
          iconPath: driver
        },
        {
          id: 2,
          latitude: to.latitude,
          longitude: to.longitude,
          width: 25,
          height: 35,
          anchor: {
            x: 0.5,
            y: 0.5
          },
          iconPath: endImgUrl
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
