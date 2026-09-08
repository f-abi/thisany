import { GYING_TAG } from './constants'
import { Play } from './types'

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
