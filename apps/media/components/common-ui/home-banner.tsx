'use client'

import { useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '../ui/carousel'
import { HomeBanner as GYHomeBanner } from 'gying'
import Image from 'next/image'
import { Skeleton } from '../ui/skeleton'

export function HomeBanner({ data }: { data: Array<GYHomeBanner> }) {
  const [api, setApi] = useState<CarouselApi>()
  return (
    <div className="flex w-full items-center">
      <div className="relative w-9/12">
        <Carousel
          setApi={setApi}
          plugins={[
            Autoplay({
              delay: 6000
            })
          ]}
          className="overflow-hidden rounded-(--radius)"
        >
          <CarouselContent>
            {data.map(item => (
              <CarouselItem key={item.id} className="relative w-full">
                <Skeleton className="absolute top-0 z-[-1] h-full w-full" />
                <Image
                  src={item.image}
                  alt={item.title}
                  width={900}
                  height={400}
                  className="aspect-9/4 w-full rounded-(--radius) border"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}
