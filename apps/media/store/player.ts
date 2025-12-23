'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PlayerState {
  progress: Record<string, number>
  setProgress: (progress: Record<string, number>) => void
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    set => ({
      progress: {},
      setProgress: progress => set({ progress })
    }),
    {
      name: '__player',
      partialize: state => ({ progress: state.progress }),
      version: 1,
      skipHydration: true
    }
  )
)
