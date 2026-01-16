import { getVideoDetail, VideoType } from 'gying'

import { BrowsingHistoryLogger } from '@/components/common/history'
import { MediaDetail } from '@/components/common/media'
import { MediaStatus } from '@/components/common/status'
import { SeasonTabs } from '@/components/common/tabs'

export default async function MediaDetailPage({
  params
}: {
  params: Promise<{ type: string; id: string }>
}) {
  const { id, type } = await params

  const data = await getVideoDetail({
    id,
    type: type as VideoType,
    options: {
      next: {
        revalidate: 60000
      }
    }
  })

  return (
    <>
      <MediaDetail data={data} />

      <BrowsingHistoryLogger data={data} />

      {data.xle?.t && <SeasonTabs xle={data.xle} type={type as VideoType} />}

      {data.status && <MediaStatus html={data.status} />}
    </>
  )
}
