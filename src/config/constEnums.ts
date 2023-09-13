export function getLabelByValue(
  arr: {
    label: string
    value: string | number | boolean
  }[],
  value: string | number | boolean
): string {
  const item = arr.find((item) => item.value === value)
  return item ? item.label : ''
}
// 订单状态
export enum OrderStatus {
  WAITING_ACCEPT = 1,
  ACCEPTED = 2,
  DRIVER_ARRIVED = 3,
  UPDATE_CART_INFO = 4,
  START_SERVICE = 5,
  END_SERVICE = 6,
  UNPAID = 7,
  PAID = 8,
  CANCEL_ORDER = -1
}
// 订单状态
export const OrderStatusMap = [
  { label: '等待接单', value: OrderStatus.WAITING_ACCEPT },
  { label: '已接单', value: OrderStatus.ACCEPTED },
  { label: '司机已到达', value: OrderStatus.DRIVER_ARRIVED },
  { label: '更新代驾车辆信息', value: OrderStatus.UPDATE_CART_INFO },
  { label: '开始服务', value: OrderStatus.START_SERVICE },
  { label: '结束服务', value: OrderStatus.END_SERVICE },
  { label: '待付款', value: OrderStatus.UNPAID },
  { label: '已付款', value: OrderStatus.PAID },
  { label: '系统取消订单', value: OrderStatus.CANCEL_ORDER }
]
