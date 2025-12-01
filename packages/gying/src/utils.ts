import { GYING_TAG } from './constants'
import { Play, PowSolveOptions, PowSolveResult } from './types'

function hexToInt32Array(hex: string): Int32Array {
  if (hex.length % 8 !== 0) {
    throw new Error('Hex string length must be a multiple of 8 for Int32Array conversion')
  }
  const len = hex.length / 2
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
  }
  const int32Arr = new Int32Array(len / 4)
  const view = new DataView(bytes.buffer)
  for (let i = 0; i < int32Arr.length; i++) {
    int32Arr[i] = view.getInt32(i * 4, false)
  }
  return int32Arr
}

function int32ArrayEquals(a: Int32Array, b: Int32Array): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

function sha256(msg: string) {
  const K = new Int32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ])
  const SHIFT = [24, 16, 8, 0]
  const EXTRA = [-0x80000000, 0x800000, 0x8000, 0x80]
  const _w = new Int32Array(64)
  const outInts = new Int32Array(8)
  const n = msg.length | 0
  if (n > 64) throw new Error('Input too long (max 64 bytes)')
  const w = _w
  const Kloc = K
  const SHIFTloc = SHIFT
  const EXTRAloc = EXTRA
  for (let t = 0; t < 16; t++) w[t] = 0
  for (let t = 0; t < n; t++) w[t >>> 2] |= (msg.charCodeAt(t) & 0xff) << SHIFTloc[t & 3]
  w[n >>> 2] |= EXTRAloc[n & 3]
  w[14] = n >>> 29
  w[15] = (n << 3) >>> 0
  let a = 0x6a09e667 | 0,
    b = 0xbb67ae85 | 0,
    c = 0x3c6ef372 | 0,
    d = 0xa54ff53a | 0
  let e = 0x510e527f | 0,
    f = 0x9b05688c | 0,
    g = 0x1f83d9ab | 0,
    h = 0x5be0cd19 | 0
  for (let i = 0; i < 64; i += 4) {
    let wi0 = w[i],
      wi1 = w[i + 1],
      wi2 = w[i + 2],
      wi3 = w[i + 3]
    const Ki0 = Kloc[i],
      Ki1 = Kloc[i + 1],
      Ki2 = Kloc[i + 2],
      Ki3 = Kloc[i + 3]
    if (i >= 16) {
      let x15 = w[i - 15],
        x2 = w[i - 2]
      let s0 = ((x15 >>> 7) | (x15 << 25)) ^ ((x15 >>> 18) | (x15 << 14)) ^ (x15 >>> 3)
      let s1 = ((x2 >>> 17) | (x2 << 15)) ^ ((x2 >>> 19) | (x2 << 13)) ^ (x2 >>> 10)
      wi0 = (w[i - 16] + s0 + w[i - 7] + s1) | 0
      w[i] = wi0
      x15 = w[i - 14]
      x2 = w[i - 1]
      s0 = ((x15 >>> 7) | (x15 << 25)) ^ ((x15 >>> 18) | (x15 << 14)) ^ (x15 >>> 3)
      s1 = ((x2 >>> 17) | (x2 << 15)) ^ ((x2 >>> 19) | (x2 << 13)) ^ (x2 >>> 10)
      wi1 = (w[i - 15] + s0 + w[i - 6] + s1) | 0
      w[i + 1] = wi1
      x15 = w[i - 13]
      x2 = w[i]
      s0 = ((x15 >>> 7) | (x15 << 25)) ^ ((x15 >>> 18) | (x15 << 14)) ^ (x15 >>> 3)
      s1 = ((x2 >>> 17) | (x2 << 15)) ^ ((x2 >>> 19) | (x2 << 13)) ^ (x2 >>> 10)
      wi2 = (w[i - 14] + s0 + w[i - 5] + s1) | 0
      w[i + 2] = wi2
      x15 = w[i - 12]
      x2 = w[i + 1]
      s0 = ((x15 >>> 7) | (x15 << 25)) ^ ((x15 >>> 18) | (x15 << 14)) ^ (x15 >>> 3)
      s1 = ((x2 >>> 17) | (x2 << 15)) ^ ((x2 >>> 19) | (x2 << 13)) ^ (x2 >>> 10)
      wi3 = (w[i - 13] + s0 + w[i - 4] + s1) | 0
      w[i + 3] = wi3
    }
    const s1_0 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7))
    const ch_0 = (e & f) ^ (~e & g)
    const t1_0 = (h + s1_0 + ch_0 + Ki0 + wi0) | 0
    const s0_0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10))
    const maj_0 = (a & b) ^ (a & c) ^ (b & c)
    const t2_0 = (s0_0 + maj_0) | 0
    h = g
    g = f
    f = e
    e = (d + t1_0) | 0
    d = c
    c = b
    b = a
    a = (t1_0 + t2_0) | 0
    const s1_1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7))
    const ch_1 = (e & f) ^ (~e & g)
    const t1_1 = (h + s1_1 + ch_1 + Ki1 + wi1) | 0
    const s0_1 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10))
    const maj_1 = (a & b) ^ (a & c) ^ (b & c)
    const t2_1 = (s0_1 + maj_1) | 0
    h = g
    g = f
    f = e
    e = (d + t1_1) | 0
    d = c
    c = b
    b = a
    a = (t1_1 + t2_1) | 0
    const s1_2 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7))
    const ch_2 = (e & f) ^ (~e & g)
    const t1_2 = (h + s1_2 + ch_2 + Ki2 + wi2) | 0
    const s0_2 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10))
    const maj_2 = (a & b) ^ (a & c) ^ (b & c)
    const t2_2 = (s0_2 + maj_2) | 0
    h = g
    g = f
    f = e
    e = (d + t1_2) | 0
    d = c
    c = b
    b = a
    a = (t1_2 + t2_2) | 0
    const s1_3 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7))
    const ch_3 = (e & f) ^ (~e & g)
    const t1_3 = (h + s1_3 + ch_3 + Ki3 + wi3) | 0
    const s0_3 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10))
    const maj_3 = (a & b) ^ (a & c) ^ (b & c)
    const t2_3 = (s0_3 + maj_3) | 0
    h = g
    g = f
    f = e
    e = (d + t1_3) | 0
    d = c
    c = b
    b = a
    a = (t1_3 + t2_3) | 0
  }
  outInts[0] = (0x6a09e667 + a) | 0
  outInts[1] = (0xbb67ae85 + b) | 0
  outInts[2] = (0x3c6ef372 + c) | 0
  outInts[3] = (0xa54ff53a + d) | 0
  outInts[4] = (0x510e527f + e) | 0
  outInts[5] = (0x9b05688c + f) | 0
  outInts[6] = (0x1f83d9ab + g) | 0
  outInts[7] = (0x5be0cd19 + h) | 0
  return outInts
}

export async function powSolve({
  challenge,
  diff,
  salt
}: PowSolveOptions): Promise<PowSolveResult> {
  async function mineOnMainThread(
    challenge: string[],
    diff: number,
    salt: string
  ): Promise<PowSolveResult> {
    const remaining = challenge.map(hexToInt32Array)
    const solvedIndices = new Set<number>()
    const nonceArr: number[] = Array(challenge.length).fill(null)
    let nonce = 0,
      hashes = 0
    const startTime = Date.now()
    for (;;) {
      const hash = sha256(nonce + salt)
      hashes++
      for (let i = 0; i < remaining.length; i++) {
        if (!solvedIndices.has(i) && int32ArrayEquals(hash, remaining[i])) {
          solvedIndices.add(i)
          nonceArr[i] = nonce
        }
      }
      if (solvedIndices.size === challenge.length || nonce >= diff) {
        const duration = (Date.now() - startTime) / 1000
        return {
          nonce: nonceArr,
          hashes,
          duration,
          hashRate: Math.round(hashes / duration),
          method: 'main-thread'
        }
      }
      nonce++
      if (hashes % 1e5 === 0) {
        await new Promise(r => setImmediate(r))
      }
    }
  }
  return await mineOnMainThread(challenge, diff, salt)
}

export function encodeFormData(
  data: Record<string, string | number | Array<string | number>>
): string {
  return Object.keys(data)
    .map(key => {
      const value = data[key]
      if (Array.isArray(value)) {
        return value.map(v => encodeURIComponent(key) + '[]=' + encodeURIComponent(v)).join('&')
      }
      return encodeURIComponent(key) + '=' + encodeURIComponent(value)
    })
    .join('&')
}

/**
 * 计算播放列表
 */
export function calcPlayList(data: Array<Play>): Array<Play> {
  const res = data.map(item => {
    const result: string[] = []
    item.list.forEach(props => {
      if (Array.isArray(props)) {
        const [words, range] = props as unknown as [string[], number | [number, number]]
        const prefix = words[0] ?? '第'
        const suffix = words[1] ?? '集'
        if (Array.isArray(range)) {
          // 如果是范围 [start, end]
          const [start, end] = range
          for (let i = start; i <= end; i++) {
            result.push(`${prefix}${i}${suffix}`)
          }
        } else result.push(`${prefix}${range}${suffix}`)
      } else result.push(props)
    })
    return {
      ...item,
      list: result
    }
  })
  return res
}

/**
 * 标签转文本
 */
export function tagToString(tags: Array<number | string>): string {
  return tags
    .map((tag, i) =>
      i === 0
        ? tag
        : (GYING_TAG[tag as number] ??
          (typeof tag === 'string' ? (tag?.length > 0 ? tag : '') : ''))
    )
    .join(' / ')
}
