<template>
  <tm-app>
    <!--    登陆logo-->
    <view class="logo flex flex-col flex-center">
      <image src="@/static/images/logo.png"></image>
    </view>
    <view class="btn flex flex-col flex-center">
      <loading-button type="success" :click-fun="loginHandle" :shadow="0" size="large" label="微信登陆"></loading-button>
    </view>
    <tm-modal v-model:show="showModal" title="提示" :overlayClick="false" @ok="modalConformHandle" @cancel="modalCancelHandle">
      <template v-slot:button>
        <view class="flex flex-between modal-btn">
          <tm-button @click="modalCancelHandle" :width="300" :margin="[0, 0]" :padding="[0, 0]" color="grey-1" label="取消"></tm-button>
          <tm-button
            open-type="getPhoneNumber"
            @getphonenumber="modalConformHandle"
            :width="300"
            :margin="[0, 0]"
            :padding="[0, 0]"
            label="确认"
          ></tm-button>
        </view>
      </template>
      <tm-text
        label="亲爱的用户,很高兴为您提供代驾服务。为了保障双方权益,我们需要获取您的手机号码用于进行身份验证和紧急联系。但我们会对您的隐私信息进行严格保护。希望您理解我们的考量,感谢您的信任和支持。您的隐私安全对我们来说至关重要。请放心使用我们的服务!"
      ></tm-text>
    </tm-modal>
  </tm-app>
</template>
<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'
import { updateUserPhoneByWx } from '@/api/user'
const userStore = useUserStore()
const showModal = ref(false)
// 打开遮罩
function openModalHandle() {
  showModal.value = true
}
async function modalConformHandle(e: any) {
  const res = await updateUserPhoneByWx({ code: e.detail.code })
  if (res.data) {
    showModal.value = false
    userStore.goHome()
    await userStore.getUserInfo()
  }
}
function modalCancelHandle(e) {
  userStore.clearAllOfUser()
  showModal.value = false
}
// 登录
function loginHandle() {
  userStore.loginWithWechat(openModalHandle)
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
.modal-btn {
  width: 100%;
  transform: translate(0, 14rpx);
  position: relative;
  z-index: 999;
}
</style>
