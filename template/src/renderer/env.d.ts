/// <reference types="vite/client" />

interface Window {
  electron: {
    ipcRenderer: {
      send: (channel: string, ...args: unknown[]) => void
      on: (channel: string, func: (...args: unknown[]) => void) => void
      removeListener: (channel: string, func: (...args: unknown[]) => void) => void
      invoke: <T = unknown>(channel: string, ...args: unknown[]) => Promise<T>
    }
  }
  api: {
    getSystemTheme: () => Promise<'dark' | 'light'>
    onThemeChange: (callback: (theme: 'dark' | 'light') => void) => () => void
  }
}
