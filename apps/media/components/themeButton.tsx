'use client'

import type { AppTheme } from '@/types'
import { Moon, Sun } from 'lucide-react'
import { setTheme } from '@/lib/theme'
import { Button } from './ui/button'

interface Props {
  theme: AppTheme
}

export function ThemeButton({ theme }: Props) {
  const toggleTheme = () => {
    setTheme(({ dark: 'light', light: 'dark' } as const)[theme])
  }
  return (
    <Button aria-label="切换主题" onClick={toggleTheme} size="icon-lg" variant="outline">
      {theme === 'dark' ? <Moon /> : <Sun />}
    </Button>
  )
}
