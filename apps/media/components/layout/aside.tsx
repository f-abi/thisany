import { PropsWithChildren } from 'react'

export function Aside({ children }: PropsWithChildren) {
  return (
    <aside className="fixed top-20 bottom-2 w-56 rounded-(--radius) border p-4 backdrop-blur-md backdrop-saturate-200">
      {children}
    </aside>
  )
}
