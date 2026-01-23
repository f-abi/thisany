// https://tailwindcss.com/docs/installation/framework-guides/nuxt
import tailwindcss from '@tailwindcss/vite'
import { defaultLocale, locales } from './i18n/constant'
import { COOKIE_NAME } from 'shared'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/image', '@nuxt/eslint', '@nuxtjs/i18n', '@nuxtjs/color-mode'],
  devtools: { enabled: true },
  app: {
    head: {
      viewport:
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover'
    }
  },
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    storage: 'cookie',
    storageKey: COOKIE_NAME.THEME
  },
  runtimeConfig: {},
  compatibilityDate: '2025-07-15',
  i18n: {
    locales,
    defaultLocale,
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      cookieKey: COOKIE_NAME.I18N
    }
  },
  vite: {
    plugins: [tailwindcss()]
  }
})
