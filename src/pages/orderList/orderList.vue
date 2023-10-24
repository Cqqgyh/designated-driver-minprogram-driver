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
      :defaultValue="navList[0]?.id || 0"
      @change="navChangeHandle"
    ></tm-segtab>
    <tm-scrolly _style="height: 90vh" v-model="refreshStatus" v-model:bottom-value="refreshBottomStatus" @refresh="refresh" @bottom="refreshBottom">
      <view v-for="(item, index) in orderList" :key="index">
        <tm-sheet @click="goToOtherPage(item)" :margin="[25]" :round="3" :shadow="2" _class="text-size-m">
          <tm-cell :margin="[0, 0]">
            <template #title>
              <tm-text
                _class="text-weight-b"
                color="red"
                :label="(item.status < OrderStatus.UNPAID ? '预估:' : '总共:') + item.amount.toFixed(2) + '元'"
              ></tm-text>
            </template>
            <template #right>
              <text class="ml-10 text-gray-1">{{ getLabelByValue(OrderStatusMap, item.status) }}</text>
            </template>
          </tm-cell>
          <view>
            <tm-cell :margin="[0, 0]">
              <template #title>
                <view class="flex flex-row flex-row-center-start text-size-m">
                  <view style="height: 20rpx; width: 20rpx; background-color: #93da5f; border-radius: 50%"></view>
                  <text class="ml-20 text-overflow-1">
                    {{ item.startLocation }}
                  </text>
                </view>
              </template>
              <template #right>
                <text class="ml-10 text-gray-1">{{ '' }}</text>
              </template>
            </tm-cell>
            <tm-cell :margin="[0, 0]">
              <template #title>
                <view class="flex flex-row flex-row-center-start">
                  <view style="height: 20rpx; width: 20rpx; background-color: #48b6fc; border-radius: 50%"></view>
                  <text class="ml-20 text-overflow-1">
                    {{ item.endLocation }}
                  </text>
                </view>
              </template>
              <template #right>
                <text class="ml-10 text-gray-1">{{ '' }}</text>
              </template>
            </tm-cell>
          </view>
          <!--      订单创建时间-->
          <tm-cell :margin="[0, 0]">
            <template #title>
              <tm-text color="grey" :label="item.createTime"></tm-text>
            </template>
            <template #right></template>
          </tm-cell>
        </tm-sheet>
      </view>
    </tm-scrolly>
  </tm-app>
</template>
<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme'
import { getOrderListPage } from '@/api/order'
import { IOrderListItem } from '@/api/order/types'
import { getLabelByValue, OrderStatus, OrderStatusMap } from '@/config/constEnums'
const { themeColor } = useTheme()

const currentIndex = ref(0)
const navList = ref([
  {
    id: 111,
    text: '订单'
  }
  // {
  //   id: 1,
  //   text: '行程中'
  // },
  // {
  //   id: 2,
  //   text: '已完成'
  // },
  // {
  //   id: 3,
  //   text: '已取消'
  // }
])
// 导航栏切换
function navChangeHandle(index: number) {
  console.log(index)
  console.log('currentIndex', currentIndex.value)
}
//#region <下拉刷新，上拉加载>
const refreshStatus = ref(false)
const refreshBottomStatus = ref(false)
// 下拉刷新
async function refresh() {
  refreshStatus.value = true
  console.log('下拉刷新')
  // 重置页面
  pageInfo.value.page = 1
  // 获取订单列表
  await getOrderListHandle()
  refreshStatus.value = false
}
// 上拉加载
async function refreshBottom() {
  console.log('上拉加载')
  refreshBottomStatus.value = true
  if (pageInfo.value.page >= pageInfo.value.pages) {
    refreshBottomStatus.value = false
    return
  }
  pageInfo.value.page++
  await getOrderListHandle()
  refreshBottomStatus.value = false
}

//#region <订单>
// 订单列表
const pageInfo = ref({
  page: 1,
  limit: 10,
  pages: 0,
  total: 0
})
const orderList = ref<IOrderListItem[]>([])
// 获取订单列表
async function getOrderListHandle() {
  const res = await getOrderListPage(pageInfo.value)
  pageInfo.value = {
    page: res.data.page,
    limit: res.data.limit,
    pages: res.data.pages,
    total: res.data.total
  }
  if (res.data.page === 1) {
    orderList.value = res.data.records
  } else {
    orderList.value = [...orderList.value, ...res.data.records]
  }
}
//#endregion
function goToOtherPage(item: IOrderListItem) {
  if (item.status === OrderStatus.CANCEL_ORDER) {
    // 跳转到订单详情
    uni.showToast({
      title: '该订单已取消',
      icon: 'none'
    })
  } else if (item.status >= OrderStatus.UNPAID) {
    // 跳转到订单详情
    uni.navigateTo({
      url: '/pages/orderDetail/orderDetail?orderId=' + item.id
    })
  } else {
    // 跳转正在进行的订单
    console.log('跳转正在进行的订单')
    uni.navigateTo({
      url: '/pages/creatOrder/creatOrder?orderId=' + item.id
    })
  }
}
onLoad(() => {
  getOrderListHandle()
})
</script>

<style scoped></style>
