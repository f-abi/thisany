import { PropsWithChildren } from 'react'
import { Aside } from './aside'

export function Main({ children }: PropsWithChildren) {
  return (
    <section className="m-auto flex max-w-7xl pt-20">
      <Aside />
      <main className="ml-64 max-w-5xl">{children}</main>
    </section>
  )
}
