import { HomeBanner } from '@/components/common-ui/home-banner'
import { Main } from '@/components/layout/main'
import { getHomeData } from 'gying'

export default async function Home() {
  const data = await getHomeData()
  return (
    <Main>
      <HomeBanner data={data.banner} />
      <div className="flex flex-col font-sans font-bold">
        <span className="bg-background">{JSON.stringify(data)}</span>
      </div>
    </Main>
  )
}
