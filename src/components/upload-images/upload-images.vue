<template>
  <tm-upload v-bind="$attrs" :url="upLoadUrl" @success="success" @remove="remove"></tm-upload>
</template>
<script setup lang="ts">
import { useAttrs } from 'vue'
const upLoadUrl = ref((import.meta.env.VITE_APP_UPLOAD_URL as string) + '/file/upload')
const attrs = useAttrs()
const emit = defineEmits(['update:modelValue'])

const props = defineProps(['modelValue'])
const success = (item: any, fileList: any) => {
  console.log('success', item, fileList)
  let targetList = fileList.map((item: any) => {
    const targetItem = JSON.parse(item.response)
    return {
      url: targetItem.data,
      name: targetItem.data
    }
  })
  emit('update:modelValue', targetList)
}
const remove = (item: any) => {
  const targetItem = item.response ? JSON.parse(item.response) : { data: item.url }
  let targetList = props.modelValue.filter((item2: any) => {
    return item2.url !== targetItem.data
  })
  emit('update:modelValue', targetList)
}
</script>

<style scoped></style>
