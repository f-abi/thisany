'use client'

import type { AppTheme } from '@/types'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface Props {
  theme: AppTheme
}

export function ThemeButton({ theme }: Props) {
  const [currentTheme, setCurrentTheme] = useState(theme)
  const toggleTheme = () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark'
    const html = document.documentElement
    if (html) {
      html.classList.remove(currentTheme)
      html.classList.add(nextTheme)
      document.cookie = `theme=${nextTheme}; path=/; max-age=31536000`
      setCurrentTheme(nextTheme)
    }
  }
  return (
    <Button aria-label="切换主题" onClick={toggleTheme} size="icon-lg">
      {currentTheme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
