import { PropsWithChildren } from 'react'

export function Main({ children }: PropsWithChildren) {
  return <main className="m-auto max-w-5xl pt-20">{children}</main>
}
