'use client'

import 'xgplayer/dist/index.min.css'

import { useEffect, useRef } from 'react'
import Player, { Events, IPluginOptions, Plugin } from 'xgplayer'
import HlsPlugin from 'xgplayer-hls'

import { useAppStore } from '@/store/app'

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
  const { setPlayerHistory } = useAppStore()

  // 播放器实例
  const player = useRef<Player | null>(null)

  useEffect(() => {
    if (!src) return

    player.current = new Player({
      id: 'thisany',
      lang: 'zh-cn',
      pip: true, // 画中画
      autoplay: true, // 自动播放
      isLive: false, // live流
      url: src, // hls 流地址
      // startTime: timeRecording.value[`${src}`] ?? 0, // 播放开始时间
      fluid: true, // 是否启用流式布局，启用流式布局时根据width、height计算播放器宽高比，若width和height不是Number类型，默认使用16:9比例
      download: false, // 显示下载按钮
      plugins: [HlsPlugin, TitlePlugin], // 插件
      hls: {
        preloadTime: 3600 // 默认值
        // maxBufferLength: 3600, // 缓存时长
        // maxMaxBufferLength: 3600, // 最大缓存时长
        // maxBufferSize: 500 * 1024 * 1024 // 缓存太小会导致反复请求
      },
      TitlePlugin: {
        title
      }
    })
    player.current.on(Events.TIME_UPDATE, (data: { currentTime: number }) => {
      console.log(player.current?.plugins.hls.core.speedInfo())
      setPlayerHistory({
        [src]: data.currentTime
      })
    })
    player.current.on(Events.ENDED, () => {
      setPlayerHistory({
        [src]: 0
      })
      endedCallback?.()
    })

    return () => {
      if (player.current) {
        player.current.destroy()
        player.current = null
      }
    }
  }, [src, title, endedCallback, setPlayerHistory])
  return <div id="thisany" />
}

export { MediaPlayer }
