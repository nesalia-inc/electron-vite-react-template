import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  // User preferences
  language: string
  setLanguage: (language: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language })
    }),
    {
      name: 'app-storage'
    }
  )
)
