import { HomeRecommend as HomeRecommendType } from 'gying'
import { MediaList } from './media-list'
import { Button } from '../ui/button'

export function HomeRecommend({ data }: { data: Array<HomeRecommendType> }) {
  return (
    <div>
      {data.map(item => (
        <div key={item.type} className="glass mb-2 flex flex-col p-4">
          <div className="mb-2 flex flex-row items-center justify-between">
            <div className="text-2xl font-bold">{item.title}</div>
            <Button variant={'outline'}>刷新</Button>
          </div>
          <MediaList data={item.data} />
        </div>
      ))}
    </div>
  )
}
