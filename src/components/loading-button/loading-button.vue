<template>
  <tm-button @click="clickHandle" v-bind="$attrs" :loading="loading" :color="color"></tm-button>
</template>
<script setup lang="ts">
import { PropType } from 'vue'
type buttonType = 'primary' | 'success' | 'warning' | 'danger' | 'info'
const props = defineProps({
  clickFun: {
    type: Function,
    default: () => {}
  },
  type: {
    type: String as PropType<buttonType>,
    default: 'primary'
  }
})
const loading = ref(false)
const color = computed(() => {
  const typeColorList = [
    {
      type: 'primary',
      color: ''
    },
    {
      type: 'success',
      color: 'green'
    },
    {
      type: 'warning',
      color: 'deep-orange'
    },
    {
      type: 'danger',
      color: 'red'
    },
    {
      type: 'info',
      color: 'grey-darken-1'
    }
  ]
  return typeColorList.find((item) => item.type === props.type)?.color || ''
})
async function clickHandle() {
  try {
    loading.value = true
    await props.clickFun()
    // loading.value = false
    setTimeout(() => {
      loading.value = false
    }, 100)
  } catch (error) {
    console.log(error)
    loading.value = false
  }
}
</script>

<style scoped></style>
