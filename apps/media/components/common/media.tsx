import { DB_URL, IM_URL, ListItemData, RT_URL, VideoDetail } from 'gying'
import Link from 'next/link'
import { Fragment } from 'react/jsx-runtime'

import { MediaImage } from '@/components/common/image'
import { MediaLink } from '@/components/common/link'
import { cn } from '@/lib/utils'

const baseDetailConfig: Array<{ key: keyof VideoDetail; name: string }> = [
  {
    key: 'diqu',
    name: '地区：'
  },
  {
    key: 'leixing',
    name: '类型：'
  },
  {
    key: 'daoyan',
    name: '导演：'
  },
  {
    key: 'bianju',
    name: '编剧：'
  },
  {
    key: 'zhuyan',
    name: '主演：'
  }
]

function MediaLinkList({ data }: { data: Array<ListItemData> }) {
  return (
    <div className="grid grid-cols-3 gap-1 md:grid-cols-4 md:gap-4 lg:grid-cols-6">
      {data.map(item => (
        <MediaLink item={item} key={item.id} />
      ))}
    </div>
  )
}

function MediaDetailReleaseDate({ data, className }: { data: VideoDetail; className?: string }) {
  return (
    <div className={cn('overflow-hidden leading-loose text-ellipsis whitespace-nowrap', className)}>
      <span className="text-muted-foreground">{data.dir === 'mv' ? '上映：' : '首播：'}</span>
      <span>{data.stime}</span>
    </div>
  )
}

function MediaDetailScore({ data, className }: { data: VideoDetail; className?: string }) {
  return (
    <div className={cn('flex flex-row items-center justify-between', className)}>
      <div className="max-w-[50%] overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="text-muted-foreground">片长：</span>
        <span>{data.times ?? '暂无信息'}</span>
      </div>
      <div className="flex flex-row font-bold">
        {data.pf && (
          <Fragment>
            {data.pf.db && (
              <Link
                href={DB_URL + data.pf.db.id}
                target="_blank"
                className="text-chart-2 ml-2 lg:ml-4"
              >
                <span>豆瓣</span>
                {data.pf.db.s && <span>&nbsp;{data.pf.db.s}</span>}
              </Link>
            )}
            {data.pf.im && (
              <Link
                href={IM_URL + data.pf.im.id}
                target="_blank"
                className="text-chart-4 dark:text-chart-3 ml-2 lg:ml-4"
              >
                <span>IM</span>
                {data.pf.im.s && <span>&nbsp;{data.pf.im.s}</span>}
              </Link>
            )}
            {data.pf.ro && (
              <Link
                href={RT_URL + data.pf.ro.id}
                target="_blank"
                className="text-destructive ml-2 lg:ml-4"
              >
                <span>RT</span>
                {data.pf.ro.s && <span>&nbsp;{data.pf.ro.s}</span>}
              </Link>
            )}
          </Fragment>
        )}
      </div>
    </div>
  )
}

function MediaDetail({ data }: { data: VideoDetail }) {
  return (
    <div className="card mx-2 mb-2 flex flex-col p-2 text-sm md:p-4 md:text-base 2xl:mx-0">
      <div className="flex flex-row">
        <div className="w-[38%] sm:w-[28%] lg:w-[20%] xl:w-[17%]">
          <MediaImage {...data} />
        </div>
        <div className="flex w-[62%] flex-col justify-between pl-2 sm:w-[72%] md:pl-4 lg:w-[80%] xl:w-[83%]">
          <div className="text-xl font-bold md:text-2xl">
            <span>{data.title}</span>
            <span className="text-muted-foreground pl-2">({data.year})</span>
          </div>
          <div className="flex flex-col">
            {baseDetailConfig.map(
              ({ key, name }) =>
                (data[key] as Array<string>) &&
                (data[key] as Array<string>).length > 0 && (
                  <div
                    key={key}
                    className="overflow-hidden leading-loose text-ellipsis whitespace-nowrap"
                  >
                    <span className="text-muted-foreground">{name}</span>
                    {(data[key] as Array<string>).map((item, index) => (
                      <Fragment key={index}>
                        <span>{item}</span>
                        {index < (data[key] as Array<string>).length - 1 && (
                          <span>&nbsp;/&nbsp;</span>
                        )}
                      </Fragment>
                    ))}
                  </div>
                )
            )}
            <MediaDetailReleaseDate data={data} className="hidden md:flex" />
            <MediaDetailScore data={data} className="hidden md:flex" />
          </div>
        </div>
      </div>
      <MediaDetailReleaseDate data={data} className="md:hidden" />
      <MediaDetailScore data={data} className="md:hidden" />
      <div className="text-muted-foreground leading-relaxed md:mt-2 lg:mt-4">
        简介：{data.introduce || '暂无简介'}
      </div>
    </div>
  )
}

export { MediaDetail, MediaLinkList }
