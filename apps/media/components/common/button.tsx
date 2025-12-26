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

  const [visible, setVisible] = useState(false)
  const [data, setData] = useState<Array<VideoSearch>>([])
  const [pageIndex, setPageIndex] = useState(1)
  const [keyword, setKeyword] = useState<string>('')
  const [error, setError] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()

  const listData = useMemo(() => data.flatMap(_ => _.items), [data])

  const hasMore = useMemo(
    () => (data.length > 1 ? data[data.length - 1].pageTotal > pageIndex : false),
    [data, pageIndex]
  )

  const handleSearch = () => {
    if (keyword.trim().length === 0) {
      handleReset()
      return
    } else
      startTransition(async () => {
        try {
          setError(false)
          const result = await searchVideo({
            pageIndex,
            keyword,
            options: {
              next: {
                revalidate: 60000
              }
            }
          })
          setData([...data, result])
        } catch {
          toast.error('加载失败请重试')
          setError(true)
          setPageIndex(pageIndex === 1 ? pageIndex : pageIndex - 1)
        }
      })
  }

  const handleLoadMore = () => {
    setPageIndex(pageIndex + 1)
    handleSearch()
  }

  const handleReset = () => {
    setPageIndex(1)
    setData([])
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value)
    handleReset()
    handleSearch()
  }

  useEffect(() => {
    if (visible) inputRef.current?.focus()
  }, [visible])

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
                {isPending && <IconLoader2 className="animate-spin" />}
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="glass scroll-box mx-2 mt-2 flex max-h-[calc(100vh-20rem)] flex-col overflow-y-auto">
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
            {isPending && (
              <div className="p-4">
                <IconLoader2 className="animate-spin" />
              </div>
            )}
            {!isPending && hasMore && <Button onClick={handleLoadMore}>加载更多</Button>}
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
