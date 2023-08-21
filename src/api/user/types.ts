// 从后台获取用户信息接口
export interface UserInfoInterface {
  id: number
  wxOpenId: string
  nickname: string
  avatarUrl: string
  isVip: number
  vipExpireTime: string
}
// 后台微信登陆接口
export interface LoginResponseInterface {
  token: string
  refreshToken?: string
}
// 更新用户信息接口
export interface UpdateUserInfoInterface {
  avatarUrl?: string
  nickname?: string
}
// 微信登陆返回信息接口
export interface WxLoginResponseInterface {
  openid: string
}
// 微信登陆返回用户信息
export interface WechatUserInfoInterface {
  avatarUrl: string
  city: string
  country: string
  gender: 0 | 1 | 2
  language: string
  nickName: string
  province: string
}
