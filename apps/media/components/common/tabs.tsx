'use client'

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { Play, VideoType, VideoXle } from 'gying'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/animate-ui/components/radix/tabs'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function AppTabsList({ children }: PropsWithChildren) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeft(scrollLeft > 0)
      setShowRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScroll()
    const container = scrollRef.current

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault()
        container!.scrollLeft += e.deltaY
      }
    }

    if (container) {
      container.addEventListener('scroll', checkScroll)
      container.addEventListener('wheel', handleWheel, { passive: false })
    }
    window.addEventListener('resize', checkScroll)

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll)
        container.removeEventListener('wheel', handleWheel)
      }
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const activeTab = container.querySelector('[data-state="active"]') as HTMLElement
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'center' })
    }
    checkScroll()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current
      const scrollAmount = container.clientWidth / 2

      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="relative h-10 w-full">
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto scroll-smooth rounded-lg transition-all [&::-webkit-scrollbar]:hidden"
      >
        <div
          className={cn(
            'absolute top-0 bottom-0 left-0 z-10 flex items-center bg-linear-to-r from-(--app-card-background) to-transparent transition-opacity',
            showLeft ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
        >
          <Button
            variant="outline"
            size="icon-lg"
            className="rounded-full"
            onClick={() => scroll('left')}
          >
            <IconChevronLeft />
          </Button>
        </div>
        <TabsList className="h-10">{children}</TabsList>
        <div
          className={cn(
            'absolute top-0 right-0 bottom-0 z-10 flex items-center bg-linear-to-l from-(--app-card-background) to-transparent transition-opacity',
            showRight ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
        >
          <Button
            variant="outline"
            size="icon-lg"
            className="rounded-full"
            onClick={() => scroll('right')}
          >
            <IconChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

function SeasonTabs({ xle, type }: { xle: VideoXle; type: VideoType }) {
  const value = useMemo(() => xle.s.findIndex(_ => _ === '1').toString(), [xle])
  return (
    <div className="card mx-2 mb-2 p-2 md:p-4 2xl:mx-0">
      <Tabs value={value} activationMode={'manual'}>
        <AppTabsList>
          {xle.t.map((item, index) => (
            <TabsTrigger key={index} value={index.toString()} asChild>
              <Link href={`/media/${type}/${xle.u[index]}`} className="p-2 px-4">
                {item}
              </Link>
            </TabsTrigger>
          ))}
        </AppTabsList>
      </Tabs>
    </div>
  )
}

function OnlinePlayTabs({ playList }: { playList: Array<Play> }) {
  const { type, id, pid, episodes } = useParams<{
    type: VideoType
    id: string
    pid?: string
    episodes?: string
  }>()
  const [value, setValue] = useState(pid ?? playList[0].i)

  return (
    <div className="card mx-2 mb-2 p-2 md:p-4 2xl:mx-0">
      <Tabs value={value} onValueChange={setValue}>
        <AppTabsList>
          {playList.map(item => (
            <TabsTrigger key={item.i} value={item.i}>
              {item.t}
            </TabsTrigger>
          ))}
        </AppTabsList>
        {playList.map(item => (
          <TabsContent
            key={item.i}
            value={item.i}
            className="grid grid-cols-4 gap-2 xl:grid-cols-6"
          >
            {item.list.map((itemName, itemIndex) => {
              const active = item.i === pid && itemIndex + 1 === Number(episodes)
              return (
                <Link
                  href={`/media/${type}/${id}/${item.i}/${itemIndex + 1}`}
                  key={itemIndex}
                  className={cn(
                    'group bg-muted relative flex h-8 w-full items-center justify-center rounded-lg p-2'
                  )}
                >
                  <div
                    className={cn(
                      'group-hover:text-primary z-1 overflow-hidden text-center text-sm text-ellipsis whitespace-nowrap transition-all',
                      active ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {itemName}
                  </div>
                  <div
                    className={cn(
                      'group-hover:bg-background dark:group-hover:bg-input/30 dark:group-hover:border-input absolute inset-0 m-1 rounded-sm border border-transparent transition-all group-hover:shadow-sm',
                      active && 'bg-background dark:bg-input/30 dark:border-input shadow-sm'
                    )}
                  />
                </Link>
              )
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export { OnlinePlayTabs, SeasonTabs }
