import './globals.css'

import type { Metadata, Viewport } from 'next'
import { Dosis } from 'next/font/google'

import { Header } from '@/components/layout/header'
import { Toaster } from '@/components/ui/sonner'
import { getSidebarExpand, getTheme } from '@/lib/cookies'

import Providers from './providers'

const dosis = Dosis({
  variable: '--font-dosis',
  subsets: ['latin']
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
}

export const metadata: Metadata = {
  title: {
    template: '%s - ThisAny',
    absolute: 'ThisAny'
  },
  description: '影视'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const theme = await getTheme()
  const sidebarExpand = await getSidebarExpand()
  return (
    <html lang="zh-CN" className={theme}>
      <body
        className={`${dosis.variable} max-w-screen overflow-x-hidden antialiased ${sidebarExpand && 'sidebar-expand'}`}
      >
        <Header theme={theme} />
        <Providers>{children}</Providers>
        <Toaster theme={theme} />
      </body>
    </html>
  )
}
