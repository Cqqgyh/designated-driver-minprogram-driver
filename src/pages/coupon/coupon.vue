<template>
  <tm-app>
    <tm-segtab
      class="mb-15"
      :height="54"
      :width="750"
      :gutter="0"
      :color="themeColor"
      activeColor="white"
      :list="navList"
      v-model="currentIndex"
      :defaultValue="0"
    ></tm-segtab>
    <tm-scrolly _style="height: 85vh" v-model="refreshStatus" v-model:bottom-value="refreshBottomStatus" @refresh="refresh" @bottom="refreshBottom">
      <view v-for="(item, index) in [...navList, ...navList, ...navList, ...navList, ...navList]" :key="index">
        <tm-coupon color="pink" linear="right" linear-deep="accent" mainColor="yellow" font-color="" extra>
          <template v-slot:extra>
            <tm-text :font-size="22" _class="opacity-7" label="1.使用不受限制"></tm-text>
            <tm-text :font-size="22" _class="opacity-7" label="2.使用不受限制"></tm-text>
          </template>
        </tm-coupon>
      </view>
    </tm-scrolly>
    <!--    底部导航栏-->
    <tabbar-nav></tabbar-nav>
  </tm-app>
</template>
<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme'

const { themeColor } = useTheme()

const currentIndex = ref(0)
const navList = ref([
  {
    id: 0,
    text: '全部'
  },
  {
    id: 1,
    text: '未使用'
  },
  {
    id: 2,
    text: '已使用'
  },
  {
    id: 3,
    text: '已过期'
  }
])
//#region <下拉刷新，上拉加载>
const refreshStatus = ref(false)
const refreshBottomStatus = ref(false)
// 下拉刷新
function refresh() {
  refreshStatus.value = true
  console.log('下拉刷新')
  setTimeout(() => {
    refreshStatus.value = false
  }, 1000)
}
// 上拉加载
function refreshBottom() {
  console.log('上拉加载')
}
//#endregion
</script>

<style scoped></style>
