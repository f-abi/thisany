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

function BlurMask({ children, visible, className, onClick }: PropsWithChildren<MaskProps>) {
  const [mounted] = useState(() => typeof window !== 'undefined')

  // useEffect(() => {
  //   if (!visible) return

  //   document.addEventListener('wheel', e => e.preventDefault(), { passive: false })
  //   document.addEventListener('touchmove', e => e.preventDefault(), { passive: false })

  //   return () => {
  //     document.removeEventListener('wheel', e => e.preventDefault())
  //     document.removeEventListener('touchmove', e => e.preventDefault())
  //   }
  // }, [visible])

  return (
    mounted &&
    createPortal(
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'fixed top-0 left-0 z-90 flex h-dvh w-dvw items-center justify-center backdrop-blur-sm',
              className
            )}
            onClick={onClick}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )
  )
}

export { BlurMask }
