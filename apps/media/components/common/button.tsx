'use client'

import {
  IconBackground,
  IconBrightness,
  IconBrightnessFilled,
  IconCategory,
  IconCategoryFilled,
  IconClock,
  IconClockFilled,
  IconLayoutSidebarLeftCollapseFilled,
  IconLayoutSidebarLeftExpandFilled,
  IconLoader2,
  IconSearch
} from '@tabler/icons-react'
import { searchVideo, VideoSearch, VideoSearchData, VideoType } from 'gying'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChangeEvent, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { APP_NAV_CONFIG, COOKIE_NAME } from '@/constants'
import { cn } from '@/lib/utils'
import { AppTheme } from '@/types'

import { SidebarItem } from '../layout/sidebar'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { BlurMask } from './mask'

function handleBlur() {
  const active = document.activeElement as HTMLElement
  if (active && active.tagName !== 'INPUT' && typeof active.blur === 'function') {
    active.blur()
  }
}

function HistoryButton() {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <Button aria-label="历史" size="icon-lg" onClick={() => setVisible(!visible)}>
        {visible ? <IconClock /> : <IconClockFilled />}
      </Button>
      <BlurMask visible={visible}>
        <div>历史</div>
      </BlurMask>
    </>
  )
}

function CollectionButton() {
  const [visible, setVisible] = useState(false)
  const { type } = useParams<{ type: VideoType }>()

  return (
    <>
      <Button aria-label="分类" size="icon-lg" onClick={() => setVisible(!visible)}>
        {visible ? <IconCategory /> : <IconCategoryFilled />}
      </Button>
      <BlurMask visible={visible}>
        <div className="h-full w-full">
          <div className="glass mx-2 mt-20 flex flex-col p-2">
            {APP_NAV_CONFIG.map(item => (
              <Link
                key={item.type}
                href={`/collection/${item.type}`}
                className={cn(
                  'hover:bg-accent-foreground/10 m-1 rounded-lg px-2 py-1',
                  type === item.type && 'bg-accent-foreground/10 text-destructive'
                )}
                onClick={() => setVisible(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </BlurMask>
    </>
  )
}

function SettingButton() {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <Button aria-label="设置" size="icon-lg" onClick={() => setVisible(!visible)}>
        <IconBackground />
      </Button>
      <BlurMask visible={visible}>
        <div className="">123456</div>
      </BlurMask>
    </>
  )
}

function SearchButton() {
  const inputRef = useRef<HTMLInputElement>(null)
  const latestKeyword = useRef<string>('')
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const [visible, setVisible] = useState(false)
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
              revalidate: 60000
            }
          }
        })
        if (query !== latestKeyword.current) return
        if (page === 1) {
          setData([result])
        } else {
          setData(prev => [...prev, result])
        }
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
    <>
      <Button aria-label="搜索" size="icon-lg" onClick={() => setVisible(!visible)}>
        <IconSearch />
      </Button>
      <BlurMask visible={visible}>
        <div className="flex h-full w-full flex-col sm:max-w-4/5 md:max-w-2/3 lg:max-w-1/2">
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
          <div className="glass scroll-box mx-2 mt-2 flex max-h-[calc(100vh-20rem)] flex-col overflow-y-auto text-sm">
            {listData.map(item => (
              <Link
                key={item.id}
                href={`/media/${item.type}/${item.id}`}
                onClick={() => setVisible(false)}
                className="hover:bg-accent-foreground/10 m-1 rounded-lg p-2"
              >
                {item.title}
              </Link>
            ))}
            {(isPending || debouncing) && (
              <Button variant="ghost" className="m-2">
                <IconLoader2 className="size-4.5 animate-spin" />
              </Button>
            )}
            {!isPending && !debouncing && listData.length === 0 && keyword.trim().length > 0 && (
              <div className="text-muted-foreground flex flex-col items-center justify-center py-10">
                <IconSearch className="size-8 opacity-50" />
                <p className="mt-2 text-sm">未找到相关结果</p>
              </div>
            )}
            {!isPending && !debouncing && hasMore && (
              <Button
                variant="ghost"
                className="text-muted-foreground m-2 text-sm"
                onClick={handleLoadMore}
              >
                加载更多
              </Button>
            )}
          </div>
        </div>
      </BlurMask>
    </>
  )
}

function ThemeButton({ theme: init }: { theme: AppTheme }) {
  const [theme, setTheme] = useState(init)

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    const html = document.documentElement
    if (html) {
      html.classList.remove(theme)
      html.classList.add(nextTheme)
      document.cookie = `${COOKIE_NAME.THEME}=${nextTheme}; path=/; max-age=31536000`
      setTheme(nextTheme)
    }
  }

  return (
    <Button aria-label="切换主题" onClick={toggleTheme} size="icon-lg">
      {theme === 'dark' ? <IconBrightness /> : <IconBrightnessFilled />}
    </Button>
  )
}

function SidebarBottomButton({ expand: init }: { expand: boolean }) {
  const [expand, setExpand] = useState(init)

  const toggleExpand = () => {
    const body = document.body
    if (body) {
      if (expand) body.classList.remove('sidebar-expand')
      else body.classList.add('sidebar-expand')
      document.cookie = `${COOKIE_NAME.SIDEBAR}=${expand ? '0' : '1'}; path=/; max-age=31536000`
      setExpand(!expand)
    }
  }

  useEffect(() => {
    window.addEventListener('touchmove', handleBlur, { passive: true })
    window.addEventListener('scroll', handleBlur, { passive: true })
    return () => {
      window.removeEventListener('touchmove', handleBlur)
      window.removeEventListener('scroll', handleBlur)
    }
  }, [])

  return (
    <div
      onClick={() => {
        toggleExpand()
        handleBlur()
      }}
    >
      <SidebarItem
        name={expand ? '收起' : '固定'}
        Icon={expand ? IconLayoutSidebarLeftCollapseFilled : IconLayoutSidebarLeftExpandFilled}
      />
    </div>
  )
}

export {
  CollectionButton,
  HistoryButton,
  SearchButton,
  SettingButton,
  SidebarBottomButton,
  ThemeButton
}
