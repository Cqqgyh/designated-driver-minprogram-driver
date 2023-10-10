import http from '@/http'
import { ICarInfo, ICurrentLocation, IDrivingLineVo, IEndOrderServiceParams, IOrder, IOrderDetail, IQueryParams } from '@/api/order/types'
import { OrderStatus } from '@/config/constEnums'
/**
 * 开始接单服务
 */
export function startOrderService() {
  return http.get('/driver/startService')
}

/**
 * 停止接单服务
 */
export function stopOrderService() {
  return http.get('/driver/stopService')
}

/**
 * 开启接单服务：更新司机经纬度位置
 * @param params
 */
export function updateDriverLocation(params: ICurrentLocation) {
  return http.post('/location/updateDriverLocation', params)
}

/**
 * 司机抢单
 * @param orderId
 */
export function grabOrder(orderId: number | string) {
  return http.get<boolean>(`/order/robNewOrder/${orderId}`)
}

/**
 * 查询司机新订单数据
 */
export function getNewOrder() {
  return http.get<IOrder[]>('/order/findNewOrderQueueData')
}
/**
 * @description 预估订单数据（预估路线）
 * @param params
 */
export function getExpectOrder(params: IQueryParams) {
  return http.post<IDrivingLineVo>('/order/calculateDrivingLine', params)
}
/**
 * @description 获取订单详情
 * @param orderId
 */
export function getOrderDetail(orderId: number | string) {
  return http.get<IOrderDetail>(`/order/getOrderInfo/${orderId}`)
}

/**
 * 司机赶往代驾起始点：更新订单地址到缓存 : 接单位置->出发地 更新位置
 */
export function updateLocationCacheToStart(params: ICurrentLocation & { orderId: number }) {
  return http.post('/location/updateOrderLocationToCache', params)
}

/**
 * 开始代驾服务：保存代驾服务订单位置 : 出发地->目的地 更新位置
 */
export function updateLocationCacheToEnd(params: ICurrentLocation & { orderId: number }) {
  return http.post('/location/saveOrderServiceLocation', [params])
}
/**
 * @description 查询订单状态
 * @param orderId
 */
export function getOrderStatus(orderId: number) {
  return http.get<OrderStatus>(`/order/getOrderStatus/${orderId}`)
}

/**
 * 司机到达代驾起始地点：更新订单状态
 * @param orderId
 */
export function updateOrderStatusToDriverArrived(orderId: number) {
  return http.get(`/order/driverArriveStartLocation/${orderId}`)
}

/**
 * 更新代驾车辆信息
 * @param params
 */
export function updateCarInfo(params: ICarInfo & { orderId: number }) {
  return http.post('/order/updateOrderCart', params)
}

/**
 * 开始代驾服务
 * @param orderId
 */
export function startOrderServiceByDriver(orderId: number) {
  return http.post('/order/startDrive', { orderId })
}

/**
 * 结束代驾服务更新订单账单
 * @param params
 */
export function endOrderServiceByDriver(params: IEndOrderServiceParams) {
  return http.post('/order/endDrive', params)
}
