import { getVideoPlayer, VideoType } from 'gying'

export default async function MediaDetailPage({
  params
}: {
  params: Promise<{ type: VideoType; id: string; pid: string; episodes: string }>
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
    <>
      <div>{player.url}</div>
    </>
  )
}
