import { Main } from '@/components/layout/main'
import { getCategoryListData, GYING_TYPE, VideoType } from 'gying'
import { notFound } from 'next/navigation'
import { MediaList } from '@/components/common/media-list'
import { PaginationBar } from '@/components/common/pagination-bar'

export default async function CollectionPage({
  params,
  searchParams
}: {
  params: Promise<{ type: VideoType }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { type } = await params
  const { page } = await searchParams
  const pageNumber = Number(page)
  const pageIndex = Number.isInteger(pageNumber) ? pageNumber : 1

  if (!GYING_TYPE.includes(type)) notFound()

  if (pageIndex < 1) throw new Error('页面错误')

  const data = await getCategoryListData({
    pageIndex,
    type
  })

  if (pageIndex > data.pageTotal) throw new Error('页面错误')

  return (
    <Main>
      <div className="glass mb-2 flex flex-col p-4">
        <MediaList data={data.items} />
        <div className="mt-4">
          <PaginationBar
            total={data.pageTotal}
            current={pageIndex}
            baseUrl={`/collection/${type}`}
            searchParams={await searchParams}
          />
        </div>
      </div>
    </Main>
  )
}
