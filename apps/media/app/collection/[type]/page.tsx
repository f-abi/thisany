import Link from 'next/link'
import { Main } from '@/components/layout/main'
import {
  getCategoryListData,
  GYING_FILTER_GENRE,
  GYING_FILTER_GENRE_AC,
  GYING_FILTER_LANG,
  GYING_FILTER_REGION,
  GYING_FILTER_YEAR,
  GYING_TYPE,
  VideoType
} from 'gying'
import { notFound } from 'next/navigation'
import { MediaList } from '@/components/common/media-list'
import { cn } from '@/lib/utils'
import { PaginationBar } from '@/components/common/pagination-bar'
import { Url } from 'next/dist/shared/lib/router/router'

type SearchParams = Record<string, string>

interface FilterLinkProps {
  isActive: boolean
  href: Url
  text: string
}

interface FilterProps {
  pathName: string
  searchParams: SearchParams
  type: VideoType
}

function FilterLink({ isActive, href, text }: FilterLinkProps) {
  return (
    <Link
      href={href}
      className={cn('m-1 px-2 py-1', isActive ? 'bg-accent-foreground/10 rounded-(--radius)' : '')}
    >
      {text}
    </Link>
  )
}

function Filter({ pathName, searchParams, type }: FilterProps) {
  const genreParams = searchParams.genre?.split('_') ?? []
  const filterLinkList = [
    {
      key: 'genre',
      name: '类型',
      value: (type === 'ac' ? GYING_FILTER_GENRE_AC : GYING_FILTER_GENRE).map(_ => ({
        key: _,
        value: _
      }))
    },
    {
      key: 'year',
      name: '年份',
      value: [
        ...Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(_ => ({
          key: _.toString(),
          value: _.toString()
        })),
        ...GYING_FILTER_YEAR.map(_ => ({
          key: _.key,
          value: _.value.toString()
        }))
      ]
    },
    {
      key: 'region',
      name: '地区',
      value: GYING_FILTER_REGION.map(_ => ({
        key: _,
        value: _
      }))
    },
    {
      key: 'lang',
      name: '语言',
      value: GYING_FILTER_LANG.map(_ => ({
        key: _,
        value: _
      }))
    }
  ]
  return filterLinkList.map(_ => (
    <div key={_.key} className="flex items-start justify-between">
      <div className="w-12 py-2">{_.name}：</div>
      <div className="flex flex-1 flex-wrap">
        {_.value.map(__ => {
          const isActive =
            _.key === 'genre' ? genreParams.includes(__.value) : searchParams[_.key] === __.value
          const newURLSearchParams = new URLSearchParams(searchParams)
          newURLSearchParams.delete('page')
          if (_.key == 'genre') {
            if (genreParams.length === 0) {
              newURLSearchParams.set('genre', __.value)
            } else {
              if (isActive) {
                if (genreParams.length === 1) {
                  newURLSearchParams.delete('genre')
                } else {
                  newURLSearchParams.set(
                    'genre',
                    genreParams.filter(___ => ___ !== __.value).join('_')
                  )
                }
              } else {
                newURLSearchParams.set('genre', [...genreParams, __.value].join('_'))
              }
            }
          } else {
            if (isActive) {
              newURLSearchParams.delete(_.key)
            } else {
              newURLSearchParams.set(_.key, __.value)
            }
          }
          return (
            <FilterLink
              href={`${pathName}?${newURLSearchParams.toString()}`}
              isActive={isActive}
              key={__.key}
              text={__.key}
            />
          )
        })}
      </div>
    </div>
  ))
}

export default async function CollectionPage({
  params,
  searchParams
}: {
  params: Promise<{ type: VideoType }>
  searchParams: Promise<SearchParams>
}) {
  const { type } = await params

  if (!GYING_TYPE.includes(type)) notFound()

  const urlSearchParams = await searchParams

  const pageIndex = Math.max(1, parseInt(String(urlSearchParams.page || '1'), 10) || 1)

  const pathName = `/collection/${type}`

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

  return (
    <Main>
      <div className="glass mx-2 mb-2 flex flex-col p-2 xl:mx-0 xl:p-4">
        <Filter pathName={pathName} searchParams={urlSearchParams} type={type} />
      </div>
      <div className="glass mx-2 mb-2 flex flex-col p-2 xl:mx-0 xl:p-4">
        <MediaList data={data.items} />
        <div className="mt-4">
          <PaginationBar
            total={data.pageTotal}
            current={pageIndex}
            pathName={pathName}
            searchParams={urlSearchParams}
          />
        </div>
      </div>
    </Main>
  )
}
