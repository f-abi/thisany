import { PropsWithChildren } from 'react'

export function Main({ children }: PropsWithChildren) {
  return <main className="m-auto flex max-w-full pt-20 sm:max-w-7xl">{children}</main>
}
