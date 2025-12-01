import { Main } from '@/components/layout/main'
import { getVideoDetail, getVideoResource, GYING_TYPE, VideoType } from 'gying'
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

  const resource = await getVideoResource({
    id,
    type
  })

  return (
    <Main>
      <div>{JSON.stringify(data)}</div>
      <div>{JSON.stringify(resource)}</div>
    </Main>
  )
}
