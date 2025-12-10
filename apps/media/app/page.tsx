import { getHomeData } from 'gying'

import { HomeBanner } from '@/components/common/home-banner'
import { Main } from '@/components/layout/main'
import { HomeRecommend } from '@/components/common/home-recommend'
import { IconDeviceTvOldFilled, IconGhost2Filled, IconVideoFilled } from '@tabler/icons-react'
import { Sidebar, SidebarItem } from '@/components/layout/sidebar'
import { getSidebarExpand } from '@/lib/cookies'

const sidebarConfig = [
  {
    Icon: IconVideoFilled,
    key: 'mv',
    name: '最新电影',
    href: '/#mv'
  },
  {
    Icon: IconDeviceTvOldFilled,
    key: 'tv',
    name: '最新剧集',
    href: '/#tv'
  },
  {
    Icon: IconGhost2Filled,
    key: 'ac',
    name: '最新动漫',
    href: '/#ac'
  }
]

export default async function Home() {
  const sidebarExpand = await getSidebarExpand()

  const data = await getHomeData({
    next: {
      revalidate: 6000
    }
  })

  return (
    <Main>
      <Sidebar expand={sidebarExpand}>
        {sidebarConfig.map(item => (
          <SidebarItem key={item.key} Icon={item.Icon} name={item.name} />
        ))}
      </Sidebar>
      <div className="sidebar-page flex flex-col transition-all">
        <HomeBanner data={data.banner} />
        {data.recommend.map(item => (
          <HomeRecommend key={item.type} item={item} />
        ))}
      </div>
    </Main>
  )
}
