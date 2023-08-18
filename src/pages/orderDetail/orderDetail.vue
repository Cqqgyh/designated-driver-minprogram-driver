<template>
  <tm-app>
    <!--    司机信息-->
    <tm-sheet>
      <view class="flex flex-row flex-row-center-start">
        <tm-avatar
          :size="170"
          :round="26"
          img="https://p26-passport.byteacctimg.com/img/user-avatar/39dc370feeaaddfc5dfda471b23de255~50x50.awebp"
        ></tm-avatar>
        <view class="flex flex-col ml-25">
          <view class="text-size-lg text-weight-b">张师傅</view>
          <view class="text-size-g text-gray">驾龄9年</view>
        </view>
      </view>
      <tm-divider></tm-divider>
      <view>
        <tm-cell :margin="[0, 0]" :titleFontSize="30">
          <template #title>
            <view class="flex flex-row flex-row-center-start">
              <view style="height: 20rpx; width: 20rpx; background-color: #93da5f; border-radius: 50%"></view>
              <text class="ml-20">{{ '北京天安门' }}</text>
            </view>
          </template>
          <template #right>
            <text class="ml-10 text-gray-1">{{ '出发地' }}</text>
          </template>
        </tm-cell>
        <tm-cell :margin="[0, 0]" :titleFontSize="30">
          <template #title>
            <view class="flex flex-row flex-row-center-start">
              <view style="height: 20rpx; width: 20rpx; background-color: #48b6fc; border-radius: 50%"></view>
              <text class="ml-20">{{ '北京天安门' }}</text>
            </view>
          </template>
          <template #right>
            <text class="ml-10 text-gray-1">{{ '目的地' }}</text>
          </template>
        </tm-cell>
      </view>
      <!--      订单创建时间-->
      <tm-cell :margin="[0, 0]" :titleFontSize="30">
        <template #title>
          <tm-text color="grey" label="2023/08/15 16:04:00"></tm-text>
        </template>
        <template #right></template>
      </tm-cell>
    </tm-sheet>
    <!--    司机信息-->
    <tm-sheet>
      <view v-for="item in descriptionsList.slice(0, descriptionsList.length - 1)" :key="item.label" class="flex flex-row" style="height: 80rpx">
        <view class="flex-1 flex flex-col-center-center border-l-2 border-t-2">{{ item.label }}</view>
        <view class="flex-1 flex-col-center-center border-l-2 border-r-2 border-t-2 text-gray-1">{{ item.value }}元</view>
      </view>
      <view v-for="item in descriptionsList.slice(descriptionsList.length - 1)" :key="item.label" class="flex flex-row" style="height: 80rpx">
        <view class="flex-1 flex flex-col-center-center border-l-2 border-t-2 border-b-2">{{ item.label }}</view>
        <view class="flex-1 flex-col-center-center border-l-2 border-r-2 border-t-2 border-b-2">{{ item.value }}元</view>
      </view>
    </tm-sheet>
  </tm-app>
</template>
<script setup lang="ts">
const descriptionsList = ref([
  { label: '起步价（含五公里）', value: 10 },
  { label: '收单免起步价优惠券', value: -10 },
  { label: '里程费', value: 20 },
  { label: '等待费', value: 10 },
  { label: '总费用', value: 40 }
])
</script>

<style scoped></style>
