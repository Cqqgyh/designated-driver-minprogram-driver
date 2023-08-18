import http from '@/http'
/**
 * @description 获取数据字典接口
 * @param params
 */
export function getCode() {
  return http.get<string>('/admin/login/captcha')
}
