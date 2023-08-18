import Request, { HttpRequestConfig } from 'luch-request'
import { ResultData, ResultEnum } from '@/http/type'

const service = new Request()
// 全局配置
service.setConfig((config) => {
  /* config 为默认全局配置*/
  // config.baseURL = 'https://www.example.com' /* 根域名 */
  // 判断环境设置不同的baseURL
  config.timeout = ResultEnum.TIMEOUT
  config.baseURL = import.meta.env.VITE_APP_NODE_ENV === 'development' ? import.meta.env.VITE_APP_BASE_API : import.meta.env.VITE_APP_BASE_URL
  return config
})
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 可使用async await 做异步操作
    config.header = {
      ...config.header
    }
    // 演示custom 用处
    // if (config.custom.auth) {
    //   config.header.token = 'token'
    // }
    // if (config.custom.loading) {
    //  uni.showLoading()
    // }
    // 演示
    // if (!token) { // 如果token不存在，return Promise.reject(config) 会取消本次请求
    // 	return Promise.reject(config)
    // }
    return config
  },
  (config) => {
    uni
      .showToast({
        title: '请求错误',
        icon: 'error'
      })
      .then((r) => {})
    // 可使用async await 做异步操作
    return Promise.reject(config)
  }
)
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { data } = response
    /* 对响应成功做点什么 可使用async await 做异步操作*/
    // if (response.data.code !== 200) { // 服务端返回的状态码不等于200，则reject()
    //    	return Promise.reject(response) // return Promise.reject 可使promise状态进入catch
    // if (response.config.custom.verification) { // 演示自定义参数的作用
    //   	return response.data
    // }
    // * 登陆失效
    if (ResultEnum.EXPIRE.includes(data.code)) {
      // RESEETSTORE()
      uni.showToast({
        title: data.message || ResultEnum.ERRMESSAGE,
        icon: 'error'
      })
      // router.replace(LOGIN_URL)
      return Promise.reject(data)
    }
    // * 请求失败
    if (data.code && data.code !== ResultEnum.SUCCESS) {
      uni.showToast({
        title: data.message || ResultEnum.ERRMESSAGE,
        icon: 'error'
      })
      return Promise.reject(data)
    }
    // console.log(response)
    return data
  },
  (response) => {
    /*  对响应错误做点什么 （statusCode !== 200）*/
    const status = response?.statusCode
    // 处理 HTTP 网络错误
    let message = ''
    console.log(response)
    switch (status) {
      case 401:
        message = 'token 失效，请重新登录'
        break
      case 403:
        message = '拒绝访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器故障'
        break
      default:
        message = '网络连接故障'
    }
    uni.showToast({
      title: message,
      icon: 'error'
    })
    return Promise.reject(response)
  }
)

const http = {
  get<T>(url: string, params?: object, config?: HttpRequestConfig): Promise<ResultData<T>> {
    return service.get(url, { params, ...config })
  },

  post<T>(url: string, data?: object, config?: HttpRequestConfig): Promise<ResultData<T>> {
    return service.post(url, data, config)
  },

  put<T>(url: string, data?: object, config?: HttpRequestConfig): Promise<ResultData<T>> {
    return service.put(url, data, config)
  },

  delete<T>(url: string, data?: object, config?: HttpRequestConfig): Promise<ResultData<T>> {
    return service.delete(url, data, config)
  }
}
export default http
