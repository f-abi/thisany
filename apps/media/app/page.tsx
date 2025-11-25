import { getHomeData } from 'gying'

export default async function Home() {
  const data = await getHomeData()
  return (
    <div className="flex flex-col font-sans font-bold">
      <div className="bg-background p-4">{JSON.stringify(data)}</div>
      <div className="bg-background p-4">{JSON.stringify(data)}</div>
      <div className="bg-background p-4">{JSON.stringify(data)}</div>
      <div className="bg-background p-4">{JSON.stringify(data)}</div>
    </div>
  )
}
