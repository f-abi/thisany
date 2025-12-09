import { cn } from '@/lib/utils'
import { Icon, IconProps } from '@tabler/icons-react'
import Link from 'next/link'
import { ForwardRefExoticComponent, PropsWithChildren, RefAttributes } from 'react'
import { SidebarBottom } from '@/components/common/sidebar-bottom'

function Sidebar({ expand, children }: PropsWithChildren<{ expand: boolean }>) {
  return (
    <aside className="group sidebar-expand:w-34 fixed top-20 bottom-2 z-10 ml-2 hidden w-14 flex-col justify-between py-2 transition-all select-none hover:w-34 sm:flex [@media(hover:none)]:focus-within:w-34">
      <div className="glass absolute inset-0 -z-10" />
      {children}
      <div className="mb-2 flex w-full flex-col">
        <div className="px-2">
          <div className="bg-accent-foreground/10 h-px w-full" />
        </div>
        <SidebarBottom expand={expand} />
      </div>
    </aside>
  )
}

function SidebarContent({ children }: PropsWithChildren) {
  return <div className="flex flex-col gap-2">{children}</div>
}

function SidebarItem({
  name,
  isActive = false,
  href,
  Icon,
  children
}: PropsWithChildren<{
  name: string
  isActive?: boolean
  href?: string
  Icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>
}>) {
  const Item = href ? Link : 'div'
  return (
    <div tabIndex={0} className="group/item relative h-10 cursor-pointer p-2 outline-none">
      <Item
        href={href!}
        className={cn(
          'group-hover/item:bg-accent-foreground/10 group-hover/item:text-destructive [@media(hover:none)]:group-focus-within/item:bg-accent-foreground/10 flex flex-row items-center rounded-lg p-2',
          isActive && 'bg-accent-foreground/10 text-destructive'
        )}
      >
        <Icon className="size-6 shrink-0" />
        <div className="sidebar-expand:opacity-100 ml-2 font-bold whitespace-nowrap opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 [@media(hover:none)]:group-focus-within:pointer-events-auto [@media(hover:none)]:group-focus-within:opacity-100">
          {name}
        </div>
      </Item>
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

export { Sidebar, SidebarContent, SidebarItem, SidebarItemMenu, SidebarItemMenuLink }
