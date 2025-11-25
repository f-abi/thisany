'use client'

import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export function SearchButton() {
  return (
    <Button aria-label="搜索" size="icon-lg" variant="ghost">
      <Search />
    </Button>
  )
}
