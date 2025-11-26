import { GYING_TYPE, VideoType } from 'gying'
import { notFound } from 'next/navigation'

export default async function CollectionPage({
  params
}: {
  params: { type: VideoType; page: string }
}) {
  const { type, page } = await params
  if (!GYING_TYPE.includes(type) || Number(page) >= 100 || Number(page) < 1) {
    notFound()
  }
  return (
    <div>
      Collection:{type} pageIndex:{page}
    </div>
  )
}
