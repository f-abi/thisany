<script setup lang="ts">
import { locales } from '~~/i18n/constant'

const { locale } = useI18n()
const lang = computed(() => {
  return locales.find(l => l.code === locale.value)
})

useHead({
  htmlAttrs: {
    lang: computed(() => lang.value?.code)
  }
})
</script>

<template>
  <NuxtLoadingIndicator
    color="repeating-linear-gradient(to right,#8eabff 0%,#618dff 50%,#0052d9 100%)"
  />
  <AppCursor />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
