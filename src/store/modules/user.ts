import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'app-user',
  state: () => ({
    token: '',
    userInfo: { token: '123' }
  }),
  actions: {},
  // 设置为true，缓存state
  persist: {
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync
    }
  }
})
