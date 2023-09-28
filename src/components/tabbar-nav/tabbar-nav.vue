<template>
  <tm-tabbar v-bind="$attrs" :autoSelect="false" v-model:active="tabBarStore.activeNavIndex">
    <tm-tabbar-item
      v-for="item in tabBarStore.tabBarNavList"
      :key="item.index"
      @click="tabBarStore.setActiveNavIndex(item.index)"
      :url="item.pagePath"
      :activeColor="item.activeColor"
      open-type="switchTab"
      :text="item.text"
      :icon="item.icon"
    ></tm-tabbar-item>
  </tm-tabbar>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useTabBarStore } from '@/store/modules/tabBarNav'
import { getCurrentPageInfo } from '@/utils'
import { isNumber } from '@/utils/is'
const pageInfo = ref(getCurrentPageInfo())
const tabBarStore = useTabBarStore()
onShow(() => {
  // 找到当前路由
  const routePathIndex = tabBarStore.tabBarNavList.find((item) => item.pagePath === pageInfo.value.route)?.index
  // 设置当前活动路由
  isNumber(routePathIndex) && tabBarStore.setActiveNavIndex(routePathIndex)
})
</script>
