import { getVideoDetail, GYING_TYPE, VideoType } from 'gying'
import { notFound } from 'next/navigation'

export default async function MediaDetailPage({
  params
}: {
  params: Promise<{ type: VideoType; id: string }>
}) {
  const { id, type } = await params

  if (!GYING_TYPE.includes(type) || !id) notFound()

  const data = await getVideoDetail({
    id,
    type
  })

  return (
    <div>
      <div>{JSON.stringify(data)}</div>
    </div>
  )
}
