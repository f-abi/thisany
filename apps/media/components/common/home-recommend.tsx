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
    <div className="glass mx-2 mb-2 flex flex-col p-2 xl:mx-0 xl:p-4">
      <div className="mb-1 flex flex-row items-center justify-between md:mb-2">
        <div className="text-lg font-black md:text-2xl md:font-bold">{item.title}</div>
        <Button onClick={handleRefresh} disabled={isPending} size="sm">
          {isPending ? <LoaderCircle className="animate-spin" /> : <RefreshCw />}
          换一换
        </Button>
      </div>
      <MediaList data={data} />
    </div>
  )
}
