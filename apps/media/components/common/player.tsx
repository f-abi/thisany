'use client'

import 'xgplayer/dist/index.min.css'

import { useEffect, useRef } from 'react'
import Player, { Events, IPluginOptions, Plugin } from 'xgplayer'
import HlsPlugin, { EVENT } from 'xgplayer-hls'

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

function MediaPlayer({
  src,
  title,
  endedCallback
}: {
  src: string
  title: string
  endedCallback?: () => void
}) {
  const { progress, setProgress } = usePlayerStore()

  // 播放器实例
  const player = useRef<Player | null>(null)

  function init() {
    console.log(progress)
    console.log(progress[src])
    player.current = new Player({
      id: 'thisany',
      lang: 'zh-cn',
      pip: true, // 画中画
      autoplay: true, // 自动播放
      isLive: false, // live流
      url: src, // hls 流地址
      startTime: progress[`${src}`] ?? 0, // 播放开始时间
      fluid: true, // 是否启用流式布局，启用流式布局时根据width、height计算播放器宽高比，若width和height不是Number类型，默认使用16:9比例
      download: false, // 显示下载按钮
      plugins: [HlsPlugin, TitlePlugin], // 插件
      hls: {
        startTime: progress[`${src}`] ?? 0,
        preloadTime: 5 * 60,
        bufferBehind: 1
      },
      TitlePlugin: {
        title
      }
    })
    player.current.on(Events.TIME_UPDATE, (data: { currentTime: number }) => {
      setProgress({
        ...progress,
        [`${src}`]: data.currentTime
      })
    })
    player.current.on(Events.ENDED, () => {
      setProgress({
        ...progress,
        [`${src}`]: 0
      })
      endedCallback?.()
    })
  }

  useEffect(() => {
    usePlayerStore.persist.rehydrate()
    init()
    return () => {
      if (player.current) {
        player.current.destroy()
        player.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <div id="thisany" />
}

export { MediaPlayer }
