import { MediaImage } from '@/components/common/image'
import { PanList } from '@/components/common/pan'
import { MediaStatus } from '@/components/common/status'
import { OnlinePlayTabs, SeasonTabs } from '@/components/common/tabs'
import { Main } from '@/components/layout/main'
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item'
import { IconProgressCheck, IconRefresh } from '@tabler/icons-react'
import {
  DB_URL,
  getVideoDetail,
  getVideoResource,
  GYING_TYPE,
  IM_URL,
  RT_URL,
  VideoDetail,
  VideoType
} from 'gying'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Fragment } from 'react/jsx-runtime'

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

export default async function MediaDetailPage({
  params
}: {
  params: Promise<{ type: VideoType; id: string }>
}) {
  const { id, type } = await params

  if (!GYING_TYPE.includes(type) || !id) notFound()

  const data = await getVideoDetail({
    id,
    type,
    options: {
      next: {
        revalidate: 60000
      }
    }
  })

  const resource = await getVideoResource({
    id,
    type,
    options: {
      next: {
        revalidate: 60000
      }
    }
  })

  return (
    <Main>
      <div className="card mx-2 mb-2 flex flex-col p-2 md:p-4 2xl:mx-0">
        <div className="flex flex-row">
          <div className="w-[38%] sm:w-[28%] lg:w-[20%] xl:w-[17%]">
            <MediaImage {...data} />
          </div>
          <div className="flex w-[62%] flex-col justify-between pl-2 sm:w-[72%] md:pl-4 lg:w-[80%] xl:w-[83%]">
            <div className="text-2xl font-bold">
              <span>{data.title}</span>
              <span className="text-muted-foreground pl-2">({data.year})</span>
            </div>
            <div className="flex flex-col">
              {baseDetailConfig.map(({ key, name }) => (
                <div
                  key={key}
                  className="overflow-hidden leading-loose text-ellipsis whitespace-nowrap"
                >
                  <span className="text-muted-foreground">{name}</span>
                  {data[key] &&
                    (data[key] as Array<string>).map((item, index) => (
                      <Fragment key={index}>
                        <span>{item}</span>
                        {index < (data[key] as Array<string>).length - 1 && (
                          <span>&nbsp;/&nbsp;</span>
                        )}
                      </Fragment>
                    ))}
                </div>
              ))}
              <div className="overflow-hidden leading-loose text-ellipsis whitespace-nowrap">
                <span className="text-muted-foreground">
                  {data.dir === 'mv' ? '上映：' : '首播：'}
                </span>
                <span>{data.stime}</span>
              </div>
              <div className="flex flex-row items-center justify-between">
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
            </div>
          </div>
        </div>
        <div className="text-muted-foreground mt-2 leading-relaxed lg:mt-4">
          简介：{data.introduce || '暂无简介'}
        </div>
      </div>

      {data.xle?.t && <SeasonTabs xle={data.xle} type={type} />}

      {data.status && <MediaStatus html={data.status} />}

      {resource.playList.length > 0 && <OnlinePlayTabs playList={resource.playList} />}

      {resource.panList.length > 0 && <PanList panList={resource.panList} />}
    </Main>
  )
}
