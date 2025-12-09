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
    <div onClick={toggleExpand}>
      <SidebarItem
        name={currentExpand ? '收起' : '固定'}
        Icon={
          currentExpand ? IconLayoutSidebarLeftCollapseFilled : IconLayoutSidebarLeftExpandFilled
        }
      />
    </div>
  )
}
