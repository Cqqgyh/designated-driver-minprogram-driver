<template>
  <tm-app>
    <view class="user-info">
      <tm-image
        preview
        :width="250"
        :height="250"
        :round="25"
        src="https://p26-passport.byteacctimg.com/img/user-avatar/39dc370feeaaddfc5dfda471b23de255~50x50.awebp"
      ></tm-image>
      <tm-text :font-size="50" class="mt-10" label="用户名"></tm-text>
    </view>
    <view>
      <tm-cell v-for="item in navList" :key="item.name" :margin="[0, 0]" :titleFontSize="30">
        <template #title>
          <uni-icons custom-prefix="iconfont" :type="item.icon" :size="30"></uni-icons>
          <text class="ml-10">{{ item.name }}</text>
        </template>
      </tm-cell>
    </view>
    <loading-button :block="true" :click-fun="demo" :margin="[50]" :shadow="0" size="large" label="退出登陆"></loading-button>
    <view style="height: 20vh"></view>
    <tabbar-nav></tabbar-nav>
  </tm-app>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '@/hooks/useTheme'
const navList = ref([
  {
    name: '我的订单',
    icon: 'iconfonthangchengdanxiao'
  },
  {
    name: '优惠券',
    icon: 'iconfontyouhuiquan'
  },
  {
    name: '我的收藏',
    icon: 'iconfontzan'
  },
  {
    name: '我的收藏',
    icon: 'iconfontzan'
  }
])
// 切换主题
function demo() {
  useTheme().toggleThemeColor('#be2edd')
  // useTheme().toggleThemeColor('red')
}
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
