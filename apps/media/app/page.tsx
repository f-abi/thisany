import { getHomeData } from 'gying'

export default async function Home() {
  const data = await getHomeData()
  return (
    <div className="flex flex-col">
      <div>{JSON.stringify(data)}</div>
    </div>
  )
}
