'use client'

import { cn } from '@/lib/utils'
import { MouseEventHandler, PropsWithChildren, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useMaskStore } from '@/store/mask'

interface MaskProps {
  visible: boolean
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement>
}

function BlurMask({ children, visible, className, onClick }: PropsWithChildren<MaskProps>) {
  useEffect(() => {
    if (!visible) return

    const preventDefault = (e: Event) => {
      e.preventDefault()
    }

    const options = { passive: false } as AddEventListenerOptions

    document.addEventListener('wheel', preventDefault, options)
    document.addEventListener('touchmove', preventDefault, options)

    return () => {
      document.removeEventListener('wheel', preventDefault, options)
      document.removeEventListener('touchmove', preventDefault, options)
    }
  }, [visible])

  return (
    <div
      className={cn(
        'glass fixed top-0 left-0 z-90 h-dvh w-dvw rounded-none transition-all',
        visible ? 'visible opacity-100 backdrop-blur-md' : 'invisible opacity-0 backdrop-blur-none',
        className
      )}
      onClick={onClick}
    >
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  )
}

function Mask() {
  const { visible, content, hide } = useMaskStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  return createPortal(
    <BlurMask visible={visible} onClick={hide}>
      {content}
    </BlurMask>,
    document.body
  )
}

export { Mask }
