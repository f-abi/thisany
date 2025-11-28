import { getHomeData, getCategoryListData, getVideoDetail, getVideoResource } from '../api'
import { HomeData } from '../types'

let homeData: HomeData

test('主页数据', async () => {
  homeData = await getHomeData()
  console.log('Home Data:', JSON.stringify(homeData, null, 2))

  expect(homeData).toHaveProperty('banner')
  expect(Array.isArray(homeData.banner)).toBe(true)
  if (homeData.banner.length > 0) {
    expect(homeData.banner[0]).toHaveProperty('title')
    expect(homeData.banner[0]).toHaveProperty('id')
    expect(homeData.banner[0]).toHaveProperty('cover')
    expect(homeData.banner[0]).toHaveProperty('image')
  }

  expect(homeData).toHaveProperty('recommend')
  expect(Array.isArray(homeData.recommend)).toBe(true)
  if (homeData.recommend.length > 0) {
    expect(homeData.recommend[0]).toHaveProperty('title')
    expect(homeData.recommend[0]).toHaveProperty('data')
    expect(Array.isArray(homeData.recommend[0].data)).toBe(true)
  }
})

test('获取分类列表数据', async () => {
  const data = await getCategoryListData({ pageIndex: 1, type: 'tv' })
  console.log('Category List Data:', JSON.stringify(data, null, 2))
  expect(data).toHaveProperty('items')
  expect(Array.isArray(data.items)).toBe(true)
  expect(data.type).toBe('tv')
})

test('获取影片详情', async () => {
  if (!homeData || !homeData.banner || homeData.banner.length === 0) {
    console.warn('Skipping getVideoDetail test because no home data available')
    return
  }
  const item = homeData.banner[0]
  const data = await getVideoDetail({ id: item.id, type: item.dir })
  console.log('Video Detail:', JSON.stringify(data, null, 2))
  expect(data).toHaveProperty('title')
  expect(data).toHaveProperty('id', item.id)
  expect(data).toHaveProperty('introduce')
})

test('获取片源', async () => {
  if (!homeData || !homeData.banner || homeData.banner.length === 0) {
    console.warn('Skipping getVideoResource test because no home data available')
    return
  }
  const item = homeData.banner[0]
  const data = await getVideoResource({ id: item.id, type: item.dir })
  console.log('Video Resource:', JSON.stringify(data, null, 2))
  expect(data).toHaveProperty('playList')
  expect(Array.isArray(data.playList)).toBe(true)
})
