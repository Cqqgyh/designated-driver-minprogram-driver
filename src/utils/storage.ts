import { getCurrentPageInfo } from '@/utils/index'
import { REDIRECT_URL_KEY, TOKEN_KEY, USER_KEY } from '@/config/constant'
//#region <重定向url>
/**
 * @description: 存储重定向url
 */
export function setRedirectUrl() {
  // 获取当前页面对象
  const pageInfo = getCurrentPageInfo()
  console.log('pageInfo', pageInfo)
  // uniapp+vue3中存在bug，小程序不能实时获取到fullPath，需要延迟获取，确保已经获取到fullPath
  setTimeout(() => {
    uni.setStorageSync(REDIRECT_URL_KEY, encodeURIComponent(pageInfo.fullPath))
  }, 0)
}
/**
 * @description: 获取重定向url
 */
export function getRedirectUrl() {
  return decodeURIComponent(uni.getStorageSync(REDIRECT_URL_KEY) || '')
}
/**
 * @description: 清空重定向url
 */
export function removeRedirectUrl() {
  uni.removeStorageSync(REDIRECT_URL_KEY)
}
//#endregion
//#region <token>
/**
 * @description: 存储token
 */
export function setToken(token: string) {
  uni.setStorageSync(TOKEN_KEY, token)
}

/**
 * @description: 获取token
 * @return {*}
 */
export function getToken() {
  return uni.getStorageSync(TOKEN_KEY)
}

/**
 * @description: 清空token
 */
export function removeToken() {
  uni.removeStorageSync(TOKEN_KEY)
}
//#endregion
//#region <user>
/**
 * @description: 存储用户信息
 */
export function setUser(user: any) {
  uni.setStorageSync(USER_KEY, user)
}

/**
 * @description: 获取用户信息
 */
export function getUser() {
  return uni.getStorageSync(USER_KEY)
}

/**
 * @description: 清空用户信息
 */
export function removeUser() {
  uni.removeStorageSync(USER_KEY)
}
//#endregion
