import {
  CollectionButton,
  HistoryButton,
  SearchButton,
  ThemeButton
} from '@/components/common/button'
import { Logo } from '@/components/common/logo'
import { Nav } from '@/components/layout/nav'
import type { AppTheme } from '@/types'

interface Props {
  theme: AppTheme
}

export function Header({ theme }: Props) {
  return (
    <header className="fixed top-0 z-99 box-border flex w-full p-2 select-none">
      <div className="glass flex h-16 w-full items-center justify-center px-2 md:px-8">
        <div className="relative flex h-full w-full items-center justify-between md:max-w-7xl">
          <div className="flex gap-2 sm:hidden">
            <CollectionButton />
          </div>
          <div className="flex flex-row items-center">
            <Logo />
            <Nav />
          </div>
          <div className="flex gap-2">
            <SearchButton />
            <HistoryButton className="absolute top-3 left-12 sm:static" />
            <ThemeButton theme={theme} />
          </div>
        </div>
      </div>
    </header>
  )
}
