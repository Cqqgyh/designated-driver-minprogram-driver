import http from '@/http'
import { ICurrentLocation, IOrder } from '@/api/order/types'
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
