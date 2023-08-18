import { defineStore } from 'pinia'
import { useTmpiniaStore } from '@/tmui/tool/lib/tmpinia'
function getActiveColor() {
  const colorThemeCorlorName = useTmpiniaStore().tmStore.color
  return colorThemeCorlorName ? useTmpiniaStore().tmStore.colorList.find((item) => item.name === colorThemeCorlorName)?.value : 'primary'
}
export const useTabBarStore = defineStore({
  id: 'app-tabBar-nav',
  state: () => ({
    activeNavIndex: 0,
    tabBarNavList: [
      {
        index: 0,
        activeColor: getActiveColor(),
        icon: 'tmicon-collection-fill',
        text: '首页',
        pagePath: '/pages/index/index'
      },
      {
        index: 1,
        activeColor: getActiveColor(),
        icon: 'tmicon-icon',
        text: '优惠券',
        pagePath: '/pages/coupon/coupon'
      },
      {
        index: 2,
        activeColor: getActiveColor(),
        icon: 'tmicon-userplus-fill',
        text: '个人中心',
        pagePath: '/pages/userCenter/userCenter'
      }
    ]
  }),
  actions: {
    setActiveNavIndex(index: number) {
      this.activeNavIndex = index
    }
  }
})
