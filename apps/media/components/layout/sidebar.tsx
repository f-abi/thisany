import { IconProps } from '@tabler/icons-react'
import Link from 'next/link'
import { ForwardRefExoticComponent, PropsWithChildren, RefAttributes } from 'react'

import { SidebarBottomButton } from '@/components/common/button'
import { cn } from '@/lib/utils'

function Sidebar({ expand, children }: PropsWithChildren<{ expand: boolean }>) {
  return (
    <aside className="group sidebar-expand:w-34 sidebar-expand:h-auto sidebar-expand:top-20 md:sidebar-expand:py-2 fixed bottom-2 z-10 ml-2 flex h-14 w-14 flex-col justify-between transition-all select-none hover:w-34 sm:top-20 sm:h-auto md:py-2 [@media(hover:none)]:focus-within:w-34">
      <div className="glass absolute inset-0 -z-10" />
      <div className="sidebar-expand:flex hidden flex-col sm:flex">{children}</div>
      <div className="flex w-full flex-col">
        <div className="sidebar-expand:flex hidden px-2 sm:flex">
          <div className="bg-accent-foreground/10 h-px w-full" />
        </div>
        <SidebarBottomButton expand={expand} />
      </div>
    </aside>
  )
}

function SidebarItem({
  name,
  isActive = false,
  Icon,
  children
}: PropsWithChildren<{
  name: string
  isActive?: boolean
  Icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
}>) {
  return (
    <div tabIndex={0} className="group/item relative cursor-pointer p-2 outline-none">
      <div
        className={cn(
          'group-hover/item:bg-accent-foreground/10 group-hover/item:text-destructive [@media(hover:none)]:group-focus-within/item:bg-accent-foreground/10 flex flex-row items-center overflow-hidden rounded-lg p-2',
          isActive && 'bg-accent-foreground/10 text-destructive'
        )}
      >
        <Icon className="size-6 shrink-0" />
        <div className="sidebar-expand:opacity-100 ml-2 font-bold whitespace-nowrap opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 [@media(hover:none)]:group-focus-within:pointer-events-auto [@media(hover:none)]:group-focus-within:opacity-100">
          {name}
        </div>
      </div>
      {children}
    </div>
  )
}

function SidebarItemMenu({ children }: PropsWithChildren) {
  return (
    <div className="absolute top-0 left-full z-10 hidden pl-2 group-hover/item:flex [@media(hover:none)]:group-focus-within/item:flex">
      <div className="glass flex w-max max-w-[calc(100vw-40*var(--spacing))] flex-row flex-wrap p-2 xl:max-w-5xl">
        {children}
      </div>
    </div>
  )
}

function SidebarItemMenuLink({
  name,
  isActive,
  href
}: {
  name: string
  isActive: boolean
  href: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'hover:bg-accent-foreground/10 m-1 rounded-lg px-2 py-1',
        isActive && 'bg-accent-foreground/10 text-destructive'
      )}
    >
      {name}
    </Link>
  )
}

export { Sidebar, SidebarItem, SidebarItemMenu, SidebarItemMenuLink }
