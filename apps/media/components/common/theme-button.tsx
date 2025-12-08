'use client'

import type { AppTheme } from '@/types'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/theme'

interface Props {
  theme: AppTheme
}

export function ThemeButton({ theme }: Props) {
  const { theme: currentTheme, toggleTheme } = useTheme(theme)
  return (
    <Button aria-label="切换主题" onClick={toggleTheme} size="icon-lg">
      {currentTheme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
