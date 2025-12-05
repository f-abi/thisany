'use client'

import { Button } from '@/components/ui/button'
import { IconSearch } from '@tabler/icons-react'

export function SearchButton() {
  return (
    <Button aria-label="搜索" size="icon-lg">
      <IconSearch />
    </Button>
  )
}
