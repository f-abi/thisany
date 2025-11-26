'use client'

import { APP_NAV_CONFIG } from '@/constants'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export function NavLinkBox({ type, name }: (typeof APP_NAV_CONFIG)[number]) {
  const pathname = usePathname()
  const isActive = new RegExp(`/${type}(/|$)`).test(pathname)
  return (
    <div
      className={cn(
        'group relative flex flex-col items-center py-2 transition-all duration-300 hover:font-black',
        isActive ? 'text-destructive font-black' : 'hover:text-destructive'
      )}
    >
      <span>{name}</span>
      <div
        className={cn(
          'bg-destructive absolute bottom-0 h-1 rounded-full transition-all duration-300',
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
        )}
      ></div>
    </div>
  )
}
