'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { AppBackground } from '@/types'

export interface AppState {
  background: AppBackground
  setBackground: (background: AppBackground) => void
}

export const useAppStore = create<AppState>()(
  persist(
    set => ({
      background: 'default',
      setBackground: background => set({ background })
    }),
    {
      name: 't_a_m_s',
      partialize: state => ({ background: state.background }),
      version: 1,
      skipHydration: true
    }
  )
)
