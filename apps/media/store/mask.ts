'use client'

import { create } from 'zustand'
import { ReactNode } from 'react'

interface MaskState {
  visible: boolean
  content: ReactNode | null
  show: (content: ReactNode) => void
  hide: () => void
}

export const useMaskStore = create<MaskState>(set => ({
  visible: false,
  content: null,
  show: content => set({ visible: true, content }),
  hide: () => set({ visible: false, content: null })
}))
