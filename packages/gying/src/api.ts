import { GYING_API, IMAGE_CDN, IMAGE_FORMAT, IMAGE_SERVICE, USER_AGENT } from './constants'
import { getCookies } from './cookie'
import { Banner, Recommend } from './types'

export async function getHomeData() {
  const cookie = await getCookies()

  const response = await fetch(GYING_API, {
    headers: {
      'User-Agent': USER_AGENT,
      cookie
    }
  })

  const html = await response.text()

  // 提取HTML文本中的 _obj.banner
  const bannerMatch = html.match(/_obj\.banner\s*=\s*(\{.*?\});/s)
  // 提取HTML文本中的 _obj.inlist
  const recommend = html.match(/_obj\.inlist\s*=\s*(\[\{.*?\}\]);/s)

  if (!bannerMatch || !recommend) throw new Error('解析首页数据失败')

  const bannerRaw = JSON.parse(bannerMatch[1]) as Banner
  const recommendRaw = JSON.parse(recommend[1]) as Array<Recommend>

  return {
    banner: bannerRaw.t.map((title, index) => ({
      title,
      id: bannerRaw.i[index],
      dir: bannerRaw.y[index],
      diqu: bannerRaw.d[index],
      introduce: bannerRaw.j[index],
      cover: `${IMAGE_SERVICE}${IMAGE_CDN}/img/${bannerRaw.y[index]}/${bannerRaw.i[index]}_i/800.webp`,
      image: `${IMAGE_SERVICE}${IMAGE_CDN}/img/${bannerRaw.y[index]}/${bannerRaw.i[index]}.webp`
    })),
    recommend: recommendRaw.map(_ => ({
      title: _.ht,
      data: _.t.map((title, index) => ({
        title,
        id: _.i[index],
        dir: _.ty,
        tag: _.a[index],
        pf: _.d[index],
        xle: _.g[index],
        image: `${IMAGE_SERVICE}${IMAGE_CDN}/img/${_.ty}/${_.i[index]}${IMAGE_FORMAT}`
      })),
      type: _.ty,
      pageNo: 1,
      pageMax: 5,
      loading: false
    }))
  }
}
