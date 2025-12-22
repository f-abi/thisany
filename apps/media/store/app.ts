'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { AppBackground } from '@/types'

export interface AppState {
  background: AppBackground
  setBackground: (background: AppBackground) => void
  playerHistory: Record<string, number>
  setPlayerHistory: (history: Record<string, number>) => void
}

export const useAppStore = create<AppState>()(
  persist(
    set => ({
      background: 'default',
      setBackground: background => set({ background }),
      playerHistory: {},
      setPlayerHistory: history => set({ playerHistory: history })
    }),
    {
      name: 't_a_m_s',
      partialize: state => ({ background: state.background, playerHistory: state.playerHistory }),
      version: 1,
      skipHydration: true
    }
  )
)
