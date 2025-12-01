import { getHomeData } from 'gying'

import { HomeBanner } from '@/components/common/home-banner'
import { Main } from '@/components/layout/main'
import { HomeRecommend } from '@/components/common/home-recommend'

export default async function Home() {
  const data = await getHomeData()
  return (
    <Main>
      <HomeBanner data={data.banner} />
      <HomeRecommend data={data.recommend} />
    </Main>
  )
}
