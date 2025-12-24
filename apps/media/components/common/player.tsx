'use client'

import 'xgplayer/dist/index.min.css'

import { Player as GyPlayer } from 'gying'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Player, { Events, IPluginOptions, Plugin } from 'xgplayer'
import HlsPlugin from 'xgplayer-hls'

import { usePlayerStore } from '@/store/player'

const { POSITIONS } = Plugin

class TitlePlugin extends Plugin {
  static override get pluginName() {
    return 'TitlePlugin'
  }
  static override get defaultConfig() {
    return {
      position: POSITIONS.ROOT_TOP
    }
  }
  constructor(args: IPluginOptions) {
    super(args)
  }
  override render() {
    return `<div class="h-full w-full flex items-center text-white font-bold">${this.config.title}</div>`
  }
}

function MediaPlayer({ url, title, dir, bid, select, playlist, page }: GyPlayer) {
  const setProgress = usePlayerStore(state => state.setProgress)

  const router = useRouter()

  const isFull = useSearchParams().get('full')
  const [fullScreen, setFullScreen] = useState<boolean>(false)

  const player = useRef<Player | null>(null)

  useEffect(() => {
    // 水合 播放器存储
    usePlayerStore.persist.rehydrate()

    // 初始化进度条位置
    const progress = usePlayerStore.getState().progress

    // 初始化播放器实例
    player.current = new Player({
      id: 'thisany',
      lang: 'zh-cn',
      pip: true, // 画中画
      autoplay: true, // 自动播放
      isLive: false, // live流
      url, // hls 流地址
      startTime: progress[`${url}`] ?? 0, // 播放开始时间
      fluid: true, // 是否启用流式布局，启用流式布局时根据width、height计算播放器宽高比，若width和height不是Number类型，默认使用16:9比例
      download: false, // 显示下载按钮
      plugins: [HlsPlugin, TitlePlugin], // 插件
      hls: {
        preloadTime: 5 * 60
      },
      TitlePlugin: {
        title
      }
    })

    // 监听记录播放时间
    player.current.on(Events.TIME_UPDATE, (data: { currentTime: number }) => {
      const progress = usePlayerStore.getState().progress
      setProgress({
        ...progress,
        [`${url}`]: data.currentTime
      })
    })
    // 监听播放完毕
    player.current.on(Events.ENDED, () => {
      const progress = usePlayerStore.getState().progress
      setProgress({
        ...progress,
        [`${url}`]: 0
      })
      // 判断是不是最后一集
      if (!(page + 2 > playlist[select].list.length)) {
        // 如果不是 则自动跳转下一集
        router.push(
          `/media/${dir}/${bid}/${playlist[select].i}/${page + 2}?full=${fullScreen ? 'Y' : 'D'}`
        )
      }
    })
    // 监听是否全屏
    player.current.on(Events.FULLSCREEN_CHANGE, isFullscreen => setFullScreen(isFullscreen))

    // 启动播放
    player.current.start()
    // 设置全屏
    if (isFull === 'Y') player.current.getFullscreen()
    return () => {
      if (player.current) {
        player.current.destroy()
        player.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="aspect-video overflow-hidden rounded-lg">
      <div id="thisany" />
    </div>
  )
}

export { MediaPlayer }
