import { PropsWithChildren } from 'react'

export function Main({ children }: PropsWithChildren) {
  return <main className="m-auto flex w-full flex-col pt-20 sm:max-w-7xl">{children}</main>
}
