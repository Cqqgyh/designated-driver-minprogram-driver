<template>
  <tm-upload v-bind="$attrs" :url="upLoadUrl" :header="header" @success="success" @remove="remove"></tm-upload>
</template>
<script setup lang="ts">
import { useAttrs } from 'vue'
import { getToken } from '@/utils/storage'
const props = defineProps(['modelValue', 'suffixUrl'])
const upLoadUrl = computed(() => {
  return (import.meta.env.VITE_APP_UPLOAD_URL as string) + (props.suffixUrl as string)
})
const header = ref({
  token: getToken()
})
const attrs = useAttrs()
const emit = defineEmits(['update:modelValue'])

const success = (item: any, fileList: any) => {
  console.log('success', item, fileList)
  let targetList = fileList.map((item: any) => {
    const targetItem = JSON.parse(item.response)
    return {
      url: targetItem.data.idcardFrontShowUrl,
      name: targetItem.data.idcardFrontShowUrl,
      originalData: targetItem.data
    }
  })
  emit('update:modelValue', targetList)
}
const remove = (item: any) => {
  console.log('item', item)
  const targetItem = item.response ? JSON.parse(item.response) : { data: item.url }
  let targetList = props.modelValue.filter((item2: any) => {
    return !JSON.stringify(targetItem).includes(item2.url)
  })
  console.log('targetList', targetList)
  emit('update:modelValue', targetList)
}
</script>

<style scoped></style>
