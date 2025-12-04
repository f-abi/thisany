'use client'

import Autoplay from 'embla-carousel-autoplay'
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel'
import { HomeBanner as GYHomeBanner } from 'gying'
import Image from 'next/image'
import { Skeleton } from '../ui/skeleton'
import Link from 'next/link'

export function HomeBanner({ data }: { data: Array<GYHomeBanner> }) {
  return (
    <div className="mb-2 flex w-full items-center px-2 xl:px-0">
      <div className="glass relative w-full p-1 xl:p-4">
        <Carousel
          plugins={[
            Autoplay({
              delay: 3_000
            })
          ]}
          className="overflow-hidden rounded-(--radius)"
        >
          <CarouselContent>
            {data.map(item => (
              <CarouselItem key={item.id}>
                <Link
                  href={`/media/${item.dir}/${item.id}`}
                  className="relative flex overflow-hidden rounded-(--radius)"
                >
                  <Skeleton className="absolute top-0 z-[-1] h-full w-full" />
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={900}
                    height={400}
                    className="aspect-9/4 w-full rounded-(--radius)"
                    loading="eager"
                  />
                  <div className="text-primary-foreground dark:text-foreground absolute bottom-2 overflow-hidden p-2 backdrop-blur-sm md:bottom-0 md:w-full md:rounded-b-(--radius) xl:p-4">
                    <div className="font-bold md:pb-1 md:text-xl xl:pb-2 xl:text-2xl">
                      {item.title}
                    </div>
                    <div
                      className="hidden font-bold md:flex md:text-sm xl:text-base"
                      dangerouslySetInnerHTML={{ __html: item.introduce }}
                    />
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}
