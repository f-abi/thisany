<script setup lang="ts">
import { locales } from '~~/i18n/constant'
const { locale } = useI18n()
const lang = computed(() => {
  return locales.find(l => l.code === locale.value)
})
</script>

<template>
  <UApp :locale="lang">
    <NuxtLoadingIndicator
      color="repeating-linear-gradient(to right,#8eabff 0%,#618dff 50%,#0052d9 100%)"
    />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
