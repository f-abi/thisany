import { GYING_TYPE, VideoType } from 'gying'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CollectionSidebar } from '@/components/common/sidebar'
import { Footer } from '@/components/layout/footer'
import { Main } from '@/components/layout/main'
import { APP_NAV_CONFIG } from '@/constants'
import { getSidebarExpand } from '@/lib/cookies'

interface Props {
  params: { type: VideoType }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params
  return {
    title: APP_NAV_CONFIG.findLast(_ => _.type === type)?.name ?? '分类'
  }
}

export default async function Layout({
  children,
  params
}: Props & {
  children: React.ReactNode
}) {
  const { type } = await params

  const sidebarExpand = await getSidebarExpand()

  if (!GYING_TYPE.includes(type)) notFound()

  const pathName = `/collection/${type}`

  return (
    <Main>
      <CollectionSidebar pathName={pathName} type={type} expand={sidebarExpand} />
      <section className="sidebar-page flex flex-col transition-all">
        <div className="card mx-2 mb-2 p-2 transition-all sm:ml-0 xl:p-4">{children}</div>
        <Footer />
      </section>
    </Main>
  )
}
