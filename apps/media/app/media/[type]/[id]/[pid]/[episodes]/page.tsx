import { getVideoPlayer, VideoType } from 'gying'

import { MediaPlayer } from '@/components/common/player'

export default async function MediaDetailPage({
  params
}: {
  params: Promise<{
    type: VideoType
    id: string
    pid: string
    episodes: string
  }>
}) {
  const { id, type, pid, episodes } = await params

  const player = await getVideoPlayer({
    id,
    type,
    pid,
    episodes,
    options: {
      next: {
        revalidate: 60000
      }
    }
  })

  return (
    <div className="card mx-2 mb-2 p-2 md:p-4 2xl:mx-0">
      <MediaPlayer {...player} />
    </div>
  )
}
