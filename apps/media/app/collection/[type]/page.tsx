import {
  IconBadgeHdFilled,
  IconCalendarMonthFilled,
  IconCategoryFilled,
  IconLanguageHiragana,
  IconMapPinFilled,
  IconSortAscending2Filled
} from '@tabler/icons-react'
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

import { MediaLinkList } from '@/components/common/media'
import { PaginationBar } from '@/components/common/pagination-bar'
import { Footer } from '@/components/layout/footer'
import { Main } from '@/components/layout/main'
import {
  Sidebar,
  SidebarItem,
  SidebarItemMenu,
  SidebarItemMenuLink
} from '@/components/layout/sidebar'
import { getSidebarExpand } from '@/lib/cookies'

type SearchParams = Record<string, string>

interface CollectionSidebarProps {
  pathName: string
  searchParams: SearchParams
  type: VideoType
  expand: boolean
}

function CollectionSidebar({ pathName, searchParams, type, expand }: CollectionSidebarProps) {
  const genreParams = searchParams.genre?.split('_') ?? []
  const collectionSidebarConfig = [
    {
      Icon: IconCategoryFilled,
      key: 'genre',
      name: '影片类型',
      value: (type === 'ac' ? GYING_FILTER_GENRE_AC : GYING_FILTER_GENRE).map(value => ({
        value,
        key: value
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
      value: GYING_FILTER_REGION.map(value => ({ value, key: value }))
    },
    {
      Icon: IconLanguageHiragana,
      key: 'lang',
      name: '配音语言',
      value: GYING_FILTER_LANG.map(value => ({ value, key: value }))
    },
    {
      Icon: IconBadgeHdFilled,
      key: 'quality',
      name: '视频画质',
      value: GYING_QUALITY_TAG.map(value => ({ value, key: value }))
    },
    {
      Icon: IconSortAscending2Filled,
      key: 'sort',
      name: '排序方式',
      value: GYING_SORT_TAG
    }
  ]
  return (
    <Sidebar expand={expand}>
      {collectionSidebarConfig.map(({ Icon, ..._ }) => (
        <SidebarItem
          key={_.key}
          Icon={Icon}
          name={_.name}
          isActive={_.key === 'genre' ? genreParams.length > 0 : !!searchParams[_.key]}
        >
          <SidebarItemMenu>
            {_.value.map(__ => {
              const isActive =
                _.key === 'genre'
                  ? genreParams.includes(__.value)
                  : searchParams[_.key] === __.value
              const newURLSearchParams = new URLSearchParams(searchParams)
              newURLSearchParams.delete('page')
              if (_.key == 'genre') {
                if (genreParams.length === 0) newURLSearchParams.set('genre', __.value)
                else {
                  if (isActive) {
                    if (genreParams.length === 1) newURLSearchParams.delete('genre')
                    else
                      newURLSearchParams.set(
                        'genre',
                        genreParams.filter(___ => ___ !== __.value).join('_')
                      )
                  } else newURLSearchParams.set('genre', [...genreParams, __.value].join('_'))
                }
              } else {
                if (isActive) newURLSearchParams.delete(_.key)
                else newURLSearchParams.set(_.key, __.value)
              }
              return (
                <SidebarItemMenuLink
                  href={`${pathName}?${newURLSearchParams.toString()}`}
                  isActive={isActive}
                  key={__.key}
                  name={__.key}
                />
              )
            })}
          </SidebarItemMenu>
        </SidebarItem>
      ))}
    </Sidebar>
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

  const sidebarExpand = await getSidebarExpand()

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
    <Main>
      <CollectionSidebar
        pathName={pathName}
        searchParams={urlSearchParams}
        type={type}
        expand={sidebarExpand}
      />
      <section className="sidebar-page flex flex-col transition-all">
        <div className="card mx-2 mb-2 p-2 transition-all sm:ml-0 xl:p-4">
          <MediaLinkList data={data.items} />
          <PaginationBar
            total={data.pageTotal}
            current={pageIndex}
            pathName={pathName}
            searchParams={urlSearchParams}
          />
        </div>
        <Footer />
      </section>
    </Main>
  )
}
