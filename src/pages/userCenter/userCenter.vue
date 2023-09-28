<template>
  <tm-app>
    <view class="user-info">
      <tm-image
        preview
        :width="250"
        :height="250"
        :round="25"
        :src="useUser.user.avatarUrl || 'https://p26-passport.byteacctimg.com/img/user-avatar/39dc370feeaaddfc5dfda471b23de255~50x50.awebp'"
      ></tm-image>
      <tm-text :font-size="50" class="mt-10" :label="useUser.user.nickname || '未登录'"></tm-text>
    </view>
    <view>
      <tm-cell @click="goPage(item)" v-for="item in navList" :key="item.name" :margin="[0, 0]" :titleFontSize="30">
        <template #title>
          <uni-icons custom-prefix="iconfont" :type="item.icon" :size="30"></uni-icons>
          <text class="ml-10">{{ item.name }}</text>
        </template>
      </tm-cell>
    </view>
    <loading-button
      v-if="useUser.token"
      :block="true"
      :click-fun="useUser.logout"
      :margin="[50]"
      :shadow="0"
      size="large"
      label="退出登录"
    ></loading-button>
    <loading-button v-else :block="true" :click-fun="goLogin" :margin="[50]" :shadow="0" size="large" label="登录"></loading-button>
    <!--    <loading-button :block="true" :click-fun="demo" :margin="[50]" :shadow="0" size="large" label="登录2"></loading-button>-->
    <view style="height: 20vh"></view>
    <tabbar-nav></tabbar-nav>
  </tm-app>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '@/hooks/useTheme'
import { useUserStore } from '@/store/modules/user'
const useUser = useUserStore()
const navList = ref([
  {
    name: '我的订单',
    icon: 'iconfonthangchengdanxiao',
    path: '/pages/orderList/orderList',
    isNav: false
  },
  {
    name: '优惠券',
    icon: 'iconfontyouhuiquan',
    path: '/pages/coupon/coupon',
    isNav: true
  }
])
// 切换主题
function demo() {
  useTheme().toggleThemeColor('#be2edd')
  // useTheme().toggleThemeColor('red')
}
// 去其他页面
function goPage(item: (typeof navList.value)[0]) {
  console.log('item', item)
  if (item.isNav) {
    uni.switchTab({
      url: item.path
    })
  } else {
    uni.navigateTo({
      url: item.path
    })
  }
}
// 去登陆页面
function goLogin() {
  uni.navigateTo({
    url: '/pages/login/login'
  })
}

onShow(() => {
  // 隐藏tabbar
  uni.hideTabBar()
})
</script>

<style scoped>
.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 30vh;
  padding: 5vh 0;
  background-image: url('https://picsum.photos/312/312?id=1');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
