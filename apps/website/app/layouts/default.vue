<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { locales } from '~~/i18n/constant'

const { locale, setLocale } = useI18n()

const route = useRoute()

const items: NavigationMenuItem[] = [
  {
    label: 'Video',
    to: 'https://www.thisany.com',
    target: '_blank'
  },
  {
    label: 'Jenkins',
    to: 'https://s.thisany.com',
    target: '_blank'
  }
]
</script>

<template>
  <UHeader>
    <template #title>
      <Logo />
    </template>
    <UNavigationMenu :items="items" />
    <template #right>
      <ULocaleSelect
        :model-value="locale"
        :locales="locales"
        @update:model-value="locale => setLocale(locale as 'zh-CN' | 'en')"
        variant="ghost"
      />
      <UColorModeButton />
    </template>
  </UHeader>
  <UContainer>
    <slot />
  </UContainer>
  <UFooter>
    <template #left>
      <p class="text-muted text-sm">Copyright © {{ new Date().getFullYear() }}</p>
    </template>
  </UFooter>
</template>
