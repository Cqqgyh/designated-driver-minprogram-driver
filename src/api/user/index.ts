import http from '@/http'
import { LoginResponseInterface, UpdateUserInfoInterface, UserInfoInterface } from '@/api/user/types'
/**
 * @description 小程序登录
 * @param  {string} code
 */
export function getLogin(code: string) {
  return http.get<LoginResponseInterface>(`/api/user/wxLogin/wxLogin/${code}`)
}
/**
 * @description 获取用户登陆信息
 */
export function getUserInfo() {
  return http.get<UserInfoInterface>('/api/user/wxLogin/getUserInfo')
}
/**
 * @description 更新用户信息
 */
export function updateUserInfo(userInfo: UpdateUserInfoInterface) {
  return http.post('/api/user/wxLogin/updateUser')
}
