import { ListItemData, tagToString } from 'gying'
import Image from 'next/image'
import Link from 'next/link'
import { Skeleton } from '../ui/skeleton'

export function MediaList({ data }: { data: Array<ListItemData> }) {
  return (
    <div className="grid grid-cols-3 gap-1 md:grid-cols-4 md:gap-2 lg:grid-cols-6 lg:gap-4">
      {data.map(item => (
        <Link
          href={`/media/${item.dir}/${item.id}`}
          key={item.id}
          className="flex flex-col overflow-hidden rounded-lg p-1 backdrop-blur-xs backdrop-saturate-0 select-none hover:bg-(--app-blur-background) xl:p-2"
        >
          <div className="relative aspect-2/3">
            <Skeleton className="absolute top-0 z-[-1] h-full w-full" />
            <Image
              src={item.image}
              alt={item.title}
              width={200}
              height={300}
              className="h-full w-full rounded-lg"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col">
            <span className="overflow-hidden text-center text-sm text-ellipsis whitespace-nowrap md:text-base md:leading-loose">
              {item.title}
            </span>
            <span className="text-muted-foreground overflow-hidden text-center text-xs leading-none text-ellipsis whitespace-nowrap md:text-sm">
              {tagToString(item.tag)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
