import { BASE_COOKIE, GYING_API, USER_AGENT } from './constants'
import { encodeFormData } from './utils'

interface DynamicCookiesCache {
  /**
   * 浏览器校验
   *
   * string  开启了人机验证
   * thisany 未开启人机验证（访问主页能直接返回用户身份不需要验证）六小时内不验证
   */
  browserVerified?: string | 'thisany'
  expirationAt?: number
}

const dynamicCookies: DynamicCookiesCache = {}
let dynamicCookiesPromise: Promise<string> | null = null

/**
 * 判断缓存是否有效（提前 1 小时失效）
 */
const isCacheValid = (): boolean => {
  if (!dynamicCookies.browserVerified) return false
  if (!dynamicCookies.expirationAt) return false
  return dynamicCookies.expirationAt > Date.now() + 60 * 60 * 1000
}

/**
 * 解析 _obj.header JSON
 */
const parseHeaderCheck = (html: string): { n: string } | null => {
  const match = html.match(/_obj\.header\s*=\s*(\{.*?\});/s)
  if (!match) return null

  try {
    return JSON.parse(match[1])
  } catch {
    return null
  }
}

async function getChallengeId(cookie: string) {
  const powResponse = await fetch(`${GYING_API}res/pow`, {
    headers: {
      'User-Agent': USER_AGENT,
      Referer: `${GYING_API}`,
      Cookie: cookie
    }
  })

  if (!powResponse.ok) throw new Error('请求 Pow 失败')

  const { N, x, t } = (await powResponse.json()) as { N: string; x: string; t: number }
  const bigN = BigInt('0x' + N)
  let y = BigInt('0x' + x)
  const steps = t | 0
  const chunk = Math.max(64, Math.floor(steps / 50))
  // const t0 = performance.now();
  for (let i = 0; i < steps; i += chunk) {
    const end = Math.min(steps, i + chunk)
    for (let j = i; j < end; j++) y = (y * y) % bigN
    await new Promise(r => setTimeout(r, 0))
  }

  const challengeIdResponse = await fetch(`${GYING_API}res/pow`, {
    method: 'POST',
    headers: {
      'User-Agent': USER_AGENT,
      Referer: GYING_API,
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookie
    },
    body: encodeFormData({
      y: y.toString(16)
    })
  })

  if (!challengeIdResponse.ok) {
    throw new Error('请求 challengeId 失败')
  }

  const result = (await challengeIdResponse.json()) as {
    challenge_id: string
    success: boolean
  }

  if (!result.success) {
    throw new Error('获取 challengeId 失败')
  }

  const browserVerified = challengeIdResponse.headers
    .getSetCookie()
    .map(item => item.split(';')[0])
    .find(item => item.startsWith('browser_verified='))
    ?.slice('browser_verified='.length)

  if (!browserVerified) {
    throw new Error('未获取到 browser_verified')
  }

  return browserVerified
}

/**
 * 获取请求Cookie
 */
export const getCookies = async (): Promise<string> => {
  // 1. 使用有效缓存
  if (isCacheValid()) {
    return dynamicCookies.browserVerified === 'thisany'
      ? BASE_COOKIE
      : `${BASE_COOKIE} browser_verified=${dynamicCookies.browserVerified}`
  }

  // 2. 已有刷新中的 Promise，等待它
  if (dynamicCookiesPromise) return dynamicCookiesPromise

  // 3. 刷新 Cookie
  dynamicCookiesPromise = (async () => {
    try {
      const response = await fetch(GYING_API, {
        method: 'GET',
        mode: 'no-cors',
        headers: {
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': USER_AGENT
        }
      })

      if (!response.ok) throw new Error('请求 首页 失败')

      const html = await response.text()

      let cookie: string
      // 是否需要验证
      const header = parseHeaderCheck(html)
      if (header?.n === 'thisany') {
        // 不需要验证 缓存 6 小时
        dynamicCookies.browserVerified = 'thisany'
        dynamicCookies.expirationAt = Date.now() + 6 * 60 * 60 * 1000
        return BASE_COOKIE
      } else {
        cookie = response.headers
          .getSetCookie()
          .map(item => item.split(';')[0])
          .join('; ')
        // console.log(`[初始cookie]:${cookie}`)
      }

      const verified = await getChallengeId(cookie)

      // 缓存结果（10 小时）
      dynamicCookies.browserVerified = verified
      dynamicCookies.expirationAt = Date.now() + 10 * 60 * 60 * 1000

      return `${BASE_COOKIE} browser_verified=${verified}`
    } finally {
      // 确保 Promise 在结束时被清空（无论成功失败）
      dynamicCookiesPromise = null
    }
  })()

  return dynamicCookiesPromise
}
