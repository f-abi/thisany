'use server'

import { GYING_API, IMAGE_CDN, IMAGE_FORMAT, IMAGE_SERVICE, USER_AGENT } from './constants'
import { getCookies } from './cookie'
import {
  Banner,
  Recommend,
  HomeData,
  VideoType,
  ChangeRecommend,
  ListItemData,
  VideoTypeList,
  CategoryListData,
  Video,
  VideoDetail,
  Downurl,
  VideoResource,
  Player,
  FetchOptions,
  VideoSearch,
  Search
} from './types'
import { calcPlayList } from './utils'

/**
 * 主页数据
 */
export async function getHomeData(options?: FetchOptions): Promise<HomeData> {
  const cookie = await getCookies()

  const response = await fetch(GYING_API, {
    ...options,
    headers: {
      'User-Agent': USER_AGENT,
      cookie,
      ...options?.headers
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
      cover: `${IMAGE_CDN}/img/${bannerRaw.y[index]}/${bannerRaw.i[index]}_i/800.webp`,
      image: `${IMAGE_CDN}/img/${bannerRaw.y[index]}/${bannerRaw.i[index]}_i/800.webp`
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
        image: `${IMAGE_CDN}/img/${_.ty}/${_.i[index]}/384.webp`
      })),
      type: _.ty,
      pageNo: 1,
      pageMax: 5,
      loading: false
    }))
  }
}

/**
 * 获取主页推荐数据
 */
export async function getHomeRecommendData({
  pageIndex,
  type,
  options
}: {
  pageIndex: number
  type: VideoType
  options?: FetchOptions
}): Promise<Array<ListItemData>> {
  const cookie = await getCookies()

  const response = await fetch(`${GYING_API}/res/change/${type}/${pageIndex}`, {
    ...options,
    headers: {
      'User-Agent': USER_AGENT,
      cookie,
      ...options?.headers
    }
  })

  const data = (await response.json()) as ChangeRecommend

  return data.t.map((title, index) => ({
    title,
    id: data.i[index],
    dir: type,
    tag: data.a[index],
    pf: data.d[index],
    xle: data.g[index],
    image: `${IMAGE_SERVICE}${IMAGE_CDN}/img/${type}/${data.i[index]}${IMAGE_FORMAT}`
  }))
}

/**
 * 获取分类列表数据
 */
export async function getCategoryListData({
  pageIndex,
  type,
  lang,
  region,
  year,
  genre,
  rrange,
  srange,
  quality,
  sort,
  options
}: {
  pageIndex: number
  type: VideoType
  /**
   * 语言
   */
  lang?: string
  /**
   * 地区
   */
  region?: string
  /**
   * 年份
   *
   * - 2025
   * - 90    90年代
   */
  year?: string
  /** 分类 */
  genre?: string
  /**
   * 评分范围
   * - 0_5 评分 0~5
   */
  rrange?: string
  /**
   * 评分人数
   */
  srange?: string
  /** 画质 */
  quality?: string
  /** 排序 */
  sort?: string
  options?: FetchOptions
}): Promise<CategoryListData> {
  if (pageIndex < 1) throw new Error('影片列表错误')

  const cookie = await getCookies()

  const url = new URL(`${GYING_API}/res/${type}`)
  url.searchParams.set('page', pageIndex.toString())
  if (lang) url.searchParams.set('lang', lang)
  if (region) url.searchParams.set('region', region)
  if (year) url.searchParams.set('year', year)
  if (genre) {
    url.searchParams.set('genre', genre)
    if (genre.split('_').length > 1) url.searchParams.set('genres', '1')
  }
  if (rrange) url.searchParams.set('rrange', rrange)
  if (srange) url.searchParams.set('srange', srange)
  if (quality) url.searchParams.set('quality', quality)
  if (sort) url.searchParams.set('sort', sort)

  const response = await fetch(url, {
    ...options,
    headers: {
      'User-Agent': USER_AGENT,
      cookie,
      ...options?.headers
    }
  })

  const preData = (await response.json()) as VideoTypeList

  const data = preData.inlist

  return {
    type,
    pageIndex,
    pageSize: 42,
    pageTotal: preData.page.pages,
    total: 42 * preData.page.pages,
    items:
      data.t?.map((title, index) => ({
        title,
        id: data.i[index],
        dir: type,
        tag: data.a[index],
        pf: data.d[index],
        xle: data.g[index],
        image: `${IMAGE_SERVICE}${IMAGE_CDN}/img/${type}/${data.i[index]}${IMAGE_FORMAT}`
      })) ?? []
  }
}

/**
 * 获取影片详情
 */
export async function getVideoDetail({
  id,
  type,
  options
}: {
  id: string
  type: VideoType
  options?: FetchOptions
}): Promise<VideoDetail> {
  const cookie = await getCookies()

  const response = await fetch(`${GYING_API}/${type}/${id}`, {
    ...options,
    headers: {
      'User-Agent': USER_AGENT,
      cookie,
      Referer: `${GYING_API}/${type}`,
      ...options?.headers
    }
  })

  const dataRaw = await response.text()

  // 提取HTML文本中的 _obj.d
  const detailsMatch = dataRaw.match(/_obj\.d\s*=\s*(\{.*?\});/s)

  if (!detailsMatch) throw new Error('解析影片详情失败')

  const data = JSON.parse(detailsMatch[1]) as Video

  return {
    ...data,
    status: data.status
      ? data.status.replace(/<em>/g, '<span>').replace(/<\/em>/g, '</span>')
      : undefined,
    image: `${IMAGE_SERVICE}${IMAGE_CDN}/img/${type}/${id}${IMAGE_FORMAT}`
  }
}

/**
 * 获取片源
 */
export async function getVideoResource({
  id,
  type,
  options
}: {
  id: string
  type: VideoType
  options?: FetchOptions
}): Promise<VideoResource> {
  const cookie = await getCookies()

  const vrgResponse = await fetch(`${GYING_API}/${type}/${id}`, {
    ...options,
    headers: {
      'User-Agent': USER_AGENT,
      cookie,
      Referer: `${GYING_API}`,
      ...options?.headers
    }
  })

  const vrgCookies = vrgResponse.headers.getSetCookie()
  const vrgCookieStrings = vrgCookies
    .map(_ => {
      const match = _.match(/^([^=]+)=([^;]+)/)
      return match ? `${match[1]}=${match[2]}` : ''
    })
    .filter(Boolean)
    .join(';')

  const response = await fetch(`${GYING_API}/res/downurl/${type}/${id}`, {
    ...options,
    headers: {
      'User-Agent': USER_AGENT,
      cookie: `${cookie};${vrgCookieStrings}`,
      Referer: `${GYING_API}/${type}/${id}`,
      ...options?.headers
    }
  })

  const data = (await response.json()) as Downurl

  const playList = data.playlist ? calcPlayList(data.playlist) : []

  const panList: VideoResource['panList'] = data.panlist
    ? data.panlist.tname.map(name => ({ name, data: [] }))
    : []

  if (panList.length > 0 && data.panlist) {
    const { type, name, p, time, url, user } = data.panlist
    type.forEach((panIndex, i) => {
      const panData = {
        name: name[i],
        password: p[i] ?? '',
        time: time[i],
        url: url[i],
        user: user[i]
      }
      panList[panIndex].data.push(panData)
    })
  }

  return {
    playList,
    panList,
    isCaptcha: !!data.file?.js
  }
}

/**
 * 获取播放列表
 */
export async function getVideoPlayer({
  id,
  type,
  pid,
  episodes,
  options
}: {
  id: string
  type: VideoType
  pid: string
  episodes: string
  options?: FetchOptions
}): Promise<Player> {
  const cookie = await getCookies()

  const response = await fetch(`${GYING_API}/py/${pid}_${episodes}.html`, {
    ...options,
    headers: {
      'User-Agent': USER_AGENT,
      cookie,
      Referer: `${GYING_API}/${type}/${id}`,
      ...options?.headers
    }
  })

  const dataRaw = await response.text()

  // 提取HTML文本中的 _obj.player
  const detailsMatch = dataRaw.match(/_obj\.player\s*=\s*(\{.*?\});/s)

  if (!detailsMatch) throw new Error('解析播放列表失败')

  const data = JSON.parse(detailsMatch[1]) as Player
  const playlist = data.playlist ? calcPlayList(data.playlist) : []

  if (data.url.length === 0) throw new Error('解析播放列表参数错误')

  return {
    ...data,
    playlist
  }
}

export async function searchVideo({
  pageIndex,
  keyword,
  options
}: {
  pageIndex: number
  keyword: string
  options?: FetchOptions
}): Promise<VideoSearch> {
  const cookie = await getCookies()

  const response = await fetch(
    `${GYING_API}/res/s/1---${pageIndex}/${encodeURIComponent(keyword)}`,
    {
      ...options,
      headers: {
        'User-Agent': USER_AGENT,
        cookie,
        Referer: `${GYING_API}`,
        ...options?.headers
      }
    }
  )

  const dataRaw = (await response.json()) as Search

  const list = dataRaw.inlist
    ? dataRaw.inlist?.title.map((title, index) => ({
        title,
        id: dataRaw.inlist!.i[index],
        type: dataRaw.inlist!.d[index],
        zhuyan: dataRaw.inlist!.zhuyan[index],
        info: dataRaw.inlist!.info[index],
        name: dataRaw.inlist!.name[index],
        ename: dataRaw.inlist!.ename[index],
        db: dataRaw.inlist!.pf.db.s[index],
        im: dataRaw.inlist!.pf.im.s[index],
        year: dataRaw.inlist!.year[index],
        image: `${IMAGE_SERVICE}${IMAGE_CDN}/img/${dataRaw.inlist!.d[index]}/${dataRaw.inlist!.i[index]}${IMAGE_FORMAT}`
      }))
    : []

  return {
    pageIndex,
    pageSize: 25,
    pageTotal: dataRaw.page.pages,
    items: list
  }
}
