'use client'

import { COOKIE_NAME } from '@/constants'
import { useState } from 'react'

export const useSidebar = (init: boolean) => {
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
  return { expand, toggleExpand }
}
