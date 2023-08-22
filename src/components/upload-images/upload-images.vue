<template>
  <tm-upload v-bind="$attrs" :url="upLoadUrl"></tm-upload>
</template>
<script setup lang="ts">
const upLoadUrl = ref(import.meta.env.VITE_APP_UPLOAD_URL as string)
</script>

<style scoped></style>
