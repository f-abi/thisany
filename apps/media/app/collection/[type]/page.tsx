import { getCategoryListData, VideoType } from 'gying'

import { MediaLinkList } from '@/components/common/media'
import { PaginationBar } from '@/components/common/pagination-bar'

type SearchParams = Record<string, string>

export default async function CollectionPage({
  params,
  searchParams
}: {
  params: Promise<{ type: VideoType }>
  searchParams: Promise<SearchParams>
}) {
  const { type } = await params

  const urlSearchParams = await searchParams

  const pageIndex = Math.max(1, parseInt(String(urlSearchParams.page || '1'), 10) || 1)

  const pathName = `/collection/${type}`

  const data = await getCategoryListData({
    pageIndex,
    type,
    ...urlSearchParams,
    options: {
      next: {
        revalidate: 60
      }
    }
  })

  return (
    <>
      <MediaLinkList data={data.items} />
      <PaginationBar
        total={data.pageTotal}
        current={pageIndex}
        pathName={pathName}
        searchParams={urlSearchParams}
      />
    </>
  )
}
