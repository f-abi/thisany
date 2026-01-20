'use server'

import { cookies } from 'next/headers'
import { COOKIE_NAME } from 'shared'

import { AppTheme } from '@/types'

export const getTheme = async () => {
  const theme = (await cookies()).get(COOKIE_NAME.THEME)?.value
  return theme !== undefined && ['light', 'dark'].includes(theme) ? (theme as AppTheme) : 'dark'
}

export const getSidebarExpand = async () => {
  const expand = (await cookies()).get(COOKIE_NAME.SIDEBAR)?.value
  return expand !== undefined && ['0', '1'].includes(expand) ? expand === '1' : false
}
