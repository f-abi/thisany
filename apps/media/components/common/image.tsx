'use client'

import { IconLoader2, IconPhotoX } from '@tabler/icons-react'
import { HomeBanner, ListItemData, VideoDetail } from 'gying'
import Image from 'next/image'
import { PropsWithChildren, useState } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

function useImageStatus() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  return {
    loading,
    error,
    onLoad: () => setLoading(false),
    onError: () => setError(true)
  }
}

function ImageSkeleton({ isLoading, isError }: { isLoading: boolean; isError: boolean }) {
  if (!isLoading) return null
  return (
    <Skeleton className="image-skeleton">
      {isError ? <IconPhotoX /> : <IconLoader2 className="animate-spin" />}
      <span className="text-xs">{isError ? '加载失败' : '加载中...'}</span>
    </Skeleton>
  )
}

function MediaImage({ image, title }: VideoDetail) {
  const { loading, error, onLoad, onError } = useImageStatus()
  return (
    <div className="relative aspect-2/3">
      <ImageSkeleton isError={error} isLoading={loading} />
      <Image
        src={image}
        alt={title}
        width={200}
        height={300}
        className="image"
        onLoad={onLoad}
        onError={onError}
        loading={'eager'}
      />
    </div>
  )
}

function MediaLinkImage({ item }: { item: ListItemData }) {
  const { loading, error, onLoad, onError } = useImageStatus()
  return (
    <div className="relative aspect-2/3">
      <div className="absolute inset-0 z-1 h-full w-full">
        <ImageSkeleton isError={error} isLoading={loading} />
        <div className={'image-tag absolute top-4 left-0 rounded-r-sm'}>
          {item.pf === 0 ? '暂无评分' : item.pf.toFixed(1)}
        </div>
        {item.xle && item.xle.length > 0 && (
          <div className={'image-tag absolute right-0 bottom-4 rounded-l-sm'}>{item.xle}</div>
        )}
      </div>
      <Image
        src={item.image}
        alt={item.title}
        width={200}
        height={300}
        className="image"
        onLoad={onLoad}
        onError={onError}
      />
    </div>
  )
}

function HomeBannerLinkImage({ item, children }: PropsWithChildren<{ item: HomeBanner }>) {
  const { loading, error, onLoad, onError } = useImageStatus()
  return (
    <div className="relative aspect-9/4 size-full">
      <ImageSkeleton isError={error} isLoading={loading} />
      <Image
        loading={'eager'}
        src={item.image}
        alt={item.title}
        width={900}
        height={400}
        className="image"
        onLoad={onLoad}
        onError={onError}
      />
      {children}
    </div>
  )
}

export { HomeBannerLinkImage, MediaImage, MediaLinkImage }
