'use client'

import { AnimatePresence, motion } from 'motion/react'
import { MouseEventHandler, PropsWithChildren, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

interface MaskProps {
  visible: boolean
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement>
}

let activeScrollLocks = 0
const originalStyles = {
  overflow: '',
  bodyPadding: '',
  headerPadding: ''
}

function ScrollGuard() {
  useEffect(() => {
    const header = document.querySelector('header')

    activeScrollLocks++

    if (activeScrollLocks === 1) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

      originalStyles.overflow = document.documentElement.style.overflow
      originalStyles.bodyPadding = document.body.style.paddingRight
      originalStyles.headerPadding = header ? header.style.paddingRight : ''

      document.documentElement.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`

      if (header) {
        const computedPaddingStr = window.getComputedStyle(header).paddingRight
        const computedPadding = computedPaddingStr ? parseFloat(computedPaddingStr) : 0
        header.style.paddingRight = `${computedPadding + scrollbarWidth}px`
      }
    }

    return () => {
      activeScrollLocks--

      if (activeScrollLocks === 0) {
        document.documentElement.style.overflow = originalStyles.overflow
        document.body.style.paddingRight = originalStyles.bodyPadding
        if (header) {
          header.style.paddingRight = originalStyles.headerPadding
        }
      }
    }
  }, [])

  return null
}

function BlurMask({ children, visible, className, onClick }: PropsWithChildren<MaskProps>) {
  const [mounted] = useState(() => typeof window !== 'undefined')

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {visible && (
        <>
          <ScrollGuard />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn('fixed inset-0 z-90 overflow-y-scroll backdrop-blur-sm', className)}
            onClick={onClick}
          >
            <div className="flex min-h-full w-full items-center justify-center p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

export { BlurMask }
