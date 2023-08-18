<template>
  <tm-button @click="clickHandle" v-bind="$attrs" :loading="loading"></tm-button>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps({
  clickFun: {
    type: Function,
    default: () => {}
  }
})
const loading = ref(false)
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
