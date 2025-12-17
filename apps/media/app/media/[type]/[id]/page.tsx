import { getVideoDetail, getVideoResource, GYING_TYPE, VideoType } from 'gying'
import { notFound } from 'next/navigation'

import { MediaDetail } from '@/components/common/media'
import { PanList } from '@/components/common/pan'
import { MediaStatus } from '@/components/common/status'
import { OnlinePlayTabs, SeasonTabs } from '@/components/common/tabs'
import { Main } from '@/components/layout/main'

export default async function MediaDetailPage({
  params
}: {
  params: Promise<{ type: VideoType; id: string }>
}) {
  const { id, type } = await params

  if (!GYING_TYPE.includes(type) || !id) notFound()

  const data = await getVideoDetail({
    id,
    type,
    options: {
      next: {
        revalidate: 60000
      }
    }
  })

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
      <MediaDetail data={data} />

      {data.xle?.t && <SeasonTabs xle={data.xle} type={type} />}

      {data.status && <MediaStatus html={data.status} />}

      {resource.playList.length > 0 && <OnlinePlayTabs playList={resource.playList} />}

      {resource.panList.length > 0 && <PanList panList={resource.panList} />}
    </Main>
  )
}
