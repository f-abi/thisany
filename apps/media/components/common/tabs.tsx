'use client'

import { VideoType, VideoXle } from 'gying'
import { Tabs, TabsList, TabsTrigger } from '../animate-ui/components/radix/tabs'
import { useState, useRef, useEffect, useMemo } from 'react'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '../ui/button'

function SeasonTabs({ xle, type }: { xle: VideoXle; type: VideoType }) {
  const value = useMemo(() => xle.s.findIndex(_ => _ === '1').toString(), [xle])
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

    if (container) {
      container.addEventListener('scroll', checkScroll)
    }
    window.addEventListener('resize', checkScroll)

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll)
      }
      window.removeEventListener('resize', checkScroll)
    }
  }, [xle])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const activeTab = container.querySelector('[data-state="active"]') as HTMLElement
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'center' })
    }
    checkScroll()
  }, [xle])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current
      const scrollAmount = container.clientWidth / 4

      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="relative w-full">
      <div
        className={cn(
          'from-background absolute top-0 bottom-0 left-0 z-10 flex items-center bg-linear-to-r to-transparent px-1 transition-opacity',
          showLeft ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <Button
          variant={'outline'}
          size={'icon-lg'}
          className="rounded-full"
          onClick={() => scroll('left')}
        >
          <IconChevronLeft className="size-5" />
        </Button>
      </div>
      <Tabs
        value={value}
        activationMode={'manual'}
        ref={scrollRef}
        className="w-full overflow-x-auto scroll-smooth rounded-lg transition-all [&::-webkit-scrollbar]:hidden"
      >
        <TabsList className="h-10">
          {xle.t.map((item, index) => (
            <TabsTrigger key={index} value={index.toString()} asChild>
              <Link href={`/media/${type}/${xle.u[index]}`} className="p-2 px-4">
                {item}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div
        className={cn(
          'from-background absolute top-0 right-0 bottom-0 z-10 flex items-center bg-linear-to-l to-transparent px-1 transition-opacity',
          showRight ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <Button
          variant={'outline'}
          size={'icon-lg'}
          className="rounded-full"
          onClick={() => scroll('right')}
        >
          <IconChevronRight className="size-5" />
        </Button>
      </div>
    </div>
  )
}

export { SeasonTabs }
