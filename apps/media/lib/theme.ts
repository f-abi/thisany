'use server'

import type { AppTheme } from '@/types'
import { cookies } from 'next/headers'

export async function setTheme(theme: AppTheme) {
  const cookieStore = await cookies()
  cookieStore.set('theme', theme, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  })
}
