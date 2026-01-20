import { zh_cn, en } from '@nuxt/ui/locale'

export const locales = [
  {
    ...zh_cn,
    file: `${zh_cn.code}.json`
  },
  {
    ...en,
    file: `${en.code}.json`
  }
]

export const defaultLocale = zh_cn.code
