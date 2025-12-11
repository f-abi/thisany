'use client'

import { Button } from '@/components/ui/button'
import {
  IconBackground,
  IconBrightness,
  IconBrightnessFilled,
  IconLayoutSidebarLeftCollapseFilled,
  IconLayoutSidebarLeftExpandFilled,
  IconSearch
} from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { COOKIE_NAME } from '@/constants'
import { SidebarItem } from '../layout/sidebar'
import { AppTheme } from '@/types'
import { BlurMask } from './mask'

function handleBlur() {
  const active = document.activeElement as HTMLElement
  if (active && active.tagName !== 'INPUT' && typeof active.blur === 'function') {
    active.blur()
  }
}

function SettingButton() {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <Button aria-label="设置" size="icon-lg" onClick={() => setVisible(!visible)}>
        <IconBackground />
      </Button>
      <BlurMask visible={visible}>
        <div>设置设置</div>
      </BlurMask>
    </>
  )
}

function SearchButton() {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button aria-label="搜索" size="icon-lg" onClick={() => setVisible(!visible)}>
        <IconSearch />
      </Button>
      <BlurMask visible={visible}>
        <div>搜索搜索搜索搜索搜索</div>
      </BlurMask>
    </>
  )
}

function ThemeButton({ theme: init }: { theme: AppTheme }) {
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

function SidebarBottomButton({ expand: init }: { expand: boolean }) {
  const [expand, setExpand] = useState(init)

  const toggleExpand = () => {
    const body = document.body
    if (body) {
      if (expand) body.classList.remove('sidebar-expand')
      else body.classList.add('sidebar-expand')
      document.cookie = `${COOKIE_NAME.SIDEBAR}=${expand ? '0' : '1'}; path=/; max-age=31536000`
      setExpand(!expand)
    }
  }

  useEffect(() => {
    window.addEventListener('touchmove', handleBlur, { passive: true })
    window.addEventListener('scroll', handleBlur, { passive: true })
    return () => {
      window.removeEventListener('touchmove', handleBlur)
      window.removeEventListener('scroll', handleBlur)
    }
  }, [])

  return (
    <div
      onClick={() => {
        toggleExpand()
        handleBlur()
      }}
    >
      <SidebarItem
        name={expand ? '收起' : '固定'}
        Icon={expand ? IconLayoutSidebarLeftCollapseFilled : IconLayoutSidebarLeftExpandFilled}
      />
    </div>
  )
}

export { SearchButton, SidebarBottomButton, ThemeButton, SettingButton }
