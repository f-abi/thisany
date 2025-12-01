'use client'

import { HomeRecommend as HomeRecommendType, getHomeRecommendData } from 'gying'
import { useState, useTransition } from 'react'
import { Button } from '../ui/button'
import { MediaList } from './media-list'
import { LoaderCircle, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export function HomeRecommend({ item }: { item: HomeRecommendType }) {
  const [data, setData] = useState(item.data)
  const [pageIndex, setPageIndex] = useState(item.pageNo)
  const [isPending, startTransition] = useTransition()

  const handleRefresh = () => {
    startTransition(async () => {
      try {
        const nextPageIndex = pageIndex + 1 > item.pageMax ? 1 : pageIndex + 1
        const newData = await getHomeRecommendData({
          pageIndex: nextPageIndex,
          type: item.type
        })
        setData(newData)
        setPageIndex(nextPageIndex)
      } catch {
        toast.error('换一换失败，请重试！')
      }
    })
  }

  return (
    <div className="glass mb-2 flex flex-col p-4">
      <div className="mb-2 flex flex-row items-center justify-between">
        <div className="text-2xl font-bold">{item.title}</div>
        <Button
          variant={'outline'}
          onClick={handleRefresh}
          disabled={isPending}
          size="sm"
          className="gap-2"
        >
          {isPending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          换一换
        </Button>
      </div>
      <MediaList data={data} />
    </div>
  )
}
