import { defineStore } from 'pinia'
import { getRedirectUrl, removeRedirectUrl, removeToken, removeUser, setUser } from '@/utils/storage'
import { getLogin, getUserInfo, updateUserInfo } from '@/api/user'
import { TOKEN_KEY } from '@/config/constant'
import { UpdateUserInfoInterface, UserInfoInterface } from '@/api/user/types'
import GetUserInfoRes = UniNamespace.GetUserInfoRes

export const useUserStore = defineStore({
  id: 'app-user',
  state: () => ({
    token: '',
    user: { token: '123' } as any
  }),
  actions: {
    // 微信登陆
    loginWithWechat() {
      uni.login({
        provider: 'weixin',
        success: async (loginRes: { code: string }) => {
          await this.getToken(loginRes.code)
          // 登录成功，获取用户信息
          await this.getUserInfo()
          const redirectUrl = getRedirectUrl()
          console.log('redirectUrl', redirectUrl)
          uni.redirectTo({
            url: redirectUrl ? redirectUrl : '/pages/index/index'
          })
          // 清空重定向url
          removeRedirectUrl()
        },
        fail: (err: any) => {
          console.log(err)
        }
      })
    },
    // 获取token
    async getToken(code: string) {
      try {
        const res = await getLogin(code)
        if (res.data.token) {
          // 本地保存token
          uni.setStorageSync(TOKEN_KEY, res.data.token)
          this.token = res.data.token
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取用户信息
    async getUserInfo() {
      try {
        const res = await getUserInfo()
        // 如果用户信息不存在的,从微信获取用户信息
        if (!res.data.nickname || !res.data.avatarUrl) {
          uni.getUserInfo({
            provider: 'weixin',
            success: async (infoRes: GetUserInfoRes) => {
              const params = {
                avatarUrl: infoRes.userInfo.avatarUrl,
                nickname: infoRes.userInfo.nickName
              }
              // 在这里可以将用户信息传递给后端进行登录验证等操作
              // 更新用户信息
              await this.updateUserInfo(params)
              // 重新请求当前用户信息
              await this.getUserInfo()
            }
          })
        } else {
          this.user = res.data
          setUser(JSON.stringify(res.data))
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 更新用户信息
    async updateUserInfo(userInfo: UpdateUserInfoInterface) {
      try {
        const res = await updateUserInfo(userInfo)
      } catch (error) {
        console.log(error)
      }
    },
    // 退出登陆
    logout() {
      removeToken()
      removeUser()
      // uni.clearStorageSync()  // 清空所有缓存 可能有些缓存不需要清理，先留着，以后看情况再说
      this.user = {} as UserInfoInterface
      this.token = ''
      // 回到首页
      uni.navigateTo({
        url: '/pages/index/index'
      })
    }
  },
  // 设置为true，缓存state
  persist: {
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync
    }
  }
})
