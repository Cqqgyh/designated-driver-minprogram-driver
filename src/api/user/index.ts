import http from '@/http'
import {
  DriverAuthInfoInterface,
  DriverLoginInfoInterface,
  UpdateUserInfoInterface,
  UserInfoInterface,
  WxUpdatePhoneInterface
} from '@/api/user/types'
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
  return http.post('/driver/updateDriverAuthInfo', userInfo)
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
// 创建司机人脸模型
export function creatDriverFaceModel(params: { imageBase64: string }) {
  return http.post('/driver/creatDriverFaceModel', params)
}
// 验证司机人脸
export function verifyDriverFace(params: { imageBase64: string }) {
  return http.post('/driver/verifyDriverFace', params)
}
// 判断司机当日是否进行过人脸识别
export function getDriverIsFaceRecognition() {
  return http.get<boolean>('/driver/isFaceRecognition')
}

/**
 * 获取司机登录信息
 */
export function getDriverLoginInfo() {
  return http.get<DriverLoginInfoInterface>('/driver/getDriverLoginInfo')
}
