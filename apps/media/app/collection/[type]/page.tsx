import Link from 'next/link'
import { Main } from '@/components/layout/main'
import {
  getCategoryListData,
  GYING_FILTER_GENRE,
  GYING_FILTER_GENRE_AC,
  GYING_FILTER_LANG,
  GYING_FILTER_REGION,
  GYING_FILTER_YEAR,
  GYING_QUALITY_TAG,
  GYING_SORT_TAG,
  GYING_TYPE,
  VideoType
} from 'gying'
import { notFound } from 'next/navigation'
import { MediaList } from '@/components/common/media-list'
import { cn } from '@/lib/utils'
import { PaginationBar } from '@/components/common/pagination-bar'
import { Url } from 'next/dist/shared/lib/router/router'
import {
  IconBadgeHdFilled,
  IconCalendarMonthFilled,
  IconCategoryFilled,
  IconLanguageHiragana,
  IconLayoutSidebarLeftExpandFilled,
  IconMapPinFilled,
  IconSortAscending2Filled
} from '@tabler/icons-react'

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
      className={cn(
        'hover:bg-accent-foreground/10 hover:text-destructive m-1 rounded-lg px-2 py-1',
        isActive && 'bg-accent-foreground/10 text-destructive'
      )}
    >
      {text}
    </Link>
  )
}

function Filter({ pathName, searchParams, type }: FilterProps) {
  const genreParams = searchParams.genre?.split('_') ?? []
  const filterLinkList = [
    {
      Icon: IconCategoryFilled,
      key: 'genre',
      name: '影片类型',
      value: (type === 'ac' ? GYING_FILTER_GENRE_AC : GYING_FILTER_GENRE).map(_ => ({
        key: _,
        value: _
      }))
    },
    {
      Icon: IconCalendarMonthFilled,
      key: 'year',
      name: '上映年份',
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
      Icon: IconMapPinFilled,
      key: 'region',
      name: '制作地区',
      value: GYING_FILTER_REGION.map(_ => ({
        key: _,
        value: _
      }))
    },
    {
      Icon: IconLanguageHiragana,
      key: 'lang',
      name: '配音语言',
      value: GYING_FILTER_LANG.map(_ => ({
        key: _,
        value: _
      }))
    },
    {
      Icon: IconBadgeHdFilled,
      key: 'quality',
      name: '视频画质',
      value: GYING_QUALITY_TAG.map(_ => ({
        key: _,
        value: _
      }))
    },
    {
      Icon: IconSortAscending2Filled,
      key: 'sort',
      name: '排序方式',
      value: GYING_SORT_TAG
    }
  ]
  return (
    <div className="group fixed top-20 bottom-2 z-10 ml-2 flex w-14 flex-col justify-between py-2 transition-all select-none hover:w-34 [@media(hover:none)]:focus-within:w-34">
      <div className="glass absolute inset-0 -z-10" />
      <div className="flex flex-col gap-2">
        {filterLinkList.map(({ Icon, ..._ }) => {
          const isParentActive = _.key === 'genre' ? genreParams.length > 0 : !!searchParams[_.key]
          return (
            <div
              key={_.key}
              tabIndex={0}
              className="group/item relative h-10 cursor-pointer p-2 outline-none"
            >
              <div
                className={cn(
                  'group-hover/item:bg-accent-foreground/10 group-hover/item:text-destructive [@media(hover:none)]:group-focus-within/item:bg-accent-foreground/10 flex flex-row items-center rounded-lg p-2',
                  isParentActive && 'bg-accent-foreground/10 text-destructive'
                )}
              >
                <Icon className="size-6 shrink-0" />
                <div className="ml-2 font-bold whitespace-nowrap opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 [@media(hover:none)]:group-focus-within:pointer-events-auto [@media(hover:none)]:group-focus-within:opacity-100">
                  {_.name}
                </div>
              </div>
              <div className="absolute top-0 left-full z-10 hidden pl-2 group-hover/item:flex [@media(hover:none)]:group-focus-within/item:flex">
                <div className="glass flex w-max max-w-6xl flex-row flex-wrap p-2">
                  {_.value.map(__ => {
                    const isActive =
                      _.key === 'genre'
                        ? genreParams.includes(__.value)
                        : searchParams[_.key] === __.value
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
            </div>
          )
        })}
      </div>
      <div className="flex w-full flex-col px-2">
        <div className="bg-accent-foreground/10 my-2 h-px w-full" />
        <div
          className={cn(
            'hover:bg-accent-foreground/10 hover:text-destructive flex cursor-pointer flex-row items-center rounded-lg p-2'
          )}
        >
          <IconLayoutSidebarLeftExpandFilled className="size-6 shrink-0" />
          <div className="ml-2 font-bold whitespace-nowrap opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 [@media(hover:none)]:group-focus-within:pointer-events-auto [@media(hover:none)]:group-focus-within:opacity-100">
            {'展开'}
          </div>
        </div>
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

  console.log([type, ...Object.values(urlSearchParams)])

  return (
    <Main>
      <Filter pathName={pathName} searchParams={urlSearchParams} type={type} />
      <div className="glass mb-2 ml-18 flex flex-col p-2 xl:p-4">
        <MediaList data={data.items} />
        <PaginationBar
          total={data.pageTotal}
          current={pageIndex}
          pathName={pathName}
          searchParams={urlSearchParams}
        />
      </div>
    </Main>
  )
}
