'use client'

import type { AppTheme } from '@/types'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { COOKIE_NAME } from '@/constants'
import { IconBrightness, IconBrightnessFilled } from '@tabler/icons-react'

export function ThemeButton({ theme: init }: { theme: AppTheme }) {
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

  return (
    <Button aria-label="切换主题" onClick={toggleTheme} size="icon-lg">
      {theme === 'dark' ? <IconBrightness /> : <IconBrightnessFilled />}
    </Button>
  )
}
