import { OrderStatus } from '@/config/constEnums'
// 路线查询参数
export interface IQueryParams {
  startPointLongitude: number
  startPointLatitude: number
  endPointLongitude: number
  endPointLatitude: number
}
export interface ICurrentLocation {
  latitude: number
  longitude: number
}
export interface IOrder {
  orderId: number
  startLocation: string
  endLocation: string
  expectAmount: number
  expectDistance: number
  distance: number
  expectTime: number
  favourFee: number
  createTime: string
}
export interface IPolylineItem {
  points: IPointsItem[]
  width: number
  color: string
  arrowLine: boolean
}
export interface IPointsItem {
  longitude: number
  latitude: number
}
export interface IMarkersItem {
  id: number
  latitude: number
  longitude: number
  width: number
  height: number
  anchor: IAnchor
  iconPath: string
}
export interface IAnchor {
  x: number
  y: number
}
export interface IOrderStatusCallback {
  //   { label: '等待接单', value: OrderStatus.WAITING_ACCEPT },
  // { label: '已接单', value: OrderStatus.ACCEPTED },
  // { label: '司机已到达', value: OrderStatus.DRIVER_ARRIVED },
  // { label: '更新代驾车辆信息', value: OrderStatus.UPDATE_CART_INFO },
  // { label: '开始服务', value: OrderStatus.START_SERVICE },
  // { label: '结束服务', value: OrderStatus.END_SERVICE },
  // { label: '待付款', value: OrderStatus.UNPAID },
  // { label: '已付款', value: OrderStatus.PAID },
  // { label: '系统取消订单', value: OrderStatus.CANCEL_ORDER }
  WAITING_ACCEPT?: () => void
  ACCEPTED?: () => void
  DRIVER_ARRIVED?: () => void
  UPDATE_CART_INFO?: () => void
  START_SERVICE?: () => void
  END_SERVICE?: () => void
  UNPAID?: () => void
  PAID?: () => void
  CANCEL_ORDER?: () => void
}
export interface IDriverInfo {
  wxOpenId: string
  name: string
  gender: string
  avatarUrl: string
  driverLicenseAge: number
  orderCount: number
  score: number
}
export interface IOrderBillInfo {
  totalAmount: number
  realPayAmount: number
  distanceFee: number
  waitFee: number
  tollFee: number
  parkingFee: number
  otherFee: number
  longDistanceFee: number
  favourFee: number
  voucherFee: number
  baseDistance: number
  baseDistanceFee: number
  exceedDistance: number
  exceedDistancePrice: number
  baseWaitMinute: number
  exceedWaitMinute: number
  exceedWaitMinutePrice: number
  baseLongDistance: number
  exceedLongDistance: number
  exceedLongDistancePrice: number
  orderStatus: OrderStatus
}
// 订单列表
export interface IOrderListItem {
  id: number
  orderNo: string
  startLocation: string
  endLocation: string
  amount: number
  createTime: string
  status: OrderStatus
}
// 订单详情
export interface IOrderDetail {
  orderId: number
  orderNo: string
  startLocation: string
  startPointLongitude: number
  startPointLatitude: number
  endLocation: string
  endPointLongitude: number
  endPointLatitude: number
  status: number
  createTime: string
  orderBillVo: IOrderBillVo
  driverInfoVo: IDriverInfo
  customerInfoVo: null
}
export interface IOrderBillVo {
  totalAmount: number
  payAmount: number
  distanceFee: number
  waitFee: number
  tollFee: number
  parkingFee: number
  otherFee: number
  longDistanceFee: number
  favourFee: number
  rewardFee: number
  couponAmount: number
  baseDistance: number
  baseDistanceFee: number
  exceedDistance: number
  exceedDistancePrice: number
  baseWaitMinute: number
  exceedWaitMinute: number
  exceedWaitMinutePrice: number
  baseLongDistance: number
  exceedLongDistance: number
  exceedLongDistancePrice: number
}
// 路线信息
export interface IRouteInfo {
  drivingLineVo: IDrivingLineVo
  feeRuleResponseVo: IFeeRuleResponseVo
}
export interface IDrivingLineVo {
  distance: number
  duration: number
  polyline: number[] | IPolylineItem[]
}
export interface IFeeRuleResponseVo {
  feeRuleId: number
  totalAmount: number
  distanceFee: null
  waitFee: null
  longDistanceFee: null
  baseDistance: number
  baseDistanceFee: number
  exceedDistance: number
  exceedDistancePrice: number
  baseWaitMinute: number
  exceedWaitMinute: number
  exceedWaitMinutePrice: number
  baseLongDistance: number
  exceedLongDistance: number
  exceedLongDistancePrice: number
}
