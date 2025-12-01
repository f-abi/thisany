export interface PowSolveResult {
  nonce: number[]
  hashes: number
  duration: number
  hashRate: number
  method: string
}

export interface PowSolveOptions {
  challenge: string[]
  diff: number
  salt: string
}

/** 影片类型 */
export type VideoType = 'mv' | 'tv' | 'ac'

/** 横幅 */
export interface Banner {
  /** 标题 */
  t: Array<string>
  /** 影片ID */
  i: Array<string>
  /** 类型 */
  y: Array<VideoType>
  /** 简介 */
  j: Array<string>
  /** 地区 */
  d: Array<string>
  /** 类型文本 */
  c: Array<string>
}

/** 推荐 */
export interface Recommend {
  /** 标题 */
  t: Array<string>
  /** Tag */
  a: Array<Array<number | string>>
  /** 清晰度 / 集数 */
  g: Array<string>
  // z: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  /** ? */
  z: number[]
  /** 评分 */
  d: number[]
  /** 影片ID */
  i: Array<string>
  /** 影片类型 */
  ty: VideoType
  /** ? */
  h2: number
  /** ? */
  cg: number
  /** 模块标题 */
  ht: string
}

/** 换一换 */
export interface ChangeRecommend {
  /** Tag */
  a: Array<Array<number | string>>
  /** 评分 */
  d: number[]
  /** 清晰度 / 集数 */
  g: Array<string>
  /** 影片ID */
  i: Array<string>
  /** ? */
  r: number[]
  /** 标题 */
  t: Array<string>
  /** ? */
  z: number[]
}

/** 分类影片列表 */
export interface VideoTypeList {
  page: {
    pages: number
  }
  inlist: ChangeRecommend
}

/** 影片 */
export interface Video {
  /** 标题 */
  title: string
  /** 名称 */
  name?: string
  /** 影片ID */
  id: string
  /** 简介 */
  introduce: string
  /** 影片类型 */
  dir: VideoType
  /** 类型文本 */
  dname: string
  /** 年份 */
  year: number
  /** 更新状态 */
  status?: string | undefined
  /** 导演 */
  daoyan?: Array<string>
  /** 编剧 */
  bianju?: Array<string>
  /** 主演 */
  zhuyan?: Array<string>
  /** 类型 */
  leixing?: Array<string>
  /** 地区 */
  diqu?: Array<string>
  /** 首播时间 */
  stime?: string
  /** 片长 */
  times?: string
  /** 总剧集 */
  xle?: VideoXle
  /** 评分 */
  pf?: VideoPf
}

/** 剧集 */
export interface VideoXle {
  /** 选中 */
  s: Array<string>
  /** ID */
  u: Array<string>
  /** 名称 */
  t: Array<string>
}

/** 评分 */
export interface VideoPf {
  /** 豆瓣 */
  db?: Pf
  /** IM */
  im?: Pf
  /** RT */
  ro?: Pf
}

/** 评分明细 */
export interface Pf {
  /** ID */
  id: string
  /** 评分 */
  s: string
  /** 百分比 */
  x1?: number
}

/** 网盘下载列表 */
export interface Pan {
  /** id */
  id: Array<string>
  /** 名称 */
  name: Array<string>
  /** ? */
  e: Array<number>
  /** 提取密码 */
  p: Array<string>
  /** 上传时间 */
  time: Array<string>
  /** 网盘类型名称 */
  tname: Array<string>
  /** 网盘类型ID */
  type: Array<number>
  /** 网盘地址 */
  url: Array<string>
  /** 上传用户 */
  user: Array<string>
}

/** 播放列表 */
export interface Play {
  /** 播放ID */
  i: string
  /** 来源 */
  t: string
  /** ? */
  m: string
  /** 集数列表 */
  list: Array<string>
}

export interface Downurl {
  code: number
  panlist?: Pan
  playlist?: Array<Play>
  file?: DownurlFile
}

export interface DownurlFile {
  css: string
  js: string
}

export interface Player {
  /** 影片名称 */
  title: string
  /** 影片ID */
  bid: string
  /** 影片类型 */
  dir: string
  /** 选中播放列表集数的INDEX */
  page: number
  /** m3u8地址 */
  url: string
  /** 选中播放列表tab类型 */
  select: number
  /** 播放列表 */
  playlist: Array<Play>
}

export interface Captcha {
  img: string
  text: string
  type: string
}

/** 主页横幅 */
export interface HomeBanner {
  /** 标题 */
  title: string
  /** ID */
  id: string
  /** 类型 */
  dir: VideoType
  /** 地区 */
  diqu: string
  /** 简介 */
  introduce: string
  /** 图片 */
  image: string
  /** 封面 */
  cover: string
}

/** 主页推荐明细 */
export interface ListItemData {
  /** 标题 */
  title: string
  /** ID */
  id: string
  /** 类型 */
  dir: VideoType
  /** 标签 */
  tag: Array<number | string>
  /** 综合评分 */
  pf: number
  /** 清晰度 / 集数 */
  xle: string
  /** 图片 */
  image: string
}

/** 主页推荐 */
export interface HomeRecommend {
  /** 推荐板块标题 */
  title: string
  /** 推荐数据 */
  data: Array<ListItemData>
  /** 推荐类型 */
  type: VideoType
  /** 当前页 */
  pageNo: number
  /** 最大页 */
  pageMax: number
  loading: boolean
}

/**
 * 主页数据
 */
export interface HomeData {
  /** 横幅 */
  banner: Array<HomeBanner>
  /** 推荐 */
  recommend: Array<HomeRecommend>
}

/**
 * 分类列表数据
 */
export interface CategoryListData {
  pageIndex: number
  pageSize: 42
  pageTotal: number
  total: number
  type: VideoType
  items: Array<ListItemData>
}

/**
 * 影片详情
 */
export type VideoDetail = Video & {
  image: string
}

/** 视频下载 */
export interface Download {
  /** 名称 */
  name: string
  /** 提取密码 */
  password: string
  /** 上传时间 */
  time: string
  /** 网盘下载地址 */
  url: string
  /** 上传用户 */
  user: string
}

/** 视频下载数据 */
export interface VideoPanList {
  /** 网盘名称 */
  name: string
  /** 数据 */
  data: Array<Download>
}

/** 视频源 */
export interface VideoResource {
  panList: Array<VideoPanList>
  playList: Array<Play>
  isCaptcha: boolean
}
