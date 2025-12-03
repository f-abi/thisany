import { Main } from '@/components/layout/main'
import {
  getCategoryListData,
  GYING_FILTER_GENRE,
  GYING_FILTER_GENRE_AC,
  GYING_TYPE,
  VideoType
} from 'gying'
import { notFound } from 'next/navigation'
import { MediaList } from '@/components/common/media-list'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { PaginationBar } from '@/components/common/pagination-bar'

type SearchParams = { [key: string]: string }

function CollectionGenre({ searchParams, type }: { searchParams: SearchParams; type: VideoType }) {
  const genreParams = searchParams.genre?.split('_') ?? []
  console.log(genreParams)
  return (
    <div className="flex items-start justify-between">
      <div className="w-12 py-1">类型：</div>
      <div className="flex flex-1 flex-wrap">
        {(type === 'ac' ? GYING_FILTER_GENRE_AC : GYING_FILTER_GENRE).map(_ => {
          const isActive = genreParams.includes(_)
          const newURLSearchParams = new URLSearchParams(searchParams)
          newURLSearchParams.delete('page')
          if (genreParams.length === 0) {
            newURLSearchParams.set('genre', _)
          } else {
            if (isActive) {
              if (genreParams.length === 1) {
                newURLSearchParams.delete('genre')
              } else {
                newURLSearchParams.set('genre', genreParams.filter(__ => __ !== _).join('_'))
              }
            } else {
              newURLSearchParams.set('genre', [...genreParams, _].join('_'))
            }
          }

          return (
            <Link
              href={`/collection/${type}?${newURLSearchParams.toString()}`}
              className={cn(
                'p-1',
                isActive ? 'text-destructive font-black' : 'hover:text-destructive'
              )}
              key={_}
            >
              {_}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default async function CollectionPage({
  params,
  searchParams
}: {
  params: Promise<{ type: VideoType }>
  searchParams: Promise<SearchParams>
}) {
  const { type } = await params
  const urlSearchParams = await searchParams
  const { page } = urlSearchParams
  const pageNumber = Number(page)
  const pageIndex = Number.isInteger(pageNumber) ? pageNumber : 1

  if (!GYING_TYPE.includes(type)) notFound()

  const data = await getCategoryListData({
    pageIndex,
    type,
    ...urlSearchParams,
    options: {
      next: {
        revalidate: 60,
        tags: [type, ...Object.values(urlSearchParams)]
      }
    }
  })

  console.log(urlSearchParams)
  console.log([type, ...Object.values(urlSearchParams)])

  return (
    <Main>
      <div className="glass mb-2 flex flex-col p-4">
        <CollectionGenre searchParams={urlSearchParams} type={type} />
      </div>
      <div className="glass mb-2 flex flex-col p-4">
        <MediaList data={data.items} />
        <div className="mt-4">
          <PaginationBar
            total={data.pageTotal}
            current={pageIndex}
            baseUrl={`/collection/${type}`}
            searchParams={urlSearchParams}
          />
        </div>
      </div>
    </Main>
  )
}
