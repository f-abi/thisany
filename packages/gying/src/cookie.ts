import { BASE_COOKIE, GYING_API, USER_AGENT } from './constants'
import { PowSolveOptions } from './types'
import { encodeFormData, powSolve } from './utils'

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

/**
 * 解析 PoW JSON
 */
const parsePowJson = (html: string): ({ id: string } & PowSolveOptions) | null => {
  const match = html.match(/const json=(\{[\s\S]*?\});/)
  if (!match) return null

  try {
    return JSON.parse(match[1]) as { id: string } & PowSolveOptions
  } catch {
    return null
  }
}

/**
 * 获取请求Cookie
 */
export const getCookies = async (): Promise<string> => {
  // 1. 使用有效缓存
  if (isCacheValid()) {
    return dynamicCookies.browserVerified === 'thisany'
      ? BASE_COOKIE
      : `${BASE_COOKIE};browser_verified=${dynamicCookies.browserVerified}`
  }

  // 2. 已有刷新中的 Promise，等待它
  if (dynamicCookiesPromise) return dynamicCookiesPromise

  // 3. 刷新 Cookie
  dynamicCookiesPromise = (async () => {
    try {
      const response = await fetch(GYING_API, {
        method: 'GET',
        headers: {
          'User-Agent': USER_AGENT,
          Cookie: BASE_COOKIE
        }
      })

      const html = await response.text()

      // 是否需要验证
      const header = parseHeaderCheck(html)
      if (header?.n === 'thisany') {
        // 不需要验证 缓存 6 小时
        dynamicCookies.browserVerified = 'thisany'
        dynamicCookies.expirationAt = Date.now() + 6 * 60 * 60 * 1000
        return BASE_COOKIE
      }

      // 提取 PoW 参数
      const json = parsePowJson(html)
      if (!json) throw new Error('授权解析错误')

      // 执行 PoW
      const { nonce } = await powSolve({
        challenge: json.challenge,
        diff: json.diff,
        salt: json.salt
      })

      // 提交验证
      const verifyResponse = await fetch(GYING_API, {
        method: 'POST',
        headers: {
          'User-Agent': USER_AGENT,
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: BASE_COOKIE
        },
        credentials: 'same-origin',
        body: encodeFormData({
          action: 'verify',
          id: json.id,
          nonce
        })
      })

      const verifyData = await verifyResponse.json()
      if (!verifyData.success) throw new Error('授权错误')

      // 缓存结果（24 小时）
      dynamicCookies.browserVerified = json.id
      dynamicCookies.expirationAt = Date.now() + 24 * 60 * 60 * 1000

      return `${BASE_COOKIE};browser_verified=${json.id}`
    } finally {
      // 确保 Promise 在结束时被清空（无论成功失败）
      dynamicCookiesPromise = null
    }
  })()

  return dynamicCookiesPromise
}
