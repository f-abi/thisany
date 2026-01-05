import { IconVideoOff } from '@tabler/icons-react'
import { getCategoryListData, VideoType } from 'gying'
import Link from 'next/link'

import { MediaLinkList } from '@/components/common/media'
import { PaginationBar } from '@/components/common/pagination-bar'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'

type SearchParams = Record<string, string>

export default async function CollectionPage({
  params,
  searchParams
}: {
  params: Promise<{ type: string }>
  searchParams: Promise<SearchParams>
}) {
  const { type } = await params

  const urlSearchParams = await searchParams

  const pageIndex = Math.max(1, parseInt(String(urlSearchParams.page || '1'), 10) || 1)

  const pathName = `/collection/${type}`

  const data = await getCategoryListData({
    pageIndex,
    type: type as VideoType,
    ...urlSearchParams,
    options: {
      next: {
        revalidate: 6000
      }
    }
  })

  if (data.items.length > 0) {
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

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant={'icon'}>
          <IconVideoOff />
        </EmptyMedia>
        <EmptyTitle>暂无影片数据</EmptyTitle>
        <EmptyDescription>当前筛选条件下没有可用的影片数据</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant={'outline'} asChild size={'sm'}>
          <Link href={pathName}>清除筛选</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
