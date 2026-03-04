import { createContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'dark' | 'light' | 'system'

export type ThemeProviderProps = {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: 'dark' | 'light'
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  actualTheme: 'light'
}

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme'
}: ThemeProviderProps): JSX.Element {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(storageKey)
    return (stored as Theme) || defaultTheme
  })

  const [actualTheme, setActualTheme] = useState<'dark' | 'light'>('light')

  // Get initial system theme from Electron
  useEffect(() => {
    const getSystemTheme = async (): Promise<void> => {
      try {
        if (window.api?.getSystemTheme) {
          const systemTheme = await window.api.getSystemTheme()
          setActualTheme(systemTheme)
        } else {
          // Fallback for browser
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          setActualTheme(isDark ? 'dark' : 'light')
        }
      } catch {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setActualTheme(isDark ? 'dark' : 'light')
      }
    }

    getSystemTheme()
  }, [])

  // Listen for system theme changes from Electron
  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const initThemeListener = async (): Promise<void> => {
      if (window.api?.onThemeChange) {
        unsubscribe = window.api.onThemeChange((newTheme) => {
          if (theme === 'system') {
            setActualTheme(newTheme)
          }
        })
      }
    }

    initThemeListener()

    // Also listen to browser media query changes as fallback
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent): void => {
      if (theme === 'system') {
        setActualTheme(e.matches ? 'dark' : 'light')
      }
    }
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [theme])

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      root.classList.add(actualTheme)
      return
    }

    root.classList.add(theme)
    setActualTheme(theme === 'dark' ? 'dark' : 'light')
  }, [theme, actualTheme])

  const value = {
    theme,
    setTheme: (newTheme: Theme): void => {
      localStorage.setItem(storageKey, newTheme)
      setThemeState(newTheme)

      // Update actualTheme immediately if not system
      if (newTheme !== 'system') {
        setActualTheme(newTheme === 'dark' ? 'dark' : 'light')
      } else {
        // Re-check system theme
        const getSystemTheme = async (): Promise<void> => {
          try {
            if (window.api?.getSystemTheme) {
              const systemTheme = await window.api.getSystemTheme()
              setActualTheme(systemTheme)
            } else {
              const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
              setActualTheme(isDark ? 'dark' : 'light')
            }
          } catch {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setActualTheme(isDark ? 'dark' : 'light')
          }
        }
        getSystemTheme()
      }
    },
    actualTheme
  }

  return (
    <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
  )
}
