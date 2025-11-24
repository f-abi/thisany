import type { AppTheme } from '@/types'
import { ThemeButton } from './themeButton'
import { Logo } from './logo'

interface Props {
  theme: AppTheme
}

export function Header({ theme }: Props) {
  return (
    <div className="sticky top-0 flex h-14">
      <div className="absolute z-[-1] h-full w-full border-b border-white/30 bg-white/20 backdrop-blur-lg" />
      <div className="flex w-full items-center justify-between px-32">
        <div>
          <Logo />
        </div>
        <div>
          <ThemeButton theme={theme} />
        </div>
      </div>
    </div>
  )
}
