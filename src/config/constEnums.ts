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
  // 结束代驾服务更新订单账单
  { label: '结束服务', value: OrderStatus.END_SERVICE },
  // 司机发送账单信息
  { label: '待付款', value: OrderStatus.UNPAID },
  // 乘客付款成功-》订单结束
  { label: '已付款', value: OrderStatus.PAID },
  { label: '系统取消订单', value: OrderStatus.CANCEL_ORDER }
]
// 性别
export enum Gender {
  MALE = 1,
  FEMALE = 2,
  SECRET = 3
}
// 性别
export const GenderMap = [
  {
    label: '男',
    value: Gender.MALE
  },
  {
    label: '女',
    value: Gender.FEMALE
  },
  {
    label: '保密',
    value: Gender.SECRET
  }
]
//认证状态 0:未认证 1：审核中 2：认证通过 -1：认证未通过
export enum AuthStatus {
  UNAUTH = 0,
  AUTHING = 1,
  AUTHED = 2,
  AUTHFAIL = -1
}
//认证状态 0:未认证 1：审核中 2：认证通过 -1：认证未通过
export const AuthStatusMap = [
  {
    label: '未认证',
    value: AuthStatus.UNAUTH
  },
  {
    label: '审核中',
    value: AuthStatus.AUTHING
  },
  {
    label: '认证通过',
    value: AuthStatus.AUTHED
  },
  {
    label: '认证未通过',
    value: AuthStatus.AUTHFAIL
  }
]
