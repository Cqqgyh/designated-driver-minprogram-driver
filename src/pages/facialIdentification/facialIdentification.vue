<template>
  <tm-app>
    <tm-sheet :round="3" :shadow="2" @click="imageToBase64">
      <tm-icon :font-size="500" name=" tmicon-wind-smile"></tm-icon>
      <tm-button :shadow="0" text label="点击进行人脸识别" block></tm-button>
    </tm-sheet>
  </tm-app>
</template>
<script setup lang="ts">
import { creatDriverFaceModel, verifyDriverFace } from '@/api/user'

const props = defineProps({
  creatFaceModel: {
    type: Boolean,
    default: false
  }
})
// imageToBase64
function imageToBase64() {
  uni.chooseImage({
    count: 1, // 设置上传图片数量
    sizeType: ['original', 'compressed'], // ['original', 'compressed']可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // ['album', 'camera'] album 从相册选图，camera 使用相机，默认二者都有
    success: (chooseImageRes) => {
      console.log('chooseImageRes', chooseImageRes)
      //tempFilePaths 图片的本地文件路径列表
      const tempFilePaths = chooseImageRes.tempFilePaths
      uni.compressImage({
        src: tempFilePaths[0],
        quality: 10, //图片压缩质量，0～100，默认80，仅对jpg有效
        success: (res) => {
          console.log('res', res)
          //uni.getFileSystemManager() 获取全局唯一的文件管理器
          // readFile读取文件，可转换编码格式
          uni.getFileSystemManager().readFile({
            filePath: res.tempFilePath, // 要读取的文件的临时路径
            encoding: 'base64', // 编码格式
            success: async function (res) {
              props.creatFaceModel
                ? await creatDriverFaceModel({ imageBase64: 'data:image/png;base64,' + res.data })
                : await verifyDriverFace({ imageBase64: 'data:image/png;base64,' + res.data })
              // 去首页
              uni.navigateTo({
                url: '/pages/index/index',
                fail() {
                  uni.switchTab({
                    url: '/pages/index/index'
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}
onLoad(() => {
  console.log('onLoad-props', props)
})
</script>

<style scoped lang="scss"></style>
