'use client'

import { useEffect } from 'react'
import { HoleBackground } from '@/components/animate-ui/components/backgrounds/hole'
import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars'
import { HexagonBackground } from '@/components/animate-ui/components/backgrounds/hexagon'
import { FireworksBackground } from '@/components/animate-ui/components/backgrounds/fireworks'
import { BubbleBackground } from '@/components/animate-ui/components/backgrounds/bubble'
import { GravityStarsBackground } from '@/components/animate-ui/components/backgrounds/gravity-stars'
import { useAppStore } from '@/store/app'

interface BackgroundProps {
  className: string
}

const appBackgroundConfig = {
  default: ({ className }: BackgroundProps) => <HoleBackground className={className} />,
  hole: ({ className }: BackgroundProps) => <HoleBackground className={className} />,
  stars: ({ className }: BackgroundProps) => <StarsBackground className={className} />,
  hexagon: ({ className }: BackgroundProps) => <HexagonBackground className={className} />,
  fireworks: ({ className }: BackgroundProps) => <FireworksBackground className={className} />,
  bubble: ({ className }: BackgroundProps) => <BubbleBackground className={className} />,
  'gravity-stars': ({ className }: BackgroundProps) => (
    <GravityStarsBackground className={className} />
  )
}

function Background() {
  const { background } = useAppStore()
  const renderBackground = appBackgroundConfig[background]

  useEffect(() => {
    useAppStore.persist.rehydrate()
  }, [])

  if (!renderBackground) return null

  return renderBackground({
    className: 'fixed inset-0 z-[-1] size-full transform-gpu'
  })
}

export { Background }
