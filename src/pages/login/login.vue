<template>
  <tm-app>
    <!--    登陆logo-->
    <view class="logo flex flex-col flex-center">
      <image src="@/static/images/logo.png"></image>
    </view>
    <view class="btn flex flex-col flex-center">
      <loading-button
        type="success"
        :click-fun="() => {}"
        open-type="getPhoneNumber"
        :bindgetphonenumber="getPhoneNumber"
        :shadow="0"
        size="large"
        label="微信登陆"
      ></loading-button>
    </view>
  </tm-app>
</template>
<script setup lang="ts">
// 微信登陆
// function loginWithWechat() {
//   uni.login({
//     provider: 'weixin',
//     success: async (loginRes: { code: string }) => {
//       console.log(loginRes)
//     },
//     fail: (err: any) => {
//       console.log(err)
//     }
//   })
// }
// loginWithWechat()
function getPhoneNumber(e) {
  console.log(e)
}
</script>

<style scoped lang="scss">
.logo {
  padding: 100rpx 0;
  image {
    width: 300rpx;
    height: 300rpx;
  }
}
.btn {
  margin-top: 100rpx;
  width: 100%;
}
</style>
