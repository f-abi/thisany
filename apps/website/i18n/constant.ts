import type { LocaleObject } from '@nuxtjs/i18n'

export const locales: LocaleObject<string>[] = [
  {
    file: 'zh-CN.json',
    name: '简体中文',
    code: 'zh-CN',
    dir: 'ltr'
  },
  {
    file: 'en.json',
    name: 'English',
    code: 'en',
    dir: 'ltr'
  }
]

export const defaultLocale = 'en'
