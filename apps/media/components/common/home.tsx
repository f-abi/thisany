'use client'

import Autoplay from 'embla-carousel-autoplay'
import { HomeRecommend as HomeRecommendType, getHomeRecommendData } from 'gying'
import { useState, useTransition } from 'react'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { HomeBannerLink, MediaLinkList } from './link'
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel'
import { HomeBanner as GYHomeBanner } from 'gying'
import { IconLoader2, IconReload } from '@tabler/icons-react'

function HomeBanner({ data }: { data: Array<GYHomeBanner> }) {
  return (
    <div className="mb-2 flex w-full items-center px-2 sm:pl-0">
      <div className="card relative w-full p-2 xl:p-4">
        <Carousel
          plugins={[
            Autoplay({
              delay: 3_000
            })
          ]}
          className="overflow-hidden rounded-lg"
        >
          <CarouselContent>
            {data.map(item => (
              <CarouselItem key={item.id}>
                <HomeBannerLink item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}

function HomeRecommend({ item }: { item: HomeRecommendType }) {
  const [data, setData] = useState(item.data)
  const [pageIndex, setPageIndex] = useState(item.pageNo)
  const [isPending, startTransition] = useTransition()

  const handleRefresh = () => {
    startTransition(async () => {
      try {
        const nextPageIndex = pageIndex + 1 > item.pageMax ? 1 : pageIndex + 1
        const newData = await getHomeRecommendData({
          pageIndex: nextPageIndex,
          type: item.type,
          options: {
            next: {
              revalidate: 6000
            }
          }
        })
        setData(newData)
        setPageIndex(nextPageIndex)
      } catch {
        toast.error('换一换失败，请重试！')
      }
    })
  }

  return (
    <div id={item.type} className="card mx-2 mb-2 flex scroll-mt-20 flex-col p-2 sm:ml-0 xl:p-4">
      <div className="mb-1 flex flex-row items-center justify-between md:mb-2">
        <div className="text-lg font-black md:text-xl md:font-bold lg:text-2xl">{item.title}</div>
        <Button onClick={handleRefresh} disabled={isPending} size="sm">
          {isPending ? <IconLoader2 className="animate-spin" /> : <IconReload />}
          换一换
        </Button>
      </div>
      <MediaLinkList data={data} />
    </div>
  )
}

export { HomeBanner, HomeRecommend }
