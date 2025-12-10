'use client'

import { Button } from '@/components/ui/button'
import { IconSearch } from '@tabler/icons-react'
import { useMaskStore } from '@/store/mask'

export function SearchButton() {
  const { show, hide, visible } = useMaskStore()

  const handleClick = () => {
    if (visible) hide()
    else show(<div>123456</div>)
  }

  return (
    <Button aria-label="搜索" size="icon-lg" onClick={handleClick}>
      <IconSearch />
    </Button>
  )
}
