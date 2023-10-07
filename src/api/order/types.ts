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
