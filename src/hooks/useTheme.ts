import { useTmpiniaStore } from '@/tmui/tool/lib/tmpinia'
import { useTabBarStore } from '@/store/modules/tabBarNav'
export const useTheme = () => {
  const tmPiniaStore = useTmpiniaStore()
  /**
   * @description: 切换暗黑模式/亮白模式
   */
  const toggleDarkOrLight = () => {
    tmPiniaStore.setTmVuetifyDark(!tmPiniaStore.tmStore.dark)
  }
  /**
   * @description: 切换主题颜色
   * @param color 颜色HexColor
   */
  const toggleThemeColor = (color: string) => {
    color = color.trim().toLocaleUpperCase()
    if (!color) {
      uni.showToast({
        title: '颜色不能为空'
      })
    }
    tmPiniaStore.setTmVuetifyAddTheme(`name-${color}`, color)
    //   更新导航颜色
    useTabBarStore()?.updateActiveNavActiveColor()
  }
  /**
   * @description: 通过颜色主题名称切换主题颜色
   * @param colorName
   */
  const toggleThemeColorByColorThemeName = (colorName: string) => {
    const color = tmPiniaStore.tmStore.colorList.find((item) => item.name === colorName)?.value
    if (!color) return
    toggleThemeColor(color)
  }
  const getThemeColor = () => {
    return (
      tmPiniaStore.tmStore.colorList.find((item) => item.name === tmPiniaStore.tmStore.color)?.value ||
      tmPiniaStore.tmStore.colorList.find((item) => item.name === 'primary')?.value ||
      ''
    )
  }
  const themeColor = computed(() => {
    const themeColorName = tmPiniaStore.tmStore.color
    if (themeColorName) {
      return getThemeColor()
    }
    return getThemeColor()
  })
  return {
    themeColor,
    tmPiniaStore,
    getThemeColor,
    toggleDarkOrLight,
    toggleThemeColor,
    toggleThemeColorByColorThemeName
  }
}
