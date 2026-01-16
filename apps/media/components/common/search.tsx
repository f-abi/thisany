'use client'

import { IconLoader2, IconSearch, IconVideoOff } from '@tabler/icons-react'
import { searchVideo, VideoSearch } from 'gying'
import Link from 'next/link'
import {
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition
} from 'react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { MediaImage } from './image'
import { BlurMask } from './mask'

export function SearchDialog({
  visible,
  onClick
}: {
  visible: boolean
  onClick?: MouseEventHandler<HTMLDivElement | HTMLAnchorElement>
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const latestKeyword = useRef<string>('')
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const [data, setData] = useState<Array<VideoSearch>>([])
  const [keyword, setKeyword] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const [debouncing, setDebouncing] = useState(false)

  const listData = useMemo(() => data.flatMap(_ => _.items), [data])

  const hasMore = useMemo(
    () => (data.length > 0 ? data[data.length - 1].pageTotal > data.length : false),
    [data]
  )

  const handleSearch = (page: number, query: string) => {
    if (query.trim().length === 0) {
      setData([])
      return
    }
    startTransition(async () => {
      try {
        const result = await searchVideo({
          pageIndex: page,
          keyword: query,
          options: {
            next: {
              revalidate: 6000
            }
          }
        })
        if (query !== latestKeyword.current) return
        if (page === 1) setData([result])
        else setData(prev => [...prev, result])
      } catch {
        toast.error('加载失败请重试')
      }
    })
  }

  const handleLoadMore = () => {
    handleSearch(data.length + 1, keyword)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value
    setKeyword(val)
    latestKeyword.current = val

    setData([])
    setDebouncing(true)

    if (timerRef.current) clearTimeout(timerRef.current)

    if (val.trim().length === 0) {
      setDebouncing(false)
      return
    }

    timerRef.current = setTimeout(() => {
      setDebouncing(false)
      handleSearch(1, val)
    }, 500)
  }

  useEffect(() => {
    if (visible) inputRef.current?.focus()
  }, [visible])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <BlurMask visible={visible} onClick={onClick}>
      <div
        className="flex h-full w-full flex-col sm:max-w-4/5 md:max-w-2/3 lg:max-w-1/2"
        onClick={e => e.stopPropagation()}
      >
        <div className="glass mx-2 mt-20 flex flex-col p-2">
          <InputGroup>
            <InputGroupInput
              ref={inputRef}
              type="search"
              placeholder="输入搜索内容"
              className="text-sm"
              value={keyword}
              onChange={handleChange}
            />
            <InputGroupAddon>
              <IconSearch />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              {(isPending || debouncing) && <IconLoader2 className="animate-spin" />}
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="glass scroll-box mx-2 mt-2 flex max-h-[calc(100vh-20rem)] flex-col overflow-y-auto pl-1 text-sm [scrollbar-gutter:stable] md:pl-2">
          {listData.map(item => (
            <Link
              key={item.id}
              href={`/media/${item.type}/${item.id}`}
              onClick={onClick}
              className="hover:bg-accent-foreground/10 mt-2 flex w-full rounded-lg p-2"
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
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap">{item.info}</div>
                  {item.ename && (
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                      别名：{item.ename}
                    </div>
                  )}
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                    主演：{item.zhuyan}
                  </div>
                </div>
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                  <div className="flex gap-2">
                    {item.db > 0 && <span className="text-chart-2">豆瓣 {item.db.toFixed(1)}</span>}
                    {item.im > 0 && (
                      <span className="text-chart-4 dark:text-chart-3">
                        IMDb {item.im.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {!isPending &&
            !debouncing &&
            keyword.trim().length > 0 &&
            (listData.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia>
                    <IconVideoOff className="size-8" />
                  </EmptyMedia>
                  <EmptyTitle>暂无影片数据</EmptyTitle>
                  <EmptyDescription>未找到与 {keyword} 相关的影片</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div
                className={cn(
                  'hover:bg-accent-foreground/10 my-2 flex min-h-9 w-full items-center justify-center rounded-lg select-none',
                  hasMore && 'cursor-pointer'
                )}
                onClick={() => {
                  if (hasMore) handleLoadMore()
                }}
              >
                <span>{hasMore ? '加载更多' : '没有更多了'}</span>
              </div>
            ))}
          {(isPending || debouncing) && (
            <div className="my-2 flex min-h-9 w-full items-center justify-center rounded-lg">
              <IconLoader2 className="size-4.5 animate-spin" />
            </div>
          )}
        </div>
      </div>
    </BlurMask>
  )
}
