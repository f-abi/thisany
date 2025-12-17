import { getVideoResource, GYING_TYPE, VideoType } from 'gying'
import { notFound } from 'next/navigation'

import { PanList } from '@/components/common/pan'
import { OnlinePlayTabs } from '@/components/common/tabs'
import { Footer } from '@/components/layout/footer'
import { Main } from '@/components/layout/main'

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ type: VideoType; id: string }>
}) {
  const { type, id } = await params

  if (!GYING_TYPE.includes(type) || !id) notFound()

  const resource = await getVideoResource({
    id,
    type,
    options: {
      next: {
        revalidate: 60000
      }
    }
  })

  return (
    <Main>
      {children}
      {resource.playList.length > 0 && <OnlinePlayTabs playList={resource.playList} />}
      {resource.panList.length > 0 && <PanList panList={resource.panList} />}
      <Footer />
    </Main>
  )
}
