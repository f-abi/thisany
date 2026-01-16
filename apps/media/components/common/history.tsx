'use client'

import 'dayjs/locale/zh-cn'

import { IconLoader2, IconTrash, IconVideoOff } from '@tabler/icons-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { VideoDetail } from 'gying'
import Link from 'next/link'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
import { MouseEventHandler, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { addHistory, BrowsingHistoryItem, clearHistory, getHistoryList } from '@/lib/history-db'
import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty'
import { MediaImage } from './image'
import { BlurMask } from './mask'

export function BrowsingHistory({
  visible,
  onClick
}: {
  visible: boolean
  onClick?: MouseEventHandler<HTMLDivElement | HTMLAnchorElement>
}) {
  const [history, setHistory] = useState<BrowsingHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  async function loadData(pageIndex: number) {
    try {
      setLoading(true)
      const { list, total } = await getHistoryList(pageIndex)
      if (pageIndex === 1) {
        setHistory(list)
      } else {
        setHistory(prev => [...prev, ...list])
      }
      setTotal(total)
    } catch (error) {
      console.error(error)
      toast.error('加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (visible) {
      setPage(1)
      loadData(1)
    }
  }, [visible])

  const handleClear = async () => {
    await clearHistory()
    setHistory([])
    setTotal(0)
    toast.success('浏览历史已清空')
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadData(nextPage)
  }

  const hasMore = history.length < total

  return (
    <BlurMask visible={visible} onClick={onClick}>
      <div
        className="flex h-full w-full flex-col sm:max-w-4/5 md:max-w-2/3 lg:max-w-1/2"
        onClick={e => e.stopPropagation()}
      >
        <div className="glass mx-2 mt-20 flex items-center justify-between p-2">
          <div className="pl-2 font-bold">浏览历史</div>
          <Button onClick={handleClear} aria-label="清空" variant={'transparent'}>
            清除历史
            <IconTrash size={14} className="size-4" />
          </Button>
        </div>
        <div className="glass scroll-box mx-2 mt-2 flex max-h-[calc(100vh-20rem)] flex-col overflow-y-auto pl-1 text-sm [scrollbar-gutter:stable] md:pl-2">
          {loading && page === 1 && history.length === 0 ? (
            <div className="flex min-h-60 w-full items-center justify-center">
              <IconLoader2 className="animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia>
                  <IconVideoOff className="size-8" />
                </EmptyMedia>
                <EmptyTitle className="text-base">暂无浏览记录</EmptyTitle>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              {history.map(item => (
                <Link
                  href={`/media/${item.dir}/${item.id}`}
                  key={item.id}
                  className="hover:bg-accent-foreground/10 mt-2 flex w-full rounded-lg p-2 transition-colors"
                  onClick={onClick}
                >
                  <div className="w-[30%] md:w-[25%] lg:w-[20%] xl:w-[15%] 2xl:w-[10%]">
                    <MediaImage image={item.image} title={item.title} />
                  </div>
                  <div className="text-muted-foreground flex w-[70%] flex-col justify-between pl-2 md:w-[75%] lg:w-[80%] xl:w-[85%] 2xl:w-[90%]">
                    <div className="flex flex-col">
                      <div className="text-base">
                        <span className="text-primary">{item.title}</span>
                        <span className="pl-2">({item.year})</span>
                      </div>
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {item.leixing?.join(' / ')}
                      </div>
                      {item.name && (
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                          别名：{item.name}
                        </div>
                      )}
                      {item.zhuyan && (
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                          主演：{item.zhuyan.join(' / ')}
                        </div>
                      )}
                    </div>
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                      <div className="text-destructive">{dayjs(item.updateTime).fromNow()}</div>
                    </div>
                  </div>
                </Link>
              ))}

              <div
                className={cn(
                  'hover:bg-accent-foreground/10 my-2 flex min-h-9 w-full items-center justify-center rounded-lg select-none',
                  (hasMore || loading) && 'cursor-pointer'
                )}
                onClick={() => {
                  if (hasMore && !loading) handleLoadMore()
                }}
              >
                {loading && page > 1 ? (
                  <IconLoader2 className="size-4.5 animate-spin" />
                ) : (
                  <span>{hasMore ? '加载更多' : '没有更多了'}</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </BlurMask>
  )
}

export function BrowsingHistoryLogger({ data }: { data: VideoDetail }) {
  useEffect(() => {
    if (data?.id) {
      addHistory(data)
    }
  }, [data])

  return null
}
