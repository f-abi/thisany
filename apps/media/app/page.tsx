import { getHomeData } from 'gying'

import { HomeBanner } from '@/components/common/home-banner'
import { Main } from '@/components/layout/main'
import { HomeRecommend } from '@/components/common/home-recommend'

export default async function Home() {
  const data = await getHomeData({
    next: {
      revalidate: 60
    }
  })
  return (
    <Main>
      <HomeBanner data={data.banner} />
      {data.recommend.map(item => (
        <HomeRecommend key={item.type} item={item} />
      ))}
    </Main>
  )
}
