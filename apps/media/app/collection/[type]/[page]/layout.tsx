import { VideoType } from 'gying'
import { PropsWithChildren } from 'react'

export default async function CollectionLayout({
  children,
  params
}: PropsWithChildren<{
  params: { type: VideoType; page: string }
}>) {
  const { type, page } = await params
  return (
    <div>
      <div>{type}</div>
      <div>{page}</div>
      <div>{children}</div>
    </div>
  )
}
