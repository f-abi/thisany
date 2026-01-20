// https://nuxt.com/docs/api/configuration/nuxt-config
import { defaultLocale, locales } from './i18n/constant'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/image', '@nuxt/eslint', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  i18n: {
    locales,
    defaultLocale,
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      cookieKey: 'i18n'
    }
  },
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    storage: 'cookie',
    storageKey: 'theme'
  }
})
