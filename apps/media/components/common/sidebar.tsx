'use client'

import {
  IconBadgeHdFilled,
  IconCalendarMonthFilled,
  IconCategoryFilled,
  IconLanguageHiragana,
  IconMapPinFilled,
  IconSortAscending2Filled
} from '@tabler/icons-react'
import {
  GYING_FILTER_GENRE,
  GYING_FILTER_GENRE_AC,
  GYING_FILTER_LANG,
  GYING_FILTER_REGION,
  GYING_FILTER_YEAR,
  GYING_QUALITY_TAG,
  GYING_SORT_TAG,
  VideoType
} from 'gying'
import { useSearchParams } from 'next/navigation'

import {
  Sidebar,
  SidebarItem,
  SidebarItemMenu,
  SidebarItemMenuLink
} from '@/components/layout/sidebar'

interface CollectionSidebarProps {
  pathName: string
  type: VideoType
  expand: boolean
}

function CollectionSidebar({ pathName, type, expand }: CollectionSidebarProps) {
  const searchParams = useSearchParams()
  const genreParams = searchParams.get('genre')?.split('_') ?? []
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
          isActive={_.key === 'genre' ? genreParams.length > 0 : !!searchParams.get(`${_.key}`)}
        >
          <SidebarItemMenu>
            {_.value.map(__ => {
              const isActive =
                _.key === 'genre'
                  ? genreParams.includes(__.value)
                  : searchParams.get(`${_.key}`) === __.value
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

export { CollectionSidebar }
