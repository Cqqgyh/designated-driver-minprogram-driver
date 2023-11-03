import http from '@/http'
import { DriverAuthInfoInterface, UpdateUserInfoInterface, UserInfoInterface, WxUpdatePhoneInterface } from '@/api/user/types'
/**
 * @description 小程序登录
 * @param  {string} code
 */
export function getLogin(code: string) {
  return http.get<string>(`/driver/login/${code}`)
}
/**
 * @description 获取用户登陆信息
 */
export function getUserInfo() {
  return http.get<UserInfoInterface>('/driver/getDriverInfo')
}
/**
 * @description 更新用户信息
 */
export function updateUserInfo(userInfo: UpdateUserInfoInterface) {
  return http.post('/driver/updateDriverAuthInfo')
}

/**
 * 获取司机认证信息
 */
export function getDriverAuthInfo() {
  return http.get<DriverAuthInfoInterface>('/driver/getDriverAuthInfo')
}
/**
 * @description 更新用户手机号（通过微信）
 * @param  {WxUpdatePhoneInterface} params
 */
export function updateUserPhoneByWx(params: WxUpdatePhoneInterface) {
  return http.post('/driver/updateDriverPhone', params)
}
