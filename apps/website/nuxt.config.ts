// https://nuxt.com/docs/api/configuration/nuxt-config
import { defaultLocale, locales } from './i18n/constant'
import { COOKIE_NAME } from 'shared'
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
      cookieKey: COOKIE_NAME.I18N
    }
  },
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    storage: 'cookie',
    storageKey: COOKIE_NAME.THEME
  }
})
