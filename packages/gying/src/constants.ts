export const GYING_API = 'https://www.gyg.si'
export const BT_AUTH =
  'f82eBAiIto3NBk5mqa8fXMCfPsgRdwNYyMKLSud0xpviOp1hJBpPF0Q80oTTVE0zmRJnm-oAVGVv9PgUCzvvhkCXOzYcf_RsfsQHBppyEtEQ1fRwZFm4H7PrtRnZGj4Cyxy2GHWTPFWb9bp8rKr0CeCBCAAdmUqb1WfC3I9nSbgnqRby'
export const BT_COOKIETIME = '3d0eu56MjV1PI9pKH4qWi96lN5C4YPfyjwB90mOXlzk2O990yXMS'
export const PHPSESSID = 'j8ffqg8q8r4t61ctl0d5n9b1ck'
export const USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
export const BASE_COOKIE = `BT_auth=${BT_AUTH};BT_cookietime=${BT_COOKIETIME};PHPSESSID=${PHPSESSID}`
export const IMAGE_CDN = 'https://s.tutu.pm'
export const IMAGE_SERVICE = 'https://images.weserv.nl/?url='
export const IMAGE_FORMAT = '/384.webp&w=320&h=480&fit=cover'
export const DB_URL = 'https://movie.douban.com/subject/'
export const IM_URL = 'https://www.imdb.com/title/'
export const RT_URL = 'https://www.rottentomatoes.com/'
export const GYING_TYPE = ['mv', 'tv', 'ac'] as const
export const GYING_TAG = [
  '美国',
  '大陆',
  '日本',
  '剧情',
  '科幻',
  '动作',
  '喜剧',
  '爱情',
  '冒险',
  '犯罪',
  '悬疑',
  '儿童',
  '歌舞',
  '音乐',
  '奇幻',
  '动画',
  '恐怖',
  '惊悚',
  '丧尸',
  '战争',
  '传记',
  '纪录',
  '西部',
  '灾难',
  '古装',
  '武侠',
  '家庭',
  '短片',
  '校园',
  '文艺',
  '运动',
  '青春',
  '同性',
  '励志',
  '人性',
  '美食',
  '女性',
  '治愈',
  '历史',
  '真人秀',
  '脱口秀',
  '萌系',
  '日常',
  '热血',
  '机战',
  '游戏',
  '情色',
  '搞笑',
  '恋爱',
  '后宫',
  '百合',
  '基腐',
  '致郁',
  '异世界',
  '泡面',
  '战斗',
  '加拿大',
  '香港',
  '台湾',
  '韩国',
  '印度',
  '德国',
  '法国',
  '英国',
  '意大利'
] as const
export const GYING_FILTER_GENRE = [
  '剧情',
  '科幻',
  '动作',
  '喜剧',
  '爱情',
  '冒险',
  '儿童',
  '歌舞',
  '音乐',
  '奇幻',
  '动画',
  '恐怖',
  '惊悚',
  '丧尸',
  '战争',
  '传记',
  '纪录',
  '犯罪',
  '悬疑',
  '西部',
  '灾难',
  '古装',
  '武侠',
  '家庭',
  '短片',
  '校园',
  '文艺',
  '运动',
  '青春',
  '同性',
  '励志',
  '人性',
  '美食',
  '女性',
  '治愈',
  '历史',
  '真人秀',
  '脱口秀'
]
export const GYING_FILTER_GENRE_AC = [
  '剧情',
  '萌系',
  '科幻',
  '日常',
  '战斗',
  '战争',
  '热血',
  '机战',
  '游戏',
  '搞笑',
  '恋爱',
  '后宫',
  '百合',
  '基腐',
  '冒险',
  '儿童',
  '歌舞',
  '音乐',
  '奇幻',
  '恐怖',
  '惊悚',
  '犯罪',
  '悬疑',
  '西部',
  '灾难',
  '古装',
  '武侠',
  '泡面',
  '校园',
  '运动',
  '青春',
  '美食',
  '治愈',
  '致郁',
  '励志',
  '历史',
  '纪录',
  '异世界'
]
export const GYING_FILTER_YEAR = [
  {
    key: '20年代',
    value: 120
  },
  {
    key: '10年代',
    value: 110
  },
  {
    key: '00年代',
    value: 100
  },
  {
    key: '90年代',
    value: 90
  },
  {
    key: '80年代',
    value: 80
  },
  {
    key: '70年代',
    value: 70
  },
  {
    key: '60年代',
    value: 60
  },
  {
    key: '更早',
    value: 1
  }
]
export const GYING_FILTER_REGION = [
  '大陆',
  '香港',
  '台湾',
  '亚洲',
  '海外',
  '欧美',
  '美国',
  '日本',
  '韩国',
  '英国',
  '法国',
  '德国',
  '印度',
  '泰国',
  '瑞典',
  '巴西',
  '加拿大',
  '俄罗斯',
  '意大利',
  '西班牙',
  '澳大利亚'
]
export const GYING_FILTER_LANG = [
  '英语',
  '法语',
  '国语',
  '粤语',
  '日语',
  '韩语',
  '泰语',
  '德语',
  '俄语',
  '闽南语',
  '丹麦语',
  '波兰语',
  '瑞典语',
  '印地语',
  '挪威语',
  '意大利语',
  '西班牙语',
  '无对白'
]
export const GYING_QUALITY_TAG = ['720P', '1080P', '4K', '3D', 'BD', 'HDR', 'DV', '原盘']
export const GYING_SORT_TAG = [
  {
    key: '更新时间',
    value: 'uptime'
  },
  {
    key: '首播时间',
    value: 'date'
  },
  {
    key: '评分最高',
    value: 'score'
  },
  {
    key: '评分人数',
    value: 'number'
  },
  {
    key: '评分总人数',
    value: 'numbers'
  },
  {
    key: '综合评分',
    value: 'cscore'
  }
]
