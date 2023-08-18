<template>
  <uni-icons v-bind="$attrs" :color="color || themeColor"></uni-icons>
</template>
<script setup lang="ts">
// 使用 <theme-icon custom-prefix="iconfont" type="iconfontzan" size="50"></theme-icon>
import { useTheme } from '@/hooks/useTheme'
const { tmPiniaStore, getThemeColor } = useTheme()
const props = defineProps({
  color: {
    type: String,
    default: ''
  }
})
const themeColor = computed(() => {
  let themeColorName = tmPiniaStore.tmStore.color
  if (themeColorName) {
    return getThemeColor()
  }
  return getThemeColor()
})
</script>

<style scoped></style>
