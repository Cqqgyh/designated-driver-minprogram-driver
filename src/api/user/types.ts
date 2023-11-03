// 从后台获取用户信息接口
import { AuthStatus, Gender } from '@/config/constEnums'

export interface UserInfoInterface {
  isArchiveFace: boolean
  authStatus: AuthStatus
  wxOpenId: string
  nickname: string
  gender: Gender
  avatarUrl: string
}
// 更新用户信息接口
export interface UpdateUserInfoInterface {
  nickname?: string
  avatarUrl?: string
  phone?: string
  name?: string
  gender?: Gender
  birthday?: string
  idcardNo?: string
  idcardAddress?: string
  idcardExpire?: string
  idcardFrontUrl?: string
  idcardBackUrl?: string
  idcardHandUrl?: string
  driverLicenseClazz?: string
  driverLicenseNo?: string
  driverLicenseExpire?: string
  driverLicenseIssueDate?: string
  driverLicenseFrontUrl?: string
  driverLicenseBackUrl?: string
  driverLicenseHandUrl?: string
  contactName?: string
  contactPhone?: string
  contactRelationship?: string
}
// 获取司机认证信息接口
export interface DriverAuthInfoInterface {
  phone: string
  name: string
  gender: string
  birthday: string
  idcardNo: string
  idcardAddress: string
  idcardExpire: string
  idcardFrontUrl: string
  idcardFrontShowUrl: string
  idcardBackUrl: string
  idcardBackShowUrl: string
  idcardHandUrl: string
  idcardHandShowUrl: string
  driverLicenseClazz: string
  driverLicenseNo: string
  driverLicenseExpire: string
  driverLicenseIssueDate: string
  driverLicenseFrontUrl: string
  driverLicenseFrontShowUrl: string
  driverLicenseBackUrl: string
  driverLicenseBackShowUrl: string
  driverLicenseHandUrl: string
  driverLicenseHandShowUrl: string
  contactName: string
  contactPhone: string
  contactRelationship: string
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
// 更新微信用户手机号
export interface WxUpdatePhoneInterface {
  code: string
}
// 身份证上传接口
export interface IdCardOcrInterface {
  name: string
  gender: string
  birthday: string
  idcardNo: string
  idcardAddress: string
  idcardExpire: string
  idcardFrontUrl: string
  idcardFrontShowUrl: string
  idcardBackUrl: string
  idcardBackShowUrl: string
}
// 驾驶证
export interface DriverCardOcrInterface {
  name: string
  driverLicenseClazz: string
  driverLicenseNo: string
  driverLicenseExpire: string
  driverLicenseIssueDate: string
  driverLicenseFrontUrl: string
  driverLicenseFrontShowUrl: string
  driverLicenseBackUrl: string
  driverLicenseBackShowUrl: string
}
