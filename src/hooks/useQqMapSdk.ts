import { QqMapkey } from '@/config/config'
import QQMapWX from '@/libs/qqmap-wx-jssdk'
export const useQqMapSdk = () => {
  const key = QqMapkey //使用在腾讯位置服务申请的key
  const referer = import.meta.env.VITE_APP_TITLE //调用插件的app的名称
  console.log('referer', referer)
  // 实例化API核心类
  const qqmapsdk = new QQMapWX({
    key: QqMapkey
  })
  return {
    qqmapsdk,
    key,
    referer
  }
}
