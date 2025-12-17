import { PropsWithChildren } from 'react'

import { cn } from '@/lib/utils'

export function Main({ className, children }: PropsWithChildren<{ className?: string }>) {
  return (
    <main className={cn('m-auto flex w-full flex-col pt-20 md:max-w-7xl', className)}>
      {children}
    </main>
  )
}
