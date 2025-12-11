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
        'fixed top-0 left-0 z-90 flex h-dvh w-dvw items-center justify-center transition-all',
        visible ? 'visible opacity-100' : 'invisible opacity-0',
        className
      )}
      onClick={onClick}
    >
      {children}
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
