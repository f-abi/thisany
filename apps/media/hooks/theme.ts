'use client'

import { COOKIE_NAME } from '@/constants'
import { AppTheme } from '@/types'
import { useState } from 'react'

export const useTheme = (init: AppTheme) => {
  const [theme, setTheme] = useState(init)
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    const html = document.documentElement
    if (html) {
      html.classList.remove(theme)
      html.classList.add(nextTheme)
      document.cookie = `${COOKIE_NAME.THEME}=${nextTheme}; path=/; max-age=31536000`
      setTheme(nextTheme)
    }
  }
  return { theme, toggleTheme }
}
