'use client'

import {
  IconLayoutSidebarLeftCollapseFilled,
  IconLayoutSidebarLeftExpandFilled
} from '@tabler/icons-react'
import { SidebarItem } from '@/components/layout/sidebar'
import { useSidebar } from '@/hooks/sidebar'

export function SidebarBottom({ expand }: { expand: boolean }) {
  const { expand: currentExpand, toggleExpand } = useSidebar(expand)
  return (
    <div className="mb-2 flex w-full flex-col">
      <div className="px-2">
        <div className="bg-accent-foreground/10 h-px w-full" />
      </div>
      <div onClick={toggleExpand}>
        <SidebarItem
          name={currentExpand ? '收起' : '固定'}
          Icon={
            currentExpand ? IconLayoutSidebarLeftCollapseFilled : IconLayoutSidebarLeftExpandFilled
          }
        />
      </div>
    </div>
  )
}
