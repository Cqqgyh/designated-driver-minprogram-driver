import { defineStore } from 'pinia'
import { useQqMapSdk } from '@/hooks/useQqMapSdk'
import startImgUrl from '@/static/images/start.png'
import endImgUrl from '@/static/images/end.png'
import carImgUrl from '@/static/images/car.png'
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
      // 路线费用 方案整体花费（元）
      cost: 40.0,
      // 路线标记点
      markers: [] as any[]
    },
    //   乘坐的车辆信息
    carInfo: {
      carId: 1,
      carName: '桑塔纳',
      carPlate: '京A·88888',
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
  }),
  actions: {
    // 设置出发地
    setFrom(from: typeof this.from) {
      this.from = from
    },
    // 设置目的地
    setTo(to: typeof this.to) {
      this.to = to
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
        // 路线距离 方案整体距离（米）
        distance: 0,
        // 路线时间 方案估算时间（分钟）
        duration: 0,
        // 路线费用 方案整体花费（元）
        cost: 0,
        // 路线标记点
        markers: []
      }
    },
    // 路径规划
    async routePlan() {
      const { from, to } = this
      const { qqmapsdk } = useQqMapSdk()
      await qqmapsdk.direction({
        mode: 'driving',
        from,
        to,
        success: (res: any) => {
          console.log('res', res)
          // 状态码，正常为0
          if (res.status != 0) {
            uni.showToast({
              icon: 'error',
              title: res.message
            })
            return
          }
          const route = res.result.routes[0]
          const duration = route.duration
          const distance = Math.ceil((route.distance / 1000) * 10) / 10
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
              iconPath: startImgUrl
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
            cost: 0,
            markers
          })
          console.log('this.RouteInfo', this.RouteInfo)
          // uni.setStorageSync('routeInfo', { from, to, RouteInfo: this.RouteInfo })
          // uni.setStorageSync('driversPickUpPassengersRoutePlan', { from, to, RouteInfo: this.RouteInfo })
        },
        fail: function (error: any) {
          console.error(error)
        },
        complete: function (res: any) {
          console.log(res)
        }
      })
    },
    //   设置乘坐的车辆信息
    setCarInfo(carInfo: typeof this.carInfo) {
      this.carInfo = carInfo
    },
    // 重置乘坐的车辆信息
    resetCarInfo() {
      this.carInfo = {
        carId: 1,
        carName: '桑塔纳',
        carPlate: '京A·88888',
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
    //   规划司机接乘客路径CarInfo
    async driversPickUpPassengersRoutePlan() {
      const { from, to } = this
      const { qqmapsdk } = useQqMapSdk()
      await qqmapsdk.direction({
        mode: 'driving',
        from,
        to,
        success: (res: any) => {
          console.log('res', res)
          // 状态码，正常为0
          if (res.status != 0) {
            uni.showToast({
              icon: 'error',
              title: res.message
            })
            return
          }
          const route = res.result.routes[0]
          const duration = route.duration
          const distance = Math.ceil((route.distance / 1000) * 10) / 10
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
              iconPath: carImgUrl
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
          this.setCarInfo({
            from,
            to,
            carId: 1,
            carName: '桑塔纳',
            carPlate: '京A·88888',
            RouteInfo: {
              polyline,
              distance,
              duration,
              markers
            }
          })
          console.log('this.RouteInfo', this.RouteInfo)
          // uni.setStorageSync('routeInfo', { from, to, RouteInfo: this.RouteInfo })
        },
        fail: function (error: any) {
          console.error(error)
        },
        complete: function (res: any) {
          console.log(res)
        }
      })
    }
  }
})
