import { HomeBanner, ListItemData, tagToString } from 'gying'
import Link from 'next/link'

import { Skeleton } from '../ui/skeleton'
import { HomeBannerLinkImage, MediaLinkImage } from './image'

function MediaLink({ item, index }: { item: ListItemData; index?: number }) {
  return (
    <Link href={`/media/${item.dir}/${item.id}`} key={item.id} className="media-link">
      <MediaLinkImage item={item} loadingModel={index && index > 23 ? 'eager' : 'lazy'} />
      <div className="flex flex-col">
        <span className="media-link_title">{item.title}</span>
        <span className="media-link_tag">{tagToString(item.tag)}</span>
      </div>
    </Link>
  )
}

function MediaLinkSkeleton() {
  return (
    <div className="media-link">
      <div className="relative aspect-2/3">
        <div className="absolute inset-0 z-1 h-full w-full">
          <Skeleton className="image-skeleton animate-pulse" />
        </div>
      </div>
      <div className="flex flex-col">
        <Skeleton className="my-1.5 h-4 animate-pulse md:h-5" />
        <Skeleton className="h-3 animate-pulse md:h-3.5" />
      </div>
    </div>
  )
}

function HomeBannerLink({ item }: { item: HomeBanner }) {
  return (
    <Link
      href={`/media/${item.dir}/${item.id}`}
      className="flex overflow-hidden rounded-lg select-none"
    >
      <HomeBannerLinkImage item={item}>
        <div className="text-primary-foreground dark:text-foreground absolute bottom-2 overflow-hidden rounded-lg p-1 px-2 backdrop-blur-sm md:bottom-0 md:w-full md:rounded-b-(--radius) xl:p-4">
          <div className="font-bold md:pb-1 md:text-xl xl:pb-2 xl:text-2xl">{item.title}</div>
          <div
            className="hidden font-bold md:flex md:text-sm xl:text-base"
            dangerouslySetInnerHTML={{ __html: item.introduce }}
          />
        </div>
      </HomeBannerLinkImage>
    </Link>
  )
}

export { HomeBannerLink, MediaLink, MediaLinkSkeleton }
