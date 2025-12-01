import type { AppTheme } from '@/types'
import { ThemeButton } from '@/components/common/theme-button'
import { Logo } from '@/components/common/logo'
import { SearchButton } from '@/components/common/search-button'
import { Nav } from '@/components/layout/nav'

interface Props {
  theme: AppTheme
}

export function Header({ theme }: Props) {
  return (
    <header className="fixed top-0 z-99 box-border flex w-full p-2 select-none">
      <div className="glass flex h-16 w-full items-center justify-center px-8">
        <div className="flex h-full w-full items-center justify-between sm:max-w-7xl">
          <div className="flex flex-row items-center">
            <Logo />
            <Nav />
          </div>
          <div className="flex gap-2">
            <SearchButton />
            <ThemeButton theme={theme} />
          </div>
        </div>
      </div>
    </header>
  )
}
