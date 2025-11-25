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
    const root = document.documentElement
    if (root) {
      root.classList.remove(currentTheme)
      root.classList.add(nextTheme)
      document.cookie = `theme=${nextTheme}; path=/; max-age=31536000`
      setCurrentTheme(nextTheme)
    }
  }
  return (
    <Button aria-label="切换主题" onClick={toggleTheme} size="icon-lg" variant="ghost">
      {currentTheme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
